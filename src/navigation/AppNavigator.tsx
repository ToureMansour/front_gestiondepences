import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import DashboardScreen from '../screens/DashboardScreen';
import MyExpensesScreen from '../screens/MyExpensesScreen';
import CreateExpenseScreen from '../screens/CreateExpenseScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AllExpensesScreen from '../screens/AllExpensesScreen';
import ExpenseDetailScreen from '../screens/ExpenseDetailScreen';
import AdminExpenseDetailScreen from '../screens/AdminExpenseDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const EmployeeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MyExpenses') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'CreateExpense') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="MyExpenses" component={MyExpensesScreen} />
      <Tab.Screen name="CreateExpense" component={CreateExpenseScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AdminTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AllExpenses') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="AllExpenses" component={AllExpensesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppStack = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator>
      {user?.role === 'admin' ? (
        <>
          <Stack.Screen 
            name="AdminTabs" 
            component={AdminTabs} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="AdminExpenseDetail" 
            component={AdminExpenseDetailScreen}
            options={{ title: 'Détails Dépense' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen 
            name="EmployeeTabs" 
            component={EmployeeTabs} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="ExpenseDetail" 
            component={ExpenseDetailScreen}
            options={{ title: 'Détails Dépense' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppStack;
