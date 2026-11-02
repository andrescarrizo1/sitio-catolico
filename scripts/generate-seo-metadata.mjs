import fs from 'node:fs';
import path from 'node:path';

function getHtmlFiles(dir) {
  let res = [];
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) {
      res = res.concat(getHtmlFiles(full));
    } else if (f.name.endsWith('.html')) {
      res.push(full);
    }
  }
  return res;
}

const distDir = path.resolve('dist');
const files = getHtmlFiles(distDir);
const rows = [['url', 'lang', 'title', 'title_len', 'description', 'description_len', 'canonical', 'og:locale', 'og:image', 'flags']];

for (const f of files.sort()) {
  const content = fs.readFileSync(f, 'utf8');
  let url = '/' + path.relative(distDir, f).replace(/\\/g, '/').replace(/index\.html$/, '');
  if (url !== '/' && !url.endsWith('/') && !url.endsWith('.html')) url += '/';

  const langMatch = content.match(/<html[^>]+lang=["']([^"']+)["']/i);
  const lang = langMatch ? langMatch[1] : '';

  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : '';

  const descMatch = content.match(/<meta\s+name=["']description["']\s+content="([^"]+)"/i) ||
                    content.match(/<meta\s+name=["']description["']\s+content='([^']+)'/i) ||
                    content.match(/<meta\s+content="([^"]+)"\s+name=["']description["']/i) ||
                    content.match(/<meta\s+content='([^']+)'\s+name=["']description["']/i);
  const desc = descMatch ? descMatch[1] : '';

  const canMatch = content.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const can = canMatch ? canMatch[1] : '';

  const ogeMatch = content.match(/<meta[^>]+property=["']og:locale["'][^>]+content=["']([^"']+)["']/i) ||
                   content.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:locale["']/i);
  const oge = ogeMatch ? ogeMatch[1] : '';

  const ogiMatch = content.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                   content.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  const ogi = ogiMatch ? ogiMatch[1] : '';

  const flags = [];
  if (title.length > 60) flags.push('title>60');
  if (desc.length < 120 || desc.length > 155) flags.push(`desc_len=${desc.length}`);

  rows.push([
    url,
    lang,
    `"${title.replace(/"/g, '""')}"`,
    title.length,
    `"${desc.replace(/"/g, '""')}"`,
    desc.length,
    can,
    oge,
    ogi,
    `"${flags.join(';')}"`
  ]);
}

const csv = rows.map(r => r.join(',')).join('\n') + '\n';
fs.writeFileSync(path.resolve('docs/seo_metadata.csv'), csv, 'utf8');
console.log(`✓ docs/seo_metadata.csv regenerated with ${files.length} pages.`);
