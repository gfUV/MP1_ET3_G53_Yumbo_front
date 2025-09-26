document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');

  // Contenedor para mensajes globales (arriba del formulario)
  let globalMessage = document.createElement('div');
  globalMessage.id = "formMessage";
  form.insertBefore(globalMessage, form.firstChild);

  const showMessage = (message, type = "error") => {
    globalMessage.textContent = message;
    globalMessage.className = type === "success" ? "success-message" : "error-message";
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validar confirmación de contraseña
    if (form.password.value.trim() !== form.confirmPassword.value.trim()) {
      showMessage("⚠️ Las contraseñas no coinciden.");
      return;
    }

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
      console.log("Respuesta backend:", data);

      if (response.ok) {
        showMessage("✅ Registro exitoso. Redirigiendo...", "success");
        setTimeout(() => {
          window.location.href = "sign_in.html";
        }, 1500);
      } else {
        showMessage(data.error || data.message || "❌ No se pudo completar el registro.");
      }

    } catch (err) {
      console.error(err);
      showMessage("⚠️ Error de conexión con el servidor.");
    }
  });
});
