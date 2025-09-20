/**
 * reset_password.js
 *
 * Handles the password recovery form.
 * Sends the user's email to the backend to generate a reset link.
 * 
 * Visible messages for the user remain in Spanish.
 * 
 * @author
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resetPasswordForm");

  /**
   * Form submission handler
   * Validates the email field and sends a POST request to the backend
   * to initiate the password reset process.
   * 
   * @event submit
   * @param {SubmitEvent} e - The form submit event
   */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    /** @type {string} */
    const email = form.email.value.trim();

    if (!email) {
      alert("⚠️ Por favor ingresa un correo electrónico válido.");
      return;
    }

    try {
      /**
       * Sends email to backend for password reset request
       * @type {Response}
       */
      const res = await fetch("https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      /** @type {{ message?: string }} */
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al solicitar restablecimiento de contraseña");
      }

      alert("✅ Revisa tu correo electrónico para continuar con el proceso.");
      form.reset();
      window.location.href = "sign_in.html";
    } catch (error) {
      console.error(error);
      alert("❌ " + error.message);
    }
  });
});

