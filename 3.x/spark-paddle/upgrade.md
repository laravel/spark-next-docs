# Upgrade

[[toc]]

## Upgrading to Spark (Paddle) 3.0 From v2.x

### Removed Events

Spark Paddle's own events were removed in favor of Cashier Paddle's events. You can update them like so:

```diff
-Spark\Events\SubscriptionCreated
-Spark\Events\SubscriptionUpdated
-Spark\Events\SubscriptionDeleted
+Laravel\Cashier\Events\SubscriptionCreated
+Laravel\Cashier\Events\SubscriptionUpdated
+Laravel\Cashier\Events\SubscriptionDeleted
```
