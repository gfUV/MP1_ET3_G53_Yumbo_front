/**
 * registerUser.js - Conexión al backend de registro.
 * - Captura datos del formulario.
 * - Envía al backend con fetch.
 * - Muestra mensajes de éxito/error.
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const emailInput = form.email;

  // Contenedor para mensajes globales (arriba del botón)
  let globalMessage = document.createElement('div');
  globalMessage.id = "formMessage";
  const submitBtn = form.querySelector('button[type="submit"]');
  form.insertBefore(globalMessage, submitBtn);

  // Contenedor específico de error debajo del correo
  let emailError = document.createElement('div');
  emailError.className = "error-message";
  emailInput.insertAdjacentElement("afterend", emailError);

  const showMessage = (message, type = "error") => {
    globalMessage.textContent = message;
    globalMessage.className = type === "success" ? "success-message" : "error-message";
  };

  const showEmailError = (message) => {
    emailError.textContent = message;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Limpiamos mensajes previos
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
      submitBtn.disabled = true;
      submitBtn.textContent = "⏳ Registrando...";
      const response = await fetch("https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      console.log("Respuesta backend:", data);

      if (response.ok) {
        // ✅ Registro exitoso
        showMessage("✅ Registro exitoso. Redirigiendo...", "success");
        setTimeout(() => {
          window.location.href = "sign_in.html";
        }, 2500);
      } else {
        let errorMsg = data.error || data.message || "❌ No se pudo completar el registro.";

        // Normalizamos errores conocidos → correo duplicado
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
