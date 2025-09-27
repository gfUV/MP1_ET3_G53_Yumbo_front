/**
 * This script manages the profile editing functionality.
 * It loads user data into a form, validates input fields,
 * updates user information via API, and handles navigation.
 * 
 * Visible messages for the user remain in Spanish.
 */
document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const ageInput = document.getElementById("age");
  const emailInput = document.getElementById("email");
  const saveBtn = document.getElementById("save");

  // contenedor de mensajes
  let messageBox = document.createElement("div");
  messageBox.id = "messageBox";
  messageBox.style.marginBottom = "10px";
  messageBox.style.fontWeight = "bold";
  document.querySelector("form")?.insertBefore(messageBox, saveBtn);

  function showMessage(msg, type = "success") {
    messageBox.textContent = msg;
    messageBox.style.color = type === "success" ? "green" : "red";
  }

  saveBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!nameInput.value.trim() || !lastNameInput.value.trim()) {
      showMessage("⚠️ Por favor completa nombre y apellido.", "error");
      return;
    }

    const updatedUser = {
      firstName: nameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      email: emailInput.value.trim() || null,
      age: ageInput.value ? parseInt(ageInput.value, 10) : null,
    };

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("Usuario no encontrado en sesión");

      const putResponse = await fetch(`https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!putResponse.ok) {
        const text = await putResponse.text().catch(() => null);
        throw new Error(`Error al actualizar usuario: ${putResponse.status} ${text || ""}`);
      }

      showMessage("✅ Perfil actualizado con éxito.");
      window.location.href = "profile.html";
    } catch (err) {
      console.error("Error guardando cambios:", err);
      showMessage("❌ Hubo un problema al actualizar el perfil.", "error");
    }
  });

  (async () => {
    try {
      const userId = localStorage.getItem("userId");
      console.log("User ID desde localStorage:", userId);
      if (!userId) {
        showMessage("⚠️ No se encontró el usuario en sesión", "error");
        return;
      }

      const response = await fetch(`https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users/${userId}`);
      if (!response.ok) throw new Error("Error al cargar los datos del usuario");

      const user = await response.json();
      console.log("Usuario recibido en edit:", user);

      if (nameInput) nameInput.value = user.firstName || "";
      if (lastNameInput) lastNameInput.value = user.lastName || "";
      if (ageInput) ageInput.value = user.age || "";
      if (emailInput) emailInput.value = user.email || "";
    } catch (error) {
      console.error("Error cargando edición de perfil:", error);
      showMessage("⚠️ No se pudo cargar la información del perfil.", "error");
    }
  })();
});
