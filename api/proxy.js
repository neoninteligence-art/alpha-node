export default function handler(req, res) {
    const { target_url } = req.query;

    if (!target_url) {
        return res.status(400).json({ error: "No target URL provided" });
    }

    // Redirecionamento 302 (Temporário) - Seguro para redes de CPA
    res.writeHead(302, { Location: target_url });
    res.end();
}
