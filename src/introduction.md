# Introduction

[[toc]]

## Laravel Spark

Laravel Spark is the perfect starting point for your next big idea. When combined with a Laravel application starter kit like [Laravel Jetstream](https://jetstream.laravel.com) or [Laravel Breeze](https://laravel.com/docs/starter-kits), or the frontend of your choice, Spark provides a well-designed billing management panel for your application. Spark, which is built on the power of [Laravel Cashier](https://laravel.com/docs/billing), allows your customers to subscribe to monthly or yearly billing plans, manage their payment method, update their subscription plans, and download their invoices all from a self-contained, beautifully designed billing portal.

<iframe width="600" height="337" src="https://www.youtube.com/embed/-wAmFagQSzI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Supported Payment Providers

Spark supports two payment providers, and purchasing a Spark license grants you the ability to use either of these payment providers. **At this time, it is not possible to implement your own custom payment provider when using Spark.** We'll provide a brief overview of each provider below.

### Paddle

[Paddle](https://paddle.com) is a robust billing provider that serves as a merchant of record for your application. Paddle removes the burden of tax compliance from your SaaS business by handling the complexity of gathering and paying your VAT for you. In addition, Paddle provides support for accepting payments from your customers via credit card or PayPal, localized pricing, and hosted invoices.

Spark's Paddle support is provided by the underlying [Laravel Cashier Paddle](https://laravel.com/docs/cashier-paddle) library.

:::warning Paddle Account Approval

Your Paddle account must be approved by Paddle before you can begin using Spark. To apply for an account, please visit the [Paddle website](https://paddle.com). **While you are developing your application, you may use the [Paddle Sandbox](https://sandbox-vendors.paddle.com/)**.
:::

### Stripe

[Stripe](https://stripe.com) is a global leader in payment infrastructure with direct integration with card networks and banks, a fast-improving platform, and battle-tested reliability. In addition, intelligent optimizations help increase revenue across conversion, prevent fraud, and assist with revenue recovery. Finally, Stripe provides a robust sandbox environment for you to test your application's payment system.

Spark's Stripe support is provided by the underlying [Laravel Cashier Stripe](https://laravel.com/docs/billing) library.

## Frequently Asked Questions

#### **Is it possible to upgrade an application from Spark Classic to Spark?**

No. However, we will continue to provide bug fixes and security updates to Spark Classic indefinitely.

#### **Can I sell Spark powered applications?**

You may not sell Spark powered applications on code distribution platforms such as Code Canyon, etc. However, if you build a SaaS application / business which is later acquired by a private third-party, you may transfer your Spark license to that buyer.

#### **Does Spark support any other payment providers?**

No. Spark only supports Stripe and Paddle and it is not possible for developers to customize Spark to accept additional providers. If you need to use another payment provider **you should not purchase Laravel Spark**.

#### **Am I required to use Tailwind / Blade / Vue / etc. in order to use Spark?**

No. Spark's billing portal is totally isolated from the rest of your Laravel application and includes its own pre-compiled frontend assets. Your own application may be built using the frontend technologies of your choice.

#### **Why are my customers presented with a payment confirmation screen?**

Extra verification is sometimes required in order to confirm and process a payment. When this happens, Paddle or Stripe will present a payment confirmation screen. Payment confirmation screens presented by Paddle, Stripe, or Spark may be tailored to a specific bank or card issuer's payment flow and can include additional card confirmation, a temporary small charge, separate device authentication, or other forms of verification.
