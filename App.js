import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null); //estado para ver se a permissão foi aceita ou não.
  const [faces, setFaces] = useState([]);

  const faceDetected = ({ faces }) => {
    setFaces(faces);
    console.log({ faces }); // ou (faces)
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
        FaceDetectorSettings={{
          mode: FaceDetector.Constants.Mode.fast,
          detectLandmarks: FaceDetector.Constants.Landmarks.all,
          runClassifications: FaceDetector.Constants.Classifications.all,
          minDetectionInterval: 10000,
          tracking: false,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
