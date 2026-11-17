import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontFamily } from '../theme/tokens';
import { ShipperTabParamList } from './types';

// Tab screens
import ShipperHomeScreen from '../screens/shipper/ShipperHomeScreen';
import ShipperShipmentsScreen from '../screens/shipper/ShipperShipmentsScreen';
import ShipperMapScreen from '../screens/shipper/ShipperMapScreen';
import ShipperOptimizeScreen from '../screens/shipper/ShipperOptimizeScreen';
import { ProfileSettingsScreen } from '../screens/common/ProfileSettingsScreen';

// Stack screens
import { CreateShipmentScreen } from '../screens/shipper/CreateShipmentScreen';
import { FindTrucksScreen } from '../screens/shipper/FindTrucksScreen';
import { ShipmentDetailsScreen } from '../screens/shipper/ShipmentDetailsScreen';
import { NotificationsScreen } from '../screens/common/NotificationsScreen';

const Tab = createBottomTabNavigator<ShipperTabParamList>();
const Stack = createNativeStackNavigator();

function ShipperTabs() {
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
        name="ShipperHome"
        component={ShipperHomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ShipperShipments"
        component={ShipperShipmentsScreen}
        options={{
          tabBarLabel: 'Shipments',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="inventory-2" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ShipperMap"
        component={ShipperMapScreen}
        options={{
          tabBarLabel: 'Live Map',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="map" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ShipperOptimize"
        component={ShipperOptimizeScreen}
        options={{
          tabBarLabel: 'Optimize',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="alt-route" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ShipperProfile"
        component={ProfileSettingsScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function ShipperNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ShipperTabs" component={ShipperTabs} />
      <Stack.Screen name="CreateShipment" component={CreateShipmentScreen} />
      <Stack.Screen name="FindTrucks" component={FindTrucksScreen} />
      <Stack.Screen name="ShipmentDetails" component={ShipmentDetailsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}
