import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { styles } from './styles';
import { useAuth } from '../../context/auth';
import { useMedicamentos } from '../../context/MedicamentoContext';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../components';
import Ionicons from '@expo/vector-icons/Ionicons';

// Importando as imagens
const perfilIcone = require('../../assets/perfilicone.png');
const mainIcone = require('../../assets/mainicone.png');
const mapaIcone = require('../../assets/mapaicone.png');

// Os dados dos medicamentos agora são gerenciados pelo MedicamentoContext

interface MainScreenProps {
  navigation?: any;
}

export function MainScreen({ navigation }: MainScreenProps) {
  const { medicamentos, excluirMedicamento, loading } = useMedicamentos();
  const { user, logout } = useAuth();
  const drawerNavigation = useNavigation();

  // Modal de visualização de medicamento
  const [selectedMedicamento, setSelectedMedicamento] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Funções de navegação
  const handleAdicionarMedicamento = () => {
    navigation?.navigate('AdicionarMedicamento');
  };
  const handleEditarMedicamento = (id: number) => {
    navigation?.navigate('EditarMedicamento', { medicamento: { id } });
  };
  const handleExcluirMedicamento = async (id: number) => {
    try {
      await excluirMedicamento(id);
    } catch (error) {
      console.error('Erro ao excluir medicamento:', error);
      Alert.alert('Erro', 'Não foi possível excluir o medicamento. Tente novamente.');
    }
  };

  // Visualizar medicamento
  const handleVisualizarMedicamento = (medicamento: any) => {
    setSelectedMedicamento(medicamento);
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedMedicamento(null);
  };

  // Lógica para próxima dose dinâmica
  function parseHorario(horario: string): number {
    // Aceita formato HH:mm
    const [h, m] = horario.split(':').map(Number);
    return h * 60 + m;
  }

  const proximaDose = useMemo(() => {
    if (medicamentos.length === 0) {
      return null;
    }

    return [...medicamentos].sort((a, b) => parseHorario(a.horario) - parseHorario(b.horario))[0];
  }, [medicamentos]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="AGENDA" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Próxima Dose */}
        <View style={styles.proximaDoseContainer}>
          <Text style={styles.proximaDoseTitle}>Próxima Dose</Text>
          {proximaDose ? (
            <Text style={styles.proximaDoseSubtitle}>
              {proximaDose.nome} às {proximaDose.horario}
            </Text>
          ) : (
            <Text style={styles.proximaDoseSubtitle}>
              Nenhum medicamento cadastrado
            </Text>
          )}
        </View>

        {/* Seus Medicamentos */}
        <View style={styles.medicamentosHeader}>
          <Text style={styles.medicamentosTitle}>Seus Medicamentos:</Text>
          <TouchableOpacity
            testID="add-button"
            style={styles.adicionarButton}
            onPress={handleAdicionarMedicamento}
          >
            <Text style={styles.adicionarIcon}>+</Text>
            <Text style={styles.adicionarText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Medicamentos */}
        <View style={styles.medicamentosList}>
          {medicamentos.map((medicamento) => {
            const quantidadeLabel = `${medicamento.quantidadeConsumida}/${medicamento.quantidadeTotal}`;
            return (
              <TouchableOpacity
                key={medicamento.id}
                style={[styles.medicamentoCard, { backgroundColor: medicamento.cor }]}
                onPress={() => handleVisualizarMedicamento(medicamento)}
                activeOpacity={0.8}
                accessibilityLabel={`Visualizar informações de ${medicamento.nome}`}
                accessibilityRole="button"
              >
                <View style={styles.medicamentoInfo}>
                  <View style={styles.medicamentoIconContainer}>
                    <Ionicons name="notifications-outline" size={24} color="#1E88E5" />
                  </View>
                  <View style={styles.medicamentoDetails}>
                    <Text style={styles.medicamentoNome}>{medicamento.nome}</Text>
                    <Text style={styles.medicamentoDosagem}>{medicamento.dosagem}</Text>
                    <View style={styles.medicamentoHorario}>
                      <Ionicons name="time-outline" size={18} color="#666" style={styles.horarioIcon} />
                      <Text style={styles.horarioText}>
                        {medicamento.horario} ({medicamento.frequencia})
                      </Text>
                      <Text style={styles.quantidadeText}>{quantidadeLabel}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.medicamentoActions}>
                  <TouchableOpacity
                    testID={`edit-button-${medicamento.id}`}
                    style={styles.actionButton}
                    onPress={() => handleEditarMedicamento(medicamento.id)}
                  >
                    <Ionicons name="create-outline" size={22} color="#1E88E5" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    testID={`delete-button-${medicamento.id}`}
                    style={styles.actionButton}
                    onPress={() => handleExcluirMedicamento(medicamento.id)}
                  >
                    <Ionicons name="trash-outline" size={22} color="#E53935" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      {/* Modal de visualização de medicamento */}
      {false && modalVisible && selectedMedicamento && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 24,
            paddingVertical: 36,
            paddingHorizontal: 26,
            width: '88%',
            maxWidth: 370,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.13,
            shadowRadius: 8,
            elevation: 8,
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
            {(selectedMedicamento.fotoUri || selectedMedicamento.foto || selectedMedicamento.imagem) ? (
              <Image
                source={{ uri: selectedMedicamento.fotoUri || selectedMedicamento.foto || selectedMedicamento.imagem }}
                style={{ width: 120, height: 120, borderRadius: 16, marginBottom: 18, borderWidth: 2, borderColor: '#e0e0e0', backgroundColor: '#f5f5f5' }}
                resizeMode="cover"
              />
            ) : (
              <View style={{ width: 120, height: 120, borderRadius: 16, marginBottom: 18, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#bbb', fontSize: 32 }}>💊</Text>
              </View>
            )}
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 18, color: '#222', textAlign: 'center' }}>{selectedMedicamento.nome}</Text>
            <View style={{ width: '100%', marginBottom: 10, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, marginBottom: 8, textAlign: 'center' }}><Text style={{ fontWeight: 'bold', color: '#4285F4' }}>Dosagem: </Text>{selectedMedicamento.dosagem}</Text>
              <Text style={{ fontSize: 16, marginBottom: 8, textAlign: 'center' }}><Text style={{ fontWeight: 'bold', color: '#4285F4' }}>Horário: </Text>{selectedMedicamento.horario}</Text>
              <Text style={{ fontSize: 16, marginBottom: 8, textAlign: 'center' }}><Text style={{ fontWeight: 'bold', color: '#4285F4' }}>Frequência: </Text>{selectedMedicamento.frequencia}</Text>
              <Text style={{ fontSize: 16, marginBottom: 8, textAlign: 'center' }}>
                <Text style={{ fontWeight: 'bold', color: '#4285F4' }}>Quantidade: </Text>
                {selectedMedicamento.quantidadeConsumida}/{selectedMedicamento.quantidadeTotal}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={{
                marginTop: 10,
                alignSelf: 'center',
                backgroundColor: '#4285F4',
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 38,
                shadowColor: '#4285F4',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.18,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 17, fontWeight: 'bold', letterSpacing: 0.5 }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Novo modal centralizado para visualizar medicamento */}
      <Modal
        visible={modalVisible && !!selectedMedicamento}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackdrop}>
          {selectedMedicamento && (
            <View style={styles.modalCard}>
              {selectedMedicamento.fotoUri ? (
                <Image
                  source={{ uri: selectedMedicamento.fotoUri }}
                  style={styles.modalImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.modalImagePlaceholder}>
                  <Text style={{ color: '#bbb', fontSize: 32 }}>📷</Text>
                </View>
              )}

              <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 18, color: '#222', textAlign: 'center' }}>
                {selectedMedicamento.nome}
              </Text>

              <View style={{ width: '100%', marginBottom: 10, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, marginBottom: 8, textAlign: 'center' }}>
                  <Text style={{ fontWeight: 'bold', color: '#4285F4' }}>Dosagem: </Text>{selectedMedicamento.dosagem}
                </Text>
                <Text style={{ fontSize: 16, marginBottom: 8, textAlign: 'center' }}>
                  <Text style={{ fontWeight: 'bold', color: '#4285F4' }}>Horário: </Text>{selectedMedicamento.horario}
                </Text>
                <Text style={{ fontSize: 16, marginBottom: 8, textAlign: 'center' }}>
                  <Text style={{ fontWeight: 'bold', color: '#4285F4' }}>Frequência: </Text>{selectedMedicamento.frequencia}
                </Text>
                <Text style={{ fontSize: 16, marginBottom: 8, textAlign: 'center' }}>
                  <Text style={{ fontWeight: 'bold', color: '#4285F4' }}>Quantidade Consumida: </Text>
                  {selectedMedicamento.quantidadeConsumida}
                </Text>
                <Text style={{ fontSize: 16, marginBottom: 8, textAlign: 'center' }}>
                  <Text style={{ fontWeight: 'bold', color: '#4285F4' }}>Quantidade Total: </Text>
                  {selectedMedicamento.quantidadeTotal}
                </Text>
              </View>

              <TouchableOpacity onPress={handleCloseModal} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>

        {loading && (
          <Text style={{ textAlign: 'center', marginVertical: 16, color: '#666' }}>
            Carregando medicamentos...
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
