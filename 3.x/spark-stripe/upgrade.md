# Upgrade

[[toc]]

## Upgrading to Spark (Stripe) 3.0 from 2.x

Spark (Stripe) 3.0 primarily provides an upgrade from Cashier 13.x to Cashier 14.x. As such, in addition to the upgrade guide below, please consult the [Cashier 14 upgrade guide](https://github.com/laravel/cashier-stripe/blob/14.x/UPGRADE.md).

### Stripe API Version

The default Stripe API version for Cashier 14.x is `2022-11-15`.

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

### Removing Top-Ups

Spark Stripe 3.0 removes all functionality related to top-ups. We've found that Stripe did not offer the functionality needed to fully utilize top-ups for recurring subscription payments. You should therefore remove the `topUps` feature from your Spark configuration file:

```diff
'features' => [
    ...
-   // Features::topUps(['price' => env('SPARK_TOP_UP_PRICE')]),
    ...
],
```

### Stripe Checkout Screens

Spark Stripe 3.0 utilizes Stripe Checkout for finalizing subscriptions and adding new payment methods. You can customize the appearance of Stripe Checkout by adjusting [your branding settings within Stripe](https://dashboard.stripe.com/settings/branding).

### Syncing Customer Details

Spark Stripe 3.0 will now automatically sync some customer information to Stripe, including their name, email address, and billing address. This synchronization will only take place whenever an update to the relevant data occurs on your billable model. To ensure that this does not negatively affect the performance of your application, we should [configure a Laravel queue worker](https://laravel.com/docs/queues), which Spark will automatically utilize to efficiently synchronize customer data to Stripe.

If you would like to disable customer data synchronization, you can define a `shouldSyncCustomerDetailsToStripe` method on your application's billable model:

```php
/**
 * Determine if any Stripe synced customer data has changed.
 */
public function shouldSyncCustomerDetailsToStripe(): bool
{
    return false;
}
```

### Removed Contracts

Because the setup of new payment methods now happens via Stripe Checkout, the `Spark\Contracts\Actions\UpdatesBillingMethod` contract and its implementing class was removed.
