import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

interface CameraModalProps {
  visible: boolean;
  onClose: () => void;
  onPictureTaken: (uri: string) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ visible, onClose, onPictureTaken }) => {
  const cameraRef = useRef<any>(null);
  const [type, setType] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('off');
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const ensurePermission = async () => {
    if (permission?.granted) {
      return true;
    }
    if (permission?.canAskAgain !== false && !isRequestingPermission) {
      try {
        setIsRequestingPermission(true);
        const result = await requestPermission();
        return result?.granted ?? false;
      } finally {
        setIsRequestingPermission(false);
      }
    }
    return false;
  };

  const handleTakePicture = async () => {
    const hasPermission = await ensurePermission();
    if (!hasPermission) {
      return;
    }

    if (cameraRef.current && !isTakingPicture) {
      setIsTakingPicture(true);
      try {
        const photo = await cameraRef.current.takePictureAsync();
        onPictureTaken(photo.uri);
        onClose(); // Fecha o modal automaticamente após tirar a foto
      } catch (e) {
        // handle error
      } finally {
        setIsTakingPicture(false);
      }
    }
  };

  const handleSwitchCamera = () => {
    setType((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const handleToggleFlash = () => {
    setFlash((prev) =>
      prev === 'off' ? 'on' : prev === 'on' ? 'auto' : 'off'
    );
  };

  const cameraReady = permission?.granted;
  const showPermissionPrompt = !cameraReady;

  useEffect(() => {
    if (visible) {
      ensurePermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      presentationStyle="fullScreen"
      hardwareAccelerated
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {cameraReady ? (
          <>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={type}
              flash={flash}
            />
            <View style={styles.overlay} pointerEvents="box-none">
              <View style={styles.controlsContainer} pointerEvents="box-none">
                <View style={styles.topRow}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handleSwitchCamera}
                    accessibilityLabel="Alternar câmera"
                    accessibilityRole="button"
                  >
                    <Ionicons name={type === 'back' ? 'camera-reverse' : 'camera'} size={22} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handleToggleFlash}
                    accessibilityLabel="Alternar flash"
                    accessibilityRole="button"
                  >
                    <Ionicons
                      name={
                        flash === 'on'
                          ? 'flash'
                          : flash === 'auto'
                          ? 'flash-outline'
                          : 'flash-off'
                      }
                      size={22}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.captureButton, isTakingPicture && { opacity: 0.7 }]}
                  onPress={handleTakePicture}
                  disabled={isTakingPicture}
                  accessibilityLabel="Tirar foto"
                  accessibilityRole="button"
                >
                  <View style={styles.captureInner} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.textButton}
                  onPress={onClose}
                  accessibilityLabel="Cancelar"
                  accessibilityRole="button"
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.permissionWrapper}>
            {isRequestingPermission ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <>
                <Ionicons name="camera" size={48} color="#fff" style={{ marginBottom: 16 }} />
                <Text style={styles.permissionTitle}>Precisamos da sua permissão</Text>
                <Text style={styles.permissionText}>
                  O aplicativo precisa acessar a câmera para tirar fotos do medicamento.
                </Text>
                <TouchableOpacity
                  style={styles.permissionButton}
                  onPress={ensurePermission}
                  accessibilityRole="button"
                  accessibilityLabel="Permitir acesso à câmera"
                >
                  <Text style={styles.permissionButtonText}>Permitir acesso</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.textButton}
                  onPress={onClose}
                  accessibilityRole="button"
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: Platform.OS === 'android' ? 32 : 48,
    paddingTop: 24,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  controlsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '45%',
    maxWidth: 220,
    marginBottom: 12,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    backgroundColor: 'transparent',
  },
  captureInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
  },
  textButton: {
    marginTop: 8,
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
  },
  permissionWrapper: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  permissionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#3478f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 16,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // legacy styles (kept for backward compatibility if referenced elsewhere)
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3478f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default CameraModal;
