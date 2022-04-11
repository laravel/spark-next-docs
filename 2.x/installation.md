# Installation

[[toc]]

## Installing Spark Via Composer

:::tip License

Before installing Spark, you will need to purchase a [Spark license](https://spark.laravel.com/licenses). You can purchase a Spark license via the Spark dashboard.
:::

To get started installing Spark, add the Spark repository to your application's `composer.json` file:

```json
"repositories": [
    {
        "type": "composer",
        "url": "https://spark.laravel.com"
    }
],
```

Next, you may add the `laravel/spark-paddle` or `laravel/spark-stripe` package to the list of required packages in your `composer.json` file:

```json
"require": {
    "php": "^8.0",
    "laravel/framework": "^9.0",
    "laravel/spark-paddle": "^1.0"
},
```

After your `composer.json` file has been updated, run the `composer update` command in your console terminal:

```bash
composer update
```

When running `composer update`, you will be prompted to provide your login credentials for the Spark website. These credentials will authenticate your Composer session as having permission to download the Spark source code. To avoid manually typing these credentials, you may create a [Composer auth.json file](https://getcomposer.org/doc/articles/http-basic-authentication.md) and use your [API token](https://spark.laravel.com/user/api-tokens) in place of your password:

```json
{
    "http-basic": {
        "spark.laravel.com": {
            "username": "taylor@example.com",
            "password": "your-api-token"
        }
    }
}
```

You may quickly create an `auth.json` file via your terminal using the following command. As mentioned previously, you may create an API token via the [Spark dashboard](https://spark.laravel.com/user/api-tokens). This token may be used as a substitute for your password when creating a Composer `auth.json` file:

```bash
composer config http-basic.spark.laravel.com taylor@example.com your-api-token
```

:::danger The `auth.json` File

You should not commit your application's `auth.json` file into source control.
:::

Once the package is installed via Composer, run the `spark:install` Artisan command:

```bash
php artisan spark:install
```

Finally, run the `migrate` Artisan command:

```bash
php artisan migrate
```

:::tip Stripe Billables

If you are using the Stripe edition of Spark and plan to bill a model other than the `App\Models\User` model, you should follow [these instructions](./spark-stripe/customization.md#migrations) before running the migration command.
:::

That's it! Next, you may navigate to your application's `config/spark.php` configuration file and begin configuring your Spark installation.

## Authenticating Spark in Continuous Integration (CI) Environments

It's not advised to store your `auth.json` file inside your project's version control repository. However, there may be times you wish to download Spark inside a CI environment like [Chipper CI](https://chipperci.com/). For instance, you may wish to run tests for any custom tools you create. To authenticate Spark in these situations, you can use Composer to set the configuration option inside your CI system's pipeline, injecting environment variables containing the credentials you use to login to the Spark dashboard and a valid [Spark dashboard API token](https://spark.laravel.com/users/api-tokens):

```sh
composer config http-basic.spark.laravel.com ${SPARK_USERNAME} ${SPARK_API_TOKEN}
```
