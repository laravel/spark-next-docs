# Cookbook

[[toc]]

## Team Billing

Spark ships with user billing by default. If your applications bills teams—or a different model—instead, here are the steps you need to take.

Let's take a Jetstream application that uses teams. To make the Team model our billable, we first need to adjust the spark migrations. So, let's configure Spark to ignore its migrations, export those migrations to our application, and then adjust them:

To instruct Spark to ignore its migrations, we need to call `Spark::ignoreMigrations()` in the `register` method of `SparkServiceProvider`:

```php
public function register()
{
    Spark::ignoreMigrations();
}
```

After that we need to run the following command to publish the migrations:

```bash
php artisan vendor:publish --tag=spark-migrations
```

Now that the migrations are published in the `/database/migrations` directory, we need to change the name of the `2019_05_03_000001_add_spark_columns_to_users_table.php` file and change `2019` to `2020`. This will make the migration run after the teams table is created in the schema.

After that, you may update the content of that migration file to update the schema of the `teams` table instead of the `users` table. Also, update the first column to be added after a field on the `teams` table instead of `remember_token`.

Next, update the migration of the `subscriptions` table to use `team_id`instead of `user_id` (Remember to update the index to use `team_id` as well). You also need to update the migration of the `receipts` table to use `team_id`.

Now that the migrations are ready, we need to update the `SparkServiceProvider` to reference the `Team` model instead of the `User` model:

```php
class SparkServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Spark::billable(Team::class)->resolve(function (Request $request) {
            return $request->user()->currentteam;
        });

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

Next, update the `CASHIER_MODEL` environment variable to use the `Team` model instead of the `User` model:

```bash
CASHIER_MODEL=App\\Models\\Team
```

Finally, update the spark configuration file to use the team as billable:

```php
'billables' => [
    'team' => [
        'model' => \App\Models\Team::class,

        'plans' => [
            // ...
        ],
    ],
]
```
