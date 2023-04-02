<?php

namespace ArticleGen\CBPlugin\Contexts;

/**
 * ContextStatus class.
 *
 * @since 0.3.0
 */
class ContextStatus {

    /**
     * Draft status.
     *
     * @since 0.3.0
     */
    const DRAFT = 'draft';

    /**
     * Published status.
     *
     * @since 0.3.0
     */
    const PUBLISHED = 'published';

    /**
     * Trashed status.
     *
     * @since 0.3.0
     */
    const TRASHED = 'trashed';

    /**
     * Get context status.
     *
     * @since 0.3.0
     *
     * @param object $context
     */
    public static function get_status_by_context( object $context ): string {
        if ( ! empty( $context->deleted_at ) ) {
            return self::TRASHED;
        }

        if ( $context->is_active ) {
            return self::PUBLISHED;
        }

        return self::DRAFT;
    }
}
