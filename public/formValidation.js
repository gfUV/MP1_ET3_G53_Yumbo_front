/**
 * formValidation.js - Validaciones del formulario de registro.
 * - Muestra mensajes de error debajo de cada input.
 * - Valida contraseña fuerte, confirmación y edad en tiempo real.
 * - Verifica campos requeridos antes de enviar.
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

    // ✅ Si pasa todas las validaciones → dispara el flujo normal (registerUser.js)
    if (valid) {
      form.submit();
    }
  });
});
