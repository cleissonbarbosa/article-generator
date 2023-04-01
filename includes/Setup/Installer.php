<?php

namespace ArticleGen\JobPlace\Setup;

use ArticleGen\JobPlace\Common\Keys;

/**
 * Class Installer.
 *
 * Install necessary database tables and options for the plugin.
 */
class Installer {

    /**
     * Run the installer.
     *
     * @since 0.3.0
     *
     * @return void
     */
    public function run(): void {
        // Update the installed version.
        $this->add_version();

        // Register and create tables.
        $this->register_table_names();
        $this->create_tables();

        // Make this administrator user as company.
        $this->make_admin_as_company();

        // Run the database seeders.
        $seeder = new \ArticleGen\JobPlace\Databases\Seeder\Manager();
        $seeder->run();
    }

    /**
     * Make administrator user as company.
     *
     * @since 0.5.0
     *
     * @return void
     */
    private function make_admin_as_company() {
        update_user_meta( get_current_user_id(), 'user_type', 'company' );
    }

    /**
     * Register table names.
     *
     * @since 0.3.0
     *
     * @return void
     */
    private function register_table_names(): void {
        global $wpdb;

        // Register the tables to wpdb global.
        $wpdb->article_gen_job_types = $wpdb->prefix . 'article_gen_job_types';
        $wpdb->article_gen_jobs      = $wpdb->prefix . 'article_gen_jobs';
        $wpdb->article_gen_settings  = $wpdb->prefix . 'article_gen_settings';
    }

    /**
     * Add time and version on DB.
     *
     * @since 0.3.0
     * @since 0.4.1 Fixed #11 - Version Naming.
     *
     * @return void
     */
    public function add_version(): void {
        $installed = get_option( Keys::JOB_PLACE_INSTALLED );

        if ( ! $installed ) {
            update_option( Keys::JOB_PLACE_INSTALLED, time() );
        }

        update_option( Keys::JOB_PLACE_VERSION, JOB_PLACE_VERSION );
    }

    /**
     * Create necessary database tables.
     *
     * @since JOB_PLACE_
     *
     * @return void
     */
    public function create_tables() {
        if ( ! function_exists( 'dbDelta' ) ) {
            require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        }

        // Run the database table migrations.
        \ArticleGen\JobPlace\Databases\Migrations\JobTypeMigration::migrate();
        \ArticleGen\JobPlace\Databases\Migrations\JobsMigration::migrate();
        \ArticleGen\JobPlace\Databases\Migrations\SettingsMigration::migrate();
    }
}
