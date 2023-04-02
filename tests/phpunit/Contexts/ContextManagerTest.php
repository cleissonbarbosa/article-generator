<?php

namespace ArticleGen\CBPlugin\Tests\Contexts;

use ArticleGen\CBPlugin\Contexts\Context;

class ContextManagerTest extends \WP_UnitTestCase {

    /**
     * Context Instance.
     *
     * @var Context
     */
    public Context $context;

    /**
     * Context Manager Instance.
     *
     * @var \ArticleGen\CBPlugin\Contexts\Manager
     */
    public $context_manager;

    /**
     * Setup test environment.
     */
    protected function setUp() : void {
        parent::setUp();

        $this->context = new Context();
        $this->context_manager = wp_react_kit()->contexts;

        // Truncate contexts table first before running tests.
        $this->context->truncate();
    }

    /**
     * @test
     * @group contexts
     */
    public function test_if_context_count_is_int() {
        $contexts_count = $this->context_manager->all( [ 'count' => true ] );

        // Check if contexts_count is an integer.
        $this->assertIsInt( $contexts_count );
    }

    /**
     * @test
     * @group contexts
     */
    public function test_if_context_lists_is_array() {
        $contexts = $this->context_manager->all();
        $this->assertIsArray( $contexts );
    }

    /**
     * @test
     * @group contexts
     */
    public function test_can_create_a_context() {
        // Get total contexts before creating context.
        $contexts_count = $this->context_manager->all( [ 'count' => true ] );
        $this->assertEquals( 0, $contexts_count );

        $context_id = $this->context_manager->create( [
            'title'       => 'Context Title',
            'description' => 'Context Description',
            'company_id'  => 1,
            'context_type_id' => 2,
            'is_active'   => 1,
        ] );

        // Check again the total contexts = 1
        $contexts_count = $this->context_manager->all( [ 'count' => true ] );
        $this->assertEquals( 1, $contexts_count );

        // Check if context_id is an integer also.
        $this->assertIsInt( $context_id );
    }

    /**
     * @test
     * @group contexts
     */
    public function test_can_find_a_context() {
        $context_id = $this->context_manager->create( [
            'title'       => 'Context Title',
            'description' => 'Context Description',
            'company_id'  => 1,
            'context_type_id' => 2,
            'is_active'   => 1,
        ] );
        $this->assertIsInt( $context_id );

        // Find the context
        $context = $this->context_manager->get( [ 'key' => 'id', 'value' => $context_id ] );

        // Check if context is an object
        $this->assertIsObject( $context );

        // Check if context id is found on $context->id
        $this->assertEquals( $context_id, $context->id );
    }

    /**
     * @test
     * @group contexts
     */
    public function test_can_update_a_context() {
        $context_id = $this->context_manager->create( [
            'title'       => 'Context Title',
            'description' => 'Context Description',
            'company_id'  => 1,
            'context_type_id' => 2,
            'is_active'   => 1,
        ] );
        $this->assertIsInt( $context_id );
        $this->assertGreaterThan( 0, $context_id );
        $this->assertEquals( 1, $this->context_manager->update([
            'title'       => 'Context Title Updated',
            'description' => 'Context Description Updated',
            'company_id'  => 1,
            'context_type_id' => 2,
            'is_active'   => 1,
        ], $context_id));
    }

    /**
     * @test
     * @group contexts
     */
    public function test_can_delete_a_context() {
        $context_id = $this->context_manager->create( [
            'title'       => 'Context Title',
            'description' => 'Context Description',
            'company_id'  => 1,
            'context_type_id' => 2,
            'is_active'   => 1,
        ] );

        // Check total contexts = 1
        $contexts_count = $this->context_manager->all( [ 'count' => true ] );
        $this->assertEquals( 1, $contexts_count );

        // Delete the context
        $this->context_manager->delete( $context_id );

        // Check total contexts = 0
        $contexts_count = $this->context_manager->all( [ 'count' => true ] );
        $this->assertEquals( 0, $contexts_count );
    }
}
