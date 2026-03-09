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

// ১. সিস্টেম স্ট্যাটাস চেক করা (Admin panel থেকে ON/OFF)
onSnapshot(doc(db, "settings", "system_status"), (docSnap) => {
    if (docSnap.exists()) {
        systemActive = docSnap.data().active;
        const statusText = document.getElementById("system-status");
        const btn = document.getElementById("analyze-btn");
        const resultBox = document.getElementById("prediction-result");

        if (systemActive) {
            statusText.innerText = "STATUS: SYSTEM ONLINE // AI READY";
            statusText.className = "online";
            btn.disabled = false;
            resultBox.innerText = "WAITING FOR INITIALIZATION...";
        } else {
            statusText.innerText = "STATUS: SYSTEM OFFLINE (COLLECTING DATA...)";
            statusText.className = "offline";
            btn.disabled = true;
            resultBox.innerText = "SYSTEM IS INACTIVE";
        }
    }
});

// ২. রিয়েলটাইমে লাস্ট ৩০টি ডেটা লোড করা
const q = query(collection(db, "history"), orderBy("timestamp", "desc"), limit(30));
onSnapshot(q, (snapshot) => {
    recentData =[];
    const tbody = document.getElementById('history-list');
    tbody.innerHTML = "";

    snapshot.forEach((doc) => {
        let item = doc.data();
        recentData.push(item);
        
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.period}</td>
            <td class="${item.color.toLowerCase()}">[ ${item.color.toUpperCase()} ]</td>
            <td>${item.number}</td>
        `;
        tbody.appendChild(tr);
    });

    if (recentData.length > 0) {
        let lastPeriod = parseInt(recentData[0].period);
        document.getElementById('next-period').innerText = (lastPeriod + 1).toString().padStart(3, '0');
    }
});

// ৩. প্রেডিকশন লজিক (৩০টি ডেটা ব্যবহার করে)
window.executeAnalysis = function() {
    if(!systemActive || recentData.length < 5) return;
    
    const resultBox = document.getElementById('prediction-result');
    resultBox.innerText = "ANALYZING 30-MIN TREND...";
    resultBox.style.color = "#ffcc00";

    setTimeout(() => {
        let lastThree = [recentData[0].color, recentData[1].color, recentData[2].color];
        let lastFive = recentData.slice(0, 5).map(d => d.color);
        let allSame = lastFive.every(val => val === lastFive[0]);

        let redCount = recentData.filter(d => d.color === "Red").length;
        let greenCount = recentData.filter(d => d.color === "Green").length;

        let prediction = "";
        if (allSame) prediction = lastFive[0] === "Red" ? "GREEN" : "RED"; // Dragon reverse
        else if (lastThree[0] !== lastThree[1] && lastThree[1] !== lastThree[2]) prediction = lastThree[0] === "Red" ? "GREEN" : "RED"; // Alternating
        else prediction = redCount > greenCount ? "GREEN" : "RED"; // Probability normalizing

        let colorCode = prediction === "GREEN" ? "#33ff33" : "#ff3333";
        resultBox.innerHTML = `> TARGET: <span style="color:${colorCode}; font-weight:bold;">${prediction}</span> <`;
        resultBox.style.color = "#fff";
    }, 2000);
}
