# Cookbook

[[toc]]

## Team Billing

Spark ships with "user" based billing by default. If your applications bills teams or a different model instead, you will need to adjust your Spark installation accordingly. We'll walk through these adjustments in the following documentation using a team billing implementation as an example.

To make the `App\Models\Team` model our billable model, we first need to adjust Spark's service provider.

#### Updating the Service Provider

Now we should update the `SparkServiceProvider` to reference the `Team` model instead of the `User` model:

```php
use App\Models\Team;
use Spark\Spark;

class SparkServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
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

#### Updating the Model

Now we can update the `Team` model to use the `Spark\Billable` trait and implement a `paddleEmail` method that returns the team owner's unique email address to be displayed in the Paddle dashboard as the customer identifier:

```php
use Spark\Billable;

class Team extends JetstreamTeam
{
    use Billable;

    public function paddleEmail(): string|null
    {
        return $this->owner->email;
    }
}
```

Paddle requires each billable entity to have a unique email address, so multiple customers or teams cannot share the same email.

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
