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
    
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user.username));
        window.location.replace("dashboard.html");
    
      } catch (err) {
        generalError.textContent = "Network error. Try again.";
        console.error(err);
      }
})