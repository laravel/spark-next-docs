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

### Brand Color

To customize the color used as the background color of the button elements within the Spark billing portal, you may specify a value for the `brand.color` configuration item within your application's `config/spark.php` configuration file. This configuration value should correspond to a background color offered by the [Tailwind CSS framework](https://tailwindcss.com/docs/customizing-colors):

```php
'brand' => [
    'color' => 'bg-indigo-600',
],
```

## Localization

You may localize / translate all of the text within the Spark billing portal. To publish the Spark localization file, you may use the `vendor:publish` Artisan command:

```bash
php artisan vendor:publish --tag=spark-lang
```

This command will publish a `resources/lang/spark/en.json` file containing translation keys and values for the English language. You may copy this file and translate it to the language of your choice. For more information on how to use Laravel's translation features, please consult the [Laravel localization documentation](https://laravel.com/docs/localization#using-translation-strings-as-keys).

## Webhooks

Spark and Cashier automatically handles subscription cancellation on failed charges and other common Paddle webhooks, but if you have additional webhook events you would like to handle, you should extend Spark's `WebhookController`.

Your controller's method names should correspond to Cashier's controller method conventions. Specifically, methods should be prefixed with `handle` and the "camel case" name of the webhook you wish to handle. For example, if you wish to handle the `payment_succeeded` webhook, you should add a `handlePaymentSucceeded` method to the controller:

```php
<?php

namespace App\Http\Controllers;

use Spark\Http\Controllers\WebhookController as SparkWebhookController;

class WebhookController extends SparkWebhookController
{
    /**
     * Handle the payment succeeded webhook.
     *
     * @param  array  $payload
     * @return void
     */
    public function handlePaymentSucceeded($payload)
    {
        // Handle the event...
    }
}
```

Next, define a route to your webhook controller within your application's `routes/web.php` file. This will overwrite the default route registered by Spark's service provider:

```php
use App\Http\Controllers\WebhookController;

Route::post('/spark/webhook', WebhookController::class);
```

Finally, since Paddle webhooks need to bypass Laravel's CSRF protection, be sure to list the URI as an exception in your application's `App\Http\Middleware\VerifyCsrfToken` middleware or list the route outside of the `web` middleware group:

```php
protected $except = [
    'spark/webhook',
];
```