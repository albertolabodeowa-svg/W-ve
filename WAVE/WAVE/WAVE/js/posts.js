function createPost() {

    const input = document.getElementById("postInput");
    const text = input.value.trim();

    if (!text) {
        alert("Write something first.");
        return;
    }

    const username = getCurrentUser() || "Guest";

    const posts = getPosts();

    posts.unshift({
        id: Date.now(),
        username: username,
        content: text,
        likes: 0
    });

    savePosts(posts);

    input.value = "";

    displayPosts();
}


function likePost(id) {

    const posts = getPosts();

    const post = posts.find(post => post.id === id);

    if (post) {
        post.likes++;
    }

    savePosts(posts);
    displayPosts();
}


function displayPosts() {

    const feed = document.getElementById("feed");

    if (!feed) return;

    const posts = getPosts();

    feed.innerHTML = "";

    if (posts.length === 0) {
        feed.innerHTML = `
            <div class="post">
                <div class="post-content">
                    <h2>Welcome to WAVE ??</h2>
                    <p>Create your first post!</p>
                </div>
            </div>
        `;
        return;
    }

    posts.forEach(post => {

        feed.innerHTML += `
            <article class="post">

                <div class="post-header">
                    ?? ${post.username}
                </div>

                <div class="post-content">
                    ${escapeHTML(post.content)}
                </div>

                <div class="post-actions">

                    <button onclick="likePost(${post.id})">
                        ?? ${post.likes}
                    </button>

                    <button>
                        ?? Comment
                    </button>

                    <button>
                        ?? Share
                    </button>

                </div>

            </article>
        `;
    });
}


function escapeHTML(text) {

    const div = document.createElement("div");
    div.textContent = text;

    return div.innerHTML;
}
