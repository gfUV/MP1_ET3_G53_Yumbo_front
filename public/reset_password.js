/**
 * reset_password.js
 *
 * Maneja el formulario de recuperación de contraseña.
 * Envía el correo electrónico al backend para generar un enlace de reseteo.
 *
 * @author
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resetPasswordForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();

    if (!email) {
      alert("⚠️ Por favor ingresa un correo electrónico válido.");
      return;
    }

    try {
      const res = await fetch("https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

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
