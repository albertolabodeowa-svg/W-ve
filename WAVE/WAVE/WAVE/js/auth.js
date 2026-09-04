function signup() {

    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if (!username || !password) {
        alert("Please fill in all fields.");
        return;
    }

    const users = getUsers();

    if (users.some(user => user.username === username)) {
        alert("Username already exists.");
        return;
    }

    users.push({
        username: username,
        password: password,
        bio: "Welcome to my WAVE profile."
    });

    saveUsers(users);
    setCurrentUser(username);

    alert("Account created successfully!");

    window.location.href = "index.html";
}


function login() {

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    const users = getUsers();

    const user = users.find(
        user => user.username === username && user.password === password
    );

    if (!user) {
        alert("Incorrect username or password.");
        return;
    }

    setCurrentUser(username);

    window.location.href = "index.html";
}


function logout() {
    logoutUser();
    window.location.href = "login.html";
}
