<?php

namespace ArticleGen\CBPlugin\Settings;

use ArticleGen\CBPlugin\Abstracts\BaseModel;

/**
 * Context class.
 *
 * @since 0.3.0
 */
class Setting extends BaseModel {

    protected $primary_key = 'key';

    /**
     * Table Name.
     *
     * @var string
     */
    protected $table = 'article_gen_settings';

    /**
     * Prepare datasets for database operation.
     *
     * @since 0.3.0
     *
     * @param array $request
     * @return array
     */
    public function prepare_for_database( array $data ): array {
        $defaults = [
            'key'       => '',
            'value'        => '',
            'updated_at'  => current_datetime()->format( 'Y-m-d H:i:s' ),
        ];

        $data = wp_parse_args( $data, $defaults );

        // Sanitize template data
        return [
            'key'       => $this->sanitize( $data['key'], 'text' ),
            'value'        => $this->sanitize( $data['value'], 'text' ),
            'updated_at'  => $this->sanitize( $data['updated_at'], 'text' ),
        ];
    }

    /**
     * Contexts item to a formatted array.
     *
     * @since 0.3.0
     *
     * @param object $context
     *
     * @return array
     */
    public static function to_array( ?object $setting ): array {
        $data = [
            'key'         => $setting->key,
            'value'       => $setting->value,
            'created_at'  => $setting->created_at,
            'updated_at'  => $setting->updated_at,
        ];

        return $data;
    }
}
