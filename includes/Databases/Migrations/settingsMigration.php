<?php

namespace ArticleGen\CBPlugin\Databases\Migrations;

use ArticleGen\CBPlugin\Abstracts\DBMigrator;

/**
 * Settings migration.
 */
class SettingsMigration extends DBMigrator {

    /**
     * Migrate the contexts table.
     *
     * @since 0.3.0
     *
     * @return void
     */
    public static function migrate() {
        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();

        $schema_contexts = "CREATE TABLE IF NOT EXISTS `{$wpdb->article_gen_settings}` (
            `key` varchar(255) NOT NULL,
            `value` varchar(255) NOT NULL,
            `created_at` datetime NOT NULL,
            `updated_at` datetime NOT NULL,
            `deleted_at` datetime NULL,
            PRIMARY KEY (`key`),
            UNIQUE KEY `key` (`key`)
        ) $charset_collate";

        // Create the tables.
        dbDelta( $schema_contexts );
    }
}
