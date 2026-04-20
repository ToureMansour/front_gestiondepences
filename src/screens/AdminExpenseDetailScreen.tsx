import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../services/api';
import { Expense } from '../types';

type AdminExpenseDetailScreenRouteProp = RouteProp<any, 'AdminExpenseDetail'>;
type AdminExpenseDetailScreenNavigationProp = StackNavigationProp<any, 'AdminExpenseDetail'>;

const AdminExpenseDetailScreen: React.FC = () => {
  const route = useRoute<AdminExpenseDetailScreenRouteProp>();
  const navigation = useNavigation<AdminExpenseDetailScreenNavigationProp>();
  const { expense: initialExpense } = route.params || {};
  
  const [expense, setExpense] = useState<Expense>(initialExpense);
  const [isLoading, setIsLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

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
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const updateExpenseStatus = async (status: 'approved' | 'rejected') => {
    setIsLoading(true);
    try {
      const updatedExpense = await api.updateExpenseStatus(expense.id, status);
      setExpense(updatedExpense);
      setShowStatusModal(false);
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
    } finally {
      setIsLoading(false);
    }
  };

  const openStatusModal = () => {
    if (expense.status === 'pending') {
      setShowStatusModal(true);
    }
  };

  const canUpdateStatus = expense.status === 'pending';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails de la dépense</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.userInfoContainer}>
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {expense.user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{expense.user?.name}</Text>
            <Text style={styles.userEmail}>{expense.user?.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(expense.status) }]}>
          <Text style={styles.statusText}>{getStatusText(expense.status)}</Text>
        </View>
        {canUpdateStatus && (
          <TouchableOpacity style={styles.updateStatusButton} onPress={openStatusModal}>
            <Icon name="edit" size={16} color="white" />
            <Text style={styles.updateStatusText}>Mettre à jour</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Informations de la dépense</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Titre</Text>
            <Text style={styles.value}>{expense.title}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{expense.description}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Montant</Text>
            <Text style={[styles.value, styles.amount]}>{formatAmount(expense.amount)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Date de création</Text>
            <Text style={styles.value}>{formatDate(expense.created_at)}</Text>
          </View>

          {expense.updated_at !== expense.created_at && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Dernière modification</Text>
              <Text style={styles.value}>{formatDate(expense.updated_at)}</Text>
            </View>
          )}
        </View>

        {expense.receipt_image && (
          <View style={styles.imageContainer}>
            <Text style={styles.sectionTitle}>Reçu</Text>
            <TouchableOpacity
              style={styles.imageWrapper}
              onPress={() => setShowImageModal(true)}
            >
              <Image source={{ uri: expense.receipt_image }} style={styles.receiptImage} />
              <View style={styles.imageOverlay}>
                <Icon name="zoom-in" size={24} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {canUpdateStatus && (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => updateExpenseStatus('approved')}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Icon name="check-circle" size={20} color="white" />
                  <Text style={styles.actionButtonText}>Approuver</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => updateExpenseStatus('rejected')}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Icon name="cancel" size={20} color="white" />
                  <Text style={styles.actionButtonText}>Rejeter</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

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
              {expense.title}
            </Text>
            <Text style={styles.modalAmount}>
              {formatAmount(expense.amount)}
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalApproveButton]}
                onPress={() => updateExpenseStatus('approved')}
                disabled={isLoading}
              >
                <Icon name="check-circle" size={20} color="white" />
                <Text style={styles.modalButtonText}>Approuver</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalRejectButton]}
                onPress={() => updateExpenseStatus('rejected')}
                disabled={isLoading}
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

      <Modal
        visible={showImageModal}
        transparent={true}
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.imageModalContainer}>
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={() => setShowImageModal(false)}
          >
            <Image
              source={{ uri: expense.receipt_image }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => setShowImageModal(false)}
          >
            <Icon name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userInfoContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  userAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  updateStatusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  updateStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  content: {
    padding: 20,
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailRow: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  imageContainer: {
    marginBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
    alignSelf: 'center',
  },
  receiptImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
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
  modalApproveButton: {
    backgroundColor: '#4CAF50',
  },
  modalRejectButton: {
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
  imageModalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '80%',
  },
  closeModalButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AdminExpenseDetailScreen;
