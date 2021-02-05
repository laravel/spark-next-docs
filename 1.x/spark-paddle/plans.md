# Plans

[[toc]]

## Configuring Payment Plans

Each billable configuration within the `billables` array contains a `plans` array. Within this array you may configure each of the billing plans offered by your application. The `monthly_id` and `yearly_id` identifiers should correspond to the plan identifiers configured within your Paddle account dashboard.

In addition, you are free to supply a short description of the plan and a list of features relevant to the plan. This information will be displayed in the Spark billing portal.