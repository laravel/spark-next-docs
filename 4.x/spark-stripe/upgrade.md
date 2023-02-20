# Upgrade

[[toc]]

## Upgrading to Spark (Stripe) 4.0 from 3.x

Spark (Stripe) 4.0 improves the Stripe Checkout experience even further.

### Discounts and Promotion Codes

From now on, promotion codes are handled by Stripe Checkout when subscribing. Because Stripe Checkout doesn't allows the use of legacy Discount codes anymore, customers will only be able to use promotion codes when starting new subscriptions.

Customers will still be able to use legacy Discount codes as well as promotion codes in the checkout field on the billing portal after subscribing. Nevertheless, we encourage you to make use of promotion codes in the future.

### Terms and Conditions

From now on, accepting terms and conditions is handled by Stripe Checkout when starting new subscriptions. If you have the `Features::mustAcceptTerms()` enabled, you're now required to fill out your terms and conditions link in [the public settings of your Stripe dashboard](https://dashboard.stripe.com/settings/public).
