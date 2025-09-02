import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {
  useFonts,
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_600SemiBold,
  Rubik_700Bold,
} from '@expo-google-fonts/rubik';
import { View, Text } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import Toast from 'react-native-toast-message';
import toastConfig from './src/toast/toastConfig';



export default function App() {
  let [fontsLoaded] = useFonts({
    'Rubik-Regular': Rubik_400Regular,
    'Rubik-Medium': Rubik_500Medium,
    'Rubik-SemiBold': Rubik_600SemiBold,
    'Rubik-Bold': Rubik_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading Fonts...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <AppNavigator />
      <Toast config={toastConfig} />
    </AuthProvider>
  );
}

