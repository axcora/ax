---
title: "Content and Collections"
date: "2025-08-30"
description: "Create content for blog post or static pages"
image: "/assets/img/ax5.webp"
tags: 
 - static site generator
 - content
 - static page
 - blog
 - collections
---

## [Content and Collections](/docs/content.html)

- All **blog posts** are markdown files under `content/blog/`, with YAML/JSON frontmatter for title, description, image, tags, etc.
- **Static pages** live in `content/pages/`.
- Content files receive auto-generated slugs, excerpts, and can specify custom layouts.

**Example markdown frontmatter:**

```markdown
---
title: "Your Blog Post Title"
description: "A short SEO-friendly description."
date: "2025-08-11"
image: "/assets/img/example.jpg"
tags: [javascript, ssg, axcora]
---
Your post content in markdown here...
```
or you can use markdown tags with this structures

```markdown
---
title: "Your Blog Post Title"
description: "A short SEO-friendly description."
date: "2025-08-11"
image: "/assets/img/example.jpg"
tags: 
 - static site generator
 - content
 - static page
 - blog
 - collections
---
Your post content in markdown here...
```