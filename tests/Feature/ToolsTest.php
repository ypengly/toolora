<?php

namespace Tests\Feature;

use App\Models\Tool;
use App\Models\User;
use Database\Seeders\ToolSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ToolsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(ToolSeeder::class);
    }

    public function test_homepage_renders(): void
    {
        $this->get('/')->assertOk()->assertSee('Everyday Problems. One Simple Toolkit.')->assertSee('JSON Formatter');
    }

    public function test_every_published_tool_page_opens_with_seo_metadata(): void
    {
        foreach (Tool::published()->get() as $tool) {
            $this->get(route('tools.show', $tool->slug))
                ->assertOk()
                ->assertSee('data-tool="'.$tool->slug.'"', false)
                ->assertSee('<link rel="canonical" href="'.route('tools.show', $tool->slug).'">', false)
                ->assertSee('How to use this tool');
        }
    }

    public function test_unknown_and_unpublished_tools_404(): void
    {
        $this->get('/tools/nope')->assertNotFound();
        Tool::where('slug', 'json-formatter')->update(['status' => 'draft']);
        $this->get('/tools/json-formatter')->assertNotFound();
        $this->get('/sitemap.xml')->assertDontSee('/tools/json-formatter');
    }

    public function test_search_matches_name_keywords_and_category(): void
    {
        $this->get('/tools?q=json')->assertOk()->assertSee('JSON Formatter')->assertDontSee('Word Counter');
        $this->get('/tools?q=epoch')->assertSee('Unix Timestamp Converter');          // keyword
        $this->get('/tools?q=qr')->assertSee('QR Code Generator');
        $this->get('/tools?q=Image Tools')->assertSee('Image Compressor');           // category name
        $this->get('/tools?q=zzzzqqq')->assertOk()->assertSee('No tools match your search');
        $this->get('/tools?q=100%25')->assertOk();                                    // LIKE wildcard is escaped
    }

    public function test_search_results_are_noindex_but_plain_listing_is_not(): void
    {
        $this->get('/tools?q=json')->assertSee('noindex', false);
        $this->get('/tools')->assertDontSee('noindex', false);
    }

    public function test_category_page_and_filter(): void
    {
        $this->get('/tools/category/image')->assertOk()->assertSee('Image Compressor')->assertDontSee('JSON Formatter');
        $this->get('/tools/category/nope')->assertNotFound();
        $this->get('/tools?category=text')->assertSee('Word Counter')->assertDontSee('Image Compressor');
    }

    public function test_sitemap_and_robots(): void
    {
        $this->get('/sitemap.xml')->assertOk()->assertSee(route('tools.show', 'regex-tester'))->assertDontSee('/dashboard');
        $this->get('/robots.txt')->assertOk()->assertSee('Disallow: /dashboard')->assertSee('Sitemap:');
    }

    public function test_security_headers_present(): void
    {
        $this->get('/')->assertHeader('X-Content-Type-Options', 'nosniff')->assertHeader('X-Frame-Options', 'SAMEORIGIN');
    }

    public function test_seeding_is_idempotent(): void
    {
        $this->seed(ToolSeeder::class);
        $this->assertSame(count(config('tools.tools')), Tool::count());
    }
}
