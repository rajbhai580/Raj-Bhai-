let mockData =[
    { period: "WAITING...", color: "Red", number: 0 },
    { period: "WAITING...", color: "Green", number: 0 },
    { period: "WAITING...", color: "Red", number: 0 }
];

let currentServer = '1min';

// টার্গেট সাইট থেকে আসল ডেটা আনার ফাংশন
async function fetchRealData() {
    const resultBox = document.getElementById('prediction-result');
    resultBox.innerText = "CONNECTING TO TARGET SERVER...";
    resultBox.style.color = "#ffcc00";

    try {
        // আমাদের তৈরি করা Vercel API কে কল করা হচ্ছে
        const response = await fetch('/api/fetch-data');
        const result = await response.json();

        if (result.success) {
            console.log("🔥 REAL DATA FROM TARGET SITE:", result.data);
            resultBox.innerText = "DATA FETCHED SUCCESSFULLY! CHECK CONSOLE.";
            resultBox.style.color = "#33ff33";
            
            // [গুরুত্বপূর্ণ] ব্রাউজারের কনসোল চেক করে ডেটার স্ট্রাকচার আমাকে দিতে হবে
        } else {
            resultBox.innerText = "FAILED TO FETCH DATA!";
            resultBox.style.color = "#ff3333";
        }
    } catch (error) {
        console.error("Error Fetching Data:", error);
        resultBox.innerText = "CONNECTION LOST!";
        resultBox.style.color = "#ff3333";
    }
}

window.switchServer = function(server) {
    currentServer = server;
    document.querySelectorAll('.server-tabs button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    document.getElementById('prediction-result').innerText = "WAITING FOR DATA...";
    document.getElementById('prediction-result').style.color = "#00ff00";
    
    loadData();
}

function loadData() {
    const tbody = document.getElementById('history-list');
    tbody.innerHTML = "";

    mockData.forEach((item, index) => {
        let shortPeriod = String(item.period).slice(-3);
        
        if(index === 0 && item.period !== "WAITING...") {
            let nextPeriodNum = (parseInt(shortPeriod) + 1).toString().padStart(3, '0');
            document.getElementById('next-period').innerText = nextPeriodNum;
        }

        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${shortPeriod}</td>
            <td class="${item.color.toLowerCase()}">[ ${item.color.toUpperCase()} ]</td>
            <td>${item.number}</td>
        `;
        tbody.appendChild(tr);
    });
}

window.executeAnalysis = function() {
    // এই বাটনে ক্লিক করলে আসল ডেটা ফেচ হবে
    fetchRealData();
}

window.onload = loadData;
