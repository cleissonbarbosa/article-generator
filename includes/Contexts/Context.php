<?php

namespace ArticleGen\CBPlugin\Contexts;

use ArticleGen\CBPlugin\Abstracts\BaseModel;

/**
 * Context class.
 *
 * @since 0.3.0
 */
class Context extends BaseModel {

    /**
     * Table Name.
     *
     * @var string
     */
    protected $table = 'article_gen_contexts';

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
            'title'       => '',
            'slug'        => '',
            'content'     => '',
            'is_active'   => 1,
            'created_by'  => get_current_user_id(),
            'created_at'  => current_datetime()->format( 'Y-m-d H:i:s' ),
            'updated_at'  => current_datetime()->format( 'Y-m-d H:i:s' ),
        ];

        $data = wp_parse_args( $data, $defaults );

        // Sanitize template data
        return [
            'title'       => $this->sanitize( $data['title'], 'text' ),
            'slug'        => $this->sanitize( $data['slug'], 'text' ),
            'content'     => $this->sanitize( $data['content'], 'block' ),
            'is_active'   => $this->sanitize( $data['is_active'], 'switch' ),
            'created_by'  => $this->sanitize( $data['created_by'], 'number' ),
            'created_at'  => $this->sanitize( $data['created_at'], 'text' ),
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
    public static function to_array( ?object $context ): array {

        $data = [
            'id'          => (int) $context->id,
            'title'       => $context->title,
            'slug'        => $context->slug,
            'status'      => ContextStatus::get_status_by_context( $context ),
            'content'     => $context->content,
            'created_at'  => $context->created_at,
            'updated_at'  => $context->updated_at,
        ];

        return $data;
    }
}
