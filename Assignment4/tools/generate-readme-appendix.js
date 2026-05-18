/*
  Generates the "Appendix: Full File Contents" section in README.md.

  Why this exists:
  - You want everything in a single README for viva.
  - Copy-pasting long files manually is error-prone.

  How it works:
  - Finds markers:
      <!-- AUTO-APPENDIX:START -->
      <!-- AUTO-APPENDIX:END -->
  - Replaces everything between them with <details> blocks that embed each text file.
  - Lists images as filenames (binary content is not embedded).

  Usage:
    node tools/generate-readme-appendix.js
*/

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const readmePath = path.join(projectRoot, 'README.md');

const START = '<!-- AUTO-APPENDIX:START -->';
const END = '<!-- AUTO-APPENDIX:END -->';

function isBinaryAsset(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico'].includes(ext);
}

function languageForFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.js') return 'js';
  if (ext === '.json') return 'json';
  if (ext === '.css') return 'css';
  if (ext === '.ejs') return 'ejs';
  if (ext === '.html') return 'html';
  if (ext === '.md') return 'md';
  return '';
}

function walk(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    // Skip common noise
    if (entry.name === 'node_modules') continue;
    if (entry.name === '.git') continue;

    const full = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else {
      files.push(full);
    }
  }

  return files;
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function buildAppendix() {
  const allFiles = walk(projectRoot);

  // We never embed README itself (it would recurse) or our generator script.
  const excluded = new Set([
    path.resolve(readmePath),
    path.resolve(__filename),
  ]);

  const textFiles = [];
  const binaryFiles = [];

  for (const file of allFiles) {
    const resolved = path.resolve(file);
    if (excluded.has(resolved)) continue;

    if (isBinaryAsset(file)) {
      binaryFiles.push(file);
    } else {
      textFiles.push(file);
    }
  }

  // Keep the output stable
  textFiles.sort((a, b) => toPosix(path.relative(projectRoot, a)).localeCompare(toPosix(path.relative(projectRoot, b))));
  binaryFiles.sort((a, b) => toPosix(path.relative(projectRoot, a)).localeCompare(toPosix(path.relative(projectRoot, b))));

  let out = '';

  out += '\n### 🧾 Text files (embedded)\n\n';

  for (const file of textFiles) {
    const rel = toPosix(path.relative(projectRoot, file));
    const lang = languageForFile(file);
    const content = fs.readFileSync(file, 'utf8');

    out += `<details>\n<summary><strong>${rel}</strong></summary>\n\n`;
    out += `\n\n\`\`\`${lang}\n${content}\n\`\`\`\n\n`;
    out += `</details>\n\n`;
  }

  out += '\n### 🖼️ Binary assets (listed)\n\n';

  if (binaryFiles.length === 0) {
    out += '- (none)\n';
  } else {
    for (const file of binaryFiles) {
      const rel = toPosix(path.relative(projectRoot, file));
      out += `- ${rel}\n`;
    }
  }

  return out.trimEnd() + '\n';
}

function updateReadme() {
  const readme = fs.readFileSync(readmePath, 'utf8');

  const startIndex = readme.indexOf(START);
  const endIndex = readme.indexOf(END);

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error('Appendix markers not found or in wrong order in README.md');
  }

  const before = readme.slice(0, startIndex + START.length);
  const after = readme.slice(endIndex);

  const appendix = buildAppendix();

  const updated = `${before}\n\n${appendix}\n${after}`;
  fs.writeFileSync(readmePath, updated, 'utf8');
}

try {
  updateReadme();
  console.log('README appendix generated successfully.');
} catch (err) {
  console.error(err);
  process.exitCode = 1;
}
