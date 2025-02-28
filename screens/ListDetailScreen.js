import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    Image,
    Modal,
    Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { stores } from '../data/stores';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function ListDetailScreen({ route, navigation }) {
    const { list } = route.params;
    const [items, setItems] = useState(
        list.items.map(item => ({
            ...item,
            isChecked: false
        }))
    );
    const [showCongrats, setShowCongrats] = useState(false);
    const [animation] = useState(new Animated.Value(0));
    const confettiRef = useRef();

    useEffect(() => {

        const allChecked = items.length > 0 && items.every(item => item.isChecked);
        if (allChecked) {
            setShowCongrats(true);

            setTimeout(() => {
                confettiRef.current?.start();
            }, 100);


            Animated.sequence([
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(animation, {
                    toValue: 0.8,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(animation, {
                    toValue: 1,
                    friction: 3,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [items]);


    const selectedStore = stores.find(store => store.name === list.store);

    const toggleItem = (itemId) => {
        setItems(currentItems =>
            currentItems.map(item =>
                item.id === itemId
                    ? { ...item, isChecked: !item.isChecked }
                    : item
            )
        );
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemRow}
            onPress={() => toggleItem(item.id)}
        >
            <View style={styles.itemContent}>
                <View style={[
                    styles.checkbox,
                    item.isChecked && styles.checkedCheckbox
                ]}>
                    {item.isChecked && (
                        <Ionicons name="checkmark" size={18} color="#fff" />
                    )}
                </View>
                <Text style={[
                    styles.itemText,
                    item.isChecked && styles.checkedItemText
                ]}>
                    {item.name}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const handleCongratsClose = () => {
        setShowCongrats(false);
        navigation.navigate('Home');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.listTitle}>{list.title}</Text>
                {selectedStore && (
                    <View style={styles.storeInfo}>
                        <Image
                            source={selectedStore.logo}
                            style={styles.storeLogo}
                        />
                        <Text style={styles.storeText}>{selectedStore.name}</Text>
                    </View>
                )}
            </View>

            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                style={styles.list}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Bu listede ürün bulunmuyor</Text>
                }
            />

            <Modal
                visible={showCongrats}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCongratsClose}
            >
                <View style={styles.modalContainer}>
                    <ConfettiCannon
                        ref={confettiRef}
                        count={200}
                        origin={{ x: -10, y: 0 }}
                        autoStart={false}
                        fadeOut={true}
                        explosionSpeed={350}
                        fallSpeed={3000}
                        colors={['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']}
                    />
                    <Animated.View
                        style={[
                            styles.modalContent,
                            {
                                transform: [
                                    { scale: animation }
                                ]
                            }
                        ]}
                    >
                        <Ionicons name="happy-outline" size={64} color="#007AFF" />
                        <Text style={styles.congratsText}>Tebrikler!</Text>
                        <Text style={styles.congratsSubText}>Tüm ürünleri aldınız</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleCongratsClose}
                        >
                            <Text style={styles.closeButtonText}>Tamam</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    listTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    storeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    storeLogo: {
        width: 20,
        height: 20,
        marginRight: 8,
        resizeMode: 'contain',
    },
    storeText: {
        fontSize: 16,
        color: '#666',
    },
    list: {
        flex: 1,
        padding: 16,
    },
    itemRow: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#007AFF',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkedCheckbox: {
        backgroundColor: '#007AFF',
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    checkedItemText: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        marginTop: 24,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    congratsText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    congratsSubText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    closeButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#007AFF',
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 