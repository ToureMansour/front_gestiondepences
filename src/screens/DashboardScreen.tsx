import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Expense, User } from '../types';

const DashboardScreen: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const expensesData = user?.role === 'admin' 
        ? await api.getAllExpenses()
        : await api.getExpenses();
      
      setExpenses(expensesData.slice(0, 5)); // Afficher les 5 dernières dépenses
      
      // Calculer les statistiques
      const total = expensesData.reduce((sum, expense) => sum + expense.amount, 0);
      const pending = expensesData.filter(e => e.status === 'pending').length;
      const approved = expensesData.filter(e => e.status === 'approved').length;
      const rejected = expensesData.filter(e => e.status === 'rejected').length;
      
      setStats({ total, pending, approved, rejected });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#4CAF50';
      case 'rejected':
        return '#F44336';
      case 'pending':
        return '#FF9800';
      default:
        return '#757575';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvée';
      case 'rejected':
        return 'Rejetée';
      case 'pending':
        return 'En attente';
      default:
        return status;
    }
  };

  const formatAmount = (amount: number) => {
    return `${amount.toFixed(2)} FCFA`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={loadData} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>
            Bienvenue, {user?.name}!
          </Text>
          <Text style={styles.roleText}>
            {user?.role === 'admin' ? 'Administrateur' : 'Employé'}
          </Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Icon name="logout" size={24} color="#FF5252" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="account-balance-wallet" size={32} color="#007AFF" />
          <Text style={styles.statValue}>{formatAmount(stats.total)}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="hourglass-empty" size={32} color="#FF9800" />
          <Text style={styles.statValue}>{stats.pending}</Text>
          <Text style={styles.statLabel}>En attente</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="check-circle" size={32} color="#4CAF50" />
          <Text style={styles.statValue}>{stats.approved}</Text>
          <Text style={styles.statLabel}>Approuvées</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="cancel" size={32} color="#F44336" />
          <Text style={styles.statValue}>{stats.rejected}</Text>
          <Text style={styles.statLabel}>Rejetées</Text>
        </View>
      </View>

      <View style={styles.recentExpensesContainer}>
        <Text style={styles.sectionTitle}>Dépenses récentes</Text>
        {expenses.map((expense) => (
          <View key={expense.id} style={styles.expenseCard}>
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseTitle}>{expense.title}</Text>
              <Text style={styles.expenseDate}>
                {formatDate(expense.created_at)}
                {expense.user && ` - ${expense.user.name}`}
              </Text>
            </View>
            <View style={styles.expenseAmount}>
              <Text style={styles.amount}>{formatAmount(expense.amount)}</Text>
              <Text style={[styles.status, { color: getStatusColor(expense.status) }]}>
                {getStatusText(expense.status)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  roleText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  recentExpensesContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  expenseCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  expenseDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  expenseAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});

export default DashboardScreen;
