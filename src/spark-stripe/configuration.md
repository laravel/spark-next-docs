# Configuration

[[toc]]

## Introduction

In the following documentation, we will discuss how to configure a Laravel Spark installation when using the [Stripe](https://stripe.com) payment provider. All of Spark's configuration options are housed in your application's `config/spark.php` configuration file.

## Stripe Configuration

Of course, to use Stripe as a payment provider for your Laravel Spark application you must have an active [Stripe account](https://stripe.com).

### Environment Variables

Next, you should configure the application environment variables that will be needed by Spark in order to access your Stripe account. These variables should be placed in your application's `.env` environment file.

Of course, you should adjust the variable's values to correspond to your own Stripe account's credentials. Your Stripe API credentials and public key are available in your Stripe account dashboard:

```bash
CASHIER_CURRENCY=USD
CASHIER_CURRENCY_LOCALE=en
STRIPE_KEY=pk_test_example
STRIPE_SECRET=sk_test_example
STRIPE_WEBHOOK_SECRET=sk_test_example
```

:::danger Configuring Locales

In order to use locales other than `en`, ensure the `ext-intl` PHP extension is installed and configured on your server.
:::

### Stripe Webhooks

In addition, your Spark powered application will need to receive webhooks from Stripe in order to keep your application's billing and subscription data in sync with Stripe's. Within your Stripe dashboard's webhook management panel, you should configure Stripe to send webhook alerts to your application's `/spark/webhook` URI. You should enable webhook alerts for the following events:

- customer.deleted
- customer.subscription.created
- customer.subscription.deleted
- customer.subscription.updated
- customer.updated
- invoice.payment_action_required
- invoice.payment_succeeded
- payment_method.automatically_updated

Or, when you're ready for production, you can create this webhook with all the necessary events by running the following command on your production server:

```bash
php artisan cashier:webhook --url="https://your-production-url.com/spark/webhook"
```

After creation, the webhook will be active immediately. 

#### Webhooks & Local Development

During local development, you will need a way for Stripe to send webhooks to your application running on your local machine. An easy way to get started is via [the Stripe CLI](https://stripe.com/docs/stripe-cli), which provides a convenient `listen` command. For example, if you are developing locally via the `artisan serve` CLI command and serving your site at `http://localhost:8000`, you may run the following Stripe CLI command to allow Stripe to communicate with your application:

```shell
stripe listen --forward-to http://localhost:8000/spark/webhook
```

Alternatively, you can expose your application via another site sharing service such as [Ngrok](https://ngrok.io) or [Expose](https://beyondco.de/docs/expose/introduction). If you are developing your application locally using [Laravel Sail](http://laravel.com/docs/sail), you may use Sail's [site sharing command](https://laravel.com/docs/sail#sharing-your-site).

## Configuring Billables

Spark allows you to define the types of billable models that your application will be managing. Most commonly, applications bill individual users for monthly and yearly subscription plans. However, your application may choose to bill some other type of model, such as a team, organization, band, etc. The Stripe edition of Spark currently only supports a single billable model entity (team, user, etc.) per application.

You may define your billable models within the `billables` array of your application's `spark` configuration file. By default, this array contains an entry for the `App\Models\User` model. If the billable model is something other than `App\Models\User`, you should invoke Cashier's `useCustomerModel` method in the `boot` method of your `SparkServiceProvider` class in order to inform Cashier of your custom model:

```php
use App\Entities\User;
use Laravel\Cashier\Cashier;
 
/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Cashier::useCustomerModel(User::class);
}
```

Before continuing, you should ensure that the model class that corresponds to your billable model is using the `Spark\Billable` trait and that it casts the `trial_ends_at` attribute to `datetime`. In addition, your billable model's primary key should be an `integer` column named `id`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spark\Billable;

class User extends Authenticatable
{
    use Billable, HasFactory, Notifiable;

    protected $casts = [
        'trial_ends_at' => 'datetime',
    ];

}
```

### Billable Slugs

As you may have noticed, each entry in the `billables` configuration array is keyed by a "slug" that is a shortened form of the billable model class. This slug can be used when accessing the Spark customer billing portal, such as `https://example.com/billing/user` or `https://example.com/billing/team`.

### Billable Resolution

When you installed Laravel Spark, an `App\Providers\SparkServiceProvider` class was created for you. Within this service provider, you will find a callback that is used by Spark to resolve the billable model instance when accessing the Spark billing portal. By default, this callback simply returns the currently authenticated user, which is the desired behavior for most applications using Laravel Spark:

```php
use App\Models\User;
use Illuminate\Http\Request;
use Spark\Spark;

Spark::billable(User::class)->resolve(function (Request $request) {
    return $request->user();
});
```

However, if your application is not billing individual users, you may need to adjust this callback. For example, if your application offers team billing instead of user billing, you might customize the callback like so:

```php
use App\Models\Team;
use Illuminate\Http\Request;
use Spark\Spark;

Spark::billable(Team::class)->resolve(function (Request $request) {
    return $request->user()->currentTeam;
});
```

### Billable Authorization

Next, let's examine the authorization callbacks that Spark will use to determine if the currently authenticated user of your application is authorized to view the billing portal for a particular billable model.

When you installed Laravel Spark, an `App\Providers\SparkServiceProvider` class was created for you. Within this service provider, you will find the authorization callback definition used to determine if a given user is authorized to view the billing portal for the `App\Models\User` billable class. Of course, if your application is not billing users, you should update the billable class and authorization callback logic to fit your application's needs. By default, Spark will simply verify that the currently authenticated user can only manage its own billing settings:

```php
use App\Models\User;
use Illuminate\Http\Request;
use Spark\Spark;

Spark::billable(User::class)->authorize(function (User $billable, Request $request) {
    return $request->user() &&
           $request->user()->id == $billable->id;
});
```

If the authorization callback returns `true`, the currently authenticated user will be authorized to view the billing portal and manage the billing settings for the given `$billable` model. If the callback returns `false`, the request to access the billing portal will be denied.

You are free to customize the `authorize` callback based on your own application's needs. For example, if your application bills teams instead of individual users, you might update the callback like so:

```php
use App\Models\Team;
use Illuminate\Http\Request;
use Spark\Spark;

Spark::billable(Team::class)->authorize(function (Team $billable, Request $request) {
    return $request->user() &&
           $request->user()->ownsTeam($billable);
});
```

### Syncing Customer Data With Stripe

Spark synchronizes user data such as name, email, and billing address information to Stripe when this data is updated on the underlying billable Eloquent model. To ensure that this does not negatively affect the performance of your application, we recommend that you configure a [queue worker](https://laravel.com/docs/queues). If a queue worker has been configured, Spark will automatically perform Stripe data synchronization using your application's default queue.

## Defining Subscription Plans

As we previously discussed, Spark allows you to define the types of billable models that your application will be managing. These billable models are defined within the `billables` array of your application's `config/spark.php` configuration file:

Each billable configuration within the `billables` array contains a `plans` array. Within this array you may configure each of the billing plans offered by your application to that particular billable type. **The `monthly_id` and `yearly_id` identifiers should correspond to the price / plan identifiers configured within your Stripe account dashboard:**

```php
use App\Models\User;

'billables' => [
    'user' => [
        'model' => User::class,
        'trial_days' => 5,
        'plans' => [
            [
                'name' => 'Standard',
                'short_description' => 'This is a short, human friendly description of the plan.',
                'monthly_id' => 'price_id',
                'yearly_id' => 'price_id',
                'features' => [
                    'Feature 1',
                    'Feature 2',
                    'Feature 3',
                ],
            ],
        ],
    ],
]
```

If your subscription plan only offers a monthly billing cycle, you may omit the `yearly_id` identifier from your plan configuration. Likewise, if your plan only offers a yearly billing cycle, you may omit the `monthly_id` identifier.

In addition, you are free to supply a short description of the plan and a list of features relevant to the plan. This information will be displayed in the Spark billing portal.

## Customizing Stripe Checkout

When users start new subscriptions they will be redirected to Stripe's hosted Checkout page. Using the `checkoutSessionOptions` method, you can customize the Stripe Checkout experience by providing a closure that receives the billable and chosen plan as its argument.

Typically, you should invoke Spark's `checkoutSessionOptions` method in the `boot` method of your `SparkServiceProvider` class. The provided closure can return any option accepted by [Stripe Checkout](https://stripe.com/docs/api/checkout/sessions/create):

```php
use App\Models\User;
use Spark\Plan;
use Spark\Spark;
 
/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Spark::checkoutSessionOptions('user', function ($billable, Plan $plan) {
        return [
            'locale' => $billable->language,
        ];
    });
}
```

### Customizing Payment Method Checkout

In addition to customizing the checkout experience when creating new subscriptions, you may also customize the checkout session when adding new payment methods. This can be accomplished using the `paymentMethodSessionOptions` method. Typically, you should invoke Spark's `paymentMethodSessionOptions` method in the `boot` method of your `SparkServiceProvider` class:

```php
use App\Models\User;
use Spark\Plan;
use Spark\Spark;
 
/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Spark::paymentMethodSessionOptions('user', function ($billable, Plan $plan) {
        return [
            'locale' => $billable->language,
        ];
    });
}
```

## Accessing The Billing Portal

Once you have configured your Spark installation, you may access your application's billing portal at the `/billing` URI. So, if your application is being served on `localhost`, you may access your application's billing portal at `http://localhost/billing`.

Of course, you may link to the billing portal from your application's dashboard however you see fit:

```html
<a href="/billing">
    Manage Subscription
</a>
```

## Showing A Link To The Terms And Conditions

Many applications display billing terms and conditions during checkout. Spark allows you to easily do the same within your application's billing portal. To get started, add a `terms_url` configuration value in your application's `config/spark.php` configuration file:

```php
'terms_url' => '/terms'
```

Once added, Spark will display a link pointing to `/terms` in the billing portal.

## Receipt Emails

Spark Stripe can also email subscription payment receipts to your customers. To enable this feature, uncomment the 'receiptEmails' feature entry in your application's `config/spark.php` configuration file:

```php
'features' => [
    // ...
    Features::receiptEmails(),
    // ...
]
```

If you would like to grant your customers the ability to specify the email address that receipts should be sent to, you may provide the `custom-addresses` option to the feature definition:

```php
'features' => [
    // ...
    Features::receiptEmails(['custom-addresses' => true]),
    // ...
]
```

If you enable email receipts within your application, we suggest disabling [Stripe's receipt mailing](https://dashboard.stripe.com/settings/billing/automatic) feature so that customers do not receive duplicate receipt emails.

## Failed Payment Emails

Since SCA regulations require customers to occasionally verify their payment details even while their subscription is active, Spark can send a notification to the customer when off-session payment confirmation is required. Spark's payment confirmation notifications can be enabled by enabling the `paymentNotificationEmails` feature within your application's `config/spark.php` configuration file:

```php
'features' => [
    // ...
    Features::paymentNotificationEmails(),
    // ...
]
```
