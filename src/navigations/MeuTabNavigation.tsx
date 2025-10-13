import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainScreen } from '../screens/MainScreen';
import { FarmaciasScreen } from '../screens/FarmaciasScreen';
import { PerfilScreen } from '../screens/PerfilScreen';
import { AdicionarMedicamento } from '../screens/AdicionarMedicamento';
import { EditarMedicamento } from '../screens/EditarMedicamento';
import { colors } from '../screens/styles/colors';
import { Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Importando as imagens dos ícones
const mainIcone = require('../assets/mainicone.png');
const mapaIcone = require('../assets/mapaicone.png');
const perfilIcone = require('../assets/perfilicone.png');

// Stack Navigator para a aba Agenda
const AgendaStack = createNativeStackNavigator();

function AgendaStackNavigator() {
  return (
    <AgendaStack.Navigator screenOptions={{ headerShown: false }}>
      <AgendaStack.Screen name="AgendaMain" component={MainScreen} />
      <AgendaStack.Screen name="AdicionarMedicamento" component={AdicionarMedicamento} />
      <AgendaStack.Screen name="EditarMedicamento" component={EditarMedicamento} />
    </AgendaStack.Navigator>
  );
}

const Tab = createBottomTabNavigator({
    screens: {
        Agenda: AgendaStackNavigator,
        Farmacias: FarmaciasScreen,
        Perfil: PerfilScreen,
    }
});

export function MeuTabNavigation() {
    const insets = useSafeAreaInsets();
    
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveBackgroundColor: '#FFFFFF',
                tabBarActiveTintColor: colors.primary,
                headerShown: false,
                tabBarInactiveBackgroundColor: '#FFFFFF',
                tabBarInactiveTintColor: '#666',
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#E0E0E0',
                    paddingBottom: Math.max(insets.bottom, 10),
                    paddingTop: 10,
                    height: 70 + Math.max(insets.bottom, 0),
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}
        >
            <Tab.Screen 
                name='Agenda' 
                component={AgendaStackNavigator} 
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image 
                            source={mainIcone} 
                            style={{ 
                                width: 24, 
                                height: 24, 
                                tintColor: focused ? colors.primary : '#666' 
                            }} 
                        />
                    ),
                }}
            />
            <Tab.Screen 
                name='Farmacias' 
                component={FarmaciasScreen} 
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image 
                            source={mapaIcone} 
                            style={{ 
                                width: 24, 
                                height: 24, 
                                tintColor: focused ? colors.primary : '#666' 
                            }} 
                        />
                    ),
                }}
            />
            <Tab.Screen 
                name='Perfil' 
                component={PerfilScreen} 
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image 
                            source={perfilIcone} 
                            style={{ 
                                width: 24, 
                                height: 24, 
                                tintColor: focused ? colors.primary : '#666' 
                            }} 
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}


