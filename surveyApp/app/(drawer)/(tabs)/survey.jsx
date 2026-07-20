import React, { useState, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import * as Clipboard from 'expo-clipboard';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInUp, ZoomIn } from "react-native-reanimated";
import { ThemeContext } from "../../../context/ThemeContext";

export default function Survey() {
  const router = useRouter();
  const { colors } = useContext(ThemeContext);

  const [siteName, setSiteName] = useState("");
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [photoUri, setPhotoUri] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [date] = useState(new Date().toLocaleDateString());
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  
  // Camera State
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [facing, setFacing] = useState("back");
  const cameraRef = useRef(null);

  const handleGetLocation = async () => {
    setFetchingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Allow location access to use this feature.");
        setFetchingLocation(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = loc.coords;

      try {
        let geocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (geocode && geocode.length > 0) {
          const g = geocode[0];
          const address = g.formattedAddress || [
            g.name, g.streetNumber, g.street, g.district,
            g.city, g.region, g.postalCode, g.country
          ].filter(Boolean);
          
          const fullAddress = Array.isArray(address) ? [...new Set(address)].join(", ") : address;
          setSiteName(fullAddress);
        } else {
          // Fallback to Nominatim API
          await fetchFallbackAddress(latitude, longitude);
        }
      } catch (_err) {
        // Fallback if expo-location reverse geocoding throws an error
        await fetchFallbackAddress(latitude, longitude);
      }

    } catch (_error) {
      Alert.alert("Error", "Failed to get current location");
    } finally {
      setFetchingLocation(false);
    }
  };

  const fetchFallbackAddress = async (lat, lon) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await response.json();
      if (data && data.display_name) {
        setSiteName(data.display_name);
      } else {
        setSiteName(`Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`);
      }
    } catch (_e) {
      setSiteName(`Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`);
    }
  };

  const pasteContact = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) {
      setContactNumber(text);
    }
  };

  const openCamera = async () => {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert("Permission Denied", "Camera access is required to take photos.");
        return;
      }
    }
    setCameraVisible(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        setPhotoUri(photo.uri);
        setCameraVisible(false);
      } catch (_error) {
        Alert.alert("Error", "Failed to take picture.");
      }
    }
  };

  const savePhoto = async () => {
    if (!mediaPermission?.granted) {
      const p = await requestMediaPermission();
      if (!p.granted) {
        Alert.alert("Permission Denied", "We need permission to save photos to your gallery.");
        return;
      }
    }
    try {
      await MediaLibrary.saveToLibraryAsync(photoUri);
      Alert.alert("Success", "Photo saved to gallery!");
    } catch (_error) {
      Alert.alert("Error", "Failed to save photo.");
    }
  };

  const handlePreview = () => {
    if (!siteName.trim() || !clientName.trim() || !description.trim()) {
      Alert.alert("Validation Error", "Please fill out Site Name, Client Name, and Description.");
      return;
    }
    if (!photoUri) {
      Alert.alert("Validation Error", "Please capture a photo for the survey.");
      return;
    }
    setPreviewVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const newSurvey = {
        id: Date.now().toString(),
        siteName,
        clientName,
        description,
        contactNumber,
        photoUri,
        priority,
        date,
      };

      const existingSurveys = await AsyncStorage.getItem('surveys');
      const surveys = existingSurveys ? JSON.parse(existingSurveys) : [];
      surveys.push(newSurvey);
      await AsyncStorage.setItem('surveys', JSON.stringify(surveys));

      setPreviewVisible(false);
      Alert.alert(
        "Survey Created",
        "Your survey has been successfully created.",
        [{ text: "OK", onPress: () => {
          setSiteName("");
          setClientName("");
          setDescription("");
          setContactNumber("");
          setPhotoUri("");
          setPriority("Medium");
          router.push("/history");
        }}]
      );
    } catch (_error) {
      Alert.alert("Error", "Failed to save survey");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Create New Survey</Text>
        </View>
        
        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Site Name / Location *</Text>
          <View style={styles.rowContainer}>
            <TextInput
              style={[
                styles.input, styles.flexInput, 
                { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }
              ]}
              placeholder="Enter site name or fetch location"
              placeholderTextColor={colors.placeholder}
              value={siteName}
              onChangeText={setSiteName}
            />
            <TouchableOpacity 
              style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]} 
              onPress={handleGetLocation}
            >
              {fetchingLocation ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons name="location" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Client Name *</Text>
          <TextInput
            style={[
              styles.input, 
              { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }
            ]}
            placeholder="Enter client name"
            placeholderTextColor={colors.placeholder}
            value={clientName}
            onChangeText={setClientName}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Contact Number</Text>
          <View style={styles.rowContainer}>
            <TextInput
              style={[
                styles.input, styles.flexInput, 
                { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }
              ]}
              placeholder="Paste contact number"
              placeholderTextColor={colors.placeholder}
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="phone-pad"
            />
            <TouchableOpacity 
              style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]} 
              onPress={pasteContact}
            >
              <Ionicons name="clipboard" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Description / Notes *</Text>
          <TextInput
            style={[
              styles.input, styles.textArea, 
              { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }
            ]}
            placeholder="Enter survey description"
            placeholderTextColor={colors.placeholder}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </Animated.View>

        {/* Photo Capture Section */}
        <Animated.View entering={FadeInUp.delay(500).duration(400)} style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Survey Photo *</Text>
          {photoUri ? (
            <View style={[styles.photoContainer, { borderColor: colors.border }]}>
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
              <View style={styles.photoActions}>
                <TouchableOpacity 
                  style={[styles.photoActionBtn, { backgroundColor: '#2E86DE' }]}
                  onPress={savePhoto}
                >
                  <Ionicons name="download-outline" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.photoActionBtn, { backgroundColor: colors.danger, marginLeft: 10 }]}
                  onPress={() => setPhotoUri("")}
                >
                  <Ionicons name="trash" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.photoBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={openCamera}
            >
              <Ionicons name="camera" size={32} color={colors.primary} />
              <Text style={[styles.photoBtnText, { color: colors.subText }]}>Capture Photo</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(600).duration(400)} style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
          <View style={styles.priorityContainer}>
            {["Low", "Medium", "High"].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.priorityBadge,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  priority === item && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => setPriority(item)}
              >
                <Text
                  style={[
                    styles.priorityText,
                    { color: colors.text },
                    priority === item && { color: '#FFFFFF' },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Date</Text>
          <TextInput
            style={[
              styles.input, 
              { backgroundColor: colors.card, borderColor: colors.border, color: colors.text, opacity: 0.7 }
            ]}
            value={date}
            editable={false}
          />
        </View>

        <TouchableOpacity 
          style={[styles.previewButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]} 
          onPress={handlePreview}
        >
          <Text style={styles.previewButtonText}>Preview Survey</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Camera Modal */}
      <Modal visible={cameraVisible} animationType="slide" transparent={false}>
        <View style={styles.cameraContainer}>
          {cameraPermission?.granted && (
            <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
              <View style={styles.cameraOverlay}>
                <View style={styles.topCameraControls}>
                  <TouchableOpacity 
                    style={styles.closeCameraBtn}
                    onPress={() => setCameraVisible(false)}
                  >
                    <Ionicons name="close" size={30} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.flipCameraBtn}
                    onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}
                  >
                    <Ionicons name="camera-reverse-outline" size={28} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                <View style={styles.bottomControls}>
                  <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                    <View style={styles.captureButtonInner} />
                  </TouchableOpacity>
                </View>
              </View>
            </CameraView>
          )}
        </View>
      </Modal>

      {/* Preview Modal */}
      <Modal visible={previewVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <Animated.View entering={ZoomIn.duration(400)} style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Survey Preview</Text>
            
            <ScrollView style={styles.previewScroll}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.modalPhotoPreview} />
              ) : null}
              <View style={[styles.previewRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.previewLabel, { color: colors.subText }]}>Site Location:</Text>
                <Text style={[styles.previewValue, { color: colors.text }]}>{siteName}</Text>
              </View>
              <View style={[styles.previewRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.previewLabel, { color: colors.subText }]}>Client Name:</Text>
                <Text style={[styles.previewValue, { color: colors.text }]}>{clientName}</Text>
              </View>
              <View style={[styles.previewRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.previewLabel, { color: colors.subText }]}>Contact:</Text>
                <Text style={[styles.previewValue, { color: colors.text }]}>{contactNumber || 'N/A'}</Text>
              </View>
              <View style={[styles.previewRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.previewLabel, { color: colors.subText }]}>Priority:</Text>
                <Text style={[
                  styles.previewValue, 
                  { color: priority === 'High' ? colors.danger : priority === 'Medium' ? '#F5A623' : colors.secondary }
                ]}>
                  {priority}
                </Text>
              </View>
              <View style={[styles.previewRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.previewLabel, { color: colors.subText }]}>Date:</Text>
                <Text style={[styles.previewValue, { color: colors.text }]}>{date}</Text>
              </View>
              <View style={styles.previewRowColumn}>
                <Text style={[styles.previewLabel, { color: colors.subText }]}>Notes:</Text>
                <Text style={[styles.previewValueNotes, { color: colors.text }]}>{description}</Text>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.editButton, { backgroundColor: colors.background, borderColor: colors.border }]} 
                onPress={() => setPreviewVisible(false)}
              >
                <Text style={[styles.editButtonText, { color: colors.text }]}>Edit Survey</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton, { backgroundColor: colors.secondary }]} 
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Submit Survey</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  backButton: {
    marginRight: 15,
    padding: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  flexInput: {
    flex: 1,
  },
  iconBtn: {
    padding: 14,
    marginLeft: 12,
    borderWidth: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  photoBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 16,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoBtnText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  photoContainer: {
    borderWidth: 1,
    borderRadius: 16,
    height: 200,
    overflow: 'hidden',
    position: 'relative',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoActions: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
  },
  photoActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityBadge: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 5,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: "700",
  },
  previewButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 25,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  previewButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  topCameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  closeCameraBtn: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  flipCameraBtn: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
  },
  bottomControls: {
    alignItems: 'center',
    marginBottom: 40,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 24,
    padding: 25,
    maxHeight: '85%',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 25,
    textAlign: 'center',
  },
  previewScroll: {
    marginBottom: 25,
  },
  modalPhotoPreview: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  previewRow: {
    flexDirection: 'row',
    marginBottom: 12,
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  previewRowColumn: {
    marginBottom: 10,
  },
  previewLabel: {
    fontSize: 15,
    fontWeight: '700',
    width: 120,
  },
  previewValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  previewValueNotes: {
    fontSize: 16,
    marginTop: 8,
    lineHeight: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  editButton: {
    borderWidth: 1,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
