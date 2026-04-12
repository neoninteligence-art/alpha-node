// [AION-FRENTE-03.1] SHADOW-PROXY-ADVANCED
// FINALIDADE: ROTEAMENTO COM OFUSCAÇÃO DE IP E DISFARCE DE BROWSER
export default async function handler(req, res) {
    const { target_url, api_key } = req.query;

    if (!target_url) {
        return res.status(400).json({ error: 'Target URL is required' });
    }

    // GERAÇÃO DE IP ALEATÓRIO PARA CADA REQUISIÇÃO (ANTI-BLOCK)
    const fakeIp = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

    try {
        const response = await fetch(target_url, {
            method: req.method,
            headers: {
                'Authorization': `Bearer ${api_key || ''}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'X-Forwarded-For': fakeIp, // Engana o alvo sobre a origem real
                'Accept-Language': 'en-US,en;q=0.9'
            },
            body: req.method !== 'GET' && req.body ? JSON.stringify(req.body) : null
        });

        const data = await response.json();
        
        // Headers de Segurança e Permissão
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('X-Aion-Status', 'Shadow-Routed');
        
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Proxy Shadow Failed', status: 'Offline' });
    }
}
