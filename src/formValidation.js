/**
 * formValidation.js - Client-side form validations for registration.
 * Runs when the DOM is fully loaded.
 * - Validates strong password rules in real time.
 * - Validates password confirmation in real time.
 * - Validates age in real time.
 * - Validates all required fields on form submission.
 */
document.addEventListener('DOMContentLoaded', () => {
  /** @type {HTMLFormElement} Registration form element */
  const form = document.getElementById('registerForm');

  /** @type {HTMLInputElement} Password input field */
  const passwordInput = form.password;

  /** @type {HTMLInputElement} Confirm password input field */
  const confirmPasswordInput = form.confirmPassword;

  /** @type {HTMLInputElement} Age input field */
  const ageInput = form.age;

  /**
   * Creates or reuses a <small> element below each input
   * to display validation errors.
   *
   * @param {HTMLInputElement} input - The input field to attach the error element to.
   * @returns {HTMLElement} The <small> element used for error messages.
   */
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

  /**
   * Real-time validation for a strong password.
   * Requirements:
   * - Minimum 8 characters
   * - At least 1 uppercase letter
   * - At least 1 number
   * - At least 1 special character
   */
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

  /**
   * Real-time validation to ensure passwords match.
   */
  confirmPasswordInput.addEventListener('input', () => {
    const small = createError(confirmPasswordInput);
    if (confirmPasswordInput.value !== passwordInput.value) {
      small.textContent = 'Las contraseñas no coinciden.';
    } else {
      small.textContent = '';
    }
  });

  /**
   * Real-time validation for minimum age requirement.
   */
  ageInput.addEventListener('input', () => {
    const small = createError(ageInput);
    if (parseInt(ageInput.value) < 13) {
      small.textContent = 'Debes tener al menos 13 años.';
    } else {
      small.textContent = '';
    }
  });

  /**
   * Final validation when submitting the form.
   * - Checks for required fields.
   * - Validates strong password.
   * - Validates password confirmation.
   * - Validates minimum age.
   * 
   * @param {SubmitEvent} e - The form submit event.
   */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

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

    if (!valid) {
      alert('❌ Corrige los errores antes de enviar.');
    }
  });
});
