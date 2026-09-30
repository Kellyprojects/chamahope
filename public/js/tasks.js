document.addEventListener("DOMContentLoaded", () => {
    const dashboardSection = document.getElementById("dashboard-section");
    
    if (dashboardSection) {
        const taskContainer = document.createElement("div");
        taskContainer.className = "tier-section";
        taskContainer.style.marginTop = "30px";
        taskContainer.innerHTML = `
            <h2>Mandatory Community Engagement Tasks</h2>
            <div class="wallet-card" style="background-color: #1e293b; border: 1px solid #334155;">
                <h3>Active Tier Task Requirement</h3>
                <p style="font-size: 1rem; color: #f8fafc; margin-bottom: 10px;" id="task-description">
                    Loading daily community growth and social verification task...
                </p>
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <input type="text" id="task-proof-input" placeholder="Paste Proof Link (e.g., WhatsApp/Twitter post URL)" style="flex: 1; padding: 10px; background-color: #0f172a; border: 1px solid #334155; border-radius: 6px; color: #f8fafc;">
                    <button class="wallet-btn" id="submit-task-btn" style="padding: 10px 20px;">Submit Proof</button>
                </div>
                <small style="color: #10b981;" id="task-status-text">Status: Complete today's task to unlock queue matching priority.</small>
            </div>
        `;
        
        const tierSection = document.querySelector(".tier-section");
        dashboardSection.insertBefore(taskContainer, tierSection);

        const submitTaskBtn = document.getElementById("submit-task-btn");
        const taskProofInput = document.getElementById("task-proof-input");
        const taskStatusText = document.getElementById("task-status-text");

        document.getElementById("task-descriptionлиги").innerText = "Task: Share the official Chama community safety announcement to your WhatsApp status or social media feed, and paste the direct link below for verification.";

        submitTaskBtn.addEventListener("click", async () => {
            const proofValue = taskProofInput.value.trim();
            if (proofValue.length < 5) {
                alert("Please enter a valid proof link or screenshot reference before submitting.");
                return;
            }

            const userSession = JSON.parse(localStorage.getItem("chama_user"));
            if (!userSession || !userSession.userId) {
                alert("Session user not found. Please register first.");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/api/tasks/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: userSession.userId,
                        tierLevel: 1,
                        taskType: "social_share",
                        proofData: proofValue
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.error || "Failed to submit task.");
                    return;
                }

                localStorage.setItem("chama_task_completed", "true");
                taskStatusText.innerHTML = "Status: <strong style='color: #10b981;'>Verified & Approved! Queue priority unlocked.</strong>";
                taskProofInput.disabled = true;
                submitTaskBtn.disabled = true;
                submitTaskBtn.style.backgroundColor = "#334155";
            } catch (err) {
                console.error("Task submission error:", err);
                alert("Error connecting to server for task submission.");
            }
        });
    }
});