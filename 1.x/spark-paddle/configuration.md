# Configuration

[[toc]]

## Introduction

In the following documentation, we will discuss how to configure a Laravel Spark installation when using the Paddle payment provider. All of Spark's configuration options are housed in your application's `config/spark.php` configuration file.

## Configuring Billables

Spark allows you to define the types of billable entities that your application will be managing. Most commonly, applications bill individual users for monthly and yearly subscription plans. However, your application may choose to bill some other type of entity, such as a team, organization, band, etc.

You may define your billable entities within the `billables` array of your application's `spark` configuration file. By default, this array contains an entry for the `App\Models\User` model of your application.

Before continuing, you should ensure that the model class that corresponds to your billable entity is using the `Laravel\Spark\Billable` trait:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Spark\Billable;

class User extends Authenticatable
{
    use Billable, HasFactory, Notifiable;
}
```

### Billable Slugs

As you may have noticed, each entry in the `billables` configuration array has a "slug" key that is a shortened form of the billable model class. This slug will be used when accessing the Spark customer billing portal, such as `https://example.com/billing/user` or `https://example.com/billing/team`.

### Billable Authorization

Next, you should define the authorization callbacks that Spark will use to determine if the currently authenticated user of your application is authorized to view the billing portal for a particular billable entity.

TODO: ... Where should this go? SparkServiceProvider?

## Configuring Payment Plans

Each billable configuration within the `billables` array contains a `plans` array. Within this array you may configure each of the billing plans offered by your application. The `monthly_id` and `yearly_id` identifiers should correspond to the plan identifiers configured within your Paddle account dashboard.

In addition, you are free to supply a short description of the plan and a list of features relevant to the plan. This information will be displayed in the Spark billing portal.
