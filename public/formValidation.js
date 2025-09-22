/**
 * formValidation.js - Client-side form validations for registration.
 * - Validates strong password rules in real time.
 * - Validates password confirmation in real time.
 * - Validates age in real time.
 * - Validates all required fields on form submission.
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const passwordInput = form.password;
  const confirmPasswordInput = form.confirmPassword;
  const ageInput = form.age;

  const createError = (input) => {
    let small = input.parentElement.querySelector('small');
    if (!small) {
      small = document.createElement('small');
      small.style.color = 'red';
      small.style.fontSize = '0.8em';
      input.parentElement.appendChild(small);
    }
    return small;
  };

  // Password strength validation
  passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;
    const small = createError(passwordInput);
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    small.textContent = !regex.test(value)
      ? 'Contraseña débil. Necesita 8+ caracteres, 1 mayúscula, 1 número y 1 símbolo.'
      : '';
  });

  // Confirm password match
  confirmPasswordInput.addEventListener('input', () => {
    const small = createError(confirmPasswordInput);
    small.textContent =
      confirmPasswordInput.value !== passwordInput.value
        ? 'Las contraseñas no coinciden.'
        : '';
  });

  // Age validation
  ageInput.addEventListener('input', () => {
    const small = createError(ageInput);
    small.textContent =
      parseInt(ageInput.value) < 13 ? 'Debes tener al menos 13 años.' : '';
  });

  // Submit validation
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    const fields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];

    fields.forEach((fieldName) => {
      const input = form[fieldName];
      const value = input.value.trim();
      const small = createError(input);

      if (!value) {
        small.textContent = 'Este campo es obligatorio.';
        valid = false;
      } else if (!small.textContent) {
        // solo limpiamos si no hay otro error previo
        small.textContent = '';
      }
    });

    const age = parseInt(form.age.value);
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    if (age < 13) valid = false;
    if (!passwordRegex.test(password)) valid = false;
    if (password !== confirmPassword) valid = false;

    // ✅ Si es válido, dejamos que el otro script (registerUser.js) haga el fetch
    if (valid) {
      form.submit(); // dispara el flujo normal, registerUser.js ya escucha el submit
    }
  });
});
