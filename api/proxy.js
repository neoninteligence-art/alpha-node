// [AION-FRENTE-03] SHADOW-PROXY-INFRA
// FINALIDADE: ROTEAMENTO DE APIS E OCULTAÇÃO DE ENDPOINT
export default async function handler(req, res) {
    const { target_url, api_key } = req.query;

    if (!target_url) {
        return res.status(400).json({ error: 'Endpoint Alvo Ausente' });
    }

    try {
        const response = await fetch(target_url, {
            method: req.method,
            headers: {
                'Authorization': `Bearer ${api_key || ''}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Aion/1.0'
            },
            body: req.method !== 'GET' ? JSON.stringify(req.body) : null
        });

        const data = await response.json();
        
        // Parâmetros de Invisibilidade e Acesso
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('X-Aion-Status', 'Routed');
        
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ 
            error: 'Falha no Túnel Proxy', 
            status: 'Offline' 
        });
    }
}
