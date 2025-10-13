import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0', // Cor de fundo clara
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 250, // Ajustado para um tamanho que se assemelha mais ao print
    height: 250, // Ajustado para um tamanho que se assemelha mais ao print
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
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
  loginButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 25, // Aumentado o borderRadius para arredondar mais
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 25, // Botões sociais com cantos mais arredondados
    borderWidth: 1,
    borderColor: '#DDD',
    marginTop: 15,
    backgroundColor: '#FFF',
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#333',
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
  credentialsInfo: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4285F4',
  },
  credentialsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  credentialsText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});
