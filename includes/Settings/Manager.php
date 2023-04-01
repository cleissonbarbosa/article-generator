<?php

namespace ArticleGen\JobPlace\Settings;

class Manager {

    /**
     * setting class.
     *
     * @var setting
     */
    public $setting;

    /**
     * Constructor.
     */
    public function __construct() {
        $this->setting = new Setting();
    }

    /**
     * Get all settings by criteria.
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
            'orderby'  => 'key',
            'order'    => 'DESC',
            'search'   => '',
            'count'    => false,
            'where'    => [],
        ];

        $args = wp_parse_args( $args, $defaults );

        if ( ! empty( $args['search'] ) ) {
            global $wpdb;
            $like = '%' . $wpdb->esc_like( sanitize_text_field( wp_unslash( $args['search'] ) ) ) . '%';
            $args['where'][] = $wpdb->prepare( ' key LIKE %s OR value LIKE %s ', $like, $like );
        }

        if ( ! empty( $args['where'] ) ) {
            $args['where'] = ' WHERE ' . implode( ' AND ', $args['where'] );
        } else {
            $args['where'] = '';
        }

        $settings = $this->setting->all( $args );

        if ( $args['count'] ) {
            return (int) $settings;
        }

        return $settings;
    }

    /**
     * Get single setting by id|slug.
     *
     * @since 0.3.0
     *
     * @param array $args
     * @return array|object|null
     */
    public function get( array $args = [] ) {
        $defaults = [
            'key' => '`key`',
            'value' => '',
        ];

        $args = wp_parse_args( $args, $defaults );

        if ( empty( $args['value'] ) ) {
            return null;
        }

        return $this->setting->get_by( $args['key'], $args['value'] );
    }

    /**
     * Create a new setting.
     *
     * @since 0.3.0
     *
     * @param array $data
     *
     * @return int | WP_Error $id
     */
    public function create( $data ) {
        // Prepare setting data for database-insertion.
        $setting_data = $this->setting->prepare_for_database( $data );

        // Create setting now.
        $setting_key = $this->setting->create(
            $setting_data,
            [
                '%s',
                '%s',
                '%s',
                '%s',
            ]
        );

        if ( ! $setting_key ) {
            return new \WP_Error( 'article_gen_setting_create_failed', __( 'Failed to create setting.', 'article-gen' ) );
        }

        /**
         * Fires after a setting has been created.
         *
         * @since 0.3.0
         *
         * @param int   $setting_key
         * @param array $setting_data
         */
        do_action( 'article_gen_settings_created', $setting_key, $setting_data );

        return $setting_key;
    }

    /**
     * Update setting.
     *
     * @since 0.3.0
     *
     * @param array $data
     * @param int   $setting_key
     *
     * @return int | WP_Error $id
     */
    public function update( array $datas ) {
        // Prepare setting data for database-insertion.
        $setting_data = [];
        $updated = null;
        foreach($datas as $data) {
            $data = $this->setting->prepare_for_database( $data );
            $setting_data[] = $data;

            error_log(print_r($data, true));

            // Update setting.
            $updated = $this->setting->update(
                $data,
                [
                    'key' => $data['key'],
                ],
                [
                    '%s',
                    '%s',
                    '%s',
                    '%s',
                ],
                [
                    '%s',
                ]
            );
    
            if ( ! $updated ) {
                return new \WP_Error( 'article_gen_setting_update_failed', __( 'Failed to update setting.', 'article-gen' ), [$updated] );
            }
        }


        if ( $updated >= 0 ) {
            /**
             * Fires after a setting is being updated.
             *
             * @since 0.3.0
             *
             * @param array $setting_data
             */
            do_action( 'article_gen_settings_updated', $setting_data );

            return $setting_data;
        }

        return new \WP_Error( 'article_gen_setting_update_failed', __( 'Failed to update the setting.', 'article-gen' ) );
    }

    /**
     * Delete settings data.
     *
     * @since 0.3.0
     *
     * @param array|int $setting_keys
     *
     * @return int|WP_Error
     */
    public function delete( $setting_keys ) {
        if ( is_array( $setting_keys ) ) {
            $setting_keys = array_map( 'sanitize_title', $setting_keys );
        } else {
            $setting_keys = [ sanitize_title( $setting_keys ) ];
        }

        try {
            $this->setting->query( 'START TRANSACTION' );

            $total_deleted = 0;
            foreach ( $setting_keys as $setting_key ) {
                $deleted = $this->setting->delete(
                    [
                        'key' => $setting_key,
                    ],
                    [
                        '%d',
                    ]
                );

                if ( $deleted ) {
                    $total_deleted += intval( $deleted );
                }

                /**
                 * Fires after a setting has been deleted.
                 *
                 * @since 0.3.0
                 *
                 * @param int $setting_key
                 */
                do_action( 'article_gen_setting_deleted', $setting_key );
            }

            $this->setting->query( 'COMMIT' );

            return $total_deleted;
        } catch ( \Exception $e ) {
            $this->setting->query( 'ROLLBACK' );

            return new \WP_Error( 'article-gen-setting-delete-error', $e->getMessage() );
        }
    }
}
