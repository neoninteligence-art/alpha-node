const fs = require('fs');
const path = require('path');

// CONFIGURAÇÃO AUTOMATIZADA
const DOMAIN = 'https://alpha-node-theta.vercel.app'; 
const PUBLIC_DIR = path.join(__dirname, 'public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

function getHtmlFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html') && !['google734cdbbfefe4b55e.html', 'template-tecnico.html'].includes(file)) {
            const relativePath = path.relative(PUBLIC_DIR, filePath).split(path.sep).join('/');
            fileList.push(relativePath);
        }
    });
    return fileList;
}

const files = getHtmlFiles(PUBLIC_DIR);
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${files.map(file => {
    const urlPath = file === 'index.html' ? '' : file;
    let priority = '0.7';
    if (file === 'index.html' || file.startsWith('us/')) priority = '1.0';
    if (file.startsWith('br/')) priority = '0.8';
    return `  <url>
    <loc>${DOMAIN}/${urlPath}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n')}
</urlset>`;

try {
    fs.writeFileSync(SITEMAP_PATH, sitemapContent);
    console.log(`🚀 [VORTEX AUTO] Sitemap: ${files.length} URLs sincronizadas.`);
} catch (e) {
    console.error(`❌ Erro: ${e.message}`);
}
