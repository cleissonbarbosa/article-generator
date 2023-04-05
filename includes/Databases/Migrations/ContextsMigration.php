<?php

namespace ArticleGen\CBPlugin\Databases\Migrations;

use ArticleGen\CBPlugin\Abstracts\DBMigrator;

/**
 * Contexts migration.
 */
class ContextsMigration extends DBMigrator {

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

        $schema_contexts = "CREATE TABLE IF NOT EXISTS `{$wpdb->article_gen_contexts}` (
            `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            `title` varchar(255) NOT NULL,
            `slug` varchar(255) NOT NULL,
            `content` mediumtext NOT NULL,
            `is_active` tinyint(1) NOT NULL DEFAULT 1,
            `created_by` bigint(20) unsigned NOT NULL,
            `updated_by` bigint(20) unsigned NULL,
            `deleted_by` bigint(20) unsigned NULL,
            `created_at` datetime NOT NULL,
            `updated_at` datetime NOT NULL,
            `deleted_at` datetime NULL,
            PRIMARY KEY (`id`),
            UNIQUE KEY `slug` (`slug`),
            KEY `is_active` (`is_active`),
            KEY `created_by` (`created_by`),
            KEY `updated_by` (`updated_by`)
        ) $charset_collate";

        // Create the tables.
        dbDelta( $schema_contexts );
    }
}
