import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { setupDatabase, getProducts, updateProduct} from '@/data/database';

export default function HomeScreen() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({stockLevel: 0, lowStockItems: 0, totalProducts: 0});

  useEffect(() => {
    setupDatabase();
  }, []);

  // Reload products when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadProducts();
    }, [])
  );

  // Load products function with safe filtering
  const loadProducts = () => {
    let data = getProducts() || [];
    data = data.filter(product => product && product.id !== undefined);
    setProducts(data);
    calculateStats(data);
  };

  // Calculate stats function
  const calculateStats = (data) => {
    const totalStock = data.reduce((sum, product) => sum + (product.quantity || 0), 0);
    const lowStockItems = data.filter(product => product.quantity < 10).length;
    setStats({
      stockLevel: totalStock,
      lowStockItems: lowStockItems,
      totalProducts: data.length,
    });
  };

  // Track stock status
  const getStockStatus = (quantity) => {
    if (quantity < 5) return { status: 'Out of Stock', color: '#ff4444' };
    if (quantity < 10) return { status: 'Low Stock', color: '#ff8800' };
    return { status: 'In Stock', color: '#00ff88' };
  };

  // Stats card rendering
  const renderStatCard = (title, value, subtitle, icon) => (
    <View style={styles.statCardWrapper}>
      <LinearGradient
        colors={['rgba(0,255,255,0.1)', 'rgba(0,255,255,0.05)']}
        style={styles.statCard}
      >
        <View style={styles.statHeader}>
          <Text style={styles.statTitle}>{title}</Text>
          <Ionicons name={icon} size={20} color="#00ffff" />
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statSubtitle}>{subtitle}</Text>
      </LinearGradient>
    </View>
  );

  // Function for getting the icon
  const getProductIcon = (productName = "") => {
    const name = productName.toLowerCase();
 if (name.includes('mouse')) return 'radio-outline';
  if (name.includes('cable')) return 'git-branch-outline';
  if (name.includes('monitor')) return 'tv-outline';
  if (name.includes('keyboard')) return 'keypad-outline';
  if (name.includes('laptop')) return 'laptop-outline';
  if (name.includes('phone')) return 'phone-portrait-outline';
  if (name.includes('headphone') || name.includes('earbud')) return 'headset-outline';
  if (name.includes('speaker')) return 'volume-high-outline';
  if (name.includes('camera')) return 'camera-outline';
  if (name.includes('charger')) return 'battery-charging-outline';
  if (name.includes('tablet')) return 'tablet-portrait-outline';
  
  // Clothing
  if (name.includes('cloth') || name.includes('round neck') || name.includes('shirt') || name.includes('tshirt') || name.includes('t-shirt')) return 'shirt-outline';
  if (name.includes('shoe') || name.includes('sneaker')) return 'footsteps-outline';
  if (name.includes('pant') || name.includes('trouser') || name.includes('jean')) return 'body-outline';
  if (name.includes('hat') || name.includes('cap')) return 'ellipse-outline';
  if (name.includes('jacket') || name.includes('coat') || name.includes('hoodie')) return 'shield-outline';
  if (name.includes('dress') || name.includes('skirt')) return 'ribbon-outline';
  if (name.includes('sock')) return 'footsteps-outline';
  
  // Accessories
  if (name.includes('bag') || name.includes('backpack')) return 'bag-outline';
  if (name.includes('watch')) return 'watch-outline';
  if (name.includes('glasses') || name.includes('sunglass')) return 'glasses-outline';
  if (name.includes('jewelry') || name.includes('necklace') || name.includes('ring')) return 'diamond-outline';
  if (name.includes('belt')) return 'remove-outline';
  
  // Food & Beverages
  if (name.includes('milk') || name.includes('bottle')) return 'nutrition-outline';
  if (name.includes('coffee') || name.includes('tea')) return 'cafe-outline';
  if (name.includes('water')) return 'water-outline';
  if (name.includes('food') || name.includes('snack')) return 'fast-food-outline';
  
  // Books & Stationery
  if (name.includes('book') || name.includes('notebook')) return 'book-outline';
  if (name.includes('pen') || name.includes('pencil')) return 'create-outline';
  if (name.includes('paper')) return 'document-outline';
  
  // Home & Office
  if (name.includes('chair')) return 'square-outline';
  if (name.includes('desk') || name.includes('table')) return 'grid-outline';
  if (name.includes('lamp') || name.includes('light')) return 'bulb-outline';
  
  return 'cube-outline';
  };

  // Function to render the product item
  const renderProductItem = ({ item }) => {
    const stockInfo = getStockStatus(item.quantity);

    return (
      <TouchableOpacity 
        onPress={() => router.push({
          pathname: '/view',
          params: {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          }
        })}
        activeOpacity={0.7}
      >
        <View style={styles.productCard}>
          <View style={styles.productIcon}>
            <Ionicons 
              name={getProductIcon(item.name)} 
              size={24} 
              color="#00ffff" 
            />
          </View>

          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productSKU}>SKU: {(item.id !== undefined ? item.id.toString().padStart(6, '0') : '')}</Text>
          </View>

          <View style={styles.productDetails}>
            <Text style={styles.productQuantity}>{item.quantity}</Text>
            <Text style={[styles.stockStatus, { color: stockInfo.color }]}>
              {stockInfo.status}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.editButton}
            onPress={(e) => {
              e.stopPropagation();
              router.push({
                pathname: '/EditProduct',
                params: {
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  image: item.image
                }
              });
            }}
          >
            <Ionicons name="create-outline" size={20} color="#00ffff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
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
          <Text style={styles.headerTitle}>STOREKEEPER INVENTORY</Text>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Power Button */}
          <View style={styles.powerSection}>
            <LinearGradient
              colors={['#00ffff', '#0099cc']}
              style={styles.powerButton}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.3)', 'transparent']}
                style={styles.powerButtonInner}
              >
                <Ionicons name="cube" size={40} color="#ffffff" />
              </LinearGradient>
            </LinearGradient>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navButtons}>
            <TouchableOpacity style={styles.navButton}> 
              <Ionicons name="grid-outline" size={20} color="#00ffff" />
              <Text style={styles.navButtonText}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
              <Ionicons name="analytics-outline" size={20} color="#00ffff" />
              <Text style={styles.navButtonText}>Analytics</Text>
            </TouchableOpacity>
          </View>

        {/* Statistics Cards - Better Layout */}
          <View style={styles.statsContainer}>
            {renderStatCard('STOCK LEVEL', stats.stockLevel.toString(), 'Overview', 'trending-up-outline')}
            {renderStatCard('LOW STOCK', stats.lowStockItems.toString(), 'Items', 'warning-outline')}
            {renderStatCard('PRODUCTS', stats.totalProducts.toString(), 'Total', 'cube-outline')}
          </View>

          {/* Product List Header */}
          <View style={styles.productListHeader}>
            <Text style={styles.productListTitle}>PRODUCT LIST</Text>
            <View style={styles.productListActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="funnel-outline" size={18} color="#00ffff" />
                <Text style={styles.actionText}>Sort</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="filter-outline" size={18} color="#00ffff" />
                <Text style={styles.actionText}>Filter</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Product List */}
          <FlatList
            data={products}
            keyExtractor={(item, index) => (item?.id !== undefined ? item.id.toString() : index.toString())}
            renderItem={renderProductItem}
            scrollEnabled={false}
            contentContainerStyle={styles.productList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="cube-outline" size={60} color="rgba(255,255,255,0.3)" />
                <Text style={styles.emptyText}>No products yet</Text>
                <Text style={styles.emptySubtext}>Add your first product to get started</Text>
              </View>
            }
          />

          {/* Add Product Button */}
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/explore')}
          >
            <LinearGradient
              colors={['#00ffff', '#0099cc']}
              style={styles.addButtonGradient}
            >
              <Ionicons name="add" size={24} color="#ffffff" />
              <Text style={styles.addButtonText}>Add Product</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  powerSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  powerButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  powerButtonInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.3)',
  },
  navButtonText: {
    color: '#ffffff',
    marginLeft: 8,
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    marginBottom: 20,
    gap: 13,
  },
  statCardWrapper: {
    width: '31%',
    minWidth: 100,
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.2)',
    height: 100,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  statTitle: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    flex: 1,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 9,
  },
  productListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  productListTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  productListActions: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  actionText: {
    color: '#00ffff',
    fontSize: 12,
    marginLeft: 5,
  },
  productList: {
    paddingHorizontal: 20,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#00ffff',
  },
  productIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productSKU: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  productDetails: {
    alignItems: 'flex-end',
    marginRight: 15,
  },
  productQuantity: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stockStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubtext: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    marginTop: 8,
  },
  addButton: {
    marginHorizontal: 20,
    marginVertical: 30,
  },
  addButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 25,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});