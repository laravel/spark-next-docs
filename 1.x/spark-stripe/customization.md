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

## Migrations

Most commonly, applications bill individual users for monthly and yearly subscription plans. However, your application may choose to bill some other type of model, such as a team, organization, band, etc.

In that case, you should add `Spark::ignoreMigrations()` in the boot method of your application's `App\Providers\SparkServiceProvider` class:

```php
use Spark\Spark;

class SparkServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
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
