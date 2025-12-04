// =========================
// DOM Elements
// =========================
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

// =========================
// Load Post & Comments
// =========================
async function loadPost() {
    try {
        const token = localStorage.getItem("token");

        // 1️⃣ Fetch single post
        const resPost = await fetch(`https://scriptures-blog.onrender.com/api/post/${postId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (!resPost.ok) throw new Error("Failed to fetch post");
        const post = await resPost.json();
        renderPost(post);

        // 2️⃣ Fetch comments
        const resComments = await fetch(`https://scriptures-blog.onrender.com/api/posts/${postId}/comments`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (!resComments.ok) throw new Error("Failed to fetch comments");
        const comments = await resComments.json();

        renderComments(Array.isArray(comments) ? comments : []);

    } catch (err) {
        console.error("Error loading post or comments:", err);
        postContainer.innerHTML = "<p>Failed to load post.</p>";
        commentsContainer.innerHTML = "<p>Failed to load comments.</p>";
    }
}

// =========================
// Render Post
// =========================
function renderPost(post) {
    postContainer.innerHTML = `
        <h1 class="post-title">${post.title}</h1>
        <p class="post-body">${post.content}</p>
        <p class="post-author">By: ${post.author.username}</p>
        <p class="post-date">${new Date(post.createdAt).toLocaleDateString()}</p>
    `;
}

// =========================
// Render Comments
// =========================
function renderComments(comments) {
    commentsContainer.innerHTML = "";

    if (!comments || comments.length === 0) {
        commentsContainer.innerHTML = "<p>No comments yet.</p>";
        return;
    }

    comments.forEach(comment => {
        appendComment(comment);
    });
}

// =========================
// Append a single comment (with animation)
// =========================
function appendComment(comment) {
    const div = document.createElement("div");
    div.className = "comment-card new-comment"; // add animation class
    const username = comment.author?.username || "Anonymous";

    div.innerHTML = `
        <p>${comment.content}</p>
        <small>— ${username}</small>
    `;

    commentsContainer.appendChild(div);

    // Trigger animation
    requestAnimationFrame(() => {
        div.classList.remove("new-comment");
    });
}

// =========================
// Toggle Comments Visibility
// =========================
toggleCommentsBtn.addEventListener("click", () => {
    const isHidden = commentsWrapper.style.display === "none";
    commentsWrapper.style.display = isHidden ? "flex" : "none";
    toggleCommentsBtn.textContent = isHidden ? "Hide Comments" : "Show Comments";
});

// =========================
// Submit New Comment
// =========================
submitBtn.addEventListener("click", async () => {
    const content = commentInput.value.trim();
    if (!content) return;

    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`https://scriptures-blog.onrender.com/api/posts/${postId}/comments`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content })
        });

        if (!res.ok) throw new Error("Failed to post comment");

        const { comment: newComment } = await res.json();

        appendComment(newComment); // add instantly
        commentInput.value = "";
        commentInput.focus();

    } catch (err) {
        console.error("Error posting comment:", err);
    }
});

// =========================
// Theme Toggle
// =========================
themeBtn.addEventListener("click", () => {
    const html = document.documentElement;
    const theme = html.getAttribute("data-theme");

    if (theme === "light") {
        html.setAttribute("data-theme", "dark");
        themeBtn.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        html.setAttribute("data-theme", "light");
        themeBtn.textContent = "🌙";
        localStorage.setItem("theme", "light");
    }
});

// Apply saved theme on load
(function applySavedTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
        themeBtn.textContent = savedTheme === "dark" ? "☀️" : "🌙";
    }
})();

// =========================
// Load post + comments on page load
// =========================
loadPost();
