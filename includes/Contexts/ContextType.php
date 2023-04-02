<?php

namespace ArticleGen\CBPlugin\Contexts;

use ArticleGen\CBPlugin\Abstracts\BaseModel;

/**
 * ContextType class.
 *
 * @since 0.3.0
 */
class ContextType extends BaseModel {

    /**
     * Table Name.
     *
     * @var string
     */
    protected $table = 'article_gen_context_types';

    /**
     * Context types item to a formatted array.
     *
     * @since 0.3.0
     *
     * @param object $context_type
     *
     * @return array
     */
    public static function to_array( object $context_type ): array {
        return [
            'id'          => (int) $context_type->id,
            'name'        => $context_type->name,
            'slug'        => $context_type->slug,
            'description' => $context_type->description,
            'created_at'  => $context_type->created_at,
            'updated_at'  => $context_type->updated_at,
        ];
    }
}
