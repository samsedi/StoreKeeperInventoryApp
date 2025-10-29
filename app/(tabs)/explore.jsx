import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { addProduct } from '@/data/database';

export default function AddProductScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState(null);

  const takePhoto = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera access is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddProduct = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter product name');
      return;
    }
    if (!price || isNaN(parseFloat(price))) {
      Alert.alert('Error', 'Please enter valid price');
      return;
    }
    if (!quantity || isNaN(parseInt(quantity))) {
      Alert.alert('Error', 'Please enter valid quantity');
      return;
    }

    try {
      addProduct({
        name: name.trim(),
        price: parseFloat(price),
        quantity: parseInt(quantity),
        image: image || null
      });

      Alert.alert('Success', 'Product added successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add product');
    }
  };

  return (
    <LinearGradient
      colors={['#0a0a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0a0a2e" />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.headerButton}>Add</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Product</Text>
            <View style={styles.headerButton} />
          </View>

          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['rgba(0,255,255,0.3)', 'rgba(0,255,255,0.1)']}
                style={styles.inputGradient}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={name}
                  onChangeText={setName}
                />
              </LinearGradient>
            </View>

            {/* Price Input */}
            <Text style={styles.label}>Price</Text>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['rgba(0,255,255,0.3)', 'rgba(0,255,255,0.1)']}
                style={styles.inputGradient}
              >
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
                <Ionicons 
                  name="chevron-down" 
                  size={24} 
                  color="rgba(255,255,255,0.5)" 
                  style={styles.inputIcon}
                />
              </LinearGradient>
            </View>

            {/* Quantity Input */}
            <Text style={styles.label}>Quantity</Text>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['rgba(0,255,255,0.3)', 'rgba(0,255,255,0.1)']}
                style={styles.inputGradient}
              >
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="number-pad"
                />
                <Ionicons 
                  name="chevron-down" 
                  size={24} 
                  color="rgba(255,255,255,0.5)" 
                  style={styles.inputIcon}
                />
              </LinearGradient>
            </View>

            {/* Image Preview */}
            {image && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: image }} style={styles.imagePreview} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setImage(null)}
                >
                  <Ionicons name="close-circle" size={30} color="#ff4444" />
                </TouchableOpacity>
              </View>
            )}

            {/* Image Buttons */}
            <Text style={styles.label}>Image</Text>
            <View style={styles.imageButtons}>
              <TouchableOpacity 
                style={styles.imageButtonContainer}
                onPress={pickImage}
              >
                <LinearGradient
                  colors={['rgba(0,255,255,0.3)', 'rgba(0,255,255,0.1)']}
                  style={styles.squareButton}
                >
                  <Ionicons name="images" size={40} color="#00ffff" />
                </LinearGradient>
                <Text style={styles.imageButtonLabel}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.imageButtonContainer}
                onPress={takePhoto}
              >
                <View style={styles.scanButton}>
                  <Ionicons name="camera" size={40} color="#0a0a2e" />
                </View>
                <Text style={styles.imageButtonLabel}>Camera</Text>
              </TouchableOpacity>
            </View>

            {/* Upload Info Text */}
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={image ? takePhoto : pickImage}
            >
              <LinearGradient
                colors={['#00ffff', '#0099cc']}
                style={styles.uploadGradient}
              >
                <Text style={styles.uploadText}>
                  {image ? 'Image Selected ✓' : 'Select Image'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>

          {/* Bottom Actions */}
          <View style={styles.bottomActions}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.previousButton}>Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.powerButtonContainer}
              onPress={handleAddProduct}
            >
              <View style={styles.powerButton}>
                <Ionicons name="add" size={32} color="#00ffff" />
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerButton: {
    width: 60,
    color: '#ffffff',
    fontSize: 16,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  label: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    marginBottom: 12,
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputGradient: {
    borderRadius: 30,
    padding: 2,
  },
  input: {
    backgroundColor: 'rgba(22,33,62,0.8)',
    borderRadius: 28,
    paddingHorizontal: 25,
    paddingVertical: 18,
    color: '#ffffff',
    fontSize: 16,
  },
  inputIcon: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginTop: 20,
    position: 'relative',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#00ffff',
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: '30%',
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  imageButtonContainer: {
    alignItems: 'center',
  },
  squareButton: {
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  scanButton: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#00ffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButtonLabel: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 14,
  },
  uploadButton: {
    marginTop: 40,
    marginBottom: 20,
  },
  uploadGradient: {
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
  },
  uploadText: {
    color: '#0a0a2e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  previousButton: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
  },
  powerButtonContainer: {
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 15,
  },
  powerButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0,255,255,0.2)',
    borderWidth: 3,
    borderColor: '#00ffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});