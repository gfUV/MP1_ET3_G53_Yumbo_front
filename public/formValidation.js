/**
 * This script manages the registration form validation.
 * It validates input fields in real-time, displays error messages,
 * ensures password confirmation matches, and toggles password visibility.
 * 
 * Visible messages for the user remain in Spanish.
 */
const form = document.getElementById("registerForm");

/**
 * Validation rules for each input field.
 * Each rule returns an empty string if valid, or an error message if invalid.
 */
const validators = {
  firstName: value => value.trim() !== "" ? "" : "Ingresa tus nombres.",
  lastName: value => value.trim() !== "" ? "" : "Ingresa tus apellidos.",
  age: value => value >= 13 ? "" : "Debes tener al menos 13 años.",
  email: value => /\S+@\S+\.\S+/.test(value) ? "" : "Ingresa un correo válido.",
  password: value =>
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(value)
      ? ""
      : "Debe tener 8+ caracteres, 1 mayúscula, 1 número y 1 símbolo.",
  confirmPassword: (value, formValues) =>
    value === formValues.password ? "" : "Las contraseñas no coinciden."
};

/**
 * Displays an error message below the input field.
 * @param {HTMLInputElement} input - The input element.
 * @param {string} message - The error message to display.
 */
function showError(input, message) {
  const wrapper = input.closest(".password-wrapper") || input;
  const errorDiv = wrapper.nextElementSibling;
  if (errorDiv && errorDiv.classList.contains("error-message")) {
    errorDiv.textContent = message;
  }
}

/**
 * Validates a single field based on its name and rules.
 * @param {HTMLInputElement} input - The input element to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
function validateField(input) {
  const { name, value } = input;
  const formValues = Object.fromEntries(new FormData(form));
  const error = validators[name] ? validators[name](value, formValues) : "";
  showError(input, error);
  return !error;
}

/**
 * Real-time validation for each input field.
 * @event input
 */
form.querySelectorAll("input").forEach(input => {
  input.addEventListener("input", () => validateField(input));
});

/**
 * Form submission handler
 * Validates all fields before allowing submission.
 * If valid, triggers form submission to registerUser.js.
 * @event submit
 */
form.addEventListener("submit", e => {
  e.preventDefault();
  let isValid = true;

  form.querySelectorAll("input").forEach(input => {
    if (!validateField(input)) isValid = false;
  });

  if (isValid) {
    console.log("Formulario válido. Enviando datos...");
    form.requestSubmit();
  }
});

/**
 * Password toggle handler
 * Switches input type between password and text,
 * and updates eye icons accordingly.
 * @event click
 */
document.querySelectorAll(".togglePassword").forEach(button => {
  button.addEventListener("click", () => {
    const input = button.previousElementSibling;
    const eyeOpen = button.querySelector(".eyeOpen");
    const eyeClosed = button.querySelector(".eyeClosed");

    if (input.type === "password") {
      input.type = "text";
      eyeOpen.style.display = "none";
      eyeClosed.style.display = "block";
    } else {
      input.type = "password";
      eyeOpen.style.display = "block";
      eyeClosed.style.display = "none";
    }
  });
});
