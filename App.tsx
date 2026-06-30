import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BlurTargetView } from 'expo-blur';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { MinimalScreen } from '@/screens/MinimalScreen';
import { TreeScreen } from '@/screens/TreeScreen';

// THE TRIGGER: expo-blur's <BlurTargetView> (ExpoBlurTargetView) hosts its children
// inside an inner UIManagerCompatibleBlurTarget that it keeps parented-but-DETACHED
// (it reparents the target to snapshot it for blurring). With that node on a gesture
// view's ancestor path, RNGH #4177's strict isViewAttachedUnderWrapper walk hits
// indexOfChild < 0 and cancels the gesture. hiki wraps its whole nav tree in this
// (BlurTargetProvider in Routes.tsx), so every list-row long-press dies on Android.
// The nav stack below mirrors hiki but is not required — the BlurTargetView is.

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const stackScreenOptions = {
  gestureEnabled: true,
  headerShown: true,
  headerShadowVisible: false
} as const;

function MinimalStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen component={MinimalScreen} name="MinimalList" options={{ title: 'Bare-minimum' }} />
    </Stack.Navigator>
  );
}

function TreeStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen component={TreeScreen} name="TreeList" options={{ title: 'Production tree' }} />
    </Stack.Navigator>
  );
}

const tabScreenOptions = {
  animation: 'none' as const,
  headerShown: false,
  lazy: true
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BlurTargetView style={{ flex: 1 }}>
          <NavigationContainer>
            <Tab.Navigator backBehavior="none" screenOptions={tabScreenOptions}>
              <Tab.Screen component={MinimalStack} name="Minimal" />
              <Tab.Screen component={TreeStack} name="Tree" />
            </Tab.Navigator>
          </NavigationContainer>
        </BlurTargetView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
