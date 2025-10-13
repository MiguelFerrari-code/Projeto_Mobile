import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';

// Importando a logo
const logoHeader = require('../../assets/LogoCadastro.png');

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleLogoPress = () => {
    navigation.openDrawer();
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity onPress={handleLogoPress}>
        <Image source={logoHeader} style={styles.headerLogo} />
      </TouchableOpacity>
    </View>
  );
}

