document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("edit-form");
  const backBtn = document.getElementById("back");

  // Obtener ID de usuario desde localStorage
  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("❌ No se encontró el usuario en la sesión.");
    window.location.href = "sign_in.html";
    return;
  }

  // Cargar datos del usuario
  try {
    const response = await fetch(`https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users/${userId}`);
    if (!response.ok) throw new Error("Error al cargar datos de usuario");

    const user = await response.json();

    // Llenar los campos
    document.getElementById("firstName").value = user.firstName || "";
    document.getElementById("lastName").value = user.lastName || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("age").value = user.age || "";
    document.getElementById("createdAt").textContent = 
      user.createdAt ? new Date(user.createdAt).toLocaleDateString("es-ES") : "Desconocido";

  } catch (error) {
    console.error(error);
    alert("❌ No se pudo cargar el perfil.");
    window.location.href = "profile.html";
  }

  // Acción de volver
  backBtn.addEventListener("click", () => {
    window.location.href = "profile.html";
  });

  // Manejo del envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedUser = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      age: document.getElementById("age").value ? parseInt(document.getElementById("age").value) : null,
    };

    try {
      const response = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error("Error al actualizar usuario");

      alert("✅ Información actualizada correctamente");
      window.location.href = "profile.html";
    } catch (error) {
      console.error(error);
      alert("❌ No se pudo actualizar la información");
    }
  });
});
