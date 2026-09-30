document.addEventListener("DOMContentLoaded", async () => {
    const session = JSON.parse(localStorage.getItem("chama_user"));
    if (!session || !session.phone) {
        alert("Please log in first.");
        window.location.href = "index.html";
        return;
    }

    document.getElementById("sup-user-info").innerText = `Logged in as: ${session.fullname} (${session.phone})`;

    try {
        // Fetch user profile and downlines
        const resUser = await fetch(`http://localhost:5000/api/users/${session.phone}`);
        const userData = await resUser.json();
        
        if (userData.user) {
            document.getElementById("sup-bonus-display").innerText = `$${userData.user.supervisorBalance || 0}.00`;
            if (!userData.user.isSupervisor && userData.user.activeDownlinesCount < 5) {
                alert("Access restricted: You must have at least 5 active downlines or admin approval to view the supervisor portal.");
            }
        }

        const resDownlines = await fetch(`http://localhost:5000/api/admin/downlines/${session.phone}`);
        const downData = await resDownlines.json();
        const container = document.getElementById("downlines-list");

        if (downData.downlines && downData.downlines.length > 0) {
            container.innerHTML = downData.downlines.map(d => `
                <div style="background: #0f172a; border: 1px solid #334155; padding: 12px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between;">
                    <span><strong>${d.fullname}</strong> (${d.phone})</span>
                    <span style="color: #3b82f6;">Level ${d.tierLevel}</span>
                </div>
            `).join('');
        } else {
            container.innerHTML = "<p style='color: #94a3b8;'>No active downlines found in your network yet.</p>";
        }
    } catch (err) {
        console.error("Error loading supervisor portal:", err);
    }
});