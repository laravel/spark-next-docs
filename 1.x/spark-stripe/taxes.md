# Taxes

Spark may be configured to calculate and apply European Union VAT tax to subscriptions. However, before getting started, you must install the `mpociot/vat-calculator` package via the Composer package manager:

```bash
composer require mpociot/vat-calculator
```

Next, you should define a value for the `collects_eu_vat` configuration option within your application's `config/spark.php` configuration file. This value should be the two-character country code corresponding to the country where your business is located:

```php
'collects_eu_vat' => 'BE',
```

Once you have completed these steps, Spark will automatically gather customer billing address information as well as VAT Number and apply the correct VAT based on the customer's location.