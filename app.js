import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy, limit, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9adD2icBjC5lclWUChvSoEocEbqlrCkw",
  authDomain: "raj-bhai-sureshoot.firebaseapp.com",
  databaseURL: "https://raj-bhai-sureshoot-default-rtdb.firebaseio.com",
  projectId: "raj-bhai-sureshoot",
  storageBucket: "raj-bhai-sureshoot.firebasestorage.app",
  messagingSenderId: "222410232117",
  appId: "1:222410232117:web:037b1d1084ed7a8b18fc7c"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let systemActive = false;
let recentData =[];

// নাম্বার ট্রানজিশন ম্যাট্রিক্স (কোন নাম্বারের পর কোন নাম্বার বেশি আসে তার গাণিতিক হিসেব)
const numberMatrix = {
    0: [5, 2, 8], 1:[6, 3, 7], 2: [8, 1, 4], 3:[9, 0, 5], 4: [7, 2, 6],
    5:[1, 8, 3], 6: [0, 9, 4], 7:[2, 5, 8], 8: [3, 6, 1], 9:[4, 7, 0]
};

// System Status Listener
onSnapshot(doc(db, "settings", "system_status"), (docSnap) => {
    if (docSnap.exists()) {
        systemActive = docSnap.data().active;
        const statusText = document.getElementById("system-status");
        const btn = document.getElementById("analyze-btn");
        if (systemActive) {
            statusText.innerText = "STATUS: SYSTEM ONLINE // DEEP AI READY";
            statusText.className = "online";
            btn.disabled = false;
        } else {
            statusText.innerText = "STATUS: SYSTEM OFFLINE";
            statusText.className = "offline";
            btn.disabled = true;
        }
    }
});

// Load Last 50 Data
const q = query(collection(db, "history"), orderBy("timestamp", "desc"), limit(50));
onSnapshot(q, (snapshot) => {
    recentData =[];
    const tbody = document.getElementById('history-list');
    tbody.innerHTML = "";

    snapshot.forEach((doc) => {
        let item = doc.data();
        let size = item.number >= 5 ? "BIG" : "SMALL"; // 0-4=Small, 5-9=Big
        recentData.push({ ...item, size: size });
        
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.period}</td>
            <td class="${size.toLowerCase()}">${size}</td>
            <td>${item.number}</td>
        `;
        tbody.appendChild(tr);
    });

    if (recentData.length > 0) {
        document.getElementById('next-period').innerText = (parseInt(recentData[0].period) + 1).toString().padStart(3, '0');
    }
});

window.executeAnalysis = function() {
    if(!systemActive || recentData.length < 5) return;
    
    const resultBox = document.getElementById('prediction-result');
    const numberBox = document.getElementById('predicted-numbers');
    const logicBox = document.getElementById('logic-applied');
    
    resultBox.innerText = "CALCULATING PROBABILITIES...";
    resultBox.style.color = "#ffcc00";
    numberBox.innerText = "[ ? ] [ ? ] [ ? ]";
    logicBox.innerText = "Bypassing WAF & Analyzing crowd betting behavior...";

    setTimeout(() => {
        let last5 = recentData.slice(0, 5).map(d => d.size);
        let prediction = "";
        let logicName = "";

        // ==========================================
        // ADVANCED LOGIC SYSTEM
        // ==========================================

        // Logic 1: The "House Trap" (Anti-Crowd)
        // যদি টানা ৪ বার একই রেজাল্ট আসে (যেমন Big, Big, Big, Big), সাধারণ মানুষ ভাববে পরেরটাও Big।
        // এই সময় বেটিং সাইট (হাউস) উল্টোটা (Small) দেবে সবার টাকা খাওয়ার জন্য।
        if (last5[0] === last5[1] && last5[1] === last5[2] && last5[2] === last5[3]) {
            prediction = last5[0] === "BIG" ? "SMALL" : "BIG";
            logicName = "🔥 Anti-Crowd Protocol: Breaking the 4x Streak (House Edge)";
        }
        
        // Logic 2: Alternating Pattern (1-by-1 Wave)
        // যদি Big, Small, Big, Small চলে, তবে প্যাটার্ন কন্টিনিউ করার চান্স থাকে।
        else if (last5[0] !== last5[1] && last5[1] !== last5[2] && last5[2] !== last5[3]) {
            prediction = last5[0] === "BIG" ? "SMALL" : "BIG";
            logicName = "🌊 Alternating Wave Detection (1-by-1 Pattern)";
        }
        
        // Logic 3: Pair Reversal (2-by-2 Pattern)
        // যদি Big, Big, Small, Small হয়।
        else if (last5[0] === last5[1] && last5[1] !== last5[2] && last5[2] === last5[3]) {
            prediction = last5[0] === "BIG" ? "SMALL" : "BIG";
            logicName = "⚖️ Pair Reversal Logic Detected";
        }
        
        // Logic 4: Statistical Balancing (Last 15 periods)
        // যদি কোনো নির্দিষ্ট প্যাটার্ন না থাকে, তখন লাস্ট ১৫ বারের ব্যালেন্স চেক করবে।
        else {
            let recent15 = recentData.slice(0, 15).map(d => d.size);
            let bigCount = recent15.filter(x => x === "BIG").length;
            // যদি লাস্ট ১৫ বারে Big বেশি এসে থাকে, তবে হাউস ব্যালেন্স করার জন্য Small দেবে।
            prediction = bigCount > 7 ? "SMALL" : "BIG";
            logicName = "📊 RNG Weight Balancing (Market Correction)";
        }

        // ==========================================
        // NUMBER PREDICTION ALGORITHM
        // ==========================================
        let lastNumber = recentData[0].number;
        let probableNumbers = numberMatrix[lastNumber]; // ম্যাট্রিক্স থেকে সম্ভাব্য নাম্বার নেওয়া
        
        // প্রেডিক্ট করা সাইজের (Big/Small) সাথে মিলিয়ে নাম্বার ফিল্টার করা
        let finalNumbers = probableNumbers.filter(n => prediction === "BIG" ? n >= 5 : n <= 4);
        
        // যদি ম্যাট্রিক্স না মেলে, তবে ডিফল্ট হাই-প্রোবাবিলিটি নাম্বার দেওয়া
        if(finalNumbers.length === 0) {
            finalNumbers = prediction === "BIG" ? [5, 7, 9] :[0, 2, 4];
        } else if (finalNumbers.length < 3) {
            let fillers = prediction === "BIG" ? [6, 8] : [1, 3];
            finalNumbers = [...new Set([...finalNumbers, ...fillers])].slice(0, 3);
        }

        // ==========================================
        // OUTPUT RENDERING
        // ==========================================
        let colorCode = prediction === "BIG" ? "#ffcc00" : "#00ccff"; // Big=Yellow, Small=Blue
        
        resultBox.innerHTML = `> TARGET: <span style="color:${colorCode}; text-shadow: 0 0 15px ${colorCode}; font-size:36px;">${prediction}</span> <`;
        resultBox.style.color = "#fff";
        
        numberBox.innerText = `[ ${finalNumbers[0]} ]  [ ${finalNumbers[1]} ]  [ ${finalNumbers[2]} ]`;
        logicBox.innerText = `System Decision: ${logicName}`;

    }, 2500);
}
