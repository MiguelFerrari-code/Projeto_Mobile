import React, { useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { CameraView } from 'expo-camera';

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
          <View style={styles.controlsContainer}>
            <View style={styles.row}>
              <TouchableOpacity style={styles.button} onPress={handleSwitchCamera}>
                <Text style={styles.buttonText}>Câmera {type === 'back' ? 'Frontal' : 'Traseira'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleToggleFlash}>
                <Text style={styles.buttonText}>{getFlashLabel()}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleTakePicture} disabled={isTakingPicture}>
              <Text style={styles.buttonText}>Tirar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
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
        paddingBottom: 40,
        backgroundColor: 'rgba(0,0,0,0.1)',
      },
      controlsContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      },
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
