import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import CameraModal from '../../components/CameraModal';
import { styles } from './styles';
import { useAuth } from '../../context/auth';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../components';
import { useImageUpload } from '../../hooks/useImageUpload';

export function PerfilScreen() {
  const { user, logout, updateProfile } = useAuth();
  const drawerNavigation = useNavigation();
  const { uploadFromUri, uploading } = useImageUpload('user-uploads', 'avatars');

  const [nomeCompleto, setNomeCompleto] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [senha, setSenha] = useState(user?.password || '');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState<string | null>(user?.avatarUrl ?? null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);

  const handleSair = () => {
    logout();
  };

  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const handleOpenCamera = () => {
    setCameraVisible(true);
  };

  const handlePhotoTaken = async (uri: string) => {
    if (!user) {
      return;
    }

    setIsSavingPhoto(true);

    try {
      const { publicUrl } = await uploadFromUri(uri, 'user-uploads', 'avatars');
      const success = await updateProfile({ avatarUrl: publicUrl });

      if (!success) {
        throw new Error('Falha ao atualizar perfil.');
      }

      setProfilePhoto(publicUrl);
    } catch (error) {
      console.error('Erro ao salvar foto de perfil:', error);
      Alert.alert('Erro', 'Não foi possível salvar a foto de perfil. Tente novamente.');
    } finally {
      setIsSavingPhoto(false);
      setCameraVisible(false);
    }
  };

  const handleCloseCamera = () => {
    setCameraVisible(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Header title="PERFIL" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.perfilContainer}>
          <View style={styles.fotoPerfilContainer}>
            <View style={styles.fotoPerfil}>
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={{ width: 100, height: 100, borderRadius: 50 }} />
              ) : (
                <View style={styles.avatarIcon}>
                  <Ionicons name="person" size={64} color="#9E9E9E" />
                </View>
              )}

              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handleOpenCamera}
                accessibilityLabel="Adicionar ou editar foto de perfil"
                accessibilityRole="button"
                disabled={uploading || isSavingPhoto}
              >
                {uploading || isSavingPhoto ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Ionicons name="camera" size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.usuarioContainer}>
            <Text style={styles.usuarioText}>{user?.name || 'Usuário'}</Text>
          </View>

          <View style={styles.formularioContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nome Completo</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ex: Raimundo Donatto"
                value={nomeCompleto}
                onChangeText={setNomeCompleto}
                editable={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ex: idoso123@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                editable={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Senha</Text>
              <View style={styles.senhaContainer}>
                <TextInput
                  style={styles.senhaInput}
                  placeholder="Ex: ****************"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!mostrarSenha}
                  editable={false}
                />
                <TouchableOpacity style={styles.olhoButton} onPress={toggleMostrarSenha}>
                  <Ionicons name={mostrarSenha ? 'eye-off' : 'eye'} size={22} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.editButton} onPress={() => console.log('Editar perfil')}>
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sairButton} onPress={handleSair}>
              <Text style={styles.sairButtonText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <CameraModal visible={cameraVisible} onClose={handleCloseCamera} onPictureTaken={handlePhotoTaken} />
    </KeyboardAvoidingView>
  );
}
