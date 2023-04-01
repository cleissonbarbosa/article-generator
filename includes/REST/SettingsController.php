<?php

namespace ArticleGen\JobPlace\REST;

use ArticleGen\JobPlace\Abstracts\RESTController;
use ArticleGen\JobPlace\Settings\Setting;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use WP_Error;

/**
 * API SettingsController class.
 *
 * @since 0.3.0
 */
class SettingsController extends RESTController {

    /**
     * Route base.
     *
     * @var string
     */
    protected $base = 'settings';

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
                    'methods'             => WP_REST_Server::EDITABLE,
                    'callback'            => [ $this, 'update_items' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                    'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),
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
            $this->namespace, '/' . $this->base . '/(?P<key>[a-zA-Z0-9-]+)',
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
     * Retrieves a collection of job items.
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

        $settings = article_generator()->settings->all( $args );
        foreach ( $settings as $job ) {
            $response = $this->prepare_item_for_response( $job, $request );
            $data[]   = $this->prepare_response_for_collection( $response );
        }

        $args['count'] = false;
        $response      = rest_ensure_response( $data );
        return $response;
    }

    /**
     * Retrieves a collection of job items.
     *
     * @since 0.3.0
     *
     * @param WP_REST_Request $request Full details about the request.
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function get_item( $request ) {
        $args = [
            'key'   => '`key`',
            'value' => sanitize_text_field( wp_unslash( $request['key'] ) ),
        ];

        $setting = article_generator()->settings->get( $args );

        if ( ! $setting ) {
            return new WP_Error( 'article_gen_rest_setting_not_found', __( 'Setting not found. May be setting has been deleted or you don\'t have access to that.', 'article-gen' ), [ 'status' => 404 ] );
        }

        // Prepare response.
        $setting = $this->prepare_item_for_response( $setting, $request );

        return rest_ensure_response( $setting );
    }

    /**
     * Create new setting.
     *
     * @since 0.3.0
     *
     * @param WP_Rest_Request $request
     *
     * @return WP_REST_Response|WP_Error
     */
    public function create_item( $request ) {
        if ( ! empty( $request['key'] ) ) {
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

        // Insert the setting.
        $setting_id = article_generator()->settings->create( $prepared_data );

        if ( is_wp_error( $setting_id ) ) {
            return $setting_id;
        }

        // Get setting after insert to sending response.
        $setting = article_generator()->settings->get(
            [
				'key' => '`key`',
				'value' => $setting_id,
			]
        );

        $response = $this->prepare_item_for_response( $setting, $request );
        $response = rest_ensure_response( $response );

        $response->set_status( 201 );
        $response->header( 'Location', rest_url( sprintf( '%s/%s/%d', $this->namespace, $this->rest_base, $setting_id ) ) );

        return $response;
    }

    /**
     * Update a setting.
     *
     * @since 0.3.0
     *
     * @param WP_Rest_Request $request
     *
     * @return WP_REST_Response|WP_Error
     */
    public function update_item( $request ) {
        if ( empty( $request['key'] ) ) {
            return new WP_Error(
                'article_gen_rest_email_template_exists',
                __( 'Invalid Setting KEY.', 'article-gen' ),
                array( 'status' => 400 )
            );
        }

        $prepared_data = $this->prepare_item_for_database( $request );

        if ( is_wp_error( $prepared_data ) ) {
            return $prepared_data;
        }

        // Update the setting.
        $setting_id = sanitize_title( $request['key'] );
        $setting_id = article_generator()->settings->update( $prepared_data, $setting_id );

        if ( is_wp_error( $setting_id ) ) {
            return $setting_id;
        }

        // Get setting after insert to sending response.
        $setting = article_generator()->settings->get(
            [
				'key' => '`key`',
				'value' => $setting_id,
			]
        );

        $response = $this->prepare_item_for_response( $setting, $request );
        $response = rest_ensure_response( $response );

        $response->set_status( 201 );
        $response->header( 'Location', rest_url( sprintf( '%s/%s/%d', $this->namespace, $this->rest_base, $setting_id ) ) );

        return $response;
    }

    /**
     * Update a settings.
     *
     * @since 0.3.0
     *
     * @param WP_Rest_Request $request
     *
     * @return WP_REST_Response|WP_Error
     */
    public function update_items( $request ) {

        $prepared_data = $this->prepare_items_for_database( $request->get_body() );

        if ( is_wp_error( $prepared_data ) ) {
            return $prepared_data;
        }

        $setting_id = article_generator()->settings->update( $prepared_data );

        if ( is_wp_error( $setting_id ) ) {
            return $setting_id;
        }

        // Get setting after insert to sending response.
        $response = $this->get_items( [] );
        $response->set_status( 201 );
        $response->header( 'Location', rest_url( sprintf( '%s/%s/%d', $this->namespace, $this->rest_base, $setting_id ) ) );

        return $response;
    }

    /**
     * Delete single or multiple settings.
     *
     * @since 0.3.0
     *
     * @param array $request
     *
     * @return WP_REST_Response|WP_Error
     */
    public function delete_items( $request ) {
        if ( ! isset( $request['keys'] ) ) {
            return new WP_Error( 'no_keys', __( 'No setting keys found.', 'article-gen' ), [ 'status' => 400 ] );
        }

        $deleted = article_generator()->settings->delete( $request['keys'] );

        if ( $deleted ) {
            $message = __( 'Settings deleted successfully.', 'article-gen' );

            return rest_ensure_response(
                [
					'message' => $message,
					'total' => $deleted,
				]
            );
        }

        return new WP_Error( 'no_setting_deleted', __( 'No setting deleted. Setting has already been deleted. Please try again.', 'article-gen' ), [ 'status' => 400 ] );
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
            'title'      => 'setting',
            'type'       => 'object',
            'properties' => [
                'key' => [
                    'description' => __( 'Key of the setting', 'article-gen' ),
                    'type'        => 'string',
                    'context'     => [ 'view' ],
                    'readonly'    => true,
                ],
                'value' => [
                    'description' => __( 'Setting title', 'article-gen' ),
                    'type'        => 'string',
                    'context'     => [ 'view', 'edit' ],
                    'required'    => true,
                    'minLength'   => 1,
                    'arg_options' => [
                        'sanitize_callback' => 'sanitize_text_field',
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
        $data['key']       =  $request->key;
        $data['value']       =  $request->value;
        $data['updated_at'] = empty( $request->updated_at ) ? current_datetime()->format( 'Y-m-d H:i:s' ) : $request->updated_at;

        return $data;
    }

    /**
     * Prepares a items for database.
     *
     * @since 0.3.0
     *
     * @param WP_REST_Request $request Request object.
     *
     * @return object|WP_Error
     */
    protected function prepare_items_for_database( $request ) {
        $data_prepared = [];
        foreach( json_decode( $request ) as $data ) {
            $data_prepared[] = $this->prepare_item_for_database( $data );
        }

        return $data_prepared;
    }

    /**
     * Prepares the item for the REST response.
     *
     * @since 0.3.0
     *
     * @param Setting            $item    WordPress representation of the item
     * @param WP_REST_Request $request request object
     *
     * @return WP_Error|WP_REST_Response
     */
    public function prepare_item_for_response( $item, $request ) {
        $data = [];

        $data = Setting::to_array( $item );

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

        $key = is_object( $item ) ? $item->key : $item['key'];

        $links = [
            'self' => [
                'href' => rest_url( trailingslashit( $base ) . $key ),
            ],
            'collection' => [
                'href' => rest_url( $base ),
            ],
        ];

        return $links;
    }

    /**
     * Sanitize job slug for uniqueness.
     *
     * @since 0.3.0
     *
     * @param string $slug
     * @param WP_REST_Request $request
     *
     * @return WP_Error|string
     */
    public function sanitize_setting_key( $key, $request ) {
        global $wpdb;

        $key           = sanitize_title( $key );
        $args['count'] = false;
        $args['where'][] = $wpdb->prepare( 'key = %s', $key );
        

        $total_found = article_generator()->settings->all( $args );

        if ( $total_found > 0 ) {
            return new WP_Error(
                'settings_place_rest_key_exists', __( 'Setting key already exists.', 'article-gen' ), [
					'status' => 400,
				]
            );
        }

        return $key;
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
        $params['orderby']['default'] = '`key`';
        $params['order']['default']   = 'DESC';

        return $params;
    }
}
