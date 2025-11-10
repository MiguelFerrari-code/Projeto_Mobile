import React, { useState, useEffect } from 'react';
import CameraModal from '../../components/CameraModal';
import { Image as RNImage } from 'react-native';
import { useMedicamentos } from '../../context/MedicamentoContext';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { styles } from './styles';
import { useImageUpload } from '../../hooks/useImageUpload';

// Importando as imagens
const logoHeader = require('../../assets/LogoCadastro.png');
const PLACEHOLDER_COLOR = '#9EA3B4';

export function EditarMedicamento({ navigation, route }: any) {
  const { medicamentos, editarMedicamento } = useMedicamentos();
  const { uploadFromUri, uploading } = useImageUpload('medicamento_upload', 'medicamentos');
  const medicamentoId = route?.params?.medicamento?.id;
  const medicamentoExistente = medicamentos.find(med => med.id === medicamentoId);

  const [nomeMedicamento, setNomeMedicamento] = useState(medicamentoExistente?.nome || '');
  const [dosagem, setDosagem] = useState(medicamentoExistente?.dosagem || '');
  const [horarioPrimeiraDose, setHorarioPrimeiraDose] = useState(medicamentoExistente?.horario || '');
  const [intervaloHora, setIntervaloHora] = useState(''); // Não temos intervalo no mock
  const [dosesPorDia, setDosesPorDia] = useState(
    medicamentoExistente?.dosesDia || medicamentoExistente?.frequencia.split('x')[0]?.trim() || ''
  );
  const [quantidadeTotal, setQuantidadeTotal] = useState(
    medicamentoExistente?.quantidadeTotal?.toString() || ''
  );
  const [quantidadeConsumida, setQuantidadeConsumida] = useState(
    medicamentoExistente?.quantidadeConsumida?.toString() || ''
  );
  const [cameraVisible, setCameraVisible] = useState(false);
  const [fotoUri, setFotoUri] = useState<string | null>(medicamentoExistente?.fotoUri || null);
  const [isLocalPhoto, setIsLocalPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isProcessing = isSaving || uploading;

  useEffect(() => {
    if (medicamentoExistente) {
      setNomeMedicamento(medicamentoExistente.nome);
      setDosagem(medicamentoExistente.dosagem);
      setHorarioPrimeiraDose(medicamentoExistente.horario);
      const frequenciaSplit = medicamentoExistente.frequencia.split('x')[0];
      setDosesPorDia(medicamentoExistente.dosesDia || frequenciaSplit?.trim() || '');
      setQuantidadeConsumida(medicamentoExistente.quantidadeConsumida.toString());
      setQuantidadeTotal(medicamentoExistente.quantidadeTotal.toString());
      setFotoUri(medicamentoExistente.fotoUri ?? null);
      setIsLocalPhoto(false);
    }
  }, [medicamentoExistente]);

  const handleSalvarMedicamento = async () => {
    if (!medicamentoExistente) {
      Alert.alert('Erro', 'Medicamento não encontrado para edição.');
      return;
    }
    if (!nomeMedicamento || !dosagem || !horarioPrimeiraDose || !dosesPorDia || !quantidadeConsumida || !quantidadeTotal) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }
    setIsSaving(true);
    try {
      let fotoPublicUrl: string | undefined;

      if (fotoUri) {
        if (isLocalPhoto || fotoUri.startsWith('file:')) {
          const { publicUrl } = await uploadFromUri(fotoUri);
          fotoPublicUrl = publicUrl;
        } else {
          fotoPublicUrl = fotoUri;
        }
      }

      await editarMedicamento(medicamentoExistente.id, {
        nome: nomeMedicamento,
        dosagem,
        horario: horarioPrimeiraDose,
        frequencia: `${dosesPorDia}x por dia`,
        quantidadeConsumida: Number(quantidadeConsumida),
        quantidadeTotal: Number(quantidadeTotal),
        dosesDia: dosesPorDia,
        fotoUri: fotoPublicUrl,
        cor: medicamentoExistente.cor,
      });
      setIsLocalPhoto(false);
      Alert.alert('Sucesso', 'Medicamento editado com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao editar medicamento:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o medicamento.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelar = () => {
    navigation.goBack();
  };

  const handleTirarFoto = () => {
    setCameraVisible(true);
  };

  const handleFotoTirada = (uri: string) => {
    setFotoUri(uri);
    setIsLocalPhoto(true);
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
        <Text style={styles.headerTitle}>Editar Medicamento</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.subtitle}>Edite os detalhes do seu medicamento.</Text>
          
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image source={logoHeader} style={styles.logo} />
          </View>

          {/* Foto ou botão de adicionar foto (padrão AdicionarMedicamento) */}
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
              placeholderTextColor={PLACEHOLDER_COLOR}
              value={nomeMedicamento}
              onChangeText={setNomeMedicamento}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Dosagem</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex: 500mg"
              placeholderTextColor={PLACEHOLDER_COLOR}
              value={dosagem}
              onChangeText={setDosagem}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Horário da Primeira Dose</Text>
            <TextInput
              style={styles.textInput}
              placeholder="08:00"
              placeholderTextColor={PLACEHOLDER_COLOR}
              value={horarioPrimeiraDose}
              onChangeText={setHorarioPrimeiraDose}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Intervalo de Hora</Text>
            <TextInput
              style={styles.textInput}
              placeholder="24:00"
              placeholderTextColor={PLACEHOLDER_COLOR}
              value={intervaloHora}
              onChangeText={setIntervaloHora}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Doses por Dia</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex: 01"
              placeholderTextColor={PLACEHOLDER_COLOR}
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
              placeholderTextColor={PLACEHOLDER_COLOR}
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
              placeholderTextColor={PLACEHOLDER_COLOR}
              value={quantidadeConsumida}
              onChangeText={setQuantidadeConsumida}
              keyboardType="numeric"
            />
          </View>

          {/* Botões */}
          <TouchableOpacity
            style={[styles.salvarButton, isProcessing && { opacity: 0.7 }]}
            onPress={handleSalvarMedicamento}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.salvarButtonText}>Salvar Medicamento</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelarButton} onPress={handleCancelar}>
            <Text style={styles.cancelarButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
