import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    Modal,
    Image,
    FlatList
} from 'react-native';
import { stores } from '../data/stores';

export default function NewListScreen({ navigation }) {
    const [listName, setListName] = useState('');
    const [selectedStore, setSelectedStore] = useState(null);
    const [items, setItems] = useState([]);
    const [newItemName, setNewItemName] = useState('');
    const [isStoreModalVisible, setIsStoreModalVisible] = useState(false);

    const addItem = () => {
        if (newItemName.trim() === '') {
            Alert.alert('Uyarı', 'Ürün adı boş olamaz!');
            return;
        }
        const newItem = {
            id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: newItemName
        };
        setItems([...items, newItem]);
        setNewItemName('');
    };

    const removeItem = (itemId) => {
        setItems(items.filter(item => item.id !== itemId));
    };

    const createList = () => {
        if (listName.trim() === '') {
            Alert.alert('Uyarı', 'Liste adı zorunludur!');
            return;
        }

        const newList = {
            id: `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: listName,
            store: selectedStore?.name || '',
            items: items,
            date: new Date().toLocaleDateString('tr-TR'),
        };

        navigation.navigate('Home', { newList });
    };

    const renderStoreItem = ({ item }) => (
        <TouchableOpacity
            style={styles.storeItem}
            onPress={() => {
                setSelectedStore(item);
                setIsStoreModalVisible(false);
            }}
        >
            <Image source={item.logo} style={styles.storeLogo} />
            <Text style={styles.storeItemText}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Liste Adı *</Text>
                <TextInput
                    style={styles.input}
                    value={listName}
                    onChangeText={setListName}
                    placeholder="Liste adını giriniz"
                />

                <Text style={styles.label}>Market Seçin</Text>
                <TouchableOpacity
                    style={styles.storeSelector}
                    onPress={() => setIsStoreModalVisible(true)}
                >
                    {selectedStore ? (
                        <View style={styles.selectedStore}>
                            <Image source={selectedStore.logo} style={styles.selectedStoreLogo} />
                            <Text style={styles.selectedStoreText}>{selectedStore.name}</Text>
                        </View>
                    ) : (
                        <Text style={styles.storePlaceholder}>Market seçiniz (opsiyonel)</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.itemsContainer}>
                <Text style={styles.label}>Ürünler</Text>

                <View style={styles.addItemContainer}>
                    <TextInput
                        style={[styles.input, styles.itemInput]}
                        value={newItemName}
                        onChangeText={setNewItemName}
                        placeholder="Ürün adı"
                    />
                    <TouchableOpacity style={styles.addItemButton} onPress={addItem}>
                        <Text style={styles.addItemButtonText}>Ekle</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.itemsList}>
                    {items.map(item => (
                        <View key={item.id} style={styles.itemRow}>
                            <Text style={styles.itemText}>{item.name}</Text>
                            <TouchableOpacity
                                onPress={() => removeItem(item.id)}
                                style={styles.removeButton}
                            >
                                <Text style={styles.removeButtonText}>Sil</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>

            <TouchableOpacity
                style={styles.createButton}
                onPress={createList}
            >
                <Text style={styles.createButtonText}>Liste Oluştur</Text>
            </TouchableOpacity>

            <Modal
                visible={isStoreModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsStoreModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Market Seçin</Text>
                            <TouchableOpacity
                                onPress={() => setIsStoreModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={stores}
                            renderItem={renderStoreItem}
                            keyExtractor={item => item.id}
                            style={styles.storeList}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: '#f8f8f8',
    },
    itemsContainer: {
        flex: 1,
    },
    addItemContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    itemInput: {
        flex: 1,
        marginBottom: 0,
        marginRight: 8,
    },
    addItemButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center',
    },
    addItemButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    itemsList: {
        flex: 1,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        marginBottom: 8,
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    removeButton: {
        backgroundColor: '#FF3B30',
        padding: 8,
        borderRadius: 6,
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    createButton: {
        backgroundColor: '#34C759',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    storeSelector: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f8f8f8',
        marginBottom: 16,
    },
    selectedStore: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedStoreLogo: {
        width: 24,
        height: 24,
        marginRight: 8,
        resizeMode: 'contain',
    },
    selectedStoreText: {
        fontSize: 16,
        color: '#333',
    },
    storePlaceholder: {
        fontSize: 16,
        color: '#999',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        fontSize: 20,
        color: '#666',
    },
    storeList: {
        padding: 16,
    },
    storeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    storeLogo: {
        width: 32,
        height: 32,
        marginRight: 12,
        resizeMode: 'contain',
    },
    storeItemText: {
        fontSize: 16,
        color: '#333',
    },
}); 