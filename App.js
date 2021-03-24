import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, Button } from "react-native";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null); //estado para ver se a permissão foi aceita ou não.
  const [faces, setFaces] = useState([]);
  const [olhos, setOlhos] = useState();

  //Função para verificar se os olhos estão abertos ou fechados
  function olhofechado(provabilidade) {
    if (provabilidade < 0.021) {
      console.log(` teve ${provabilidade} estar com o olho fechado`);
      setOlhos(false);
    } else {
      setOlhos(true);
    }
  }

  //função da lib facedetector
  const faceDetected = ({ faces }) => {
    setFaces(faces);
    // console.log(faces);

    //pegar um item de um arrey (parametro da função)
    //Mapear cada elemento, e aplicar essa função. Retornando um novo arrey com a mesma quantidade (no caso 1 único item)
    var item = faces.map((face) => face.rightEyeOpenProbability);

    //converte o arrey em um único item
    if (item.length > 0) {
      item = item[0];
      console.log(item);
      console.log("entrou aqui");

      // Verifica se esta com os olhos fechados
      olhofechado(item);
      console.log(olhos);
    }
  };

  //utilizar um ciclio de vida de componentes: Quando ele abrir o app a primeira vez, dispare essa ação.
  // será na primeira vez
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync(); //Pegue o estatus desse retorno
      setHasPermission(status === "granted");
    })();
  }, []); //Com o arrey esta vazio, quando abrir o app vai ser executada

  //Se for igual a null ou false é pq o usuário negou, então n pode usar a camera.
  if (hasPermission !== true) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={{ flex: 1 }}
        type="front"
        onFacesDetected={faceDetected}
        faceDetectorSettings={{
          mode: FaceDetector.Constants.Mode.fast,
          detectLandmarks: FaceDetector.Constants.Landmarks.all,
          runClassifications: FaceDetector.Constants.Classifications.all,
          minDetectionInterval: 1000,
          tracking: true,
        }}
      />
      {faces.map((faces) => (
        <Text key={faces.rightEyeOpenProbability}>
          {faces.rightEyeOpenProbability}
        </Text>
      ))}
      <Text>{olhos ? "olhos abertos" : "olhos fechados"}</Text>
      <Button title="Mostrar msg" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
