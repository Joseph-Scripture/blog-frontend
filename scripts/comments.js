// =======================================================
// DOM Elements
// =======================================================
const postContainer = document.getElementById("post-container");
const commentsWrapper = document.getElementById("comments-wrapper");
const commentsContainer = document.getElementById("comments-container");
const commentInput = document.getElementById("commentInput");
const submitBtn = document.getElementById("submitComment");
const toggleCommentsBtn = document.getElementById("toggle-comments");
const themeBtn = document.getElementById("themeToggle");

// Get postId from URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postId");


async function loadPost() {
    try {
        const token = localStorage.getItem("token");

        // Fetch Post
        const postRes = await fetch(
            `https://scriptures-blog.onrender.com/api/post/${postId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!postRes.ok) throw new Error("Post fetch error");
        const post = await postRes.json();
        renderPost(post);

        // Fetch Comments
        const commentsRes = await fetch(
            `https://scriptures-blog.onrender.com/api/posts/${postId}/comments`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!commentsRes.ok) {
            commentsContainer.innerHTML = "<p>No comments yet.</p>";
            return;
        }

        const data = await commentsRes.json();
        console.log("Received comments:", data.comments);
        renderComments(data.comments || []);

    } catch (error) {
        console.error("Load error:", error);
        postContainer.innerHTML = "<p>Error loading post...</p>";
        commentsContainer.innerHTML = "<p>Error loading comments...</p>";
    }
}


function renderPost(post) {
    postContainer.innerHTML = `
        <h1 class="post-title">${post.title}</h1>
        <p class="post-body">${post.content}</p>
        <p class="post-author">By: ${post.author.username}</p>
        <p class="post-date">${new Date(post.createdAt).toLocaleDateString()}</p>
    `;
}


function renderComments(comments) {
    commentsContainer.innerHTML = "";
    const currentUser = Number(localStorage.getItem("userId"));

    if (comments.length === 0) {
        commentsContainer.innerHTML = "<p>No comments yet.</p>";
        return;
    }

    comments.forEach(comment => {
        const commentEl = buildCommentElement(comment, currentUser);
        commentsContainer.appendChild(commentEl);
    });

    attachActionListeners();
}


function buildCommentElement(comment, currentUser) {
    const div = document.createElement("div");
    div.classList.add("comment-card");

    let actions = '';
    if (comment.authorId === currentUser) {
        actions = `
            <div class="comment-actions">
                <button class="edit-btn" data-id="${comment.id}">Edit</button>
                <button class="delete-btn" data-id="${comment.id}">Delete</button>
            </div>
        `;
    }

    div.innerHTML = `
        <p>${comment.content}</p>
        <small>by ${comment.author.username}</small>
        ${actions}
    `;

    return div;
}

// =======================================================
// Attach Delete & Edit Listeners
// =======================================================
function attachActionListeners() {
    // Delete Buttons
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const commentId = btn.dataset.id;

            try {
                const res = await fetch(
                    `https://scriptures-blog.onrender.com/api/comment/${commentId}`,
                    {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                    }
                );

                if (!res.ok) throw new Error("Delete failed");

                // Remove from DOM
                btn.closest(".comment-card").remove();

                if (commentsContainer.children.length === 0) {
                    commentsContainer.innerHTML = "<p>No comments yet.</p>";
                }
            } catch (err) {
                console.error("Delete error:", err);
                alert("Could not delete comment.");
            }
        });
    });

    // Edit Buttons
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const commentId = btn.dataset.id;
            const commentCard = btn.closest(".comment-card");
            const currentText = commentCard.querySelector("p").innerText;

            const newText = prompt("Edit your comment:", currentText);
            if (!newText || newText.trim() === "") return;

            try {
                const res = await fetch(
                    `https://scriptures-blog.onrender.com/api/comments/${authorId}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ content: newText })
                    }
                );

                if (!res.ok) throw new Error("Update failed");
                commentCard.querySelector("p").innerText = newText;
            } catch (err) {
                console.error("Edit error:", err);
                alert("Could not edit comment.");
            }
        });
    });
}

// =======================================================
// Append New Comment Live
// =======================================================
function appendNewComment(comment) {
    const currentUser = Number(localStorage.getItem("userId"));
    const newEl = buildCommentElement(comment, currentUser);
    newEl.classList.add("new-comment");

    commentsContainer.appendChild(newEl);
    setTimeout(() => newEl.classList.remove("new-comment"), 150);

    attachActionListeners();
}

// =======================================================
// Submit New Comment
// =======================================================
submitBtn.addEventListener("click", async () => {
    const content = commentInput.value.trim();
    if (!content) return;

    try {
        const token = localStorage.getItem("token");

        const res = await fetch(
            `https://scriptures-blog.onrender.com/api/posts/${postId}/comments`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ content })
            }
        );

        if (!res.ok) throw new Error("Failed to post comment");

        const data = await res.json();
        appendNewComment(data.comment);

        commentInput.value = "";
        commentInput.focus();

    } catch (error) {
        console.error("Comment error:", error);
    }
});

// =======================================================
// Toggle Comments Panel
// =======================================================
toggleCommentsBtn.addEventListener("click", () => {
    const hidden = commentsWrapper.style.display === "none";
    commentsWrapper.style.display = hidden ? "block" : "none";
    toggleCommentsBtn.textContent = hidden ? "Hide Comments" : "Show Comments";
});

// =======================================================
// Theme Toggle
// =======================================================
themeBtn.addEventListener("click", () => {
    const html = document.documentElement;
    const current = html.getAttribute("data-theme");

    const newTheme = current === "light" ? "dark" : "light";
    html.setAttribute("data-theme", newTheme);
    themeBtn.textContent = newTheme === "dark" ? "☀️" : "🌙";

    localStorage.setItem("theme", newTheme);
});

// Load stored theme
(function applyTheme() {
    const saved = localStorage.getItem("theme");
    if (saved) {
        document.documentElement.setAttribute("data-theme", saved);
        themeBtn.textContent = saved === "dark" ? "☀️" : "🌙";
    }
})();

// =======================================================
// Initialize Page
// =======================================================
loadPost();
