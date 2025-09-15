import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 80,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  headerLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

