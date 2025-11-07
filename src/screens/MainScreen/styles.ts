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
  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  modalImage: {
    width: 180,
    height: 180,
    borderRadius: 16,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  modalImagePlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 16,
    marginBottom: 18,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseButton: {
    marginTop: 12,
    alignSelf: 'center',
    backgroundColor: '#4285F4',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 44,
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});


