---
title: "Getting Started with AX SSG The Essential Guide"
date: "2025-08-28"
description: "creates a clean folder structure, including directories for your content, templates, assets, and site data."
image: "/assets/img/axs.jpg"
tags: [tutorial, getting started, axcora, web design]
---

Starting a new project with Axcora AX SSG is fast and intuitive. The first step is to install AX via the official CLI and initialize a project skeleton with the `ax init <project>` command. This creates a clean folder structure, including directories for your content, templates, assets, and site data.

Inside `content/`, you will create your pages (for instance, an `about.md`) and organize blog posts under `blog/`. All content is written in Markdown, making it easy for writers and editors to contribute. The `templates/` directory is where your site’s layouts and partials live, written in Handlebars syntax for maximum reusability. AX automatically registers templates and partials, so you don’t need to configure anything manually.

Add your site configuration to `data/site.json` or `data/site.yml`. This holds your title, base URL, description, and other metadata used in your templates. To build your site, simply run `ax build` in your terminal; your static files will be generated in the `dist/` directory, ready for deployment.

Assets such as images and stylesheets are kept in the `assets/` directory and are automatically copied to `dist/assets/` when you build. For development, launch the local server with `ax dev`—your site will update automatically as you make changes.

In summary, AX SSG is crafted for a hassle-free experience. There is no complicated configuration, no tangled dependency chain—just clean folders, readable code, and instant builds. Whether you're building a blog or documentation site, Axcora AX SSG is the fastest way to create and deploy static websites in 2025.
