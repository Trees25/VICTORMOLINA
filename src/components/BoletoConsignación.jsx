import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Svg,
  Line,
} from "@react-pdf/renderer";

import Logo from "../assets/logoRecortado.jpeg";

import { numeroALetras } from "@/lib/numeros";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9.5, // Ajustado para que entre todo perfecto sin superponerse
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
    marginBottom: 10,
    minHeight: 45,
  },
  headerTextContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#000000",
    textAlign: "center",
  },
  subHeader: {
    fontWeight: "bold",
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#000000",
    marginTop: 2,
    textAlign: "center",
  },
  paragraph: {
    marginBottom: 6, // Margen reducido para hacer espacio a las firmas
    textAlign: "justify",
    color: "#000000",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  blankSpace: {
    flexGrow: 1, // Toma todo el espacio disponible
    minHeight: 30, // Salvavidas: Evita que el contenedor colapse y rompa el texto
    position: "relative",
    marginVertical: 5,
  },
  signaturesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: "1px solid #000000",
    paddingTop: 10,
  },
  col: {
    flex: 1, // Se dividen equitativamente el espacio
    paddingHorizontal: 4,
    flexDirection: "column",
  },
  entityTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    marginBottom: 4,
    textDecoration: "underline",
    color: "#000000",
  },
  dataLine: {
    fontSize: 8,
    marginBottom: 2,
    color: "#000000",
  },
  signatureArea: {
    marginTop: 40, // Amplio espacio para estampar la firma física
    alignItems: "center",
  },
  lineaFirma: {
    width: "90%",
    borderBottom: "1px solid #000000",
    marginBottom: 3,
  },
  aclaracionText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    color: "#000000",
  },
  headerImage: {
    height: 45, // Ajustá este valor según las proporciones de tu imagen
    objectFit: "contain", // Evita que la imagen se estire o deforme
  },
});

const ahora = new Date();
const horaCorta = `${ahora.getHours().toString().padStart(2, "0")}:${ahora.getMinutes().toString().padStart(2, "0")}`;

export const BoletoConsignación = ({ data, logoUrl }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.outerBorder}>
        {/* Encabezado */}
        <View style={styles.headerContainer}>
          {logoUrl && (
            <Image
              style={{ position: "absolute", left: 0, height: 40 }}
              src={logoUrl}
            />
          )}
          <View style={styles.headerTextContainer}>
            <Image src={Logo} style={styles.headerImage} />
            <Text style={styles.subHeader}>BOLETO DE COMPRA/VENTA</Text>
          </View>
        </View>

        {/* Cuerpo del contrato */}
        <Text style={styles.paragraph}>
          Conste por la presente que entre el Sr/Sra.{" "}
          <Text style={styles.bold}>
            {data.vendedorNombre || "…………………………………………"}
          </Text>{" "}
          D.N.I N°{" "}
          <Text style={styles.bold}>{data.vendedorDni || "……………………"}</Text>, con
          domicilio en{" "}
          <Text style={styles.bold}>
            {data.vendedorDomicilio || "…………………………………………"}
          </Text>
          , Tel:{" "}
          <Text style={styles.bold}>{data.vendedorTel || "……………………"}</Text>, en
          adelante el "VENDEDOR" (Propietario); y por la otra parte el Sr./Sra.{" "}
          <Text style={styles.bold}>
            {data.compradorNombre || "…………………………………………"}
          </Text>{" "}
          D.N.I N°{" "}
          <Text style={styles.bold}>{data.compradorDni || "……………………"}</Text>,
          con domicilio en{" "}
          <Text style={styles.bold}>
            {data.compradorDomicilio || "…………………………………………"}
          </Text>
          , en adelante el "COMPRADOR".
        </Text>

        <Text style={styles.paragraph}>
          Interviene la firma{" "}
          <Text style={styles.bold}>VICTOR MOLINA AUTOMOTORES</Text> en su
          exclusivo carácter de AGENCIA INTERMEDIARIA.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>PRIMERA:</Text> Se vende un vehículo Marca{" "}
          <Text style={styles.bold}>{data.vehiculoMarca || "…………"}</Text> Modelo{" "}
          <Text style={styles.bold}>{data.vehiculoModelo || "…………"}</Text>{" "}
          Dominio{" "}
          <Text style={styles.bold}>{data.vehiculoDominio || "…………"}</Text>{" "}
          Motor N°{" "}
          <Text style={styles.bold}>{data.vehiculoMotor || "…………"}</Text> Chasis
          N° <Text style={styles.bold}>{data.vehiculoChasis || "…………"}</Text>.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>SEGUNDA:</Text> La venta se efectúa por{" "}
          <Text style={styles.bold}>${data.precio || "…………"}</Text> (Pesos{" "}
          <Text style={styles.bold}>{numeroALetras(data.precio)}</Text>). Forma
          de pago:{" "}
          <Text style={styles.bold}>
            {data.formaPago || "…………………………………………"}
          </Text>
          .
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>TERCERA (Intermediación):</Text> La Agencia
          actúa exclusivamente como intermediaria para acercar a las partes,
          quedando exenta de toda responsabilidad civil, comercial, penal o
          mecánica derivada de esta operación.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>CUARTA:</Text> El VENDEDOR garantiza que el
          vehículo no posee embargos ni inhibiciones y se hace cargo de deudas
          de patentes e impuestos hasta la fecha.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>QUINTA:</Text> El COMPRADOR asume la
          responsabilidad civil y criminal por el uso a partir de las{" "}
          <Text style={styles.bold}>{horaCorta}</Text> hs del día{" "}
          <Text style={styles.bold}>
            {data.firmaDia}/{data.firmaMes}/2026
          </Text>
          .
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>SEXTA:</Text> Gastos de transferencia a
          cargo del COMPRADOR:{" "}
          <Text style={styles.bold}>${data.gastoTransferencia || "…………"}</Text>.
          Plazo de transferencia:{" "}
          <Text style={styles.bold}>{data.fechaTrans || "……"}</Text> días.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>OBSERVACIONES:</Text>{" "}
          <Text style={styles.bold}>
            {data.observaciones || "…………………………………………"}
          </Text>
        </Text>

        <Text style={styles.paragraph}>
          En San Juan a los{" "}
          <Text style={styles.bold}>{data.firmaDia || "……"}</Text> días del mes
          de <Text style={styles.bold}>{data.firmaMes || "…………"}</Text> de{" "}
          <Text style={styles.bold}>{data.firmaAnio || "…………"}</Text>, se firman
          tres ejemplares de un mismo tenor.
        </Text>

        {/* Espacio en blanco con línea cruzada - ABSOLUTO PARA LLENAR */}
        <View style={styles.blankSpace}>
          <Svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <Line
              x1="1"
              y1="1"
              x2="99"
              y2="99"
              stroke="#000000"
              strokeWidth={0.5}
            />
          </Svg>
        </View>

        {/* Área de Firmas (3 Columnas Flexibles) */}
        <View style={styles.signaturesGrid}>
          {/* Vendedor */}
          <View style={styles.col}>
            <Text style={styles.entityTitle}>VENDEDOR (Propietario)</Text>
            <Text style={styles.dataLine}>
              Sr: <Text style={styles.bold}>{data.vendedorNombre}</Text>
            </Text>
            <Text style={styles.dataLine}>
              DNI: <Text style={styles.bold}>{data.vendedorDni}</Text>
            </Text>
            <Text style={styles.dataLine}>
              Tel: <Text style={styles.bold}>{data.vendedorTel}</Text>
            </Text>
            <View style={styles.signatureArea}>
              <View style={styles.lineaFirma} />
              <Text style={styles.aclaracionText}>FIRMA Y ACLARACIÓN</Text>
            </View>
          </View>

          {/* Comprador */}
          <View style={styles.col}>
            <Text style={styles.entityTitle}>COMPRADOR (Cliente)</Text>
            <Text style={styles.dataLine}>
              Sr: <Text style={styles.bold}>{data.compradorNombre}</Text>
            </Text>
            <Text style={styles.dataLine}>
              DNI: <Text style={styles.bold}>{data.compradorDni}</Text>
            </Text>
            <Text style={styles.dataLine}>
              Tel: <Text style={styles.bold}>{data.compradorTel}</Text>
            </Text>
            <View style={styles.signatureArea}>
              <View style={styles.lineaFirma} />
              <Text style={styles.aclaracionText}>FIRMA Y ACLARACIÓN</Text>
            </View>
          </View>

          {/* Agencia */}
          <View style={styles.col}>
            <Text style={styles.entityTitle}>INTERMEDIARIA (Agencia)</Text>
            <Text style={styles.dataLine}>
              <Text style={styles.bold}>Victor Molina Automotores</Text>
            </Text>
            <Text style={styles.dataLine}>
              CUIT: <Text style={styles.bold}>20-XXXXXXXX-X</Text>
            </Text>
            <Text style={styles.dataLine}>
              Loc: <Text style={styles.bold}>San Juan, Argentina</Text>
            </Text>
            <View style={styles.signatureArea}>
              <View style={styles.lineaFirma} />
              <Text style={styles.aclaracionText}>POR LA AGENCIA</Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
