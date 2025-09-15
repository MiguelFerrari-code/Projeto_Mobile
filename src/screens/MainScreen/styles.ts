import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  proximaDoseContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  proximaDoseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  proximaDoseSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  medicamentosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  medicamentosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  adicionarButton: {
    backgroundColor: '#4285F4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  adicionarIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  adicionarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  medicamentosList: {
    paddingBottom: 100,
  },
  medicamentoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicamentoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  medicamentoIconContainer: {
    marginRight: 15,
  },
  medicamentoIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  medicamentoDetails: {
    flex: 1,
  },
  medicamentoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  medicamentoDosagem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  medicamentoHorario: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horarioIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginRight: 5,
  },
  horarioText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  quantidadeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  medicamentoActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  actionImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});


