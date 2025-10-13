import React, { useState, useEffect } from 'react';
import { useMedicamentos } from '../../context/MedicamentoContext';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { styles } from './styles';

// Importando as imagens
const logoHeader = require('../../assets/LogoCadastro.png');

export function EditarMedicamento({ navigation, route }: any) {
  const { medicamentos, editarMedicamento } = useMedicamentos();
  const medicamentoId = route?.params?.medicamento?.id;
  const medicamentoExistente = medicamentos.find(med => med.id === medicamentoId);

  const [nomeMedicamento, setNomeMedicamento] = useState(medicamentoExistente?.nome || '');
  const [dosagem, setDosagem] = useState(medicamentoExistente?.dosagem || '');
  const [horarioPrimeiraDose, setHorarioPrimeiraDose] = useState(medicamentoExistente?.horario || '');
  const [intervaloHora, setIntervaloHora] = useState(''); // Não temos intervalo no mock
  const [dosesPorDia, setDosesPorDia] = useState(medicamentoExistente?.frequencia.split('x')[0].trim() || '');

  useEffect(() => {
    if (medicamentoExistente) {
      setNomeMedicamento(medicamentoExistente.nome);
      setDosagem(medicamentoExistente.dosagem);
      setHorarioPrimeiraDose(medicamentoExistente.horario);
      setDosesPorDia(medicamentoExistente.frequencia.split('x')[0].trim());
    }
  }, [medicamentoExistente]);

  const handleSalvarMedicamento = () => {
    if (!medicamentoExistente) {
      Alert.alert('Erro', 'Medicamento não encontrado para edição.');
      return;
    }

    editarMedicamento({
      id: medicamentoExistente.id,
      nome: nomeMedicamento,
      dosagem: dosagem,
      horario: horarioPrimeiraDose,
      frequencia: `${dosesPorDia}x por dia`,
      quantidade: medicamentoExistente.quantidade, // Manter a quantidade existente
      cor: medicamentoExistente.cor // Manter a cor existente
    });
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
          <Text style={styles.subtitle}>Edite os detalhes do seu medicamento.</Text>
          
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

