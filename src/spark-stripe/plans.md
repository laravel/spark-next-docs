# Plans

[[toc]]

## Defining Payment Plans

**For more information on defining payment plans for your application, please consult the [plan configuration documentation](./configuration.md#defining-subscription-plans).**

## Trial Periods

By default, the plan configuration in your application's `config/spark.php` configuration file contains a `trial_days` option with a value of `5`. This configuration option determines the amount of time the user is allowed to use your application during their free trial period. You are free to modify this configuration value based on your application's needs; however, if a trial period is configured, Stripe Checkout requires it to be at least two days.

In practical terms, this configuration option simply determines when the `onTrial` method of the billable model will begin returning `false` instead of `true`:

```php
$user = Auth::user();

if ($user->onTrial()) {
    // The user is still within their trial period...
}
```

### Requiring a Payment Method Up Front

Some applications may need to require a payment method up front before beginning a free trial. The Stripe edition of Spark supports this behavior. To get started, you will add a `trial_days` configuration option to the individual plan configuration array and remove the `trial_days` configuration option that is within the billable configuration array:

```php
'user' => [
    'model' => User::class,
    // 'trial_days' => 5, Remove this configuration option...
    'plans' => [
        [
            'name' => 'Standard',
            'short_description' => 'This is a short, human friendly description of the plan.',
            'trial_days' => 5,
            // ...
        ],
    ],
],
```

Now, after a billable model's initial registration, the `trialDays` method provided by the model instance will return `false`. You may examine the results of the `subscribed` method to conditionally show an alert to your user that they should select a subscription plan before beginning to use your application. For example, if you are using the Blade templating language:

```html
@if (! Auth::user()->subscribed())
    <div>
        You must <a href="/billing">select a subscription plan</a> before continuing.
    </div>
@endif
```

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

### Incrementing / Decrementing the Seat Count

The `chargePerSeat` callback that was explained above will inform Spark of the current seat count that should be used when a customer initiates a subscription. However, you still need to inform Spark when to add or remove a seat when a user is using your application. For example, if building a project management application that bills per project, you would need to inform Spark when a user creates or deletes a project. You can accomplish this by calling the `addSeat` and `removeSeat` method:

```php
$user->addSeat();

$user->removeSeat();
```

Sometimes, payments for increasing seats can fail because a bank might require extra confirmation checks for card payments. When this happens, you should catch the `IncompletePayment` exception that occurs and handle it by redirecting to Cashier's payment page, while providing a `redirect` location back to the page that triggered the `addSeat` call:

```php
<?php

use Laravel\Cashier\Exceptions\IncompletePayment;
 
try {
    $user->addSeat();
} catch (IncompletePayment $exception) {
    return redirect()->route(
        'cashier.payment',
        [$exception->payment->id, 'redirect' => route('spark.portal')]
    );
}
```

Please consult the [Cashier documentation](https://laravel.com/docs/billing#handling-failed-payments) for more information on handling failed payments.

## Determining Subscription Status

While building your application, you will often need to inspect a user's subscription status and plan to determine if they are allowed to perform a given action. For example, you may not want to let a user create a project if they are subscribed to a billing plan that only allows a specific number of projects to be created. First, you should review the [subscription verification middleware](./middleware.md) provided by Spark.

Additionally, you may always manually inspect a billable model's subscription status using the [methods provided by Laravel Cashier](https://laravel.com/docs/billing#checking-subscription-status), which can be especially useful for verifying that a user is subscribed to a particular plan:

```php
if ($user->subscribed()) {
    // The user has an active subscription...
}

if ($user->subscribedToPrice($planId = 'price_id')) {
    // The user has a subscription to a plan with a Stripe plan / price ID of "price_id"...
}
```

## Defining Plan Incentive Text

Spark allows you to define plan "incentive" text to display to your users. For example, you may wish to display the amount saved by choosing to use a yearly plan vs. a monthly plan. Incentive text is shown in the top right corner of the plan's card:

![Incentive text example](/img/incentive.png)

To define incentive text, you may add `monthly_incentive` and / or `yearly_incentive` configuration options to your plan definition:

```php
[
    'name' => 'Standard',
    'short_description' => 'This is a short, human friendly description of the plan.',
    'monthly_id' => 'price_id',
    'yearly_id' => 'price_id',
    'yearly_incentive' => 'Save 10%',
    'features' => [
        'Feature 1',
        'Feature 2',
        'Feature 3',
    ],
],
```

## Access a Billable's Spark Plan

Sometimes you may wish to access the Spark plan instance for a given billable in order to determine what options are available to the plan. For example, if your plan definition contains the following:

```php
[
    'name' => 'Standard',
    'short_description' => 'This is a short, human friendly description of the plan.',
    'monthly_id' => 'price_id',
    'yearly_id' => 'price_id',
    'features' => [
        // ...
    ],
    'options' => [
        'database_backups' => true,
    ],
],
```

You may access the plan and options like so:

```php
if ($user->sparkPlan()) {
    $canCreateBackups = $user->sparkPlan()->options['database_backups'] ?? false;
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

If your application allows users to completely delete their account data, you should ensure that you cancel any subscription plans that the user has subscribed to before you delete their data. Otherwise, the user may continue to be billed even after you have deleted their data. You may cancel their subscription using [Laravel Cashier's](https://laravel.com/docs/billing) typical subscription management methods. Depending on the billable type used by your application, you may need to adjust this code to your application's unique needs:

```php
if (optional($user->subscription())->recurring()) {
    $user->subscription()->cancelNow();
}
```
