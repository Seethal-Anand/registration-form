async function checkDatabaseAndSave(userData) {
   const statusDiv = document.getElementById('dbStatus'); // Target the div
    
    // Clear previous status and show "Processing"
    statusDiv.innerHTML = "Checking database...";
    statusDiv.style.color = "blue"; 
    try {
        const response = await fetch('http://127.0.0.1:5000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            statusDiv.style.color = "green";
            statusDiv.innerHTML = "✅ " + result.message;
            return true;
        } else {
            // Displays "Duplicate Mobile/Email" from Python
           statusDiv.style.color = "red";
            statusDiv.innerHTML = "❌ " + result.message;
            return false;
        }
    } catch (error) {
       statusDiv.style.color = "orange";
        statusDiv.innerHTML = "⚠️ Error: Could not connect to the backend.";
        return false;
    }
}
async function validateForm() {

    // ALWAYS reset valid
    let valid = true;

    // Clear previous error messages FIRST
    document.querySelectorAll("span").forEach(e => e.innerHTML = "");

    // Clear the database status message at the start of a new validation
    document.getElementById('dbStatus').innerHTML = "";
    
    // Regex patterns
    const nameRegex = /^([A-Z][a-z]*)(\s[A-Z][a-z]*)+$/;
    const ageRegex = /^(1[89]|[2-9][0-9]|100)$/;
    const addressRegex = /^[A-Za-z0-9\s]+$/;
    const heightRegex = /^(5[0-9]\.[0-9]|[6-9][0-9]\.[0-9]|1[0-9]{2}\.[0-9]|2[0-4][0-9]\.[0-9]|250\.0)$/;
    const weightRegex = /^(?:[3-9]\d?|[1-2]\d{2}|300)(?:\.\d{1,2})$/;
    const mobileRegex = /^[6-9][0-9]{9}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    
    // Get values
    let name = document.getElementById("name").value.trim();
    let age = document.getElementById("age").value.trim();
    let address = document.getElementById("address").value.trim();
    let height = document.getElementById("height").value.trim();
    let weight = document.getElementById("weight").value.trim();
    let mobile = document.getElementById("mobile").value.trim();
    let email = document.getElementById("email").value.trim();

    // Name
    if (!nameRegex.test(name)) {
        document.getElementById("nameErr").innerHTML =
            "Enter valid full name (Capitalized, min 2 words)";
        valid = false;
    }

    // Age
    if (!ageRegex.test(age)) {
        document.getElementById("ageErr").innerHTML =
            "Age must be between 18 and 100";
        valid = false;
    }

    // Address
    if (!addressRegex.test(address) && (address.length < 10 || address.length > 100) ) {
        document.getElementById("addressErr").innerHTML =
            "Minimum 10 characters, no symbols";
        valid = false;
    }

    // Height
    if (!heightRegex.test(height)) {
        document.getElementById("heightErr").innerHTML =
            "Height must be 50.0 &#45 250.0 cm";
        valid = false;
    }

    // Weight
    if (!weightRegex.test(weight)) {
        document.getElementById("weightErr").innerHTML =
            "Weight must be 3.0 &#45 300.00 kg";
        valid = false;
    }

    // Mobile
    if (!mobileRegex.test(mobile)) {
        document.getElementById("mobileErr").innerHTML =
            "Enter valid 10-digit Indian mobile number";
        valid = false;
    }

    // Email
    if (!emailRegex.test(email)) {
        document.getElementById("emailErr").innerHTML =
            "Enter valid email address";
        valid = false;
    }

    const data = {
        name: name,
        age: age,
        address: address,
        height: height,
        weight: weight,
        mobile: mobile,
        email: email
    };
    
    // --- FINAL STEP: Database Interaction ---
    if (valid) {
        // We only call this if all local Regex checks are green
        const dbStored = await checkDatabaseAndSave(data);
        return dbStored; 
    }
    return valid; // VERY IMPORTANT
}
