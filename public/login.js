document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const submitBtn = document.getElementById('loginBtn');
  const togglePassword = document.getElementById('togglePassword');
  const eyeOpen = document.getElementById('eyeOpen');
  const eyeClosed = document.getElementById('eyeClosed');

  // 🚫 Botón deshabilitado al inicio
  submitBtn.disabled = true;

  // 🔑 Habilitar botón solo si hay datos
  function checkInputs() {
    const emailFilled = emailInput.value.trim() !== "";
    const passwordFilled = passwordInput.value.trim() !== "";
    submitBtn.disabled = !(emailFilled && passwordFilled);
  }

  emailInput.addEventListener("input", checkInputs);
  passwordInput.addEventListener("input", checkInputs);

  // 🧹 Ocultar errores en tiempo real
  emailInput.addEventListener("input", () => {
    if (emailInput.value.trim() !== "") {
      emailError.textContent = "";
    }
  });

  passwordInput.addEventListener("input", () => {
    if (passwordInput.value.trim() !== "") {
      passwordError.textContent = "";
    }
  });

  // 👁 Mostrar/ocultar contraseña
  togglePassword.addEventListener('click', () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    eyeOpen.style.display = isPassword ? "none" : "block";
    eyeClosed.style.display = isPassword ? "block" : "none";
  });

  // 🔑 Envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valid = true;
    emailError.textContent = "";
    passwordError.textContent = "";

    if (emailInput.value.trim() === "") {
      emailError.textContent = "⚠️ Por favor, ingresa tu correo electrónico.";
      valid = false;
    }
    if (passwordInput.value.trim() === "") {
      passwordError.textContent = "⚠️ Por favor, escribe tu contraseña.";
      valid = false;
    }

    if (!valid) return; // detener si faltan campos

    const loginData = {
      email: emailInput.value.trim(),
      password: passwordInput.value.trim(),
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
        passwordError.style.color = "green";
        passwordError.textContent = "✅ Bienvenido de nuevo, nos alegra verte otra vez.";
        localStorage.setItem("userId", data.userId);
        setTimeout(() => {
          window.location.href = "/task.html";
        }, 1200);
      } else {
        if (data.error?.toLowerCase().includes("usuario")) {
          emailError.textContent = "⚠️ No encontramos una cuenta con ese correo. Revisa o regístrate.";
        } else if (data.error?.toLowerCase().includes("contraseña")) {
          passwordError.textContent = "⚠️ La contraseña no coincide. Intenta de nuevo o restablécela.";
        } else {
          passwordError.textContent = "⚠️ No pudimos iniciar sesión en este momento. Inténtalo más tarde.";
        }
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      passwordError.textContent = "⚠️ Parece que hay un problema con la conexión. Verifica tu internet.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Ingresar";
    }
  });
});
