# Testing

[[toc]]

## Factories

While developing your application, you will likely want to "stub" a subscription record in your application's database so that calls to the `$billable->subscribed()` method return `true`.

To accomplish this, you may add a "state" method to your billable model's [factory class](https://laravel.com/docs/database-testing#defining-model-factories). Typically, this will be your application's `UserFactory` class. Below you will find an example state method implementation; however, you are free to adjust this to your application's own needs:

```php
/**
 * Indicate that the user should have a subscription plan.
 *
 * @param  int  $planId
 * @return \Illuminate\Database\Eloquent\Factories\Factory
 */
public function withSubscription($planId = null)
{
    return $this->afterCreating(function ($user) use ($planId) {
        optional($user->customer)->update(['trial_ends_at' => null]);

        $user->subscriptions()->create([
            'name' => 'default',
            'paddle_id' => random_int(1, 1000),
            'paddle_status' => 'active',
            'paddle_plan' => $planId,
            'quantity' => 1,
            'trial_ends_at' => null,
            'paused_from' => null,
            'ends_at' => null,
        ]);
    });
}
```

Once you have define the state method, you may use it when creating models via your factory:

```php
$user = User::factory()->withSubscription($planId = 1000)->create();

$user->subscribed(); // true
```
