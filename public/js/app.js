// Global Application Settings & API Configuration
const API_BASE_URL = "http://localhost:5000/api";

// Utility function to check global session status
function checkUserSession() {
    const userSession = localStorage.getItem("chama_user");
    return userSession ? JSON.parse(userSession) : null;
}

// Global initialization
document.addEventListener("DOMContentLoaded", () => {
    console.log("Chama Platform Client Initialized.");
});