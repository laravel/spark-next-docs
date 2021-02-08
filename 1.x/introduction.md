# Introduction

[[toc]]

## Laravel Spark

Laravel Spark is the perfect starting point for your next big idea. When combined with a Laravel application starter kit like [Laravel Jetstream](https://jetstream.laravel.com) or [Laravel Breeze](https://laravel.com/docs/starter-kits), or the frontend of your choice, Spark provides a well-designed billing management panel for your application. Spark, which is built on the power of [Laravel Cashier](https://laravel.com/docs/billing), allows your customers to subscribe to monthly or yearly billing plans, manage their payment method, update their subscription plans, and download their receipts all from a self-contained, beautifully designed billing portal.

## Supported Payment Providers

Spark supports two payment providers, and purchasing a Spark license grants you the ability to use either of these payment providers. **At this time, it is not possible to implement your own custom payment provider when using Spark.** We'll provide a brief overview of each provider below.

### Paddle

[Paddle](https://paddle.com) is a robust billing provider that serves as a merchant of record for your application. Paddle removes the burden of tax compliance from your SaaS business by handling the complexity of gathering and paying your VAT for you. In addition, Paddle provides support for accepting payments from your customers via credit card or PayPal, localized pricing, and hosted invoices.

Spark's Paddle support is provided by the underlying [Laravel Cashier Paddle](https://laravel.com/docs/cashier-paddle) library.

:::warning Paddle Account Approval

Your Paddle account must be approved by Paddle before you can begin using Spark. To apply for an account, please visit the [Paddle website](https://paddle.com).
:::

#### Limitations

We have listed some known limitations of using the Paddle payment provider below:

- When a recurring coupon is used while subscribing to a plan, the coupon discount will be applied on every billing cycle. However, if the subscription's quantity or plan changes, Paddle will remove the coupon from the subscription.

### Stripe

[Stripe](https://stripe.com) is a global leader in payment infrastructure with direct integration with card networks and banks, a fast-improving platform, and battle-tested reliability. In addition, intelligent optimizations help increase revenue across conversion, prevent fraud, and assist with revenue recovery. Finally, Stripe provides a robust sandbox environment for you to test your application's payment system.

Spark's Stripe support is provided by the underlying [Laravel Cashier Stripe](https://laravel.com/docs/billing) library.

#### Limitations

We have listed some known limitations of using the Paddle payment provider below:

- The Stripe payment provider does not provide a PayPal integration.

## Frequently Asked Questions

#### **Is it possible to upgrade an application from Spark Classic to Spark?**

No. However, we will continue to provide bug fixes and security updates to Spark Classic indefinitely.

#### **Does Spark support any other payment providers?**

No. Spark only supports Stripe and Paddle and it is not possible for developers to customize Spark to accept additional providers. If you need to use another payment provider **you should not purchase Laravel Spark**.

#### **Am I required to use Tailwind / Blade / Vue / etc. in order to use Spark?**

No. Spark's billing portal is totally isolated from the rest of your Laravel application and includes its own pre-compiled frontend assets. Your own application may be built using the frontend technologies of your choice.
