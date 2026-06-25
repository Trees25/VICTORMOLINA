import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Svg, // Importación nueva
  Line, // Importación nueva
} from "@react-pdf/renderer";

import Logo from "../assets/logoRecortado.jpeg";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10.5, // 1. AUMENTAMOS LA LETRA GENERAL (antes 9)
    fontFamily: "Helvetica",
    lineHeight: 1.4,
    backgroundColor: "#FFFFFF",
  },
  outerBorder: {
    border: "1px solid #000000",
    padding: 15,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  headerContainer: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px solid #000000",
    paddingBottom: 10,
    marginBottom: 15,
    minHeight: 45,
  },
  headerTextContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontWeight: "bold",
    fontSize: 14, // Aumentado
    fontFamily: "Helvetica-Bold",
    color: "#000000",
    textAlign: "center",
  },
  subHeader: {
    fontWeight: "bold",
    fontSize: 12, // Aumentado
    fontFamily: "Helvetica-Bold",
    color: "#000000",
    marginTop: 2,
    textAlign: "center",
  },
  paragraph: {
    marginBottom: 8,
    textAlign: "justify",
    color: "#000000",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  observacionesContainer: {
    marginTop: 5,
  },
  // 3. CONTENEDOR PARA EL ESPACIO EN BLANCO CON LÍNEA CRUZADA
  blankSpace: {
    flexGrow: 1, // Ocupa todo el espacio vertical disponible
    position: "relative",
    marginVertical: 10,
  },
  signaturesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: "1px solid #000000",
    paddingTop: 10,
  },
  col: {
    width: "48%",
    flexDirection: "column",
  },
  entityTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11, // Aumentado
    marginBottom: 4,
    textDecoration: "underline",
    color: "#000000",
  },
  dataLine: {
    marginBottom: 2,
    color: "#000000",
  },
  signatureArea: {
    marginTop: 60, // 2. MUCHO MÁS ESPACIO PARA FIRMAR (antes 25)
    alignItems: "center",
  },
  lineaFirma: {
    width: "80%",
    borderBottom: "1px solid #000000",
    marginBottom: 3,
  },
  aclaracionText: {
    fontSize: 8.5, // Aumentado (antes 7)
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    color: "#000000",
  },
  headerImage: {
    height: 45, // Ajustá este valor según las proporciones de tu imagen
    objectFit: "contain", // Evita que la imagen se estire o deforme
  },
});

export const BoletoCompra = ({ data, logoUrl }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.outerBorder}>
        {/* ENCABEZADO */}
        <View style={styles.headerContainer}>
          {logoUrl ? (
            <Image style={styles.logo} src={logoUrl} />
          ) : (
            <View
              style={[styles.logo, { height: 40, backgroundColor: "#FFFFFF" }]}
            />
          )}
          <View style={styles.headerTextContainer}>
            <Image src={Logo} style={styles.headerImage} />
            <Text style={styles.subHeader}>BOLETO DE COMPRA/VENTA</Text>
          </View>
        </View>

        {/* CUERPO DEL DOCUMENTO */}
        <Text style={styles.paragraph}>
          Conste por la presente que entre el Sr.{" "}
          <Text style={styles.bold}>
            {data.vendedorNombre || "……………………………………………………………………………………"}
          </Text>{" "}
          como vendedor y el Sr.{" "}
          <Text style={styles.bold}>
            {data.compradorNombre || "……………………………………………………………………………………"}
          </Text>{" "}
          como comprador, se conviene lo siguiente: El Sr.{" "}
          <Text style={styles.bold}>
            {data.vendedorNombre || "…………………………………………"}
          </Text>{" "}
          vende un{" "}
          <Text style={styles.bold}>{data.vehiculoMarca || "…………"}</Text> Modelo{" "}
          <Text style={styles.bold}>{data.vehiculoModelo || "…………"}</Text> Tipo{" "}
          <Text style={styles.bold}>{data.vehiculoTipo || "…………"}</Text> Motor
          N° <Text style={styles.bold}>{data.vehiculoMotor || "……………………"}</Text>{" "}
          Chasis N°{" "}
          <Text style={styles.bold}>{data.vehiculoChasis || "……………………"}</Text>{" "}
          Dominio{" "}
          <Text style={styles.bold}>{data.vehiculoDominio || "…………"}</Text> Año{" "}
          <Text style={styles.bold}>{data.vehiculoAnio || "…………"}</Text> Insc.
          Inicial <Text style={styles.bold}>{data.vehiculoInsc || "…………"}</Text>{" "}
          en la suma de{" "}
          <Text style={styles.bold}>{data.precio || "………………………………"}</Text>.
        </Text>

        <Text style={styles.paragraph}>
          Pagaderos de la siguiente forma:{" "}
          <Text style={styles.bold}>
            {data.formaPago ||
              "………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………"}
          </Text>
        </Text>

        <Text style={styles.paragraph}>
          El VENDEDOR se responsabiliza ampliamente por lo vendido, declarando
          bajo juramento que el vehículo no está gravado con embargo alguno,
          prenda (Ley 12.962), ni pesa sobre el mismo ningún impedimento legal
          ni de inhibición que afecte el derecho a disponer de su venta.
          Asimismo, el VENDEDOR se hace cargo de la totalidad de lo que pudiera
          adeudar el vehículo en concepto de patentes, impuestos, multas o tasas
          hasta el día{" "}
          <Text style={styles.bold}>{data.libreDeudaDia || "……"}</Text> de{" "}
          <Text style={styles.bold}>{data.libreDeudaMes || "…………"}</Text> de
          2026.
        </Text>

        <Text style={styles.paragraph}>
          El VENDEDOR garantiza y se hace plenamente responsable por el estado
          mecánico, estructural y de funcionamiento general del vehículo,
          asumiendo cualquier reclamo por vicios ocultos, defectos o fallas
          preexistentes a este acto. El COMPRADOR (la Agencia) solo asume la
          responsabilidad civil y criminal por el uso del vehículo a partir de
          la fecha y hora de efectuada la entrega del mismo. El coche es
          recibido con su documentación al día.
        </Text>

        <Text style={styles.paragraph}>
          En San Juan a los{" "}
          <Text style={styles.bold}>{data.firmaDia || "……"}</Text> días del mes
          de <Text style={styles.bold}>{data.firmaMes || "…………"}</Text> de{" "}
          <Text style={styles.bold}>{data.firmaAnio || "…………"}</Text>, se firman
          dos ejemplares de un mismo tenor y a un solo efecto.
        </Text>

        <View style={styles.observacionesContainer}>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>OBSERVACIONES:</Text>{" "}
            <Text style={styles.bold}>
              {data.observaciones ||
                "………………………………………………………………………………………………………………………………"}
            </Text>
          </Text>
        </View>

        {/* ESPACIO EN BLANCO CON LÍNEA DIAGONAL PARA ANULARLO */}

        {/* ESPACIO EN BLANCO CON LÍNEA DIAGONAL PARA ANULARLO */}
        <View style={styles.blankSpace}>
          <Svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            {/* Los valores van de 0 a 100. Puse 2 y 98 para que no toque exactamente el borde y quede más prolija */}
            <Line
              x1="2"
              y1="2"
              x2="98"
              y2="98"
              stroke="#000000"
              strokeWidth={0.5}
            />
          </Svg>
        </View>

        {/* ÁREA DE FIRMAS (Desplazada hacia abajo) */}
        <View style={styles.signaturesGrid}>
          <View style={styles.col}>
            <Text style={styles.entityTitle}>VENDEDOR</Text>
            <Text style={styles.dataLine}>
              Sr(es): <Text style={styles.bold}>{data.vendedorNombre}</Text>
            </Text>
            <Text style={styles.dataLine}>
              Domicilio:{" "}
              <Text style={styles.bold}>{data.vendedorDomicilio}</Text>
            </Text>
            <Text style={styles.dataLine}>
              Localidad:{" "}
              <Text style={styles.bold}>{data.vendedorLocalidad}</Text>
            </Text>
            <Text style={styles.dataLine}>
              Tel: <Text style={styles.bold}>{data.vendedorTel}</Text> | Doc N°:{" "}
              <Text style={styles.bold}>{data.vendedorDni}</Text>
            </Text>
            <View style={styles.signatureArea}>
              <View style={styles.lineaFirma} />
              <Text style={styles.aclaracionText}>
                FIRMA Y ACLARACIÓN VENDEDOR
              </Text>
            </View>
          </View>

          <View style={styles.col}>
            <Text style={styles.entityTitle}>COMPRADOR</Text>
            <Text style={styles.dataLine}>
              Sr(es): <Text style={styles.bold}>{data.compradorNombre}</Text>
            </Text>
            <Text style={styles.dataLine}>
              Domicilio:{" "}
              <Text style={styles.bold}>{data.compradorDomicilio}</Text>
            </Text>
            <Text style={styles.dataLine}>
              Localidad:{" "}
              <Text style={styles.bold}>{data.compradorLocalidad}</Text>
            </Text>
            <Text style={styles.dataLine}>
              Tel: <Text style={styles.bold}>{data.compradorTel}</Text> | Doc
              N°: <Text style={styles.bold}>{data.compradorDni}</Text>
            </Text>
            <View style={styles.signatureArea}>
              <View style={styles.lineaFirma} />
              <Text style={styles.aclaracionText}>
                FIRMA Y ACLARACIÓN COMPRADOR
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
