const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    const xhr = new XMLHttpRequest();

    xhr.open("GET", "https://699f62ea3188b0b1d535f9d3.mockapi.io/users");
    xhr.send();

    xhr.onreadystatechange = function () {

        if (xhr.readyState === 4 && xhr.status === 200) {

            const users = JSON.parse(xhr.responseText);

            const user = users.find(u =>
                u.email === email && u.pssword === password
            );

            if (!user) {
                alert("Invalid Email or Password");
                return;
            }

            localStorage.setItem("currentUser", JSON.stringify(user));

            if (user.role === "admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "index.html";
            }
        }
    };
});
