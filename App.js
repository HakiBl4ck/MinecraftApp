import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated, TouchableWithoutFeedback, Image, SafeAreaView, Modal, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import recipesData from './recipes.json';

const MinecraftButton = ({ children, onPress }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
    };

    return (
        <TouchableWithoutFeedback
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Animated.View style={[styles.button, { transform: [{ scale: scaleAnim }] }]}>
                <View style={styles.buttonTop}>
                    {children}
                </View>
                <View style={styles.buttonShadow} />
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

export default function App() {
    const [modalVisible, setModalVisible] = useState(false);
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRecipes, setFilteredRecipes] = useState(recipesData);

    const handleSearch = (text) => {
        setSearchQuery(text);
        if (text === '') {
            setFilteredRecipes(recipesData);
        } else {
            const filtered = recipesData.filter(item =>
                item.name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredRecipes(filtered);
        }
    };

    const openDetail = (recipe) => {
        setSelectedRecipe(recipe);
        setDetailVisible(true);
    };

    const getItemEmoji = (code) => {
        const map = {
            'W': '🪵', // Madera
            'S': '🦯', // Palo
            'C': '🧱', // Cobblestone
            'I': '🖱️', // Hierro
            'G': '🟡', // Oro
            'D': '💎', // Diamante
            'L': '☁️', // Lana
            'F': '⚡', // Silex
            'P': '🪶', // Pluma
            'G': '🌑', // Polvora
            'A': '🏜️', // Arena
            'B': '⛓️', // Bloque Hierro
            'T': '🧵', // Hilo
        };
        return map[code] || '';
    };

    const renderRecipeItem = ({ item }) => (
        <TouchableOpacity onPress={() => openDetail(item)} activeOpacity={0.7}>
            <View style={styles.recipeCardContainer}>
                <View style={styles.recipeCard}>
                    <View style={styles.recipeIconContainer}>
                        <Text style={styles.recipeIcon}>{item.image}</Text>
                    </View>
                    <View style={styles.recipeInfo}>
                        <Text style={styles.recipeName}>{item.name.toUpperCase()}</Text>
                        <Text style={styles.recipeIngredients}>{item.ingredients}</Text>
                    </View>
                </View>
                <View style={styles.recipeCardShadow} />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            {/* Title Bar */}
            <View style={styles.titleContainer}>
                <View style={styles.titleBox}>
                    <Text style={styles.titleText}>MINECRAFT HELPER</Text>
                </View>
                <View style={styles.titleShadow} />
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <View style={styles.row}>
                    <MinecraftButton onPress={() => setModalVisible(true)}>
                        <Text style={styles.buttonText}>RECETAS</Text>
                        <View style={styles.iconPlaceholder}>
                            <Text style={{ fontSize: 30 }}>📖</Text>
                        </View>
                    </MinecraftButton>

                    <MinecraftButton onPress={() => console.log('Herramientas')}>
                        <Text style={styles.buttonText}>PICO</Text>
                        <View style={styles.iconPlaceholder}>
                            <Text style={{ fontSize: 40 }}>💎</Text>
                        </View>
                    </MinecraftButton>
                </View>
            </View>

            {/* Recipes List Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>RECETAS</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <View style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>X</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Search Bar */}
                        <View style={styles.searchContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="BUSCAR ITEM..."
                                placeholderTextColor="#8B8B8B"
                                value={searchQuery}
                                onChangeText={handleSearch}
                            />
                            <View style={styles.searchShadow} />
                        </View>

                        {/* List */}
                        <FlatList
                            data={filteredRecipes}
                            renderItem={renderRecipeItem}
                            keyExtractor={item => item.id}
                            contentContainerStyle={styles.listContainer}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>

            {/* Detail Modal (3x3 Grid) */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={detailVisible}
                onRequestClose={() => setDetailVisible(false)}
            >
                <View style={styles.modalBg}>
                    <View style={[styles.modalContent, { height: 'auto', paddingBottom: 40 }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{selectedRecipe?.name.toUpperCase()}</Text>
                            <TouchableOpacity onPress={() => setDetailVisible(false)}>
                                <View style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>X</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.detailContainer}>
                            {/* Crafting Table 3x3 */}
                            <View style={styles.craftingGridContainer}>
                                <View style={styles.gridBackground}>
                                    <View style={styles.grid}>
                                        {selectedRecipe?.grid.map((code, index) => (
                                            <View key={index} style={styles.gridCell}>
                                                <Text style={styles.gridEmoji}>{getItemEmoji(code)}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>

                                <View style={styles.arrowContainer}>
                                    <Text style={styles.arrow}>➡️</Text>
                                </View>

                                <View style={styles.resultContainer}>
                                    <View style={[styles.gridCell, styles.resultCell]}>
                                        <Text style={{ fontSize: 40 }}>{selectedRecipe?.image}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.recipeInfoBox}>
                                <Text style={styles.infoTitle}>INGREDIENTES:</Text>
                                <Text style={styles.infoText}>{selectedRecipe?.ingredients}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Version 1.2.0 - HakiBl4ck</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4e4e4e',
        alignItems: 'center',
        paddingTop: 50,
    },
    titleContainer: {
        width: '90%',
        height: 80,
        position: 'relative',
        marginBottom: 40,
    },
    titleBox: {
        backgroundColor: '#c6c6c6',
        width: '100%',
        height: '100%',
        borderWidth: 4,
        borderColor: '#000',
        justifyContent: 'center',
        paddingLeft: 20,
        zIndex: 2,
    },
    titleShadow: {
        backgroundColor: '#333',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 6,
        left: 6,
        zIndex: 1,
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3F3F3F',
        letterSpacing: 2,
    },
    content: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        width: '45%',
        aspectRatio: 1,
        position: 'relative',
    },
    buttonTop: {
        backgroundColor: '#c6c6c6',
        width: '100%',
        height: '100%',
        borderWidth: 4,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        gap: 15,
    },
    buttonShadow: {
        backgroundColor: '#000',
        width: '100%',
        top: 8,
        left: 8,
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 1,
        opacity: 0.3,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3F3F3F',
    },
    iconPlaceholder: {
        width: 60,
        height: 60,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.2)',
    },
    modalBg: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        height: '80%',
        backgroundColor: '#c6c6c6',
        borderWidth: 4,
        borderColor: '#000',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#3F3F3F',
    },
    closeButton: {
        width: 40,
        height: 40,
        backgroundColor: '#ff4d4d',
        borderWidth: 3,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
    },
    searchContainer: {
        height: 50,
        width: '100%',
        marginBottom: 20,
        position: 'relative',
    },
    searchInput: {
        backgroundColor: '#fff',
        width: '100%',
        height: '100%',
        borderWidth: 3,
        borderColor: '#000',
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#000',
        zIndex: 2,
    },
    searchShadow: {
        backgroundColor: '#8B8B8B',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 4,
        left: 4,
        zIndex: 1,
    },
    listContainer: {
        paddingBottom: 20,
    },
    recipeCardContainer: {
        width: '100%',
        height: 90,
        marginBottom: 15,
        position: 'relative',
    },
    recipeCard: {
        backgroundColor: '#e1e1e1',
        width: '100%',
        height: '100%',
        borderWidth: 3,
        borderColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        zIndex: 2,
    },
    recipeCardShadow: {
        backgroundColor: '#8B8B8B',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 4,
        left: 4,
        zIndex: 1,
    },
    recipeIconContainer: {
        width: 60,
        height: 60,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    recipeIcon: {
        fontSize: 30,
    },
    recipeInfo: {
        flex: 1,
    },
    recipeName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3F3F3F',
        marginBottom: 4,
    },
    recipeIngredients: {
        fontSize: 12,
        color: '#666',
    },
    detailContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    craftingGridContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    gridBackground: {
        backgroundColor: '#8B8B8B',
        padding: 10,
        borderWidth: 4,
        borderColor: '#373737',
    },
    grid: {
        width: 156, // (48+4)*3
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    gridCell: {
        width: 48,
        height: 48,
        backgroundColor: '#c6c6c6',
        borderWidth: 2,
        borderColor: '#373737',
        margin: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gridEmoji: {
        fontSize: 24,
    },
    arrowContainer: {
        marginHorizontal: 15,
    },
    arrow: {
        fontSize: 30,
    },
    resultContainer: {
        padding: 10,
    },
    resultCell: {
        width: 80,
        height: 80,
        backgroundColor: '#c6c6c6',
        borderWidth: 4,
        borderColor: '#373737',
    },
    recipeInfoBox: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: 15,
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 5,
    },
    infoText: {
        fontSize: 16,
        color: '#3F3F3F',
    },
    footer: {
        paddingVertical: 10,
    },
    footerText: {
        color: '#8B8B8B',
        fontSize: 12,
    }
});
