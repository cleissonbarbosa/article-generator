<?php

/**
 * Plugin Name:       Article Generator
 * Description:       Post generator using artificial intelligence (GPT)
 * Plugin URI:        https://github.com/cleissonbarbosa/article-generator
 * Requires at least: 5.8
 * Requires PHP:      8.0
 * Version:           ARTICLEGEN_SINCE
 * Tested upto:       6.2
 * Author:            Cleisson Barbosa<cleissonbarbosa68@gmail.com>
 * Author URI:        https://github.com/cleissonbarbosa
 * License:           MIT
 * License URI:       https://github.com/cleissonbarbosa/article-generator/blob/master/LICENSE.txt
 * Text Domain:       article-gen
 */

defined( 'ABSPATH' ) || exit;

use ArticleGen\CBPlugin\Updater\WP_GitHub_Updater;

/**
 * Article_Gen class.
 *
 * @class Article_Gen The class that holds the entire Article_Gen plugin
 */
final class Article_Gen {
    /**
     * Plugin version.
     *
     * @var string
     */
    const VERSION = 'ARTICLEGEN_SINCE';

    /**
     * Plugin slug.
     *
     * @var string
     *
     * @since 0.2.0
     */
    const SLUG = 'article-gen';

    /**
     * Holds various class instances.
     *
     * @var array
     *
     * @since 0.2.0
     */
    private $container = [];

    /**
     * Constructor for the CBPlugin class.
     *
     * Sets up all the appropriate hooks and actions within our plugin.
     *
     * @since 0.2.0
     */
    private function __construct() {
        require_once __DIR__ . '/vendor/autoload.php';

        $this->define_constants();

        register_activation_hook( __FILE__, [ $this, 'activate' ] );
        register_deactivation_hook( __FILE__, [ $this, 'deactivate' ] );

        add_action( 'wp_loaded', [ $this, 'flush_rewrite_rules' ] );
        $this->init_plugin();
    }

    /**
     * Initializes the Article_Gen() class.
     *
     * Checks for an existing Article_Gen() instance
     * and if it doesn't find one, creates it.
     *
     * @since 0.2.0
     *
     * @return Article_Gen|bool
     */
    public static function init() {
        static $instance = false;

        if ( ! $instance ) {
            $instance = new Article_Gen();
        }

        return $instance;
    }

    /**
     * Magic getter to bypass referencing plugin.
     *
     * @since 0.2.0
     *
     * @param $prop
     *
     * @return mixed
     */
    public function __get( $prop ) {
        if ( array_key_exists( $prop, $this->container ) ) {
            return $this->container[ $prop ];
        }

        return $this->{$prop};
    }

    /**
     * Magic isset to bypass referencing plugin.
     *
     * @since 0.2.0
     *
     * @param $prop
     *
     * @return mixed
     */
    public function __isset( $prop ) {
        return isset( $this->{$prop} ) || isset( $this->container[ $prop ] );
    }

    /**
     * Define the constants.
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function define_constants() {
        define( 'ARTICLE_GEN_VERSION', self::VERSION );
        define( 'ARTICLE_GEN_SLUG', self::SLUG );
        define( 'ARTICLE_GEN_FILE', __FILE__ );
        define( 'ARTICLE_GEN_DIR', __DIR__ );
        define( 'ARTICLE_GEN_PATH', dirname( ARTICLE_GEN_FILE ) );
        define( 'ARTICLE_GEN_INCLUDES', ARTICLE_GEN_PATH . '/includes' );
        define( 'ARTICLE_GEN_TEMPLATE_PATH', ARTICLE_GEN_PATH . '/templates' );
        define( 'ARTICLE_GEN_URL', plugins_url( '', ARTICLE_GEN_FILE ) );
        define( 'ARTICLE_GEN_BUILD', ARTICLE_GEN_URL . '/build' );
        define( 'ARTICLE_GEN_ASSETS', ARTICLE_GEN_URL . '/assets' );
    }

    /**
     * Load the plugin after all plugins are loaded.
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function init_plugin() {
        $this->includes();
        $this->init_hooks();

        /**
         * Fires after the plugin is loaded.
         *
         * @since 0.2.0
         */
        do_action( 'article_gen_loaded' );
    }

    /**
     * Activating the plugin.
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function activate() {
        // Run the installer to create necessary migrations and seeders.
        $this->install();
    }

    /**
     * Placeholder for deactivation function.
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function deactivate() {
        //
    }

    /**
     * Flush rewrite rules after plugin is activated.
     *
     * Nothing being added here yet.
     *
     * @since 0.2.0
     */
    public function flush_rewrite_rules() {
        // fix rewrite rules
    }

    /**
     * Run the installer to create necessary migrations and seeders.
     *
     * @since 0.3.0
     *
     * @return void
     */
    private function install() {
        $installer = new \ArticleGen\CBPlugin\Setup\Installer();
        $installer->run();
    }

    /**
     * Include the required files.
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function includes() {
        if ( $this->is_request( 'admin' ) ) {
            $this->container['admin_menu'] = new ArticleGen\CBPlugin\Admin\Menu();
        }

        // Common classes
        $this->container['assets']   = new ArticleGen\CBPlugin\Assets\Manager();
        $this->container['blocks']   = new ArticleGen\CBPlugin\Blocks\Manager();
        $this->container['rest_api'] = new ArticleGen\CBPlugin\REST\Api();
        $this->container['contexts'] = new ArticleGen\CBPlugin\Contexts\Manager();
        $this->container['settings'] = new ArticleGen\CBPlugin\Settings\Manager();
    }
    
    /**
     * updater
     *
     * @return void
     */
    public function updater(){
        
        define( 'WP_GITHUB_FORCE_UPDATE', true );

        if ( is_admin() ) { // note the use of is_admin() to double check that this is happening in the admin
    
            $config = array(
                'slug' => plugin_basename( __FILE__ ),
                'proper_folder_name' => 'article-generator',
                'api_url' => 'https://api.github.com/repos/cleissonbarbosa/article-generator',
                'raw_url' => 'https://raw.github.com/cleissonbarbosa/article-generator/master',
                'github_url' => 'https://github.com/cleissonbarbosa/article-generator',
                'zip_url' => 'https://github.com/cleissonbarbosa/article-generator/releases/latest/download/article-generator.zip',
                'sslverify' => true,
                'requires' => '3.0',
                'tested' => '6.2',
                'readme' => 'README.md',
            );
    
            new WP_GitHub_Updater( $config );
    
        }
    }

    /**
     * Initialize the hooks.
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function init_hooks() {
        // Init classes
        add_action( 'init', [ $this, 'init_classes' ] );

        // init updater
        add_action( 'init', [ $this, 'updater' ] );

        // Localize our plugin
        add_action( 'init', [ $this, 'localization_setup' ] );

        // Add the plugin page links
        add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), [ $this, 'plugin_action_links' ] );
    }

    /**
     * Instantiate the required classes.
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function init_classes() {
        // Init necessary hooks
    }

    /**
     * Initialize plugin for localization.
     *
     * @uses load_plugin_textdomain()
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function localization_setup() {
        load_plugin_textdomain( 'article-gen', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );

        // Load the React-pages translations.
        if ( is_admin() ) {
            // Load wp-script translation
            wp_set_script_translations( 'article-generator-app', 'article-gen', plugin_dir_path( __FILE__ ) . 'languages/' );
            wp_set_script_translations( 'ag-create-text-editor-script', 'article-gen', plugin_dir_path( __FILE__ ) . 'languages/' );
            wp_set_script_translations( 'ag-img-generator-editor-script', 'article-gen', plugin_dir_path( __FILE__ ) . 'languages/' );
        }
    }

    /**
     * What type of request is this.
     *
     * @since 0.2.0
     *
     * @param string $type admin, ajax, cron or frontend
     *
     * @return bool
     */
    private function is_request( $type ) {
        switch ( $type ) {
            case 'admin':
                return is_admin();

            case 'ajax':
                return defined( 'DOING_AJAX' );

            case 'rest':
                return defined( 'REST_REQUEST' );

            case 'cron':
                return defined( 'DOING_CRON' );

            case 'frontend':
                return ( ! is_admin() || defined( 'DOING_AJAX' ) ) && ! defined( 'DOING_CRON' );
        }
    }

    /**
     * Plugin action links
     *
     * @param array $links
     *
     * @since 0.2.0
     *
     * @return array
     */
    public function plugin_action_links( $links ) {
        $links[] = '<a href="' . admin_url( 'admin.php?page=article-gen#/settings' ) . '">' . __( 'Settings', 'article-gen' ) . '</a>';
        $links[] = '<a href="https://github.com/cleissonbarbosa/article-generator#quick-start" target="_blank">' . __( 'Documentation', 'article-gen' ) . '</a>';

        return $links;
    }
}

/**
 * Initialize the main plugin.
 *
 * @since 0.2.0
 *
 * @return \Article_Gen|bool
 */
function article_generator() {
    return Article_Gen::init();
}

/*
 * Kick-off the plugin.
 *
 * @since 0.2.0
 */
article_generator();
