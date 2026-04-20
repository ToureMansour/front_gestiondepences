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
  Modal,
  Alert,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../services/api';
import { Expense } from '../types';

type AllExpensesScreenNavigationProp = StackNavigationProp<any, 'AllExpenses'>;

const AllExpensesScreen: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const navigation = useNavigation<AllExpensesScreenNavigationProp>();

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [expenses, searchQuery, selectedFilter]);

  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      const expensesData = await api.getAllExpenses();
      setExpenses(expensesData);
    } catch (error) {
      console.error('Error loading all expenses:', error);
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
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (expense.user && expense.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredExpenses(filtered);
  };

  const updateExpenseStatus = async (expenseId: number, status: 'approved' | 'rejected') => {
    try {
      const updatedExpense = await api.updateExpenseStatus(expenseId, status);
      
      // Mettre à jour la liste
      setExpenses(expenses.map(expense => 
        expense.id === expenseId ? updatedExpense : expense
      ));
      
      setShowStatusModal(false);
      setSelectedExpense(null);
      
      Alert.alert(
        'Succès',
        `Dépense ${status === 'approved' ? 'approuvée' : 'rejetée'} avec succès`
      );
    } catch (error: any) {
      console.error('Error updating expense status:', error);
      Alert.alert(
        'Erreur',
        error.response?.data?.message || 'Impossible de mettre à jour le statut'
      );
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

  const navigateToExpenseDetail = (expense: Expense) => {
    navigation.navigate('AdminExpenseDetail', { expense });
  };

  const openStatusModal = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowStatusModal(true);
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <TouchableOpacity
      style={styles.expenseCard}
      onPress={() => navigateToExpenseDetail(item)}
    >
      <View style={styles.expenseHeader}>
        <View style={styles.expenseTitleContainer}>
          <Text style={styles.expenseTitle}>{item.title}</Text>
          <Text style={styles.userName}>{item.user?.name}</Text>
        </View>
        <View style={styles.expenseStatusContainer}>
          <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
          {item.status === 'pending' && (
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => openStatusModal(item)}
            >
              <Icon name="more-vert" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
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
        <Text style={styles.title}>Toutes les dépenses</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une dépense ou un utilisateur..."
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
            </View>
          }
        />
      )}

      <Modal
        visible={showStatusModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Mettre à jour le statut
            </Text>
            <Text style={styles.modalExpenseTitle}>
              {selectedExpense?.title}
            </Text>
            <Text style={styles.modalAmount}>
              {selectedExpense && formatAmount(selectedExpense.amount)}
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.approveButton]}
                onPress={() => selectedExpense && updateExpenseStatus(selectedExpense.id, 'approved')}
              >
                <Icon name="check-circle" size={20} color="white" />
                <Text style={styles.modalButtonText}>Approuver</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.rejectButton]}
                onPress={() => selectedExpense && updateExpenseStatus(selectedExpense.id, 'rejected')}
              >
                <Icon name="cancel" size={20} color="white" />
                <Text style={styles.modalButtonText}>Rejeter</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.cancelModalButton}
              onPress={() => setShowStatusModal(false)}
            >
              <Text style={styles.cancelModalButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
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
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  expenseTitleContainer: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userName: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  expenseStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  quickAction: {
    marginLeft: 8,
    padding: 4,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    margin: 20,
    width: '90%',
    maxWidth: 350,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalExpenseTitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  cancelModalButton: {
    alignItems: 'center',
    padding: 10,
  },
  cancelModalButtonText: {
    color: '#666',
    fontSize: 14,
  },
});

export default AllExpensesScreen;
