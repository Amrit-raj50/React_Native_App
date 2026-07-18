import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [captureTime, setCaptureTime] = useState(null);
  const cameraRef = useRef(null);

  // Auto-request permission on mount if needed
  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    // Permission state is still loading
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E86DE" />
        <Text style={styles.loadingText}>Loading Camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={60} color="#7F8FA6" />
        <Text style={styles.permissionText}>
          We need your permission to access the camera for capturing survey photos.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        setCapturedPhoto(photo.uri);
        setCaptureTime(new Date().toLocaleString());
      } catch (error) {
        Alert.alert("Error", "Failed to take picture.");
      }
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setCaptureTime(null);
  };

  const deletePhoto = () => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setCapturedPhoto(null);
            setCaptureTime(null);
          },
        },
      ]
    );
  };

  if (capturedPhoto) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
        <View style={styles.metadataContainer}>
          <Ionicons name="time-outline" size={20} color="#FFFFFF" />
          <Text style={styles.captureTimeText}>{captureTime}</Text>
        </View>

        <View style={styles.previewActions}>
          <TouchableOpacity style={styles.actionButton} onPress={retakePhoto}>
            <Ionicons name="refresh" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={deletePhoto}
          >
            <Ionicons name="trash" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        ref={cameraRef}
        onCameraReady={() => setIsCameraReady(true)}
      >
        {!isCameraReady && (
          <View style={styles.cameraLoading}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        )}
        
        <View style={styles.cameraOverlay}>
          <View style={styles.bottomControls}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F6FA",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#7F8FA6",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F6FA",
  },
  permissionText: {
    textAlign: "center",
    fontSize: 16,
    color: "#2F3640",
    marginVertical: 20,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: "#2E86DE",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  camera: {
    flex: 1,
  },
  cameraLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bottomControls: {
    padding: 30,
    alignItems: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  previewImage: {
    flex: 1,
    resizeMode: "contain",
  },
  metadataContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 8,
  },
  captureTimeText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 10,
  },
  previewActions: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: "rgba(225, 95, 65, 0.9)",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});