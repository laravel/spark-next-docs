# Configuration

[[toc]]

## Introduction

In the following documentation, we will discuss how to configure a Laravel Spark installation when using the [Paddle](https://paddle.com) payment provider. All of Spark's configuration options are housed in your application's `config/spark.php` configuration file.

## Paddle Configuration

Of course, to use Paddle as a payment provider for your Laravel Spark application, you should have an active Paddle account.

### Environment Variables

Next, you should configure the application environment variables that will be needed by Spark in order to access your Paddle account. These variables should be placed in your application's `.env` environment file. Of course, you should adjust the variable's values to correspond to your own Paddle account's credentials. Your Paddle API credentials and public key are available in your Paddle account dashboard via the "Developer Tools" section's "Authentication", "Public Key", and "SDK API" panels:

```bash
CASHIER_CURRENCY=USD
PADDLE_VENDOR_ID=your-paddle-vendor-id
PADDLE_VENDOR_AUTH_CODE=your-paddle-vendor-auth-code
PADDLE_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
MIICIjANBiuqhiiG9w0BAQEFXAOCAg8AMIIjjgKCAraAyj/UyC89sqpOnpEZcM76
guppK9vfF7balLj87rE9VXq5...EAAQ==
-----END PUBLIC KEY-----"
```

### Paddle Webhooks

In addition, your Spark powered application will need to receive webhooks from Paddle in order to keep your application's billing and subscription data in sync with Paddle's. Within your Paddle dashboard's "Alerts / Webhooks" management panel, you should configure Paddle to send webhook alerts to your application's `/spark/webhook` URI. You should enable webhook alerts for the following events:

- Subscription Created
- Subscription Updated
- Subscription Cancelled
- Subscription Payment Success
- Subscription Payment Failed
- High Risk Transaction Created
- High Risk Transaction Updated

#### Webhooks & Local Development

For Paddle to be able to send your application webhooks during local development, you will need to expose your application via a site sharing service such as [Ngrok](https://ngrok.io) or [Expose](https://beyondco.de/docs/expose/introduction). If you are developing your application locally using [Laravel Sail](http://laravel.com/docs/sail), you may use Sail's [site sharing command](https://laravel.com/docs/sail#sharing-your-site).

## Configuring Billables

Spark allows you to define the types of billable models that your application will be managing. Most commonly, applications bill individual users for monthly and yearly subscription plans. However, your application may choose to bill some other type of model, such as a team, organization, band, etc.

You may define your billable models within the `billables` array of your application's `spark` configuration file. By default, this array contains an entry for the `App\Models\User` model of your application.

Before continuing, you should ensure that the model class that corresponds to your billable model is using the `Laravel\Spark\Billable` trait:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Spark\Billable;

class User extends Authenticatable
{
    use Billable, HasFactory, Notifiable;
}
```

### Billable Slugs

As you may have noticed, each entry in the `billables` configuration array has a "slug" key that is a shortened form of the billable model class. This slug will be used when accessing the Spark customer billing portal, such as `https://example.com/billing/user` or `https://example.com/billing/team`.

### Billable Resolution

When you installed Laravel Spark, an `App\Providers\SparkServiceProvider` class was created for you. Within this service provider, you will find a callback that is used by Spark to resolve the billable model instance when accessing the Spark billing portal. By default, this callback simply returns the currently authenticated user, which is the desired behavior for most application using Laravel Spark:

```php
Spark::billable(User::class)->resolve(function (Request $request) {
    return $request->user();
});
```

However, if your application is not billing individual users, you may need to adjust this callback. For example, if your application offers team billing instead of user billing, you might customize the callback like so:

```php
use App\Models\Team;

Spark::billable(Team::class)->resolve(function (Request $request) {
    return $request->user()->currentTeam;
});
```

### Billable Authorization

Next, let's examine the authorization callbacks that Spark will use to determine if the currently authenticated user of your application is authorized to view the billing portal for a particular billable model.

When you installed Laravel Spark, an `App\Providers\SparkServiceProvider` class was created for you. Within this service provider, you will find the authorization callback definition used to determine if a given user is authorized to view the billing portal for the `App\Models\User` billable class. Of course, if your application is not billing users, you should update the billable class and authorization callback logic to fit your application's needs. By default, Spark will simply verify that the currently authenticated user can only manage its own billing settings:

```php
Spark::billable(User::class)->authorize(function (User $billable, Request $request) {
    return $request->user() &&
           $request->user()->id == $billable->id;
});
```

If the authorization callback returns `true`, the currently authenticated user will be authorized to view the billing portal and manage the billing settings for the given `$billable` model. If the callback returns `false`, the request to access the billing portal will be denied.

You are free to customize the `authorize` callback based on your own application's needs. For example, if your application bills teams instead of individual users, you might update the callback like so:

```php
use App\Models\Team;

Spark::billable(Team::class)->authorize(function (Team $billable, Request $request) {
    return $request->user() &&
           $request->user()->ownsTeam($billable);
});
```

### Billable Email Address

By default, Spark will use your billable model's `email` attribute as the email address associated with the Paddle customer record it creates for the model. If you would like to specify another attribute that should be used instead, you may define a `paddleEmail` method on your billable model:

```php
public function paddleEmail()
{
    return $this->email;
}
```

## Defining Subscription Plans

All of Spark's configuration options are housed in your application's `config/spark.php` configuration file. As we previously discussed, Spark allows you to define the types of billable models that your application will be managing. These billable models are defined within the `billables` array of your application's `spark` configuration file.

Each billable configuration within the `billables` array contains a `plans` array. Within this array you may configure each of the billing plans offered by your application. **The `monthly_id` and `yearly_id` identifiers should correspond to the plan identifiers configured within your Paddle account dashboard.**

If your plan only offers a monthly billing cycle, you may remove the `yearly_id` identifier from your plan configuration. Likewise, if your plan only offers a yearly billing cycle, you may remove the `monthly_id` identifier.

In addition, you are free to supply a short description of the plan and a list of features relevant to the plan. This information will be displayed in the Spark billing portal.

## Accessing The Billing Portal

Once you have configured your Spark installation, you may access your application's billing portal at the `/billing` URI. So, if your application is being served on `localhost`, you may access the billing portal at `http://localhost/billing`.

#### Accessing The Billing Portal For A Billable Type

Instead of billing users, your application may be billing a different [billable type](#configuring-billables) such as teams or organizations. If so, you should add the type's [billable slug](#billable-slugs) to the `/billing` URI. For example, if you have configured a `team` billable type, you may access the billing portal for that type by navigating to `http://localhost/billing/team`.
