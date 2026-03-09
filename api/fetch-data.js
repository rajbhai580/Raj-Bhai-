export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const currentTimestamp = Date.now();
        const apiUrl = `https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?ts=${currentTimestamp}`;

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "Referer": "https://www.barakunda.com/", // Very Important Bypass
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            }
        });

        // ডেটা JSON হিসেবে পড়ার আগে Text হিসেবে পড়ছি, যাতে ক্র্যাশ না করে
        const textData = await response.text();

        // যদি টার্গেট সার্ভার ব্লক করে (যেমন 403 Forbidden)
        if (!response.ok) {
            return res.status(500).json({ 
                success: false, 
                error: `Target server rejected the request with status: ${response.status}`, 
                details: textData.substring(0, 200) // কী এরর দিয়েছে তার প্রথম ২০০ অক্ষর
            });
        }

        // টেক্সটকে JSON এ রূপান্তর করার চেষ্টা
        try {
            const jsonData = JSON.parse(textData);
            res.status(200).json({
                success: true,
                data: jsonData
            });
        } catch (parseError) {
            // যদি সাইটটি JSON না দিয়ে HTML ক্যাপচা পেজ দেয়
            return res.status(500).json({ 
                success: false, 
                error: "Target server did not return valid JSON. Might be blocking Vercel IP.", 
                details: textData.substring(0, 200)
            });
        }

    } catch (error) {
        console.error("[ SERVER ERROR ]", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
}
