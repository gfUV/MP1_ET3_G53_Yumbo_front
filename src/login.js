/**
 * Login script.
 * Runs when the DOM is fully loaded.
 * - Captures the login form.
 * - Handles validation and error messages.
 * - Sends credentials to the backend for authentication.
 */
document.addEventListener('DOMContentLoaded', () => {
  /** @type {HTMLFormElement} Login form element */
  const form = document.getElementById('loginForm');

  /** @type {HTMLElement} Container to display email field errors */
  const emailError = document.getElementById('email-error');

  /** @type {HTMLElement} Container to display password field errors */
  const passwordError = document.getElementById('password-error');

  /**
   * Handles the login form submission.
   * - Prevents default form submission.
   * - Clears previous errors.
   * - Sends credentials to the backend.
   * - On success: saves user ID in localStorage and redirects to tasks page.
   * - On failure: shows error messages under the correct field.
   * 
   * @async
   * @param {SubmitEvent} e - The form submit event.
   * @returns {Promise<void>}
   */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    emailError.textContent = "";
    passwordError.textContent = "";

    /** 
     * Login credentials taken from the form.
     * @type {{email: string, password: string}}
     */
    const loginData = {
      email: form.email.value.trim(),
      password: form.password.value.trim(),
    };

    try {
      const response = await fetch("https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/sessions/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      });

      /** @type {{ userId?: string, error?: string }} Backend response */
      const data = await response.json();

      if (response.ok) {
        // ✅ Successful login
        localStorage.setItem("userId", data.userId);
        window.location.href = "/task.html";
      } else {
        // ❌ Handle backend errors (messages displayed to the user in Spanish)
        if (data.error && data.error.toLowerCase().includes("usuario")) {
          emailError.textContent = "❌ " + data.error;
        } else if (data.error && data.error.toLowerCase().includes("contraseña")) {
          passwordError.textContent = "❌ " + data.error;
        } else {
          passwordError.textContent = "❌ " + (data.error || "Error en el inicio de sesión.");
        }
      }

    } catch (err) {
      console.error(err);
      passwordError.textContent = "⚠️ Error de conexión con el servidor.";
    }
  });
});
