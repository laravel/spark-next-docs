# Upgrade

[[toc]]

## Upgrading to Spark (Paddle) 3.0 from 2.x

### Removed Events

Spark's own events were removed in favor of using Cashier's events directly. You should update any reference to these events to their Cashier equivalents:

```diff
-Spark\Events\SubscriptionCreated
-Spark\Events\SubscriptionUpdated
-Spark\Events\SubscriptionDeleted
+Laravel\Cashier\Events\SubscriptionCreated
+Laravel\Cashier\Events\SubscriptionUpdated
+Laravel\Cashier\Events\SubscriptionDeleted
```
