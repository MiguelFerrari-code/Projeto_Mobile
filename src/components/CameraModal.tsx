import React, { useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { CameraView } from 'expo-camera';
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

  const handleTakePicture = async () => {
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

  const getFlashLabel = () => {
    switch (flash) {
      case 'on':
        return 'Flash On';
      case 'auto':
        return 'Flash Auto';
      default:
        return 'Flash Off';
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.absoluteFill}>
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

              <TouchableOpacity style={styles.textButton} onPress={onClose} accessibilityLabel="Cancelar" accessibilityRole="button">
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    </Modal>
  );
};

    const { width, height } = Dimensions.get('window');

    const styles = StyleSheet.create({
      absoluteFill: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: width,
        height: height,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      },
      camera: {
        ...StyleSheet.absoluteFillObject,
        width: width,
        height: height,
      },
      overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 32,
        backgroundColor: 'rgba(0,0,0,0.12)',
      },
      controlsContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      },
      topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '40%',
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
