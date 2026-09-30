document.addEventListener("DOMContentLoaded", () => {
    const tierGrid = document.getElementById("tier-grid");

    const tiers = [
        { level: 1, name: "Starter", pledge: 10, returnAmt: 20, schedule: "W2: $10 | W3: $5 | W4: $5" },
        { level: 2, name: "Bronze", pledge: 20, returnAmt: 40, schedule: "W2: $20 | W3: $10 | W4: $10" },
        { level: 3, name: "Silver", pledge: 50, returnAmt: 100, schedule: "W2: $50 | W3: $25 | W4: $25" },
        { level: 4, name: "Gold", pledge: 100, returnAmt: 200, schedule: "W2: $100 | W3: $50 | W4: $50", req: "1 Active Referral" },
        { level: 5, name: "Platinum", pledge: 200, returnAmt: 400, schedule: "W2: $200 | W3: $100 | W4: $100", req: "2 Active Referrals" },
        { level: 6, name: "Ruby", pledge: 300, returnAmt: 600, schedule: "W2: $300 | W3: $150 | W4: $150" },
        { level: 7, name: "Emerald", pledge: 500, returnAmt: 1000, schedule: "W2: $500 | W3: $250 | W4: $250", req: "3 Active Referrals" },
        { level: 8, name: "Diamond", pledge: 800, returnAmt: 1600, schedule: "W2: $800 | W3: $400 | W4: $400" },
        { level: 9, name: "Crown", pledge: 1000, returnAmt: 2000, schedule: "W2: $1000 | W3: $500 | W4: $500", req: "4 Active Referrals" },
        { level: 10, name: "Patron VIP", pledge: 2000, returnAmt: 4000, schedule: "W2: $2000 | W3: $1000 | W4: $1000", req: "5 Active Referrals" }
    ];

    if (tierGrid) {
        tierGrid.innerHTML = "";

        tiers.forEach(tier => {
            const tierCard = document.createElement("div");
            tierCard.className = "wallet-card";
            tierCard.innerHTML = `
                <h3>Level ${tier.level}: ${tier.name}</h3>
                <p>$${tier.pledge} Pledge</p>
                <p style="font-size: 1rem; color: #f8fafc; margin-bottom: 10px;">Return: <strong>$${tier.returnAmt}</strong></p>
                <small style="color: #94a3b8; display: block; margin-bottom: 15px;">Schedule: ${tier.schedule}</small>
                ${tier.req ? `<small style="color: #f59e0b; display: block; margin-bottom: 15px;">Req: ${tier.req}</small>` : ''}
                <button class="wallet-btn" onclick="selectTier(${tier.level}, ${tier.pledge})">Select Tier</button>
            `;
            tierGrid.appendChild(tierCard);
        });
    }
});

// Gated Tier Selection
window.selectTier = async function(level, pledgeAmount) {
    const userSession = JSON.parse(localStorage.getItem("chama_user"));
    
    // If not registered/logged in, prompt them to sign up first!
    if (!userSession || !userSession.userId) {
        alert("🔒 Registration Required: Please review the terms and complete your free registration below before selecting a contribution tier.");
        document.getElementById("auth-section").scrollIntoView({ behavior: 'smooth' });
        return;
    }

    const paymentMethod = prompt("Choose payment method (Enter 'USDT' or 'BTC'):", "USDT");
    if (!paymentMethod || (paymentMethod.toUpperCase() !== "USDT" && paymentMethod.toUpperCase() !== "BTC")) {
        alert("Invalid payment method selected. Operation cancelled.");
        return;
    }

    const txHash = prompt(`Please transfer $${pledgeAmount} equivalent in ${paymentMethod.toUpperCase()} and paste your Transaction Hash (TxID) here:`);
    if (!txHash || txHash.trim().length < 5) {
        alert("A valid Transaction Hash (TxID) is required to submit your pledge.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/payments/pledge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: userSession.userId,
                tierLevel: level,
                pledgeAmount,
                returnAmount: pledgeAmount * 2,
                paymentMethod: paymentMethod.toUpperCase(),
                txHash: txHash.trim()
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Failed to process pledge.");
            return;
        }

        alert(`Success! Level ${level} pledge submitted. Status: ${data.pledge.status}`);
    } catch (err) {
        console.error("Error submitting pledge:", err);
        alert("Server connection error while submitting your payment proof.");
    }
};