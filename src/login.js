document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorDiv = document.getElementById('error-message'); // Div para mostrar errores

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

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

      const data = await response.json();

      if (response.ok) {
        // Guardar userId para usarlo en task.html
        localStorage.setItem("userId", data.userId);

        // Login exitoso: redirigir a tareas
        window.location.href = "/task.html";
      } else {
        // Mostrar el mensaje de error en pantalla
        errorDiv.textContent = "❌ " + (data.error || "Correo o contraseña incorrecta.");
        errorDiv.style.display = "block";
      }

    } catch (err) {
      console.error(err);
      errorDiv.textContent = "⚠️ Error de conexión con el servidor.";
      errorDiv.style.display = "block";
    }
  });
});
