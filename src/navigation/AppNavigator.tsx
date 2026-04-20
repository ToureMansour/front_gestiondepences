import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from '@expo/vector-icons/MaterialIcons';

import { useAuth } from '../context/AuthContext';
import DashboardScreen from '../screens/DashboardScreen';
import CreateExpenseScreen from '../screens/CreateExpenseScreen';
import MyExpensesScreen from '../screens/MyExpensesScreen';
import ExpenseDetailScreen from '../screens/ExpenseDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AllExpensesScreen from '../screens/AllExpensesScreen';
import AdminExpenseDetailScreen from '../screens/AdminExpenseDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const EmployeeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Icon.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'CreateExpense') {
            iconName = 'add-circle';
          } else if (route.name === 'MyExpenses') {
            iconName = 'list';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else {
            iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Tableau de bord' }}
      />
      <Tab.Screen 
        name="CreateExpense" 
        component={CreateExpenseScreen}
        options={{ title: 'Nouvelle dépense' }}
      />
      <Tab.Screen 
        name="MyExpenses" 
        component={MyExpensesScreen}
        options={{ title: 'Mes dépenses' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

const AdminTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Icon.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'AllExpenses') {
            iconName = 'list-alt';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else {
            iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Tableau de bord' }}
      />
      <Tab.Screen 
        name="AllExpenses" 
        component={AllExpensesScreen}
        options={{ title: 'Toutes les dépenses' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

const AppStack = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs">
        {() => user?.role === 'admin' ? <AdminTabs /> : <EmployeeTabs />}
      </Stack.Screen>
      <Stack.Screen 
        name="ExpenseDetail" 
        component={ExpenseDetailScreen}
        options={{ title: 'Détails de la dépense' }}
      />
      <Stack.Screen 
        name="AdminExpenseDetail" 
        component={AdminExpenseDetailScreen}
        options={{ title: 'Détails de la dépense' }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
