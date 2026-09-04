// ==========================================
// WAVE REELS
// ==========================================

if (!requireLogin()) {
    throw new Error("Login required");
}


// ------------------------------------------
// REEL DATA
// ------------------------------------------

const reels = [
    {
        id: "reel1",
        username: "WAVE",
        video: "images/reels/reel1.mp4",
        caption: "Welcome to WAVE 🎬🔥",
        likes: 0
    },

    {
        id: "reel2",
        username: "WAVE",
        video: "images/reels/reel2.mp4",
        caption: "Enjoy the vibes 😎",
        likes: 0
    },

    {
        id: "reel3",
        username: "WAVE",
        video: "images/reels/reel3.mp4",
        caption: "Another amazing reel 🚀",
        likes: 0
    }
];

let allReels = [...reels];

function openReelsDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("waveReelsDatabase", 1);

        request.onupgradeneeded = () => {
            request.result.createObjectStore("reels", { keyPath: "id" });
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getUploadedReels() {
    try {
        const database = await openReelsDatabase();

        return await new Promise((resolve, reject) => {
            const request = database
                .transaction("reels", "readonly")
                .objectStore("reels")
                .getAll();

            request.onsuccess = () => {
                database.close();
                resolve(request.result.map(reel => ({
                    ...reel,
                    video: URL.createObjectURL(reel.video)
                })));
            };

            request.onerror = () => {
                database.close();
                reject(request.error);
            };
        });
    } catch (error) {
        return [];
    }
}

async function saveUploadedReel(reel) {
    const database = await openReelsDatabase();

    return new Promise((resolve, reject) => {
        const request = database
            .transaction("reels", "readwrite")
            .objectStore("reels")
            .put(reel);

        request.onsuccess = () => {
            database.close();
            resolve();
        };

        request.onerror = () => {
            database.close();
            reject(request.error);
        };
    });
}


// ------------------------------------------
// GET CURRENT USER
// ------------------------------------------

function getReelUser() {

    if (typeof getCurrentUser === "function") {
        return getCurrentUser() || "guest";
    }

    return "guest";
}


// ------------------------------------------
// LOCAL STORAGE KEY
// ------------------------------------------

function getLikesKey() {
    return "waveReelLikes_" + getReelUser();
}


// ------------------------------------------
// GET LIKED REELS
// ------------------------------------------

function getLikedReels() {

    try {

        return JSON.parse(
            localStorage.getItem(getLikesKey())
        ) || [];

    } catch (error) {

        return [];

    }
}


// ------------------------------------------
// SAVE LIKED REELS
// ------------------------------------------

function saveLikedReels(likedReels) {

    localStorage.setItem(
        getLikesKey(),
        JSON.stringify(likedReels)
    );
}


// ------------------------------------------
// DISPLAY REELS
// ------------------------------------------

function displayReels(reelsToDisplay = allReels) {

    const container = document.getElementById("reelsContainer");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (reelsToDisplay.length === 0) {

        container.innerHTML = `
            <div class="no-reels">
                <h2>No reels found</h2>
                <p>Try another search.</p>
            </div>
        `;

        return;
    }


    const likedReels = getLikedReels();


    reelsToDisplay.forEach(reel => {

        const isLiked = likedReels.includes(reel.id);

        const reelElement = document.createElement("article");

        reelElement.className = "reel-card";

        reelElement.dataset.reelId = reel.id;


        reelElement.innerHTML = `

            <!-- VIDEO -->

            <video
                class="reel-video"
                src="${reel.video}"
                loop
                muted
                playsinline
                preload="metadata"
            ></video>


            <!-- TOP -->

            <div class="reel-top">

                <button
                    class="back-button"
                    onclick="goBack()"
                >
                    ←
                </button>

                <strong>Reels</strong>

                <button
                    class="sound-button"
                    onclick="toggleSound(this)"
                >
                    🔇
                </button>

            </div>


            <!-- DARK GRADIENT -->

            <div class="reel-gradient"></div>


            <!-- USER INFO -->

            <div class="reel-info">

                <div class="reel-user">

                    <div class="reel-avatar">
                        ${reel.username.charAt(0).toUpperCase()}
                    </div>

                    <strong>${escapeReelText(reel.username)}</strong>

                </div>


                <p class="reel-caption">
                    ${escapeReelText(reel.caption)}
                </p>

            </div>


            <!-- ACTION BUTTONS -->

            <div class="reel-actions">

                <button
                    class="reel-action like-button ${isLiked ? "liked" : ""}"
                    onclick="likeReel('${reel.id}', this)"
                >

                    <span class="like-icon">
                        ${isLiked ? "❤️" : "🤍"}
                    </span>

                    <span class="like-count">
                        ${reel.likes + (isLiked ? 1 : 0)}
                    </span>

                </button>


                <button
                    class="reel-action"
                    onclick="commentReel('${reel.id}')"
                >
                    💬
                    <span>Comment</span>
                </button>


                <button
                    class="reel-action"
                    onclick="shareReel('${reel.id}')"
                >
                    ↗️
                    <span>Share</span>
                </button>

            </div>

        `;


        container.appendChild(reelElement);

    });


    setupVideoObserver();
}


// ------------------------------------------
// LIKE REEL
// ------------------------------------------

function likeReel(reelId, button) {

    let likedReels = getLikedReels();

    const index = likedReels.indexOf(reelId);


    if (index === -1) {

        likedReels.push(reelId);

        button.classList.add("liked");

        const icon = button.querySelector(".like-icon");

        const count = button.querySelector(".like-count");

        if (icon) {
            icon.textContent = "❤️";
        }

        if (count) {
            const current = parseInt(count.textContent) || 0;

            count.textContent = current + 1;
        }

    } else {

        likedReels.splice(index, 1);

        button.classList.remove("liked");

        const icon = button.querySelector(".like-icon");

        const count = button.querySelector(".like-count");

        if (icon) {
            icon.textContent = "🤍";
        }

        if (count) {

            const current = parseInt(count.textContent) || 0;

            count.textContent = Math.max(0, current - 1);

        }

    }


    saveLikedReels(likedReels);
}


// ------------------------------------------
// COMMENT
// ------------------------------------------

function commentReel(reelId) {

    const comment = prompt("Write a comment:");

    if (!comment || !comment.trim()) {
        return;
    }


    const commentsKey = "waveReelComments_" + reelId;

    let comments = [];

    try {

        comments =
            JSON.parse(localStorage.getItem(commentsKey)) || [];

    } catch (error) {

        comments = [];

    }


    comments.push({

        username: getReelUser(),

        comment: comment.trim(),

        date: new Date().toISOString()

    });


    localStorage.setItem(
        commentsKey,
        JSON.stringify(comments)
    );


    alert("Comment added! 💬");

}


// ------------------------------------------
// SHARE
// ------------------------------------------

async function shareReel(reelId) {

    const shareUrl =
        window.location.href.split("#")[0] +
        "#reel-" +
        reelId;


    try {

        if (navigator.share) {

            await navigator.share({

                title: "WAVE Reel",

                text: "Check out this reel on WAVE 🔥",

                url: shareUrl

            });

        } else {

            await navigator.clipboard.writeText(shareUrl);

            alert("Reel link copied! 📋");

        }

    } catch (error) {

        console.log("Share cancelled.");

    }

}


// ------------------------------------------
// SOUND
// ------------------------------------------

function toggleSound(button) {

    const card = button.closest(".reel-card");

    if (!card) {
        return;
    }


    const video = card.querySelector(".reel-video");

    if (!video) {
        return;
    }


    video.muted = !video.muted;


    if (video.muted) {

        button.textContent = "🔇";

    } else {

        button.textContent = "🔊";

    }

}


// ------------------------------------------
// VIDEO OBSERVER
// ------------------------------------------

function setupVideoObserver() {

    const videos =
        document.querySelectorAll(".reel-video");


    if (!videos.length) {
        return;
    }


    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    const video = entry.target;


                    if (entry.isIntersecting) {

                        video.play().catch(() => {
                            // Browser may block autoplay.
                        });

                    } else {

                        video.pause();

                    }

                });

            },

            {
                threshold: 0.65
            }

        );


    videos.forEach(video => {

        observer.observe(video);

    });

}


// ------------------------------------------
// GO BACK
// ------------------------------------------

function goBack() {

    window.location.href = "index.html";

}


// ------------------------------------------
// SEARCH REELS
// ------------------------------------------

function searchReels() {

    const input =
        document.getElementById("reelSearch");


    if (!input) {
        return;
    }


    const search =
        input.value.toLowerCase().trim();


    const filtered = allReels.filter(reel => {

        return (

            reel.username
                .toLowerCase()
                .includes(search)

            ||

            reel.caption
                .toLowerCase()
                .includes(search)

        );

    });


    displayReels(filtered);

}


// ------------------------------------------
// ESCAPE HTML
// ------------------------------------------

function escapeReelText(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ------------------------------------------
// SEARCH EVENT
// ------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        allReels = [
            ...(await getUploadedReels()),
            ...reels
        ];

        displayReels();


        const search =
            document.getElementById("reelSearch");


        if (search) {

            search.addEventListener(
                "input",
                searchReels
            );

        }

        setupReelUpload();

    }
);

function setupReelUpload() {
    const form = document.getElementById("reelUploadForm");
    const fileInput = document.getElementById("reelVideoInput");
    const fileName = document.getElementById("reelFileName");
    const status = document.getElementById("reelUploadStatus");

    if (!form || !fileInput || !fileName || !status) return;

    fileInput.addEventListener("change", () => {
        fileName.textContent = fileInput.files[0]?.name || "Choose a video";
    });

    form.addEventListener("submit", async event => {
        event.preventDefault();

        const file = fileInput.files[0];
        const username = getReelUser();

        if (typeof getCurrentUser !== "function" || !getCurrentUser()) {
            alert("Please login first.");
            window.location.href = "login.html";
            return;
        }

        if (!file || !file.type.startsWith("video/")) {
            status.textContent = "Choose a video file first.";
            return;
        }

        status.textContent = "Posting reel...";

        try {
            const newReel = {
                id: `uploaded-${Date.now()}`,
                username,
                caption: document.getElementById("reelCaptionInput").value.trim() || "My new reel",
                likes: 0,
                video: file,
                createdAt: new Date().toISOString()
            };

            await saveUploadedReel(newReel);
            allReels.unshift({
                ...newReel,
                video: URL.createObjectURL(file)
            });
            form.reset();
            fileName.textContent = "Choose a video";
            status.textContent = "Your reel is live.";
            displayReels(allReels);
        } catch (error) {
            status.textContent = "The video could not be posted. Please try again.";
        }
    });
}