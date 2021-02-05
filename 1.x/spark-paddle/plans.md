# Plans

[[toc]]

## Configuring Payment Plans

All of Spark's configuration options are housed in your application's `config/spark.php` configuration file. As we discussed in the [configuration documentation](./configuration.md), Spark allows you to define the types of billable models that your application will be managing. These billable models are defined within the `billables` array of your application's `spark` configuration file.

Each billable configuration within the `billables` array contains a `plans` array. Within this array you may configure each of the billing plans offered by your application. The `monthly_id` and `yearly_id` identifiers should correspond to the plan identifiers configured within your Paddle account dashboard.

If your plan only offers a monthly billing cycle, you may remove the `yearly_id` identifier from your plan configuration. Likewise, if your plan only offers a yearly billing cycle, you may remove the `monthly_id` identifier.

In addition, you are free to supply a short description of the plan and a list of features relevant to the plan. This information will be displayed in the Spark billing portal.

## Determining Plan Eligibility

Sometimes, you may wish to place limitations on a particular billing plan. For example, a project management application might limit users on a particular billing plan to a maximum of 10 projects, while a higher priced plan might allow the creation of 20 projects.

If you choose to do this, we need to instruct Spark how to determine if a given billable model is eligible to be placed on a particular billing plan. We may accomplish this by modifying the `checkPlanEligibility` callback registered within the application's `App\Providers\SparkServiceProvider` class. This callback will be invoked when a billable model attempts to subscribe to or switch to a new subscription plan:

```php
Spark::billable(User::class)->checkPlanEligibility(function ($billable, $plan) {
    if (count($billable->projects) > 10 && $plan->name == 'Basic') {
        throw ValidationException::withMessages([
            'plan' => 'You have too many projects for the selected plan.'
        ]);
    }
});
```

## Per-Seat Billing Plans

Some applications charge users per "seat" instead of a fixed monthly price. For example, a project management application might charge $10 monthly per project. So, if a user managed five projects, they would be billed $50 monthly.

If your application will be using per-seat billing, you will likely define a single, monthly plan in your application's `config/spark.php` configuration file. In addition, we will need to instruct Spark how to calculate the current number of "seats" a billable model is currently using. We may accomplish using the `chargePerSeat` method when configuration a billable model. Typically, this method should be called within the `boot` method of your application's `App\Providers\SparkServiceProvider` class:

```php
Spark::billable(User::class)->chargePerSeat('project', function ($billable) {
    return $billable->projects()->count();
});
```

The first argument accepted by the `chargePerSeat` method is the word that your application uses to refer to a "seat". In the case of a project management application, this would be a "project". The second argument given to the `chargePerSeat` method should be a closure that accepts the billable model and returns the current number of "seats" occupied by that model.

After configuring per-seat billing, Spark will automatically update your billing portal to inform users that billing is calculated on a per-seat basis.
