/**
 * registerUser.js - Backend connection for user registration.
 * - Captures registration form data.
 * - Sends user data to the backend API.
 * - Shows inline success/error messages instead of alerts.
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');

  // Contenedor para mensajes globales
  let globalMessage = document.createElement('div');
  globalMessage.id = "formMessage";
  form.appendChild(globalMessage);

  const showMessage = (message, type = "error") => {
    globalMessage.textContent = message;
    globalMessage.className = type === "success" ? "success-message" : "error-message";
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userData = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value.trim(),
      age: parseInt(form.age.value),
    };

    try {
      const response = await fetch("https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Registro exitoso
        showMessage("✅ Registro exitoso. Ahora puedes iniciar sesión.", "success");
        setTimeout(() => {
          window.location.href = "sign_in.html"; 
        }, 1500);
      } else {
        // ❌ Error del backend
        showMessage(data.error || "No se pudo completar el registro.");
      }

    } catch (err) {
      console.error(err);
      showMessage("⚠️ Error de conexión con el servidor.");
    }
  });
});
