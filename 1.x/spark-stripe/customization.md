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

In that case, you should add `Spark::ignoreMigrations()` in the register method of your application's `App\Providers\SparkServiceProvider` class:

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

Spark and Cashier automatically handle subscription cancellations for failed charges and other common Stripe webhook events. However, if you have additional webhook events you would like to handle, you may do so by extending the Spark webhook controller.

Your controller's method names should correspond to Cashier's controller conventions. Specifically, methods should be prefixed with `handle` and the "camel case" name of the webhook you wish to handle. For example, if you wish to handle the `invoice.payment_succeeded` webhook, you should add a `handleInvoicePaymentSucceeded` method to the controller:

```php
<?php

namespace App\Http\Controllers;

use Spark\Http\Controllers\WebhookController as SparkWebhookController;

class WebhookController extends SparkWebhookController
{
    /**
     * Handle invoice payment succeeded.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handleInvoicePaymentSucceeded($payload)
    {
        // Handle the incoming event...

        return parent::handleInvoicePaymentSucceeded($payload);
    }
}
```

Next, define a route to your webhook controller within your application's `routes/web.php` file. This will overwrite the default route registered by Spark's service provider:

```php
use App\Http\Controllers\WebhookController;

Route::post(
    '/spark/webhook',
    [WebhookController::class, 'handleWebhook']
);
```

Finally, since Stripe webhooks need to bypass Laravel's CSRF protection, be sure to list the URI as an exception in your application's `App\Http\Middleware\VerifyCsrfToken` middleware or list the route outside of the `web` middleware group:

```php
protected $except = [
    'spark/webhook',
];
```
