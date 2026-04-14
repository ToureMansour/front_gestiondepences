import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import apiService from '../services/api';
import { Expense } from '../types';

const AdminExpenseDetailScreen = ({ route, navigation }: any) => {
  const { expenseId } = route.params;
  const [expense, setExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadExpenseDetail();
  }, [expenseId]);

  const loadExpenseDetail = async () => {
    try {
      const expenseData = await apiService.getExpense(expenseId);
      setExpense(expenseData);
    } catch (error) {
      console.error('Error loading expense detail:', error);
      Alert.alert('Erreur', 'Impossible de charger les détails de la dépense');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (expense?.status !== 'PENDING') {
      Alert.alert('Erreur', 'Seules les dépenses en attente peuvent être approuvées');
      return;
    }

    setActionLoading(true);
    try {
      const updatedExpense = await apiService.approveExpense(expenseId);
      setExpense(updatedExpense);
      Alert.alert('Succès', 'Dépense approuvée avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'approuver la dépense');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (expense?.status !== 'PENDING') {
      Alert.alert('Erreur', 'Seules les dépenses en attente peuvent être refusées');
      return;
    }

    Alert.alert(
      'Refuser la dépense',
      'Êtes-vous sûr de vouloir refuser cette dépense ?',
      [
        {
          text: 'Non',
          style: 'cancel',
        },
        {
          text: 'Oui',
          onPress: async () => {
            setActionLoading(true);
            try {
              const updatedExpense = await apiService.rejectExpense(expenseId);
              setExpense(updatedExpense);
              Alert.alert('Succès', 'Dépense refusée avec succès');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de refuser la dépense');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleMarkAsPaid = async () => {
    if (expense?.status !== 'APPROVED') {
      Alert.alert('Erreur', 'Seules les dépenses approuvées peuvent être marquées comme payées');
      return;
    }

    setActionLoading(true);
    try {
      const updatedExpense = await apiService.markExpenseAsPaid(expenseId);
      setExpense(updatedExpense);
      Alert.alert('Succès', 'Dépense marquée comme payée avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de marquer la dépense comme payée');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#FFA500';
      case 'APPROVED': return '#32CD32';
      case 'REJECTED': return '#FF0000';
      case 'PAID': return '#007AFF';
      case 'CANCELLED': return '#666';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'APPROVED': return 'Approuvée';
      case 'REJECTED': return 'Refusée';
      case 'PAID': return 'Payée';
      case 'CANCELLED': return 'Annulée';
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

  if (!expense) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Dépense non trouvée</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{expense.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(expense.status) }]}>
            <Text style={styles.statusText}>{getStatusText(expense.status)}</Text>
          </View>
        </View>

        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Montant</Text>
          <Text style={styles.amount}>{expense.amount.toFixed(2)} FCFA</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Catégorie</Text>
            <Text style={styles.infoValue}>{expense.category}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date de dépense</Text>
            <Text style={styles.infoValue}>
              {new Date(expense.expense_date).toLocaleDateString('fr-FR')}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date de création</Text>
            <Text style={styles.infoValue}>
              {new Date(expense.created_at).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{expense.description}</Text>
        </View>

        {expense.proof_image && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Justificatif</Text>
            <Image 
              source={{ uri: expense.proof_image }} 
              style={styles.proofImage}
              resizeMode="contain"
            />
          </View>
        )}

        {expense.user && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations employé</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nom</Text>
              <Text style={styles.infoValue}>{expense.user.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{expense.user.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Rôle</Text>
              <Text style={styles.infoValue}>
                {expense.user.role === 'admin' ? 'Administrateur' : 'Employé'}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.actionsContainer}>
          {expense.status === 'PENDING' && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={handleApprove}
                disabled={actionLoading}
              >
                <Text style={styles.approveButtonText}>Approuver</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={handleReject}
                disabled={actionLoading}
              >
                <Text style={styles.rejectButtonText}>Refuser</Text>
              </TouchableOpacity>
            </View>
          )}

          {expense.status === 'APPROVED' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.paidButton]}
              onPress={handleMarkAsPaid}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.paidButtonText}>Marquer comme payée</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    padding: 20,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  amountSection: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  amountLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
  amount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    flex: 2,
    textAlign: 'right',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  proofImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  actionsContainer: {
    marginTop: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#32CD32',
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rejectButton: {
    backgroundColor: '#FF0000',
  },
  rejectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paidButton: {
    backgroundColor: '#007AFF',
  },
  paidButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminExpenseDetailScreen;
