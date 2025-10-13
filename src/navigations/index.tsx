import { NavigationContainer } from "@react-navigation/native";
import { MainDrawerNavigation } from "./MainDrawerNavigation";
import { LoginStackNavigation } from "./LoginStackNavigation";
import { useAuth } from "../context/auth";

export function Navigation() {
    const { isAuthenticated } = useAuth();
    
    return (
        <NavigationContainer>
            {isAuthenticated ? <MainDrawerNavigation /> : <LoginStackNavigation />}
        </NavigationContainer>
    );
}

