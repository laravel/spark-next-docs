# Taxes

Spark may be configured to calculate and apply European Union VAT tax to subscriptions.

:::tip Price Settings

When creating prices in Stripe, make sure to **disable** "Include tax in price" so the proper tax rates can be added by Spark.
:::


To get started, you should uncomment the `Features::euVatCollection()` line within your application's `config/spark.php` configuration file. The value provided for the `home-country` option should be the two-character country code corresponding to the country where your business is located:

```php
use Spark\Features;

'features' => [
    Features::euVatCollection(['home-country' => 'BE']),
],
```

Once you have completed these steps, Spark will automatically gather customer billing address information as well as VAT Number and apply the correct VAT based on the customer's location.
