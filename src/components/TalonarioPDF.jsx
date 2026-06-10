import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { numeroALetras } from "@/lib/numeros";

const styles = StyleSheet.create({
  page: { padding: 20 },
  container: { border: "1px solid black", padding: 25 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    color: "#dc2626", // Rojo para mantener la identidad visual
  },
  row: { flexDirection: "row", alignItems: "flex-end", marginBottom: 15 },
  label: { fontFamily: "Helvetica", fontSize: 10, marginRight: 5 },
  labelItalic: {
    fontFamily: "Helvetica-Oblique",
    fontSize: 10,
    marginRight: 5,
  },
  value: { fontFamily: "Helvetica-Bold", fontSize: 11 },
  line: {
    borderBottom: "1px dotted black",
    flexGrow: 1,
    marginLeft: 4,
    height: 10,
  },
});

export const TalonarioPDF = ({ data }) => (
  <Document>
    {/* Utilizamos media página A4 apaisada para simular el tamaño real de un pagaré */}
    <Page size="A5" orientation="landscape" style={styles.page}>
      <View style={styles.container}>
        {/* ENCABEZADO: Nº, Vencimiento y Monto */}
        <View style={styles.headerContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              width: "20%",
            }}
          >
            <Text style={styles.label}>Nº</Text>
            <View
              style={{
                border: "1px solid black",
                padding: 4,
                width: "100%",
                textAlign: "center",
              }}
            >
              <Text style={styles.value}>
                {data.numeroCuotaPaga} / {data.numeroCuotas}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              width: "45%",
            }}
          >
            <Text style={styles.label}>Vence el</Text>
            <Text style={styles.value}>{data.diaVencimiento} </Text>
            <Text style={styles.label}>de</Text>
            <Text style={styles.value}>{data.mesVencimiento} </Text>
            <Text style={styles.label}>de</Text>
            <Text style={styles.value}>{data.añoVencimiento} </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              width: "25%",
            }}
          >
            <Text style={styles.title}>POR $</Text>
            <Text style={[styles.value, { marginLeft: 5 }]}>{data.monto}</Text>
          </View>
        </View>

        {/* CUERPO DEL PAGARÉ */}
        <View style={styles.row}>
          <Text style={styles.label}>En San Juan, el</Text>
          <Text style={styles.value}>{data.diaVencimiento} </Text>
          <Text style={styles.label}>de</Text>
          <Text style={styles.value}>{data.mesVencimiento} </Text>
          <Text style={styles.label}>de</Text>
          <Text style={styles.value}>{data.añoVencimiento} </Text>
          <Text style={styles.labelItalic}>
            {" "}
            pagaré sin protesto (Art. 50 D. Ley 5965/63)
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>a Señor</Text>
          <Text style={styles.value}>
            {data.recibeNombreCompleto || data.empresaNombre}
          </Text>
          <View style={styles.line} />
          <Text style={styles.label}>a su orden</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>la cantidad de pesos</Text>
          <Text style={styles.value}>{numeroALetras(data.monto)}</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>por igual valor recibido en</Text>
          <Text style={styles.value}>{data.valorRecibidoen}</Text>
          <View style={styles.line} />
          <Text style={styles.label}>a</Text>
          <Text style={styles.value}>{data.empresaNombre} </Text>
          <Text style={styles.label}> entera satisfacción</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>pagadero en</Text>
          <Text style={styles.value}>{data.pagaderoEn}</Text>

          <View style={styles.line} />
        </View>

        {/* PIE DEL PAGARÉ (DATOS DEL FIRMANTE) */}
        <View style={{ marginTop: 15 }}>
          <View style={styles.row}>
            <Text style={styles.label}>Firmante:</Text>
            <Text style={styles.value}>
              {data.clienteNombre}{" "}
              {data.clienteDni ? `(DNI: ${data.clienteDni})` : ""}
            </Text>
            <View style={styles.line} />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Garante:</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Calle:</Text>
            <Text style={styles.value}>{data.clienteDomicilio}</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Localidad:</Text>
            <Text style={styles.value}>{data.clienteLocalidad}</Text>
            <View style={styles.line} />
            <Text style={styles.label}>Teléfono:</Text>
            <Text style={styles.value}>{data.clienteTel}</Text>
            <View style={styles.line} />
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
