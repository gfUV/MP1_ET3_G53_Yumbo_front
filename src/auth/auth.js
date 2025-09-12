// auth.js - conexión con el backend
document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('registerForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Construir objeto de datos del formulario
    const userData = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value.trim(),
      age: parseInt(form.age.value),
    };

    try {
      // Enviar al backend
      const response = await fetch("http://localhost:8080/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Registro exitoso. Ahora inicia sesión.");
        window.location.href = "sign_in.html"; // Redirigir al login
      } else {
        alert("❌ Error: " + (data.error || "No se pudo registrar"));
      }

    } catch (err) {
      console.error(err);
      alert("⚠️ Error de conexión con el servidor.");
    }

  });

});
