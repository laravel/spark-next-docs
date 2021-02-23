# Upgrade

[[toc]]

## Upgrading to Spark-Stripe v1.0.5

### Updating The Configuration File

Spark-Stripe v1.0.5 introduces a new format for enabling features in the configuration file. To use the new format add these lines to your `config/spark.php` configuration file:

```php
'features' => [
    // Features::euVatCollection(['home-country' => 'BE']),
    // Features::receiptEmails(['custom-addresses' => true]),
    Features::paymentNotificationEmails(),
],
```

Now you should uncomment the features you want to use in your application and remove the old configuration keys:

- `collects_eu_vat`
- `sends_receipt_emails`
- `sends_payment_notification_emails`

### Collecting Billing Email Addresses

Spark-Stripe v1.0.5 introduces the ability to show an input field in the billing portal to collect billing email address. Spark is going to send an email to these addresses with every new receipt.

To use this feature, you need to create a new migration in your application and add this in the `up()` method:

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

Make sure you run the migration against the correct table that matches your billable.

To enable the feature, uncomment the `Features::receiptEmails()` line in your `config/spark.php` configuration file:

```php
'features' => [
    // Features::euVatCollection(['home-country' => 'BE']),
    Features::receiptEmails(['custom-addresses' => true]),
    Features::paymentNotificationEmailsSending(),
],
```
