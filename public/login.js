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

  // 🔑 Verifica si ambos campos tienen contenido
  function checkInputs() {
    const emailFilled = emailInput.value.trim() !== "";
    const passwordFilled = passwordInput.value.trim() !== "";
    submitBtn.disabled = !(emailFilled && passwordFilled);
  }

  // 🔹 Validación en tiempo real
  function validateField(field, errorElem, message) {
    if (field.value.trim() === "") {
      errorElem.textContent = message;
    } else {
      errorElem.textContent = "";
    }
  }

  // 📥 Input y blur
  emailInput.addEventListener("input", () => {
    validateField(emailInput, emailError, "⚠️ Por favor, ingresa tu correo electrónico.");
    checkInputs();
  });
  passwordInput.addEventListener("input", () => {
    validateField(passwordInput, passwordError, "⚠️ Por favor, escribe tu contraseña.");
    checkInputs();
  });

  emailInput.addEventListener("blur", () => {
    validateField(emailInput, emailError, "⚠️ Por favor, ingresa tu correo electrónico.");
  });
  passwordInput.addEventListener("blur", () => {
    validateField(passwordInput, passwordError, "⚠️ Por favor, escribe tu contraseña.");
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

    // Validación final antes de enviar
    let valid = true;
    validateField(emailInput, emailError, "⚠️ Por favor, ingresa tu correo electrónico.");
    validateField(passwordInput, passwordError, "⚠️ Por favor, escribe tu contraseña.");
    if (emailInput.value.trim() === "" || passwordInput.value.trim() === "") valid = false;
    if (!valid) return;

    const loginData = {
      email: emailInput.value.trim(),
      password: passwordInput.value.trim(),
    };

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "⏳ Ingresando...";

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
      checkInputs();
      submitBtn.textContent = "Ingresar";
    }
  });
});
