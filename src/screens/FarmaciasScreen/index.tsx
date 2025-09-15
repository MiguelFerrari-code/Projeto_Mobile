import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../components';

// Importando as imagens
const imagemMaps = require('../../assets/imagemmaps.png');
const perfilIcone = require('../../assets/perfilicone.png');
const mainIcone = require('../../assets/mainicone.png');
const mapaIcone = require('../../assets/mapaicone.png');

interface FarmaciasScreenProps {
  navigation?: any;
}

export function FarmaciasScreen({ navigation }: FarmaciasScreenProps) {
  const [searchText, setSearchText] = useState('');
  const drawerNavigation = useNavigation();

  const handleSearch = () => {
    console.log('Pesquisar farmácias:', searchText);
    // Implementar pesquisa de farmácias no futuro
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="FARMÁCIAS" />

      {/* Campo de Busca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar farmácias..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Mapa */}
      <View style={styles.mapContainer}>
        <ImageBackground
          source={imagemMaps}
          style={styles.mapBackground}
          resizeMode="cover"
        >

        </ImageBackground>
      </View>

      {/* Bottom Navigation removed: handled by TabNavigator */}
      </View>
  );
}


