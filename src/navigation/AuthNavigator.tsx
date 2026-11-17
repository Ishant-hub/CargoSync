import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';

// Batch A Auth & Onboarding Screens
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { AccountSelectionScreen } from '../screens/auth/AccountSelectionScreen';
import { ChooseRoleScreen } from '../screens/auth/ChooseRoleScreen';
import { PersonalDetailsScreen } from '../screens/auth/PersonalDetailsScreen';
import { IdentityVerificationScreen } from '../screens/auth/IdentityVerificationScreen';
import { RegistrationCompleteScreen } from '../screens/auth/RegistrationCompleteScreen';
import { VerificationCorrectionScreen } from '../screens/auth/VerificationCorrectionScreen';

// Batch A Company Onboarding Screens
import { CompanyRegistrationScreen } from '../screens/company/CompanyRegistrationScreen';
import { CompanyDocumentsScreen } from '../screens/company/CompanyDocumentsScreen';
import { CompanyReviewStatusScreen } from '../screens/company/CompanyReviewStatusScreen';
import { CompanyVerifiedScreen } from '../screens/company/CompanyVerifiedScreen';
import { JoinCompanyScreen } from '../screens/company/JoinCompanyScreen';
import { CompanyConnectedScreen } from '../screens/company/CompanyConnectedScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* Individual Flow */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="AccountSelection" component={AccountSelectionScreen} />
      <Stack.Screen name="ChooseRole" component={ChooseRoleScreen} />
      <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} />
      <Stack.Screen name="IdentityVerification" component={IdentityVerificationScreen} />
      <Stack.Screen name="RegistrationComplete" component={RegistrationCompleteScreen} />
      <Stack.Screen name="VerificationCorrection" component={VerificationCorrectionScreen} />

      {/* Company Flow */}
      <Stack.Screen name="CompanyRegistration" component={CompanyRegistrationScreen} />
      <Stack.Screen name="CompanyDocuments" component={CompanyDocumentsScreen} />
      <Stack.Screen name="CompanyReviewStatus" component={CompanyReviewStatusScreen} />
      <Stack.Screen name="CompanyVerified" component={CompanyVerifiedScreen} />
      <Stack.Screen name="JoinCompany" component={JoinCompanyScreen} />
      <Stack.Screen name="CompanyConnected" component={CompanyConnectedScreen} />
    </Stack.Navigator>
  );
}
