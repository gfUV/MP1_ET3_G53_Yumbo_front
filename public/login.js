/**
 * Login script.
 * Se ejecuta cuando el DOM está cargado.
 * - Captura el formulario de login.
 * - Valida campos y muestra errores.
 * - Envía credenciales al backend para autenticación.
 */
document.addEventListener('DOMContentLoaded', () => {
  /** @type {HTMLFormElement} Formulario de login */
  const form = document.getElementById('loginForm');

  /** @type {HTMLElement} Contenedor de errores del email */
  const emailError = document.getElementById('email-error');

  /** @type {HTMLElement} Contenedor de errores de la contraseña */
  const passwordError = document.getElementById('password-error');

  /** @type {HTMLButtonElement} Botón de enviar */
  const submitBtn = form.querySelector('button[type="submit"]');

  /**
   * Maneja el envío del formulario de login.
   * @async
   * @param {SubmitEvent} e - Evento submit del formulario.
   * @returns {Promise<void>}
   */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Limpiar errores previos
    emailError.textContent = "";
    passwordError.textContent = "";

    /** 
     * Credenciales del login.
     * @type {{email: string, password: string}}
     */
    const loginData = {
      email: form.email.value.trim(),
      password: form.password.value.trim(),
    };

    try {
      // 🔒 Deshabilitar botón mientras se procesa
      submitBtn.disabled = true;
      submitBtn.textContent = "Ingresando...";

      const response = await fetch(
        "https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/sessions/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        }
      );

      /** @type {{ userId?: string, error?: string }} Respuesta del backend */
      const data = await response.json();

      if (response.ok) {
        // ✅ Login exitoso
        localStorage.setItem("userId", data.userId);
        window.location.href = "/task.html";
      } else {
        // ❌ Manejo de errores según campo
        if (data.error?.toLowerCase().includes("usuario")) {
          emailError.textContent = "❌ " + data.error;
        } else if (data.error?.toLowerCase().includes("contraseña")) {
          passwordError.textContent = "❌ " + data.error;
        } else {
          passwordError.textContent =
            "❌ " + (data.error || "Error en el inicio de sesión.");
        }
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      passwordError.textContent = "⚠️ Error de conexión con el servidor.";
    } finally {
      // 🔓 Rehabilitar botón
      submitBtn.disabled = false;
      submitBtn.textContent = "Ingresar";
    }
  });
});
