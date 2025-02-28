import React, { useState, useEffect } from 'react';
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

export default function EditListScreen({ navigation, route }) {
    const { list } = route.params;

    const [listName, setListName] = useState(list.title);
    const [selectedStore, setSelectedStore] = useState(
        list.store ? stores.find(store => store.name === list.store) : null
    );
    const [items, setItems] = useState(list.items || []);
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

    const saveChanges = () => {
        if (listName.trim() === '') {
            Alert.alert('Uyarı', 'Liste adı zorunludur!');
            return;
        }

        const updatedList = {
            ...list,
            id: list.id,
            title: listName,
            store: selectedStore?.name || '',
            items: items,
            itemCount: items.length,
            date: list.date
        };

        navigation.navigate('Home', { updatedList });
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
                style={styles.saveButton}
                onPress={saveChanges}
            >
                <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
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
        padding: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
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
        width: 20,
        height: 20,
        marginRight: 8,
        resizeMode: 'contain',
    },
    selectedStoreText: {
        fontSize: 16,
        fontWeight: '600',
    },
    storePlaceholder: {
        fontSize: 16,
        color: '#666',
    },
    storeLogo: {
        width: 24,
        height: 24,
        marginRight: 12,
        resizeMode: 'contain',
    },
    storeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    storeItemText: {
        fontSize: 16,
    },
    itemsContainer: {
        marginBottom: 16,
    },
    addItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemInput: {
        flex: 1,
    },
    addItemButton: {
        backgroundColor: '#34C759',
        padding: 12,
        borderRadius: 8,
        marginLeft: 12,
    },
    addItemButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    itemsList: {
        marginBottom: 16,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemText: {
        flex: 1,
        fontSize: 16,
    },
    removeButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f00',
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#34C759',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
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
}); 