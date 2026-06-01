import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

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

export const BoletoCompra = ({ data, logoUrl }) => (
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
            <Text style={styles.subHeader}>BOLETO DE COMPRA/VENTA</Text>
          </View>
        </View>

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

        {/* <Text style={styles.paragraph}>
          El comprador deberá atender estrictamente el vencimiento de las
          obligaciones contraídas, si las hubiere, ya que la falta de pago de
          uno de los documentos comerciales suscriptos, facultará al vendedor a
          ejecutar la totalidad de lo adecuado, produciéndose la caducidad de
          pleno derecho de los plazos otorgados, dejando expresamente
          establecido que el Juicio tendiente a obtener el pago se tramitara por
          vía del juicio ejecutivo.
        </Text>

        <Text style={styles.paragraph}>
          Se conviene por otra parte, que en caso de incumplimiento y demanda
          judicial queda el vendedor facultado a solicitar el embargo y/o
          secuestro inmediato del bien, renunciando el comprador a iniciar
          acciones que le pudieren corresponder por los probables daños y
          perjuicios que se ocasionaron.
        </Text>*/}

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

        {/* <Text style={styles.paragraph}>
          EL GASTO DE TRANSFERENCIA A CARGO DEL COMPRADOR ES DE:{" "}
          <Text style={styles.bold}>
            {data.gastoTransferencia || "…………………………………………"}
          </Text>
        </Text>*/}

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
          de <Text style={styles.bold}>{data.firmaMes || "…………"}</Text> de 2026,
          se firman dos ejemplares de un mismo tenor y a un solo efecto.
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
