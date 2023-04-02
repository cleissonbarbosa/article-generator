<?php

namespace ArticleGen\CBPlugin\Databases\Seeder;

use ArticleGen\CBPlugin\Abstracts\DBSeeder;
use ArticleGen\CBPlugin\Common\Keys;

/**
 * ContextType Seeder class.
 *
 * Seed some fresh emails for initial startup.
 */
class ContextTypeSeeder extends DBSeeder {

    /**
     * Run Contexts seeder.
     *
     * @since 0.5.0
     *
     * @return void
     */
    public function run() {
        global $wpdb;

        // Check if there is already a seeder runs for this plugin.
        $already_seeded = (bool) get_option( Keys::CONTEXT_TYPE_SEEDER_RAN, false );
        if ( $already_seeded ) {
            return;
        }

        // Generator some context_types.
        $context_types = [
            [
                'name'        => 'Full time',
                'slug'        => 'full-time',
                'description' => 'This is a full time context post.',
                'created_at'  => current_datetime()->format( 'Y-m-d H:i:s' ),
                'updated_at'  => current_datetime()->format( 'Y-m-d H:i:s' ),
            ],
            [
                'name'        => 'Part time',
                'slug'        => 'part-time',
                'description' => 'This is a part time context post.',
                'created_at'  => current_datetime()->format( 'Y-m-d H:i:s' ),
                'updated_at'  => current_datetime()->format( 'Y-m-d H:i:s' ),
            ],
            [
                'name'        => 'Remote',
                'slug'        => 'remote',
                'description' => 'This is a remote context post.',
                'created_at'  => current_datetime()->format( 'Y-m-d H:i:s' ),
                'updated_at'  => current_datetime()->format( 'Y-m-d H:i:s' ),
            ],
            [
                'name'        => 'Contractual',
                'slug'        => 'contractual',
                'description' => 'This is a contractual context post.',
                'created_at'  => current_datetime()->format( 'Y-m-d H:i:s' ),
                'updated_at'  => current_datetime()->format( 'Y-m-d H:i:s' ),
            ],
        ];

        // Create each of the context_types.
        foreach ( $context_types as $context_type ) {
            $wpdb->insert(
                $wpdb->prefix . 'article_gen_context_types',
                $context_type
            );
        }

        // Update that seeder already runs.
        update_option( Keys::CONTEXT_TYPE_SEEDER_RAN, true );
    }
}
