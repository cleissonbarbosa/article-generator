<?php

namespace ArticleGen\JobPlace\Jobs;

use ArticleGen\JobPlace\Abstracts\BaseModel;

/**
 * JobType class.
 *
 * @since 0.3.0
 */
class JobType extends BaseModel {

    /**
     * Table Name.
     *
     * @var string
     */
    protected $table = 'article_gen_job_types';

    /**
     * Job types item to a formatted array.
     *
     * @since 0.3.0
     *
     * @param object $job_type
     *
     * @return array
     */
    public static function to_array( object $job_type ): array {
        return [
            'id'          => (int) $job_type->id,
            'name'        => $job_type->name,
            'slug'        => $job_type->slug,
            'description' => $job_type->description,
            'created_at'  => $job_type->created_at,
            'updated_at'  => $job_type->updated_at,
        ];
    }
}
