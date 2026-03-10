import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot, collection } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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
const statusDocRef = doc(db, "settings", "system_status");

// ১. স্ট্যাটাস মনিটর (Admin Panel-এ লেখা চেঞ্জ করার জন্য)
onSnapshot(statusDocRef, (docSnap) => {
    if (docSnap.exists()) {
        let active = docSnap.data().active;
        const statusText = document.getElementById("admin-status");
        statusText.innerText = active ? "ONLINE (ACTIVE)" : "OFFLINE (INACTIVE)";
        statusText.className = active ? "online" : "offline";
    } else {
        document.getElementById("admin-status").innerText = "OFFLINE (INACTIVE)";
        document.getElementById("admin-status").className = "offline";
    }
});

// ২. মোট কয়টি ডেটা জমা হলো তা দেখা
onSnapshot(collection(db, "history"), (snapshot) => {
    document.getElementById("data-count").innerText = snapshot.size;
});

// ৩. বাটন ক্লিক ফাংশন (System ON/OFF)
window.toggleSystem = async function(status) {
    try {
        let activationData = { 
            active: status,
            activated_at: status ? Date.now() : 0 
        };
        // Firebase-এ ডেটা আপডেট করা
        await setDoc(statusDocRef, activationData, { merge: true });
        
        // সাকসেস মেসেজ
        alert(status ? "🔥 SYSTEM ACTIVATED! Data fetching started." : "🛑 SYSTEM DEACTIVATED!");
    } catch (error) {
        console.error("Error updating system status: ", error);
        alert("Error! Check console.");
    }
};
