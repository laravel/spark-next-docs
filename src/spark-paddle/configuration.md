# Configuration

[[toc]]

## Introduction

In the following documentation, we will discuss how to configure a Laravel Spark installation when using the [Paddle](https://paddle.com) payment provider. All of Spark's configuration options are housed in your application's `config/spark.php` configuration file.

::: warning Paddle Billing

Spark Paddle 5.x supports Paddle Billing. If you are still using Paddle Classic you should continue to use [Spark Paddle 4.x](https://github.com/laravel/spark-next-docs/tree/4.x/src).
:::

## Paddle Configuration

Of course, to use Paddle as a payment provider for your Laravel Spark application you must have an active [Paddle account](https://paddle.com). **While you are developing your application, you may use the [Paddle Sandbox](https://sandbox-vendors.paddle.com/)**.

### Environment Variables

Next, you should configure the application environment variables that will be needed by Spark in order to access your Paddle account. These variables should be placed in your application's `.env` environment file.

Of course, you should adjust the variable's values to correspond to your own Paddle account's credentials. In addition, you should set the `PADDLE_SANDBOX` variable to `true` if you are using Paddle's sandbox environment. Your Paddle API credentials and webhook secret are available in your Paddle account dashboard via the "Developer Tools" section's "Authentication" and "Notifications":

```bash
CASHIER_CURRENCY=USD
CASHIER_CURRENCY_LOCALE=en
PADDLE_SANDBOX=true
PADDLE_CLIENT_SIDE_TOKEN=your-paddle-client-side-token
PADDLE_API_KEY=your-paddle-api-key
PADDLE_WEBHOOK_SECRET=pdl_ntfset_xxx
```

:::danger Configuring Locales

In order to use locales other than `en`, ensure the `ext-intl` PHP extension is installed and configured on your server.
:::

### Paddle Webhooks

In addition, your Spark powered application will need to receive webhooks from Paddle in order to keep your application's billing and subscription data in sync with Paddle's. Within your Paddle dashboard's "Notifications" management panel, you should configure Paddle to send webhook alerts to your application's `/paddle/webhook` URI. You should enable webhook alerts for the following events:

- Customer Updated
- Transaction Completed
- Transaction Updated
- Subscription Created
- Subscription Updated
- Subscription Paused
- Subscription Canceled

#### Webhooks and Local Development

For Paddle to be able to send your application webhooks during local development, you will need to expose your application via a site sharing service such as [Ngrok](https://ngrok.io) or [Expose](https://beyondco.de/docs/expose/introduction). If you are developing your application locally using [Laravel Sail](http://laravel.com/docs/sail), you may use Sail's [site sharing command](https://laravel.com/docs/sail#sharing-your-site).

## Configuring Billables

Spark allows you to define the type of billable model that your application will be managing. Most commonly, applications bill individual users for monthly and yearly subscription plans. However, your application may choose to bill some other type of model, such as a team, organization, band, etc. The Paddle edition of Spark currently only supports a single billable model (team, user, etc.) per application.

You may define your billable model within the `billables` array of your application's `spark` configuration file. By default, this array contains an entry for the `App\Models\User` model.

Before continuing, you should ensure that the model class that corresponds to your billable model is using the `Spark\Billable` trait. In addition, your billable model's primary key should be an `integer` column named `id`:

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

### Billable Name and Email Address

By default, Spark will use your billable model's `name` and `email` attributes as the name and email address associated with the Paddle customer record it creates for the model. If you would like to specify another attribute that should be used instead, you may define a `paddleName` and `paddleEmail` method on your billable model:

```php
/**
 * Get the name that should be associated with the Paddle customer.
 */
public function paddleName(): string|null
{
    return $this->name;
}

/**
 * Get the unique email address that should be associated with the Paddle customer.
 */
public function paddleEmail(): string|null
{
    return $this->email;
}
```

::: warning Paddle Customer Email Address

Paddle requires each customer to have a unique email address, so multiple customers cannot share the same email.
:::

## Defining Subscription Plans

As we previously discussed, Spark allows you to define the type of billable model that your application will be managing. This billable model is defined within the `billables` array of your application's `config/spark.php` configuration file:

The billable configuration within the `billables` array contains a `plans` array. Within this array you may configure each of the billing plans offered by your application to that particular billable type. **The `monthly_id` and `yearly_id` identifiers should correspond to the plan identifiers associated with the subscription plan within your Paddle account dashboard:**

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
                'monthly_id' => env('SPARK_STANDARD_MONTHLY_PLAN', 'pri_1000'),
                'yearly_id' => env('SPARK_STANDARD_YEARLY_PLAN', 'pri_1001'),
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

If you would like to indicate some features that are **not** available for a given plan, you may prefix them with `--`. These features will be displayed using strikethrough text:

```php
'features' => [
    'Feature 1',
    'Feature 2',
    'Feature 3',
    '--No Batch Approve',
    '--No Additional Sources',
],
```

![Disabled features example](/img/disabled-features.png)

## Accessing the Billing Portal

Once you have configured your Spark installation, you may access your application's billing portal at the `/billing` URI. So, if your application is being served on `localhost`, you may access your application's billing portal at `http://localhost/billing`.

Of course, you may link to the billing portal from your application's dashboard however you see fit:

```html
<a href="/billing">
    Manage Subscription
</a>
```

## Showing a Link to the Terms and Conditions

Many applications display billing terms and conditions during checkout. Spark allows you to easily do the same within your application's billing portal. To get started, add a `terms_url` configuration value in your application's `config/spark.php` configuration file:

```php
'terms_url' => '/terms'
```

Once added, Spark will display a link pointing to `/terms` in the billing portal.
