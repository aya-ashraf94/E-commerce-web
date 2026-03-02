const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const username = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("email-address").value.trim();
    const password = document.getElementById("contact-email").value.trim();

    const xhr = new XMLHttpRequest();

    xhr.open("GET", "https://699f62ea3188b0b1d535f9d3.mockapi.io/users");
    xhr.send();

    xhr.onreadystatechange = function () {

        if (xhr.readyState === 4 && xhr.status === 200) {

            const users = JSON.parse(xhr.responseText);

            const exists = users.find(u => u.email === email);

            if (exists) {
                alert("Email already exists");
                return;
            }

            const newUser = {
                uername: username,
                email: email,
                pssword: password,
                role: "user",
                createdAt: new Date().toLocaleDateString()
            };

            const xhrPost = new XMLHttpRequest();

            xhrPost.open("POST", "https://699f62ea3188b0b1d535f9d3.mockapi.io/users");
            xhrPost.setRequestHeader("Content-Type", "application/json");
            xhrPost.send(JSON.stringify(newUser));

            xhrPost.onreadystatechange = function () {

                if (xhrPost.readyState === 4 && xhrPost.status === 201) {

                    const savedUser = JSON.parse(xhrPost.responseText);

                    localStorage.setItem("currentUser", JSON.stringify(savedUser));

                    window.location.href = "index.html";
                }
            };
        }
    };
});

/////////////////////////////////////Validation/////////////////////////////////////
const form = document.getElementById("registerForm");
const usernameInput = document.getElementById("contact-name");
const emailInput = document.getElementById("email-address");
const passwordInput = document.getElementById("contact-email");
const confirmPasswordInput = document.getElementById("confirm-pass");
const usernameMessage = document.getElementById("usernameMessage");
const emailMessage = document.getElementById("emailMessage");
const passwordMessage = document.getElementById("passwordMessage");
const confirmPasswordMessage = document.getElementById("passwordConMessage");


//================= USERNAME VALIDATION =================
usernameInput.addEventListener("input", function () {
    const usernamePattern = /^[A-Za-z][A-Za-z0-9_-]{2,}$/;
    const value = usernameInput.value;
    if (value === "") {
        usernameMessage.textContent = "";
        usernameMessage.className = "";
        return;
    }
    if (!usernamePattern.test(value)) {
        usernameMessage.textContent =
            "Must start with a letter. No spaces. Only letters, numbers, _ and - allowed.";
        usernameMessage.className = "error";
    } else {
        usernameMessage.textContent = "Username is valid";
        usernameMessage.className = "success";
    }
});

//================= EMAIL VALIDATION =================
emailInput.addEventListener("input", function () {
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    const value = emailInput.value;
    if (value === "") {
        emailMessage.textContent = "";
        emailMessage.className = "";
        return;
    }
    if (!emailPattern.test(value)) {
        emailMessage.textContent = "Enter a valid email address.";
        emailMessage.className = "error";
    } else {
        emailMessage.textContent = "Email looks good";
        emailMessage.className = "success";
    }
});

//================= PASSWORD VALIDATION =================
passwordInput.addEventListener("input", function () {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    const value = passwordInput.value;
    if (value === "") {
        passwordMessage.textContent = "";
        passwordMessage.className = "";
        return;
    }
    if (!passwordPattern.test(value)) {
        passwordMessage.textContent =
            "8+ chars, 1 Capital letter, 1 number, 1 special character.";
        passwordMessage.className = "error";
    } else {
        passwordMessage.textContent = "Strong password";
        passwordMessage.className = "success";
    }
});

//================= CONFIRM PASSWORD VALIDATION =================
confirmPasswordInput.addEventListener("input", function () {
    const passwordValue = passwordInput.value;
    const confirmValue = confirmPasswordInput.value;
    if (confirmValue === "") {
        confirmPasswordMessage.textContent = "";
        confirmPasswordMessage.className = "";
        return;
    }
    if (confirmValue !== passwordValue) {
        confirmPasswordMessage.textContent = "Passwords do not match";
        confirmPasswordMessage.className = "error";
    } else {
        confirmPasswordMessage.textContent = "Passwords match";
        confirmPasswordMessage.className = "success";
    }
});

//================= SUBMIT CHECK =================
form.addEventListener("submit", function (e) {
    if (
        usernameMessage.className !== "success" ||
        emailMessage.className !== "success" ||
        passwordMessage.className !== "success" ||
        confirmPasswordMessage.className !== "success"
    ){
        e.preventDefault();
        alert("Please fix the errors before submitting");
    }
});