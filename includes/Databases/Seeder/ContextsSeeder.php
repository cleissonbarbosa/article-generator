<?php

namespace ArticleGen\CBPlugin\Databases\Seeder;

use ArticleGen\CBPlugin\Abstracts\DBSeeder;
use ArticleGen\CBPlugin\Common\Keys;

/**
 * Contexts Seeder class.
 *
 * Seed some fresh emails for initial startup.
 */
class ContextsSeeder extends DBSeeder {

    /**
     * Run Contexts seeder.
     *
     * @since 0.3.0
     *
     * @return void
     */
    public function run() {
        global $wpdb;

        // Check if there is already a seeder runs for this plugin.
        $already_seeded = (bool) get_option( Keys::CONTEXT_SEEDER_RAN, false );
        if ( $already_seeded ) {
            return;
        }

        // Generator some contexts.
        $contexts = [
            [
                'title'       => __('First Context', 'article-gen'),
                'slug'        => 'first-context',
                'content' => 'Article generator is a plugin for wordpress that allows the generation of automated post using artificial intelligence',
                'is_active'   => 1,
                'created_by'  => get_current_user_id(),
                'created_at'  => current_datetime()->format( 'Y-m-d H:i:s' ),
                'updated_at'  => current_datetime()->format( 'Y-m-d H:i:s' ),
            ],
        ];

        // Create each of the contexts.
        foreach ( $contexts as $context ) {
            $wpdb->insert(
                $wpdb->prefix . 'article_gen_contexts',
                $context
            );
        }

        // Update that seeder already runs.
        update_option( Keys::CONTEXT_SEEDER_RAN, true );
    }
}
