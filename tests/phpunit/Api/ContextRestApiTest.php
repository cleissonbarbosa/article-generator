<?php

namespace ArticleGen\CBPlugin\Tests\Api;

use ArticleGen\CBPlugin\Contexts\Context;

class ContextRestApiTest extends \WP_UnitTestCase {

    /**
	 * Test REST Server
	 *
	 * @var WP_REST_Server
	 */
	protected $server;

    /**
     * Namespace.
     *
     * @var string
     */
    protected $namespace = 'article-generator/v1';

    /**
     * Context Instance.
     *
     * @var ArticleGen\CBPlugin\Contexts\Context
     */
    public Context $context;

    /**
     * Context Manager Instance.
     *
     * @var ArticleGen\CBPlugin\Contexts\Manager
     */
    public $context_manager;

    /**
     * Setup test environment.
     */
    protected function setUp() : void {
        // Initialize REST Server.
        global $wp_rest_server;

        parent::setUp();

        $this->context = new Context();

        // Truncate contexts table first before running test-suits.
        $this->context->truncate();

		$this->server = $wp_rest_server = new \WP_REST_Server;
		do_action( 'rest_api_init' );
    }

    /**
     * @test
     * @group contexts-rest-api
     */
    public function test_contexts_list_endpoint_exists() {
        $endpoint = '/' . $this->namespace . '/contexts';

        $request  = new \WP_REST_Request( 'GET', $endpoint );

        $response = $this->server->dispatch( $request );

        $this->assertEquals( 200, $response->get_status() );
	}

    /**
     * @test
     * @group contexts-rest-api
     */
    public function test_contexts_list_endpoint_returns_array() {
        $endpoint = '/' . $this->namespace . '/contexts';
        $request  = new \WP_REST_Request( 'GET', $endpoint );
        $response = $this->server->dispatch( $request );
        $data     = $response->get_data();
        $this->assertIsArray( $data );
    }

    /**
     * @test
     * @group contexts-rest-api
     */
    public function test_context_list_endpoint_can_send_total() {
        $endpoint = '/' . $this->namespace . '/contexts';
        $request  = new \WP_REST_Request( 'GET', $endpoint );
        $response = $this->server->dispatch( $request );

        $this->assertEquals( 0, $response->get_headers()['X-WP-Total'] );
        $this->assertEquals( 0, $response->get_headers()['X-WP-TotalPages'] );
    }

    /**
     * @test
     * @group contexts-rest-api
     */
    public function test_can_get_context_detail() {
        $endpoint = '/' . $this->namespace . '/contexts';
        $request  = new \WP_REST_Request( 'POST', $endpoint );
        $request->set_body_params( [
            'title'       => 'Context Title',
            'description' => 'Context Description',
            'company_id'  => 1,
            'context_type_id' => 2,
            'is_active'   => 1,
        ] );
        $response = $this->server->dispatch( $request );
        $data     = $response->get_data();

        // Hit context detail api endpoint.
        $endpoint = '/' . $this->namespace . '/contexts/' . $data['id'];
        $request  = new \WP_REST_Request( 'GET', $endpoint );
        $response = $this->server->dispatch( $request );
        $response = $response->get_data();

        // Check if context detail id found.
        $this->assertEquals( $data['title'], $response['title'] );
    }

    /**
     * @test
     * @group contexts-rest-api
     */
    public function test_context_endpoint_can_create_context() {
        $endpoint = '/' . $this->namespace . '/contexts';
        $request  = new \WP_REST_Request( 'POST', $endpoint );
        $request->set_body_params( [
            'title'       => 'Context Title',
            'description' => 'Context Description',
            'company_id'  => 1,
            'context_type_id' => 2,
            'is_active'   => 1,
        ] );
        $response = $this->server->dispatch( $request );
        $data     = $response->get_data();
        $this->assertEquals( 1, $data['id'] );

        // Check total count of contexts.
        $endpoint = '/' . $this->namespace . '/contexts';
        $request  = new \WP_REST_Request( 'GET', $endpoint );
        $response = $this->server->dispatch( $request );
        $data     = $response->get_data();
        $this->assertEquals( 1, count( $data ) );
    }

    /**
     * @test
     * @group contexts-rest-api
     */
    public function test_context_endpoint_can_not_create_without_title() {
        $endpoint = '/' . $this->namespace . '/contexts';
        $request  = new \WP_REST_Request( 'POST', $endpoint );
        $request->set_body_params( [
            'description' => 'Context Description',
            'company_id'  => 1,
            'context_type_id' => 2,
            'is_active'   => 1,
        ] );
        $response = $this->server->dispatch( $request );

        $this->assertEquals( 400, $response->get_status() );
        $this->assertSame( 'rest_missing_callback_param', $response->get_data()['code'] );
    }

    /**
     * @test
     * @group contexts-rest-api
     */
    public function test_can_slug_will_be_auto_generated_if_not_given() {
        $endpoint = '/' . $this->namespace . '/contexts';
        $request  = new \WP_REST_Request( 'POST', $endpoint );
        $request->set_body_params( [
            'title'       => 'Context Title',
            'description' => 'Context Description',
            'company_id'  => 1,
            'context_type_id' => 2,
            'is_active'   => 1,
        ] );

        $response = $this->server->dispatch( $request );
        $data     = $response->get_data();

        $this->assertEquals( 'context-title', $data['slug'] );
    }

    /**
     * @test
     * @group contexts-rest-api
     */
    public function test_can_create_multiple_context_without_slug_same_time() {
        $endpoint = '/' . $this->namespace . '/contexts';
        $request  = new \WP_REST_Request( 'POST', $endpoint );
        $request->set_body_params( [
            'title'       => 'Context Title',
            'description' => 'Context Description',
            'company_id'  => 1,
            'context_type_id' => 2,
            'is_active'   => 1,
        ] );
        $response = $this->server->dispatch( $request );
        $data     = $response->get_data();
        $this->assertEquals( 'context-title', $data['slug'] );

        $request  = new \WP_REST_Request( 'POST', $endpoint );
        $request->set_body_params( [
            'title'       => 'Context Title',
            'description' => 'Context Description',
            'company_id'  => 1,
            'context_type_id' => 2,
            'is_active'   => 1,
        ] );
        $response = $this->server->dispatch( $request );
        $data     = $response->get_data();
        $this->assertEquals( 'context-title-1', $data['slug'] );

        $request  = new \WP_REST_Request( 'POST', $endpoint );
        $request->set_body_params( [
            'title'       => 'Context Title',
            'description' => 'Context Description',
            'company_id'  => 1,
            'context_type_id' => 2,
            'is_active'   => 1,
        ] );
        $response = $this->server->dispatch( $request );
        $data     = $response->get_data();
        $this->assertEquals( 'context-title-2', $data['slug'] );

        $request  = new \WP_REST_Request( 'POST', $endpoint );
        $request->set_body_params( [
            'title'       => 'Context Title',
            'description' => 'Context Description',
            'company_id'  => 1,
            'context_type_id' => 2,
            'is_active'   => 1,
        ] );
        $response = $this->server->dispatch( $request );
        $data     = $response->get_data();
        $this->assertEquals( 'context-title-3', $data['slug'] );
    }

    /**
     * @test
     * @group contexts-rest-api
     */
    public function test_can_update_context() {
        $endpoint = '/' . $this->namespace . '/contexts';
        $request  = new \WP_REST_Request( 'POST', $endpoint );
        $request->set_body_params( [
            'title'       => 'Context Title',
            'description' => 'Context Description',
            'company_id'  => 1,
            'context_type_id' => 2,
            'is_active'   => 1,
        ] );
        $response = $this->server->dispatch( $request );
        $data     = $response->get_data();
        $this->assertEquals( 'context-title', $data['slug'] );
        $this->assertEquals( 1, $data['id'] );

        // Update context.
        $endpoint = '/' . $this->namespace . '/contexts/' . $data['id'];
        $request  = new \WP_REST_Request( 'PUT', $endpoint );
        $request->set_body_params( [
            'title'       => 'Context Title Updated',
            'description' => 'Context Description Updated',
            'company_id'  => 1,
            'context_type_id' => 2,
            'is_active'   => 1,
        ] );

        $response = $this->server->dispatch( $request );
        $data     = $response->get_data();
        $this->assertEquals( 'Context Title Updated', $data['title'] );
        $this->assertEquals( 'context-title-updated', $data['slug'] );
    }

    /**
     * @test
     *
     * @return void
     */
    public function test_can_delete_contexts() {
        $endpoint = '/' . $this->namespace . '/contexts';
        $request  = new \WP_REST_Request( 'POST', $endpoint );
        $request->set_body_params( [
            'title'       => 'Context Title',
            'description' => 'Context Description',
            'company_id'  => 1,
            'context_type_id' => 2,
            'is_active'   => 1,
        ] );
        $response = $this->server->dispatch( $request );
        $data     = $response->get_data();

        // Count total contexts
        $endpoint = '/' . $this->namespace . '/contexts';
        $request  = new \WP_REST_Request( 'GET', $endpoint );
        $response = $this->server->dispatch( $request );
        $data     = $response->get_data();
        $this->assertEquals( 1, count( $data ) );

        // Delete Context
        $endpoint = '/' . $this->namespace . '/contexts';
        $request  = new \WP_REST_Request( 'DELETE', $endpoint );
        $request->set_param( 'ids', [$data[0]['id']] );
        $response = $this->server->dispatch( $request );
        $this->assertEquals( 200, $response->get_status() );

        // Count total contexts
        $endpoint = '/' . $this->namespace . '/contexts';
        $request  = new \WP_REST_Request( 'GET', $endpoint );
        $response = $this->server->dispatch( $request );
        $data     = $response->get_data();
        $this->assertEquals( 0, count( $data ) );
    }
}
