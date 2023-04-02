<?php

namespace ArticleGen\CBPlugin\Databases\Migrations;

use ArticleGen\CBPlugin\Abstracts\DBMigrator;

/**
 * Context type table Migration class.
 */
class ContextTypeMigration extends DBMigrator {

    /**
     * Migrate the context table.
     *
     * @since 0.5.0
     *
     * @return void
     */
    public static function migrate() {
        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();

        $schema_context_types = "CREATE TABLE IF NOT EXISTS `{$wpdb->article_gen_context_types}` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `name` varchar(255) NOT NULL,
            `slug` varchar(255) NOT NULL,
            `description` varchar(255) NOT NULL,
            `created_at` datetime NOT NULL,
            `updated_at` datetime NOT NULL,
            PRIMARY KEY (`id`),
            UNIQUE KEY `slug` (`slug`)
        ) $charset_collate;";

        // Create the tables.
        dbDelta( $schema_context_types );
    }
}
