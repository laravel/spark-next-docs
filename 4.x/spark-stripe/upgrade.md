# Upgrade

[[toc]]

## Upgrading To Spark (Stripe) 4.0 From 3.x

Spark (Stripe) 4.0 continues to improve the Stripe Checkout experience.

### Discounts & Promotion Codes

Promotion codes are now collected by Stripe Checkout when subscribing. Since Stripe Checkout doesn't allow the use of legacy "discount codes", customers will only be able to use promotion codes when initiating subscriptions.

Customers will still be able to use legacy discount codes as well as promotion codes in the billing portal after subscribing. However, since Stripe has deprecated discount codes, we encourage you to use promotion codes in all new applications.

### Terms & Conditions

When starting new subscriptions, acceptance of your application's "terms and conditions" is now handled by Stripe Checkout. If you have the `Features::mustAcceptTerms()` feature enabled, you are now required to provide your terms and conditions URL in the [public settings of your Stripe dashboard](https://dashboard.stripe.com/settings/public).
