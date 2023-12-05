# Testing

[[toc]]

## Factories

While developing your application, you will likely want to "stub" a subscription record in your application's database so that calls to the `$billable->subscribed()` method return `true`.

To accomplish this, you may add a "state" method to your billable model's [factory class](https://laravel.com/docs/database-testing#defining-model-factories). Typically, this will be your application's `UserFactory` class. Below you will find an example state method implementation; however, you are free to adjust this to your application's own needs:

```php
use App\Models\User;

/**
 * Indicate that the user should have a subscription plan.
 *
 * @return $this
 */
public function withSubscription(string|int $priceId = null): static
{
    return $this->afterCreating(function (User $user) use ($priceId) {
        optional($user->customer)->update(['trial_ends_at' => null]);

        $subscription = $user->subscriptions()->create([
            'type' => 'default',
            'paddle_id' => fake()->unique()->numberBetween(1, 1000),
            'status' => 'active',
            'trial_ends_at' => null,
            'paused_at' => null,
            'ends_at' => null,
        ]);

        $subscription->items()->create([
            'product_id' => fake()->unique()->numberBetween(1, 1000),,
            'price_id' => $priceId,
            'status' => 'active',
            'quantity' => 1,
        ]);
    });
}
```

Once you have defined the state method, you may use it when creating models via your factory:

```php
$user = User::factory()->withSubscription($priceId = 'pri_monthly')->create();

$user->subscribed(); // true
```
