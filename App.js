import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import NewListScreen from './screens/NewListScreen';
import EditListScreen from './screens/EditListScreen';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListDetailScreen from './screens/ListDetailScreen';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation, route }) {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedListId, setSelectedListId] = useState(null);

  React.useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      const savedLists = await AsyncStorage.getItem('shoppingLists');
      if (savedLists) {
        const parsedLists = JSON.parse(savedLists);
        setShoppingLists(parsedLists);
      }
    } catch (error) {
      console.error('Listeler yüklenirken hata:', error);
    }
  };

  const saveLists = async (newLists) => {
    try {
      await AsyncStorage.setItem('shoppingLists', JSON.stringify(newLists));
      setShoppingLists(newLists);
    } catch (error) {
      console.error('Listeler kaydedilirken hata:', error);
    }
  };

  React.useEffect(() => {
    const handleNewOrUpdatedList = async () => {
      if (route.params?.newList) {
        const currentLists = await AsyncStorage.getItem('shoppingLists');
        const parsedLists = currentLists ? JSON.parse(currentLists) : [];

        const updatedLists = [
          {
            ...route.params.newList,
            itemCount: route.params.newList.items.length
          },
          ...parsedLists
        ];

        await saveLists(updatedLists);
        navigation.setParams({ newList: null });
      } else if (route.params?.updatedList) {
        const currentLists = await AsyncStorage.getItem('shoppingLists');
        const parsedLists = currentLists ? JSON.parse(currentLists) : [];

        const updatedLists = parsedLists.map(list =>
          list.id === route.params.updatedList.id
            ? { ...route.params.updatedList }
            : list
        );

        await saveLists(updatedLists);
        navigation.setParams({ updatedList: null });
      }
    };

    handleNewOrUpdatedList();
  }, [route.params?.newList, route.params?.updatedList]);

  const handleDeleteList = async (listId) => {
    try {
      const updatedLists = shoppingLists.filter(list => list.id !== listId);
      await AsyncStorage.setItem('shoppingLists', JSON.stringify(updatedLists));
      setShoppingLists(updatedLists);
      setDeleteModalVisible(false);
      setSelectedListId(null);
    } catch (error) {
      console.error('Liste silinirken hata:', error);
    }
  };

  const showDeleteConfirmation = (listId) => {
    setSelectedListId(listId);
    setDeleteModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => navigation.navigate('ListDetail', { list: item })}
    >
      <View style={styles.listContent}>
        <View style={styles.listInfo}>
          <Text style={styles.listTitle}>{item.title}</Text>
          <Text style={styles.listDate}>{item.date}</Text>
          {item.store && (
            <Text style={styles.storeText}>{item.store}</Text>
          )}
        </View>
        <View style={styles.rightContent}>
          <Text style={styles.itemCount}>{item.itemCount} ürün</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={(e) => {
                e.stopPropagation();
                navigation.navigate('EditList', { list: item });
              }}
            >
              <Ionicons name="pencil" size={20} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, styles.deleteButton]}
              onPress={(e) => {
                e.stopPropagation();
                showDeleteConfirmation(item.id);
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DoneCart</Text>
      </View>

      <FlatList
        data={shoppingLists}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Henüz liste oluşturmadınız</Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('NewList')}
      >
        <Text style={styles.addButtonText}>+ Yeni Liste</Text>
      </TouchableOpacity>

      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Ionicons name="warning-outline" size={48} color="#FF3B30" />
            <Text style={styles.modalTitle}>Listeyi Sil</Text>
            <Text style={styles.modalText}>
              Bu listeyi silmek istediğinizden emin misiniz?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteModalButton]}
                onPress={() => handleDeleteList(selectedListId)}
              >
                <Text style={styles.deleteButtonText}>Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewList"
          component={NewListScreen}
          options={{
            title: 'Yeni Liste',
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: '#333',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="EditList"
          component={EditListScreen}
          options={{
            title: 'Listeyi Düzenle',
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: '#333',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="ListDetail"
          component={ListDetailScreen}
          options={{
            title: 'Alışveriş Listesi',
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: '#333',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  header: {
    height: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    flex: 1,
    padding: 16,
  },
  listItem: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  listContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listInfo: {
    flex: 1,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  listDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  itemCount: {
    color: '#666',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 32,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
  },
  storeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  deleteButton: {
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '80%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E5E5EA',
  },
  deleteModalButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
