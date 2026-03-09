// ডেমো ডেটা (এটি আপনার Firebase বা API থেকে আসবে)
// খেয়াল করুন পিরিয়ড নাম্বার অনেক বড়, কিন্তু আমরা কোডে শুধু শেষের ৩টি নেব
let mockData =[
    { period: "202603091057005", color: "Red", number: 4 },
    { period: "202603091057004", color: "Green", number: 7 },
    { period: "202603091057003", color: "Red", number: 2 },
    { period: "202603091057002", color: "Red", number: 4 },
    { period: "202603091057001", color: "Green", number: 3 }
];

let currentServer = '1min';

window.switchServer = function(server) {
    currentServer = server;
    // এখানে Tab change হওয়ার লজিক
    document.querySelectorAll('.server-tabs button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    document.getElementById('prediction-result').innerText = "WAITING FOR DATA...";
    document.getElementById('prediction-result').style.color = "#00ff00";
    
    loadData(); // সার্ভার বদলালে নতুন ডেটা লোড হবে
}

function loadData() {
    const tbody = document.getElementById('history-list');
    tbody.innerHTML = "";

    mockData.forEach((item, index) => {
        // [আসল ট্রিক] পিরিয়ডের শেষের ৩টি সংখ্যা বের করার লজিক
        let shortPeriod = String(item.period).slice(-3);
        
        // পরবর্তী পিরিয়ড নাম্বার সেট করা (সবচেয়ে নতুন ডেটার সাথে 1 যোগ করে)
        if(index === 0) {
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
    const resultBox = document.getElementById('prediction-result');
    resultBox.innerText = "ANALYZING ALGORITHM...";
    resultBox.style.color = "#ffcc00"; // Yellow while analyzing

    // হ্যাকিং এর ফিল দেওয়ার জন্য ২ সেকেন্ড ডিলে (Delay)
    setTimeout(() => {
        // লাস্ট ৩টা কালার বের করা
        let lastThree = [mockData[0].color, mockData[1].color, mockData[2].color];
        
        let prediction = "";
        let colorCode = "";

        // অ্যানালাইসিস লজিক
        if (lastThree[0] === lastThree[1] && lastThree[1] === lastThree[2]) {
            prediction = lastThree[0] === "Red" ? "GREEN" : "RED";
        } else {
            let redCount = lastThree.filter(c => c === "Red").length;
            prediction = redCount >= 2 ? "GREEN" : "RED"; 
        }

        colorCode = prediction === "GREEN" ? "#33ff33" : "#ff3333";
        
        resultBox.innerHTML = `> TARGET: <span style="color:${colorCode}; text-shadow: 0 0 10px ${colorCode}; font-weight:bold;">${prediction}</span> <`;
        resultBox.style.color = "#fff";
    }, 2000);
}

// প্রথমবার পেজ লোড হলে ডেটা দেখাবে
window.onload = loadData;
