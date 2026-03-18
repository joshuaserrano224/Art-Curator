import { Stack, useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.kicker}>COLLECTION OVERVIEW</Text>
          <Text style={styles.title}>Curator</Text>
          <View style={styles.divider} />
        </View>

        {/* Hero Description */}
        <View style={styles.contentSection}>
          <Text style={styles.desc}>
            A digital gateway designed for <Text style={styles.highlight}>ITMSD 3</Text>. 
            Providing a refined, real-time interface to The Metropolitan Museum of Art's 
            expansive public archive.
          </Text>
          <Text style={styles.subDesc}>
            Accessing over 5,000 years of human history through a modern, 
            performant mobile lens.
          </Text>
        </View>

        {/* Technical Specs - Compact Grid */}
        <View style={styles.specsContainer}>
          <Text style={styles.sectionLabel}>SPECIFICATIONS</Text>
          
          <View style={styles.grid}>
            <View style={styles.specItem}>
              <Text style={styles.specTitle}>CORE ENGINE</Text>
              <Text style={styles.specDetail}>The MET REST API</Text>
            </View>
            
            <View style={styles.specItem}>
              <Text style={styles.specTitle}>FRAMEWORK</Text>
              <Text style={styles.specDetail}>React Native Hooks</Text>
            </View>

            <View style={styles.specItem}>
              <Text style={styles.specTitle}>INTERFACE</Text>
              <Text style={styles.specDetail}>Custom Stylesheet</Text>
            </View>

            <View style={styles.specItem}>
              <Text style={styles.specTitle}>LISTING</Text>
              <Text style={styles.specDetail}>Virtualized Feed</Text>
            </View>
          </View>
        </View>

        {/* Call to Action - Minimalist */}
        <TouchableOpacity 
          style={styles.btn} 
          activeOpacity={0.7}
          onPress={() => router.push('/')}
        >
          <Text style={styles.btnText}>BACK TO GALLERY</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>© 2026 • ITMSD 3 ARCHIVE</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { paddingHorizontal: 40, paddingVertical: 60 },
  header: { marginBottom: 35 },
  kicker: { fontSize: 9, letterSpacing: 2.5, color: '#C5A059', fontWeight: '700', marginBottom: 6 },
  title: { fontSize: 24, fontWeight: '300', color: '#000', letterSpacing: 1 },
  divider: { width: 25, height: 1, backgroundColor: '#E0E0E0', marginTop: 12 },
  
  contentSection: { marginBottom: 40 },
  desc: { fontSize: 14, color: '#333', lineHeight: 22, fontWeight: '400' },
  highlight: { color: '#000', fontWeight: '600' },
  subDesc: { fontSize: 12, color: '#888', lineHeight: 18, marginTop: 15 },

  specsContainer: { marginBottom: 45 },
  sectionLabel: { fontSize: 9, letterSpacing: 1.5, fontWeight: '800', color: '#CCC', marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  specItem: { 
    width: '50%', 
    marginBottom: 20,
  },
  specTitle: { fontSize: 10, fontWeight: '700', color: '#1a1a1a', letterSpacing: 0.5 },
  specDetail: { fontSize: 10, color: '#999', marginTop: 2 },

  btn: { 
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 14, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 2
  },
  btnText: { color: '#000', fontWeight: '600', letterSpacing: 1.5, fontSize: 11 },
  footerText: { textAlign: 'center', marginTop: 40, fontSize: 9, color: '#DDD', letterSpacing: 1.2 }
});