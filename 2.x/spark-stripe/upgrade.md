# Upgrade

[[toc]]

## Upgrading to Spark (Stripe) 2.0 From 1.x

Spark (Stripe) 2.0 primarily provides an upgrade from Cashier 12.x to Cashier 13.x. As such, in addition to the upgrade guide below, please consult the [Cashier 13 upgrade guide](https://github.com/laravel/cashier-stripe/blob/13.x/UPGRADE.md).

### Minimum Versions

The following required dependency versions have been updated:

- The minimum Cashier Stripe version is now v13.0
- The minimum Laravel version is now v9.0
- The minimum PHP version is now v8.0
- The minimum Stripe SDK version is now v7.39
- The minimum VatCalculator version is now v3.0

### Stripe API Version

The default Stripe API version for Cashier 13.x is `2020-08-27`.

If you use the Stripe SDK directly, make sure to properly test your integration after updating.

#### Upgrading Your Stripe Webhook

:::danger Deployment & Webhooks

It's very important that you upgrade your webhook immediately after updating and deploying Spark in order to minimize conflicts where the API version of your webhook does not match the version used by Cashier.
:::

You should ensure your Stripe webhook operates on the same API version as Spark's underlying API version used by Cashier. To do so, you may use the `cashier:webhook` command from your production environment to create a new webhook that matches Cashier's Stripe API version:

```bash
php artisan cashier:webhook --disabled
```

This will create a new webhook with the same Stripe API version as Cashier [in your Stripe dashboard](https://dashboard.stripe.com/webhooks). The webhook will be immediately disabled so it doesn't interfere with your existing production application until you are ready to enable it. By default, the webhook will be created using the `APP_URL` environment variable to determine the proper URL for your application. If you need to use a different URL, you can use the `--url` flag when invoking the command:

```bash
php artisan cashier:webhook --disabled --url "http://example.com/spark/webhook"
```

You may use the following upgrade checklist to properly enable to the new webhook:

1. If you have webhook signature verification enabled, disable it on production by temporarily removing the `STRIPE_WEBHOOK_SECRET` environment variable.
2. Add any extra Stripe events your application requires to the new webhook in your Stripe dashboard.
3. Disable the old webhook in your Stripe dashboard.
4. Enable the new webhook in your Stripe dashboard.
5. Re-enable the new webhook secret by re-adding the `STRIPE_WEBHOOK_SECRET` environment variable in production with the secret from the new webhook.
6. Remove the old webhook in your Stripe dashboard.

After following this process, your new webhook will be active and ready to receive events.

### VatCalculator 3.x

The [VatCalculator](https://github.com/driesvints/vat-calculator) package utilized by Spark has been upgraded to its latest major version. While we do not anticipate any breaking changes from this upgrade, you might want to review this package's [upgrade guide](https://github.com/driesvints/vat-calculator/blob/3.x/UPGRADE.md), specifically the section on [removed countries](https://github.com/driesvints/vat-calculator/blob/3.x/UPGRADE.md#removed-countries).

### Renaming "Plans" To Prices

To accommodate Stripe's phasing out of the "Plans" API, we've made the choice to partially migrate away from the "Plans" terminology. Because of this, the `stripe_plan` columns on the `subscriptions` and `subscription_items` tables have been renamed to `stripe_price`.  You will need to write a migration to rename these columns:

```php
Schema::table('subscriptions', function (Blueprint $table) {
    $table->renameColumn('stripe_plan', 'stripe_price');
});

Schema::table('subscription_items', function (Blueprint $table) {
    $table->renameColumn('stripe_plan', 'stripe_price');
});
```

Running this migration requires you to [install the `doctrine/dbal` package](https://laravel.com/docs/migrations#renaming-columns).

### New Payment Methods Support

Cashier v13 supports new payment methods. Because of this, the `card` columns in the database have been renamed to accommodate for all types of payment methods. You will need to write a migration to rename the billable model table's `card_brand`, `card_last_four` and `card_expiration` columns accordingly:

```php
Schema::table('users', function (Blueprint $table) {
    $table->renameColumn('card_brand', 'pm_type');
    $table->renameColumn('card_last_four', 'pm_last_four');
    $table->renameColumn('card_expiration', 'pm_expiration');
});
```

Running this migration requires you to [install the `doctrine/dbal` package](https://laravel.com/docs/migrations#renaming-columns).

### Billable Model Customization Changes

If you are overriding the billable `User` model with a custom billable model such as a `Team`, you should now invoke the `useCustomerModel` method within the `boot` method of your application's `AppServiceProvider` in order to make Cashier aware of your custom model:

```php
use App\Models\Team;
use Laravel\Cashier\Cashier;

/**
 * Bootstrap any application services.
 *
 * @return void
 */
public function boot()
{
    Cashier::useCustomerModel(Team::class);
}
```

After adding this method call to your `AppServiceProvider`, you may remove the `CASHIER_MODEL` environment variable from your `.env` file.

### Stripe Product Support

PR: https://github.com/laravel/cashier-stripe/pull/1185

Cashier Stripe v13 includes support for inspecting Stripe Product identifiers. To provide support for this feature, a new `stripe_product` column should be added to the `subscription_items` table:

```php
Schema::table('subscription_items', function (Blueprint $table) {
    $table->string('stripe_product')->nullable()->after('stripe_id');
});
```

If you would like to make use of the new `onProduct` & `subscribedToProduct` methods on your billable model, you should ensure the records in the `subscription_items` have their `stripe_product` column filled with the correct Product ID from Stripe.

## Upgrading To Spark (Stripe) v1.0.5

#### Updating The Configuration File

Spark (Stripe) v1.0.5 introduces a new format for enabling features in the configuration file. To use the new format, add the following lines to your `config/spark.php` configuration file:

```php
use Spark\Features;

'features' => [
    // Features::euVatCollection(['home-country' => 'BE']),
    // Features::receiptEmails(['custom-addresses' => true]),
    Features::paymentNotificationEmails(),
],
```

Next, uncomment the features you want to use in your application and remove the old corresponding configuration keys:

- `collects_eu_vat`
- `sends_receipt_emails`
- `sends_payment_notification_emails`

#### Collecting Billing Email Addresses

Spark (Stripe) 1.0.5 introduces the ability to email receipts to a custom billing address that the customer provides. This is typically used to email receipts directly to an accountant.

To support this feature, you need to create a new migration in your application and add the following schema modification in the migration's `up()` method:

```php
public function up()
{
    if (! Schema::hasColumn('users', 'receipt_emails')) {
        Schema::table('users', function (Blueprint $table) {
            $table->text('receipt_emails')->after('stripe_id');
        });
    }
}
```

Make sure to run the migration against the table that corresponds to your billable model.

To enable the feature, uncomment the `Features::receiptEmails()` line in your `config/spark.php` configuration file:

```php
'features' => [
    // Features::euVatCollection(['home-country' => 'BE']),
    Features::receiptEmails(['custom-addresses' => true]),
    Features::paymentNotificationEmailsSending(),
],
```
