import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, updateDoc, onSnapshot, collection } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

// স্ট্যাটাস মনিটর
onSnapshot(statusDocRef, (docSnap) => {
    if (docSnap.exists()) {
        let active = docSnap.data().active;
        const statusText = document.getElementById("admin-status");
        statusText.innerText = active ? "ONLINE (ACTIVE)" : "OFFLINE (INACTIVE)";
        statusText.className = active ? "online" : "offline";
    }
});

// মোট কয়টি ডেটা জমা হলো তা দেখা
onSnapshot(collection(db, "history"), (snapshot) => {
    document.getElementById("data-count").innerText = snapshot.size;
});

// বাটন ক্লিক ফাংশন
window.toggleSystem = async function(status) {
    await updateDoc(statusDocRef, { active: status });
    alert(status ? "SYSTEM ACTIVATED!" : "SYSTEM DEACTIVATED!");
}
