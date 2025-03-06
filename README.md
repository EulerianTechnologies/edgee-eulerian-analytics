# Eulerian Analytics

Adds Eulerian Analytics tracking code to your Edgee. Supports many tracking features.

## Description 

> Connects Eulerian Analytics to Edgee
> Easily add Eulerian Analytics to your web pages

This module enables Eulerian Analytics for your entire Edgee platform. Lightweight and fast with plenty of great features.

### Enable Eulerian Analytics ###

Steps to enable Eulerian Analytics :

1. Follow [this guide](https://eulerian.io) to create a free Eulerian Analytics account
2. During account creation, you'll get a tracking domain & a website name
3. Add your new tracking domain target & website name to the module setting

Save changes and done. Wait a couple of minutes before viewing collected data in your Eulerian Analytics account.

### Feature Support ###

* Supports Page Tracking
* Supports User Tracking
* Supports Event Tracking

### Privacy ###

Please visit Privacy Center in Eulerian Analytics to configure privacy
management and data collection level depending on your specific compliance &
privacy rules.

## Installation

### How to install the module ###

1. Create an free account on [Eulerian Analytics](https://eulerian.io)
2. Once the process is done the welcome email will provide you with a 3rd party tracking domain (eg: io1.eulerian.net), you will also have a website name
3. Enable the module eulerian-analytics in your Edgee account.
4. In the Settings panel provide the tracking domain & website name that was provided in your welcome email.
5. Save and you are all setup !

Example :
- trackingTarget : can be io1 if your tracking domain is io1.eulerian.net
- website : can be my-website for example

After a couple of minutes, you can log into your Eulerian Analytics account and view your site statistics.


## Frequently Asked Questions 


**How to enable Eulerian Analytics ?**

Check out the top of this page, first section provides the steps to add Eulerian Analytics to your site.


**Got a question?**

To ask a question, suggest a feature, or provide feedback, [contact me directly](am@eulerian.com). Learn more about [Eulerian Analytics](https://www.eulerian.com/).


## Changelog 

*Thank you to everyone who shares feedback for Eulerian Analytics!*

**20250306**

* Manage IAB TCFv2 TCString through properties.gdpr_consent
* Default TCString depending on consent status

**20250228**

* Migrate from snake_case to camelCase
* Better default for url parameter
* Merge PR#1 for wit updates

**20250219**

* Add X-Forwarded-For & User-Agent headers

**20250218**

* First release
