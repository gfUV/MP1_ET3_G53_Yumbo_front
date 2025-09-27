/**
 * confirm_reset.js
 *
 * Handles the confirmation step of password reset.
 * Retrieves the reset token from the URL and allows the user
 * to set a new password by sending it to the backend.
 *
 * Visible messages for the user remain in Spanish.
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("confirmResetForm");

  /**
   * Extracts the reset token from the URL query string.
   * @type {string|null}
   */
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  // Validate that token exists
  if (!token) {
    alert("Token inválido o faltante. Revisa tu correo.");
    window.location.href = "reset_password.html";
    return;
  }

  /**
   * Form submission handler.
   * Sends the token and new password to the backend API
   * to confirm password reset.
   *
   * @event submit
   * @param {SubmitEvent} e - The form submit event.
   */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    /** @type {string} */
    const newPassword = form.password.value;

    try {
      /**
       * Sends the token and new password to the API.
       * @type {Response}
       */
      const res = await fetch(
        "https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/auth/reset-password/confirm",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      /** @type {{ message?: string }} */
      const data = await res.json();

      if (res.ok) {
        alert("Contraseña actualizada con éxito. Ahora inicia sesión.");
        window.location.href = "sign_in.html";
      } else {
        alert(data.message || "Error al actualizar la contraseña.");
      }
    } catch (err) {
      console.error(err);
      alert("Hubo un problema con la conexión al servidor.");
    }
  });
});
