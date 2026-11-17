import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { CompanyAdminTabParamList, CompanyAdminStackParamList } from './types';
import { Colors, FontFamily } from '../theme/tokens';
import { TeamManagementScreen } from '../screens/company/TeamManagementScreen';
import FleetHomeScreen from '../screens/fleet/FleetHomeScreen';
import FleetTrucksScreen from '../screens/fleet/FleetTrucksScreen';
import { ProfileSettingsScreen } from '../screens/common/ProfileSettingsScreen';

const Tab = createBottomTabNavigator<CompanyAdminTabParamList>();
const Stack = createNativeStackNavigator<CompanyAdminStackParamList>();

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primaryAmber,
        tabBarInactiveTintColor: Colors.muted,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: FontFamily.semiBold,
          fontSize: 11,
        },
      }}
    >
      <Tab.Screen
        name="TeamManagement"
        component={TeamManagementScreen}
        options={{
          tabBarLabel: 'Team',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminFleet"
        component={FleetTrucksScreen}
        options={{
          tabBarLabel: 'Fleet',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="local-shipping" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminOverview"
        component={FleetHomeScreen}
        options={{
          tabBarLabel: 'Operations',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="analytics" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminSettings"
        component={ProfileSettingsScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function CompanyAdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminTabs" component={AdminTabs} />
      <Stack.Screen name="TeamManagement" component={TeamManagementScreen} />
    </Stack.Navigator>
  );
}

