if (!requireLogin()) {
    throw new Error("Login required");
}

document.addEventListener("DOMContentLoaded", () => {

    /* Display posts */

    if (typeof displayPosts === "function") {
        displayPosts();
    }


    /* Load saved theme */

    const theme =
        localStorage.getItem("waveTheme");

    if (theme === "dark") {

        document.body.classList.add("dark");

        updateThemeButton(true);

    } else {

        updateThemeButton(false);

    }


    /* Display current user */

    const username =
        getCurrentUser();

    const userStory =
        document.getElementById("userStory");

    if (userStory && username) {

        userStory.innerHTML = `
            👤
        `;

        userStory.title =
            username;
    }

});


/* DARK MODE */

function toggleTheme() {

    const isDark =
        document.body.classList.toggle("dark");

    if (isDark) {

        localStorage.setItem(
            "waveTheme",
            "dark"
        );

        updateThemeButton(true);

    } else {

        localStorage.setItem(
            "waveTheme",
            "light"
        );

        updateThemeButton(false);
    }
}


/* UPDATE BUTTON */

function updateThemeButton(isDark) {

    const button =
        document.getElementById("themeButton");

    if (!button) return;

    if (isDark) {

        button.innerHTML = "☀️";

        button.title = "Switch to light mode";

    } else {

        button.innerHTML = "🌙";

        button.title = "Switch to dark mode";
    }
}