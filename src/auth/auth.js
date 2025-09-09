document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const passwordInput = form.password;
  const confirmPasswordInput = form.confirmPassword;
  const ageInput = form.age;

  // Crear o usar <small> debajo de cada campo para errores
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

  // Validación en tiempo real de contraseña fuerte
  passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;
    const small = createError(passwordInput);
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!regex.test(value)) {
      small.textContent = 'Contraseña débil. Necesita 8+ caracteres, 1 mayúscula, 1 número y 1 símbolo.';
    } else {
      small.textContent = '';
    }
  });

  // Validación en tiempo real de confirmación de contraseña
  confirmPasswordInput.addEventListener('input', () => {
    const small = createError(confirmPasswordInput);
    if (confirmPasswordInput.value !== passwordInput.value) {
      small.textContent = 'Las contraseñas no coinciden.';
    } else {
      small.textContent = '';
    }
  });

  // Validación de edad en tiempo real
  ageInput.addEventListener('input', () => {
    const small = createError(ageInput);
    if (parseInt(ageInput.value) < 13) {
      small.textContent = 'Debes tener al menos 13 años.';
    } else {
      small.textContent = '';
    }
  });

  // Validación final al enviar
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Ejecuta la misma validación final
    const fields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
    let valid = true;

    fields.forEach((fieldName) => {
      const input = form[fieldName];
      const value = input.value.trim();
      const small = createError(input);
      if (!value) {
        small.textContent = 'Este campo es obligatorio.';
        valid = false;
      } else {
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

    if (valid) {
      alert('✅ Registro exitoso.');
      form.reset();
      document.querySelectorAll('small').forEach((s) => (s.textContent = ''));
    } else {
      alert('❌ Corrige los errores antes de enviar.');
    }
  });
});
