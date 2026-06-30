import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  GestureDetector,
  useCompetingGestures,
  useLongPressGesture,
  useTapGesture
} from 'react-native-gesture-handler';

interface MessageInteractionZoneProps {
  children: ReactNode;
  onLongPress: () => void;
  onPress: () => void;
}

/**
 * Verbatim copy of the gesture wrapper our production chat/circle list rows use.
 *
 * A long-press opens a reaction menu; a tap opens the item. We use native RNGH
 * gestures (not a Pressable) on purpose: the long-press has to win over the
 * surrounding ScrollView's touch arbitration while the keyboard is open, which a
 * Pressable's onLongPress cannot. `runOnJS: true` keeps the callbacks on the JS
 * thread so nothing is registered in the worklets runtime per row.
 *
 * This is the exact handler setup that gets cancelled on Android — see README.
 */
export function MessageInteractionZone({
  children,
  onLongPress,
  onPress
}: MessageInteractionZoneProps) {
  const tapGesture = useTapGesture({
    runOnJS: true,
    maxDistance: 32,
    cancelsTouchesInView: false,
    onDeactivate: () => {
      onPress();
    }
  });

  const longPressGesture = useLongPressGesture({
    runOnJS: true,
    minDuration: 450,
    cancelsTouchesInView: false,
    onActivate: () => {
      onLongPress();
    }
  });

  const gesture = useCompetingGestures(longPressGesture, tapGesture);

  return (
    <GestureDetector gesture={gesture}>
      <View accessible={false} style={styles.container}>
        {children}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  }
});
