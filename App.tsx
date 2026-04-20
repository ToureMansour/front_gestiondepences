import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppStack from './src/navigation/AppNavigator';
import { useAuth } from './src/context/AuthContext';
import { StatusBar } from 'expo-status-bar';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return user ? <AppStack /> : <AuthNavigator />;
};

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <AppContent />
        <StatusBar style="auto" />
      </AuthProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
});
