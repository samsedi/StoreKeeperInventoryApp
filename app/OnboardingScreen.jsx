import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions,StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line } from 'react-native-svg';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  // Calculate size to fill most of the center space
  const graphSize = Math.min(width * 0.85, height * 0.5);
  const router = useRouter();
  
  return (
    <LinearGradient
      colors={['#0a0a2e', '#16213e', '#0f3460']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
       <StatusBar barStyle="light-content" backgroundColor="#0a0a2e" />
      {/* Title */}
      <Text style={styles.title}>Welcome to Storekeeper App</Text>

      {/* Network Graph in Center */}
      <View style={styles.centerBox}>
        <Svg height={graphSize} width={graphSize} viewBox="0 0 200 200">
          {/* Connection lines */}
          <Line x1="50" y1="50" x2="100" y2="30" stroke="#25fde5" strokeWidth="2" />
          <Line x1="100" y1="30" x2="150" y2="50" stroke="#25fde5" strokeWidth="2" />
          <Line x1="150" y1="50" x2="150" y2="110" stroke="#25fde5" strokeWidth="2" />
          <Line x1="150" y1="110" x2="100" y2="150" stroke="#25fde5" strokeWidth="2" />
          <Line x1="100" y1="150" x2="50" y2="130" stroke="#25fde5" strokeWidth="2" />
          <Line x1="50" y1="130" x2="50" y2="50" stroke="#25fde5" strokeWidth="2" />
          <Line x1="50" y1="50" x2="150" y2="110" stroke="#25fde5" strokeWidth="2" />
          <Line x1="100" y1="30" x2="100" y2="150" stroke="#25fde5" strokeWidth="2" />
          <Line x1="150" y1="50" x2="50" y2="130" stroke="#25fde5" strokeWidth="2" />
          <Line x1="50" y1="50" x2="100" y2="150" stroke="#25fde5" strokeWidth="2" />
          <Line x1="100" y1="30" x2="50" y2="130" stroke="#25fde5" strokeWidth="2" />

          {/* Nodes (circles) */}
          <Circle cx="50" cy="50" r="15" fill="#25fde5" />
          <Circle cx="100" cy="30" r="15" fill="#25fde5" />
          <Circle cx="150" cy="50" r="15" fill="#25fde5" />
          <Circle cx="150" cy="110" r="15" fill="#25fde5" />
          <Circle cx="100" cy="150" r="15" fill="#25fde5" />
          <Circle cx="50" cy="130" r="15" fill="#25fde5" />
        </Svg>
      </View>

      {/* Bottom section with dots and button */}
      <View style={styles.bottomSection}>
        {/* Vertical Progress Dots */}
        <View style={styles.verticalDots}>
          <View style={styles.progressDotActive} />
          <View style={styles.progressDotInactive} />
          <View style={styles.progressDotInactive} />
        </View>

        {/* Next Button */}
        <TouchableOpacity onPress={() => router.push("/(tabs)")} style={styles.nextButton}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 80,
    paddingBottom: 60,
  },
  title: {
    color: '#fff',
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 60,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  verticalDots: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  progressDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#25fde5',
  },
  progressDotInactive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#555',
  },
  nextButton: {
    backgroundColor: '#25fde5',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 50,
  },
  nextText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});