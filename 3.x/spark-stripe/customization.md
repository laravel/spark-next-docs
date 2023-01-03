# Customization

[[toc]]

## Branding

Although Spark's billing portal is intended to be an isolated part of your application that is entirely managed by Spark, you can make some small customizations to the branding logo and color used by Spark.

### Brand Logo

To customize the logo used at the top left of the Spark billing portal, you may specify a configuration value for the `brand.logo` configuration item within your application's `config/spark.php` configuration file. This configuration value should contain an absolute path to the SVG file of the logo you would like to use:

```php
'brand' => [
    'logo' => realpath(__DIR__.'/../public/img/logo.svg'),
],
```

:::tip SVG Sizing

You may need to adjust the size and width of your SVG logo by modifying its width in the SVG file itself.
:::

### Brand Color

To customize the color used as the background color of the button elements within the Spark billing portal, you may specify a value for the `brand.color` configuration item within your application's `config/spark.php` configuration file. This configuration value should be a valid hex code or correspond to a background color offered by the [Tailwind CSS framework](https://tailwindcss.com/docs/customizing-colors):

```php
'brand' => [
    'color' => 'bg-indigo-600',

    // Or...

    'color' => '#c5b358',
],
```

### Font

To customize the font used by the Spark billing portal, you should export Spark's views using the `vendor:publish` Artisan command:

```bash
php artisan vendor:publish --tag=spark-views
```

Next, within the `resources/views/vendor/spark/app.blade.php` template, you may define your own `font-sans` CSS class at the bottom of the templates `head` section:

```html
<head>
    <!-- ...... -->

    <style>
        .font-sans {
            font-family: 'Your Custom Font';
        }
    </style>
</head>
```

## Localization

You may localize / translate all of the text within the Spark billing portal. To publish the Spark localization file, you may use the `vendor:publish` Artisan command:

```bash
php artisan vendor:publish --tag=spark-lang
```

This command will publish a `resources/lang/spark/en.json` file containing translation keys and values for the English language. You may copy this file and translate it to the language of your choice. For more information on how to use Laravel's translation features, please consult the [Laravel localization documentation](https://laravel.com/docs/localization#using-translation-strings-as-keys).

## Migrations

Most commonly, applications bill individual users for monthly and yearly subscription plans. However, your application may choose to bill some other type of model, such as a team, organization, band, etc.

In that case, you should add `Spark::ignoreMigrations()` in the `register` method of your application's `App\Providers\SparkServiceProvider` class:

```php
use Spark\Spark;

class SparkServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        Spark::ignoreMigrations();

        // ...
    }
}
```

Next, you should publish the Spark migrations by running the `vendor:publish` Artisan command:

```bash
php artisan vendor:publish --tag="spark-migrations"
```

Finally, you should inspect the published migrations and update the `2019_05_03_000001_add_spark_columns_to_users_table.php` file to add the columns needed by Spark to the table that will be used by your application's billable model.

## Webhooks

Spark and Cashier automatically handle subscription cancellations for failed charges and other common Stripe webhook events. However, if you have additional webhook events you would like to handle, you may do so by listening to the `WebhookReceived` event from Cashier.

First, you should create a listener for the event. Inside this listener's `handle` method you'll receive the `WebhookReceived` event which contains the event payload. The first thing you should do is check if the event type is the one you want to act on:

```php
<?php

namespace App\Listeners;

use Laravel\Cashier\Cashier;
use Laravel\Cashier\Events\WebhookReceived;

class StripeEventListener
{
    /**
     * Handle the event.
     *
     * @param  \Laravel\Cashier\Events\WebhookReceived  $event
     * @return void
     */
    public function handle(WebhookReceived $event)
    {
        if ($event->payload['type'] !== 'customer.subscription.updated') {
            return;
        }

        // Handle the incoming event...
    }
}
```

Inside this listener you can perform whatever changes you need. Next, we'll need to make sure our app can listen to the incoming event and act upon it. Add it to the `App\Providers\EventServiceProvider` class:

```php
use App\Listeners\StripeEventListener;
use Laravel\Cashier\Events\WebhookReceived;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event handler mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        WebhookReceived::class => [
            StripeEventListener::class,
        ],
    ];
```

Now, whener a webhook is received, it'll be propogated to the listener where you can handle it. Of course, you can add as many listeners as you like.
