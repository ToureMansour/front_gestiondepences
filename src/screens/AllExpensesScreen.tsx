import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import apiService from '../services/api';
import { Expense } from '../types';

const AllExpensesScreen = ({ navigation }: any) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const statusOptions = [
    { label: 'Tous', value: 'ALL' },
    { label: 'En attente', value: 'PENDING' },
    { label: 'Approuvées', value: 'APPROVED' },
    { label: 'Refusées', value: 'REJECTED' },
    { label: 'Payées', value: 'PAID' },
  ];

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [expenses, searchText, statusFilter]);

  const loadExpenses = async () => {
    try {
      const expensesData = await apiService.getExpenses();
      setExpenses(expensesData);
    } catch (error) {
      console.error('Error loading expenses:', error);
      Alert.alert('Erreur', 'Impossible de charger les dépenses');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const filterExpenses = () => {
    let filtered = expenses;

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(expense => expense.status === statusFilter);
    }

    if (searchText) {
      filtered = filtered.filter(expense =>
        expense.title.toLowerCase().includes(searchText.toLowerCase()) ||
        expense.description.toLowerCase().includes(searchText.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchText.toLowerCase()) ||
        expense.user?.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredExpenses(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadExpenses();
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

  const renderExpense = ({ item }: { item: Expense }) => (
    <TouchableOpacity
      style={styles.expenseCard}
      onPress={() => navigation.navigate('AdminExpenseDetail', { expenseId: item.id })}
    >
      <View style={styles.expenseHeader}>
        <View style={styles.expenseTitleContainer}>
          <Text style={styles.expenseTitle}>{item.title}</Text>
          <Text style={styles.employeeName}>{item.user?.name}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <Text style={styles.expenseCategory}>{item.category}</Text>
      <Text style={styles.expenseDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.expenseFooter}>
        <Text style={styles.expenseAmount}>{item.amount.toFixed(2)} FCFA</Text>
        <Text style={styles.expenseDate}>
          {new Date(item.expense_date).toLocaleDateString('fr-FR')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderStatusFilter = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        statusFilter === item.value && styles.filterButtonSelected,
      ]}
      onPress={() => setStatusFilter(item.value)}
    >
      <Text
        style={[
          styles.filterButtonText,
          statusFilter === item.value && styles.filterButtonTextSelected,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Toutes les Dépenses</Text>
        <Text style={styles.expenseCount}>{filteredExpenses.length} dépense(s)</Text>
      </View>

      <View style={styles.filtersContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          value={searchText}
          onChangeText={setSearchText}
        />
        
        <FlatList
          data={statusOptions}
          renderItem={renderStatusFilter}
          keyExtractor={(item) => item.value}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        />
      </View>

      <FlatList
        data={filteredExpenses}
        renderItem={renderExpense}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Aucune dépense trouvée</Text>
          </View>
        }
      />
    </View>
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
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  expenseCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  filterList: {
    paddingRight: 20,
  },
  filterButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  filterButtonSelected: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#333',
  },
  filterButtonTextSelected: {
    color: '#fff',
  },
  listContainer: {
    padding: 20,
  },
  expenseCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  expenseTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  employeeName: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  expenseCategory: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 4,
  },
  expenseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  expenseDate: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
  },
});

export default AllExpensesScreen;
