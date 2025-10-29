import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Alert,
  Image,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { deleteProduct } from '@/data/database';

export default function ViewProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get product details from params
  const product = {
    id: params.id,
    name: params.name || 'Product Name',
    price: params.price || '0.00',
    quantity: params.quantity || '0',
    image: params.image || null
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            try {
              deleteProduct(product.id);
              Alert.alert('Success', 'Product deleted successfully!', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete product');
            }
          }
        }
      ]
    );
  };

  const handleEdit = () => {
    router.push({
      pathname: '/EditProduct',
      params: product
    });
  };

  return (
    <LinearGradient
      colors={['#0a0a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0a0a2e" />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="share-outline" size={24} color="#00ffff" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Product Image */}
          <View style={styles.imageContainer}>
            <LinearGradient
              colors={['rgba(0,255,255,0.3)', 'rgba(0,255,255,0.1)']}
              style={styles.imageGradient}
            >
              {product.image ? (
                <Image 
                  source={{ uri: product.image }} 
                  style={styles.productImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <Ionicons name="image-outline" size={80} color="#00ffff" />
                </View>
              )}
            </LinearGradient>
          </View>

          {/* Product Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.productName}>{product.name}</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Price:</Text>
              <Text style={styles.detailValue}>₦{parseFloat(product.price).toFixed(2)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Quantity:</Text>
              <Text style={styles.detailValue}>{product.quantity}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.editButtonContainer}
              onPress={handleEdit}
            >
              <LinearGradient
                colors={['#00ffff', '#0099cc']}
                style={styles.editButton}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.deleteButtonContainer}
              onPress={handleDelete}
            >
              <View style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  imageGradient: {
    width: 500,
    height: 500,
    borderRadius: 20,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    marginBottom: 40,
  },
  productName: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 18,
    fontWeight: '600',
  },
  detailValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginBottom: 30,
  },
  editButtonContainer: {
    flex: 1,
  },
  editButton: {
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#0a0a2e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButtonContainer: {
    flex: 1,
  },
  deleteButton: {
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#00ffff',
  },
  deleteButtonText: {
    color: '#00ffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});