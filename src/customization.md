# Customization

[[toc]]

## Custom Information Messages

When redirecting to your application's billing portal, you may provide an optional, informational message to give the user context regarding why they are being redirected to the portal. For example, you may provide a message indicating that their subscription has expired.

To provide a message, simply provide a `message` query string parameter to the billing portal. The provided message will appear at the top of your application's billing portal:

```
http://localhost/billing?message=Hello+World
```
