import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Login } from "../screens/Login";
import { Register } from "../screens/Register";
import { StaticParamList } from "@react-navigation/native";

const LoginStack = createNativeStackNavigator({
    screens: {
        Login: Login,
        Register: Register
    }
});

type LoginStackParamList = StaticParamList<typeof LoginStack>;
type LoginScreenProp = NativeStackNavigationProp<LoginStackParamList, 'Login'>;

export type LoginTypes = {
    navigation: LoginScreenProp;
};

export function LoginStackNavigation() {
    return (
        <LoginStack.Navigator screenOptions={{ headerShown: false }}>
            <LoginStack.Screen name="Login" component={Login} />
            <LoginStack.Screen name="Register" component={Register} />
        </LoginStack.Navigator>
    );
}

