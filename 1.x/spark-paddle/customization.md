# Customization

[[toc]]

## Branding

Although Spark's billing portal is intended to be an isolated part of your application that is entirely managed by Spark, you can make some small customizations to the branding logo and color used by Spark.

### Brand Logo

To customize the logo used at the top left of the Spark billing portal, you may define a `brand.logo` configuration item within your application's `config/spark.php` configuration file. This configuration value should contain the absolute path to an SVG file of your logo:

```php
'brand' => [
    'logo' => realpath(__DIR__.'/../public/img/logo.svg'),
],
```

### Brand Color

To customize the brand color used to determine the color of the button elements within the Spark billing portal, you may define a `brand.color` configuration item within your application's `config/spark.php` configuration file. This configuration value should correspond to a background color offered by the [Tailwind CSS framework](https://tailwindcss.com/docs/customizing-colors):

```php
'brand' => [
    'color' => 'bg-indigo-600',
],
```

## Localization

To publish the Spark localization file, you may use the `vendor:publish` Artisan command:

```bash
php artisan vendor:publish --tag=spark-lang
```

This command will publish a `resources/lang/spark/en.json` file containing translation keys and values for the English language. You may copy this file and translate it to the language of your choice. For more information on how to use Laravel's translation features, please consult the [Laravel localization documentation](https://laravel.com/docs/localization#using-translation-strings-as-keys).