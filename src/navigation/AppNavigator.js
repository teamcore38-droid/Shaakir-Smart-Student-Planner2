/**
 * AppNavigator — Application Routing Configuration
 *
 * Implements a conditional navigation architecture:
 *   1. Auth Stack (unauthenticated): Login → Register
 *   2. Main App (authenticated): Bottom Tab Navigator
 *      ├── Home Tab → Dashboard
 *      ├── Tasks Tab → Stack: TaskList → TaskDetail → AddTask → EditTask
 *      ├── Profile Tab → Profile
 *      └── Settings Tab → Settings
 *
 * The navigator conditionally renders based on auth state from AuthContext,
 * ensuring proper separation of authenticated and public routes.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { COLORS, FONT_SIZES, FONT_WEIGHTS } from '../theme/theme';

// Screen imports
import OnboardingScreen from '../screens/OnboardingScreen';
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import StorageService from '../services/StorageService';
import DashboardScreen from '../screens/DashboardScreen';
import TaskListScreen from '../screens/TaskListScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import EditTaskScreen from '../screens/EditTaskScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const TaskStack = createNativeStackNavigator();

/**
 * Task stack navigator — nested inside the Tasks tab.
 * Enables drilling from list → detail → edit without leaving the tab.
 */
const TaskStackNavigator = () => (
  <TaskStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.textPrimary,
      headerTitleStyle: { fontWeight: FONT_WEIGHTS.semibold, fontSize: FONT_SIZES.lg },
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    }}
  >
    <TaskStack.Screen name="TaskList" component={TaskListScreen} options={{ headerShown: false }} />
    <TaskStack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Task Details' }} />
    <TaskStack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'New Task' }} />
    <TaskStack.Screen name="EditTask" component={EditTaskScreen} options={{ title: 'Edit Task' }} />
  </TaskStack.Navigator>
);

/**
 * Main tab navigator — the primary authenticated experience.
 * Four tabs: Home, Tasks, Profile, Settings.
 */
const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        const icons = {
          Home: focused ? 'home' : 'home-outline',
          Tasks: focused ? 'list' : 'list-outline',
          Profile: focused ? 'person' : 'person-outline',
          Settings: focused ? 'settings' : 'settings-outline',
        };
        return <Ionicons name={icons[route.name]} size={22} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textTertiary,
      tabBarStyle: {
        backgroundColor: COLORS.surface,
        borderTopColor: COLORS.borderLight,
        borderTopWidth: 1,
        paddingTop: 6,
        paddingBottom: 8,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: FONT_SIZES.xs,
        fontWeight: FONT_WEIGHTS.medium,
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={DashboardScreen} />
    <Tab.Screen name="Tasks" component={TaskStackNavigator} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

/**
 * Auth stack — shown when no user is logged in.
 */
const AuthStack = ({ showOnboarding }) => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: COLORS.background },
    }}
  >
    {showOnboarding && <Stack.Screen name="Onboarding" component={OnboardingScreen} />}
    <Stack.Screen name="Landing" component={LandingScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

/**
 * Root navigator — conditionally renders auth or main based on login state.
 */
const AppNavigator = () => {
  const { user, isLoading } = useAuth();
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);

  React.useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await StorageService.load('@ssp_has_launched');
      setIsFirstLaunch(hasLaunched === null);
    };
    checkFirstLaunch();
  }, []);

  // Show loading spinner while checking stored session and first launch status
  if (isLoading || isFirstLaunch === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainTabNavigator /> : <AuthStack showOnboarding={isFirstLaunch} />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
});

export default AppNavigator;
