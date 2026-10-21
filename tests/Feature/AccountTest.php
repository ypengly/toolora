<?php

namespace Tests\Feature;

use App\Models\SupportRequest;
use App\Models\Tool;
use App\Models\User;
use Database\Seeders\ToolSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AccountTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(ToolSeeder::class);
    }

    public function test_registration_hashes_password_and_logs_in(): void
    {
        $this->post('/auth/register', ['name' => 'Ada', 'email' => 'ada@example.com', 'password' => 'correct-horse-9', 'password_confirmation' => 'correct-horse-9'])
            ->assertRedirect('/dashboard');
        $user = User::firstWhere('email', 'ada@example.com');
        $this->assertNotSame('correct-horse-9', $user->password);
        $this->assertTrue(Hash::check('correct-horse-9', $user->password));
        $this->assertAuthenticatedAs($user);
    }

    public function test_weak_or_unconfirmed_passwords_are_rejected(): void
    {
        $this->post('/auth/register', ['name' => 'A', 'email' => 'a@example.com', 'password' => 'short', 'password_confirmation' => 'short'])->assertSessionHasErrors('password');
        $this->post('/auth/register', ['name' => 'A', 'email' => 'a@example.com', 'password' => 'long-enough-pw1', 'password_confirmation' => 'different'])->assertSessionHasErrors('password');
    }

    public function test_login_logout_and_bad_credentials(): void
    {
        $user = User::factory()->create(['password' => 'secret-password-1']);
        $this->post('/auth/login', ['email' => $user->email, 'password' => 'wrong'])->assertSessionHasErrors('email');
        $this->assertGuest();
        $this->post('/auth/login', ['email' => $user->email, 'password' => 'secret-password-1'])->assertRedirect('/dashboard');
        $this->assertAuthenticated();
        $this->post('/auth/logout')->assertRedirect('/');
        $this->assertGuest();
    }

    public function test_login_is_rate_limited(): void
    {
        for ($i = 0; $i < 6; $i++) {
            $this->post('/auth/login', ['email' => 'x@example.com', 'password' => 'nope']);
        }
        $this->post('/auth/login', ['email' => 'x@example.com', 'password' => 'nope'])->assertStatus(429);
    }

    public function test_dashboard_and_favorite_require_authentication(): void
    {
        $this->get('/dashboard/favorites')->assertRedirect('/auth/login');
        $this->post('/tools/json-formatter/favorite')->assertRedirect('/auth/login');
    }

    public function test_favorites_toggle_and_list(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->post('/tools/json-formatter/favorite')->assertRedirect();
        $this->assertSame(1, $user->favorites()->count());
        $this->actingAs($user)->get('/dashboard/favorites')->assertOk()->assertSee('JSON Formatter');
        $this->actingAs($user)->post('/tools/json-formatter/favorite');
        $this->assertSame(0, $user->favorites()->count());
    }

    public function test_users_only_see_their_own_favorites(): void
    {
        [$a, $b] = User::factory()->count(2)->create();
        $a->favorites()->attach(Tool::firstWhere('slug', 'word-counter')->id);
        $this->actingAs($b)->get('/dashboard/favorites')->assertDontSee('Word Counter');
    }

    public function test_contact_form_validates_and_stores(): void
    {
        $this->post('/contact', ['email' => 'bad', 'subject' => '', 'message' => 'short'])->assertSessionHasErrors(['email', 'subject', 'message']);
        $this->post('/contact', ['email' => 'me@example.com', 'subject' => 'Hello', 'message' => 'A real message body.'])->assertSessionHas('status');
        $this->assertSame(1, SupportRequest::count());
    }
}
