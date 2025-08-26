import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Components
import CustomTabBar from '../components/CustomTabBar';
import { TAB_BAR_CONFIG } from '../constants/tabBarConfig';

// Screens
import HomeScreen from '../screens/HomeScreen';
import CreditsScreen from '../screens/CreditsScreen';
import ReferralScreen from '../screens/ReferralScreen';
import MyReferralScreen from '../screens/MyReferralScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DetailScreen from '../screens/DetailScreen';
import InsurancesScreen from '../screens/InsurancesScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <CustomTabBar route={route} focused={focused} />
        ),
        ...TAB_BAR_CONFIG.screenOptions,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Credits" component={CreditsScreen} />
      <Tab.Screen 
        name="Referral" 
        component={ReferralScreen}
        options={TAB_BAR_CONFIG.referralTabOptions}
      />
      <Tab.Screen name="My Referral" component={MyReferralScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="Main" component={MainTabNavigator} />
                <Stack.Screen name="Details" component={DetailScreen} />
                <Stack.Screen name="Insurances" component={InsurancesScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
