const form = document.getElementById("registerForm");

// Reglas de validación
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

// Mostrar error debajo del input
function showError(input, message) {
  const wrapper = input.closest(".password-wrapper") || input;
  const errorDiv = wrapper.nextElementSibling;
  if (errorDiv && errorDiv.classList.contains("error-message")) {
    errorDiv.textContent = message;
  }
}

// Validar un campo
function validateField(input) {
  const { name, value } = input;
  const formValues = Object.fromEntries(new FormData(form));
  const error = validators[name] ? validators[name](value, formValues) : "";
  showError(input, error);
  return !error;
}

// Validación en tiempo real
form.querySelectorAll("input").forEach(input => {
  input.addEventListener("input", () => validateField(input));
});

// Validación al enviar
form.addEventListener("submit", e => {
  e.preventDefault();
  let isValid = true;

  form.querySelectorAll("input").forEach(input => {
    if (!validateField(input)) isValid = false;
  });

  if (isValid) {
    console.log("Formulario válido. Enviando datos...");
    form.submit(); // o fetch() si lo conectas al backend
  }
});

/* ==============================
   TOGGLE PASSWORD 👁 / 👁️‍🗨️
================================= */
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
