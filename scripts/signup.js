// Elements
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");

const usernameError = document.querySelector(".usernameError");
const emailError = document.querySelector(".emailError");
const passwordError = document.querySelector(".passwordError");
const confirmPasswordError = document.querySelector(".confirmPasswordError");
const generalError = document.querySelector(".generalError");

const form = document.getElementById("form-container");

// --- Basic HTML validation ---
function validateField(input, errorElement) {
  if (!input.checkValidity()) {
    errorElement.textContent = input.validationMessage;
    return false;
  }

  errorElement.textContent = "";
  return true;
}

function validatePasswordMatch() {
  if (passwordInput.value.trim() !== confirmInput.value.trim()) {
    confirmPasswordError.textContent = "Passwords do not match";
    return false;
  }

  confirmPasswordError.textContent = "";
  return true;
}
// Toggle password
const togglePassword = document.querySelectorAll(".togglePassword");
togglePassword.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const input = toggle.previousElementSibling;
    const type = input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", type);
    toggle.textContent = type === "password" ? "show" : "hide";
  });
});

// Live validation
usernameInput.addEventListener("input", () => validateField(usernameInput, usernameError));
emailInput.addEventListener("input", () => validateField(emailInput, emailError));
passwordInput.addEventListener("input", () => validateField(passwordInput, passwordError));
confirmInput.addEventListener("input", () => {
  validateField(confirmInput, confirmPasswordError);
  validatePasswordMatch();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Frontend validation
  const valid =
    validateField(usernameInput, usernameError) &&
    validateField(emailInput, emailError) &&
    validateField(passwordInput, passwordError) &&
    validatePasswordMatch();

  if (!valid) return;

  // Clear previous errors
  usernameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  generalError.textContent = "";

  try {
    const response = await fetch(
      "https://scriptures-blog.onrender.com/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: JSON.stringify({
          username: usernameInput.value.trim(),
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
      else if (data.field === "username") usernameError.textContent = data.message;
      else generalError.textContent = data.message;

      return;
    }

    
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.replace("dashboard.html");

  } catch (err) {
    generalError.textContent = "Network error. Try again.";
    console.error(err);
  }
});
