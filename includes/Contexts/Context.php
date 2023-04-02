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
            'description' => '',
            'company_id'  => 0,
            'is_active'   => 1,
            'context_type_id' => null,
            'created_by'  => get_current_user_id(),
            'created_at'  => current_datetime()->format( 'Y-m-d H:i:s' ),
            'updated_at'  => current_datetime()->format( 'Y-m-d H:i:s' ),
        ];

        $data = wp_parse_args( $data, $defaults );

        // Sanitize template data
        return [
            'title'       => $this->sanitize( $data['title'], 'text' ),
            'slug'        => $this->sanitize( $data['slug'], 'text' ),
            'description' => $this->sanitize( $data['description'], 'block' ),
            'company_id'  => $this->sanitize( $data['company_id'], 'number' ),
            'is_active'   => $this->sanitize( $data['is_active'], 'switch' ),
            'context_type_id' => $this->sanitize( $data['context_type_id'], 'number' ),
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
        $context_type = static::get_context_type( $context );

        $data = [
            'id'          => (int) $context->id,
            'title'       => $context->title,
            'slug'        => $context->slug,
            'context_type'    => $context_type,
            'is_remote'   => static::get_is_remote( $context_type ),
            'status'      => ContextStatus::get_status_by_context( $context ),
            'company'     => static::get_context_company( $context ),
            'description' => $context->description,
            'created_at'  => $context->created_at,
            'updated_at'  => $context->updated_at,
        ];

        return $data;
    }

    /**
     * Get context type of a context.
     *
     * @since 0.3.0
     *
     * @param object $context
     *
     * @return object|null
     */
    public static function get_context_type( ?object $context ): ?object {
        $context_type = new ContextType();

        $columns = 'id, name, slug';
        return $context_type->get( (int) $context->context_type_id, $columns );
    }

    /**
     * Get if context is a remote context or not.
     *
     * We'll fetch this from context_type_id.
     * If context type is for remote, then it's a remote context.
     *
     * @param object $context_type
     * @return boolean
     */
    public static function get_is_remote( ?object $context_type ): bool {
        if ( empty( $context_type ) ) {
            return false;
        }

        return $context_type->slug === 'remote';
    }

    /**
     * Get company of a context.
     *
     * @since 0.3.0
     *
     * @param object $context
     *
     * @return null | array
     */
    public static function get_context_company( ?object $context ): ?array {
        if ( empty( $context->company_id ) ) {
            return null;
        }

        $user = get_user_by( 'id', $context->company_id );

        if ( empty( $user ) ) {
            return null;
        }

        return [
            'id'         => $context->company_id,
            'name'       => $user->display_name,
            'avatar_url' => get_avatar_url( $user->ID ),
        ];
    }
}
