document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("admin-login-form");
    const loginCard = document.getElementById("admin-login-card");
    const dashboardCard = document.getElementById("admin-dashboard-card");

    const savedPasscode = sessionStorage.getItem("chama_admin_token");
    if (savedPasscode) {
        loginCard.style.display = "none";
        dashboardCard.style.display = "block";
        fetchAdminData();
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const inputVal = document.getElementById("admin-passcode-input").value.trim();
            
            if (inputVal === "ChamaSecureAdmin2026!") {
                sessionStorage.setItem("chama_admin_token", inputVal);
                loginCard.style.display = "none";
                dashboardCard.style.display = "block";
                fetchAdminData();
            } else {
                alert("Incorrect Admin Passcode! Access Denied.");
            }
        });
    }
});

function getAdminHeaders() {
    return {
        "Content-Type": "application/json",
        "x-admin-passcode": sessionStorage.getItem("chama_admin_token") || ""
    };
}

async function fetchAdminData() {
    try {
        const res = await fetch("http://localhost:5000/api/admin/users", {
            headers: getAdminHeaders()
        });

        if (res.status === 401) {
            alert("Session expired or unauthorized.");
            adminLogout();
            return;
        }

        const data = await res.json();
        const users = data.users || [];

        // Update Overview Stats
        document.getElementById("stat-total-users").innerText = users.length;
        const supervisors = users.filter(u => u.isSupervisor);
        document.getElementById("stat-total-supervisors").innerText = supervisors.length;

        // Populate User Directory Table
        const tbody = document.getElementById("admin-users-table-body");
        tbody.innerHTML = "";

        users.forEach(user => {
            const tr = document.createElement("tr");
            tr.style.borderBottom = "1px solid #334155";
            tr.innerHTML = `
                <td style="padding: 12px; font-weight: 600;">${user.fullname}</td>
                <td style="padding: 12px; color: #94a3b8;">${user.phone}</td>
                <td style="padding: 12px;">
                    <select id="tier-${user._id}" style="background: #0f172a; color: #fff; padding: 6px; border-radius: 6px; border: 1px solid #334155;">
                        ${[...Array(10)].map((_, i) => `<option value="${i+1}" ${user.tierLevel === i+1 ? 'selected' : ''}>Level${i+1}</option>`).join('')}
                    </select>
                </td>
                <td style="padding: 12px; color: #38bdf8;">${user.activeDownlinesCount || 0} Downlines</td>
                <td style="padding: 12px;">${user.isSupervisor ? '<strong style="color: #10b981;">VIP Supervisor</strong>' : '<span style="color: #94a3b8;">Standard Member</span>'}</td>
                <td style="padding: 12px; display: flex; gap: 8px;">
                    <button class="wallet-btn" style="padding: 6px 12px; font-size: 0.8rem;" onclick="updateUserTier('${user._id}')">Save Tier</button>
                    <button class="wallet-btn" style="padding: 6px 12px; font-size: 0.8rem; background: ${user.isSupervisor ? '#ef4444' : '#3b82f6'};" onclick="toggleSupervisor('${user._id}', ${!user.isSupervisor})">
                        ${user.isSupervisor ? 'Revoke' : 'Promote'}
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Append to System Logs Stream
        const logBox = document.getElementById("system-logs-container");
        logBox.innerHTML += `<br>[${new Date().toLocaleTimeString()}] Fetched ${users.length} user records successfully from database.`;
        logBox.scrollTop = logBox.scrollHeight;

    } catch (err) {
        console.error("Admin data sync error:", err);
    }
}

async function updateUserTier(userId) {
    const tierLevel = parseInt(document.getElementById(`tier-${userId}`).value);
    try {
        const res = await fetch(`http://localhost:5000/api/admin/user/${userId}/tier`, {
            method: "PATCH",
            headers: getAdminHeaders(),
            body: JSON.stringify({ tierLevel })
        });
        if (res.ok) alert("User tier override saved successfully!");
    } catch (err) {
        alert("Failed to update user tier.");
    }
}

async function toggleSupervisor(userId, newState) {
    try {
        const res = await fetch(`http://localhost:5000/api/admin/user/${userId}/supervisor`, {
            method: "PATCH",
            headers: getAdminHeaders(),
            body: JSON.stringify({ isSupervisor: newState })
        });
        if (res.ok) {
            alert("Supervisor status updated!");
            fetchAdminData();
        }
    } catch (err) {
        alert("Failed to update supervisor status.");
    }
}

function adminLogout() {
    sessionStorage.removeItem("chama_admin_token");
    window.location.reload();
}