import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function WelcomePage() {
  const router = useRouter();
  const [featuredArt, setFeaturedArt] = useState(null);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const highlightIds = [436532, 437984, 436524, 336327, 436105, 435882];
  const currentIndex = useRef(0);

  const fetchArtById = async (id) => {
    try {
      const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
      const data = await response.json();
      
      Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
        setFeaturedArt(data);
        setLoading(false);
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      });
    } catch (e) {
      console.error("Home Fetch Error:", e);
    }
  };

  useEffect(() => {
    fetchArtById(highlightIds[currentIndex.current]);

    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % highlightIds.length;
      fetchArtById(highlightIds[currentIndex.current]);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.content}>
        <Text style={styles.logoText}>CURATOR</Text>
        <View style={styles.goldLine} />

        <Text style={styles.description}>
          A minimalist gateway to the world’s most significant art archives. 
          Tap a masterpiece to enter.
        </Text>

        <TouchableOpacity 
          style={styles.featuredContainer} 
          activeOpacity={0.9}
          onPress={() => router.push('/(tabs)/HomeScreen')}
        >
          {loading ? (
            <ActivityIndicator color="#C5A059" />
          ) : (
            <Animated.View style={[styles.artPreview, { opacity: fadeAnim }]}>
              {featuredArt?.primaryImageSmall ? (
                <Image 
                  source={{ uri: featuredArt.primaryImageSmall }} 
                  style={styles.previewImage} 
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.previewImage, styles.center]}>
                   <Ionicons name="image-outline" size={40} color="#CCC" />
                </View>
              )}
              <View style={styles.artInfo}>
                <Text style={styles.artTitle} numberOfLines={1}>
                  {featuredArt?.title?.toUpperCase() || "MASTERPIECE"}
                </Text>
                <Text style={styles.artArtist}>
                  {featuredArt?.artistDisplayName || 'Unknown Artist'}
                </Text>
                <View style={styles.enterHint}>
                  <Text style={styles.enterText}>ENTER ARCHIVE</Text>
                  <Ionicons name="chevron-forward" size={12} color="#C5A059" />
                </View>
              </View>
            </Animated.View>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>POWERED BY THE MET API</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { flex: 1, paddingHorizontal: 30, justifyContent: 'center', alignItems: 'center' },
  
  // LOGO: Extreme tracking and heavy weight for prestige
  logoText: { 
    fontSize: 22, 
    fontWeight: '900', 
    color: '#000', 
    letterSpacing: 16, 
    textAlign: 'center' 
  },
  
  goldLine: { width: 35, height: 2, backgroundColor: '#C5A059', marginVertical: 25 },
  
  // DESCRIPTION: Light weight but larger tracking for elegance
  description: { 
    fontSize: 14, 
    color: '#222', 
    textAlign: 'center', 
    lineHeight: 24, 
    fontWeight: '300', 
    letterSpacing: 1,
    marginBottom: 40,
    paddingHorizontal: 15 
  },
  
  featuredContainer: {
    width: '100%',
    height: 380,
    backgroundColor: '#FAFAFA',
    borderRadius: 2, 
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  
  artPreview: { width: '100%', height: '100%' },
  previewImage: { width: '100%', height: '75%', backgroundColor: '#F5F5F5' },
  center: { justifyContent: 'center', alignItems: 'center' },
  artInfo: { paddingVertical: 18, paddingHorizontal: 15, alignItems: 'center' },
  
  // ART TITLE: Bold condensed display
  artTitle: { 
    fontSize: 12, 
    fontWeight: '800', 
    color: '#000', 
    letterSpacing: 1.5 
  },
  
  // ARTIST: Medium italic with wider tracking
  artArtist: { 
    fontSize: 11, 
    color: '#888', 
    marginTop: 5, 
    fontStyle: 'italic',
    fontWeight: '500',
    letterSpacing: 0.5
  },
  
  enterHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  
  // ENTER ARCHIVE: Ultra-bold micro font
  enterText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#C5A059',
    letterSpacing: 2.5,
    marginRight: 4
  },
  
  // FOOTER: Tiniest text, maximum tracking for branding look
  footerText: { 
    position: 'absolute', 
    bottom: 30, 
    fontSize: 8, 
    color: '#AAA', 
    letterSpacing: 4, 
    fontWeight: '800',
    textTransform: 'uppercase'
  }
});