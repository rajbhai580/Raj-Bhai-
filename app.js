// আপনার Google Firebase Console থেকে Config কপি করে এখানে বসান
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, orderBy, query, limit } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ডেমো ডেটা (যদি ফায়ারবেস কানেক্ট না থাকে, তবে এটি দিয়ে টেস্ট করতে পারেন)
let recentResults = ["Red", "Red", "Red", "Green", "Red"];

async function fetchRealTimeData() {
    try {
        // ফায়ারবেস থেকে রিয়েল-টাইম ডেটা আনার কোড
        const q = query(collection(db, "history"), orderBy("time", "desc"), limit(5));
        const querySnapshot = await getDocs(q);
        recentResults =[];
        querySnapshot.forEach((doc) => {
            recentResults.push(doc.data().color);
        });
        updateUI();
        analyzeData();
    } catch (error) {
        console.log("Firebase connect হয়নি, ডেমো ডেটা ব্যবহার করা হচ্ছে।");
        updateUI();
    }
}

function updateUI() {
    const list = document.getElementById("history-list");
    list.innerHTML = "";
    recentResults.forEach(color => {
        let li = document.createElement("li");
        li.textContent = color;
        li.className = color.toLowerCase();
        list.appendChild(li);
    });
}

// প্রেডিকশন ফর্মুলা (Algorithm)
window.analyzeData = function() {
    const resultText = document.getElementById("prediction-result");
    
    // সিম্পল লজিক: শেষ ৩টি ট্রেড চেক করা
    let lastThree = recentResults.slice(0, 3);
    
    if (lastThree[0] === lastThree[1] && lastThree[1] === lastThree[2]) {
        // যদি টানা ৩ বার একই কালার আসে, তবে পরেরটি অন্য কালার হওয়ার চান্স বেশি
        let prediction = lastThree[0] === "Red" ? "Green 🟢" : "Red 🔴";
        resultText.innerHTML = `সম্ভাবনা বেশি: <span style="color:${prediction.includes('Green') ? 'green' : 'red'}">${prediction}</span>`;
    } else {
        // প্যাটার্ন না পেলে সবথেকে কম আসা কালারটি প্রেডিক্ট করা
        let redCount = recentResults.filter(c => c === "Red").length;
        let greenCount = recentResults.filter(c => c === "Green").length;
        
        let prediction = redCount > greenCount ? "Green 🟢" : "Red 🔴";
        resultText.innerHTML = `প্যাটার্ন অনুযায়ী: <span style="color:${prediction.includes('Green') ? 'green' : 'red'}">${prediction}</span>`;
    }
}

// পেজ লোড হলে ডেটা ফেচ করবে
window.onload = fetchRealTimeData;
