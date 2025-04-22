document.addEventListener("DOMContentLoaded", async function () {
    const readMoreButtons = document.querySelectorAll(".read-more");
  
    readMoreButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
  
        const card = button.closest(".info-card");
        const extraText = card.querySelector(".extra-text");
  
        if (extraText.style.display === "none" || extraText.style.display === "") {
          extraText.style.display = "block";
          button.textContent = "Read less";
        } else {
          extraText.style.display = "none";
          button.textContent = "Read more";
        }
      });
    });


    // Only do visualization on correct variant!
    const bgBadger = chrome.extension.getBackgroundPage().badger;
    let variant = bgBadger.globals.surveyVariant;

    // Get container element
    const container = document.querySelector('.visualization-container');

    if(variant == 3){
      // Load and show visualization
      container.style.display = 'flex'; // Make sure it's visible

      // fetch isn't an option, so we go with absolute brimstone instead.
      const data = [
        {
          "url": "adobetarget.data.adobedc.net",
          "group": "Adobe",
          "info1": "Website personalization and A/B testing",
          "info2": "Analytics / Personalization",
          "info3": "This tracker is part of Adobe Target, a tool that helps websites test and personalize content for visitors. It monitors user behavior to deliver tailored experiences, such as showing different versions of a webpage to see which performs better.",
          "info4": "Large e-commerce platforms, media outlets, and enterprise websites"
        },
        {
          "url": "static.cloudflareinsights.com",
          "group": "Cloudflare",
          "info1": "Website performance analytics",
          "info2": "Analytics / Performance Monitoring",
          "info3": "This tracker is part of Cloudflare Web Analytics, a privacy-focused tool that helps website owners understand site performance and visitor behavior without using cookies or collecting personal data.",
          "info4": "Websites using Cloudflare services or seeking privacy-centric analytics solutions"
        },
        {
          "url": "cdn.cookielaw.org",
          "group": "OneTrust",
          "info1": "Cookie consent and regulatory compliance",
          "info2": "Compliance / Consent Management",
          "info3": "This tracker is part of OneTrust's cookie consent management platform, helping websites comply with privacy laws by displaying cookie banners and storing user consent preferences.",
          "info4": "Websites implementing GDPR or CCPA compliance banners"
        },
        {
          "url": "dpm.demdex.net",
          "group": "Adobe",
          "info1": "User identification and cross-site tracking for targeted advertising",
          "info2": "Advertising / Data Management Platform",
          "info3": "This tracker is part of Adobe Audience Manager. It helps websites identify and track visitors across different sites by assigning a unique ID to each user. This enables personalized advertising and content based on user behavior.",
          "info4": "Major advertisers, publishers, and marketing platforms"
        },
        {
          "url": "www.googletagmanager.com",
          "group": "Google",
          "info1": "Tag management and script loading",
          "info2": "Utility / Analytics Management",
          "info3": "This tracker is part of Google Tag Manager, a tool that helps website owners manage and deploy marketing and analytics tags without modifying the website's code. It allows for efficient tracking of user interactions and site performance.",
          "info4": "Almost every commercial and organizational site"
        },
        {
          "url": "js-agent.newrelic.com",
          "group": "New Relic",
          "info1": "Website performance monitoring",
          "info2": "Analytics / Performance Monitoring",
          "info3": "This tracker is part of New Relic's Browser Agent, which helps website owners monitor and improve site performance by collecting data on page load times, user interactions, and errors.",
          "info4": "Websites using New Relic for performance monitoring"
        },
        {
          "url": "www.youtube.com",
          "group": "Google (YouTube)",
          "info1": "Video hosting and user interaction tracking",
          "info2": "Media / Advertising",
          "info3": "This tracker is part of YouTube's video embedding service. When a YouTube video is embedded on a website, this tracker can collect data on user interactions with the video, such as views, likes, and watch time, even if the video isn't played. This helps YouTube gather analytics and serve personalized ads.",
          "info4": "News outlets, blogs, educational platforms, and marketing pages with embedded YouTube videos"
        },
        {
          "url": "img.youtube.com",
          "group": "Google (YouTube)",
          "info1": "Image loading and video thumbnail previews",
          "info2": "Content Delivery / Media",
          "info3": "This tracker is associated with YouTube and is used to load images and thumbnails for video previews.",
          "info4": "Used across all websites that embed YouTube videos or content."
        },
        {
          "url": "accounts.google.com",
          "group": "Google",
          "info1": "User authentication and account management",
          "info2": "Authentication / Account Management",
          "info3": "This tracker is used by Google to manage user authentication and account management across various services.",
          "info4": "Any site that uses Google for authentication or single sign-on (SSO)."
        },
        {
          "url": "www.google.com",
          "group": "Google",
          "info1": "Search engine and advertising services",
          "info2": "Search / Advertising",
          "info3": "This tracker connects websites to Google's search engine and various services, including ads and analytics.",
          "info4": "Almost all websites using Google Ads, Analytics, or embedded search services."
        },
        {
          "url": "fonts.gstatic.com",
          "group": "Google",
          "info1": "Font delivery",
          "info2": "Content Delivery / Fonts",
          "info3": "This tracker is used to serve fonts for websites that use Google Fonts for typography.",
          "info4": "Any website using Google Fonts to enhance typography."
        },
        {
          "url": "www.gstatic.com",
          "group": "Google",
          "info1": "Content delivery (static resources)",
          "info2": "Content Delivery / Static Assets",
          "info3": "This tracker is used by Google to serve various static resources like images, scripts, and other content for Google services.",
          "info4": "Any Google-integrated website or service."
        },
        {
          "url": "id.rlcdn.com",
          "group": "Revcontent",
          "info1": "Ad targeting and delivery",
          "info2": "Advertising",
          "info3": "This tracker is used by Revcontent, a native advertising network, for delivering personalized ads based on user behavior.",
          "info4": "Many content and news websites that utilize native advertising from Revcontent."
        },
        {
          "url": "p.typekit.net",
          "group": "Adobe",
          "info1": "Font delivery",
          "info2": "Content Delivery / Fonts",
          "info3": "This tracker is used by Adobe Typekit to deliver fonts and typography for websites that use Adobe Fonts.",
          "info4": "Websites using Adobe Fonts (Typekit) for typography."
        },
        {
          "url": "use.typekit.net",
          "group": "Adobe",
          "info1": "Font delivery",
          "info2": "Content Delivery / Fonts",
          "info3": "This tracker is used by Adobe Typekit to load fonts on websites that use Adobe Fonts, a service to improve typography on webpages.",
          "info4": "Websites using Adobe Fonts (Typekit) for typography."
        },
        {
          "url": "connect.facebook.net",
          "group": "Meta (Facebook)",
          "info1": "Social integration and ad targeting",
          "info2": "Advertising / Social",
          "info3": "This tracker connects websites to Facebook’s ad and tracking tools. It enables things like the Facebook Like button and retargeting ads.",
          "info4": "Almost all types of commercial and social platforms"
        },
        {
          "url": "dlthst9q2beh8.cloudfront.net",
          "group": "Amazon Web Services (AWS)",
          "info1": "Content delivery and tracking",
          "info2": "Analytics / CDN",
          "info3": "This tracker is used to serve content over Amazon CloudFront, a content delivery network (CDN). It often serves resources like images or scripts, but it may also be used for tracking purposes.",
          "info4": "Websites using AWS for CDN services"
        },
        {
          "url": "cdn0.forter.com",
          "group": "Forter",
          "info1": "Fraud detection and prevention",
          "info2": "Security / Fraud Prevention",
          "info3": "This tracker is used by Forter, a fraud prevention service that helps e-commerce websites identify and prevent fraudulent transactions.",
          "info4": "E-commerce platforms"
        },
        {
          "url": "cdn3.forter.com",
          "group": "Forter",
          "info1": "Fraud detection and prevention",
          "info2": "Security / Fraud Prevention",
          "info3": "Similar to `cdn0.forter.com`, this tracker is also part of Forter’s fraud detection service. It is used to assess the risk of fraudulent transactions in real-time during online purchases.",
          "info4": "E-commerce platforms"
        },
        {
          "url": "cbf12a88ccce.cdn4.forter.com",
          "group": "Forter",
          "info1": "Fraud detection and prevention",
          "info2": "Security / Fraud Prevention",
          "info3": "This tracker is part of the Forter fraud prevention network, helping e-commerce businesses detect and prevent fraudulent transactions.",
          "info4": "E-commerce websites"
        },
        {
          "url": "js-agent.newrelic.com",
          "group": "New Relic",
          "info1": "Website performance monitoring",
          "info2": "Analytics / Performance Monitoring",
          "info3": "This tracker is used by New Relic to collect performance data about websites, helping developers monitor and optimize the site's speed and user experience.",
          "info4": "Websites monitoring site performance"
        },
        {
          "url": "p.typekit.net",
          "group": "Adobe",
          "info1": "Font delivery",
          "info2": "User Experience / Web Fonts",
          "info3": "This tracker is used by Adobe Typekit to deliver web fonts on websites. It helps improve typography and user experience across different platforms.",
          "info4": "Websites using Adobe Typekit for fonts"
        },
        {
          "url": "googleads.g.doubleclick.net",
          "group": "Google",
          "info1": "Ad personalization and conversion tracking",
          "info2": "Advertising / Behavioral Tracking",
          "info3": "This tracker is part of Google's advertising ecosystem. It collects behavioral data to personalize ads and measure their effectiveness. It's heavily used for retargeting and conversion tracking.",
          "info4": "Websites using Google Ads, YouTube, and partner sites in the Google Display Network"
        },
        {
          "url": "static.doubleclick.net",
          "group": "Google",
          "info1": "Ad infrastructure support",
          "info2": "Advertising Infrastructure / Content Delivery",
          "info3": "This domain serves static resources like JavaScript libraries and configuration files for Google’s ad services. While it doesn’t collect data directly, it supports tracking functionality.",
          "info4": "Sites that use Google Tag Manager, gtag.js, or conversion tracking"
        },
        {
          "url": "ib.adnxs.com",
          "group": "Microsoft",
          "info1": "Advertising and retargeting",
          "info2": "Ad Tech",
          "info3": "Used by AppNexus (Xandr) for real-time bidding in online advertising. Collects user behavior and interests to serve targeted ads.",
          "info4": "Ad-supported websites using real-time bidding platforms"
        },
        {
          "url": "cdn.adsafeprotected.com",
          "group": "Integral Ad Science",
          "info1": "Ad quality analytics",
          "info2": "Ad Verification",
          "info3": "Served by Integral Ad Science to assess the quality and safety of ad placements, including fraud detection and brand safety scoring.",
          "info4": "Publishers and advertisers validating ad traffic"
        },
        {
          "url": "c.amazon-adsystem.com",
          "group": "Amazon",
          "info1": "Ad targeting and measurement",
          "info2": "Ad Tech",
          "info3": "Used by Amazon Advertising to track user interactions for targeting and analytics. Collects browsing history and interactions with Amazon ads.",
          "info4": "Retail and ad-monetized sites with Amazon ad placements"
        },
        {
          "url": "licensing.bitmovin.com",
          "group": "Bitmovin",
          "info1": "License validation and analytics",
          "info2": "Video Streaming / DRM",
          "info3": "Used by Bitmovin's video player to validate license keys and monitor player usage for licensing compliance and analytics.",
          "info4": "Websites using Bitmovin player for video delivery"
        },
        {
          "url": "pubads.g.doubleclick.net",
          "group": "Google",
          "info1": "Ad delivery and optimization",
          "info2": "Ad Tech",
          "info3": "A core domain in Google's ad delivery network (Ad Manager), used to serve and manage programmatic ads and collect performance data.",
          "info4": "Publisher websites using Google Ad Manager"
        },
        {
          "url": "securepubads.g.doubleclick.net",
          "group": "Google",
          "info1": "Ad serving and analytics",
          "info2": "Ad Tech",
          "info3": "Secure version of Google’s DoubleClick ad delivery system, ensuring ads and tracking data are served over HTTPS.",
          "info4": "HTTPS-enabled sites using Google Ad Manager"
        },
        {
          "url": "bea4.v.fwmrm.net",
          "group": "FreeWheel (Comcast)",
          "info1": "Video ad delivery and monetization",
          "info2": "Ad Tech / Video",
          "info3": "Used by FreeWheel (Comcast) for delivering video ads and tracking interactions. Supports targeted advertising within video streams.",
          "info4": "Sites and streaming platforms using FreeWheel for video ads"
        },
        {
          "url": "partner.googleadservices.com",
          "group": "Google",
          "info1": "Ad conversion tracking",
          "info2": "Ad Tech",
          "info3": "This domain is part of Google's advertising infrastructure, used to manage ad campaigns and track conversions on advertiser websites.",
          "info4": "Advertiser landing pages using Google Ads for conversion measurement"
        },
        {
          "url": "pagead2.googlesyndication.com",
          "group": "Google",
          "info1": "Ad delivery and personalization",
          "info2": "Ad Tech",
          "info3": "Delivers contextual and personalized ads on websites using Google AdSense. Also loads ad scripts and collects performance data.",
          "info4": "AdSense-enabled publisher websites"
        },
        {
          "url": "cdn.jsdelivr.net",
          "group": "jsDelivr (sponsored by Cloudflare, Fastly, and others)",
          "info1": "Content delivery",
          "info2": "Web Performance / CDN",
          "info3": "A popular open-source content delivery network (CDN) for serving JavaScript libraries and other static assets.",
          "info4": "Websites using open-source JS/CSS libraries hosted via CDN"
        },
        {
          "url": "p8dn7fp1liosd47cq1r3sb455.litix.io",
          "group": "Microsoft",
          "info1": "User behavior analytics",
          "info2": "Analytics / Session Replay",
          "info3": "Part of a domain used by Microsoft Clarity or other session replay tools for behavioral analytics and heatmap generation.",
          "info4": "Sites using Clarity or similar tools for UX improvement"
        },
        {
          "url": "cdn.optimizely.com",
          "group": "Optimizely (formerly Episerver)",
          "info1": "A/B testing and user experience optimization",
          "info2": "UX / Experimentation",
          "info3": "Used by Optimizely to deliver A/B testing scripts and collect data on user behavior to optimize user experience and content.",
          "info4": "Sites using Optimizely for experimentation and conversion optimization"
        },
        {
          "url": "8512b548-2306-4976-a576-a880f2c35e4e.edge.permutive.app",
          "group": "Permutive",
          "info1": "Audience segmentation and real-time analytics",
          "info2": "Ad Tech / Analytics",
          "info3": "Permutive is a real-time audience segmentation platform used by publishers to build privacy-compliant targeting without third-party cookies.",
          "info4": "Media and publishing sites using Permutive for ad targeting"
        },
        {
          "url": "live.rezync.com",
          "group": "Rezync",
          "info1": "User data synchronization and personalization",
          "info2": "Ad Tech / Personalization",
          "info3": "Associated with Rezync, a data synchronization and personalization platform used in advertising and customer data platforms.",
          "info4": "E-commerce and media platforms utilizing advanced user personalization"
        },
        {
          "url": "pixel-us-east.rubiconproject.com",
          "group": "Magnite (formerly Rubicon Project)",
          "info1": "Programmatic advertising and user sync",
          "info2": "Ad Tech",
          "info3": "Rubicon Project (now Magnite) uses this pixel for ad bidding, user sync, and behavior tracking across the ad ecosystem.",
          "info4": "Sites participating in real-time ad auctions via Magnite"
        },
        {
          "url": "get.s-onetag.com",
          "group": "OneTag",
          "info1": "Header bidding and analytics",
          "info2": "Ad Tech",
          "info3": "OneTag provides header bidding and monetization services. This domain supports script loading and analytics for ad performance.",
          "info4": "Sites using OneTag for monetization and ad management"
        },
        {
          "url": "ads.stickyadstv.com",
          "group": "FreeWheel (Comcast)",
          "info1": "Video ad bidding and delivery",
          "info2": "Ad Tech / Video",
          "info3": "Used by StickyAds (a part of FreeWheel) for video ad delivery and programmatic ad transactions.",
          "info4": "Video platforms participating in programmatic video ads"
        },
        {
          "url": "eq97f.publishers.tremorhub.com",
          "group": "Tremor International",
          "info1": "Video ad analytics and targeting",
          "info2": "Ad Tech / Video",
          "info3": "Tremor Video’s domain used for tracking ad interactions, measuring video ad performance, and enabling targeting.",
          "info4": "Video publishers partnered with Tremor for monetization"
        },
        {
          "url": "tag.wknd.ai",
          "group": "WKND.AI",
          "info1": "AI-driven personalization and engagement",
          "info2": "Ad Tech / Personalization",
          "info3": "WKND.AI uses this tag to gather user interactions for AI-powered personalization and marketing automation.",
          "info4": "Sites using WKND.AI for AI marketing solutions"
        },
        {
          "url": "cdn.auth0.com",
          "group": "Auth0",
          "info1": "Authentication and authorization",
          "info2": "User Authentication",
          "info3": "Auth0 is a platform for authentication and authorization. This tracker is used to manage user identity and session states for websites that integrate Auth0's authentication system.",
          "info4": "Websites using Auth0 for user login"
        },
        {
          "url": "cl.k5a.io",
          "group": "K5",
          "info1": "Audience segmentation and behavioral advertising",
          "info2": "Ad Tech",
          "info3": "This tracker is associated with K5, a data management platform (DMP) used for audience segmentation and ad targeting based on user behavior across websites.",
          "info4": "Websites that monetize via behavioral ads or audience segmentation"
        },
        {
          "url": "cl.k5a.io",
          "group": "K5",
          "info1": "Audience segmentation and behavioral advertising",
          "info2": "Ad Tech",
          "info3": "This tracker is associated with K5, a data management platform (DMP) used for audience segmentation and ad targeting based on user behavior across websites.",
          "info4": "Websites that monetize via behavioral ads or audience segmentation"
        },
        {
          "url": "geolocation.onetrust.com",
          "group": "Onetrust",
          "info1": "Geolocation-based content and ad targeting",
          "info2": "Consent Management",
          "info3": "Onetrust is a Consent Management Platform (CMP). This tracker helps manage geolocation data for the purpose of presenting user-specific content and ads.",
          "info4": "Websites requiring location-based content delivery or ads"
        },
        {
          "url": "tv2-cdn.relevant-digital.com",
          "group": "Relevant Digital",
          "info1": "Ad delivery and content optimization",
          "info2": "Ad Tech",
          "info3": "Relevant Digital provides advertising and content delivery solutions. This tracker is used to serve ads and track user interactions with TV2-related content.",
          "info4": "Websites using TV2 content or advertisements"
        },
        {
          "url": "consent.cookiebot.com",
          "group": "Cookiebot",
          "info1": "Cookie consent management",
          "info2": "Consent Management",
          "info3": "Cookiebot is a platform that helps websites obtain and store user consent for cookies, enabling compliance with GDPR regulations.",
          "info4": "Websites implementing Cookiebot for cookie consent management"
        },
        {
          "url": "macro.adnami.io",
          "group": "Adnami",
          "info1": "Ad delivery and performance tracking",
          "info2": "Ad Tech",
          "info3": "Adnami is a platform for delivering immersive advertising formats. This tracker helps to serve dynamic ads based on user behavior.",
          "info4": "Websites using Adnami for immersive ad formats"
        },
        {
          "url": "assets.adnuntius.com",
          "group": "Adnuntius",
          "info1": "Ad optimization and delivery",
          "info2": "Ad Tech",
          "info3": "Adnuntius is an advertising platform that provides ad services and helps with ad content optimization. This tracker manages the delivery and optimization of ads.",
          "info4": "Adnuntius-integrated websites for ad delivery optimization"
        },
        {
          "url": "www.clarity.ms",
          "group": "Microsoft",
          "info1": "User behavior analytics",
          "info2": "Analytics",
          "info3": "Microsoft Clarity is an analytics tool that tracks user behavior on websites through session replays and heatmaps.",
          "info4": "Websites using Microsoft Clarity for user behavior analytics"
        },
        {
          "url": "consentcdn.cookiebot.com",
          "group": "Cookiebot",
          "info1": "Cookie consent management",
          "info2": "Consent Management",
          "info3": "Cookiebot's Content Delivery Network (CDN) is used to serve cookie consent banners and manage the consent process for websites.",
          "info4": "Websites using Cookiebot CDN for cookie consent management"
        },
        {
          "url": "imgsct.cookiebot.com",
          "group": "Cookiebot",
          "info1": "Cookie consent management",
          "info2": "Consent Management",
          "info3": "This tracker is part of Cookiebot's infrastructure to load and serve images related to the cookie consent banner.",
          "info4": "Websites using Cookiebot's consent banner images"
        },
        {
          "url": "gadk.hit.gemius.pl",
          "group": "Gemius",
          "info1": "User behavior analytics",
          "info2": "Analytics",
          "info3": "Gemius is a market research company that provides website analytics and user behavior tracking. This tracker helps monitor user activity and engagement on websites.",
          "info4": "Websites that use Gemius for audience measurement and market research"
        },
        {
          "url": "cdn.jsdelivr.net",
          "group": "JSDelivr",
          "info1": "Content delivery (JavaScript libraries)",
          "info2": "Web Performance",
          "info3": "JSDelivr is a Content Delivery Network (CDN) that hosts open-source JavaScript libraries. This tracker is used to deliver web content quickly and efficiently to users.",
          "info4": "Websites using JSDelivr for fast content delivery of open-source libraries"
        },
        {
          "url": "omny.fm",
          "group": "Omny",
          "info1": "Podcast content management",
          "info2": "Media",
          "info3": "Omny is a podcast hosting and publishing platform. This tracker is used to manage podcast content delivery and user interaction with audio content.",
          "info4": "Podcast websites using Omny for audio content delivery"
        },
        {
          "url": "api.omny.fm",
          "group": "Omny",
          "info1": "API-based podcast content management",
          "info2": "Media",
          "info3": "Omny's API is used to access podcast content and manage interactions with the hosted media. This tracker helps facilitate content access and user behavior monitoring.",
          "info4": "Podcasts hosted or managed via Omny"
        },
        {
          "url": "bt-cdn.relevant-digital.com",
          "group": "Relevant Digital",
          "info1": "Ad delivery and content optimization",
          "info2": "Ad Tech",
          "info3": "Relevant Digital serves advertising and content delivery solutions, using this tracker to deliver and optimize ad content across websites.",
          "info4": "Websites that serve content via Relevant Digital's solutions"
        },
        {
          "url": "cdnjs.cloudflare.com",
          "group": "Cloudflare",
          "info1": "Content delivery (JavaScript libraries)",
          "info2": "Web Performance",
          "info3": "Cloudflare's CDN is used to deliver JavaScript libraries and static content quickly across the web.",
          "info4": "Websites using Cloudflare to speed up delivery of JavaScript libraries and other static content"
        },
        {
          "url": "stats.wordpress.com",
          "group": "Automattic (WordPress)",
          "info1": "Website traffic analytics",
          "info2": "Analytics",
          "info3": "Stats.wordpress.com is a tracker used by WordPress to collect website traffic data and user interaction metrics. It is part of the Jetpack plugin, which helps WordPress site owners analyze traffic and improve site performance.",
          "info4": "WordPress sites using Jetpack plugin"
        },
        {
          "url": "assets.queue-it.net",
          "group": "Queue-it",
          "info1": "Queue management during high traffic events",
          "info2": "User Experience",
          "info3": "Queue-it is a virtual waiting room solution designed to manage website traffic during peak load times. This tracker is used to queue users until they can access the site.",
          "info4": "Websites using Queue-it to manage user traffic during peak periods"
        },
        {
          "url": "static.queue-it.net",
          "group": "Queue-it",
          "info1": "Queue management",
          "info2": "User Experience",
          "info3": "This is a static resource for Queue-it's queue management solution, used to serve the waiting room interface during peak demand.",
          "info4": "Websites utilizing Queue-it for traffic management"
        },
        {
          "url": "counter.yadro.ru",
          "group": "Yandex",
          "info1": "Website analytics",
          "info2": "Analytics",
          "info3": "Yandex is a Russian search engine that provides analytics and tracking services. This tracker is used to measure website traffic and track user interactions with websites that have implemented Yandex Metrica.",
          "info4": "Websites using Yandex Metrica for traffic analytics and user behavior tracking"
        },
        {
          "url": "www.googletagmanager.com",
          "group": "Google",
          "info1": "Tag management",
          "info2": "Marketing / Analytics",
          "info3": "Google Tag Manager is used for managing and deploying marketing tags (such as analytics and advertising tags) on websites. It helps automate the process of adding, updating, and managing JavaScript and HTML tags.",
          "info4": "Websites using Google Tag Manager for tag deployment"
        },
        {
          "url": "geolocation.onetrust.com",
          "group": "OneTrust",
          "info1": "Geolocation consent management",
          "info2": "Privacy / Compliance",
          "info3": "This tracker is part of OneTrust, used for managing geolocation data as part of a consent management solution. It helps websites comply with privacy regulations by enabling location-based services while obtaining user consent.",
          "info4": "Websites using OneTrust for geolocation tracking and consent management"
        },
        {
          "url": "privacyportal-eu.onetrust.com",
          "group": "OneTrust",
          "info1": "Privacy preference management",
          "info2": "Privacy / Compliance",
          "info3": "This tracker is also part of OneTrust, specifically used to manage user privacy preferences in the European Union. It helps websites comply with GDPR by providing a platform for users to manage and control their data privacy settings.",
          "info4": "Websites using OneTrust for managing privacy preferences under GDPR"
        },
        {
          "url": "dc.services.visualstudio.com",
          "group": "Microsoft",
          "info1": "Application performance monitoring",
          "info2": "Analytics / Performance",
          "info3": "This tracker is used by Microsoft Azure Application Insights to monitor and analyze the performance and usage of web applications. It helps developers track issues, errors, and performance metrics for websites and apps.",
          "info4": "Websites using Microsoft Azure Application Insights for performance tracking"
        },
        {
          "url": "edge.fullstory.com",
          "group": "FullStory",
          "info1": "Session replay and user behavior analytics",
          "info2": "Analytics / User Experience",
          "info3": "This tracker is used by FullStory, a digital experience analytics tool that helps websites capture user interactions and behaviors to optimize user experience. It records user sessions for insights into how visitors engage with the site.",
          "info4": "Websites using FullStory for user behavior analytics and session recording"
        },
        {
          "url": "owp.klarna.com",
          "group": "Klarna",
          "info1": "Payment processing and user interaction tracking",
          "info2": "E-commerce / Payment",
          "info3": "This tracker is used by Klarna, a payment service provider that allows users to buy now and pay later. It tracks user interactions with Klarna's payment system for processing transactions and providing a smooth payment experience.",
          "info4": "Websites using Klarna as a payment provider"
        },
        {
          "url": "jssdkcdns.mparticle.com",
          "group": "mParticle",
          "info1": "Customer data collection and integration",
          "info2": "Marketing / Customer Data",
          "info3": "This tracker is part of mParticle, a customer data platform that helps companies collect, integrate, and manage customer data across various channels. It is used to collect user interaction data for marketing and customer engagement.",
          "info4": "Websites using mParticle for customer data integration"
        },
        {
          "url": "privacyportal-de.onetrust.com",
          "group": "OneTrust",
          "info1": "Privacy preference management",
          "info2": "Privacy / Compliance",
          "info3": "This tracker is used by OneTrust, specifically for managing privacy preferences for users in Germany. It helps websites comply with data protection regulations such as the GDPR by providing a platform for users to manage their privacy settings.",
          "info4": "Websites using OneTrust for privacy management in Germany"
        },
        {
          "url": "aax-eu.amazon-adsystem.com",
          "group": "Amazon",
          "info1": "Ad serving and personalization",
          "info2": "Advertising",
          "info3": "This tracker is used by Amazon to serve personalized ads through its Amazon Advertising platform. It tracks user behavior to optimize the display of ads based on interests and previous interactions with Amazon.",
          "info4": "Websites using Amazon Ads to serve targeted advertising"
        },
        {
          "url": "sb.scorecardresearch.com",
          "group": "Scorecard Research",
          "info1": "Audience measurement and analytics",
          "info2": "Analytics / Research",
          "info3": "This tracker is used by Scorecard Research, which provides audience measurement and web analytics services. It collects data to help analyze user behavior and demographic information for market research purposes.",
          "info4": "Websites participating in Scorecard Research audience measurement programs"
        },
        {
          "url": "rum.hlx.page",
          "group": "HLX",
          "info1": "User engagement tracking and content optimization",
          "info2": "Analytics / Content Delivery",
          "info3": "This tracker is part of HLX (Hyperlocal), which helps manage web analytics and user interaction for news websites, focusing on delivering content at the local level and optimizing user engagement.",
          "info4": "Local news and content websites powered by HLX"
        },
        {
          "url": "one-to-one.bambuser.com",
          "group": "Bambuser",
          "info1": "Live streaming interaction tracking",
          "info2": "Analytics / Video Streaming",
          "info3": "This tracker is used by Bambuser, a platform for live streaming and video commerce. It tracks user interactions during live video sessions to provide insights and analytics for streamers and advertisers.",
          "info4": "Websites and e-commerce platforms using Bambuser for live streaming and video commerce"
        },
        {
          "url": "async-px-eu.dynamicyield.com",
          "group": "Dynamic Yield",
          "info1": "Personalization and A/B testing",
          "info2": "Marketing / Personalization",
          "info3": "This tracker is used by Dynamic Yield, a personalization platform that provides on-site optimization and A/B testing tools. It tracks user interactions to personalize content and offers.",
          "info4": "E-commerce and content websites using Dynamic Yield for personalization and A/B testing"
        },
        {
          "url": "cdn-eu.dynamicyield.com",
          "group": "Dynamic Yield",
          "info1": "Content personalization and optimization",
          "info2": "Marketing / Personalization",
          "info3": "This tracker is part of the Dynamic Yield network, which is used for delivering personalized content and conducting A/B tests based on user behavior data.",
          "info4": "Websites using Dynamic Yield to serve personalized experiences and run A/B tests"
        },
        {
          "url": "st-eu.dynamicyield.com",
          "group": "Dynamic Yield",
          "info1": "Personalization and optimization in EU",
          "info2": "Marketing / Personalization",
          "info3": "This tracker is another part of the Dynamic Yield ecosystem, used specifically for providing user personalization and tracking across the European Union.",
          "info4": "EU-based websites using Dynamic Yield for personalization and A/B testing"
        },
        {
          "url": "coop.dk.ssl.sc.omtrdc.net",
          "group": "Adobe",
          "info1": "Web analytics and user behavior tracking",
          "info2": "Analytics",
          "info3": "This tracker is part of Adobe Analytics, used to collect data on user interactions for websites. The 'sc.omtrdc.net' domain is associated with Adobe's tracking servers.",
          "info4": "Websites utilizing Adobe Analytics for user behavior analysis"
        },
        {
          "url": "cdn.consentmanager.net",
          "group": "Consentmanager",
          "info1": "Consent management and compliance",
          "info2": "Privacy / Compliance",
          "info3": "This domain is associated with Consentmanager, a Consent Management Platform (CMP) that helps websites comply with GDPR by managing user consents.",
          "info4": "Websites using Consentmanager for GDPR compliance"
        },
        {
          "url": "delivery.consentmanager.net",
          "group": "Consentmanager",
          "info1": "Consent script delivery and management",
          "info2": "Privacy / Compliance",
          "info3": "This domain is used by Consentmanager to deliver consent-related scripts and manage user consent interactions on websites.",
          "info4": "Websites implementing Consentmanager's consent scripts"
        },
        {
          "url": "b.delivery.consentmanager.net",
          "group": "Consentmanager",
          "info1": "Consent resource delivery",
          "info2": "Privacy / Compliance",
          "info3": "A subdomain of Consentmanager used for delivering specific consent-related resources and managing user consent interactions.",
          "info4": "Websites utilizing Consentmanager's consent resource delivery"
        },
        {
          "url": "fast.a.klaviyo.com",
          "group": "Klaviyo",
          "info1": "Marketing automation and analytics",
          "info2": "Marketing / Analytics",
          "info3": "This domain is used by Klaviyo for tracking user interactions and behaviors on websites, aiding in marketing automation and analytics.",
          "info4": "E-commerce sites using Klaviyo for marketing automation"
        },
        {
          "url": "static.klaviyo.com",
          "group": "Klaviyo",
          "info1": "Serving static resources for marketing tools",
          "info2": "Marketing / Analytics",
          "info3": "This domain serves static resources for Klaviyo's tracking scripts and forms, facilitating marketing automation and user engagement.",
          "info4": "Websites integrating Klaviyo's marketing tools"
        },
        {
          "url": "static-forms.klaviyo.com",
          "group": "Klaviyo",
          "info1": "Serving static sign-up forms",
          "info2": "Marketing / Analytics",
          "info3": "This domain is used by Klaviyo to serve static forms for user sign-ups and data collection, aiding in marketing efforts.",
          "info4": "Websites using Klaviyo's sign-up forms for marketing"
        },
        {
          "url": "static-tracking.klaviyo.com",
          "group": "Klaviyo",
          "info1": "Delivering tracking scripts for user behavior analysis",
          "info2": "Marketing / Analytics",
          "info3": "This domain is utilized by Klaviyo to deliver static tracking scripts that monitor user interactions for marketing analytics.",
          "info4": "Websites employing Klaviyo's tracking for marketing analytics"
        },
        {
          "url": "js.datadome.co",
          "group": "DataDome",
          "info1": "Bot detection and mitigation",
          "info2": "Security",
          "info3": "This domain is used by DataDome's JavaScript Tag, which collects behavioral data to detect and mitigate bot traffic on websites.",
          "info4": "Websites implementing DataDome for bot protection"
        },
        {
          "url": "privacyportal.onetrust.com",
          "group": "OneTrust",
          "info1": "Privacy management and compliance",
          "info2": "Privacy / Compliance",
          "info3": "This domain is associated with OneTrust's privacy management platform, providing users access to privacy settings and data subject request forms.",
          "info4": "Websites using OneTrust for privacy compliance"
        },
        {
          "url": "micro.rubiconproject.com",
          "group": "Magnite",
          "info1": "Programmatic advertising",
          "info2": "Advertising",
          "info3": "This domain is part of Magnite's (formerly Rubicon Project) advertising infrastructure, used for real-time bidding and ad delivery.",
          "info4": "Websites participating in programmatic advertising through Magnite"
        },
        {
          "url": "cdns.gigya.com",
          "group": "SAP",
          "info1": "Identity and access management",
          "info2": "Authentication / User Management",
          "info3": "This domain is used by Gigya (now part of SAP Customer Data Cloud) to serve content related to user identity and access management.",
          "info4": "Websites utilizing SAP Customer Data Cloud for user management"
        },
        {
          "url": "cdns.eu1.gigya.com",
          "group": "SAP",
          "info1": "Regional identity and access management",
          "info2": "Authentication / User Management",
          "info3": "This is the European regional content delivery domain for Gigya, serving identity management services to comply with regional data regulations.",
          "info4": "European websites using SAP Customer Data Cloud"
        },
        {
          "url": "a26704082161.cdn.optimizely.com",
          "group": "Optimizely",
          "info1": "A/B testing and personalization",
          "info2": "Analytics / Optimization",
          "info3": "This domain is used by Optimizely to deliver experiment variations and personalization content to users as part of A/B testing.",
          "info4": "Websites conducting A/B testing with Optimizely"
        },
        {
          "url": "logx.optimizely.com",
          "group": "Optimizely",
          "info1": "Experiment data logging",
          "info2": "Analytics / Optimization",
          "info3": "This domain is used by Optimizely to log user interactions and experiment data for analysis and optimization purposes.",
          "info4": "Websites using Optimizely for user experience optimization"
        },
        {
          "url": "js.datadome.co",
          "group": "DataDome",
          "info1": "Bot detection and mitigation",
          "info2": "Security",
          "info3": "Serves DataDome's JavaScript Tag, which collects behavioral data to detect and mitigate bot traffic on websites.",
          "info4": "Websites implementing DataDome for bot protection"
        },
        {
          "url": "privacyportal.onetrust.com",
          "group": "OneTrust",
          "info1": "Privacy management and compliance",
          "info2": "Privacy / Compliance",
          "info3": "Provides users access to privacy settings and data subject request forms as part of OneTrust's privacy management platform.",
          "info4": "Websites using OneTrust for privacy compliance"
        },
        {
          "url": "micro.rubiconproject.com",
          "group": "Magnite",
          "info1": "Programmatic advertising",
          "info2": "Advertising",
          "info3": "Part of Magnite's (formerly Rubicon Project) advertising infrastructure, used for real-time bidding and ad delivery.",
          "info4": "Websites participating in programmatic advertising through Magnite"
        },
        {
          "url": "cdns.gigya.com",
          "group": "SAP",
          "info1": "Identity and access management",
          "info2": "Authentication / User Management",
          "info3": "Used by Gigya (now part of SAP Customer Data Cloud) to serve content related to user identity and access management.",
          "info4": "Websites utilizing SAP Customer Data Cloud for user management"
        },
        {
          "url": "cdns.eu1.gigya.com",
          "group": "SAP",
          "info1": "Regional identity and access management",
          "info2": "Authentication / User Management",
          "info3": "European regional content delivery domain for Gigya, serving identity management services to comply with regional data regulations.",
          "info4": "European websites using SAP Customer Data Cloud"
        },
        {
          "url": "a26704082161.cdn.optimizely.com",
          "group": "Optimizely",
          "info1": "A/B testing and personalization",
          "info2": "Analytics / Optimization",
          "info3": "Used by Optimizely to deliver experiment variations and personalization content to users as part of A/B testing.",
          "info4": "Websites conducting A/B testing with Optimizely"
        },
        {
          "url": "logx.optimizely.com",
          "group": "Optimizely",
          "info1": "Experiment data logging",
          "info2": "Analytics / Optimization",
          "info3": "Used by Optimizely to log user interactions and experiment data for analysis and optimization purposes.",
          "info4": "Websites using Optimizely for user experience optimization"
        },
        {
          "url": "jysk.my.salesforce.com",
          "group": "Salesforce",
          "info1": "Customer relationship management",
          "info2": "Customer Support",
          "info3": "Subdomain used by JYSK for Salesforce-hosted services, including CRM and customer support functionalities.",
          "info4": "Corporate websites utilizing Salesforce services"
        },
        {
          "url": "d.la1-c2-frf.salesforceliveagent.com",
          "group": "Salesforce",
          "info1": "Live chat support",
          "info2": "Customer Support",
          "info3": "Endpoint for Salesforce Live Agent, facilitating real-time chat support between customers and agents.",
          "info4": "Websites offering live chat support via Salesforce"
        },
        {
          "url": "d.la11-core1.sfdc-cehfhs.salesforceliveagent.com",
          "group": "Salesforce",
          "info1": "Live chat support",
          "info2": "Customer Support",
          "info3": "Another endpoint for Salesforce Live Agent, used for managing live chat sessions and support interactions.",
          "info4": "Websites utilizing Salesforce Live Agent for customer support"
        },
        {
          "url": "widget.trustpilot.com",
          "group": "Trustpilot",
          "info1": "Display customer reviews",
          "info2": "Marketing",
          "info3": "Serves Trustpilot's TrustBox widgets, displaying customer reviews and ratings on websites.",
          "info4": "E-commerce and service websites showcasing customer feedback"
        },
        {
          "url": "www.google-analytics.com",
          "group": "Google",
          "info1": "Website analytics",
          "info2": "Analytics",
          "info3": "Primary domain for Google Analytics, used to collect and analyze website traffic and user behavior data.",
          "info4": "Majority of websites for traffic and behavior analysis"
        },
        {
          "url": "app.usercentrics.eu",
          "group": "Usercentrics",
          "info1": "Consent management",
          "info2": "Privacy / Compliance",
          "info3": "Usercentrics application domain for managing consent management platform (CMP) configurations.",
          "info4": "Websites implementing Usercentrics CMP for GDPR compliance"
        },
        {
          "url": "app.eu.usercentrics.eu",
          "group": "Usercentrics",
          "info1": "Consent management",
          "info2": "Privacy / Compliance",
          "info3": "European-specific Usercentrics application domain for managing consent management platform (CMP) configurations.",
          "info4": "European websites using Usercentrics CMP for GDPR compliance"
        },
        {
          "url": "config.eu.usercentrics.eu",
          "group": "Usercentrics",
          "info1": "Serve CMP configurations",
          "info2": "Privacy / Compliance",
          "info3": "Domain used by Usercentrics to serve configuration data for the consent management platform.",
          "info4": "Websites utilizing Usercentrics CMP for consent management"
        },
        {
          "url": "uct.eu.usercentrics.eu",
          "group": "Usercentrics",
          "info1": "Consent transaction handling",
          "info2": "Privacy / Compliance",
          "info3": "Usercentrics domain for handling user consent transactions and storing consent decisions.",
          "info4": "Websites using Usercentrics CMP for managing user consents"
        },
        {
          "url": "consent-api.service.consent.eu1.usercentrics.eu",
          "group": "Usercentrics",
          "info1": "Consent API service",
          "info2": "Privacy / Compliance",
          "info3": "API endpoint for Usercentrics' consent service, facilitating communication between the website and the CMP.",
          "info4": "Websites integrating Usercentrics CMP for consent management"
        },
        {
          "url": "fms.360yield.com",
          "group": "Media.net",
          "info1": "Ad targeting and monetization",
          "info2": "Advertising",
          "info3": "Part of 360Yield (by Media.net), this domain is involved in header bidding and ad placement optimization.",
          "info4": "Sites participating in header bidding for programmatic ads"
        },
        {
          "url": "www3.doubleclick.net",
          "group": "Google",
          "info1": "Ad delivery and conversion tracking",
          "info2": "Advertising",
          "info3": "Legacy DoubleClick domain now part of Google Marketing Platform, used for serving and tracking ads.",
          "info4": "Advertising-enabled websites using Google ad services"
        },
        {
          "url": "cmp.inmobi.com",
          "group": "InMobi",
          "info1": "Consent management",
          "info2": "Privacy / Compliance",
          "info3": "InMobi Consent Management Platform (CMP) domain, used to handle GDPR-compliant consent for ad tracking.",
          "info4": "Apps and websites using InMobi for monetization in compliance with GDPR"
        },
        {
          "url": "play.google.com",
          "group": "Google",
          "info1": "App distribution and analytics",
          "info2": "Productivity / Platform",
          "info3": "Google Play domain used for app store browsing, downloads, and tracking user engagement metrics.",
          "info4": "Mobile devices and apps using Google Play services"
        },
        {
          "url": "i0.wp.com",
          "group": "Automattic",
          "info1": "Content delivery",
          "info2": "Performance / CDN",
          "info3": "Image CDN for WordPress.com used to serve images quickly and efficiently from WordPress-hosted content.",
          "info4": "WordPress.com-hosted blogs and media sites"
        },
        {
          "url": "s0.wp.com",
          "group": "Automattic",
          "info1": "Site styling and performance",
          "info2": "Performance / CDN",
          "info3": "Static content delivery for WordPress.com, including scripts, fonts, and CSS for website themes.",
          "info4": "WordPress.com-hosted and Jetpack-enabled sites"
        },
        {
          "url": "stats.wp.com",
          "group": "Automattic",
          "info1": "Site analytics",
          "info2": "Analytics",
          "info3": "Tracks user visits and behavior across WordPress.com and Jetpack-enabled sites using WordPress stats.",
          "info4": "WordPress-powered sites with Jetpack enabled"
        },
        {
          "url": "cdn-4.convertexperiments.com",
          "group": "Convert Insights",
          "info1": "A/B testing and website personalization",
          "info2": "Analytics / Optimization",
          "info3": "Used by Convert Experiences (A/B testing platform) to load experiments and personalization scripts.",
          "info4": "Sites running A/B tests with Convert"
        },
        {
          "url": "kit.fontawesome.com",
          "group": "Fonticons, Inc.",
          "info1": "UI enhancement / web iconography",
          "info2": "Performance / CDN",
          "info3": "Used to load Font Awesome icons via CDN from FontAwesome's kit service.",
          "info4": "Websites using Font Awesome icons"
        },
        {
          "url": "front.optimonk.com",
          "group": "OptiMonk",
          "info1": "Marketing and user engagement",
          "info2": "Engagement / Personalization",
          "info3": "Used by OptiMonk to show pop-ups and personalized messages to website visitors.",
          "info4": "E-commerce and content-driven sites"
        },
        {
          "url": "challenges.cloudflare.com",
          "group": "Cloudflare, Inc.",
          "info1": "Bot mitigation and site security",
          "info2": "Security",
          "info3": "Part of Cloudflare's Bot Management and CAPTCHA service to distinguish human vs bot traffic.",
          "info4": "Sites using Cloudflare for security and performance"
        },
        {
          "url": "cdn.cookie-script.com",
          "group": "Cookie Script",
          "info1": "Consent management",
          "info2": "Privacy / Compliance",
          "info3": "Serves cookie banners and compliance scripts for sites using Cookie Script.",
          "info4": "Sites needing GDPR/CCPA cookie compliance"
        },
        {
          "url": "cdn.embedly.com",
          "group": "Embedly (acquired by Medium)",
          "info1": "Media embedding and enhancement",
          "info2": "Media / Embeds",
          "info3": "Provides embedded content support (like videos, articles, images) across platforms.",
          "info4": "News and blog platforms, especially Medium"
        },
        {
          "url": "pay.google.com",
          "group": "Google",
          "info1": "Payments",
          "info2": "E-commerce",
          "info3": "Used by Google Pay to handle online payments and payment UI integration.",
          "info4": "E-commerce sites using Google Pay"
        },
        {
          "url": "hcaptcha.com",
          "group": "Intuition Machines, Inc.",
          "info1": "Bot detection and access control",
          "info2": "Security",
          "info3": "Main domain for hCaptcha, used to deliver human verification CAPTCHAs.",
          "info4": "Websites replacing Google reCAPTCHA with hCaptcha"
        },
        {
          "url": "api.hcaptcha.com",
          "group": "Intuition Machines, Inc.",
          "info1": "Verification and bot prevention",
          "info2": "Security",
          "info3": "API endpoint used by hCaptcha to serve and verify CAPTCHA challenges.",
          "info4": "Sites using hCaptcha security services"
        },
        {
          "url": "newassets.hcaptcha.com",
          "group": "Intuition Machines, Inc.",
          "info1": "Bot detection and challenge display",
          "info2": "Security",
          "info3": "Serves static assets for hCaptcha, including images, scripts, and stylesheets needed for CAPTCHA functionality.",
          "info4": "Sites using hCaptcha to prevent bots or spam"
        },
        {
          "url": "static.hotjar.com",
          "group": "Hotjar Ltd.",
          "info1": "User behavior analytics",
          "info2": "Analytics",
          "info3": "Delivers scripts for Hotjar’s heatmaps, session recordings, and user feedback tools.",
          "info4": "Websites using Hotjar to analyze UX"
        },
        {
          "url": "www.instagram.com",
          "group": "Meta Platforms, Inc.",
          "info1": "Social media integration",
          "info2": "Social Media",
          "info3": "Instagram’s main domain for content loading, embeds, and social media widgets.",
          "info4": "Sites embedding Instagram posts or login options"
        },
        {
          "url": "www.paypal.com",
          "group": "PayPal Holdings, Inc.",
          "info1": "Online payments",
          "info2": "E-commerce",
          "info3": "Core domain for PayPal’s login, transactions, and embedded payment buttons.",
          "info4": "Webshops and services offering PayPal"
        },
        {
          "url": "www.recaptcha.net",
          "group": "Google",
          "info1": "Bot detection",
          "info2": "Security",
          "info3": "Google’s alternative domain for reCAPTCHA, used to detect abusive traffic.",
          "info4": "Sites implementing reCAPTCHA widgets"
        },
        {
          "url": "stripe.com",
          "group": "Stripe, Inc.",
          "info1": "Payment processing",
          "info2": "E-commerce",
          "info3": "Main Stripe domain for business services, dashboard access, and documentation.",
          "info4": "Online stores and apps accepting Stripe"
        },
        {
          "url": "js.stripe.com",
          "group": "Stripe, Inc.",
          "info1": "Secure payment integration",
          "info2": "E-commerce",
          "info3": "Hosts Stripe.js, the library used to embed and process secure payments on websites.",
          "info4": "Any site using embedded Stripe elements"
        },
        {
          "url": "m.stripe.network",
          "group": "Stripe, Inc.",
          "info1": "Mobile transaction handling",
          "info2": "E-commerce",
          "info3": "Used by Stripe mobile SDKs for secure network interactions during transactions.",
          "info4": "Apps using Stripe mobile libraries"
        },
        {
          "url": "m.stripe.com",
          "group": "Stripe, Inc.",
          "info1": "Mobile payment processing",
          "info2": "E-commerce",
          "info3": "Handles mobile-specific traffic for processing payments through Stripe.",
          "info4": "Mobile apps integrating Stripe"
        },
        {
          "url": "merchant-ui-api.stripe.com",
          "group": "Stripe, Inc.",
          "info1": "Merchant interface communication",
          "info2": "E-commerce",
          "info3": "Back-end API for Stripe’s merchant dashboard interface.",
          "info4": "Stripe’s own admin panel and merchant tools"
        },
        {
          "url": "r.stripe.com",
          "group": "Stripe, Inc.",
          "info1": "Redirect handling in secure flows",
          "info2": "E-commerce",
          "info3": "Redirection and routing service used during payment flows (e.g., 3D Secure).",
          "info4": "E-commerce platforms using secure authentication flows"
        },
        {
          "url": "s.amazon-adsystem.com",
          "group": "Amazon.com, Inc.",
          "info1": "Advertising and targeted marketing",
          "info2": "Advertising",
          "info3": "Amazon’s ad system domain for displaying and tracking ads across various websites.",
          "info4": "E-commerce sites, media sites with Amazon ads"
        },
        {
          "url": "arclight.vimeo.com",
          "group": "Vimeo, Inc.",
          "info1": "Video content delivery",
          "info2": "Media",
          "info3": "Vimeo’s domain for hosting and delivering video content through the ArcLight framework.",
          "info4": "Websites using Vimeo for video hosting"
        },
        {
          "url": "lensflare.vimeo.com",
          "group": "Vimeo, Inc.",
          "info1": "Video interaction and rendering",
          "info2": "Media",
          "info3": "Used by Vimeo for serving dynamic video content through its LensFlare framework.",
          "info4": "Websites with embedded Vimeo video content"
        },
        {
          "url": "player.vimeo.com",
          "group": "Vimeo, Inc.",
          "info1": "Video embedding and playback",
          "info2": "Media",
          "info3": "Vimeo’s domain for hosting and delivering embedded video players.",
          "info4": "Websites using embedded Vimeo players for video content"
        }
      ]

      // And get the trackers list as well
      let trackers = bgBadger.globals.trackerURLs;
      const filteredData = processTrackerData(data, trackers);

      try {
        // Must have atleast 1 tracker in the list
        if(filteredData.length > 0){
          // Create the visualization
          createVisualization(filteredData);
        }
      } catch (error) {
        console.error('Error:', error);
        const visualization = document.getElementById('visualization');
        visualization.innerHTML = `<p style="color: red; padding: 10px;">Error loading visualization: ${error.message}</p>`;
      }
    }
    else{
      // Hide the entire visualization
      container.style.display = 'none';
    }

    // Function that sets up data to be visualized
    function processTrackerData(rawData, trackers) {
      // Create Set for O(1) lookups and automatic deduplication
      const trackerSet = new Set(trackers);
      const seenUrls = new Set();
      
      return rawData.filter(item => {
        // Only include if URL is in trackers and we haven't seen it before
        const shouldInclude = trackerSet.has(item.url) && !seenUrls.has(item.url);
        if (shouldInclude) seenUrls.add(item.url);
        return shouldInclude;
      });
    }

    function createVisualization(data) {
      // Check if D3 is loaded
      if (typeof d3 === 'undefined') {
        throw new Error('D3.js not loaded');
      }
    
      const node_size = 15;

      const container = d3.select("#visualization");
      const svg = container.select("svg");
      const infoDisplay = container.select(".info-display");
      
      // Get dimensions from container
      const width = parseInt(container.style("width"));
      const height = parseInt(container.style("height"));
      const center = { x: width / 2, y: height / 2 };
      
      // Set SVG background
      svg.style("background-color", "rgb(41, 41, 41)");

      // Create a color scale for groups
      const groups = [...new Set(data.map(d => d.group))];
      const colorScale = d3.scaleOrdinal()
        .domain(groups)
        .range(d3.schemeTableau10);
    
      // Create group centers with minimum distance from main center
      const minDistanceFromCenter = 100;
      const groupCenters = groups.map((group, i) => {
        // Calculate equal angles around the circle
        const angle = (i / groups.length) * Math.PI * 2;
        const distance = minDistanceFromCenter;
        
        return {
          id: group,
          x: center.x + Math.cos(angle) * distance,
          y: center.y + Math.sin(angle) * distance,
          color: colorScale(group)
        };
      });
    
      // Add invisible center point connections
      svg.selectAll(".center-connection")
        .data(groupCenters)
        .enter()
        .append("line")
        .attr("class", "center-connection")
        .attr("stroke", d => d.color)
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1)
        .attr("x1", center.x)
        .attr("y1", center.y)
        .attr("x2", d => d.x)
        .attr("y2", d => d.y);
    
      // Add invisible group centers
      const centers = svg.selectAll(".group-center")
        .data(groupCenters)
        .enter()
        .append("circle")
        .attr("class", "group-center")
        .attr("r", 1)
        .attr("fill", "none")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    
      // Add group labels
      svg.selectAll(".group-label")
        .data(groupCenters)
        .enter()
        .append("text")
        .attr("class", "group-label")
        .attr("x", d => d.x)
        .attr("y", d => d.y - 15)
        .attr("text-anchor", "middle")
        .attr("fill", d => d.color)
        .text(d => d.id);
    
      // Prepare node data with group references and default values
      const nodes = data.map(d => ({
        url: d.url,
        group: d.group,
        info1: d.info1 || "UNSET",
        info2: d.info2 || "UNSET",
        info3: d.info3 || "UNSET",
        info4: d.info4 || "UNSET",
        groupCenter: groupCenters.find(g => g.id === d.group),
        color: colorScale(d.group)
      }));
    
      // Create simulation
      const simulation = d3.forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-10))
      .force("center", d3.forceCenter(center.x, center.y).strength(0.02))
      .force("collision", d3.forceCollide().radius(node_size + 5).strength(0.7))
      .alphaDecay(0.05)
      .alphaTarget(0.3)
      .restart();
  
    
      // Add group forces - nodes attract to their group centers
      simulation.force("groupAttraction", d3.forceY()
        .y(d => d.groupCenter.y)
        .strength(0.15));
    
      simulation.force("groupAttractionX", d3.forceX()
        .x(d => d.groupCenter.x)
        .strength(0.15));
  
      // Force to keep groups separated using link forces
      const groupLinks = [];
      const minGroupDistance = 120; // Minimum distance between group centers
      
      // Create virtual links between all group centers
      for (let i = 0; i < groupCenters.length; i++) {
          for (let j = i + 1; j < groupCenters.length; j++) {
          groupLinks.push({
              source: groupCenters[i],
              target: groupCenters[j],
              distance: minGroupDistance
          });
          }
      }
  
      // Add group separation force
      simulation.force("groupSeparation", d3.forceLink(groupLinks)
          .id(d => d.id)
          .strength(0.8)
          .distance(minGroupDistance));
  
      // Force to maintain minimum distance from center
      simulation.force("centerDistance", d3.forceRadial()
          .radius(minDistanceFromCenter)
          .x(center.x)
          .y(center.y)
          .strength(0.15));
    
      // Add nodes to simulation
      simulation.nodes(nodes);
    
      // Create node elements
      const nodeElements = svg.selectAll(".node-group")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node-group");
    
      // Add glow effect first (so it appears behind the node)
      nodeElements.append("circle")
        .attr("class", "node-glow")
        .attr("r", node_size) // Same size as node
        .attr("fill", "none")
        .attr("stroke", d => d.color)
        .attr("stroke-width", 15) // Glow size
        .attr("stroke-opacity", 0.3); // Glow transparency

      // Add circles
      nodeElements.append("circle")
        .attr("class", "node")
        .attr("r", node_size)
        .attr("fill", d => d.color)
        .on("mouseover", function(event, d) {
          // Highlight node
          d3.select(this)
            .attr("stroke", "white")
            .attr("stroke-width", 2);
          
          // Show info display
          infoDisplay.style("visibility", "visible")
            .html(`
              <div><strong>URL:</strong> ${d.url}</div>
              <div><strong>Operator:</strong> ${d.group}</div>
              <div><strong>Purpose:</strong> ${d.info1}</div>
              <div><strong>Category:</strong> ${d.info2}</div>
              <div><strong>Description:</strong> ${d.info3}</div>
              <div><strong>Seen on:</strong> ${d.info4}</div>
            `);
        })
        .on("mouseout", function() {
          // Remove highlight
          d3.select(this)
            .attr("stroke", null);
          
          // Hide info display
          infoDisplay.style("visibility", "hidden");
        });
    
      // Add URL text to nodes
      nodeElements.append("text")
      .attr("class", "node-label")
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("fill", "white") // Alternatively `.attr("fill", d => d3.color(d.color).darker(0.5))`, but that's hard to read
      .text(d => {
        // Extract domain from URL for cleaner display
        try {
          const urlObj = new URL(d.url);
          return urlObj.hostname.replace('www.', '');
        } catch {
          return d.url.length > 15 ? d.url.substring(0, 12) + '...' : d.url;
        }
      });
    
      // Add connection lines from nodes to group centers
      const connectionLines = svg.selectAll(".node-connection")
        .data(nodes)
        .enter()
        .append("line")
        .attr("class", "node-connection")
        .attr("stroke", d => d.color)
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1);
    
      // Update positions on each tick
      simulation.on("tick", () => {
        // Update node positions
        nodeElements
          .attr("transform", d => `translate(${d.x},${d.y})`);
    
        // Update connection lines
        connectionLines
          .attr("x1", d => d.x)
          .attr("y1", d => d.y)
          .attr("x2", d => d.groupCenter.x)
          .attr("y2", d => d.groupCenter.y);
    
        // Update group center positions
        centers
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
    
        // Update center connection lines
        svg.selectAll(".center-connection")
          .attr("x2", d => d.x)
          .attr("y2", d => d.y);
    
        // Update group labels
        svg.selectAll(".group-label")
          .attr("x", d => d.x)
          .attr("y", d => d.y - 15);
      });
    }
  });
  