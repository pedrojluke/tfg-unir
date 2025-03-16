import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { Alert, Platform } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { collections, db } from "../service/firebase";
import { useNavigation, useRoute } from "@react-navigation/native";

import { TEXTS } from "./pasoDetailMenuHelper";

export const usePasoDetailMenu = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pasoId, nombrePaso } = route.params;

  const handleNavigation = (screen, extraParams = {}) => {
    navigation.navigate(screen, { pasoId, ...extraParams });
  };

  const createPDF = async () => {
    try {
      const q = query(
        collection(db, collections.usuarios.name),
        where(
          collections.usuarios.rolField,
          collections.pasos.equals,
          collections.usuarios.rol
        ),
        where(collections.pasos.id, collections.pasos.equals, pasoId)
      );

      const querySnapshot = await getDocs(q);

      const costaleros = [];
      querySnapshot.forEach((doc) => {
        const { nombre, apellidos, altura } = doc.data();
        costaleros.push({ nombre, apellidos, altura });
      });

      costaleros.sort((a, b) => b.altura - a.altura);

      const htmlContent = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                background-color: #f8f9fa;
              }
              h1 {
                color: #343a40;
                text-align: center;
                margin-bottom: 30px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              }
              th, td {
                padding: 12px;
                text-align: left;
              }
              th {
                background-color: #007bff;
                color: white;
              }
              tr:nth-child(even) {
                background-color: #e9ecef;
              }
              tr:hover {
                background-color: #dee2e6;
              }
            </style>
          </head>
          <body>
            <h1>Costaleros del paso: ${nombrePaso}</h1>
            <table>
              <tr>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Altura (cm)</th>
              </tr>
              ${costaleros
                .map(
                  ({ nombre, apellidos, altura }) =>
                    `<tr>
                      <td>${nombre}</td>
                      <td>${apellidos}</td>
                      <td>${altura}</td>
                    </tr>`
                )
                .join("")}
            </table>
          </body>
        </html>`;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      if (Platform.OS === TEXTS.ios || Platform.OS === TEXTS.android) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert(TEXTS.pdfCreated, `${TEXTS.pdfPath} ${uri}`);
      }
    } catch (error) {
      Alert.alert(TEXTS.error, error.message);
    }
  };

  return { navigation, pasoId, nombrePaso, handleNavigation, createPDF };
};
