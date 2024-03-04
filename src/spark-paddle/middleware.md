# Middleware

[[toc]]

When building a subscription based application, you will commonly need to restrict access to certain routes to users that have an active subscription. For example, you may not want to let a user create a project if they are not subscribed to a billing plan. For that reason, Spark provides a convenient subscription verification [middleware](https://laravel.com/docs/middleware) that you may use in your application's routes.

If your application uses Laravel 11's new application structure, where the `bootstrap/app.php` file is used to configure the application, then the Spark's subscription verification middleware alias is automatically registered for you. However, if you are using an application structure that does not include the `bootstrap/app.php` file, you may need to manually register the `subscribed` middleware alias in your application's `App\Http\Kernel` class:

```php
use Spark\Http\Middleware\VerifyBillableIsSubscribed;

protected $middlewareAliases = [
    // ...

    'subscribed' => VerifyBillableIsSubscribed::class
];
```

Finally, you may attach the `subscribed` middleware to any of your application's route definitions:

```php
Route::post('/projects', [ProjectController::class, 'store'])
        ->middleware(['auth', 'subscribed']);
```

If the user has a valid subscription, the request will continue to execute normally. However, if the user does not have an valid subscription, they will be redirected to your application's Spark billing portal. If the request is an XHR request, a response with a 402 HTTP status code will be returned to the client.

:::tip Manually Inspecting Subscription States

Of course, you may always manually inspect a billable model's subscription status using the [methods provided by Laravel Cashier](https://laravel.com/docs/cashier-paddle#checking-subscription-status), which can be especially useful for verifying that a user is subscribed to a particular plan.
:::
