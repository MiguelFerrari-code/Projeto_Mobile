import { createDrawerNavigator } from '@react-navigation/drawer';
import { MeuTabNavigation } from './MeuTabNavigation';
import { colors } from '../screens/styles/colors';
import { useAuth } from '../context/auth';
import { useNavigation } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

export function MainDrawerNavigation() {
    const { logout } = useAuth();
    const navigation = useNavigation();

    return (
        <Drawer.Navigator 
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: '#FFFFFF',
                    width: 250,
                },
                drawerActiveTintColor: colors.primary,
                drawerInactiveTintColor: '#666',
                drawerLabelStyle: {
                    fontSize: 16,
                    fontWeight: '500',
                },
                drawerItemStyle: {
                    marginVertical: 5,
                    borderRadius: 10,
                },
            }}
        >
            <Drawer.Screen 
                name="Main" 
                component={MeuTabNavigation}
                options={{
                    drawerLabel: 'Agenda',
                }}
                listeners={{
                    drawerItemPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('Main', { screen: 'Agenda' });
                    }
                }}
            />
            <Drawer.Screen 
                name="FarmaciasDrawer" 
                component={MeuTabNavigation}
                options={{
                    drawerLabel: 'Farmácias',
                }}
                listeners={{
                    drawerItemPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('Main', { screen: 'Farmacias' });
                    }
                }}
            />
            <Drawer.Screen 
                name="PerfilDrawer" 
                component={MeuTabNavigation}
                options={{
                    drawerLabel: 'Perfil',
                }}
                listeners={{
                    drawerItemPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('Main', { screen: 'Perfil' });
                    }
                }}
            />
            <Drawer.Screen 
                name="Sair" 
                component={MeuTabNavigation}
                options={{
                    drawerLabel: 'Sair do App',
                }}
                listeners={{
                    drawerItemPress: (e) => {
                        e.preventDefault();
                        logout();
                    }
                }}
            />
        </Drawer.Navigator>
    );
}

