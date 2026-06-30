import { StyleSheet, Text, View } from 'react-native';

// A few extra tabs so the bottom-tab ScreenContainer holds several
// detached (inactive) react-native-screens, matching hiki's 5-tab layout.
export function PlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Filler tab — here only to add detached sibling screens.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff'
  },
  text: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  }
});
