import fs from "fs";
import path from "path";
import { marked } from "marked";
import matter from "gray-matter";
import yaml from "js-yaml";
import Handlebars from "handlebars";
import helpers from 'handlebars-helpers';

helpers({ handlebars: Handlebars });

Handlebars.registerHelper('slugify', function(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^\w\s-]/g,'')
    .replace(/\s+/g, '-')
    .replace(/-+/g,'-')
    .replace(/^-+|-+$/g, '');
});
const colors = { bright: '\x1b[1m', magenta: '\x1b[35m', cyan: '\x1b[36m', dim: '\x1b[2m', reset: '\x1b[0m' };
function showBanner() {
  console.clear();
  console.log(colors.bright + colors.magenta + `
 █████╗ ██╗  ██╗
██╔══██╗╚██╗██╔╝
███████║ ╚███╔╝ 
██╔══██║ ██╔██╗ 
██║  ██║██╔╝ ██╗
╚═╝  ╚═╝╚═╝  ╚═╝
` + colors.reset);
  console.log(colors.bright + colors.cyan + 'MINIMALIST STATIC SITE GENERATOR' + colors.reset);
  console.log(colors.dim + 'v1.0.0' + colors.reset); console.log('');
}

/** Recursively loads all templates (and partials) into an object. */
function loadTemplates(dir="templates",prefix="") {
  let res = {};
  for(let file of fs.readdirSync(dir)){
    let full = path.join(dir,file);
    if(fs.statSync(full).isDirectory()) {
      Object.assign(res, loadTemplates(full,prefix+file+"/"));
    } else if(/\.(ax|html)$/.test(file)){
      let key = file.replace(/\.(ax|html)$/,"");
      res[prefix+key]=fs.readFileSync(full,"utf8");
      Handlebars.registerPartial(key, res[prefix+key]);
      Handlebars.registerPartial(prefix+key, res[prefix+key]);
    }
  }
  return res;
}

function renderTpl(tpl, ctx) {
  if (!tpl) return "";
  return Handlebars.compile(tpl)(ctx);
}

function generateSeoTags(ctx) {
  // SEO meta tags based on context
  return `
<title>${ctx.title || ''} | ${ctx.site.name || ''}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${ctx.description || ''}">
<meta name="author" content="${(ctx.site.author && ctx.site.author.name) || ''}">
<meta property="og:title" content="${ctx.title || ''} | ${(ctx.site && ctx.site.name) || ''}">
<meta property="og:locale" content="${(ctx.site && ctx.site.locale) || ''}">
<meta property="locale" content="${(ctx.site && ctx.site.locale) || ''}">
<meta property="og:description" content="${ctx.description || ''}">
<meta property="og:type" content="website">
<meta property="og:image" content="${(ctx.site && ctx.site.icon) || ''}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${ctx.title || ''} | ${(ctx.site && ctx.site.name) || ''}">
<meta name="twitter:description" content="${ctx.description || ''}">
<meta name="twitter:image" content="${(ctx.site && ctx.site.icon) || ctx.image || ''}">
<meta name="generator" content="AX Axcora ssg"/>
`.trim();
}

function injectSeo(html, ctx) {
  return html.replace("<!-- AX AXCORA_SEO -->", generateSeoTags(ctx));
}

/**
 * Recursively renders any template key, respecting frontmatter `layout`
 */
function renderWithLayoutRecursive(tplKey, ctx, templates) {
  let src = templates[tplKey];
  // PATCH: fallback otomatis ke tema blog jika template koleksi baru belum ada
  if (!src) {
    if (tplKey.endsWith('-list-item')) src = templates['blog-list-item'];
    else if (tplKey.endsWith('-list')) src = templates['blog-list'];
    else if (tplKey.endsWith('-post')) src = templates['blog-post'];
    else src = templates[tplKey]; // other partials
    if (!src) return "";
  }
  let ax = matter(src);
  let html = renderTpl(ax.content, ctx);
  if (ax.data && ax.data.layout) {
    let layoutKey = ax.data.layout.replace(/\.(ax|html)$/,'');
    let layoutSrc = templates[layoutKey] || templates.layout;
    return renderTpl(layoutSrc, {
      ...ctx,
      content: html,
      page: ctx.page || { title: ax.data.title || "", description: ax.data.description || "" }
    });
  } else {
    return html;
  }
}


function copyDir(src, dest){
  fs.mkdirSync(dest, {recursive:true});
  for (const entry of fs.readdirSync(src,{withFileTypes:true})){
    const srcPath = path.join(src, entry.name), destPath = path.join(dest, entry.name);
    if(entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

/** Loads all collections, returns { collectionName: [post, ...], ... } */
function getCollections() {
  const coll = {};
  for(let dir of fs.readdirSync("content", {withFileTypes:true})){
    if(!dir.isDirectory() || dir.name==="pages") continue;
    const name = dir.name;
    let items = fs.readdirSync(`content/${name}`).filter(f=>f.endsWith(".md")).map(f=>{
      let {data, content} = matter(fs.readFileSync(`content/${name}/${f}`,"utf8"));
      let parsed = {
        ...data,
        content: typeof content === "string" ? marked(content) : "",
        excerpt: typeof content === "string"
          ? marked(content.split("\n\n").slice(0, 1).join("\n\n"))
          : "",
        slug: f.replace(/\.md$/,""),
        tags: Array.isArray(data.tags) ? data.tags : []
      };
      Object.keys(parsed).forEach(key=>{
        if(typeof parsed[key]==="object" && parsed[key]!==null && parsed[key].constructor===Object){
          parsed[key] = JSON.parse(JSON.stringify(parsed[key]));
        }
      });
      return parsed;
    });
    coll[name] = items;
  }
  return coll;
}

function buildSitemap(pages, siteData) {
  const siteUrl = siteData.url?.replace(/\/$/,"") || "";
  let xml = [    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ];
  for (let page of pages) { 
    xml.push(`<url><loc>${siteUrl}${page.replace(/^dist/, "")}</loc></url>`); 
  }
  xml.push("</urlset>");
  fs.writeFileSync("dist/sitemap.xml", xml.join("\n"));
}

function buildRss(siteData, collections, excludeRss) {
  const siteUrl = siteData.url?.replace(/\/$/,"") || "";
  let items = [];
  for (let [cname, coll] of Object.entries(collections)) {
    if (excludeRss.includes(cname)) continue;
    for (let item of coll) {
      items.push(`<item>
<title><![CDATA[${item.title || item.slug}]]></title>
<link>${siteUrl}/${cname}/${item.slug}.html</link>
<pubDate>${item.date || new Date().toUTCString()}</pubDate>
<description><![CDATA[${item.summary || item.excerpt || ""}]]></description>
</item>`);
    }
    break; // Only main collection for RSS
  }
  const rss = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>${siteData.name}</title>
    <description>${siteData.description || ""}</description>
    <link>${siteUrl}/</link>
    ${items.join("\n")}
  </channel>
</rss>`;
  fs.writeFileSync("dist/rss.xml", rss);
}

function buildRobots(siteData) {
  let lines = [    "User-agent: *",
    "Allow: /",
    `Sitemap: ${siteData.url?.replace(/\/$/, "") || ""}/sitemap.xml`
  ];
  fs.writeFileSync("dist/robots.txt", lines.join("\n"));
}

// --- MAIN BUILD FLOW ---
showBanner();

// Load configuration, data, templates, and collections
let siteData;
if (fs.existsSync("data/site.json")) {
  siteData = JSON.parse(fs.readFileSync("data/site.json", "utf8"));
} else if (fs.existsSync("data/site.yaml")) {
  siteData = yaml.load(fs.readFileSync("data/site.yaml", "utf8"));
} else if (fs.existsSync("data/site.yml")) {
  siteData = yaml.load(fs.readFileSync("data/site.yml", "utf8"));
} else {
  throw new Error("No site.json or site.yaml found in data/");
}
const excludeSitemap = siteData.exclude_sitemap || [];
const excludeRss = siteData.exclude_rss || [];

function loadContentData(root="content") {
  const res = {};
  const walk = dir => {
    for (let entry of fs.readdirSync(dir, {withFileTypes:true})) {
      const full = path.join(dir,entry.name);
      if (entry.isDirectory()) walk(full);
      else if(/^data[^.]*\.json$/i.test(entry.name)) {
        res[entry.name.replace(/\..*/,"")] = JSON.parse(fs.readFileSync(full,"utf8"));
      }
      else if(/^data[^.]*\.ya?ml$/i.test(entry.name)) {
        res[entry.name.replace(/\..*/,"")] = yaml.load(fs.readFileSync(full,"utf8"));
      }
    }
  }; walk(root); return res;
}

const dataFiles  = loadContentData();
const templates  = loadTemplates();
const collections= getCollections();

if(fs.existsSync("dist")) fs.rmSync("dist",{recursive:true,force:true});
fs.mkdirSync("dist");

// Copy assets
if(fs.existsSync("assets")) copyDir("assets", "dist/assets");

let totalPages = 0, totalPosts = 0, totalCollections = Object.keys(collections).length;
const POSTS_PER_PAGE = 6;

// --- BUILD COLLECTION LISTS AND POSTS ---
for (let [cname, citems] of Object.entries(collections)) {
  const totalPageCount = Math.max(1, Math.ceil(citems.length / POSTS_PER_PAGE));
  // Pagination/list pages
  for (let page = 0; page < totalPageCount; page++) {
    const pageItems = citems.slice(page * POSTS_PER_PAGE, (page+1) * POSTS_PER_PAGE);
    const itemListHtml = pageItems.map(item =>
      renderWithLayoutRecursive(`${cname}-list-item`, { ...item, cname }, templates)
    ).join('');
    const prevPage = (page === 0) ? null : (page === 1 ? `/${cname}/` : `/${cname}/page/${page}.html`);
    const nextPage = (page < totalPageCount-1) ? `/${cname}/page/${page+2}.html` : null;

    const listContext = {
      items: itemListHtml,
      pageNum: page+1,
      totalPages: totalPageCount,
      prevPage,
      nextPage,
      title: `${siteData.name} - ${cname}`,
      description: siteData.description || '',
      site: siteData,
      image: siteData.icon || '',
      ...dataFiles
    };

    const listHtml = renderWithLayoutRecursive(
      `${cname}-list`,
      listContext,
      templates
    );

    let outFile = (page === 0)
      ? `dist/${cname}/index.html`
      : `dist/${cname}/page/${page+1}.html`;

    fs.mkdirSync(path.dirname(outFile), {recursive:true});
    fs.writeFileSync(outFile, injectSeo(listHtml, listContext));
    totalPages++;
  }
  // Single post pages
  for (let i = 0; i < citems.length; i++) {
    let item = citems[i];
    let prev = (i < citems.length - 1) ? citems[i+1] : null;
    let next = (i > 0) ? citems[i-1] : null;
    let postContext = {
      ...item,
      cname,
      site: siteData,
      prev: prev && { url: `/${cname}/${prev.slug}.html`, title: prev.title },
      next: next && { url: `/${cname}/${next.slug}.html`, title: next.title },
      title: item.title || item.slug,
      description: item.description || item.excerpt || "",
      image: siteData.icon || "",
      ...dataFiles
    };
    let postHtml = renderWithLayoutRecursive(
      `${cname}-post`,
      postContext,
      templates
    );
    let outFile = `dist/${cname}/${item.slug}.html`;
    fs.mkdirSync(path.dirname(outFile), {recursive:true});
    fs.writeFileSync(outFile, injectSeo(postHtml, postContext));
    totalPosts++;
  }
}

// --- TAGS HTML and Tag Pages ---
if (collections.blog) {
  const uniqueTags = [...new Set(collections.blog.flatMap(post => Array.isArray(post.tags) ? post.tags : []))];

  // Tag cloud page
  const tagCloudHtml = uniqueTags.map(tag =>
    `<a href="/tag/${Handlebars.helpers.slugify(tag)}.html" class="tag">${tag}</a>`
  ).join(' ');

  const tagsContext = {
    tags: uniqueTags,
    tagCloudHtml,
    site: siteData,
    title: "Tags",
    description: "Tag archive for this blog",
    image: siteData.icon || '',
    ...dataFiles,
    page: { title: "Tags", description: "Tag archive for this blog" }
  };

  const tagsHtml = renderWithLayoutRecursive("tags", tagsContext, templates);
  fs.writeFileSync("dist/tags.html", injectSeo(tagsHtml, tagsContext));

  // --- Generate per-tag pages ---
  for (let tag of uniqueTags) {
    const posts = collections.blog.filter(post =>
      Array.isArray(post.tags) && post.tags.includes(tag)
    );
    const itemsHtml = posts.map(post =>
      renderWithLayoutRecursive("blog-list-item", { ...post, cname: "blog" }, templates)
    ).join('');
    const tagContext = {
      items: itemsHtml,
      tag,
      site: siteData,
      title: `Tag: ${tag}`,
      description: `Posts tagged with "${tag}"`,
      image: siteData.icon || '',
      ...dataFiles,
      page: { title: `Tag: ${tag}`, description: `Posts tagged with "${tag}"` }
    };
    const tagListHtml = renderWithLayoutRecursive("blog-list", tagContext, templates);

    fs.mkdirSync("dist/tag", {recursive:true});
    fs.writeFileSync(
      `dist/tag/${Handlebars.helpers.slugify(tag)}.html`,
      injectSeo(tagListHtml, tagContext)
    );
  }
}

// --- Index page ---
const latestPosts = collections.blog ? collections.blog.slice(0,6) : [];
const indexContext = {
  posts: latestPosts,
  site: siteData,
  title: siteData.title || "Welcome to AX SSG",
  description: siteData.description || "",
  image: siteData.icon || "",
  ...dataFiles
};
const indexHtml = renderWithLayoutRecursive("index", indexContext, templates);
fs.writeFileSync("dist/index.html", injectSeo(indexHtml, indexContext));

// --- Static pages ---
if (fs.existsSync("content/pages")) {
  for (let f of fs.readdirSync("content/pages").filter(x => x.endsWith('.md'))) {
    // Load the markdown and frontmatter
    let { data, content } = matter(fs.readFileSync(`content/pages/${f}`,"utf8"));
    let pageData = { ...data, content: marked(content) };

    let extraVars = {};
    if (f.toLowerCase() === "index.md") {
      extraVars.posts = collections.blog ? collections.blog.slice(0, 6) : [];
    }
    let tplKey = data.layout ? data.layout.replace(/\.(ax|html)$/,'')
      : (templates.page ? "page" : null);

    let pageContext = {
      ...pageData,
      ...extraVars,
      site: siteData,
      title: data.title || f,
      description: data.description || "",
      image: siteData.icon || "",
      ...dataFiles,
      page: { title: data.title || f, description: data.description || "" }
    };

    let rendered = tplKey
      ? renderWithLayoutRecursive(tplKey, pageContext, templates)
      : pageData.content;

    fs.mkdirSync("dist", {recursive:true});
    fs.writeFileSync(`dist/${f.replace(/\.md$/, ".html")}`, injectSeo(rendered, pageContext));
    totalPages++;
  }
}

// --- Build Sitemap, RSS, robots.txt ---
let allPages = [];
const DIST_DIR = "dist";
function findHtmlFiles(dir) {
  for (let entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) findHtmlFiles(fullPath);
    else if (entry.name.endsWith('.html')) {
      const parts = path.relative(DIST_DIR, fullPath).split(path.sep);
      if (excludeSitemap.includes(parts)) continue;
      allPages.push("/" + parts.join("/"));
    }
  }
}
findHtmlFiles(DIST_DIR);

if (!siteData.disable_sitemap) buildSitemap(allPages, siteData);
if (!siteData.disable_rss && Object.keys(collections).length > 0) buildRss(siteData, collections, excludeRss);
if (!siteData.disable_robots) buildRobots(siteData);

console.log(
  colors.cyan + "✓ Build success • Pages:", totalPages,
  "| Posts:", totalPosts,
  "| Collections:", totalCollections,
  "| Live: http://localhost:3000" + colors.reset
);



