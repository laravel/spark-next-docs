# Cookbook

[[toc]]

## Team Billing

Spark ships with "user" based billing by default. If your applications bills teams or a different model instead, you will need to adjust your Spark installation accordingly. We'll walk through these adjustments in the following documentation using a team billing implementation as an example.

To make the `App\Models\Team` model our billable model, we first need to adjust Spark's default migrations. So, let's configure Spark to ignore its own default migrations and export the migrations to our application so that we can adjust them:

#### Customizing The Migrations

To instruct Spark to ignore its migrations, call the `Spark::ignoreMigrations()` method in the `register` method of your application's `App\Providers\SparkServiceProvider` class:

```php
use Spark\Spark;

public function register()
{
    Spark::ignoreMigrations();
}
```

Next, execute the following Artisan command to publish the migrations:

```bash
php artisan vendor:publish --tag=spark-migrations
```

Now that the migrations are published in the `/database/migrations` directory, we need to change the name of the `2019_05_03_000001_add_spark_columns_to_users_table.php` file to `2020_05_03_000001_add_spark_columns_to_teams_table.php`. Adjusting the "year" of the migration will ensure the migration is run after the `teams` table is created in the database.

After renaming the migration, you may update its contents such that it updates the table definition of the `teams` table instead of the `users` table. Also, update the first column so that it is added after a field on the `teams` table instead of `remember_token`.

Next, update the `subscriptions` table migration to contain `team_id`instead of `user_id`. You should also ensure that you update the column in the migration's index as well.

Finally, you also need to update the migration of the `receipts` table to use the `team_id` column instead of `user_id`.

#### Updating The Service Provider

Now that the migrations have been updated, we should update the `SparkServiceProvider` to reference the `Team` model instead of the `User` model:

```php
use App\Models\Team;
use Laravel\Cashier\Cashier;
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
        // Instruct Cashier to use the `Team` model instead of the `User` model...
        Cashier::useCustomerModel(Team::class);

        // Resolve the current team...
        Spark::billable(Team::class)->resolve(function (Request $request) {
            return $request->user()->currentTeam;
        });

        // Verify that the current user owns the team...
        Spark::billable(Team::class)->authorize(function (Team $billable, Request $request) {
            return $request->user() &&
                   $request->user()->id == $billable->user_id;
        });

        Spark::billable(Team::class)->checkPlanEligibility(function (Team $billable, Plan $plan) {
            // ...
        });
    }
}
```

#### Updating The Model

Now we can update the `Team` model to use the `Spark\Billable` trait and implement a `stripeEmail` method that returns the team owner's email address to be displayed in the Stripe dashboard as the customer identifier:

```php
use Spark\Billable;

class Team extends JetstreamTeam
{
    use Billable;

    public function stripeEmail()
    {
        return $this->owner->email;
    }
}
```


#### Spark Configuration File

Finally, update your application's `config/spark.php` configuration file so that it defines a `team` billable model:

```php
use App\Models\Team;

'billables' => [
    'team' => [
        'model' => Team::class,

        'plans' => [
            // ...
        ],
    ],
]
```
