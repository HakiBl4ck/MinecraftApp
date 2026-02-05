import React, { useRef, useState, useMemo } from 'react';
import { StyleSheet, Text, View, Animated, TouchableWithoutFeedback, SafeAreaView, Modal, TextInput, FlatList, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import recipesData from './recipes.json';
import enchantmentsData from './enchantments.json';
import potionsData from './potions.json';
import effectsData from './effects.json';
import mobsData from './mobs.json';
import peacefulMobsData from './peaceful_mobs.json';

const MinecraftButton = ({ children, onPress, style }) => {
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
            <Animated.View style={[styles.button, style, { transform: [{ scale: scaleAnim }] }]}>
                <View style={styles.buttonTop}>
                    {children}
                </View>
                <View style={styles.buttonShadow} />
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

export default function App() {
    const { width } = useWindowDimensions();
    const isWeb = width > 768;

    const [activeModal, setActiveModal] = useState(null);
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [detailType, setDetailType] = useState('recipe');

    const [globalSearch, setGlobalSearch] = useState('');

    const searchResults = useMemo(() => {
        const q = globalSearch.toLowerCase();
        if (!q) return { recipes: recipesData, enchants: enchantmentsData, potions: potionsData, effects: effectsData, mobs: mobsData, peaceful: peacefulMobsData };

        return {
            recipes: recipesData.filter(i => i.name.toLowerCase().includes(q)),
            enchants: enchantmentsData.filter(i => i.name.toLowerCase().includes(q)),
            potions: potionsData.filter(i => i.name.toLowerCase().includes(q)),
            effects: effectsData.filter(i => i.name.toLowerCase().includes(q)),
            mobs: mobsData.filter(i => i.name.toLowerCase().includes(q)),
            peaceful: peacefulMobsData.filter(i => i.name.toLowerCase().includes(q))
        };
    }, [globalSearch]);

    const openDetail = (item, type) => {
        setSelectedItem(item);
        setDetailType(type);
        setDetailVisible(true);
    };

    const getItemEmoji = (code) => {
        const map = {
            'W': '🪵', 'S': '🦯', 'C': '🧱', 'I': '🖱️', 'G': '🟡', 'D': '💎',
            'L': '☁️', 'F': '⚡', 'P': '🪶', 'A': '🏜️', 'B': '⛓️', 'T': '🧵',
            '🔴': '🔴', '⭐': '⭐', '⬛': '⬛', '📘': '📘', '🏹': '🏹', '🍯': '🍯',
            '🟢': '🟢', '🎋': '🎋', '🗃️': '🗃️'
        };
        return map[code] || code || '';
    };

    const renderCard = (item, type) => (
        <TouchableOpacity onPress={() => openDetail(item, type)} activeOpacity={0.7} style={isWeb ? styles.cardWeb : styles.cardMobile}>
            <View style={styles.recipeCardContainer}>
                <View style={[styles.recipeCard, type === 'enchant' && { borderLeftColor: item.color, borderLeftWidth: 10 }]}>
                    <View style={[styles.recipeIconContainer, (type === 'potion' || type === 'effect') && { backgroundColor: item.color + '22' }]}>
                        <Text style={[styles.recipeIcon, (type === 'potion' || type === 'effect') && { color: item.color }]}>{item.image || '✨'}</Text>
                    </View>
                    <View style={styles.recipeInfo}>
                        <Text style={[styles.recipeName, isWeb && { fontSize: 16 }]}>{item.name.toUpperCase()}</Text>
                        <Text style={[styles.recipeIngredients, isWeb && { fontSize: 13 }]} numberOfLines={isWeb ? 3 : 1}>{item.effect || item.ingredients || item.habitat || item.utility}</Text>
                    </View>
                </View>
                <View style={styles.recipeCardShadow} />
            </View>
        </TouchableOpacity>
    );

    const getButtonGrid = () => {
        const buttons = [
            { id: 'recipes', name: 'RECETAS', icon: '📖' },
            { id: 'enchantments', name: 'ENCANTOS', icon: '✨' },
            { id: 'potions', name: 'POCIONES', icon: '🧪' },
            { id: 'effects', name: 'EFECTOS', icon: '🌟' },
            { id: 'mobs', name: 'M. HOSTIL', icon: '🧟' },
            { id: 'peaceful', name: 'M. PASIVO', icon: '🐄' },
        ];

        if (isWeb) {
            return (
                <View style={styles.webGrid}>
                    {buttons.map(btn => (
                        <MinecraftButton key={btn.id} onPress={() => setActiveModal(btn.id)} style={styles.webBtn}>
                            <Text style={[styles.buttonText, { fontSize: 18 }]}>{btn.name}</Text>
                            <Text style={{ fontSize: 32 }}>{btn.icon}</Text>
                        </MinecraftButton>
                    ))}
                    <MinecraftButton onPress={() => console.log('Pico')} style={styles.webBtn}>
                        <Text style={[styles.buttonText, { fontSize: 18 }]}>PICO</Text>
                        <Text style={{ fontSize: 32 }}>💎</Text>
                    </MinecraftButton>
                </View>
            );
        }

        // Mobile grid (3 rows of 2)
        return (
            <View style={styles.buttonGrid}>
                <View style={styles.row}>
                    <MinecraftButton onPress={() => setActiveModal('recipes')}><Text style={styles.buttonText}>RECETAS</Text><Text style={{ fontSize: 26 }}>📖</Text></MinecraftButton>
                    <MinecraftButton onPress={() => setActiveModal('enchantments')}><Text style={styles.buttonText}>ENCANTOS</Text><Text style={{ fontSize: 26 }}>✨</Text></MinecraftButton>
                </View>
                <View style={[styles.row, { marginTop: 15 }]}>
                    <MinecraftButton onPress={() => setActiveModal('potions')}><Text style={styles.buttonText}>POCIONES</Text><Text style={{ fontSize: 26 }}>🧪</Text></MinecraftButton>
                    <MinecraftButton onPress={() => setActiveModal('effects')}><Text style={styles.buttonText}>EFECTOS</Text><Text style={{ fontSize: 26 }}>🌟</Text></MinecraftButton>
                </View>
                <View style={[styles.row, { marginTop: 15 }]}>
                    <MinecraftButton onPress={() => setActiveModal('mobs')}><Text style={styles.buttonText}>M. HOSTIL</Text><Text style={{ fontSize: 26 }}>🧟</Text></MinecraftButton>
                    <MinecraftButton onPress={() => setActiveModal('peaceful')}><Text style={styles.buttonText}>M. PASIVO</Text><Text style={{ fontSize: 26 }}>🐄</Text></MinecraftButton>
                </View>
                <View style={[styles.row, { marginTop: 15, justifyContent: 'center' }]}>
                    <MinecraftButton onPress={() => console.log('Pico')} style={{ width: '100%' }}><Text style={styles.buttonText}>MENU PICO</Text><Text style={{ fontSize: 30 }}>💎</Text></MinecraftButton>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            <View style={[styles.titleContainer, isWeb && { width: '80%', height: 120, maxWidth: 800 }]}>
                <View style={styles.titleBox}>
                    <Text style={[styles.titleText, isWeb && { fontSize: 48 }]}>MINECRAFT HELPER</Text>
                </View>
                <View style={styles.titleShadow} />
            </View>

            <View style={[styles.searchContainer, isWeb ? { width: '60%', maxWidth: 600 } : { width: '90%' }]}>
                <TextInput
                    style={styles.globalSearchInput}
                    placeholder="BUSCAR GLOBALMENTE..."
                    placeholderTextColor="#8B8B8B"
                    value={globalSearch}
                    onChangeText={setGlobalSearch}
                />
                <View style={styles.searchShadow} />
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={isWeb ? { paddingHorizontal: '5%', alignItems: 'center' } : { paddingHorizontal: 20 }}>
                {globalSearch ? (
                    <View style={{ width: '100%', maxWidth: 1200 }}>
                        {searchResults.recipes.length > 0 && <View style={styles.section}><Text style={styles.sectionTitle}>RECETAS</Text><View style={styles.resultGrid}>{searchResults.recipes.map(i => <View key={i.id} style={isWeb ? { width: '32%' } : { width: '100%' }}>{renderCard(i, 'recipe')}</View>)}</View></View>}
                        {searchResults.potions.length > 0 && <View style={styles.section}><Text style={styles.sectionTitle}>POCIONES</Text><View style={styles.resultGrid}>{searchResults.potions.map(i => <View key={i.id} style={isWeb ? { width: '32%' } : { width: '100%' }}>{renderCard(i, 'potion')}</View>)}</View></View>}
                        {searchResults.mobs.length > 0 && <View style={styles.section}><Text style={styles.sectionTitle}>MOBS HOSTILES</Text><View style={styles.resultGrid}>{searchResults.mobs.map(i => <View key={i.id} style={isWeb ? { width: '32%' } : { width: '100%' }}>{renderCard(i, 'mob')}</View>)}</View></View>}
                        {searchResults.peaceful.length > 0 && <View style={styles.section}><Text style={styles.sectionTitle}>MOBS PACIFICOS</Text><View style={styles.resultGrid}>{searchResults.peaceful.map(i => <View key={i.id} style={isWeb ? { width: '32%' } : { width: '100%' }}>{renderCard(i, 'peaceful')}</View>)}</View></View>}
                    </View>
                ) : (
                    <View style={{ width: '100%', maxWidth: 1200 }}>
                        {getButtonGrid()}
                    </View>
                )}
            </ScrollView>

            {/* Lists Modal */}
            <Modal visible={activeModal !== null} transparent animationType="slide" onRequestClose={() => setActiveModal(null)}>
                <View style={styles.modalBg}>
                    <View style={[styles.modalContent, isWeb && { width: '90%', maxWidth: 1200, height: '90%' }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, isWeb && { fontSize: 32 }]}>{activeModal?.toUpperCase()}</Text>
                            <TouchableOpacity onPress={() => setActiveModal(null)}><View style={styles.closeButton}><Text style={styles.closeButtonText}>X</Text></View></TouchableOpacity>
                        </View>
                        <FlatList
                            data={activeModal === 'recipes' ? recipesData : activeModal === 'enchantments' ? enchantmentsData : activeModal === 'potions' ? potionsData : activeModal === 'effects' ? effectsData : activeModal === 'mobs' ? mobsData : peacefulMobsData}
                            renderItem={({ item }) => <View style={isWeb ? { flex: 1, margin: 8 } : { width: '100%' }}>{renderCard(item, activeModal.slice(0, -1))}</View>}
                            keyExtractor={item => item.id}
                            numColumns={isWeb ? 3 : 1}
                            columnWrapperStyle={isWeb && { justifyContent: 'space-between' }}
                            contentContainerStyle={styles.listContainer}
                        />
                    </View>
                </View>
            </Modal>

            {/* Detail Modal */}
            <Modal visible={detailVisible} transparent animationType="fade">
                <View style={styles.modalBg}>
                    <View style={[styles.modalContent, { height: 'auto', paddingBottom: 40 }, isWeb && { width: '60%', maxWidth: 800 }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{selectedItem?.name.toUpperCase()}</Text>
                            <TouchableOpacity onPress={() => setDetailVisible(false)}><View style={styles.closeButton}><Text style={styles.closeButtonText}>X</Text></View></TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={styles.detailContainer}>
                            {detailType === 'recipe' && (
                                <View style={styles.craftingGridContainer}>
                                    <View style={[styles.gridBackground, { transform: [{ scale: isWeb ? 1.5 : 1 }] }]}><View style={styles.grid}>{selectedItem?.grid.map((c, i) => <View key={i} style={styles.gridCell}><Text style={styles.gridEmoji}>{getItemEmoji(c)}</Text></View>)}</View></View>
                                    <View style={isWeb && { width: 50 }} />
                                    <Text style={[styles.arrow, isWeb && { fontSize: 40 }]}>➡️</Text>
                                    <View style={[styles.gridCell, styles.resultCell, isWeb && { transform: [{ scale: 1.5 }] }]}><Text style={{ fontSize: 40 }}>{selectedItem?.image}</Text></View>
                                </View>
                            )}

                            <View style={[styles.recipeInfoBox, isWeb && { padding: 24 }]}>
                                {selectedItem?.hp ? (
                                    <>
                                        <Text style={[styles.infoText, isWeb && { fontSize: 18 }]}>❤️ Vida: {selectedItem?.hp}</Text>
                                        {selectedItem?.damage && <Text style={[styles.infoText, isWeb && { fontSize: 18 }]}>⚔️ Daño: {selectedItem?.damage}</Text>}
                                        <Text style={[styles.infoText, isWeb && { fontSize: 18 }]}>🌍 Habitat: {selectedItem?.habitat}</Text>
                                        {selectedItem?.weakness && <Text style={[styles.infoText, isWeb && { fontSize: 18 }]}>⚡ Debilidad: {selectedItem?.weakness}</Text>}
                                        {selectedItem?.utility && <Text style={[styles.infoText, isWeb && { fontSize: 18 }]}>🛠️ Utilidad: {selectedItem?.utility}</Text>}
                                    </>
                                ) : (
                                    <>
                                        <Text style={[styles.infoTitle, isWeb && { fontSize: 20 }]}>DETALLES:</Text>
                                        <Text style={[styles.infoText, isWeb && { fontSize: 18 }]}>{selectedItem?.effect || selectedItem?.ingredients}</Text>
                                        {selectedItem?.recipe && <Text style={[styles.itemTags, isWeb && { fontSize: 14 }]}>Receta: {selectedItem.recipe}</Text>}
                                    </>
                                )}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <View style={styles.footer}><Text style={styles.footerText}>Version 1.5.0 - Made by: Max</Text></View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#4e4e4e', alignItems: 'center', paddingTop: 30 },
    scrollView: { width: '100%', flex: 1 },
    titleContainer: { width: '90%', height: 75, position: 'relative', marginBottom: 20 },
    titleBox: { backgroundColor: '#c6c6c6', width: '100%', height: '100%', borderWidth: 4, borderColor: '#000', justifyContent: 'center', paddingLeft: 20, zIndex: 2 },
    titleShadow: { backgroundColor: '#333', width: '100%', height: '100%', position: 'absolute', top: 6, left: 6, zIndex: 1 },
    titleText: { fontSize: 22, fontWeight: 'bold', color: '#3F3F3F', letterSpacing: 2 },
    searchContainer: { height: 50, marginBottom: 25, position: 'relative', alignSelf: 'center' },
    globalSearchInput: { backgroundColor: '#fff', width: '100%', height: '100%', borderWidth: 4, borderColor: '#000', paddingHorizontal: 20, fontSize: 16, color: '#000', zIndex: 2 },
    searchShadow: { backgroundColor: '#333', width: '100%', height: '100%', position: 'absolute', top: 4, left: 4, zIndex: 1 },
    buttonGrid: { width: '100%', paddingBottom: 20 },
    webGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' },
    row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    button: { width: '48%', aspectRatio: 1.2, position: 'relative' },
    webBtn: { width: '23%', aspectRatio: 1, marginBottom: 20 },
    buttonTop: { backgroundColor: '#c6c6c6', width: '100%', height: '100%', borderWidth: 4, borderColor: '#000', alignItems: 'center', justifyContent: 'center', zIndex: 2, gap: 8 },
    buttonShadow: { backgroundColor: '#000', width: '100%', height: '100%', position: 'absolute', top: 6, left: 6, zIndex: 1, opacity: 0.3 },
    buttonText: { fontSize: 14, fontWeight: 'bold', color: '#3F3F3F' },
    section: { marginTop: 25, width: '100%' },
    sectionTitle: { color: '#ffaa00', fontSize: 18, fontWeight: 'bold', marginBottom: 12, textShadowColor: '#000', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1 },
    resultGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    cardWeb: { width: '100%' },
    cardMobile: { width: '100%' },
    recipeCardContainer: { marginBottom: 12, position: 'relative' },
    recipeCard: { backgroundColor: '#e1e1e1', width: '100%', borderWidth: 3, borderColor: '#000', flexDirection: 'row', alignItems: 'center', padding: 8, zIndex: 2 },
    recipeCardShadow: { backgroundColor: '#8B8B8B', width: '100%', height: '100%', position: 'absolute', top: 4, left: 4, zIndex: 1 },
    recipeIconContainer: { width: 50, height: 50, backgroundColor: 'rgba(0,0,0,0.05)', borderWidth: 2, borderColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    recipeIcon: { fontSize: 24 },
    recipeInfo: { flex: 1 },
    recipeName: { fontSize: 13, fontWeight: 'bold', color: '#3F3F3F' },
    recipeIngredients: { fontSize: 11, color: '#666' },
    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '92%', height: '88%', backgroundColor: '#c6c6c6', borderWidth: 4, borderColor: '#000', padding: 20, maxHeight: '95%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#3F3F3F' },
    closeButton: { width: 35, height: 35, backgroundColor: '#ff4d4d', borderWidth: 3, borderColor: '#000', justifyContent: 'center', alignItems: 'center' },
    closeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    detailContainer: { alignItems: 'center', paddingBottom: 20 },
    craftingGridContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, justifyContent: 'center', flexWrap: 'wrap' },
    gridBackground: { backgroundColor: '#8B8B8B', padding: 6, borderWidth: 4, borderColor: '#373737' },
    grid: { width: 132, flexDirection: 'row', flexWrap: 'wrap' },
    gridCell: { width: 40, height: 40, backgroundColor: '#c6c6c6', borderWidth: 2, borderColor: '#373737', margin: 2, alignItems: 'center', justifyContent: 'center' },
    gridEmoji: { fontSize: 24 },
    resultCell: { width: 65, height: 65, marginLeft: 15 },
    arrow: { fontSize: 22, marginHorizontal: 8 },
    recipeInfoBox: { width: '100%', backgroundColor: 'rgba(0,0,0,0.1)', padding: 12, borderWidth: 2, borderColor: 'rgba(0,0,0,0.2)' },
    infoText: { fontSize: 14, color: '#3F3F3F', lineHeight: 20, marginBottom: 4 },
    infoTitle: { fontWeight: 'bold', marginBottom: 5 },
    itemTags: { fontSize: 11, color: '#777', marginTop: 5 },
    footer: { paddingVertical: 10 },
    footerText: { color: '#8B8B8B', fontSize: 10 }
});
