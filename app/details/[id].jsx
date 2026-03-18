import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
    gold: '#C5A059',
    dark: '#1A1A1A',
    lightGray: '#F9F9F9',
    mediumGray: '#666666',
    white: '#FFFFFF',
    border: '#EEEEEE'
};

export default function DetailScreen() {
    const { itemData } = useLocalSearchParams();
    const router = useRouter();
    const [isMaximized, setIsMaximized] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    if (!itemData) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="small" color={COLORS.gold} />
            </View>
        );
    }

    const rawData = Array.isArray(itemData) ? itemData[0] : itemData;
    const item = JSON.parse(rawData);
    const fullImage = item.primaryImage || item.primaryImageSmall;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent />
            <Stack.Screen options={{ headerShown: false }} />

            {/* FULLSCREEN MODAL */}
            <Modal visible={isMaximized} transparent={false} animationType="fade">
                <View style={styles.modalContainer}>
                    <SafeAreaView style={styles.modalHeader}>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setIsMaximized(false)}>
                            <Ionicons name="close" size={28} color="white" />
                        </TouchableOpacity>
                    </SafeAreaView>
                    <Image source={{ uri: fullImage }} style={styles.fullImage} resizeMode="contain" />
                </View>
            </Modal>

            {/* TOP NAVIGATION */}
            <View style={styles.headerNav}>
                <SafeAreaView>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backCircle}>
                        <Ionicons name="chevron-back" size={22} color="white" />
                    </TouchableOpacity>
                </SafeAreaView>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
                {/* HERO IMAGE */}
                <TouchableOpacity 
                    activeOpacity={0.9} 
                    onPress={() => setIsMaximized(true)} 
                    style={styles.heroContainer}
                >
                    <Image
                        source={{ uri: fullImage }}
                        style={styles.heroImg}
                        resizeMode="cover"
                        onLoad={() => setImageLoaded(true)}
                    />
                    {!imageLoaded && <ActivityIndicator style={StyleSheet.absoluteFill} color={COLORS.gold} />}
                    <View style={styles.expandBadge}>
                        <Ionicons name="expand" size={10} color="white" />
                        <Text style={styles.expandText}>VIEW FULL</Text>
                    </View>
                </TouchableOpacity>

                {/* CONTENT AREA */}
                <View style={styles.contentBody}>
                    <Text style={styles.museumTag}>THE METROPOLITAN MUSEUM OF ART</Text>
                    <Text style={styles.title}>{item.title}</Text>
                    
                    {/* KEY INFO BAR - High-level summary */}
                    <View style={styles.quickInfoBar}>
                        <View style={styles.quickInfoItem}>
                            <Text style={styles.quickInfoLabel}>PERIOD</Text>
                            <Text style={styles.quickInfoValue}>{item.objectDate || 'N/A'}</Text>
                        </View>
                        <View style={[styles.quickInfoItem, styles.infoBorder]}>
                            <Text style={styles.quickInfoLabel}>MEDIUM</Text>
                            <Text style={styles.quickInfoValue} numberOfLines={1}>{item.medium || 'N/A'}</Text>
                        </View>
                    </View>

                    {/* ARTIST SECTION */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>THE ARTIST</Text>
                        <Text style={styles.artistName}>{item.artistDisplayName || 'Anonymous'}</Text>
                        {item.artistDisplayBio ? (
                            <Text style={styles.artistBio}>{item.artistDisplayBio}</Text>
                        ) : null}
                    </View>

                    {/* DETAILED SPECS */}
                    <View style={styles.specsContainer}>
                        <DetailRow label="Dimensions" value={item.dimensions} />
                        <DetailRow label="Credit Line" value={item.creditLine} />
                        <DetailRow label="Department" value={item.department} />
                        <DetailRow label="Object ID" value={item.objectID} isLast />
                    </View>

                    <View style={{ height: 60 }} />
                </View>
            </ScrollView>
        </View>
    );
}

// Clean horizontal row for minor details
const DetailRow = ({ label, value, isLast }) => (
    <View style={[styles.detailRow, isLast && { borderBottomWidth: 0 }]}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value || '—'}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    
    headerNav: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingHorizontal: 20,
    },
    backCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Platform.OS === 'android' ? 40 : 10,
    },

    heroContainer: { 
        width: '100%', 
        height: SCREEN_HEIGHT * 0.42, 
        backgroundColor: COLORS.dark 
    },
    heroImg: { width: '100%', height: '100%' },
    expandBadge: { 
        position: 'absolute', 
        bottom: 16, 
        right: 16, 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.6)', 
        paddingHorizontal: 10, 
        paddingVertical: 5, 
        borderRadius: 2 
    },
    expandText: { color: 'white', fontSize: 8, fontWeight: '800', marginLeft: 4, letterSpacing: 1 },

    contentBody: { 
        paddingHorizontal: 24, 
        paddingTop: 24,
        backgroundColor: COLORS.white,
    },
    museumTag: { 
        color: COLORS.gold, 
        fontWeight: '700', 
        fontSize: 8, 
        letterSpacing: 2, 
        marginBottom: 8 
    },
    title: { 
        fontSize: 22, 
        fontWeight: '500', 
        color: COLORS.dark, 
        lineHeight: 28,
        marginBottom: 24
    },

    // Structure 1: Quick Info Bar
    quickInfoBar: {
        flexDirection: 'row',
        backgroundColor: COLORS.lightGray,
        borderRadius: 8,
        padding: 16,
        marginBottom: 32,
    },
    quickInfoItem: {
        flex: 1,
    },
    infoBorder: {
        borderLeftWidth: 1,
        borderLeftColor: '#E0E0E0',
        paddingLeft: 16
    },
    quickInfoLabel: {
        fontSize: 8,
        fontWeight: '800',
        color: '#999',
        marginBottom: 4,
        letterSpacing: 1
    },
    quickInfoValue: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.dark
    },

    // Structure 2: Section Headers
    section: { marginBottom: 32 },
    sectionLabel: { 
        fontSize: 9, 
        fontWeight: '800', 
        color: COLORS.gold, 
        letterSpacing: 1.5, 
        marginBottom: 12 
    },
    artistName: { fontSize: 18, fontWeight: '600', color: COLORS.dark, marginBottom: 6 },
    artistBio: { fontSize: 13, color: COLORS.mediumGray, lineHeight: 20 },

    // Structure 3: Detail List
    specsContainer: {
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        marginTop: 8
    },
    detailRow: {
        flexDirection: 'row',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    detailLabel: {
        width: 100,
        fontSize: 12,
        color: '#999',
        fontWeight: '500'
    },
    detailValue: {
        flex: 1,
        fontSize: 12,
        color: COLORS.dark,
        lineHeight: 18
    },

    modalContainer: { flex: 1, backgroundColor: 'black', justifyContent: 'center' },
    modalHeader: { position: 'absolute', top: 0, right: 0, zIndex: 10 },
    closeBtn: { padding: 20 },
    fullImage: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }
});