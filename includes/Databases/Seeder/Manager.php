<?php

namespace ArticleGen\CBPlugin\Databases\Seeder;

/**
 * Database Seeder class.
 *
 * It'll seed all of the seeders.
 */
class Manager {

    /**
     * Run the database seeders.
     *
     * @since 0.3.0
     *
     * @return void
     * @throws \Exception
     */
    public function run() {
        $seeder_classes = [
            \ArticleGen\CBPlugin\Databases\Seeder\ContextTypeSeeder::class,
            \ArticleGen\CBPlugin\Databases\Seeder\ContextsSeeder::class,
            \ArticleGen\CBPlugin\Databases\Seeder\SettingsSeeder::class,
        ];

        foreach ( $seeder_classes as $seeder_class ) {
            $seeder = new $seeder_class();
            $seeder->run();
        }
    }
}
