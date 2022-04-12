# Upgrade

[[toc]]

## Upgrading to Spark (Paddle) 2.0 From v1.x

Spark (Paddle) 2.0 is a maintenance release with no breaking changes. To upgrade, simply update your application's `composer.json` file to depend on the latest release:

```json
"require": {
    "php": "^8.0",
    "laravel/framework": "^9.0",
    "laravel/spark-paddle": "^2.0"
},
```

### Minimum Versions

The following required dependency versions have been updated:

- The minimum Laravel version is now v9.0
- The minimum PHP version is now v8.0
