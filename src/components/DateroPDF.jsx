import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40 },
  container: { border: "1px solid black", padding: 25 },
  header: {
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    marginBottom: 20,
  },
  row: { flexDirection: "row", alignItems: "flex-end", marginBottom: 15 },
  label: { fontFamily: "Helvetica", fontSize: 10, marginRight: 5 },
  value: { fontFamily: "Helvetica-Bold", fontSize: 11 },
  line: {
    borderBottom: "1px dotted black",
    flexGrow: 1,
    marginLeft: 4,
    height: 10,
  },
});

export const DateroPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.header}>
          DATERO AGENCIA VICTOR MOLINA AUTOMOTORES
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>TITULAR:</Text>
          <Text style={styles.value}>{data.titular}</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>CUIL:</Text>
          <Text style={styles.value}>{data.cuil}</Text>
          <View style={styles.line} />
          <Text style={styles.label}>FECHA NAC.:</Text>
          <Text style={styles.value}>{data.fechaNac}</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>CONYUGE:</Text>
          <Text style={styles.value}>{data.conyuge}</Text>
          <View style={styles.line} />
          <Text style={styles.label}>DNI:</Text>
          <Text style={styles.value}>{data.dniConyuge}</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>TELEFONOS:</Text>
          <Text style={styles.value}>{data.telefonosDatero}</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>CORREO:</Text>
          <Text style={styles.value}>{data.correo}</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>OCUPACION:</Text>
          <Text style={styles.value}>{data.ocupacion}</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>DOMICILIO DE DNI:</Text>
          <Text style={styles.value}>{data.domicilioDni}</Text>
          <View style={styles.line} />
        </View>
      </View>
    </Page>
  </Document>
);
