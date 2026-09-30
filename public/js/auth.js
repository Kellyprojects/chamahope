// Smart Login / Registration Handler
async function handleUserLogin(phone, passcode, supervisorCode = null) {
    try {
        // If logging in via approved Supervisor Code
        if (supervisorCode) {
            const res = await fetch(`http://localhost:5000/api/auth/supervisor-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ supervisorCode })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("chama_user", JSON.stringify(data.user));
                window.location.href = "supervisor.html";
                return;
            } else {
                alert(data.error || "Invalid Supervisor Code.");
                return;
            }
        }

        // Standard Member Login via Phone & Code
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, passcode })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Login failed. Check your phone number and code.");
            return;
        }

        // System automatically recognizes user tier level and status
        localStorage.setItem("chama_user", JSON.stringify({
            userId: data.user._id,
            fullname: data.user.fullname,
            phone: data.user.phone,
            tierLevel: data.user.tierLevel,
            isSupervisor: data.user.isSupervisor
        }));

        // Route accordingly
        if (data.user.isSupervisor) {
            window.location.href = "supervisor.html";
        } else {
            window.location.href = "dashboard.html";
        }

    } catch (err) {
        console.error("Login error:", err);
        alert("Could not connect to the backend server.");
    }
}