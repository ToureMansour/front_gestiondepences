import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../services/api';
import { CreateExpenseRequest } from '../types';

type CreateExpenseScreenNavigationProp = StackNavigationProp<any, 'CreateExpense'>;

const CreateExpenseScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigation = useNavigation<CreateExpenseScreenNavigationProp>();

  const pickImage = async () => {
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
        setReceiptImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à la caméra pour prendre une photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setReceiptImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Erreur', 'Impossible de prendre la photo');
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !amount) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide');
      return;
    }

    setIsLoading(true);
    try {
      let imageUrl: string | undefined;

      if (receiptImage) {
        setIsUploading(true);
        try {
          imageUrl = await api.uploadImage(receiptImage);
        } catch (error) {
          console.error('Error uploading image:', error);
          Alert.alert('Avertissement', 'La photo n\'a pas pu être téléchargée, mais la dépense sera enregistrée sans image.');
        } finally {
          setIsUploading(false);
        }
      }

      const expenseData: CreateExpenseRequest = {
        title,
        description,
        amount: amountValue,
        receipt_image: imageUrl,
      };

      await api.createExpense(expenseData);
      
      Alert.alert(
        'Succès',
        'Dépense créée avec succès',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error creating expense:', error);
      Alert.alert(
        'Erreur',
        error.response?.data?.message || 'Impossible de créer la dépense'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Nouvelle dépense</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Titre *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Titre de la dépense"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Description détaillée de la dépense"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Montant (FCFA) *</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.imageContainer}>
          <Text style={styles.label}>Reçu (optionnel)</Text>
          
          {receiptImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: receiptImage }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setReceiptImage(null)}
              >
                <Icon name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imageButtonsContainer}>
              <TouchableOpacity
                style={[styles.imageButton, styles.galleryButton]}
                onPress={pickImage}
              >
                <Icon name="photo-library" size={24} color="white" />
                <Text style={styles.imageButtonText}>Galerie</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.imageButton, styles.cameraButton]}
                onPress={takePhoto}
              >
                <Icon name="camera-alt" size={24} color="white" />
                <Text style={styles.imageButtonText}>Appareil photo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading || isUploading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isUploading ? 'Téléchargement...' : 'Créer la dépense'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
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
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
  },
  imageContainer: {
    marginBottom: 20,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  galleryButton: {
    backgroundColor: '#007AFF',
  },
  cameraButton: {
    backgroundColor: '#4CAF50',
  },
  imageButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  imagePreviewContainer: {
    position: 'relative',
    alignSelf: 'center',
  },
  imagePreview: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#FF5252',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateExpenseScreen;
