const fs = require('fs');
const path = require('path');

// Configurações principais
const DOMAIN = 'https://alpha-node-tawny.vercel.app'; 
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

function getAllHtmlFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllHtmlFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.html')) {
                // Transforma o caminho do arquivo em uma rota de URL
                const relativePath = path.relative(PUBLIC_DIR, path.join(dirPath, file));
                const urlPath = relativePath.replace(/\\/g, '/'); // Garante barras de URL no Windows
                arrayOfFiles.push(urlPath);
            }
        }
    });

    return arrayOfFiles;
}

function generateSitemap() {
    console.log('🚀 Iniciando varredura recursiva para o Sitemap...');
    
    const today = new Date().toISOString().split('T')[0];
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    try {
        const allFiles = getAllHtmlFiles(PUBLIC_DIR);

        allFiles.forEach(file => {
            // Remove o "index.html" da URL final para ficar mais limpo (SEO)
            const cleanPath = file === 'index.html' ? '' : file;
            const priority = file.split('/').length > 1 ? '0.7' : '1.0'; // Raiz tem prioridade 1.0

            xml += `  <url>\n`;
            xml += `    <loc>${DOMAIN}/${cleanPath}</loc>\n`;
            xml += `    <lastmod>${today}</lastmod>\n`;
            xml += `    <priority>${priority}</priority>\n`;
            xml += `  </url>\n`;
        });

        xml += `</urlset>`;
        fs.writeFileSync(SITEMAP_PATH, xml);
        console.log(`✅ SUCESSO: ${allFiles.length} links mapeados no sitemap.xml`);
    } catch (err) {
        console.error('❌ ERRO CRÍTICO no Arquiteto:', err);
    }
}

generateSitemap();
