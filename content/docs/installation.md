---
title: "Quick Start and Installation AX SSG"
date: "2025-09-03"
image: "/assets/img/axs.jpg"
description: "How to first run - install and create new project with Axcora AX SSG"
tags: 
 - static site generator
 - installation
 - create new project
 - initial
---
### Quick Start

1. **Install Node.js** (v20 or higher).
2. **Install AX SSG Globaly**
3. **No npm modules needed**—AX SSG runs out of the box.

### [Installation and Run Your Project](/docs/installation.html)

Using AX CLI

```bash
# Install AX SSG
npm install -g axcora-ax

# Create new project
ax init myproject

# Access your project
cd myproject

# Run project
ax dev

# Open web browser http://localhost:3000

# Build your site (outputs to /dist)
ax build

# Serve built site via local HTTP server
ax serve

# Clean up all generated files
ax clean
```

Using Npm

```bash
# Clone starter project
git clone https://github.com/mesinkasir/ax-starter.git

# Open starter project
cd ax-starter

# Build Your project
npm run build

# Run your project
npm run dev

# Open web browser http://localhost:3000

# build for production and upload dist folder into your host
npm run build

# Serve built site via local HTTP server
npm run serve

# Clean up all generated files
npm run clean
```


## Extensibility

- Add custom templates or layouts by dropping `.ax`/`.html` files into `templates/`.
- Customize navigation or social links inside `data/site.json`.
- Easily import any CSS/JS by editing `assets/` and templates.

---

## Use Cases

- Personal and team blogs
- Marketing and promo landing pages
- Documentation
- Lightweight public sites where performance, SEO, and ease-of-use matter

---

For a detailed guide and examples, visit **Axcora's official SSG site** and component documentation[3][1].

**AX SSG** is released under the MIT License and welcomes contributions and feedback.