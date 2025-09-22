document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const inputs = form.querySelectorAll("input[required]");
  const passwordInputs = form.querySelectorAll("input[type='password']");
  const toggleButtons = form.querySelectorAll(".togglePassword");
  const submitButton = form.querySelector("button[type='submit']");

  // 🔹 Función para validar campos
  function validateField(field) {
    const errorDiv = document.getElementById(`${field.id}-error`);
    let valid = true;
    let message = "";

    if (!field.value.trim()) {
      valid = false;
      message = "Este campo es obligatorio.";
    } else {
      switch (field.id) {
        case "age":
          if (isNaN(field.value) || field.value < 13) {
            valid = false;
            message = "Debes tener al menos 13 años.";
          }
          break;

        case "email":
          const emailRegex = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(field.value)) {
            valid = false;
            message = "Ingresa un correo electrónico válido.";
          }
          break;

        case "password":
          if (field.value.length < 8) {
            valid = false;
            message = "La contraseña debe tener mínimo 8 caracteres.";
          }
          break;

        case "confirmPassword":
          const password = document.getElementById("password").value;
          if (field.value !== password) {
            valid = false;
            message = "Las contraseñas no coinciden.";
          }
          break;
      }
    }

    errorDiv.textContent = message;
    return valid;
  }

  // 🔹 Validar todos los campos
  function validateForm() {
    let allValid = true;
    inputs.forEach((input) => {
      if (!validateField(input)) {
        allValid = false;
      }
    });
    submitButton.disabled = !allValid;
    return allValid;
  }

  // 🔹 Eventos para validar en tiempo real
  inputs.forEach((input) => {
    input.addEventListener("input", () => validateForm());
    input.addEventListener("blur", () => validateField(input));
  });

  // 🔹 Toggle de mostrar/ocultar contraseña
  toggleButtons.forEach((button) => {
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

  // 🔹 Evento submit del formulario
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("✅ Registro exitoso");
      // Aquí puedes llamar a tu API para guardar el usuario
      form.reset();
      submitButton.disabled = true;
    }
  });

  // Deshabilitar botón al inicio
  submitButton.disabled = true;
});
