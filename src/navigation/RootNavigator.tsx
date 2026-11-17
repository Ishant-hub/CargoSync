import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/tokens';
import AuthNavigator from './AuthNavigator';
import ShipperNavigator from './ShipperNavigator';
import DriverNavigator from './DriverNavigator';
import FleetNavigator from './FleetNavigator';
import CompanyAdminNavigator from './CompanyAdminNavigator';

export default function RootNavigator() {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.background,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primaryAmber} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!isAuthenticated || !role ? (
        <AuthNavigator />
      ) : role === 'shipper' ? (
        <ShipperNavigator />
      ) : role === 'driver' ? (
        <DriverNavigator />
      ) : role === 'company_admin' ? (
        <CompanyAdminNavigator />
      ) : (
        <FleetNavigator />
      )}
    </NavigationContainer>
  );
}
