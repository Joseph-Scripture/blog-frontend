const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailError = document.querySelector(".emailError");
const passwordError = document.querySelector(".passwordError");
const generalError = document.querySelector(".generalErrors");
const newError = document.getElementById("generalErrors");
const popupOverlay = document.querySelector(".show-popup");
const togglePassword = document.getElementById("togglePassword");
// const generalError = document.querySelector(".generalError");
const showPopup = document.querySelector(".show-popup");
const popupClose = document.querySelector(".popup-close");
const popupMessage = document.querySelector(".popup-message");


popupClose.addEventListener("click", () => {
  popupOverlay.style.display = "none";
});

// Close popup when clicking outside popup-content
popupOverlay.addEventListener("click", (e) => {
  if (e.target === popupOverlay) popupOverlay.style.display = "none";
});


function showPopupMessage(message, options = {}) {
  popupMessage.textContent = message;
  popupOverlay.style.display = "flex";

  if (options.autoCloseMs) {
    setTimeout(() => (popupOverlay.style.display = "none"), options.autoCloseMs);
  }
  if (options.redirectUrl) {
    setTimeout(() => { window.location.replace(options.redirectUrl); }, options.redirectDelayMs || 1200);
  }
}
// TOGGLE PASSWORD VISIBILITY

togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "Show";
    }
});


// EMAIL VALIDATION
function validateEmail() {
    if (emailInput.validity.valueMissing) {
        emailError.textContent = "Email is required";
        return false;
    }

    if (!emailInput.value.includes("@") || !emailInput.value.includes(".")) {
        emailError.textContent = "Enter a valid email";
        return false;
    }

    emailError.textContent = "";
    return true;
}

// PASSWORD VALIDATION
function validatePassword() {
    const value = passwordInput.value.trim();

    if (passwordInput.validity.valueMissing) {
        passwordError.textContent = "Password is required";
        return false;
    }

    if (value.length < 8) {
        passwordError.textContent = "Password must be at least 8 characters";
        return false;
    }

    passwordError.textContent = "";
    return true;
}

emailInput.addEventListener("input", validateEmail);
passwordInput.addEventListener("input", validatePassword);

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const response = await fetch(
          "https://scriptures-blog.onrender.com/api/auth/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            mode: "cors",
            body: JSON.stringify({
              
              email: emailInput.value.trim(),
              password: passwordInput.value.trim()
            })
          }
        );
    
        const data = await response.json();
    
        // Backend validation errors
        if (!response.ok) {
          if (data.field === "email") emailError.textContent = data.message;
          else if (data.field === "password") passwordError.textContent = data.message;
          
          else generalError.textContent = data.message;
    
          return;
        }
    
        showPopupMessage(data.message, { autoCloseMs: 1500, redirectUrl: "dashboard.html", redirectDelayMs: 1200 });
        localStorage.setItem("token", data.accessToken);
        // localStorage.setItem("user", JSON.stringify(data.user.username));
        // console.log(data);
        // window.location.replace("dashboard.html");
    
      } catch (err) {
        newError.textContent = "Network error. Try again.";
        console.error(err);
      }
})