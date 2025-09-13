document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Limpia errores previos
    emailError.textContent = "";
    passwordError.textContent = "";

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
        localStorage.setItem("userId", data.userId);
        window.location.href = "/task.html";
      } else {
        // 📌 Decide dónde mostrar el error según lo que devuelva el backend
        if (data.error && data.error.toLowerCase().includes("usuario")) {
          emailError.textContent = "❌ " + data.error;
        } else if (data.error && data.error.toLowerCase().includes("contraseña")) {
          passwordError.textContent = "❌ " + data.error;
        } else {
          passwordError.textContent = "❌ " + (data.error || "Error en el inicio de sesión.");
        }
      }

    } catch (err) {
      console.error(err);
      passwordError.textContent = "⚠️ Error de conexión con el servidor.";
    }
  });
});
