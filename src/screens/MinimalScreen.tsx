import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureDetector, useLongPressGesture } from 'react-native-gesture-handler';

const DATA = Array.from({ length: 40 }, (_, i) => `Row ${i + 1}`);

function Row({ label, onLongPress }: { label: string; onLongPress: () => void }) {
  const longPress = useLongPressGesture({
    runOnJS: true,
    minDuration: 400,
    onActivate: () => {
      onLongPress();
    }
  });

  return (
    <GestureDetector gesture={longPress}>
      <View style={styles.row}>
        <Text style={styles.rowText}>{label}</Text>
      </View>
    </GestureDetector>
  );
}

export function MinimalScreen() {
  const [count, setCount] = useState(0);
  const [last, setLast] = useState('—');

  const fire = (label: string) => {
    setCount((c) => c + 1);
    setLast(label);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        Long-press fired: {count} · last: {last}
      </Text>

      <Text style={styles.hint}>Control row — NOT inside FlashList. Long-press works everywhere:</Text>
      <Row label="Control row" onLongPress={() => fire('Control row')} />

      <Text style={styles.hint}>FlashList rows — long-press does nothing on Android:</Text>
      <View style={styles.listWrap}>
        <FlashList
          data={DATA}
          renderItem={({ item }) => <Row label={item} onLongPress={() => fire(item)} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 10,
    backgroundColor: '#fff'
  },
  status: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a'
  },
  hint: {
    fontSize: 13,
    color: '#666',
    marginTop: 8
  },
  listWrap: {
    flex: 1
  },
  row: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginVertical: 4,
    backgroundColor: '#f1f1f4'
  },
  rowText: {
    fontSize: 16,
    color: '#222'
  }
});
