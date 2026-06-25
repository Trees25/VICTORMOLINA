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
    alignItems: "center", // ESTO ES LA CLAVE: Centra todo horizontalmente dentro de la columna
    justifyContent: "flex-start",
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
    width: "80%", // El ancho de la línea
    height: 1, // Altura física
    backgroundColor: "#000000", // Color de la línea (reemplaza al border)
    marginTop: 10, // Espacio respecto al texto de arriba si es necesario
    marginBottom: 5,
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
  listItem: {
    flexDirection: "row", // Pone el número y el texto en la misma línea
    marginBottom: 5, // Espaciado entre ítems
  },
  listNumber: {
    width: 20, // Ancho fijo para que los números queden alineados
    fontFamily: "Helvetica-Bold",
  },
  listText: {
    flex: 1, // Ocupa el resto del espacio
  },
});

export const ContratoConsignacion = ({ data, logoUrl }) => (
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
            <Text style={styles.subHeader}>CONTRATO DE CONSIGNACION</Text>
          </View>
        </View>

        {/* CUERPO DEL DOCUMENTO */}
        <Text style={styles.paragraph}>
          Entre el Señor{" "}
          <Text style={styles.bold}>
            {data.clienteNombre || "……………………………………………………………………………………"}
          </Text>{" "}
          CUIL{" "}
          <Text style={styles.bold}>
            {data.clienteCuil || "……………………………………………………………………………………"}
          </Text>{" "}
          por una parte y VICTOR MOLINA AUTOMOTORES con domicilio en Av. Paula
          Albarracín de Sarmiento 1118 – S – Capital por la otra parte, se
          conviene el siguiente contrato de “CONSIGNACION” para la venta de un{" "}
          <Text style={styles.bold}>{data.vehiculoMarca || "…………"}</Text> Modelo{" "}
          <Text style={styles.bold}>{data.vehiculoModelo || "…………"}</Text> Tipo{" "}
          <Text style={styles.bold}>{data.vehiculoTipo || "…………"}</Text> Motor
          N° <Text style={styles.bold}>{data.vehiculoMotor || "……………………"}</Text>{" "}
          Chasis N°{" "}
          <Text style={styles.bold}>{data.vehiculoChasis || "……………………"}</Text>{" "}
          Dominio{" "}
          <Text style={styles.bold}>{data.vehiculoDominio || "…………"}</Text> Año{" "}
          <Text style={styles.bold}>{data.vehiculoAnio || "…………"}</Text> del
          Registro Nacional de la Propiedad del Automotor bajo las siguientes
          condiciones:
        </Text>

        <View style={styles.listItem}>
          <Text style={styles.listNumber}>1)</Text>
          <Text style={styles.listText}>
            El Señor{" "}
            <Text style={styles.bold}>
              {data.clienteNombre || "……………………………………………………………………………………"}
            </Text>{" "}
            entrega y Victor Molina Automotores recibe la unidad detallada
            procedentemente para su venta, fijándose un precio vigente al
            momento de la venta.
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.listNumber}>2)</Text>
          <Text style={styles.listText}>
            Mediante este contrato la firma “Victor Molina Automotores” queda
            facultada a enajenar el vehículo, dentro de las normas corrientes y
            en la forma que convenga, pudiendo confeccionar la facturación
            prenda y toda clase de documentación de transferencia así como la
            inscripción de documentación en garantía por saldo de precio
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.listNumber}>3)</Text>
          <Text style={styles.listText}>
            Por la presente “Victor Molina Automotores” percibirá una comisión
            que se pactara al momento de la venta la que será descontada del
            valor de la unidad vendida.
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.listNumber}>4)</Text>
          <Text style={styles.listText}>
            El Señor.{" "}
            <Text style={styles.bold}>
              {data.clienteNombre || "……………………………………………………………………………………"}
            </Text>{" "}
            declara que el vehículo que entrega cuenta con toda la documentación
            a su nombre al día, responsabilizándose ampliamente que lo que
            entrega en consignación para su venta no está grabado con embargo,
            ni prenda alguna, ni pesa sobre el mismo impedimento legal alguno
            que afecte su derecho de disponer de su venta, como también lo que
            pudiera lograr en conceptos de patentes o multas el día que se
            realice su efectiva venta.
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.listNumber}>5)</Text>
          <Text style={styles.listText}>
            El consignante deberá abonar la suma de ${" "}
            <Text style={styles.bold}>
              {data.clienteAbonar || "……………………………………………………………………………………"}
            </Text>{" "}
            en caso de retirar el vehículo antes de realizada la venta del
            mismo.
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.listNumber}>6)</Text>
          <Text style={styles.listText}>
            Detalle del vehículo{" "}
            <Text style={styles.bold}>
              {data.vehiculoDetalles || "……………………………………………………………………………………"}
            </Text>{" "}
          </Text>
        </View>

        <View style={styles.observacionesContainer}>
          <Text style={styles.paragraph}>
            En prueba de conformidad se firman dos ejemplares de un mismo tenor
            y aun solo efecto, en San Juan a los{" "}
            <Text style={styles.bold}>{data.firmaDia || "……"}</Text> días del
            mes de <Text style={styles.bold}>{data.firmaMes || "…………"}</Text> de{" "}
            <Text style={styles.bold}>{data.firmaAnio || "…………"}</Text>, se
            firman dos ejemplares de un mismo tenor y a un solo efecto.
          </Text>
        </View>

        {/*
        <Text style={styles.paragraph}>
          En San Juan a los{" "}
          <Text style={styles.bold}>{data.firmaDia || "……"}</Text> días del mes
          de <Text style={styles.bold}>{data.firmaMes || "…………"}</Text> de{" "}
          <Text style={styles.bold}>{data.firmaAnio || "…………"}</Text>, se firman
          dos ejemplares de un mismo tenor y a un solo efecto.
        </Text>*/}

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

        {/* ÁREA DE FIRMAS */}
        <View style={styles.signaturesGrid}>
          <View style={styles.col}>
            <Text style={styles.entityTitle}>CONSIGNATARIO</Text>
            <View style={styles.signatureArea}>
              {/* LÍNEA HECHA CON SVG (No se borra al centrar) */}
              <Svg width="150" height="20">
                <Line
                  x1="0"
                  y1="10"
                  x2="150"
                  y2="10"
                  stroke="#000000"
                  strokeWidth="1"
                />
              </Svg>
              <Text style={styles.aclaracionText}>
                FIRMA Y ACLARACIÓN CONSIGNATARIO
              </Text>
            </View>
          </View>

          <View style={styles.col}>
            <Text style={styles.entityTitle}>CONSIGNANTE</Text>
            <View style={styles.signatureArea}>
              {/* LÍNEA HECHA CON SVG */}
              <Svg width="150" height="20">
                <Line
                  x1="0"
                  y1="10"
                  x2="150"
                  y2="10"
                  stroke="#000000"
                  strokeWidth="1"
                />
              </Svg>
              <Text style={styles.aclaracionText}>
                FIRMA Y ACLARACIÓN CONSIGNANTE
              </Text>
            </View>
          </View>
        </View>

        {/* ÁREA DE FIRMAS (Desplazada hacia abajo) */}
      </View>
    </Page>
  </Document>
);
