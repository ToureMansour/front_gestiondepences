import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../services/api';
import { Expense, CreateExpenseRequest } from '../types';
import * as ImagePicker from 'expo-image-picker';

type ExpenseDetailScreenRouteProp = RouteProp<any, 'ExpenseDetail'>;
type ExpenseDetailScreenNavigationProp = StackNavigationProp<any, 'ExpenseDetail'>;

const ExpenseDetailScreen: React.FC = () => {
  const route = useRoute<ExpenseDetailScreenRouteProp>();
  const navigation = useNavigation<ExpenseDetailScreenNavigationProp>();
  const { expense: initialExpense } = route.params || {};
  
  const [expense, setExpense] = useState<Expense>(initialExpense);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editedExpense, setEditedExpense] = useState<CreateExpenseRequest>({
    title: initialExpense.title,
    description: initialExpense.description,
    amount: initialExpense.amount,
    receipt_image: initialExpense.receipt_image,
  });

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

  const pickNewImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à la galerie pour sélectionner une image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsLoading(true);
        try {
          const imageUrl = await api.uploadImage(result.assets[0].uri);
          setEditedExpense({ ...editedExpense, receipt_image: imageUrl });
        } catch (error) {
          console.error('Error uploading image:', error);
          Alert.alert('Erreur', 'Impossible de télécharger la nouvelle image');
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
  };

  const handleSave = async () => {
    if (!editedExpense.title || !editedExpense.description || !editedExpense.amount) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    try {
      const updatedExpense = await api.updateExpense(expense.id, editedExpense);
      setExpense(updatedExpense);
      setIsEditing(false);
      Alert.alert('Succès', 'Dépense mise à jour avec succès');
    } catch (error: any) {
      console.error('Error updating expense:', error);
      Alert.alert(
        'Erreur',
        error.response?.data?.message || 'Impossible de mettre à jour la dépense'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer cette dépense ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await api.deleteExpense(expense.id);
              Alert.alert(
                'Succès',
                'Dépense supprimée avec succès',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } catch (error: any) {
              console.error('Error deleting expense:', error);
              Alert.alert(
                'Erreur',
                error.response?.data?.message || 'Impossible de supprimer la dépense'
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const canEdit = expense.status === 'pending';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails de la dépense</Text>
        {canEdit && (
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Icon name="edit" size={24} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(expense.status) }]}>
          <Text style={styles.statusText}>{getStatusText(expense.status)}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {isEditing ? (
          <View style={styles.editContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Titre</Text>
              <TextInput
                style={styles.input}
                value={editedExpense.title}
                onChangeText={(text) => setEditedExpense({ ...editedExpense, title: text })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedExpense.description}
                onChangeText={(text) => setEditedExpense({ ...editedExpense, description: text })}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Montant (FCFA)</Text>
              <TextInput
                style={styles.input}
                value={editedExpense.amount.toString()}
                onChangeText={(text) => setEditedExpense({ ...editedExpense, amount: parseFloat(text) || 0 })}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.editButtonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setIsEditing(false);
                  setEditedExpense({
                    title: expense.title,
                    description: expense.description,
                    amount: expense.amount,
                    receipt_image: expense.receipt_image,
                  });
                }}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Enregistrer</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.detailsContainer}>
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
        )}

        {expense.receipt_image && (
          <View style={styles.imageContainer}>
            <Text style={styles.label}>Reçu</Text>
            <TouchableOpacity
              style={styles.imageWrapper}
              onPress={() => setShowImageModal(true)}
            >
              <Image source={{ uri: expense.receipt_image }} style={styles.receiptImage} />
              <View style={styles.imageOverlay}>
                <Icon name="zoom-in" size={24} color="white" />
              </View>
            </TouchableOpacity>

            {isEditing && (
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={pickNewImage}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.changeImageText}>Changer l'image</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

        {canEdit && !isEditing && (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.deleteButtonText}>Supprimer</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal
        visible={showImageModal}
        transparent={true}
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modalContainer}>
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
  statusContainer: {
    padding: 20,
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  editContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  detailRow: {
    marginBottom: 20,
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
    marginTop: 20,
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
  changeImageButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  changeImageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    marginTop: 20,
  },
  actionButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
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

export default ExpenseDetailScreen;
