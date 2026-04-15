const fs = require('fs');
const path = require('path');

// Configurações principais
const DOMAIN = 'https://alpha-node-tawny.vercel.app'; 
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

// Lista de pastas que o script vai varrer
const countries = ['bg', 'cz', 'hu', 'pl', 'ro', 'us', 'br'];

function generateSitemap() {
    console.log('Iniciando varredura para o Sitemap...');
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 1. Arquivos da raiz da pasta public (ex: index.html)
    if (fs.existsSync(PUBLIC_DIR)) {
        const rootFiles = fs.readdirSync(PUBLIC_DIR).filter(file => file.endsWith('.html'));
        rootFiles.forEach(file => {
            xml += `  <url>\n    <loc>${DOMAIN}/${file}</loc>\n    <priority>0.8</priority>\n  </url>\n`;
        });
    }

    // 2. Arquivos dentro das pastas de cada país
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

    try {
        fs.writeFileSync(SITEMAP_PATH, xml);
        console.log(`✅ SUCESSO: Sitemap gerado com todos os links das pastas.`);
    } catch (err) {
        console.error('❌ ERRO ao gravar arquivo:', err);
    }
}

generateSitemap();
