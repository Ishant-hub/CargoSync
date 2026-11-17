import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontFamily } from '../theme/tokens';
import { DriverTabParamList } from './types';

// Tab screens
import DriverHomeScreen from '../screens/driver/DriverHomeScreen';
import DriverRouteScreen from '../screens/driver/DriverRouteScreen';
import DriverParcelsScreen from '../screens/driver/DriverParcelsScreen';
import DriverMapScreen from '../screens/driver/DriverMapScreen';
import { ProfileSettingsScreen } from '../screens/common/ProfileSettingsScreen';

// Stack screens
import { JobDetailsAcceptScreen } from '../screens/driver/JobDetailsAcceptScreen';
import { DriverConfirmPickupScreen } from '../screens/driver/DriverConfirmPickupScreen';
import { DriverNavigationScreen } from '../screens/driver/DriverNavigationScreen';
import { DriverCompleteDeliveryScreen } from '../screens/driver/DriverCompleteDeliveryScreen';
import { ReportProblemScreen } from '../screens/driver/ReportProblemScreen';
import { NotificationsScreen } from '../screens/common/NotificationsScreen';

const Tab = createBottomTabNavigator<DriverTabParamList>();
const Stack = createNativeStackNavigator();

function DriverTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: Colors.primaryAmber,
        tabBarInactiveTintColor: Colors.muted,
        tabBarLabelStyle: {
          fontFamily: FontFamily.semiBold,
          fontSize: 11,
        },
      }}
    >
      <Tab.Screen
        name="DriverHome"
        component={DriverHomeScreen}
        options={{
          tabBarLabel: 'Loads',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="local-shipping" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="DriverRoute"
        component={DriverRouteScreen}
        options={{
          tabBarLabel: 'Trip Active',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="alt-route" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="DriverShipments"
        component={DriverParcelsScreen}
        options={{
          tabBarLabel: 'Parcels',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="inventory-2" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="DriverMap"
        component={DriverMapScreen}
        options={{
          tabBarLabel: 'Map GPS',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="navigation" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="DriverProfile"
        component={ProfileSettingsScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function DriverNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DriverTabs" component={DriverTabs} />
      <Stack.Screen name="JobDetailsAccept" component={JobDetailsAcceptScreen} />
      <Stack.Screen name="DriverConfirmPickup" component={DriverConfirmPickupScreen} />
      <Stack.Screen name="DriverNavigation" component={DriverNavigationScreen} />
      <Stack.Screen name="DriverCompleteDelivery" component={DriverCompleteDeliveryScreen} />
      <Stack.Screen name="ReportProblem" component={ReportProblemScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}
