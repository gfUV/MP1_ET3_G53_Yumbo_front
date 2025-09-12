document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const loginData = {
      email: form.email.value.trim(),
      password: form.password.value.trim(),
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/sessions/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar userId para usarlo en task.html
        localStorage.setItem("userId", data.userId);

        // Login exitoso: redirigir a tareas
        window.location.href = "task.html";
      } else {
        alert("❌ Error: " + (data.error || "Credenciales incorrectas"));
      }

    } catch (err) {
      console.error(err);
      alert("⚠️ Error de conexión con el servidor.");
    }
  });
});
