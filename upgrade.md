# Upgrade

[[toc]]

## Upgrading to Spark-Stripe v1.0.5

#### Updating The Configuration File

Spark-Stripe v1.0.5 introduces a new format for enabling features in the configuration file. To use the new format, add the following lines to your `config/spark.php` configuration file:

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

Spark-Stripe v1.0.5 introduces the ability to email receipts to a custom billing address that the customer provides. This is typically used to email receipts directly to an accountant.

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
