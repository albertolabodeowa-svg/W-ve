document.addEventListener("DOMContentLoaded", () => {

    if (typeof displayPosts === "function") {
        displayPosts();
    }

    const theme = localStorage.getItem("waveTheme");

    if (theme === "dark") {
        document.body.classList.add("dark");
    }

});
