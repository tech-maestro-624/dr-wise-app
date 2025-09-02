import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

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
import CustomTabBar from '../components/CustomTabBar';
import { TAB_BAR_CONFIG } from '../constants/tabBarConfig';
import SignupScreen from '../screens/SignupScreen';
import DetailScreen from '../screens/DetailScreen';
// import CategoriesScreen from '../screens/CategoriesScreen';
import InsurancesScreen from '../screens/InsurancesScreen';
import InvestmentsScreen from '../screens/InvestmentsScreen';
import LoansScreen from '../screens/LoansScreen';
import TransactionsHistoryScreen from '../screens/TransactionsHistoryScreen';
import RedeemScreen from '../screens/RedeemScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsConditionsScreen from '../screens/TermsConditionsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryDetailScreen from '../screens/CategoryDetailScreen';
import ReferralFormScreen from '../screens/ReferralFormScreen';
import VerificationMainScreen from '../screens/verification/VerificationMainScreen';
import GovernmentIDScreen from '../screens/verification/GovernmentIDScreen';
import SelfiePhotoScreen from '../screens/verification/SelfiePhotoScreen';
import BankDetailsScreen from '../screens/verification/BankDetailsScreen';
import FAQScreen from '../screens/FAQScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Calculator" component={CalculatorScreen} />
      <Stack.Screen name="TermInsuranceCalculator" component={TermInsuranceCalculatorScreen} />
    </Stack.Navigator>
  );
}

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
      <Tab.Screen name="Home" component={HomeStack} />
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

function AffiliateTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <CustomTabBar route={route} focused={focused} />
        ),
        ...TAB_BAR_CONFIG.screenOptions,
      })}
    >
      <Tab.Screen name="Home" component={AffiliateHomeScreen} />
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

// Authentication-aware navigator component
function AuthNavigator() {
    const { isAuthenticated, user, isAmbassador } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log('AuthNavigator - isAuthenticated:', isAuthenticated, 'user:', user?.name, 'isAmbassador:', isAmbassador);
        // Small delay to allow AuthContext to initialize
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, [isAuthenticated, user, isAmbassador]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FBFBFB' }}>
                <ActivityIndicator size="large" color="#8F31F9" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* Authentication flow - available to all users */}
                <>
                    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />

                    {/* Verification screens - available during registration process */}
                    <Stack.Screen name="Verification" component={VerificationMainScreen} />
                    <Stack.Screen name="GovernmentIDScreen" component={GovernmentIDScreen} />
                    <Stack.Screen name="SelfiePhotoScreen" component={SelfiePhotoScreen} />
                    <Stack.Screen name="BankDetailsScreen" component={BankDetailsScreen} />

                    {!isAuthenticated ? (
                        // Unauthenticated screens only
                        <></>
                    ) : (
                        // Authenticated screens only
                        <>
                            {/* Role-based main screens */}
                            {isAmbassador ? (
                                <Stack.Screen name="Main" component={AffiliateTabNavigator} />
                            ) : (
                                <Stack.Screen name="Main" component={MainTabNavigator} />
                            )}

                            {/* Common screens for all authenticated users */}
                            <Stack.Screen name="Leads" component={LeadsScreen} />
                            <Stack.Screen name="Calculator" component={CalculatorScreen} />
                            <Stack.Screen name="TermInsuranceCalculator" component={TermInsuranceCalculatorScreen} />
                            <Stack.Screen name="Details" component={DetailScreen} />
                            <Stack.Screen name="Insurances" component={InsurancesScreen} />
                            <Stack.Screen name="Investments" component={InvestmentsScreen} />
                            <Stack.Screen name="Loans" component={LoansScreen} />
                            <Stack.Screen name="TransactionsHistory" component={TransactionsHistoryScreen} />
                            <Stack.Screen name="FAQ" component={FAQScreen} />
                            <Stack.Screen name="Redeem" component={RedeemScreen} />
                            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
                            <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
                            <Stack.Screen name="Categories" component={CategoriesScreen} />
                            <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
                            <Stack.Screen name="ReferralForm" component={ReferralFormScreen} />
                        </>
                    )}
                </>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// Wrapper component to handle AuthContext errors gracefully
function AuthNavigatorWrapper() {
    try {
        return <AuthNavigator />;
    } catch (error) {
        console.error('AuthNavigator error:', error);
        // Fallback to basic navigation if AuthContext fails
        return (
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                    <Stack.Screen name="Verification" component={VerificationMainScreen} />
                    <Stack.Screen name="GovernmentIDScreen" component={GovernmentIDScreen} />
                    <Stack.Screen name="SelfiePhotoScreen" component={SelfiePhotoScreen} />
                    <Stack.Screen name="BankDetailsScreen" component={BankDetailsScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

export default function AppNavigator() {
    return <AuthNavigatorWrapper />;
}
