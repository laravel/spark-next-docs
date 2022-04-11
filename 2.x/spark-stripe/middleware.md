# Middleware

[[toc]]

When building a subscription based application, you will commonly need to restrict access to certain routes to users that have an active subscription. For example, you may not want to let a user create a project if they are not subscribed to a billing plan. For that reason, Spark provides a convenient subscription verification [middleware](https://laravel.com/docs/middleware) that you may register with your application.

To get started, register Spark's subscription verification middleware in your HTTP kernel's `$routeMiddleware` array. Your application's HTTP kernel is typically located at `app/Http/Kernel.php`:

```php
use Spark\Http\Middleware\VerifyBillableIsSubscribed;

protected $routeMiddleware = [
    // ...
    'subscribed' => VerifyBillableIsSubscribed::class
];
```

Once the middleware has been registered, you may attach it to any of your application's route definitions:

```php
Route::post('/projects', [ProjectController::class, 'store'])
        ->middleware(['auth', 'subscribed']);
```

If the user has an active subscription, the request will continue to execute normally. However, if the user does not have an active subscription, they will be redirected to your application's Spark billing portal. If the request is an XHR request, a response with a 402 HTTP status code will be returned to the client.

:::tip Manually Inspecting Subscription States

Of course, you may always manually inspect a billable model's subscription status using the [methods provided by Laravel Cashier](https://laravel.com/docs/billing#checking-subscription-status), which can be especially useful for verifying that a user is subscribed to a particular plan.
:::