document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const emailInput = form.email;

  // Mensaje debajo del campo de email
  let emailMessage = document.createElement("small");
  emailMessage.id = "emailMessage";
  emailInput.parentNode.appendChild(emailMessage);

  emailInput.addEventListener("blur", async () => {
    const email = emailInput.value.trim();
    if (!email) return;

    try {
      const response = await fetch(`https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users/check-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (response.ok && data.exists) {
        emailMessage.textContent = "⚠️ Este correo ya está registrado.";
        emailMessage.style.color = "red";
      } else {
        emailMessage.textContent = "✔️ Correo disponible.";
        emailMessage.style.color = "green";
      }
    } catch (err) {
      console.error("Error verificando correo:", err);
      emailMessage.textContent = "⚠️ No se pudo verificar el correo.";
      emailMessage.style.color = "orange";
    }
  });
});
