# Events

[[toc]]

Cashier dispatches several [events](https://laravel.com/docs/events) that you may intercept and handle based on your application's needs. We will describe each of these events below.

## `Laravel\Paddle\Events\SubscriptionCreated`

This event is dispatched when a subscription is created with a status of `trialing` or `active`.

## `Laravel\Paddle\Events\SubscriptionUpdated`

This event is dispatched when a subscription is changed. Possible changes include plan changes, quantity changes, pausing a subscription, or resuming a subscription.

## `Laravel\Paddle\Events\SubscriptionCancelled`

This event is dispatched when a subscription expires. This happens when a paused or cancelled subscription is no longer within its cancellation "grace period".

### Grace Periods and Paused Subscriptions

When a subscription is cancelled, Cashier will pause the subscription and set the subscription's `paused_from` column in your database and keep the user active. This is done because a user is typically allowed to continue using an application until the end of their billing cycle. The user status will remain active until the paused_from date has elapsed; When this happens, paddle will dispatch an event to indicate that the subscription status is now paused.
