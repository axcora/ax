---
title: "Configuration Your Site"
date: "2025-09-02"
image: "/assets/img/axs.jpg"
description: "Setup and Configuration your website project"
tags: 
 - static site generator
 - configuration
 - setup
---
### [Setup and Configuration](/docs/configuration.html)

For first you need to setup your website project, open on `data/site.json` and update it.

```json
{
  "name": "AX SSG",
  "lang": "en",
  "locale": "en-US",
  "description": "Demo site built with AX SSG - minimalist static site generator with modern design - by Axcora tech",
  "url": "http://localhost:3000",
  "icon": "/assets/img/logo.png",
  "author": {
              "name": "Axcora Team", 
              "url": "https://ax.axcora.com" 
   },
  "blog_list_title": "The Blog",
  "show_blog_list": "6",
  "title": "AX",
  "nav": [
    { "title": "Home", "url": "/" },
    { "title": "Blog", "url": "/blog/" },
    { "title": "Tags", "url": "/tags.html" },
    { "title": "About", "url": "/about.html" }
  ],
  "social": [
    { "name": "GitHub", "url": "https://github.com/sponsors/mesinkasir/"},
    { "name": "Website", "url": "https://ax.axcora.com/" }
  ]
}

```
