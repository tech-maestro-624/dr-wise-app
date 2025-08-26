import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import AffiliateHomeScreen from '../screens/AffiliateHomeScreen';
import LeadsScreen from '../screens/LeadsScreen';
import CalculatorScreen from '../screens/CalculatorScreen';
import TermInsuranceCalculatorScreen from '../screens/TermInsuranceCalculatorScreen';
import CreditsScreen from '../screens/CreditsScreen';
import ReferralScreen from '../screens/ReferralScreen';
import MyReferralScreen from '../screens/MyReferralScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DetailScreen from '../screens/DetailScreen';
// import CategoriesScreen from '../screens/CategoriesScreen';
import InsurancesScreen from '../screens/InsurancesScreen';
import InvestmentsScreen from '../screens/InvestmentsScreen';
import LoansScreen from '../screens/LoansScreen';
import TransactionsHistoryScreen from '../screens/TransactionsHistoryScreen';
import RedeemScreen from '../screens/RedeemScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Credits') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Referral') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'My Referral') {
            iconName = focused ? 'person-add' : 'person-add-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Credits" component={CreditsScreen} />
      <Tab.Screen name="Referral" component={ReferralScreen} />
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
                <Stack.Screen name="AffiliateHome" component={AffiliateHomeScreen} />
                <Stack.Screen name="Leads" component={LeadsScreen} />
                <Stack.Screen name="Calculator" component={CalculatorScreen} />
                <Stack.Screen name="TermInsuranceCalculator" component={TermInsuranceCalculatorScreen} />
                <Stack.Screen name="Details" component={DetailScreen} />
                {/* <Stack.Screen name="Categories" component={CategoriesScreen} /> */}
                <Stack.Screen name="Insurances" component={InsurancesScreen} />
                <Stack.Screen name="Investments" component={InvestmentsScreen} />
                <Stack.Screen name="Loans" component={LoansScreen} />
                <Stack.Screen name="TransactionsHistory" component={TransactionsHistoryScreen} />
                <Stack.Screen name="Redeem" component={RedeemScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
