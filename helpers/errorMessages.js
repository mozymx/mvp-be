const errorMessages = (error) => {
  if (error.code == 23505) {
    if (error.detail.includes("email")) {
      return "Este correo ya existe. Por favor agrega uno nuevo. :)";
    } else if (error.detail.includes("phone")) {
      return "Este teléfono ya existe. Por favor agrega uno nuevo. :)";
    } else {
      return;
    }
  }
};

module.exports = errorMessages;
