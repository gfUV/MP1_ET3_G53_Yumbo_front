document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("confirmResetForm");

  // Obtener token desde la URL
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (!token) {
    alert("Token inválido o faltante. Revisa tu correo.");
    window.location.href = "reset_password.html";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPassword = form.password.value;

    try {
      const res = await fetch("http://localhost:3000/api/v1/auth/reset-password/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Contraseña actualizada con éxito. Ahora inicia sesión.");
        window.location.href = "sign_in.html";
      } else {
        alert(data.message || "Error al actualizar la contraseña.");
      }
    } catch (err) {
      console.error(err);
      alert("Hubo un problema con la conexión al servidor.");
    }
  });
});
