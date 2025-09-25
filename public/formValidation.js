/**
 * formValidation.js - Validaciones del formulario de registro.
 * - Validaciones en tiempo real.
 * - Muestra/oculta contraseñas con SVG minimalistas.
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const passwordInput = form.password;
  const confirmPasswordInput = form.confirmPassword;
  const ageInput = form.age;

  // Crea o reutiliza un contenedor de error debajo del input
  const getErrorElement = (input) => {
    let errorEl = input.parentElement.querySelector(".error-message");
    if (!errorEl) {
      errorEl = document.createElement("div");
      errorEl.className = "error-message";
      input.insertAdjacentElement("afterend", errorEl);
    }
    return errorEl;
  };

  // Validación de fortaleza de contraseña
  passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;
    const errorEl = getErrorElement(passwordInput);
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    errorEl.textContent = !regex.test(value)
      ? "Debe tener 8+ caracteres, 1 mayúscula, 1 número y 1 símbolo."
      : "";
  });

  // Validación de confirmación de contraseña
  confirmPasswordInput.addEventListener('input', () => {
    const errorEl = getErrorElement(confirmPasswordInput);
    errorEl.textContent =
      confirmPasswordInput.value !== passwordInput.value
        ? "Las contraseñas no coinciden."
        : "";
  });

  // Validación de edad mínima
  ageInput.addEventListener('input', () => {
    const errorEl = getErrorElement(ageInput);
    errorEl.textContent =
      parseInt(ageInput.value) < 13 ? "Debes tener al menos 13 años." : "";
  });

  // ====== Toggle password con SVG 👁️🙈 ======
  const eyeOpen = `
    <svg xmlns="http://www.w3.org/2000/svg" 
         width="20" height="20" fill="none" 
         stroke="currentColor" stroke-width="2" 
         stroke-linecap="round" stroke-linejoin="round" 
         viewBox="0 0 24 24">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>`;

  const eyeClosed = `
    <svg xmlns="http://www.w3.org/2000/svg" 
         width="20" height="20" fill="none" 
         stroke="currentColor" stroke-width="2" 
         stroke-linecap="round" stroke-linejoin="round" 
         viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7
               a21.87 21.87 0 0 1 5.06-6.94M9.88 9.88A3 3 0 0 0 12 15
               a3 3 0 0 0 2.12-5.12M1 1l22 22"/>
    </svg>`;

  const toggleButtons = document.querySelectorAll(".togglePassword");
  toggleButtons.forEach((btn) => {
    const input = btn.previousElementSibling;
    btn.innerHTML = eyeOpen; // 👁️ por defecto

    btn.addEventListener("click", () => {
      if (input.type === "password") {
        input.type = "text";
        btn.innerHTML = eyeClosed; // 🙈
      } else {
        input.type = "password";
        btn.innerHTML = eyeOpen; // 👁️
      }
    });
  });

  // Validación al enviar
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    const fields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'age'];

    fields.forEach((fieldName) => {
      const input = form[fieldName];
      const value = input.value.trim();
      const errorEl = getErrorElement(input);

      if (!value) {
        errorEl.textContent = "Este campo es obligatorio.";
        valid = false;
      } else if (!errorEl.textContent) {
        errorEl.textContent = "";
      }
    });

    const age = parseInt(form.age.value);
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    if (age < 13) valid = false;
    if (!passwordRegex.test(password)) valid = false;
    if (password !== confirmPassword) valid = false;

    if (valid) {
      form.submit(); // deja que registerUser.js maneje el backend
    }
  });
});