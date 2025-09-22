document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');

  // Limpia los mensajes de error
  function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
  }

  // Muestra un error debajo del campo
  function showError(inputName, message) {
    const errorDiv = document.getElementById(`${inputName}-error`);
    if (errorDiv) errorDiv.textContent = message;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const age = parseInt(form.age.value);
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const confirmPassword = form.confirmPassword.value.trim();

    let valid = true;

    // Validaciones básicas
    if (!firstName) {
      showError('firstName', '⚠️ Ingresa tus nombres');
      valid = false;
    }

    if (!lastName) {
      showError('lastName', '⚠️ Ingresa tus apellidos');
      valid = false;
    }

    if (!age || age < 13) {
      showError('age', '⚠️ Debes tener al menos 13 años');
      valid = false;
    }

    if (!email.includes('@')) {
      showError('email', '⚠️ Ingresa un correo válido');
      valid = false;
    }

    if (password.length < 8) {
      showError('password', '⚠️ La contraseña debe tener mínimo 8 caracteres');
      valid = false;
    }

    if (confirmPassword !== password) {
      showError('confirmPassword', '⚠️ Las contraseñas no coinciden');
      valid = false;
    }

    if (!valid) return; // 🚫 Detiene si hay errores

    try {
      const response = await fetch("https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, age, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Registro exitoso
        window.location.href = "sign_in.html";
      } else {
        // ❌ Error desde el backend
        if (data.error?.includes("email")) {
          showError("email", "⚠️ Este correo ya está registrado");
        } else {
          alert("❌ Error: " + (data.error || "No se pudo registrar"));
        }
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error de conexión con el servidor.");
    }
  });
});
