import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Platform,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  const [artData, setArtData] = useState([]);
  const [allIds, setAllIds] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const itemsPerPage = 10;
  const debounceTimer = useRef(null);
  const abortController = useRef(null);

  // FIXED: Silences JSON Parse error by validating Content-Type before parsing
  const safeFetch = async (url, signal) => {
    try {
      const response = await fetch(url, { signal });
      const contentType = response.headers.get("content-type");
      
      // If the response isn't JSON (like the HTML error pages causing the crash), return null
      if (response.ok && contentType && contentType.includes("application/json")) {
        return await response.json();
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const fetchSuggestions = async (text) => {
    setSearchQuery(text);
    if (text.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      try {
        if (abortController.current) abortController.current.abort();
        abortController.current = new AbortController();

        const encodedQuery = encodeURIComponent(text);
        const data = await safeFetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodedQuery}`,
          abortController.current.signal
        );

        if (data && data.objectIDs) {
          const topIds = data.objectIDs.slice(0, 5);
          const detailPromises = topIds.map(id => 
            safeFetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`, abortController.current.signal)
          );
          const results = await Promise.all(detailPromises);
          setSuggestions(results.filter(r => r && r.title));
          setShowSuggestions(true);
        }
      } catch (e) {
        setSuggestions([]);
      }
    }, 500);
  };

  const executeSearch = async (query) => {
    setShowSuggestions(false);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (!query) return;

    try {
      setLoading(true);
      const encodedQuery = encodeURIComponent(query);
      const data = await safeFetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${encodedQuery}`);
      
      if (!data || !data.objectIDs || data.objectIDs.length === 0) {
        setArtData([]);
        setAllIds([]);
        return;
      }

      setAllIds(data.objectIDs);
      const firstBatch = data.objectIDs.slice(0, itemsPerPage);
      const results = await fetchDetails(firstBatch);
      setArtData(results);
      setPage(1);
    } catch (err) {
      // Errors logged only to console, not shown to user
      console.log("Fetch handled silently");
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Uses allSettled to ensure one bad API item doesn't kill the whole list
  const fetchDetails = async (ids) => {
    const promises = ids.map(id => safeFetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`));
    const results = await Promise.allSettled(promises);
    
    return results
      .filter(res => res.status === 'fulfilled' && res.value !== null)
      .map(res => res.value)
      .filter(item => item && item.primaryImageSmall);
  };

  const loadMoreArt = async () => {
    if (loadingMore || artData.length >= allIds.length) return;
    setLoadingMore(true);
    const start = page * itemsPerPage;
    const end = start + itemsPerPage;
    const nextBatchIds = allIds.slice(start, end);

    if (nextBatchIds.length > 0) {
      const nextBatchData = await fetchDetails(nextBatchIds);
      setArtData(prev => [...prev, ...nextBatchData]);
      setPage(prev => prev + 1);
    }
    setLoadingMore(false);
  };

  useEffect(() => { 
    executeSearch('Impressionism'); 
    return () => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        if (abortController.current) abortController.current.abort();
    };
  }, []);

  const renderArtItem = ({ item }) => (
    <TouchableOpacity 
      activeOpacity={0.8}
      style={styles.card}
      onPress={() => router.push({ pathname: "/details/[id]", params: { id: item.objectID, itemData: JSON.stringify(item) }})}
    >
      <Image source={{ uri: item.primaryImageSmall }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{item.artistDisplayName?.[0] || 'U'}</Text></View>
          <View style={styles.textDetails}>
            <Text style={styles.artTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.artSub}>{item.artistDisplayName || 'Unknown Artist'} • {item.objectDate}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.headerWrapper}>
        <Text style={styles.logo}>CURATOR</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#999" style={{marginLeft: 15}} />
          <TextInput 
            style={styles.input}
            placeholder="Search masterpieces..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={fetchSuggestions}
            onFocus={() => searchQuery.length > 2 && setShowSuggestions(true)}
            onSubmitEditing={() => executeSearch(searchQuery)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => {setSearchQuery(''); setSuggestions([]); setShowSuggestions(false);}}>
              <Ionicons name="close-circle" size={18} color="#CCC" style={{marginRight: 10}} />
            </TouchableOpacity>
          )}
        </View>

        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {suggestions.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.suggestionItem}
                onPress={() => executeSearch(item.title)}
              >
                <Ionicons name="time-outline" size={18} color="#BBB" style={{marginRight: 15}} />
                <Text style={styles.suggestionText} numberOfLines={1}>{item.title}</Text>
                <Ionicons name="arrow-up-outline" size={16} color="#CCC" style={{transform: [{ rotate: '-45deg' }]}} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {loading ? (
        <View style={{ flex: 1 }}>
          <View style={styles.loadingNote}>
            <ActivityIndicator size="small" color="#C5A059" style={{ marginBottom: 10 }} />
            <Text style={styles.loadingNoteText}>CURATING ARCHIVE...</Text>
          </View>
          {[1, 2].map((i) => <SkeletonCard key={i} />)}
        </View>
      ) : (
        <FlatList
          data={artData}
          keyExtractor={(item, index) => item.objectID.toString() + index}
          renderItem={renderArtItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => executeSearch(searchQuery || 'Impressionism')} />}
          onEndReached={loadMoreArt}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => loadingMore ? <ActivityIndicator style={{ margin: 30 }} color="#C5A059" /> : null}
          ListHeaderComponent={() => <Text style={styles.trendingTitle}>Trending in Art History</Text>}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const SkeletonCard = () => (
  <View style={styles.card}>
    <View style={styles.skeletonImage} /><View style={styles.cardContent}><View style={styles.avatarRow}><View style={styles.skeletonAvatar} /><View style={styles.textDetails}><View style={styles.skeletonLineMain} /><View style={styles.skeletonLineSub} /></View></View></View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  headerWrapper: { paddingHorizontal: 16, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', zIndex: 10 },
  logo: { fontSize: 20, fontWeight: '800', letterSpacing: 6, textAlign: 'center', marginVertical: 15, color: '#000' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12, height: 45 },
  input: { flex: 1, marginLeft: 10, fontSize: 14, color: '#000' },
  suggestionsContainer: {
    position: 'absolute',
    top: 115,
    left: 16,
    right: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 999,
    paddingVertical: 5,
  },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 15 },
  suggestionText: { flex: 1, fontSize: 14, color: '#333', fontWeight: '500' },
  trendingTitle: { fontSize: 14, fontWeight: '700', marginHorizontal: 16, marginTop: 20, marginBottom: 10, color: '#333' },
  card: { marginBottom: 12, backgroundColor: '#fff' },
  cardImage: { width: '100%', height: 350, backgroundColor: '#f9f9f9' },
  cardContent: { padding: 12 },
  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  textDetails: { flex: 1, marginLeft: 12 },
  artTitle: { fontSize: 14, fontWeight: '600', color: '#000' },
  artSub: { fontSize: 11, color: '#777', marginTop: 2 },
  loadingNote: { alignItems: 'center', marginTop: 30, marginBottom: 10 },
  loadingNoteText: { fontSize: 10, letterSpacing: 3, fontWeight: '700', color: '#C5A059' },
  skeletonImage: { width: '100%', height: 350, backgroundColor: '#F5F5F5' },
  skeletonAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F0F0' },
  skeletonLineMain: { height: 12, width: '70%', backgroundColor: '#F0F0F0', borderRadius: 4 },
  skeletonLineSub: { height: 10, width: '40%', backgroundColor: '#F5F5F5', borderRadius: 4, marginTop: 8 },
});