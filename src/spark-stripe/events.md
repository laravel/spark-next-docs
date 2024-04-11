# Events

[[toc]]

Spark dispatches several [events](https://laravel.com/docs/events) that you may intercept and handle based on your application's needs. We will describe each of these events below.

## `Spark\Events\SubscriptionCreated`

This event is dispatched when a subscription becomes `active`. The event's public properties include `$billable` and `$subscription`.

## `Spark\Events\SubscriptionUpdated`

This event is dispatched when a subscription is changed. Possible changes include plan changes, quantity changes, pausing a subscription, or resuming a subscription. The event's public properties include `$billable` and `$subscription`.

## `Spark\Events\SubscriptionCancelled`

This event is dispatched when a subscription expires. This happens when a paused or cancelled subscription is no longer within its cancellation "grace period". The event's public properties include `$billable` and `$subscription`.

## `Spark\Events\PaymentSucceeded`

This event is dispatched when a new Stripe invoice is created. The event's public properties include `$billable` and `$invoice`.

## Grace Periods

When a subscription is cancelled, Cashier will automatically set the subscription's `ends_at` column in your database. This column is used to know when the billable's `subscribed` method should begin returning `false`. For example, if a customer cancels a subscription on March 1st, but the subscription was not scheduled to end until March 5th, the `subscribed` method will continue to return `true` until March 5th. This is done because a user is typically allowed to continue using an application until the end of their billing cycle.
