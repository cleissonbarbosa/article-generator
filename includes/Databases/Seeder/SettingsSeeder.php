<?php

namespace ArticleGen\CBPlugin\Databases\Seeder;

use ArticleGen\CBPlugin\Abstracts\DBSeeder;
use ArticleGen\CBPlugin\Common\Keys;

/**
 * Settings Seeder class.
 *
 * Seed some fresh emails for initial startup.
 */
class SettingsSeeder extends DBSeeder {

    /**
     * Run Settings seeder.
     *
     * @since 0.3.0
     *
     * @return void
     */
    public function run() {
        global $wpdb;

        // Check if there is already a seeder runs for this plugin.
        $already_seeded = (bool) get_option( Keys::SETTING_SEEDER_RAN, false );
        if ( $already_seeded ) {
            return;
        }

        // Generator some contexts.
        $settings = [
            [
                'key'       => 'openai-api-key',
                'value'     => '',
                'created_at'  => current_datetime()->format( 'Y-m-d H:i:s' ),
                'updated_at'  => current_datetime()->format( 'Y-m-d H:i:s' ),
            ],
        ];

        // Create each of the settings.
        foreach ( $settings as $setting ) {
            $wpdb->insert(
                $wpdb->prefix . 'article_gen_settings',
                $setting
            );
        }

        // Update that seeder already runs.
        update_option( Keys::SETTING_SEEDER_RAN, true );
    }
}
