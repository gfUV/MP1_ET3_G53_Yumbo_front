document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const submitBtn = document.getElementById('loginBtn');
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const eyeOpen = document.getElementById('eyeOpen');
  const eyeClosed = document.getElementById('eyeClosed');

  // 👁 Mostrar/ocultar contraseña
  togglePassword.addEventListener('click', () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";

    // alternar iconos
    eyeOpen.style.display = isPassword ? "none" : "block";
    eyeClosed.style.display = isPassword ? "block" : "none";
  });

  // 🔑 Envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    emailError.textContent = "";
    passwordError.textContent = "";

    const loginData = {
      email: form.email.value.trim(),
      password: form.password.value.trim(),
    };

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = "⏳ Ingresando...";

      const response = await fetch(
        "https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/sessions/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", data.userId);
        window.location.href = "/task.html";
      } else {
        if (data.error?.toLowerCase().includes("usuario")) {
          emailError.textContent = "⚠️ " + data.error;
        } else if (data.error?.toLowerCase().includes("contraseña")) {
          passwordError.textContent = "⚠️ " + data.error;
        } else {
          passwordError.textContent =
            "⚠️ " + (data.error || "Error en el inicio de sesión.");
        }
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      passwordError.textContent = "⚠️ Error de conexión con el servidor.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Ingresar";
    }
  });
});
