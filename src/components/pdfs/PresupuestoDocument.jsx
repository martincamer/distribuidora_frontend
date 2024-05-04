import React from "react";
import { Document, Text, View, Page, Image, Font } from "@react-pdf/renderer";
import { v4 as uuidv4 } from "uuid";
import bold from "../../fonts/Roboto-Bold.ttf";
import normal from "../../fonts/Roboto-Light.ttf";
import medium from "../../fonts/Roboto-Medium.ttf";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: normal,
      fontWeight: "normal",
    },
    {
      src: medium,
      fontWeight: "medium",
    },
    {
      src: bold,
      fontWeight: "bold",
    },
  ],
});

// Obtener la fecha actual
const fechaActual = new Date();

// Obtener el día de la semana (0 para domingo, 1 para lunes, ..., 6 para sábado)
const diaDeLaSemana = fechaActual.getDay();

// Obtener el día del mes
const diaDelMes = fechaActual.getDate();

// Obtener el mes (0 para enero, 1 para febrero, ..., 11 para diciembre)
const mes = fechaActual.getMonth();

// Obtener el año
const ano = fechaActual.getFullYear();

// Días de la semana en español
const diasSemana = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

// Meses en español
const meses = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export const PresupuestoDocument = ({ datos, user }) => {
  // Función para generar un número aleatorio de N dígitos
  const getRandomDigits = (numDigits) => {
    const min = Math.pow(10, numDigits - 1); // Mínimo número con el número de dígitos
    const max = Math.pow(10, numDigits) - 1; // Máximo número con el número de dígitos
    return Math.floor(Math.random() * (max - min + 1)) + min; // Genera un número aleatorio dentro del rango
  };

  // Función para generar el número de factura en formato 'XXXX-YYYYYY'
  const generateInvoiceNumber = () => {
    const prefix = getRandomDigits(4); // Cuatro dígitos para el prefijo
    const randomSuffix = getRandomDigits(6); // Seis dígitos para el sufijo
    return `${prefix}-${randomSuffix}`; // Combina el prefijo y el sufijo
  };
  const invoiceNumber = generateInvoiceNumber();

  return (
    <Document
      style={{
        zIndex: "100",
      }}
    >
      <Page
        size="A4"
        style={{
          padding: "30px 50px",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: "120px",
            }}
            src={user.imagen_facturacion}
          />
          <View>
            <Text
              style={{
                fontFamily: "Roboto",
                fontWeight: "bold",
              }}
            >
              Presupuesto
            </Text>
            <Text
              style={{
                fontFamily: "Roboto",
                fontWeight: "medium",
                fontSize: 12,
              }}
            >
              N ° {invoiceNumber}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: "10px" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Datos de la empresa
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "16px",
              }}
            >
              <View>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  Nombre{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "medium",
                    fontSize: "12px",
                  }}
                >
                  {user.username}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  Dni{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "medium",
                    fontSize: "12px",
                  }}
                >
                  {user.dni_facturacion}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  Telefono{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "medium",
                    fontSize: "12px",
                  }}
                >
                  {user.telefono_facturacion}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  Localidad{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "medium",
                    fontSize: "12px",
                  }}
                >
                  {user.localidad_facturacion}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  Provincia{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "medium",
                    fontSize: "12px",
                  }}
                >
                  {user.provincia_facturacion}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  Email{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "medium",
                    fontSize: "12px",
                  }}
                >
                  {user.email_facturacion}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ marginTop: "20px" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              border: "1px solid #000",
              padding: "10px 15px",
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Datos del cliente
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <View>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  Nombre/Apellido{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "medium",
                    fontSize: "12px",
                  }}
                >
                  {datos?.cliente?.nombre + " " + datos?.cliente?.apellido}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  Dni{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "medium",
                    fontSize: "12px",
                  }}
                >
                  {datos?.cliente?.dni}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  Telefono{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "medium",
                    fontSize: "12px",
                  }}
                >
                  {datos?.cliente?.telefono}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  Localidad{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "medium",
                    fontSize: "12px",
                  }}
                >
                  {datos?.cliente?.localidad}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  Provincia{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "medium",
                    fontSize: "12px",
                  }}
                >
                  {datos?.cliente?.provincia}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  Email{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "medium",
                    fontSize: "12px",
                  }}
                >
                  {datos?.cliente?.email}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: "20px",
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "Roboto",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Productos
            </Text>
          </View>

          <View>
            <View></View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
