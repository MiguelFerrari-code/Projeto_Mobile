import React, { useState } from 'react';
import CameraModal from '../../components/CameraModal';
import { Image as RNImage } from 'react-native';
const editIcon = require('../../assets/lapisEditar.png');
import { useMedicamentos } from '../../context/MedicamentoContext';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { styles } from './styles';

// Importando as imagens
const logoHeader = require('../../assets/LogoCadastro.png');

export function AdicionarMedicamento({ navigation }: any) {
  const { adicionarMedicamento } = useMedicamentos();
  const [nomeMedicamento, setNomeMedicamento] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [horarioPrimeiraDose, setHorarioPrimeiraDose] = useState('');
  const [intervaloHora, setIntervaloHora] = useState('');
  const [dosesPorDia, setDosesPorDia] = useState('');
  const [quantidadeTotal, setQuantidadeTotal] = useState('');
  const [quantidadeConsumida, setQuantidadeConsumida] = useState('');
  const [cameraVisible, setCameraVisible] = useState(false);
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  const handleSalvarMedicamento = () => {
    if (!nomeMedicamento || !dosagem || !horarioPrimeiraDose || !intervaloHora || !dosesPorDia || !quantidadeTotal || !quantidadeConsumida) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }
    adicionarMedicamento({
      nome: nomeMedicamento,
      dosagem: dosagem,
      horario: horarioPrimeiraDose,
      frequencia: `${dosesPorDia}x por dia`,
      quantidade: `${quantidadeConsumida}/${quantidadeTotal}`,
      cor: '#ffffffff',
      foto: fotoUri || undefined,
    });
    Alert.alert('Sucesso', 'Medicamento adicionado com sucesso!');
    navigation.goBack();
  };

  const handleCancelar = () => {
    navigation.goBack();
  };

  const handleTirarFoto = () => {
    setCameraVisible(true);
  };

  const handleFotoTirada = (uri: string) => {
    setFotoUri(uri);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancelar} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar Medicamento</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.subtitle}>Preencha os detalhes do seu novo medicamento.</Text>
          
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image source={logoHeader} style={styles.logo} />
          </View>

          {/* Foto ou botão de adicionar foto */}
          <View style={{ alignItems: 'center', marginVertical: 16 }}>
            {fotoUri ? (
              <View style={{ position: 'relative', width: 240, height: 240 }}>
                <RNImage source={{ uri: fotoUri }} style={{ width: 240, height: 240, borderRadius: 16, borderWidth: 1, borderColor: '#E0E0E0' }} />
                <TouchableOpacity
                  style={styles.editPhotoButton}
                  onPress={handleTirarFoto}
                  accessibilityLabel="Editar foto"
                  activeOpacity={0.7}
                >
                  <Text style={styles.editPhotoIcon}>📷</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.fotoButton} onPress={handleTirarFoto}>
                <Text style={styles.fotoIcon}>📷</Text>
                <Text style={styles.fotoButtonText}>Tirar Foto do Medicamento</Text>
              </TouchableOpacity>
            )}
          </View>
          <CameraModal
            visible={cameraVisible}
            onClose={() => setCameraVisible(false)}
            onPictureTaken={handleFotoTirada}
          />

          {/* Formulário */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nome do Medicamento</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex: Paracetamol"
              value={nomeMedicamento}
              onChangeText={setNomeMedicamento}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Dosagem</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex: 500mg"
              value={dosagem}
              onChangeText={setDosagem}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Horário da Primeira Dose</Text>
            <TextInput
              style={styles.textInput}
              placeholder="08:00"
              value={horarioPrimeiraDose}
              onChangeText={setHorarioPrimeiraDose}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Intervalo de Hora</Text>
            <TextInput
              style={styles.textInput}
              placeholder="24:00"
              value={intervaloHora}
              onChangeText={setIntervaloHora}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Doses por Dia</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex: 01"
              value={dosesPorDia}
              onChangeText={setDosesPorDia}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Quantidade Total na Cartela</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex: 20"
              value={quantidadeTotal}
              onChangeText={setQuantidadeTotal}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Quantidade Consumida</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex: 0"
              value={quantidadeConsumida}
              onChangeText={setQuantidadeConsumida}
              keyboardType="numeric"
            />
          </View>

          {/* Botões */}
          <TouchableOpacity style={styles.salvarButton} onPress={handleSalvarMedicamento}>
            <Text style={styles.salvarButtonText}>Salvar Medicamento</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelarButton} onPress={handleCancelar}>
            <Text style={styles.cancelarButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

