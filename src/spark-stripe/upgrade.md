# Upgrade

[[toc]]

## Upgrading To Spark (Stripe) 5.0 From 4.x

Spark (Stripe) 5.0 primarily provides an upgrade from Cashier 14.x to Cashier 15.x. As such, in addition to the upgrade guide below, please consult the [Cashier 15 upgrade guide](https://github.com/laravel/cashier-stripe/blob/15.x/UPGRADE.md).

### Stripe API Version

The default Stripe API version for Cashier 15.x is `2023-10-16`.

If you use the Stripe SDK directly, make sure to properly test your integration after updating.

#### Upgrading Your Stripe Webhook

:::danger Deployment & Webhooks

It's very important that you upgrade your webhook immediately after updating and deploying Spark in order to minimize conflicts where the API version of your webhook does not match the version used by Cashier.
:::

You should ensure your Stripe webhook operates on the same API version as Spark's underlying API version used by Cashier. To do so, you may use the `cashier:webhook` command from your production environment to create a new webhook that matches Cashier's Stripe API version. Of course, you should ensure the webhook's URL corresponds to the URL where your application expects to receive webhook requests. By default, your application will receive Spark Stripe webhooks at `/spark/webhook`:

```bash
php artisan cashier:webhook --disabled --url "https://your-site.com/spark/webhook"
```

This command will create a new webhook with the same Stripe API version as Cashier [in your Stripe dashboard](https://dashboard.stripe.com/webhooks). The webhook will be immediately disabled so it doesn't interfere with your existing production application until you are ready to enable it.

You may use the following upgrade checklist to properly enable to the new webhook:

1. If you have webhook signature verification enabled, disable it on production by temporarily removing the `STRIPE_WEBHOOK_SECRET` environment variable.
2. Add any extra Stripe events your application requires to the new webhook in your Stripe dashboard.
3. Disable the old webhook in your Stripe dashboard.
4. Enable the new webhook in your Stripe dashboard.
5. Re-enable the new webhook secret verification by re-adding the `STRIPE_WEBHOOK_SECRET` environment variable in production with the secret from the new webhook.
6. Remove the old webhook in your Stripe dashboard.

After following this process, your new webhook will be active and ready to receive events.

### Publishing Migrations

Spark Stripe 5.0 no longer automatically loads migrations from its own migrations directory. Instead, you should run the following command to publish Spark's migrations to your application:

```bash
php artisan vendor:publish --tag=spark-migrations
```

### Receipts Renamed To Invoices

Code and text throughout Spark Stripe has been updated to refer to "receipts" as "invoices". This is to bring Spark Stripe closer to Stripe's own terminology for this concept. To accomodate this, you should make the following changes to your application:

First, rename the corresponding feature flag in your `spark.php` config:

```php
// From...
Features::receiptEmails(['custom-addresses' => true]),

// To...
Features::invoiceEmails(['custom-addresses' => true]),
```

Then, rename the `receipt_data` key in your application's `config/spark.php` configuration file to `invoice_data`:

```php
// From...
'receipt_data' => [
    'vendor' => 'Your Product',
    'product' => 'Your Product',
    'street' => '111 Example St.',
    'location' => 'Los Angeles, CA',
    'phone' => '555-555-5555',
],

// To...
'invoice_data' => [
    'vendor' => 'Your Product',
    'product' => 'Your Product',
    'street' => '111 Example St.',
    'location' => 'Los Angeles, CA',
    'phone' => '555-555-5555',
],
```

Lastly, create a migration to rename the `user` table's `receipt_emails` column to `invoice_emails`:

```php
Schema::table('users', function (Blueprint $table) {
    $table->renameColumn('receipt_emails', 'invoice_emails');
});
```
