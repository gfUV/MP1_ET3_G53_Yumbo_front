/**
 * registerUser.js
 *
 * Handles the connection between the registration form and the backend.
 * - Captures form data.
 * - Sends data to the backend via fetch.
 * - Displays success and error messages in the UI.
 *
 * Visible messages for the user remain in Spanish.
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const emailInput = form.email;

  const globalMessage = document.createElement('div');
  globalMessage.id = "formMessage";
  const submitBtn = form.querySelector('button[type="submit"]');
  form.insertBefore(globalMessage, submitBtn);

  const emailError = document.createElement('div');
  emailError.className = "error-message";
  emailInput.insertAdjacentElement("afterend", emailError);

  /**
   * Displays a global message above the submit button.
   * @param {string} message - The message to display.
   * @param {"success"|"error"} [type="error"] - The type of message.
   */
  const showMessage = (message, type = "error") => {
    globalMessage.textContent = message;
    globalMessage.className = type === "success" ? "success-message" : "error-message";
  };

  /**
   * Displays an error message specifically for the email field.
   * @param {string} message - The message to display below the email field.
   */
  const showEmailError = (message) => {
    emailError.textContent = message;
  };

  /**
   * Form submission handler
   * Validates data, sends it to the backend,
   * and handles responses or errors accordingly.
   * @event submit
   */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    globalMessage.textContent = "";
    emailError.textContent = "";

    const userData = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value.trim(),
      age: parseInt(form.age.value),
    };

    try {
      const response = await fetch(
        "https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData)
        }
      );

      const data = await response.json();
      console.log("Respuesta backend:", data);

      if (response.ok) {
        showMessage("✅ Registro exitoso. Redirigiendo...", "success");
        setTimeout(() => {
          window.location.href = "sign_in.html";
        }, 2500);
      } else {
        let errorMsg = data.error || data.message || "❌ No se pudo completar el registro.";

        if (
          errorMsg.includes("E11000") ||
          (errorMsg.toLowerCase().includes("email") && errorMsg.toLowerCase().includes("exists"))
        ) {
          showEmailError("⚠️ Este correo ya está registrado. Intenta iniciar sesión o usa otro correo.");
        } else {
          showMessage(errorMsg);
        }
      }
    } catch (err) {
      console.error(err);
      showMessage("⚠️ Error de conexión con el servidor.");
    }
  });
});
