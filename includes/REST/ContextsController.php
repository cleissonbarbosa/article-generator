<?php

namespace ArticleGen\CBPlugin\REST;

use ArticleGen\CBPlugin\Abstracts\RESTController;
use ArticleGen\CBPlugin\Contexts\Context;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use WP_Error;

/**
 * API ContextsController class.
 *
 * @since 0.3.0
 */
class ContextsController extends RESTController {

    /**
     * Route base.
     *
     * @var string
     */
    protected $base = 'contexts';

    /**
     * Register all routes related with carts.
     *
     * @return void
     */
    public function register_routes() {
        register_rest_route(
            $this->namespace, '/' . $this->base . '/',
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_items' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                    'args'                => $this->get_collection_params(),
                    'schema'              => [ $this, 'get_item_schema' ],
                ],
                [
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => [ $this, 'create_item' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                    'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::CREATABLE ),
                ],
                [
                    'methods'             => WP_REST_Server::DELETABLE,
                    'callback'            => [ $this, 'delete_items' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                    'args'                => [
                        'ids' => [
                            'type'        => 'array',
                            'default'     => [],
                            'description' => __( 'Post IDs which will be deleted.', 'article-gen' ),
                        ],
                    ],
                ],
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->base . '/(?P<id>[a-zA-Z0-9-]+)',
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_item' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                    'args'                => $this->get_collection_params(),
                ],
                [
                    'methods'             => WP_REST_Server::EDITABLE,
                    'callback'            => [ $this, 'update_item' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                    'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),
                ],
            ]
        );
    }

    /**
     * Retrieves a collection of context items.
     *
     * @since 0.3.0
     *
     * @param WP_REST_Request $request Full details about the request.
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function get_items( $request ): ?WP_REST_Response {
        $args   = [];
        $data   = [];
        $params = $this->get_collection_params();

        foreach ( $params as $key => $value ) {
            if ( isset( $request[ $key ] ) ) {
                $args[ $key ] = $request[ $key ];
            }
        }

        $contexts = article_generator()->contexts->all( $args );
        foreach ( $contexts as $context ) {
            $response = $this->prepare_item_for_response( $context, $request );
            $data[]   = $this->prepare_response_for_collection( $response );
        }

        $args['count'] = 1;
        $total         = article_generator()->contexts->all( $args );
        $max_pages     = ceil( $total / (int) $args['limit'] );
        $response      = rest_ensure_response( $data );

        $response->header( 'X-WP-Total', (int) $total );
        $response->header( 'X-WP-TotalPages', (int) $max_pages );

        return $response;
    }

    /**
     * Retrieves a collection of context items.
     *
     * @since 0.3.0
     *
     * @param WP_REST_Request $request Full details about the request.
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function get_item( $request ) {
        if ( is_numeric( $request['id'] ) ) {
            $args = [
                'key'   => 'id',
                'value' => absint( $request['id'] ),
            ];
        } else {
            $args = [
                'key'   => 'slug',
                'value' => sanitize_text_field( wp_unslash( $request['id'] ) ),
            ];
        }

        $context = article_generator()->contexts->get( $args );

        if ( ! $context ) {
            return new WP_Error( 'article_gen_rest_context_not_found', __( 'Context not found. May be context has been deleted or you don\'t have access to that.', 'article-gen' ), [ 'status' => 404 ] );
        }

        // Prepare response.
        $context = $this->prepare_item_for_response( $context, $request );

        return rest_ensure_response( $context );
    }

    /**
     * Create new context.
     *
     * @since 0.3.0
     *
     * @param WP_Rest_Request $request
     *
     * @return WP_REST_Response|WP_Error
     */
    public function create_item( $request ) {
        if ( ! empty( $request['id'] ) ) {
            return new WP_Error(
                'article_gen_rest_email_template_exists',
                __( 'Cannot create existing email template.', 'article-gen' ),
                array( 'status' => 400 )
            );
        }

        $prepared_data = $this->prepare_item_for_database( $request );

        if ( is_wp_error( $prepared_data ) ) {
            return $prepared_data;
        }

        // Insert the context.
        $context_id = article_generator()->contexts->create( $prepared_data );

        if ( is_wp_error( $context_id ) ) {
            return $context_id;
        }

        // Get context after insert to sending response.
        $context = article_generator()->contexts->get(
            [
				'key' => 'id',
				'value' => $context_id,
			]
        );

        $response = $this->prepare_item_for_response( $context, $request );
        $response = rest_ensure_response( $response );

        $response->set_status( 201 );
        $response->header( 'Location', rest_url( sprintf( '%s/%s/%d', $this->namespace, $this->rest_base, $context_id ) ) );

        return $response;
    }

    /**
     * Update a context.
     *
     * @since 0.3.0
     *
     * @param WP_Rest_Request $request
     *
     * @return WP_REST_Response|WP_Error
     */
    public function update_item( $request ) {
        if ( empty( $request['id'] ) ) {
            return new WP_Error(
                'article_gen_rest_email_template_exists',
                __( 'Invalid Context ID.', 'article-gen' ),
                array( 'status' => 400 )
            );
        }

        $prepared_data = $this->prepare_item_for_database( $request );

        if ( is_wp_error( $prepared_data ) ) {
            return $prepared_data;
        }

        // Update the context.
        $context_id = absint( $request['id'] );
        $context_id = article_generator()->contexts->update( $prepared_data, $context_id );

        if ( is_wp_error( $context_id ) ) {
            return $context_id;
        }

        // Get context after insert to sending response.
        $context = article_generator()->contexts->get(
            [
				'key' => 'id',
				'value' => $context_id,
			]
        );

        $response = $this->prepare_item_for_response( $context, $request );
        $response = rest_ensure_response( $response );

        $response->set_status( 201 );
        $response->header( 'Location', rest_url( sprintf( '%s/%s/%d', $this->namespace, $this->rest_base, $context_id ) ) );

        return $response;
    }

    /**
     * Delete single or multiple contexts.
     *
     * @since 0.3.0
     *
     * @param array $request
     *
     * @return WP_REST_Response|WP_Error
     */
    public function delete_items( $request ) {
        if ( ! isset( $request['ids'] ) ) {
            return new WP_Error( 'no_ids', __( 'No context ids found.', 'article-gen' ), [ 'status' => 400 ] );
        }

        $deleted = article_generator()->contexts->delete( $request['ids'] );

        if ( $deleted ) {
            $message = __( 'Contexts deleted successfully.', 'article-gen' );

            return rest_ensure_response(
                [
					'message' => $message,
					'total' => $deleted,
				]
            );
        }

        return new WP_Error( 'no_context_deleted', __( 'No context deleted. Context has already been deleted. Please try again.', 'article-gen' ), [ 'status' => 400 ] );
    }

    /**
     * Retrieves the group schema, conforming to JSON Schema.
     *
     * @since 0.3.0
     *
     * @return array
     */
    public function get_item_schema() {
        if ( $this->schema ) {
            return $this->add_additional_fields_schema( $this->schema );
        }

        $schema = [
            '$schema'    => 'http://json-schema.org/draft-04/schema#',
            'title'      => 'context',
            'type'       => 'object',
            'properties' => [
                'id' => [
                    'description' => __( 'ID of the context', 'article-gen' ),
                    'type'        => 'integer',
                    'context'     => [ 'view', 'edit' ],
                    'readonly'    => true,
                ],
                'title' => [
                    'description' => __( 'Context title', 'article-gen' ),
                    'type'        => 'string',
                    'context'     => [ 'view', 'edit' ],
                    'required'    => true,
                    'minLength'   => 1,
                    'arg_options' => [
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                ],
                'slug' => [
                    'description' => __( 'Context slug', 'article-gen' ),
                    'type'        => 'string',
                    'context'     => [ 'view', 'edit' ],
                    'minLength'   => 1,
                    'arg_options' => [
                        'sanitize_callback' => [ $this, 'sanitize_context_slug' ],
                    ],
                ],
                'description' => [
                    'description' => __( 'Context description', 'article-gen' ),
                    'type'        => 'string',
                    'context'     => [ 'view', 'edit' ],
                    'required'    => true,
                    'minLength'   => 1,
                ],
                'context_type_id' => [
                    'description' => __( 'Context type', 'article-gen' ),
                    'type'        => 'integer',
                    'context'     => [ 'view', 'edit' ],
                    'required'    => true,
                    'arg_options' => [
                        'sanitize_callback' => 'absint',
                    ],
                ],
                'company_id' => [
                    'description' => __( 'Company', 'article-gen' ),
                    'type'        => 'integer',
                    'context'     => [ 'view', 'edit' ],
                    'required'    => true,
                    'arg_options' => [
                        'sanitize_callback' => 'absint',
                    ],
                ],
                'is_active' => [
                    'description' => __( 'Context status', 'article-gen' ),
                    'type'        => 'boolean',
                    'context'     => [ 'view', 'edit' ],
                    'required'    => true,
                    'arg_options' => [
                        'sanitize_callback' => 'absint',
                    ],
                ],
                'created_by' => [
                    'description' => __( 'Created by user', 'article-gen' ),
                    'type'        => 'integer',
                    'context'     => [ 'view', 'edit' ],
                    'arg_options' => [
                        'sanitize_callback' => 'absint',
                    ],
                ],
                'updated_by' => [
                    'description' => __( 'Updated by user', 'article-gen' ),
                    'type'        => 'integer',
                    'context'     => [ 'view', 'edit' ],
                    'arg_options' => [
                        'sanitize_callback' => 'absint',
                    ],
                ],
                'created_at' => [
                    'description' => __( 'Created at time', 'article-gen' ),
                    'type'        => 'string',
                    'context'     => [ 'view', 'edit' ],
                    'format'      => 'date-time',
                    'readonly'    => true,
                ],
                'updated_at' => [
                    'description' => __( 'Updated at time', 'article-gen' ),
                    'type'        => 'string',
                    'context'     => [ 'view', 'edit' ],
                    'format'      => 'date-time',
                    'readonly'    => true,
                ],
                'deleted_at' => [
                    'description' => __( 'Deleted at time', 'article-gen' ),
                    'type'        => 'string',
                    'context'     => [ 'view', 'edit' ],
                    'format'      => 'date-time',
                    'readonly'    => true,
                ],
            ],
        ];

        $this->schema = $schema;

        return $this->add_additional_fields_schema( $this->schema );
    }

    /**
     * Prepares a single email template for create or update.
     *
     * @since 0.3.0
     *
     * @param WP_REST_Request $request Request object.
     *
     * @return object|WP_Error
     */
    protected function prepare_item_for_database( $request ) {
        $data = [];
        $data['title']       = $request['title'];
        $data['slug']        = $this->generate_unique_slug( $request );
        $data['description'] = $request['description'];
        $data['company_id']  = $request['company_id'];
        $data['is_active']   = $request['is_active'];
        $data['context_type_id'] = $request['context_type_id'];

        if ( empty( $request['id'] ) ) {
            $data['created_by'] = empty( $request['created_by'] ) ? get_current_user_id() : absint( $request['created_by'] );
            $data['created_at']  = empty( $request['created_at'] ) ? current_datetime()->format( 'Y-m-d H:i:s' ) : $request['created_at'];
        } else {
            $data['updated_by'] = empty( $request['updated_by'] ) ? get_current_user_id() : absint( $request['updated_by'] );
            $data['updated_at']  = empty( $request['updated_at'] ) ? current_datetime()->format( 'Y-m-d H:i:s' ) : $request['updated_at'];
        }

        return $data;
    }

    /**
     * Prepares the item for the REST response.
     *
     * @since 0.3.0
     *
     * @param Context            $item    WordPress representation of the item
     * @param WP_REST_Request $request request object
     *
     * @return WP_Error|WP_REST_Response
     */
    public function prepare_item_for_response( $item, $request ) {
        $data = [];

        $data = Context::to_array( $item );

        $data = $this->prepare_response_for_collection( $data );

        $context = ! empty( $request['context'] ) ? $request['context'] : 'view';
        $data    = $this->filter_response_by_context( $data, $context );

        $response = rest_ensure_response( $data );
        $response->add_links( $this->prepare_links( $item ) );

        return $response;
    }

    /**
     * Prepares links for the request.
     *
     * @since 0.3.0
     *
     * @param WP_Post $post post object
     *
     * @return array links for the given data.
     */
    protected function prepare_links( $item ): array {
        $base = sprintf( '%s/%s%s', $this->namespace, $this->rest_base, $this->base );

        $id = is_object( $item ) ? $item->id : $item['id'];

        $links = [
            'self' => [
                'href' => rest_url( trailingslashit( $base ) . $id ),
            ],
            'collection' => [
                'href' => rest_url( $base ),
            ],
        ];

        return $links;
    }

    /**
     * Sanitize context slug for uniqueness.
     *
     * @since 0.3.0
     *
     * @param string $slug
     * @param WP_REST_Request $request
     *
     * @return WP_Error|string
     */
    public function sanitize_context_slug( $slug, $request ) {
        global $wpdb;

        $slug          = sanitize_title( $slug );
        $id            = isset( $request['id'] ) ? $request['id'] : 0;
        $args['count'] = 1;

        if ( ! empty( $id ) ) {
            $args['where'][] = $wpdb->prepare( 'id != %d AND slug = %s', $id, $slug );
        } else {
            $args['where'][] = $wpdb->prepare( 'slug = %s', $slug );
        }

        $total_found = article_generator()->contexts->all( $args );

        if ( $total_found > 0 ) {
            return new WP_Error(
                'article_gen_rest_slug_exists', __( 'Context slug already exists.', 'article-gen' ), [
					'status' => 400,
				]
            );
        }

        return sanitize_title( $slug );
    }

    /**
     * Generator unique slug if no slug is provided.
     *
     * @since 0.3.0
     *
     * @param WP_REST_Request $request
     *
     * @return string
     */
    public function generate_unique_slug( WP_REST_Request $request ) {
        $slug = $request['slug'];

        if ( empty( $slug ) ) {
            $slug = sanitize_title( $request['title'] );
            $slug = str_replace( ' ', '-', $slug );

            // Auto-generate only for create page.
            if ( empty( $request['id'] ) ) {
                $existing_context = article_generator()->contexts->get(
                    [
						'key' => 'slug',
						'value' => $slug,
					]
                );

                // If error, means, there is no slug by this slug
                if ( empty( $existing_context ) ) {
                    return $slug;
                }

                return $this->generate_beautiful_slug( $slug );
            }
        }

        return $slug;
    }

    /**
     * Generator beautiful slug.
     *
     * @since 0.3.1
     *
     * @param string $slug
     * @param integer $i
     *
     * @return string
     */
    public function generate_beautiful_slug( string $slug = '', $i = 1 ): string {
        while ( true ) {
            $new_slug     = $slug . '-' . $i;
            $existing_context = article_generator()->contexts->get(
                [
                    'key' => 'slug',
                    'value' => $new_slug,
                ]
            );

            if ( empty( $existing_context ) ) {
                return $new_slug;
            } else {
                $this->generate_beautiful_slug( $slug, $i + 1 );
            }

            $i++;
        }
    }

    /**
     * Retrieves the query params for collections.
     *
     * @since 0.3.0
     *
     * @return array
     */
    public function get_collection_params(): array {
        $params = parent::get_collection_params();

        $params['limit']['default']   = 10;
        $params['search']['default']  = '';
        $params['orderby']['default'] = 'id';
        $params['order']['default']   = 'DESC';

        return $params;
    }
}
