import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontFamily } from '../theme/tokens';
import { FleetTabParamList } from './types';

// Tab screens
import FleetHomeScreen from '../screens/fleet/FleetHomeScreen';
import FleetTrucksScreen from '../screens/fleet/FleetTrucksScreen';
import FleetOptimizeScreen from '../screens/fleet/FleetOptimizeScreen';
import FleetMapScreen from '../screens/fleet/FleetMapScreen';
import { ProfileSettingsScreen } from '../screens/common/ProfileSettingsScreen';

// Stack screens
import { TruckDetailsScreen } from '../screens/fleet/TruckDetailsScreen';
import { CombineShipmentsScreen } from '../screens/fleet/CombineShipmentsScreen';
import { DisruptionRecoveryScreen } from '../screens/fleet/DisruptionRecoveryScreen';
import { NotificationsScreen } from '../screens/common/NotificationsScreen';

const Tab = createBottomTabNavigator<FleetTabParamList>();
const Stack = createNativeStackNavigator();

function FleetTabs() {
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
        name="FleetOverview"
        component={FleetHomeScreen}
        options={{
          tabBarLabel: 'Overview',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="FleetTrucks"
        component={FleetTrucksScreen}
        options={{
          tabBarLabel: 'Trucks',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="local-shipping" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="FleetOptimize"
        component={FleetOptimizeScreen}
        options={{
          tabBarLabel: 'Optimize',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="alt-route" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="FleetMap"
        component={FleetMapScreen}
        options={{
          tabBarLabel: 'Corridors',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="map" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="FleetProfile"
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

export default function FleetNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FleetTabs" component={FleetTabs} />
      <Stack.Screen name="TruckDetails" component={TruckDetailsScreen} />
      <Stack.Screen name="CombineShipments" component={CombineShipmentsScreen} />
      <Stack.Screen name="DisruptionRecovery" component={DisruptionRecoveryScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}
