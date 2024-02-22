# README

## Table of Contents

- [Analytics setup](#analytics-setup)
  - [GTM - Setup](#gtm---setup)
  - [GTM - Consent and GA4](#gtm---consent-and-ga4)
    - [Tags](#tags)
    - [Consent Triggers](#consent-triggers)
    - [Consent Variables](#consent-variables)
  - [GTM - Conversion tracking](#gtm---conversion-tracking)
    - [Conversion Tags](#conversion-tags)
    - [Conversion Triggers](#conversion-triggers)
  - [Consent banner](#consent-banner)

## Analytics setup

To track various events for the ODD landing we use Google Analytics. The setup is done using Google Tag Manager (GTM) and Google Analytics 4 (GA4).

The GTM container is embedded in the ODD landing page and allows us to deploy:

- Google Analytics 4 (GA4) tag - to track page views
- Google Analytics 4 (GA4) event tags - to track various events
- Cookie consent tag - to manage cookie consent

All without the need to modify the ODD landing page every time we want to track a new event or change the tracking setup.

### GTM - Setup

The backup of the GTM container is available [here](./analytics/GTM-TV7DJZGX_v6.json).

### GTM - Consent and GA4

These tags, triggers, and variables are used to manage cookie consent and activate Google Analytics 4 (GA4) based on the user's consent status.

This configuration is largely inspired by this [guide](http://archive.today/yImIg).

#### Tags

- **Google Analytics GA4 Configuration**: This tag is used to configure Google Analytics GA4. It has the tagId `G-TZ89Q59P3P`.

- **Custom Cookie Banner**: This tag is used to display a custom cookie consent banner on the website and set cookies based on the user's consent.

- **Consent Mode | Update Consent**: This tag is used to update the consent status of the user in all GA4 tags.

- **GTM Consent Update**: This tag is used to update the GTM consent status. It includes a script to push an `gtm-consent-updated` event to the dataLayer.

#### Consent Triggers

| Name | Triggered When |
|---|---|
| **Client Consent Update** | Triggered when the client consent status is updated. By expecting the `client-consent-update` event. |
| **GTM Consent Updated** | Triggered when the GTM consent status is updated. By expecting the `gtm-consent-updated` event. |

#### Consent Variables

These are used to track consent.

| Name | Type | Description |
|-|-|-|
| Consent Cookie | Cookie | Used to store the user's consent status. Reads cookie under the name `cc_cookie` (which is set by the cookie consent banner).|
| Consent - Analytics  | JavaScript Macros | Checks the `Consent Cookie` for `analytics` consent and returns `granted` if consent is given, otherwise `denied`.|
| Consent - Preferences| JavaScript Macros | Checks the `Consent Cookie` for `preferences` consent and returns `granted` if consent is given, otherwise `denied`.|
| Consent - Marketing  | JavaScript Macros | Checks the `Consent Cookie` for `marketing` consent and returns `granted` if consent is given, otherwise `denied`. |

### GTM - Conversion tracking

These are used to send events to Google Analytics 4 (GA4) when a user interacts with the ODD landing page.

The guide for setting up the GA4 events is available [here](https://www.youtube.com/watch?v=D8Cria0ojTU).

#### Conversion Tags

| Name | Type | Description |
|---|---|---|
| **GA4 \| Button click** | Google Analytics: GA4 Event | Triggers on certain events and sends `select_content` event with parameters like `content_id`, `content_type`, `location_id` to GA4. |
| **GA4 \| Lead event** | Google Analytics: GA4 Event | Triggered when a user submits a form. Sends `generate_lead` event with parameters like `value`, `currency`, `transaction_id` to GA4. |

#### Conversion Triggers

| Name | Triggered When |
|---|---|
| **Click \| All Elements** | Triggered on all element clicks. Used for debugging and adding new triggers. |
| **Landing \| Explore Demo** | Triggered when **Click Text** Matches `Explore Demo`. |
| **Landing \| Deploy & Try** | Triggered when **Click Text** Matches `Deploy & Try`. |
| **Landing \| Watch video** | Triggered when **Click Text** Matches `Watch video`. |
| **Landing \| Schedule call** | Triggered when **Click Text** Matches `Schedule call`. |
| **Landing \| Join ODD Slack channel** | Triggered when **Click Text** Matches `Join ODD Slack channel`. |
| **Landing \| Create an issue** | Triggered when **Click Text** Matches `Create an issue`. |
| **Landing \| Main Repository** | Triggered when **Click Text** Matches `Main Repository`. |

### Consent banner

We use cookie consent to comply with various privacy laws. The cookie consent is implemented  using open-source banner [Cookie Consent by Orestbida](https://github.com/orestbida/cookieconsent).

The backup of the cookie consent banner configuration is available [here](./analytics/consent-banner.html).
