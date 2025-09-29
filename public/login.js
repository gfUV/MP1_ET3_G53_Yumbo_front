/**
 * This script manages the login functionality.
 * It validates form fields in real-time, enables/disables the submit button,
 * toggles password visibility, and sends login requests to the API.
 * 
 * Visible messages for the user remain in Spanish.
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const submitBtn = document.getElementById('loginBtn');
  const togglePassword = document.getElementById('togglePassword');
  const eyeOpen = document.getElementById('eyeOpen');
  const eyeClosed = document.getElementById('eyeClosed');

  /**
   * Initial state
   * The login button is disabled until both fields have content.
   */
  submitBtn.disabled = true;

  /**
   * Checks whether both email and password fields are filled.
   * Enables or disables the submit button accordingly.
   */
  function checkInputs() {
    const emailFilled = emailInput.value.trim() !== "";
    const passwordFilled = passwordInput.value.trim() !== "";
    submitBtn.disabled = !(emailFilled && passwordFilled);
  }

  /**
   * Validates a given field and updates its error message.
   * @param {HTMLInputElement} field - The input field to validate.
   * @param {HTMLElement} errorElem - The error element where messages will be shown.
   * @param {string} message - The message to display if validation fails.
   */
  function validateField(field, errorElem, message) {
    if (field.value.trim() === "") {
      errorElem.textContent = message;
    } else {
      errorElem.textContent = "";
    }
  }

  /**
   * Input listeners for real-time validation of email and password fields.
   * @event input
   */
  emailInput.addEventListener("input", () => {
    validateField(emailInput, emailError, "⚠️ Por favor, ingresa tu correo electrónico.");
    checkInputs();
  });
  passwordInput.addEventListener("input", () => {
    validateField(passwordInput, passwordError, "⚠️ Por favor, escribe tu contraseña.");
    checkInputs();
  });

  /**
   * Blur listeners to validate when leaving the input fields.
   * @event blur
   */
  emailInput.addEventListener("blur", () => {
    validateField(emailInput, emailError, "⚠️ Por favor, ingresa tu correo electrónico.");
  });
  passwordInput.addEventListener("blur", () => {
    validateField(passwordInput, passwordError, "⚠️ Por favor, escribe tu contraseña.");
  });

  /**
   * Toggle password visibility
   * Switches between password and text input type, and updates eye icons.
   * @event click
   */
  togglePassword.addEventListener('click', () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    eyeOpen.style.display = isPassword ? "none" : "block";
    eyeClosed.style.display = isPassword ? "block" : "none";
  });

  /**
   * Form submission handler
   * Validates inputs, builds the login request,
   * sends it to the API, and handles responses or errors.
   * @event submit
   */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valid = true;
    validateField(emailInput, emailError, "⚠️ Por favor, ingresa tu correo electrónico.");
    validateField(passwordInput, passwordError, "⚠️ Por favor, escribe tu contraseña.");
    if (emailInput.value.trim() === "" || passwordInput.value.trim() === "") valid = false;
    if (!valid) return;

    const loginData = {
      email: emailInput.value.trim(),
      password: passwordInput.value.trim(),
    };

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "⏳ Ingresando...";

      const response = await fetch(
        "https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/sessions/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        passwordError.style.color = "green";
        passwordError.textContent = "✅ Bienvenido de nuevo, nos alegra verte otra vez.";
        localStorage.setItem("userId", data.userId);
        setTimeout(() => {
          window.location.href = "/task.html";
        }, 1200);
      } else {
        if (data.error?.toLowerCase().includes("usuario")) {
          emailError.textContent = "⚠️ No encontramos una cuenta con ese correo. Revisa o regístrate.";
        } else if (data.error?.toLowerCase().includes("contraseña")) {
          passwordError.textContent = "⚠️ La contraseña no coincide. Intenta de nuevo o restablécela.";
        } else {
          passwordError.textContent = "⚠️ No pudimos iniciar sesión en este momento. Inténtalo más tarde.";
        }
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      passwordError.textContent = "⚠️ Parece que hay un problema con la conexión. Verifica tu internet.";
    } finally {
      checkInputs();
      submitBtn.textContent = "Ingresar";
    }
  });
});
