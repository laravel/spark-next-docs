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

## Webhooks

Spark and Cashier automatically handle subscription cancellations for failed charges and other common Paddle webhook events. However, if you have additional webhook events you would like to handle, you may do so by listening to the `WebhookReceived` event that is dispatched by Cashier.

First, you should create a listener for the event. Then, inside of the listener's `handle` method, you will receive the `WebhookReceived` event which contains the event payload. You may inspect this event's payload to determine if the given listener should handle the underlying Paddle event:

```php
<?php

namespace App\Listeners;

use Laravel\Paddle\Events\WebhookReceived;

class PaddleEventListener
{
    /**
     * Handle the event.
     */
    public function handle(WebhookReceived $event): void
    {
        if ($event->payload['alert_name'] === 'payment_succeeded') {
            return;
        }

        // Handle the incoming event...
    }
}
```

Next, the listener should be registered in your application's `App\Providers\EventServiceProvider` class:

```php
use App\Listeners\PaddleEventListener;
use Laravel\Paddle\Events\WebhookReceived;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event handler mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        WebhookReceived::class => [
            PaddleEventListener::class,
        ],
    ];
```
