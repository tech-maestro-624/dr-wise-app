import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Components
import CustomTabBar from '../components/CustomTabBar';
import { TAB_BAR_CONFIG } from '../constants/tabBarConfig';

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
                <Stack.Screen name="AffiliateHome" component={AffiliateHomeScreen} />
                <Stack.Screen name="Leads" component={LeadsScreen} />
                <Stack.Screen name="Calculator" component={CalculatorScreen} />
                <Stack.Screen name="TermInsuranceCalculator" component={TermInsuranceCalculatorScreen} />
                <Stack.Screen name="Details" component={DetailScreen} />
                <Stack.Screen name="Insurances" component={InsurancesScreen} />
                <Stack.Screen name="Investments" component={InvestmentsScreen} />
                <Stack.Screen name="Loans" component={LoansScreen} />
                <Stack.Screen name="TransactionsHistory" component={TransactionsHistoryScreen} />
                <Stack.Screen name="Redeem" component={RedeemScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
