import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { styles } from './styles';
import { useAuth } from '../../context/auth';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../components';

// Importando as imagens
const perfilIcone = require('../../assets/perfilicone.png');
const notificacaoSino = require('../../assets/notificacaoSino.png');
const relogioIcone = require('../../assets/relogio.png');
const lapisEditar = require('../../assets/lapisEditar.png');
const lixeiraIcone = require('../../assets/Lixeira.png');
const mainIcone = require('../../assets/mainicone.png');
const mapaIcone = require('../../assets/mapaicone.png');

// Dados mock dos medicamentos
const medicamentos = [
  {
    id: 1,
    nome: 'Paracetamol',
    dosagem: '500mg',
    horario: '08:00',
    frequencia: '3x por dia',
    quantidade: '3/30',
    cor: '#ffffffff'
  },
  {
    id: 2,
    nome: 'Paracetamol',
    dosagem: '200mg',
    horario: '12:00',
    frequencia: '2x por dia',
    quantidade: '12/20',
    cor: '#ffffffff'
  },
  {
    id: 3,
    nome: 'Aspirina',
    dosagem: '100mg',
    horario: '20:00',
    frequencia: '3x por dia',
    quantidade: '12/20',
    cor: '#ffffffff'
  }
];

interface MainScreenProps {
  navigation?: any;
}

export function MainScreen({ navigation }: MainScreenProps) {
  const { user, logout } = useAuth();
  const drawerNavigation = useNavigation();

  const handleAdicionarMedicamento = () => {
    navigation?.navigate('AdicionarMedicamento');
  };

  const handleEditarMedicamento = (id: number) => {
    navigation?.navigate('EditarMedicamento', { medicamento: { id } });
  };

  const handleExcluirMedicamento = (id: number) => {
    console.log('Excluir medicamento:', id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="AGENDA" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Próxima Dose */}
        <View style={styles.proximaDoseContainer}>
          <Text style={styles.proximaDoseTitle}>Próxima Dose</Text>
          <Text style={styles.proximaDoseSubtitle}>Paracetamol às 08:00</Text>
        </View>

        {/* Seus Medicamentos */}
        <View style={styles.medicamentosHeader}>
          <Text style={styles.medicamentosTitle}>Seus Medicamentos:</Text>
          <TouchableOpacity 
            style={styles.adicionarButton}
            onPress={handleAdicionarMedicamento}
          >
            <Text style={styles.adicionarIcon}>+</Text>
            <Text style={styles.adicionarText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Medicamentos */}
        <View style={styles.medicamentosList}>
          {medicamentos.map((medicamento) => (
            <View key={medicamento.id} style={[styles.medicamentoCard, { backgroundColor: medicamento.cor }]}>
              <View style={styles.medicamentoInfo}>
                <View style={styles.medicamentoIconContainer}>
                  <Image source={notificacaoSino} style={styles.medicamentoIcon} />
                </View>
                
                <View style={styles.medicamentoDetails}>
                  <Text style={styles.medicamentoNome}>{medicamento.nome}</Text>
                  <Text style={styles.medicamentoDosagem}>{medicamento.dosagem}</Text>
                  <View style={styles.medicamentoHorario}>
                    <Image source={relogioIcone} style={styles.horarioIcon} />
                    <Text style={styles.horarioText}>
                      {medicamento.horario} ({medicamento.frequencia})
                    </Text>
                    <Text style={styles.quantidadeText}>{medicamento.quantidade}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.medicamentoActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleEditarMedicamento(medicamento.id)}
                >
                  <Image source={lapisEditar} style={styles.actionImage} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleExcluirMedicamento(medicamento.id)}
                >
                  <Image source={lixeiraIcone} style={styles.actionImage} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}


