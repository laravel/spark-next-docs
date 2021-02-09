# Plans

[[toc]]

## Defining Payment Plans

**For more information on defining payment plans for your application, please consult the [plan configuration documentation](./configuration.md#defining-subscription-plans).**

## Determining Plan Eligibility

Sometimes, you may wish to place limitations on a particular billing plan. For example, a project management application might limit users on a particular billing plan to a maximum of 10 projects, while a higher priced plan might allow the creation of up to 20 projects.

If you choose to take this approach to billing, you will need to instruct Spark how to determine if a given billable model is eligible to be placed on a particular billing plan. You may accomplish this by modifying the `checkPlanEligibility` callback registered within your application's `App\Providers\SparkServiceProvider` class. This callback will be invoked when a billable model attempts to subscribe to or switch to a new subscription plan:

```php
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Spark\Plan;
use Spark\Spark;

Spark::billable(User::class)->checkPlanEligibility(function ($billable, Plan $plan) {
    if (count($billable->projects) > 10 && $plan->name == 'Basic') {
        throw ValidationException::withMessages([
            'plan' => 'You have too many projects for the selected plan.'
        ]);
    }
});
```

## Per-Seat Billing Plans

Some applications charge users per "seat" instead of a fixed monthly price. For example, a project management application might charge $10 monthly **per project** such that if a user managed five projects they would be billed $50 monthly.

If your application will be using per-seat billing, you will likely define a single, monthly plan in your application's `config/spark.php` configuration file. In addition, you will need to instruct Spark how to calculate the current number of "seats" a billable model is currently using.

You may instruct Spark how to calculate the current number of "seats" a billable model is currently using via the `chargePerSeat` method when configuring a billable model. Typically, this method should be called within the `boot` method of your application's `App\Providers\SparkServiceProvider` class:

```php
use App\Models\User;
use Spark\Spark;

Spark::billable(User::class)->chargePerSeat('project', function ($billable) {
    return $billable->projects()->count();
});
```

The first argument accepted by the `chargePerSeat` method is the term that your application uses to refer to a "seat". In the case of a project management application, this would be a "project". The second argument given to the `chargePerSeat` method should be a closure that accepts the billable model and returns the current number of "seats" occupied by that model.

After configuring per-seat billing, Spark will automatically update the wording within your application's billing portal to inform users that billing is calculated on a per-seat basis.

## Determining Subscription Status

While building your application, you will often need to inspect a user's subscription status and plan to determine if they are allowed to perform a given action. For example, you may not want to let a user create a project if they are subscribed to a billing plan that only allows a specific number of projects to be created. First, you should review the [subscription verification middleware](./middleware.md) provided by Spark.

Additionally, you may always manually inspect a billable model's subscription status using the [methods provided by Laravel Cashier](https://laravel.com/docs/billing#checking-subscription-status), which can be especially useful for verifying that a user is subscribed to a particular plan:

```php
if ($user->subscribed()) {
    // The user has an active subscription...
}

if ($user->subscribedToPlan($planId = 'price_id')) {
    // The user has a subscription to a plan with a Stripe plan / price ID of "price_id"...
}
```

## Archiving Plans

If you plan to "archive" or retire a particular plan for your application, you should add the `archived` configuration option to the plan's configuration array. You should not completely remove the plan's configuration if existing users of your application that have already subscribed to the plan will be allowed to continue their subscription:

```php
'plans' => [
    [
        'name' => 'Standard',
        // ...
        'archived' => true,
    ],
],
```

## Account Deletion

If your application allows users to completely delete their account data, you should ensure that you cancel any subscription plans that the user has subscribed to before you delete their data. Otherwise, the user may continue to be billed even after you have deleted their data. You may cancel their subscription using [Laravel Cashier's](https://laravel.com/docs/billing) typical subscription management methods. Depending on the billable types used by your application, you may need to adjust this code to your application's unique needs:

```php
if (optional($user->subscription())->recurring()) {
    $user->subscription()->cancelNow();
}
```