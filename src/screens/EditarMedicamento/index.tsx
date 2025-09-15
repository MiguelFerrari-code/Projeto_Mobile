import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { styles } from './styles';

// Importando as imagens
const logoHeader = require('../../assets/LogoCadastro.png');

export function EditarMedicamento({ navigation, route }: any) {
  // Dados do medicamento que podem vir via parâmetros da navegação
  const medicamentoData = route?.params?.medicamento || {};
  
  const [nomeMedicamento, setNomeMedicamento] = useState(medicamentoData.nome || 'Paracetamol');
  const [dosagem, setDosagem] = useState(medicamentoData.dosagem || '500mg');
  const [horarioPrimeiraDose, setHorarioPrimeiraDose] = useState(medicamentoData.horario || '08:00');
  const [intervaloHora, setIntervaloHora] = useState(medicamentoData.intervalo || '24:00');
  const [dosesPorDia, setDosesPorDia] = useState(medicamentoData.doses || '01');

  const handleSalvarMedicamento = () => {
    if (!nomeMedicamento || !dosagem || !horarioPrimeiraDose || !intervaloHora || !dosesPorDia) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }
    
    // Aqui você pode implementar a lógica para salvar as alterações do medicamento
    Alert.alert('Sucesso', 'Medicamento editado com sucesso!');
    navigation.goBack();
  };

  const handleCancelar = () => {
    navigation.goBack();
  };

  const handleTirarFoto = () => {
    Alert.alert('Foto', 'Funcionalidade de tirar foto será implementada');
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
          <Text style={styles.subtitle}>Preencha os detalhes do seu novo medicamento.</Text>
          
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image source={logoHeader} style={styles.logo} />
          </View>

          {/* Botão Tirar Foto */}
          <TouchableOpacity style={styles.fotoButton} onPress={handleTirarFoto}>
            <Text style={styles.fotoIcon}>📷</Text>
            <Text style={styles.fotoButtonText}>Tirar Foto do Medicamento</Text>
          </TouchableOpacity>

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

