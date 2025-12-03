const postsWrapper = document.querySelector(".posts-wrapper");

// Fetch posts
async function getAllPosts() {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch("https://scriptures-blog.onrender.com/api/posts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Failed to fetch posts");

        const posts = await response.json();
        renderPosts(posts);

    } catch (error) {
        console.error("Error:", error);
    }
}

function renderPosts(posts) {
    postsWrapper.innerHTML = ""; // clear

    posts.forEach(post => {
        const card = document.createElement("div");
        card.className = "post";

        const title = document.createElement("h2");
        title.className = "post-title";
        title.textContent = post.title;

        const body = document.createElement("p");
        body.className = "post-body";
        body.textContent = post.content;

        const author = document.createElement("p");
        author.className = "post-author";
        author.textContent = `By: ${post.author.username}`;

        const date = document.createElement("p");
        date.className = "post-date";
        date.textContent = new Date(post.createdAt).toLocaleDateString();

        const commentBtn = document.createElement("button");
        commentBtn.className = "comments-btn";
        commentBtn.textContent = "Comments";
        commentBtn.addEventListener("click", () => {
            window.location.href = `comments.html?postId=${post.id}`;
        });

        card.appendChild(title);
        card.appendChild(body);
        card.appendChild(author);
        card.appendChild(date);
        card.appendChild(commentBtn);

        postsWrapper.appendChild(card);
    });
}

getAllPosts();

/* -----------------------
   DARK / LIGHT MODE
------------------------ */
const themeBtn = document.getElementById("themeToggle");
const html = document.documentElement;

themeBtn.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");

    if (current === "light") {
        html.setAttribute("data-theme", "dark");
        themeBtn.textContent = "☀️";
    } else {
        html.setAttribute("data-theme", "light");
        themeBtn.textContent = "🌙";
    }
});
