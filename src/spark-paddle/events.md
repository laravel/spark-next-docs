# Events

[[toc]]

Cashier dispatches several [events](https://laravel.com/docs/events) that you may intercept and handle based on your application's needs. We will describe each of these events below.

## `Laravel\Paddle\Events\SubscriptionCreated`

This event is dispatched when a subscription is created with a status of `trialing` or `active`.

## `Laravel\Paddle\Events\SubscriptionUpdated`

This event is dispatched when a subscription is changed. Possible changes include plan changes, quantity changes, pausing a subscription, or resuming a subscription.

## `Laravel\Paddle\Events\SubscriptionCancelled`

This event is dispatched when a subscription expires. This happens when a paused or cancelled subscription is no longer within its cancellation "grace period".

## Grace Periods

When a subscription is cancelled, Cashier will automatically set the subscription's `ends_at` column in your database. This column is used to know when the billable's `subscribed` method should begin returning `false`. For example, if a customer cancels a subscription on March 1st, but the subscription was not scheduled to end until March 5th, the `subscribed` method will continue to return `true` until March 5th. This is done because a user is typically allowed to continue using an application until the end of their billing cycle.
