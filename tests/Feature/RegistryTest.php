<?php

namespace Tests\Feature;

use Tests\TestCase;

/** Guards the acceptance rule "every published tool link opens a functional tool". */
class RegistryTest extends TestCase
{
    public function test_every_registered_tool_has_a_browser_module_and_content(): void
    {
        $categories = config('tools.categories');
        foreach (config('tools.tools') as $slug => $t) {
            $this->assertFileExists(resource_path("js/tools/{$slug}.js"), "Missing module for {$slug}");
            $this->assertArrayHasKey($t['category'], $categories, "Unknown category for {$slug}");
            foreach (['name', 'title', 'description', 'keywords', 'howto', 'about', 'faqs', 'related'] as $k) {
                $this->assertNotEmpty($t[$k], "{$slug} is missing {$k}");
            }
            foreach ($t['related'] as $r) {
                $this->assertArrayHasKey($r, config('tools.tools'), "{$slug} relates to unknown tool {$r}");
            }
            $this->assertLessThanOrEqual(160, strlen($t['description']), "{$slug} description too long for a meta description");
        }
    }

    public function test_every_js_module_is_registered(): void
    {
        foreach (glob(resource_path('js/tools/*.js')) as $file) {
            $this->assertArrayHasKey(basename($file, '.js'), config('tools.tools'));
        }
    }
}
