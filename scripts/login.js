const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailError = document.querySelector(".emailError");
const passwordError = document.querySelector(".passwordError");

const togglePassword = document.getElementById("togglePassword");

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


