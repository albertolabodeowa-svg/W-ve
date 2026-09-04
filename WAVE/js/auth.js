function signup() {

    const username = document
        .getElementById("signupUsername")
        .value
        .trim();

    const password = document
        .getElementById("signupPassword")
        .value;

    if (!username || !password) {
        alert("Please fill in all fields.");
        return;
    }

    const users = getUsers();

    if (users.some(user => user.username === username)) {
        alert("Username already exists.");
        return;
    }

    const newUser = {
        username: username,
        password: password,
        bio: "Welcome to my WAVE profile."
    };

    users.push(newUser);

    saveUsers(users);

    setCurrentUser(username);

    alert("Account created successfully!");

    window.location.href = "index.html";
}


function login() {

    const username = document
        .getElementById("loginUsername")
        .value
        .trim();

    const password = document
        .getElementById("loginPassword")
        .value;

    const users = getUsers();

    const user = users.find(
        user =>
            user.username === username &&
            user.password === password
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


function requireLogin() {

    if (getCurrentUser()) {
        return true;
    }

    window.location.href = "login.html";

    return false;
}