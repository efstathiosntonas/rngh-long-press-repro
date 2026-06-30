import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MessageInteractionZone } from '@/components/MessageInteractionZone';
import { ChatMessage, MESSAGES } from '@/data/messages';

function MessageRow({
  message,
  onLongPress,
  onPress
}: {
  message: ChatMessage;
  onLongPress: () => void;
  onPress: () => void;
}) {
  return (
    <View style={[styles.rowWrap, message.mine ? styles.alignEnd : styles.alignStart]}>
      <MessageInteractionZone onLongPress={onLongPress} onPress={onPress}>
        <View style={[styles.bubble, message.mine ? styles.bubbleMine : styles.bubbleTheirs]}>
          {!message.mine && <Text style={styles.author}>{message.author}</Text>}
          <Text style={[styles.text, message.mine && styles.textMine]}>{message.text}</Text>
        </View>
      </MessageInteractionZone>
    </View>
  );
}

const CONTROL: ChatMessage = {
  id: 'control',
  author: 'Control',
  text: 'Control bubble — NOT inside FlashList. Long-press works everywhere.',
  mine: false
};

export function TreeScreen() {
  const [reactions, setReactions] = useState(0);
  const [taps, setTaps] = useState(0);
  const [last, setLast] = useState('—');

  const react = (who: string) => {
    setReactions((c) => c + 1);
    setLast(`long-press → ${who}`);
  };
  const tap = (who: string) => {
    setTaps((c) => c + 1);
    setLast(`tap → ${who}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        Reactions (long-press): {reactions} · Taps: {taps}
      </Text>
      <Text style={styles.last}>{last}</Text>

      <Text style={styles.hint}>Control bubble — outside FlashList:</Text>
      <MessageRow
        message={CONTROL}
        onLongPress={() => react('control')}
        onPress={() => tap('control')}
      />

      <Text style={styles.hint}>FlashList messages — long-press does nothing on Android:</Text>
      <View style={styles.listWrap}>
        <FlashList
          data={MESSAGES}
          renderItem={({ item }) => (
            <MessageRow
              message={item}
              onLongPress={() => react(item.author)}
              onPress={() => tap(item.author)}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    gap: 6,
    backgroundColor: '#fff'
  },
  status: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a'
  },
  last: {
    fontSize: 13,
    color: '#7E80B6'
  },
  hint: {
    fontSize: 13,
    color: '#666',
    marginTop: 6
  },
  listWrap: {
    flex: 1
  },
  rowWrap: {
    marginVertical: 3
  },
  alignStart: {
    alignItems: 'flex-start'
  },
  alignEnd: {
    alignItems: 'flex-end'
  },
  bubble: {
    maxWidth: '82%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18
  },
  bubbleTheirs: {
    backgroundColor: '#f1f1f4',
    borderBottomLeftRadius: 4
  },
  bubbleMine: {
    backgroundColor: '#EA4578',
    borderBottomRightRadius: 4
  },
  author: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7E80B6',
    marginBottom: 2
  },
  text: {
    fontSize: 15,
    color: '#222'
  },
  textMine: {
    color: '#fff'
  }
});
