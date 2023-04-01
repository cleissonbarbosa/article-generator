<?php

namespace ArticleGen\JobPlace\Databases\Seeder;

use ArticleGen\JobPlace\Abstracts\DBSeeder;
use ArticleGen\JobPlace\Common\Keys;

/**
 * Jobs Seeder class.
 *
 * Seed some fresh emails for initial startup.
 */
class SettingsSeeder extends DBSeeder {

    /**
     * Run Jobs seeder.
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

        // Generator some jobs.
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
