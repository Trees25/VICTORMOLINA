import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

import { numeroALetras } from "@/lib/numeros";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9,
    fontFamily: "Helvetica",
    lineHeight: 1.4,
    backgroundColor: "#FFFFFF",
  },
  outerBorder: {
    border: "1px solid #000000",
    padding: 15,
    height: "100%",
  },
  headerContainer: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "center", // Centra el bloque de texto en el contenedor
    alignItems: "center",
    borderBottom: "1px solid #000000",
    paddingBottom: 10,
    marginBottom: 15,
    minHeight: 45, // Evita que el logo colapse el alto si el texto es corto
  },
  headerTextContainer: {
    alignItems: "center", // Centra los textos internamente
    justifyContent: "center",
  },
  header: {
    fontWeight: "bold",
    fontSize: 13,
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
    marginBottom: 8,
    textAlign: "justify",
    color: "#000000",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  observacionesContainer: {
    marginTop: 5,
    marginBottom: 15,
  },
  signaturesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    borderTop: "1px solid #000000",
    paddingTop: 10,
  },
  col: {
    width: "48%",
    flexDirection: "column",
  },
  entityTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginBottom: 4,
    textDecoration: "underline",
    color: "#000000",
  },
  dataLine: {
    marginBottom: 2,
    color: "#000000",
  },
  signatureArea: {
    marginTop: 25,
    alignItems: "center",
  },
  lineaFirma: {
    width: "80%",
    borderBottom: "1px solid #000000",
    marginBottom: 3,
  },
  aclaracionText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    color: "#000000",
  },
});

const ahora = new Date();
const horas = ahora.getHours().toString().padStart(2, "0");
const minutos = ahora.getMinutes().toString().padStart(2, "0");

const horaCorta = `${horas}:${minutos}`;

export const BoletoConsignación = ({ data, logoUrl }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.outerBorder}>
        {/* Encabezado corregido con logo absoluto y textos centrados */}
        <View style={styles.headerContainer}>
          {logoUrl ? (
            <Image style={styles.logo} src={logoUrl} />
          ) : (
            <View
              style={[styles.logo, { height: 40, backgroundColor: "#FFFFFF" }]}
            />
          )}
          <View style={styles.headerTextContainer}>
            <Text style={styles.header}>VICTOR MOLINA AUTOMOTORES</Text>
            <Text style={styles.subHeader}>
              BOLETO DE VENTA EN CONSIGNACIÓN
            </Text>
          </View>
        </View>

        <Text style={styles.paragraph}>
          Conste por la presente que entre el Sr/Sra.{" "}
          <Text style={styles.bold}>
            {data.vendedorNombre || "……………………………………………………………………………………"}
          </Text>{" "}
          D.N.I N°{" "}
          <Text style={styles.bold}>
            {data.vendedorDni || "……………………………………………………………………………………"}
          </Text>
          {", "}
          con domicilio en{" "}
          <Text style={styles.bold}>
            {data.vendedorDomicilio || "……………………………………………………………………………………"}
          </Text>{" "}
          de la localidad de{" "}
          <Text style={styles.bold}>
            {data.vendedorLocalidad || "……………………………………………………………………………………"}
          </Text>
          {", "}
          Tel:
          <Text style={styles.bold}>
            {data.vendedorTel || "……………………………………………………………………………………"}
          </Text>
          {", "}
          en adelante denominado el "VENDEDOR" (Propietario del vehículo); y por
          la otra parte el Sr./Sra.{" "}
          <Text style={styles.bold}>
            {data.compradorNombre || "……………………………………………………………………………………"}
          </Text>{" "}
          D.N.I N°{" "}
          <Text style={styles.bold}>
            {data.compradorDni || "……………………………………………………………………………………"}
          </Text>
          {", "}
          con domicilio en{" "}
          <Text style={styles.bold}>
            {data.compradorDomicilio || "……………………………………………………………………………………"}
          </Text>{" "}
          de la localidad de{" "}
          <Text style={styles.bold}>
            {data.compradorLocalidad || "……………………………………………………………………………………"}
          </Text>
          {", "}
          Tel:
          <Text style={styles.bold}>
            {data.compradorTel || "……………………………………………………………………………………"}
          </Text>
          {", "}
          en adelante denominado el "COMPRADOR".
        </Text>

        <Text style={styles.paragraph}>
          Interviene en este acto la firma VICTOR MOLINA AUTOMOTORES en su
          exclusivo carácter de **AGENCIA INTERMEDIARIA**, conviniendo las
          partes lo siguiente:
        </Text>

        <Text style={styles.paragraph}>
          PRIMERA: El VENDEDOR, a través de la intermediación de la Agencia,
          vende al COMPRADOR un vehículo Marca{" "}
          <Text style={styles.bold}>
            {data.vehiculoMarca || "……………………………………………………………………………………"}
          </Text>{" "}
          Modelo{" "}
          <Text style={styles.bold}>
            {data.vehiculoModelo || "……………………………………………………………………………………"}
          </Text>{" "}
          Tipo{" "}
          <Text style={styles.bold}>
            {data.vehiculoTipo || "……………………………………………………………………………………"}
          </Text>{" "}
          Año{" "}
          <Text style={styles.bold}>
            {data.vehiculoAño || "……………………………………………………………………………………"}
          </Text>{" "}
          Dominio{" "}
          <Text style={styles.bold}>
            {data.vehiculoDominio || "……………………………………………………………………………………"}
          </Text>{" "}
          Motor N°{" "}
          <Text style={styles.bold}>
            {data.vehiculoMotor || "……………………………………………………………………………………"}
          </Text>{" "}
          Chasis N°{" "}
          <Text style={styles.bold}>
            {data.vehiculoChasis || "……………………………………………………………………………………"}
          </Text>{" "}
          Insc. Inicial{" "}
          <Text style={styles.bold}>
            {data.vehiculoInsc || "……………………………………………………………………………………"}
          </Text>{" "}
        </Text>

        <Text style={styles.paragraph}>
          SEGUNDA: La presente venta se efectúa por la suma total de ${" "}
          <Text style={styles.bold}>
            {data.precio || "………………… …………………………………………………………………"}
          </Text>{" "}
          (Pesos <Text style={styles.bold}>{numeroALetras(data.precio)}</Text>
          {") "}
          Pagaderos de la siguiente forma:{" "}
          <Text style={styles.bold}>
            {data.formaPago ||
              "………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………"}
          </Text>
        </Text>

        <Text style={styles.paragraph}>
          TERCERA (De la Intermediación): Las partes dejan expresa constancia de
          que la firma VICTOR MOLINA AUTOMOTORES actúa única y exclusivamente
          como intermediaria / consignataria para acercar a las partes
          contratantes. La Agencia no es propietaria del vehículo, no ejerce la
          posesión a título propio ni participa de los términos comerciales
          acordados entre comprador y vendedor, quedando exenta de toda
          responsabilidad civil, comercial, penal o mecánica derivada de esta
          operación.
        </Text>

        <Text style={styles.paragraph}>
          CUARTA (Responsabilidad del Vendedor): El VENDEDOR (propietario) se
          responsabiliza ampliamente por lo vendido, garantizando que el
          vehículo no está gravado con embargo, prenda, ni inhibición alguna.
          Asimismo, el VENDEDOR asume en forma exclusiva la responsabilidad por
          el estado mecánico, estructural, funcionamiento, vicios ocultos o
          cualquier defecto preexistente del automotor, liberando a la Agencia
          de todo reclamo. El VENDEDOR se hace cargo de las deudas de patentes,
          multas e impuestos hasta el día de hoy.
        </Text>

        <Text style={styles.paragraph}>
          QUINTA (Responsabilidad del Comprador): El COMPRADOR declara conocer y
          aceptar el estado de uso, funcionamiento y conservación en que se
          encuentra la unidad, habiendo realizado las revisiones que consideró
          oportunas. La responsabilidad por el estado del vehículo cesa para el
          VENDEDOR hasta el momento exacto de la entrega. A partir de la fecha{" "}
          <Text style={styles.bold}>
            {data.firmaDia && data.firmaMes
              ? `(${data.firmaDia}/${data.firmaMes}/2026)`
              : "(___/___/2026)"}
          </Text>{" "}
          y hora <Text style={styles.bold}>{horaCorta}</Text> de este acto, el
          COMPRADOR asume la responsabilidad civil y criminal por el uso y
          circulación del automotor.
        </Text>

        <Text style={styles.paragraph}>
          SEXTA: EL GASTO DE TRANSFERENCIA ESTÁ A CARGO EXCLUSIVO DEL COMPRADOR
          Y ASCIENDE A LA SUMA DE ${" "}
          <Text style={styles.bold}>
            {data.gastoTransferencia || "…………………………………………"}
          </Text>
          {". "}
          El COMPRADOR se obliga a transferir en un plazo no mayor a{" "}
          <Text style={styles.bold}>
            {data.fechaTrans || "…………………………………………"}
          </Text>
          días.
        </Text>

        <Text style={styles.paragraph}>
          SÉPTIMA: OBSERVACIONES:{""}
          <Text style={styles.bold}>
            {data.observaciones || "…………………………………………"}
          </Text>
        </Text>

        <Text style={styles.paragraph}>
          En San Juan a los{" "}
          <Text style={styles.bold}>{data.firmaDia || "……"}</Text> días del mes
          de <Text style={styles.bold}>{data.firmaMes || "…………"}</Text> de 2026,
          se firman tres ejemplares (uno para cada parte y uno para la Agencia)
          de un mismo tenor y a un solo efecto.
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

        <View style={styles.signaturesGrid}>
          <View style={styles.signatureArea}>
            <View style={styles.lineaFirma} />
            <Text style={styles.aclaracionText}>
              FIRMA Y ACLARACIÓN VENDEDOR (Propietario)
            </Text>
          </View>
          <View style={styles.signatureArea}>
            <View style={styles.lineaFirma} />
            <Text style={styles.aclaracionText}>
              FIRMA Y ACLARACIÓN COMPRADOR (Cliente)
            </Text>
          </View>
          <View style={styles.signatureArea}>
            <View style={styles.lineaFirma} />
            <Text style={styles.aclaracionText}>
              FIRMA Y ACLARACIÓN POR INTERMEDIARIA (Agencia)
            </Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
