/*
 * This file is part of Privacy Badger <https://privacybadger.org/>
 * Copyright (C) 2014 Electronic Frontier Foundation
 *
 * Privacy Badger is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Privacy Badger is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Privacy Badger.  If not, see <http://www.gnu.org/licenses/>.
 */

/* eslint-env browser, jquery */

import { isIPv4, isIPv6, getBaseDomain } from "../lib/basedomain.js";

import constants from "./constants.js";

const i18n = chrome.i18n;

function escape_html(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

let htmlUtils = {

  // default Tooltipster config
  TOOLTIPSTER_DEFAULTS: {
    delay: 100,
    // allow per-instance option overriding
    functionInit: function (instance, helper) {
      let dataOptions = helper.origin.dataset.tooltipster;

      if (dataOptions) {
        try {
          dataOptions = JSON.parse(dataOptions);
        } catch (e) {
          console.error(e);
        }

        for (let name in dataOptions) {
          instance.option(name, dataOptions[name]);
        }
      }
    },
  },

  /**
   * Gets localized description for given domain and action.
   *
   * @param {String} action the action to get description for
   * @param {String} fqdn the domain to get description for
   * @param {?Array} [blockedFpScripts]
   *
   * @returns {String} the description
   */
  getActionDescription: (function () {

    const messages = {
      block: i18n.getMessage('badger_status_block', "XXX"),
      cookieblock: i18n.getMessage('badger_status_cookieblock', "XXX"),
      blockedScripts: i18n.getMessage('badger_status_blocked_scripts', "XXX"),
      noaction: i18n.getMessage('badger_status_noaction', "XXX"),
      allow: i18n.getMessage('badger_status_allow', "XXX"),
      dntTooltip: i18n.getMessage('dnt_tooltip')
    };

    return function (action, fqdn, blockedFpScripts) {
      if (action.startsWith('user')) {
        action = action.slice(5);
      }

      if (action == constants.DNT) {
        return messages.dntTooltip;
      }

      if (blockedFpScripts) {
        return messages.blockedScripts.replace("XXX", fqdn);
      }

      const rv_action = messages[action];

      if (!rv_action) {
        return fqdn;
      }

      return rv_action.replace("XXX", fqdn);
    };

  }()),

  /**
   * Gets HTML for domain action toggle switch.
   *
   * @param {String} fqdn the domain to get toggle for
   * @param {String} action the current action of given domain
   *
   * @returns {String} the HTML for toggle switch
   */
  getToggleHtml: (function () {

    function is_checked(input_action, action) {
      if (action == constants.NO_TRACKING || action == constants.DNT) {
        action = constants.ALLOW;
      }
      return (input_action === action ? 'checked' : '');
    }

    let tooltips = {
      block: i18n.getMessage('domain_slider_block_tooltip'),
      cookieblock: i18n.getMessage('domain_slider_cookieblock_tooltip'),
      allow: i18n.getMessage('domain_slider_allow_tooltip')
    };

    return function (fqdn, action) {
      let id = fqdn.replace(/\./g, '-');
      return `
<div class="switch-container ${action}">
  <div class="switch-toggle switch-3 switch-candy">
    <input id="block-${id}" name="${fqdn}" value="${constants.BLOCK}" type="radio" aria-label="${tooltips.block}" ${is_checked(constants.BLOCK, action)}>
    <label title="${tooltips.block}" class="tooltip" for="block-${id}"></label>
    <input id="cookieblock-${id}" name="${fqdn}" value="${constants.COOKIEBLOCK}" type="radio" aria-label="${tooltips.cookieblock}" ${is_checked(constants.COOKIEBLOCK, action)}>
    <label title="${tooltips.cookieblock}" class="tooltip" for="cookieblock-${id}"></label>
    <input id="allow-${id}" name="${fqdn}" value="${constants.ALLOW}" type="radio" aria-label="${tooltips.allow}" ${is_checked(constants.ALLOW, action)}>
    <label title="${tooltips.allow}" class="tooltip" for="allow-${id}"></label>
    <a></a>
  </div>
</div>
      `.trim();
    };

  }()),

  /**
   * Returns the HTML for the EFF's Do Not Track policy compliance declaration icon.
   * @returns {String}
   */
  getDntIconHtml: (function () {
    let dnt_icon_url = chrome.runtime.getURL('/icons/dnt-16.png');
    return function () {
      return `
      <div class="dnt-compliant">
        <a target=_blank href="https://privacybadger.org/#-I-am-an-online-advertising-tracking-company.--How-do-I-stop-Privacy-Badger-from-blocking-me"><img src="${dnt_icon_url}"></a>
      </div>
      `.trim();
    };
  }()),

  /**
   * Generates HTML for given FQDN.
   *
   * @param {String} fqdn the FQDN to get HTML for
   * @param {String} action the action for given FQDN
   * @param {Boolean} [show_breakage_warning]
   * @param {Boolean} [show_breakage_note]
   * @param {?Array} [blockedFpScripts]
   *
   * @returns {String} the slider HTML for the FQDN
   */
  // TODO origin --> domain/FQDN
  getOriginHtml: (function () {

    const breakage_warning_tooltip = i18n.getMessage('breakage_warning_tooltip'),
      undo_arrow_tooltip = i18n.getMessage('feed_the_badger_title');

    return function (fqdn, action, show_breakage_warning, show_breakage_note, blockedFpScripts) {
      action = escape_html(action);
      fqdn = escape_html(fqdn);

      // Get classes for main div.
      let classes = ['clicker'];
      // show warning when manually blocking a domain
      // that would have been cookieblocked otherwise
      if (show_breakage_warning) {
        classes.push('show-breakage-warning');
      }
      if (show_breakage_note) {
        classes.push('breakage-note');
      }
      // manually-set sliders get an undo arrow
      if (action.startsWith('user')) {
        classes.push('userset');
        action = action.slice(5);
      }

      // show the DNT icon for DNT-compliant domains
      let dnt_html = '';
      if (action == constants.DNT) {
        dnt_html = htmlUtils.getDntIconHtml();
      }

      let shield_icon = '';
      if (blockedFpScripts) {
        shield_icon = '<span class="ui-icon ui-icon-shield"></span>';
      }

      // construct HTML for domain
      let domain_tooltip = htmlUtils.getActionDescription(action, fqdn, blockedFpScripts);

      // !! EXPLANATIONS DICTIONARY !!
      const explanationsDict = {
        'adobetarget.data.adobedc.net': 'This tracker is part of Adobe Target, a tool that helps websites test and personalize content for visitors. It monitors user behavior to deliver tailored experiences, such as showing different versions of a webpage to see which performs better.',
        'static.cloudflareinsights.com': 'This tracker is part of Cloudflare Web Analytics, a privacy-focused tool that helps website owners understand site performance and visitor behavior without using cookies or collecting personal data.',
        'cdn.cookielaw.org': 'This tracker is part of OneTrust\'s cookie consent management platform, helping websites comply with privacy laws by displaying cookie banners and storing user consent preferences.',
        'dpm.demdex.net': 'This tracker is part of Adobe Audience Manager. It helps websites identify and track visitors across different sites by assigning a unique ID to each user. This enables personalized advertising and content based on user behavior.',
        'www.googletagmanager.com': 'This tracker is part of Google Tag Manager, a tool that helps website owners manage and deploy marketing and analytics tags without modifying the website\'s code. It allows for efficient tracking of user interactions and site performance.',
        'js-agent.newrelic.com': 'This tracker is part of New Relic\'s Browser Agent, which helps website owners monitor and improve site performance by collecting data on page load times, user interactions, and errors.',
        'www.youtube.com': 'This tracker is part of YouTube\'s video embedding service. When a YouTube video is embedded on a website, this tracker can collect data on user interactions with the video, such as views, likes, and watch time, even if the video isn\'t played. This helps YouTube gather analytics and serve personalized ads.',
        'img.youtube.com': 'This tracker is associated with YouTube and is used to load images and thumbnails for video previews.',
        'accounts.google.com': 'This tracker is used by Google to manage user authentication and account management across various services.',
        'www.google.com': 'This tracker connects websites to Google\'s search engine and various services, including ads and analytics.',
        'fonts.gstatic.com': 'This tracker is used to serve fonts for websites that use Google Fonts for typography.',
        'www.gstatic.com': 'This tracker is used by Google to serve various static resources like images, scripts, and other content for Google services.',
        'id.rlcdn.com': 'This tracker is used by Revcontent, a native advertising network, for delivering personalized ads based on user behavior.',
        'p.typekit.net': 'This tracker is used by Adobe Typekit to deliver fonts and typography for websites that use Adobe Fonts.',
        'use.typekit.net': 'This tracker is used by Adobe Typekit to load fonts on websites that use Adobe Fonts, a service to improve typography on webpages.',
        'connect.facebook.net': 'This tracker connects websites to Facebook’s ad and tracking tools. It enables things like the Facebook Like button and retargeting ads.',
        'dlthst9q2beh8.cloudfront.net': 'This tracker is used to serve content over Amazon CloudFront, a content delivery network (CDN). It often serves resources like images or scripts, but it may also be used for tracking purposes.',
        'cdn0.forter.com': 'This tracker is used by Forter, a fraud prevention service that helps e-commerce websites identify and prevent fraudulent transactions.',
        'cdn3.forter.com': 'Similar to `cdn0.forter.com`, this tracker is also part of Forter’s fraud detection service. It is used to assess the risk of fraudulent transactions in real-time during online purchases.',
        'cbf12a88ccce.cdn4.forter.com': 'This tracker is part of the Forter fraud prevention network, helping e-commerce businesses detect and prevent fraudulent transactions.',
        'js-agent.newrelic.com': 'This tracker is used by New Relic to collect performance data about websites, helping developers monitor and optimize the site\'s speed and user experience.',
        'p.typekit.net': 'This tracker is used by Adobe Typekit to deliver web fonts on websites. It helps improve typography and user experience across different platforms.',
        'googleads.g.doubleclick.net': 'This tracker is part of Google\'s advertising ecosystem. It collects behavioral data to personalize ads and measure their effectiveness. It\'s heavily used for retargeting and conversion tracking.',
        'static.doubleclick.net': 'This domain serves static resources like JavaScript libraries and configuration files for Google’s ad services. While it doesn’t collect data directly, it supports tracking functionality.',
        'ib.adnxs.com': 'Used by AppNexus (Xandr) for real-time bidding in online advertising. Collects user behavior and interests to serve targeted ads.',
        'cdn.adsafeprotected.com': 'Served by Integral Ad Science to assess the quality and safety of ad placements, including fraud detection and brand safety scoring.',
        'c.amazon-adsystem.com': 'Used by Amazon Advertising to track user interactions for targeting and analytics. Collects browsing history and interactions with Amazon ads.',
        'licensing.bitmovin.com': 'Used by Bitmovin\'s video player to validate license keys and monitor player usage for licensing compliance and analytics.',
        'pubads.g.doubleclick.net': 'A core domain in Google\'s ad delivery network (Ad Manager), used to serve and manage programmatic ads and collect performance data.',
        'securepubads.g.doubleclick.net': 'Secure version of Google’s DoubleClick ad delivery system, ensuring ads and tracking data are served over HTTPS.',
        'bea4.v.fwmrm.net': 'Used by FreeWheel (Comcast) for delivering video ads and tracking interactions. Supports targeted advertising within video streams.',
        'partner.googleadservices.com': 'This domain is part of Google\'s advertising infrastructure, used to manage ad campaigns and track conversions on advertiser websites.',
        'pagead2.googlesyndication.com': 'Delivers contextual and personalized ads on websites using Google AdSense. Also loads ad scripts and collects performance data.',
        'cdn.jsdelivr.net': 'A popular open-source content delivery network (CDN) for serving JavaScript libraries and other static assets.',
        'p8dn7fp1liosd47cq1r3sb455.litix.io': 'Part of a domain used by Microsoft Clarity or other session replay tools for behavioral analytics and heatmap generation.',
        'cdn.optimizely.com': 'Used by Optimizely to deliver A/B testing scripts and collect data on user behavior to optimize user experience and content.',
        '8512b548-2306-4976-a576-a880f2c35e4e.edge.permutive.app': 'Permutive is a real-time audience segmentation platform used by publishers to build privacy-compliant targeting without third-party cookies.',
        'live.rezync.com': 'Associated with Rezync, a data synchronization and personalization platform used in advertising and customer data platforms.',
        'pixel-us-east.rubiconproject.com': 'Rubicon Project (now Magnite) uses this pixel for ad bidding, user sync, and behavior tracking across the ad ecosystem.',
        'get.s-onetag.com': 'OneTag provides header bidding and monetization services. This domain supports script loading and analytics for ad performance.',
        'ads.stickyadstv.com': 'Used by StickyAds (a part of FreeWheel) for video ad delivery and programmatic ad transactions.',
        'eq97f.publishers.tremorhub.com': 'Tremor Video’s domain used for tracking ad interactions, measuring video ad performance, and enabling targeting.',
        'tag.wknd.ai': 'WKND.AI uses this tag to gather user interactions for AI-powered personalization and marketing automation.',
        'cdn.auth0.com': 'Auth0 is a platform for authentication and authorization. This tracker is used to manage user identity and session states for websites that integrate Auth0\'s authentication system.',
        'cl.k5a.io': 'This tracker is associated with K5, a data management platform (DMP) used for audience segmentation and ad targeting based on user behavior across websites.',
        'cl.k5a.io': 'This tracker is associated with K5, a data management platform (DMP) used for audience segmentation and ad targeting based on user behavior across websites.',
        'geolocation.onetrust.com': 'Onetrust is a Consent Management Platform (CMP). This tracker helps manage geolocation data for the purpose of presenting user-specific content and ads.',
        'tv2-cdn.relevant-digital.com': 'Relevant Digital provides advertising and content delivery solutions. This tracker is used to serve ads and track user interactions with TV2-related content.',
        'consent.cookiebot.com': 'Cookiebot is a platform that helps websites obtain and store user consent for cookies, enabling compliance with GDPR regulations.',
        'macro.adnami.io': 'Adnami is a platform for delivering immersive advertising formats. This tracker helps to serve dynamic ads based on user behavior.',
        'assets.adnuntius.com': 'Adnuntius is an advertising platform that provides ad services and helps with ad content optimization. This tracker manages the delivery and optimization of ads.',
        'www.clarity.ms': 'Microsoft Clarity is an analytics tool that tracks user behavior on websites through session replays and heatmaps.',
        'consentcdn.cookiebot.com': 'Cookiebot\'s Content Delivery Network (CDN) is used to serve cookie consent banners and manage the consent process for websites.',
        'imgsct.cookiebot.com': 'This tracker is part of Cookiebot\'s infrastructure to load and serve images related to the cookie consent banner.',
        'gadk.hit.gemius.pl': 'Gemius is a market research company that provides website analytics and user behavior tracking. This tracker helps monitor user activity and engagement on websites.',
        'cdn.jsdelivr.net': 'JSDelivr is a Content Delivery Network (CDN) that hosts open-source JavaScript libraries. This tracker is used to deliver web content quickly and efficiently to users.',
        'omny.fm': 'Omny is a podcast hosting and publishing platform. This tracker is used to manage podcast content delivery and user interaction with audio content.',
        'api.omny.fm': 'Omny\'s API is used to access podcast content and manage interactions with the hosted media. This tracker helps facilitate content access and user behavior monitoring.',
        'bt-cdn.relevant-digital.com': 'Relevant Digital serves advertising and content delivery solutions, using this tracker to deliver and optimize ad content across websites.',
        'cdnjs.cloudflare.com': 'Cloudflare\'s CDN is used to deliver JavaScript libraries and static content quickly across the web.',
        'stats.wordpress.com': 'Stats.wordpress.com is a tracker used by WordPress to collect website traffic data and user interaction metrics. It is part of the Jetpack plugin, which helps WordPress site owners analyze traffic and improve site performance.',
        'assets.queue-it.net': 'Queue-it is a virtual waiting room solution designed to manage website traffic during peak load times. This tracker is used to queue users until they can access the site.',
        'static.queue-it.net': 'This is a static resource for Queue-it\'s queue management solution, used to serve the waiting room interface during peak demand.',
        'counter.yadro.ru': 'Yandex is a Russian search engine that provides analytics and tracking services. This tracker is used to measure website traffic and track user interactions with websites that have implemented Yandex Metrica.',
        'www.googletagmanager.com': 'Google Tag Manager is used for managing and deploying marketing tags (such as analytics and advertising tags) on websites. It helps automate the process of adding, updating, and managing JavaScript and HTML tags.',
        'geolocation.onetrust.com': 'This tracker is part of OneTrust, used for managing geolocation data as part of a consent management solution. It helps websites comply with privacy regulations by enabling location-based services while obtaining user consent.',
        'privacyportal-eu.onetrust.com': 'This tracker is also part of OneTrust, specifically used to manage user privacy preferences in the European Union. It helps websites comply with GDPR by providing a platform for users to manage and control their data privacy settings.',
        'dc.services.visualstudio.com': 'This tracker is used by Microsoft Azure Application Insights to monitor and analyze the performance and usage of web applications. It helps developers track issues, errors, and performance metrics for websites and apps.',
        'edge.fullstory.com': 'This tracker is used by FullStory, a digital experience analytics tool that helps websites capture user interactions and behaviors to optimize user experience. It records user sessions for insights into how visitors engage with the site.',
        'owp.klarna.com': 'This tracker is used by Klarna, a payment service provider that allows users to buy now and pay later. It tracks user interactions with Klarna\'s payment system for processing transactions and providing a smooth payment experience.',
        'jssdkcdns.mparticle.com': 'This tracker is part of mParticle, a customer data platform that helps companies collect, integrate, and manage customer data across various channels. It is used to collect user interaction data for marketing and customer engagement.',
        'privacyportal-de.onetrust.com': 'This tracker is used by OneTrust, specifically for managing privacy preferences for users in Germany. It helps websites comply with data protection regulations such as the GDPR by providing a platform for users to manage their privacy settings.',
        'aax-eu.amazon-adsystem.com': 'This tracker is used by Amazon to serve personalized ads through its Amazon Advertising platform. It tracks user behavior to optimize the display of ads based on interests and previous interactions with Amazon.',
        'sb.scorecardresearch.com': 'This tracker is used by Scorecard Research, which provides audience measurement and web analytics services. It collects data to help analyze user behavior and demographic information for market research purposes.',
        'rum.hlx.page': 'This tracker is part of HLX (Hyperlocal), which helps manage web analytics and user interaction for news websites, focusing on delivering content at the local level and optimizing user engagement.',
        'one-to-one.bambuser.com': 'This tracker is used by Bambuser, a platform for live streaming and video commerce. It tracks user interactions during live video sessions to provide insights and analytics for streamers and advertisers.',
        'async-px-eu.dynamicyield.com': 'This tracker is used by Dynamic Yield, a personalization platform that provides on-site optimization and A/B testing tools. It tracks user interactions to personalize content and offers.',
        'cdn-eu.dynamicyield.com': 'This tracker is part of the Dynamic Yield network, which is used for delivering personalized content and conducting A/B tests based on user behavior data.',
        'st-eu.dynamicyield.com': 'This tracker is another part of the Dynamic Yield ecosystem, used specifically for providing user personalization and tracking across the European Union.',
        'coop.dk.ssl.sc.omtrdc.net': 'This tracker is part of Adobe Analytics, used to collect data on user interactions for websites. The \'sc.omtrdc.net\' domain is associated with Adobe\'s tracking servers.',
        'cdn.consentmanager.net': 'This domain is associated with Consentmanager, a Consent Management Platform (CMP) that helps websites comply with GDPR by managing user consents.',
        'delivery.consentmanager.net': 'This domain is used by Consentmanager to deliver consent-related scripts and manage user consent interactions on websites.',
        'b.delivery.consentmanager.net': 'A subdomain of Consentmanager used for delivering specific consent-related resources and managing user consent interactions.',
        'fast.a.klaviyo.com': 'This domain is used by Klaviyo for tracking user interactions and behaviors on websites, aiding in marketing automation and analytics.',
        'static.klaviyo.com': 'This domain serves static resources for Klaviyo\'s tracking scripts and forms, facilitating marketing automation and user engagement.',
        'static-forms.klaviyo.com': 'This domain is used by Klaviyo to serve static forms for user sign-ups and data collection, aiding in marketing efforts.',
        'static-tracking.klaviyo.com': 'This domain is utilized by Klaviyo to deliver static tracking scripts that monitor user interactions for marketing analytics.',
        'js.datadome.co': 'This domain is used by DataDome\'s JavaScript Tag, which collects behavioral data to detect and mitigate bot traffic on websites.',
        'privacyportal.onetrust.com': 'This domain is associated with OneTrust\'s privacy management platform, providing users access to privacy settings and data subject request forms.',
        'micro.rubiconproject.com': 'This domain is part of Magnite\'s (formerly Rubicon Project) advertising infrastructure, used for real-time bidding and ad delivery.',
        'cdns.gigya.com': 'This domain is used by Gigya (now part of SAP Customer Data Cloud) to serve content related to user identity and access management.',
        'cdns.eu1.gigya.com': 'This is the European regional content delivery domain for Gigya, serving identity management services to comply with regional data regulations.',
        'a26704082161.cdn.optimizely.com': 'This domain is used by Optimizely to deliver experiment variations and personalization content to users as part of A/B testing.',
        'logx.optimizely.com': 'This domain is used by Optimizely to log user interactions and experiment data for analysis and optimization purposes.',
        'js.datadome.co': 'Serves DataDome\'s JavaScript Tag, which collects behavioral data to detect and mitigate bot traffic on websites.',
        'privacyportal.onetrust.com': 'Provides users access to privacy settings and data subject request forms as part of OneTrust\'s privacy management platform.',
        'micro.rubiconproject.com': 'Part of Magnite\'s (formerly Rubicon Project) advertising infrastructure, used for real-time bidding and ad delivery.',
        'cdns.gigya.com': 'Used by Gigya (now part of SAP Customer Data Cloud) to serve content related to user identity and access management.',
        'cdns.eu1.gigya.com': 'European regional content delivery domain for Gigya, serving identity management services to comply with regional data regulations.',
        'a26704082161.cdn.optimizely.com': 'Used by Optimizely to deliver experiment variations and personalization content to users as part of A/B testing.',
        'logx.optimizely.com': 'Used by Optimizely to log user interactions and experiment data for analysis and optimization purposes.',
        'jysk.my.salesforce.com': 'Subdomain used by JYSK for Salesforce-hosted services, including CRM and customer support functionalities.',
        'd.la1-c2-frf.salesforceliveagent.com': 'Endpoint for Salesforce Live Agent, facilitating real-time chat support between customers and agents.',
        'd.la11-core1.sfdc-cehfhs.salesforceliveagent.com': 'Another endpoint for Salesforce Live Agent, used for managing live chat sessions and support interactions.',
        'widget.trustpilot.com': 'Serves Trustpilot\'s TrustBox widgets, displaying customer reviews and ratings on websites.',
        'www.google-analytics.com': 'Primary domain for Google Analytics, used to collect and analyze website traffic and user behavior data.',
        'app.usercentrics.eu': 'Usercentrics application domain for managing consent management platform (CMP) configurations.',
        'app.eu.usercentrics.eu': 'European-specific Usercentrics application domain for managing consent management platform (CMP) configurations.',
        'config.eu.usercentrics.eu': 'Domain used by Usercentrics to serve configuration data for the consent management platform.',
        'uct.eu.usercentrics.eu': 'Usercentrics domain for handling user consent transactions and storing consent decisions.',
        'consent-api.service.consent.eu1.usercentrics.eu': 'API endpoint for Usercentrics\' consent service, facilitating communication between the website and the CMP.',
        'fms.360yield.com': 'Part of 360Yield (by Media.net), this domain is involved in header bidding and ad placement optimization.',
        'www3.doubleclick.net': 'Legacy DoubleClick domain now part of Google Marketing Platform, used for serving and tracking ads.',
        'cmp.inmobi.com': 'InMobi Consent Management Platform (CMP) domain, used to handle GDPR-compliant consent for ad tracking.',
        'play.google.com': 'Google Play domain used for app store browsing, downloads, and tracking user engagement metrics.',
        'i0.wp.com': 'Image CDN for WordPress.com used to serve images quickly and efficiently from WordPress-hosted content.',
        's0.wp.com': 'Static content delivery for WordPress.com, including scripts, fonts, and CSS for website themes.',
        'stats.wp.com': 'Tracks user visits and behavior across WordPress.com and Jetpack-enabled sites using WordPress stats.',
        'cdn-4.convertexperiments.com': 'Used by Convert Experiences (A/B testing platform) to load experiments and personalization scripts.',
        'kit.fontawesome.com': 'Used to load Font Awesome icons via CDN from FontAwesome\'s kit service.',
        'front.optimonk.com': 'Used by OptiMonk to show pop-ups and personalized messages to website visitors.',
        'challenges.cloudflare.com': 'Part of Cloudflare\'s Bot Management and CAPTCHA service to distinguish human vs bot traffic.',
        'cdn.cookie-script.com': 'Serves cookie banners and compliance scripts for sites using Cookie Script.',
        'cdn.embedly.com': 'Provides embedded content support (like videos, articles, images) across platforms.',
        'pay.google.com': 'Used by Google Pay to handle online payments and payment UI integration.',
        'hcaptcha.com': 'Main domain for hCaptcha, used to deliver human verification CAPTCHAs.',
        'api.hcaptcha.com': 'API endpoint used by hCaptcha to serve and verify CAPTCHA challenges.',
        'newassets.hcaptcha.com': 'Serves static assets for hCaptcha, including images, scripts, and stylesheets needed for CAPTCHA functionality.',
        'static.hotjar.com': 'Delivers scripts for Hotjar’s heatmaps, session recordings, and user feedback tools.',
        'www.instagram.com': 'Instagram’s main domain for content loading, embeds, and social media widgets.',
        'www.paypal.com': 'Core domain for PayPal’s login, transactions, and embedded payment buttons.',
        'www.recaptcha.net': 'Google’s alternative domain for reCAPTCHA, used to detect abusive traffic.',
        'stripe.com': 'Main Stripe domain for business services, dashboard access, and documentation.',
        'js.stripe.com': 'Hosts Stripe.js, the library used to embed and process secure payments on websites.',
        'm.stripe.network': 'Used by Stripe mobile SDKs for secure network interactions during transactions.',
        'm.stripe.com': 'Handles mobile-specific traffic for processing payments through Stripe.',
        'merchant-ui-api.stripe.com': 'Back-end API for Stripe’s merchant dashboard interface.',
        'r.stripe.com': 'Redirection and routing service used during payment flows (e.g., 3D Secure).',
        's.amazon-adsystem.com': 'Amazon’s ad system domain for displaying and tracking ads across various websites.',
        'arclight.vimeo.com': 'Vimeo’s domain for hosting and delivering video content through the ArcLight framework.',
        'lensflare.vimeo.com': 'Used by Vimeo for serving dynamic video content through its LensFlare framework.',
        'player.vimeo.com': 'Vimeo’s domain for hosting and delivering embedded video players.'
      };

      // Explanation string for this specific tracker, where `fqdn` is the KEY, and the VALUE will be accessed from the internal dictionary.
      let url_explanation = explanationsDict[fqdn] || "No explanation available.";

      // We should only actually show the explanation if we are on the appropriate variant.
      // In this instance, `2` or `3`
      const bgBadger = chrome.extension.getBackgroundPage().badger;
      let variant = bgBadger.globals.surveyVariant;
      console.log("[INFO] Running with variant: ", variant);

      // !! Save the URL for later use in the visualization (if we are on the correct variant) !!
      if(variant == 3){
         bgBadger.globals.trackerURLs.push(fqdn);
      }

      return `
<div class="${classes.join(' ')}" data-origin="${fqdn}">
  <div class="origin" role="heading" aria-level="4">
    <span class="ui-icon ui-icon-alert tooltip breakage-warning" title="${breakage_warning_tooltip}"></span>
    <span class="origin-inner tooltip" title="${domain_tooltip}">${dnt_html}${shield_icon}${fqdn}</span>    <!-- ${fqdn} IS THE KEY -->
  </div>
  <a href="" class="removeOrigin">&#10006</a>
  ${htmlUtils.getToggleHtml(fqdn, action, blockedFpScripts)}
  <a href="" class="honeybadgerPowered tooltip" title="${undo_arrow_tooltip}"></a>
  ${variant > 1 ? `<p style="color:rgb(115, 137, 196);"><b>${url_explanation}</b></p>` : ''} <!-- Only show explanation on specific variant(s) -->
</div>
      `.trim();
    };

  }()),

  /**
   * Toggles undo arrows and breakage warnings in domain slider rows.
   * TODO rename/refactor with updateOrigin()
   *
   * @param {jQuery} $clicker
   * @param {Boolean} userset whether to show a revert control arrow
   * @param {Boolean} show_breakage_warning whether to show a breakage warning
   */
  toggleBlockedStatus: function ($clicker, userset, show_breakage_warning) {
    $clicker.removeClass([
      "userset",
      "show-breakage-warning",
    ].join(" "));

    // toggles revert control arrow via CSS
    if (userset) {
      $clicker.addClass("userset");
    }

    // show warning when manually blocking a domain
    // that would have been cookieblocked otherwise
    if (show_breakage_warning) {
      $clicker.addClass("show-breakage-warning");
    }
  },

  /**
   * Compare two domains, reversing them to start comparing the least
   * significant parts (TLD) first.
   *
   * @param {Array} domains The domains to sort.
   * @returns {Array} Sorted domains.
   */
  sortDomains: (domains) => {
    domains = domains || [];
    // optimization: cache makeSortable output by walking the array once
    // to extract the actual values used for sorting into a temporary array
    return domains.map((domain, i) => {
      return {
        index: i,
        value: htmlUtils.makeSortable(domain)
      };
    // sort the temporary array
    }).sort((a, b) => {
      if (a.value > b.value) {
        return 1;
      }
      if (a.value < b.value) {
        return -1;
      }
      return 0;
    // walk the temporary array to achieve the right order
    }).map(item => domains[item.index]);
  },

  /**
   * Reverse order of domain items to have the least exact (TLD) first.
   *
   * @param {String} domain The domain to shuffle
   * @returns {String} The 'reversed' domain
   */
  makeSortable: (domain) => {
    let base = getBaseDomain(domain),
      base_minus_tld = base,
      dot_index = base.indexOf('.'),
      rest_of_it_reversed = '';

    if (domain.length > base.length) {
      rest_of_it_reversed = domain
        .slice(0, domain.length - base.length - 1)
        .split('.').reverse().join('.');
    }

    if (dot_index > -1 && !isIPv4(domain) && !isIPv6(domain)) {
      base_minus_tld = base.slice(0, dot_index);
    }

    return (base_minus_tld + '.' + rest_of_it_reversed);
  },

  /**
   * Checks whether an element is at least partially visible
   * within its scrollable container.
   *
   * @param {Element} elm
   * @param {Element} container
   *
   * @returns {Boolean}
   */
  isScrolledIntoView: (elm, container) => {
    let ctop = container.scrollTop,
      cbot = ctop + container.clientHeight,
      etop = elm.offsetTop,
      ebot = etop + elm.clientHeight;

    // completely in view
    if (etop >= ctop && ebot <= cbot) {
      return true;
    }

    // partially in view
    if ((etop < ctop && ebot > ctop) || (ebot > cbot && etop < cbot)) {
      return true;
    }

    return false;
  },

};

htmlUtils.escape = escape_html;

export default htmlUtils;
