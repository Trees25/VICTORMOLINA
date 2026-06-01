export function numeroALetras(monto) {
  if (!monto) return "";

  // Extrae solo los números por si el usuario ingresó puntos (ej. 428.000)
  const num = parseInt(monto.toString().replace(/\D/g, ""), 10);

  if (isNaN(num)) return monto;
  if (num === 0) return "CERO";

  const unidades = [
    "",
    "UN",
    "DOS",
    "TRES",
    "CUATRO",
    "CINCO",
    "SEIS",
    "SIETE",
    "OCHO",
    "NUEVE",
  ];
  const decenas = [
    "",
    "DIEZ",
    "VEINTE",
    "TREINTA",
    "CUARENTA",
    "CINCUENTA",
    "SESENTA",
    "SETENTA",
    "OCHENTA",
    "NOVENTA",
  ];
  const especiales = [
    "DIEZ",
    "ONCE",
    "DOCE",
    "TRECE",
    "CATORCE",
    "QUINCE",
    "DIECISEIS",
    "DIECISIETE",
    "DIECIOCHO",
    "DIECINUEVE",
    "VEINTE",
    "VEINTIUNO",
    "VEINTIDOS",
    "VEINTITRES",
    "VEINTICUATRO",
    "VEINTICINCO",
    "VEINTISEIS",
    "VEINTISIETE",
    "VEINTIOCHO",
    "VEINTINUEVE",
  ];
  const centenas = [
    "",
    "CIENTO",
    "DOSCIENTOS",
    "TRESCIENTOS",
    "CUATROCIENTOS",
    "QUINIENTOS",
    "SEISCIENTOS",
    "SETECIENTOS",
    "OCHOCIENTOS",
    "NOVECIENTOS",
  ];

  function convertirGrupo(n) {
    let output = "";
    let c = Math.floor(n / 100);
    let resto = n % 100;
    let d = Math.floor(resto / 10);
    let u = resto % 10;

    if (c > 0) output += c === 1 && resto === 0 ? "CIEN " : centenas[c] + " ";
    if (resto >= 10 && resto <= 29) output += especiales[resto - 10] + " ";
    else {
      if (d > 2)
        output += decenas[d] + " " + (u > 0 ? "Y " + unidades[u] + " " : "");
      else if (u > 0) output += unidades[u] + " ";
    }
    return output.trim();
  }

  let letras = "";
  let millones = Math.floor(num / 1000000);
  let restoMillones = num % 1000000;
  let miles = Math.floor(restoMillones / 1000);
  let restos = restoMillones % 1000;

  if (millones > 0)
    letras +=
      millones === 1 ? "UN MILLON " : convertirGrupo(millones) + " MILLONES ";
  if (miles > 0)
    letras += miles === 1 ? "UN MIL " : convertirGrupo(miles) + " MIL ";
  if (restos > 0) letras += convertirGrupo(restos);

  // Corrección gramatical para "VEINTIUNO MIL" o "UN MIL" a "UN"
  return letras.trim().replace("UNO MIL", "UN MIL");
}
