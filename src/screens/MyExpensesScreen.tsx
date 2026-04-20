import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../services/api';
import { Expense } from '../types';

type MyExpensesScreenNavigationProp = StackNavigationProp<any, 'MyExpenses'>;

const MyExpensesScreen: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const navigation = useNavigation<MyExpensesScreenNavigationProp>();

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [expenses, searchQuery, selectedFilter]);

  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      const expensesData = await api.getExpenses();
      setExpenses(expensesData);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterExpenses = () => {
    let filtered = expenses;

    // Filtrer par statut
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(expense => expense.status === selectedFilter);
    }

    // Filtrer par recherche
    if (searchQuery) {
      filtered = filtered.filter(expense =>
        expense.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredExpenses(filtered);
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

  const navigateToExpenseDetail = (expense: Expense) => {
    navigation.navigate('ExpenseDetail', { expense });
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <TouchableOpacity
      style={styles.expenseCard}
      onPress={() => navigateToExpenseDetail(item)}
    >
      <View style={styles.expenseHeader}>
        <Text style={styles.expenseTitle}>{item.title}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {getStatusText(item.status)}
        </Text>
      </View>
      
      <Text style={styles.expenseDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.expenseFooter}>
        <Text style={styles.amount}>{formatAmount(item.amount)}</Text>
        <Text style={styles.date}>{formatDate(item.created_at)}</Text>
      </View>
      
      {item.receipt_image && (
        <View style={styles.imageIndicator}>
          <Icon name="image" size={16} color="#007AFF" />
          <Text style={styles.imageText}>Reçu joint</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderFilterButton = (filter: typeof selectedFilter, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes dépenses</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateExpense')}>
          <Icon name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une dépense..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filtersContainer}>
        {renderFilterButton('all', 'Toutes')}
        {renderFilterButton('pending', 'En attente')}
        {renderFilterButton('approved', 'Approuvées')}
        {renderFilterButton('rejected', 'Rejetées')}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={filteredExpenses}
          renderItem={renderExpenseItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={loadExpenses} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="receipt-long" size={48} color="#ccc" />
              <Text style={styles.emptyText}>
                {searchQuery || selectedFilter !== 'all'
                  ? 'Aucune dépense trouvée'
                  : 'Aucune dépense enregistrée'}
              </Text>
              <TouchableOpacity
                style={styles.createFirstButton}
                onPress={() => navigation.navigate('CreateExpense')}
              >
                <Text style={styles.createFirstButtonText}>Créer ma première dépense</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  listContainer: {
    padding: 15,
  },
  expenseCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  status: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  expenseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  imageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  imageText: {
    fontSize: 12,
    color: '#007AFF',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    marginBottom: 20,
  },
  createFirstButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createFirstButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MyExpensesScreen;
