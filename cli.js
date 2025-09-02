#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper: recursively copy directory
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [,, cmd, arg] = process.argv;

switch (cmd) {
  case 'build':
    import('./build.js');
    break;
  case 'dev':
    import('./dev.js');
    break;
  case 'serve':
    import('./serve.js');
    break;
  case 'init': {
    if (!arg) {
      console.log('Usage: ax init <project-name>\n');
      console.log('Example: ax init myblog');
      process.exit(1);
    }
    const starterSrc = path.join(__dirname, 'starter');
    const newProjectDir = path.resolve(process.cwd(), arg);

    // Check if starter template exists
    if (!fs.existsSync(starterSrc)) {
      console.log('Error: "starter" not found!');
      process.exit(1);
    }
    // Prevent overwrite
    if (fs.existsSync(newProjectDir)) {
      const files = fs.readdirSync(newProjectDir).filter(name => !name.startsWith('.'));
      if (files.length > 0) {
        console.log(`⚠️  Folder "${arg}" already exists and is NOT empty. Please choose a different name or remove the existing folder.`);
        process.exit(1);
      }
    } else {
      fs.mkdirSync(newProjectDir, { recursive: true });
    }

    copyDirSync(starterSrc, newProjectDir);

    console.log(`✅ New project "${arg}" created in "${newProjectDir}"`);
    console.log('\nNext steps:');
    console.log(`  cd ${arg}`);
    console.log('  npm run dev   # start dev server with auto build');
    console.log('  npm run serve # preview/project static build');
    break;
  }
  default:
    console.log(`
Usage: ax <command>

Commands:
  build    Build the static site for production
  dev      Start development server with live reload
  serve    Preview the dist folder (static server)
  init     Initialize a new project starter from templates (e.g. ax init starter)

Examples:
  ax build
  ax dev
  ax serve
  ax init starter

Tips:
- Run "ax init starter" in new folder to create a new starter project.
- More info: https://ax.axcora.com
`);
}
