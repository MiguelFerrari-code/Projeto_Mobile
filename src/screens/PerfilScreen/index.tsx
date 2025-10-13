import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { styles } from './styles';
import { useAuth } from '../../context/auth';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../components';

// Importando as imagens
const mainIcone = require('../../assets/mainicone.png');
const mapaIcone = require('../../assets/mapaicone.png');
const perfilIcone = require('../../assets/perfilicone.png');

export function PerfilScreen() {
  const { user, logout } = useAuth();
  const drawerNavigation = useNavigation();

  // Estados para os campos do formulário, inicializados com os dados do usuário
  const [nomeCompleto, setNomeCompleto] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [senha, setSenha] = useState(user?.password || '');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleSair = () => {
    logout();
  };

  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
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
              <View style={styles.avatarIcon}>
                <View style={styles.avatarCircle}>
                  <View style={styles.avatarHead} />
                  <View style={styles.avatarBody} />
                </View>
              </View>
              <TouchableOpacity style={styles.cameraButton}>
                <Text style={styles.cameraIcon}>📷</Text>
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
                editable={false} // Campo não editável
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
                editable={false} // Campo não editável
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
                  secureTextEntry={!mostrarSenha} // Alterna a visibilidade da senha
                  editable={false} // Campo não editável
                />
                <TouchableOpacity
                  style={styles.olhoButton}
                  onPress={toggleMostrarSenha}
                >
                  <Text style={styles.olhoIcon}>{mostrarSenha ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.editButton} onPress={() => console.log("Editar perfil")} >
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sairButton} onPress={handleSair}>
              <Text style={styles.sairButtonText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
