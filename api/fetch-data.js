export default async function handler(req, res) {
    // অন্য ওয়েবসাইট থেকে ডেটা আনার জন্য ব্রাউজারের সিকিউরিটি বাইপাস (CORS Allow)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // ১. বর্তমান সময়ের টাইমস্ট্যাম্প (যাতে সবসময় নতুন ডেটা আসে)
        const currentTimestamp = Date.now();
        const apiUrl = `https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?ts=${currentTimestamp}`;

        // ২. আসল সাইটে রিকোয়েস্ট পাঠানো
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "Referer": "https://www.barakunda.com/", // এটি না দিলে ওরা ডেটা দেবে না
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });

        if (!response.ok) {
            throw new Error(`Target Server Error: ${response.status}`);
        }

        // ৩. ডেটা রিসিভ করা
        const rawData = await response.json();

        // ৪. আপনার ওয়েবসাইটে ডেটা পাঠানো
        res.status(200).json({
            success: true,
            data: rawData
        });

    } catch (error) {
        console.error("[ SYSTEM ERROR ]", error);
        res.status(500).json({ success: false, error: error.message });
    }
}
