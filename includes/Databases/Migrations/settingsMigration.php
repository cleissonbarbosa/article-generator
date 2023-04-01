<?php

namespace ArticleGen\JobPlace\Databases\Migrations;

use ArticleGen\JobPlace\Abstracts\DBMigrator;

/**
 * Jobs migration.
 */
class SettingsMigration extends DBMigrator {

    /**
     * Migrate the jobs table.
     *
     * @since 0.3.0
     *
     * @return void
     */
    public static function migrate() {
        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();

        $schema_jobs = "CREATE TABLE IF NOT EXISTS `{$wpdb->article_gen_settings}` (
            `key` varchar(255) NOT NULL,
            `value` varchar(255) NOT NULL,
            `created_at` datetime NOT NULL,
            `updated_at` datetime NOT NULL,
            `deleted_at` datetime NULL,
            PRIMARY KEY (`key`),
            UNIQUE KEY `key` (`key`)
        ) $charset_collate";

        // Create the tables.
        dbDelta( $schema_jobs );
    }
}
