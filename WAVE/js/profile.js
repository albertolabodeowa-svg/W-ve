async function loadProfile() {

    if (!requireLogin()) return;

    const requestedUser =
        new URLSearchParams(window.location.search).get("user");

    const username = requestedUser || getCurrentUser();
    const currentUser = getCurrentUser();

    const users = getUsers();

    const user = users.find(
        user => user.username === username
    );

    if (!user) return;

    const usernameElement =
        document.getElementById("profileUsername");

    const bioElement =
        document.getElementById("profileBio");

    if (usernameElement) {
        usernameElement.textContent = user.username;
    }

    if (bioElement) {
        bioElement.textContent = user.bio;
    }

    const editButton = document.getElementById("editProfileButton");
    const followButton = document.getElementById("profileFollowButton");
    const profileMessageLink = document.getElementById("profileMessageLink");

    if (editButton) {
        editButton.hidden = username !== currentUser;
    }

    if (followButton) {
        followButton.hidden = username === currentUser;
        followButton.textContent = isFollowing(username) ? "Following" : "Follow";
        followButton.onclick = () => {
            toggleFollow(username);
            loadProfile();
        };
    }

    if (profileMessageLink) {
        profileMessageLink.hidden = username === currentUser;
        profileMessageLink.href = `messages.html?to=${encodeURIComponent(username)}`;
    }

    const posts = getPosts().filter(
        post => post.username === username
    );

    const postCount =
        document.getElementById("postCount");

    if (postCount) {
        postCount.textContent = posts.length;
    }

    const followerCount = document.getElementById("followerCount");
    const followingCount = document.getElementById("followingCount");

    if (followerCount) {
        followerCount.textContent = getFollowersCount(username);
    }

    if (followingCount) {
        followingCount.textContent = getFollowingCount(username);
    }

    const profilePosts =
        document.getElementById("profilePosts");

    if (!profilePosts) return;

    profilePosts.innerHTML = "";

    posts.forEach(post => {

        const div = document.createElement("div");

        div.textContent = post.content;

        profilePosts.appendChild(div);
    });

    const profileReels = document.getElementById("profileReels");

    if (!profileReels) return;

    profileReels.innerHTML = "";

    const uploadedReels = await getUploadedProfileReels();
    const userReels = uploadedReels.filter(reel => reel.username === username);

    userReels.forEach(reel => {
        const reelElement = document.createElement("div");
        reelElement.className = "profile-reel";
        reelElement.innerHTML = `
            <video src="${reel.video}" controls muted playsinline></video>
            <p>${escapeProfileText(reel.caption)}</p>
        `;
        profileReels.appendChild(reelElement);
    });
}

function getUploadedProfileReels() {
    return new Promise(resolve => {
        const request = indexedDB.open("waveReelsDatabase", 1);

        request.onupgradeneeded = () => {
            request.result.createObjectStore("reels", { keyPath: "id" });
        };

        request.onsuccess = () => {
            const database = request.result;
            const readRequest = database
                .transaction("reels", "readonly")
                .objectStore("reels")
                .getAll();

            readRequest.onsuccess = () => {
                database.close();
                resolve(readRequest.result.map(reel => ({
                    ...reel,
                    video: URL.createObjectURL(reel.video)
                })));
            };

            readRequest.onerror = () => {
                database.close();
                resolve([]);
            };
        };

        request.onerror = () => resolve([]);
    });
}

function escapeProfileText(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}


function editProfile() {

    if (!requireLogin()) return;

    const username = getCurrentUser();

    const users = getUsers();

    const user = users.find(
        user => user.username === username
    );

    if (!user) return;

    const newBio = prompt(
        "Enter your new bio:",
        user.bio
    );

    if (newBio === null) {
        return;
    }

    user.bio = newBio;

    saveUsers(users);

    loadProfile();
}


loadProfile();