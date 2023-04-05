<?php

namespace ArticleGen\CBPlugin\Contexts;

class Manager {

    /**
     * Context class.
     *
     * @var Context
     */
    public $context;

    /**
     * Constructor.
     */
    public function __construct() {
        $this->context = new Context();
    }

    /**
     * Get all contexts by criteria.
     *
     * @since 0.3.0
     * @since 0.3.1 Fixed counting return type as integer.
     *
     * @param array $args
     * @return array|object|string|int
     */
    public function all( array $args = [] ) {
        $defaults = [
            'page'     => 1,
            'per_page' => 10,
            'orderby'  => 'id',
            'order'    => 'DESC',
            'search'   => '',
            'count'    => false,
            'where'    => [],
        ];

        $args = wp_parse_args( $args, $defaults );

        if ( ! empty( $args['search'] ) ) {
            global $wpdb;
            $like = '%' . $wpdb->esc_like( sanitize_text_field( wp_unslash( $args['search'] ) ) ) . '%';
            $args['where'][] = $wpdb->prepare( ' title LIKE %s OR content LIKE %s ', $like, $like );
        }

        if ( ! empty( $args['where'] ) ) {
            $args['where'] = ' WHERE ' . implode( ' AND ', $args['where'] );
        } else {
            $args['where'] = '';
        }

        $contexts = $this->context->all( $args );

        if ( $args['count'] ) {
            return (int) $contexts;
        }

        return $contexts;
    }

    /**
     * Get single context by id|slug.
     *
     * @since 0.3.0
     *
     * @param array $args
     * @return array|object|null
     */
    public function get( array $args = [] ) {
        $defaults = [
            'key' => 'id',
            'value' => '',
        ];

        $args = wp_parse_args( $args, $defaults );

        if ( empty( $args['value'] ) ) {
            return null;
        }

        return $this->context->get_by( $args['key'], $args['value'] );
    }

    /**
     * Create a new context.
     *
     * @since 0.3.0
     *
     * @param array $data
     *
     * @return int | WP_Error $id
     */
    public function create( $data ) {
        // Prepare context data for database-insertion.
        $context_data = $this->context->prepare_for_database( $data );
        error_log(print_r($context_data, true));
        // Create context now.
        $context_id = $this->context->create(
            $context_data,
            [
                '%s',
                '%s',
                '%s',
                '%d',
                '%d',
                '%s',
                '%s',
            ]
        );

        if ( ! $context_id ) {
            return new \WP_Error( 'article_gen_context_create_failed', __( 'Failed to create context.', 'article-gen' ) );
        }

        /**
         * Fires after a context has been created.
         *
         * @since 0.3.0
         *
         * @param int   $context_id
         * @param array $context_data
         */
        do_action( 'article_gen_contexts_created', $context_id, $context_data );

        return $context_id;
    }

    /**
     * Update context.
     *
     * @since 0.3.0
     *
     * @param array $data
     * @param int   $context_id
     *
     * @return int | WP_Error $id
     */
    public function update( array $data, int $context_id ) {
        // Prepare context data for database-insertion.
        $context_data = $this->context->prepare_for_database( $data );

        // Update context.
        $updated = $this->context->update(
            $context_data,
            [
                'id' => $context_id,
            ],
            [
                '%s',
                '%s',
                '%s',
                '%d',
                '%d',
                '%s',
                '%s',
            ],
            [
                '%d',
            ]
        );

        if ( ! $updated ) {
            return new \WP_Error( 'article_gen_context_update_failed', __( 'Failed to update context.', 'article-gen' ) );
        }

        if ( $updated >= 0 ) {
            /**
             * Fires after a context is being updated.
             *
             * @since 0.3.0
             *
             * @param int   $context_id
             * @param array $context_data
             */
            do_action( 'article_gen_contexts_updated', $context_id, $context_data );

            return $context_id;
        }

        return new \WP_Error( 'article_gen_context_update_failed', __( 'Failed to update the context.', 'article-gen' ) );
    }

    /**
     * Delete contexts data.
     *
     * @since 0.3.0
     *
     * @param array|int $context_ids
     *
     * @return int|WP_Error
     */
    public function delete( $context_ids ) {
        if ( is_array( $context_ids ) ) {
            $context_ids = array_map( 'absint', $context_ids );
        } else {
            $context_ids = [ absint( $context_ids ) ];
        }

        try {
            $this->context->query( 'START TRANSACTION' );

            $total_deleted = 0;
            foreach ( $context_ids as $context_id ) {
                $deleted = $this->context->delete(
                    [
                        'id' => $context_id,
                    ],
                    [
                        '%d',
                    ]
                );

                if ( $deleted ) {
                    $total_deleted += intval( $deleted );
                }

                /**
                 * Fires after a context has been deleted.
                 *
                 * @since 0.3.0
                 *
                 * @param int $context_id
                 */
                do_action( 'article_gen_context_deleted', $context_id );
            }

            $this->context->query( 'COMMIT' );

            return $total_deleted;
        } catch ( \Exception $e ) {
            $this->context->query( 'ROLLBACK' );

            return new \WP_Error( 'article-gen-context-delete-error', $e->getMessage() );
        }
    }
}
