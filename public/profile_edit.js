document.addEventListener("DOMContentLoaded", async () => {
  const nameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const ageInput = document.getElementById("age");
  const emailInput = document.getElementById("email");
  const saveBtn = document.getElementById("save");
  const cancelBtn = document.getElementById("cancel");

  try {
    // 1. Recuperar el userId desde localStorage
    const userId = localStorage.getItem("userId");
    console.log("User ID desde localStorage:", userId);
    if (!userId) {
      alert("No se encontró el usuario en sesión");
      return;
    }

    // 2. Cargar los datos actuales del usuario
    const response = await fetch(`https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users/${userId}`);
    if (!response.ok) throw new Error("Error al cargar los datos del usuario");

    const user = await response.json();
    console.log("Usuario recibido en edit:", user);

    // 3. Rellenar formulario
    nameInput.value = user.firstName || "";
    lastNameInput.value = user.lastName || "";
    ageInput.value = user.age || "";
    emailInput.value = user.email || "";

    // 4. Guardar cambios
    saveBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const updatedUser = {
        firstName: nameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        email: emailInput.value.trim(),
        age: parseInt(ageInput.value.trim(), 10),
      };

      console.log("Datos a enviar:", updatedUser);

      try {
        const putResponse = await fetch(`https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        });

        if (!putResponse.ok) throw new Error("Error al actualizar el usuario");

        alert("Perfil actualizado con éxito ✅");
        window.location.href = "profile.html"; // Redirigir al perfil
      } catch (error) {
        console.error("Error guardando cambios:", error);
        alert("Hubo un problema al actualizar el perfil ❌");
      }
    });

    // 5. Cancelar edición
    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "profile.html";
    });

  } catch (error) {
    console.error("Error cargando edición de perfil:", error);
  }
});
