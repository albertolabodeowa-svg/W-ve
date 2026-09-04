function createPost() {

    const input = document.getElementById("postInput");

    if (!input) return;

    const text = input.value.trim();

    if (!text) {
        alert("Write something first.");
        return;
    }

    const username = getCurrentUser();

    if (!username) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    const posts = getPosts();

    const newPost = {
        id: Date.now(),
        username: username,
        content: text,
        likes: 0,
        liked: false,
        createdAt: new Date().toLocaleString()
    };

    posts.unshift(newPost);

    savePosts(posts);

    input.value = "";

    displayPosts();
}


/* LIKE POST */

function likePost(id) {

    if (!requireLogin()) return;

    const posts = getPosts();

    const post = posts.find(post => post.id === id);

    if (!post) return;

    const username = getCurrentUser();
    const userLikes = getUserPostLikes();
    const likedPosts = userLikes[username] || [];
    const likeIndex = likedPosts.indexOf(id);

    if (likeIndex === -1) {
        likedPosts.push(id);
        post.likes++;
    } else {
        likedPosts.splice(likeIndex, 1);
        post.likes--;
    }

    userLikes[username] = likedPosts;
    saveUserPostLikes(userLikes);
    savePosts(posts);

    displayPosts();
}


function commentPost(id) {

    if (!requireLogin()) return;

    const comment = prompt("Write a comment:");

    if (!comment || !comment.trim()) return;

    const comments = getPostComments();
    const postComments = comments[id] || [];

    postComments.push({
        username: getCurrentUser(),
        text: comment.trim(),
        createdAt: new Date().toLocaleString()
    });

    comments[id] = postComments;
    savePostComments(comments);
    displayPosts();
}


/* DELETE POST */

function deletePost(id) {

    const username = getCurrentUser();

    const posts = getPosts();

    const post = posts.find(post => post.id === id);

    if (!post) return;

    if (post.username !== username) {
        alert("You can only delete your own posts.");
        return;
    }

    const confirmDelete =
        confirm("Delete this post?");

    if (!confirmDelete) return;

    const updatedPosts =
        posts.filter(post => post.id !== id);

    savePosts(updatedPosts);

    displayPosts();
}


/* DISPLAY POSTS */

function displayPosts(postsToDisplay = null) {

    const feed =
        document.getElementById("feed");

    if (!feed) return;

    const posts =
        postsToDisplay || getPosts();

    const currentUser =
        getCurrentUser();

    feed.innerHTML = "";


    if (posts.length === 0) {

        feed.innerHTML = `

            <div class="empty-feed">

                <div class="empty-icon">
                    🌊
                </div>

                <h2>No posts yet</h2>

                <p>
                    Be the first person to post on WAVE.
                </p>

            </div>

        `;

        return;
    }


    posts.forEach(post => {

        const isOwner =
            post.username === currentUser;

        const likedPosts =
            getUserPostLikes()[currentUser] || [];

        const isLiked =
            likedPosts.includes(post.id);

        const comments =
            getPostComments()[post.id] || [];

        const postElement =
            document.createElement("article");

        postElement.className = "post";

        postElement.innerHTML = `

            <div class="post-header">

                <div class="post-user">

                    <div class="post-avatar">
                        👤
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(post.username)}
                        </strong>

                        <small>
                            ${post.createdAt || ""}
                        </small>

                    </div>

                </div>


                ${
                    isOwner
                    ?
                    `
                    <button
                        class="delete-button"
                        onclick="deletePost(${post.id})"
                    >
                        ⋯
                    </button>
                    `
                    :
                    ""
                }

            </div>


            <div class="post-content">

                <p>
                    ${escapeHTML(post.content)}
                </p>

            </div>


            <div class="post-actions">

                <button
                    onclick="likePost(${post.id})"
                    class="${isLiked ? "liked" : ""}"
                >
                    ${isLiked ? "❤️" : "♡"}
                    ${post.likes}
                </button>

                <button onclick="commentPost(${post.id})">
                    💬
                    ${comments.length}
                </button>

                <button>
                    📤
                </button>

                <button class="save-button">
                    🔖
                </button>

            </div>


            <div class="post-caption">

                <strong>
                    ${escapeHTML(post.username)}
                </strong>

                ${escapeHTML(post.content)}

            </div>

            <div class="post-comments">
                ${comments.map(comment => `
                    <p>
                        <strong>${escapeHTML(comment.username)}</strong>
                        ${escapeHTML(comment.text)}
                    </p>
                `).join("")}
            </div>

        `;

        feed.appendChild(postElement);

    });
}


/* SEARCH */

function searchPosts() {

    const input =
        document.getElementById("searchInput");

    if (!input) return;

    const search =
        input.value.toLowerCase().trim();

    const posts = getPosts();

    if (!search) {

        displayPosts();

        return;
    }

    const filteredPosts =
        posts.filter(post =>

            post.username
                .toLowerCase()
                .includes(search)

            ||

            post.content
                .toLowerCase()
                .includes(search)

        );

    displayPosts(filteredPosts);
}


/* PROTECT TEXT */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}