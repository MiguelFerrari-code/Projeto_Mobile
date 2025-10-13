import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center', // Mantém o conteúdo centralizado verticalmente
    paddingHorizontal: 20, // Mantém o padding horizontal
    paddingBottom: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 0, // Reduz um pouco a margem inferior da logo para aproximar do formulário
    marginTop: 0, // Move a logo um pouco para cima para centralizar melhor o conjunto
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#DDD',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 25, // Aumentado o borderRadius para arredondar mais
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#4285F4',
    fontSize: 14,
    marginTop: 15,
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
});
