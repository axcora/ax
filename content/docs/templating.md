---
title: "AX SSG Templating"
date: "2025-08-29"
description: "Tempating AX Axcora Static Site Generator"
image: "/assets/img/axcora1.jpg"
tags: 
 - static site generator
 - templating
---

## [Templating](/docs/templating.html)

Templates use Handlebars syntax, with support for layouts, partials, and helpers (e.g., `{{title}}`, `{{{content}}}`, `{{#each posts}} ... {{/each}}`). Layouts like `layout.ax` wrap all content for a consistent site structure.

Templates define how pages are rendered. They’re written in Handlebars (.ax extension or .html).
+ index.ax: Homepage template
+ layout.ax: Shared site frame; all pages are wrapped by this
+ blog-list.ax, blog-list-item.ax, blog-post.ax: For archive and blog post pages

### Implementation

From your `data`
```
{{site.title}}
{{site.description}}
{{site.url}}
```

From your content frontmatter markdown
```
{{title}}
{{description}}
{{image}}
```

Loop from `data`
```
{{#each site.nav}}
<a href="{{url}}">{{title}}</a>
{{/each}}
```

Conditional Example
```
{{# if image}}
<img src="{{image}}"/>
{{else}}
<img src="/assets/img/logo.png"/>
{{if}}
```

## Extensibility

- Add custom templates or layouts by dropping `.ax`/`.html` files into `templates/`.
- Customize navigation or social links inside `data/site.json`.
- Easily import any CSS/JS by editing `assets/` and templates.
