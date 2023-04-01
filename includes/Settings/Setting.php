<?php

namespace ArticleGen\JobPlace\Settings;

use ArticleGen\JobPlace\Abstracts\BaseModel;

/**
 * Job class.
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
            'created_at'  => current_datetime()->format( 'Y-m-d H:i:s' ),
            'updated_at'  => current_datetime()->format( 'Y-m-d H:i:s' ),
        ];

        $data = wp_parse_args( $data, $defaults );

        // Sanitize template data
        return [
            'key'       => $this->sanitize( $data['key'], 'text' ),
            'value'        => $this->sanitize( $data['value'], 'text' ),
            'created_at'  => $this->sanitize( $data['created_at'], 'text' ),
            'updated_at'  => $this->sanitize( $data['updated_at'], 'text' ),
        ];
    }

    /**
     * Jobs item to a formatted array.
     *
     * @since 0.3.0
     *
     * @param object $job
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
