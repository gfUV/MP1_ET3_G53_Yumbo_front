/**
 * auth.js - Backend connection for user registration.
 * Runs when the DOM is fully loaded.
 * - Captures registration form data.
 * - Sends user data to the backend API.
 * - Handles success and error responses.
 */
document.addEventListener('DOMContentLoaded', () => {
  /** @type {HTMLFormElement} Registration form element */
  const form = document.getElementById('registerForm');

  /**
   * Handles registration form submission.
   * - Prevents default submission.
   * - Collects and formats form data.
   * - Sends user data to the backend API.
   * - On success: shows confirmation message and redirects to login page.
   * - On error: shows error message to the user.
   *
   * @async
   * @param {SubmitEvent} e - The form submit event.
   * @returns {Promise<void>}
   */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    /**
     * User data captured from the registration form.
     * @type {{ firstName: string, lastName: string, email: string, password: string, age: number }}
     */
    const userData = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value.trim(),
      age: parseInt(form.age.value),
    };

    try {
      // Send data to the backend API
      const response = await fetch("https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      /** @type {{ error?: string }} Backend response */
      const data = await response.json();

      if (response.ok) {
        // ✅ Successful registration
        alert("✅ Registro exitoso. Ahora inicia sesión.");
        window.location.href = "sign_in.html"; // Redirect to login
      } else {
        // ❌ Registration error
        alert("❌ Error: " + (data.error || "No se pudo registrar"));
      }

    } catch (err) {
      console.error(err);
      alert("⚠️ Error de conexión con el servidor.");
    }
  });
});
