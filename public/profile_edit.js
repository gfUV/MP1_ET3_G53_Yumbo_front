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

   * Save button listener
   * Validates input, builds an updated user object,
   * sends it to the API via PUT request, and handles success/error responses.
   * @event click
   */
  saveBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!nameInput.value.trim() || !lastNameInput.value.trim()) {
      alert("Por favor completa nombre y apellido.");
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

      saveBtn.disabled = true;
      saveBtn.textContent = "⏳ Actualizando...";

      const putResponse = await fetch(
        `https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!putResponse.ok) {
        const text = await putResponse.text().catch(() => null);
        throw new Error(
          `Error al actualizar usuario: ${putResponse.status} ${text || ""}`
        );
      }

      saveBtn.textContent = "✅ Perfil actualizado";
      setTimeout(() => {
        window.location.href = "profile.html";
      }, 1200);
    } catch (err) {
      console.error("Error guardando cambios:", err);
      saveBtn.disabled = false;
      saveBtn.textContent = "❌ Error, intenta de nuevo";
      setTimeout(() => {
        saveBtn.textContent = "💾 Guardar cambios";
      }, 2000);
    }
  });

  /**
   * Immediately Invoked Async Function
   * Loads the user data from the API and fills the form fields.
   * If it fails, logs the error but keeps button listeners active.
   */
  (async () => {
    try {
      const userId = localStorage.getItem("userId");
      console.log("User ID desde localStorage:", userId);
      if (!userId) {
        alert("No se encontró el usuario en sesión");
        return;
      }

      const response = await fetch(
        `https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users/${userId}`
      );
      if (!response.ok)
        throw new Error("Error al cargar los datos del usuario");

      const user = await response.json();
      console.log("Usuario recibido en edit:", user);

      if (nameInput) nameInput.value = user.firstName || "";
      if (lastNameInput) nameInput.value = user.lastName || "";
      if (ageInput) ageInput.value = user.age || "";
      if (emailInput) emailInput.value = user.email || "";
    } catch (error) {
      console.error("Error cargando edición de perfil:", error);
    }
  })();
});
