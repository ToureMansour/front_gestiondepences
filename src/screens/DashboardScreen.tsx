import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { Stats, Expense } from '../types';

const DashboardScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, expensesData] = await Promise.all([
        apiService.getStats(),
        apiService.getExpenses(),
      ]);
      setStats(statsData);
      setRecentExpenses(expensesData.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#FFA500';
      case 'APPROVED': return '#32CD32';
      case 'REJECTED': return '#FF0000';
      case 'PAID': return '#007AFF';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'APPROVED': return 'Approuvée';
      case 'REJECTED': return 'Refusée';
      case 'PAID': return 'Payée';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Bienvenue, {user?.name}!
        </Text>
        <Text style={styles.roleText}>
          {user?.role === 'admin' ? 'Administrateur' : 'Employé'}
        </Text>
      </View>

      {stats && (
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Statistiques</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.total_expenses}</Text>
              <Text style={styles.statLabel}>Total dépenses</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.pending_expenses}</Text>
              <Text style={styles.statLabel}>En attente</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.approved_expenses}</Text>
              <Text style={styles.statLabel}>Approuvées</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.paid_expenses}</Text>
              <Text style={styles.statLabel}>Payées</Text>
            </View>
          </View>
          <View style={styles.totalAmountCard}>
            <Text style={styles.totalAmountLabel}>Montant total</Text>
            <Text style={styles.totalAmountValue}>
              {stats.total_amount.toFixed(2)} FCFA
            </Text>
          </View>
        </View>
      )}

      <View style={styles.recentExpensesContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dépenses récentes</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(user?.role === 'admin' ? 'AllExpenses' : 'MyExpenses')}
          >
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        
        {recentExpenses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Aucune dépense récente</Text>
          </View>
        ) : (
          recentExpenses.map((expense) => (
            <TouchableOpacity
              key={expense.id}
              style={styles.expenseCard}
              onPress={() => navigation.navigate(
                user?.role === 'admin' ? 'AdminExpenseDetail' : 'ExpenseDetail',
                { expenseId: expense.id }
              )}
            >
              <View style={styles.expenseHeader}>
                <Text style={styles.expenseTitle}>{expense.title}</Text>
                <Text style={[styles.expenseStatus, { color: getStatusColor(expense.status) }]}>
                  {getStatusText(expense.status)}
                </Text>
              </View>
              <Text style={styles.expenseAmount}>{expense.amount.toFixed(2)} FCFA</Text>
              <Text style={styles.expenseDate}>
                {new Date(expense.expense_date).toLocaleDateString('fr-FR')}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {user?.role === 'employee' && (
        <TouchableOpacity
          style={styles.createExpenseButton}
          onPress={() => navigation.navigate('CreateExpense')}
        >
          <Text style={styles.createExpenseButtonText}>Créer une dépense</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  totalAmountCard: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  totalAmountLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  totalAmountValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  recentExpensesContainer: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#007AFF',
    fontSize: 14,
  },
  emptyState: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
  },
  expenseCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  expenseStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 12,
    color: '#666',
  },
  createExpenseButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  createExpenseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
