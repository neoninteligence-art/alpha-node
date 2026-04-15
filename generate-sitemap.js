const fs = require('fs');
const path = require('path');

// Configurações
const DOMAIN = 'https://seusite.com'; // SUBSTITUA PELO SEU DOMÍNIO
const PUBLIC_DIR = path.join(__dirname, 'public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

// Pastas que queremos monitorar
const countries = ['bg', 'cz', 'hu', 'pl', 'ro', 'us', 'br'];

function generateSitemap() {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 1. Adiciona a Home e arquivos soltos na raiz da public (como index.html)
    const rootFiles = fs.readdirSync(PUBLIC_DIR).filter(file => file.endsWith('.html'));
    rootFiles.forEach(file => {
        xml += `  <url>\n    <loc>${DOMAIN}/${file}</loc>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    // 2. Varre as pastas de países
    countries.forEach(country => {
        const countryPath = path.join(PUBLIC_DIR, country);
        
        if (fs.existsSync(countryPath)) {
            const files = fs.readdirSync(countryPath).filter(file => file.endsWith('.html'));
            files.forEach(file => {
                xml += `  <url>\n    <loc>${DOMAIN}/${country}/${file}</loc>\n    <priority>0.7</priority>\n  </url>\n`;
            });
        }
    });

    xml += `</urlset>`;

    fs.writeFileSync(SITEMAP_PATH, xml);
    console.log(`✅ Sitemap gerado com sucesso em: ${SITEMAP_PATH}`);
}

generateSitemap();
