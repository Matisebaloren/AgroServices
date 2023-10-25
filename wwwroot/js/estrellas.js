function generarIconos(valor) {
  const iconos = [];

  const iconoLlena = '<i class="bx bxs-star"></i>';
  const iconoMediaLlena = '<i class="bx bxs-star-half"></i>';
  const iconoVacia = '<i class="bx bx-star"></i>';

  // Determinar el número de iconos llenos, medios llenos y vacíos
  const iconosLlenos = Math.floor(valor / 2);
  const iconoMedia = valor % 2 === 1 ? iconoMediaLlena : "";
  const iconosVacios = 5 - iconosLlenos - (iconoMedia === "" ? 0 : 1);

  // Agregar iconos llenos
  for (let i = 0; i < iconosLlenos; i++) {
    iconos.push(iconoLlena);
  }

  // Agregar icono medio lleno si es necesario
  if (iconoMedia !== "") {
    iconos.push(iconoMedia);
  }

  // Agregar iconos vacíos
  for (let i = 0; i < iconosVacios; i++) {
    iconos.push(iconoVacia);
  }

  return iconos.join(""); // Convertir el arreglo a una cadena de iconos
}