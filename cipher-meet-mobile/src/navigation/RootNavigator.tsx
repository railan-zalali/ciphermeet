import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { Colors, FontSize } from '../theme';

// Auth screens
import { SplashScreen } from '../screens/auth/SplashScreen';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { OTPScreen } from '../screens/auth/OTPScreen';

// Wizard
import { ProfileWizardScreen } from '../screens/wizard/ProfileWizardScreen';

// Main tabs
import { DiscoveryScreen } from '../screens/discovery/DiscoveryScreen';
import { ActivityScreen } from '../screens/discovery/ActivityScreen';
import { ChatListScreen } from '../screens/chat/ChatListScreen';
import { ChatRoomScreen } from '../screens/chat/ChatRoomScreen';
import { MyProfileScreen } from '../screens/profile/MyProfileScreen';
import { SecurityCenterScreen } from '../screens/profile/SecurityCenterScreen';
import { PrivacySettingsScreen } from '../screens/profile/PrivacySettingsScreen';
import { AccessibilitySettingsScreen } from '../screens/profile/AccessibilitySettingsScreen';
import { PremiumScreen } from '../screens/premium/PremiumScreen';

// ─── Stack Param Types ────────────────────────────────────────────────────────
export type AuthStackParams = {
    Splash: undefined;
    Onboarding: undefined;
    Login: undefined;
    Register: undefined;
    OTP: { phoneNumber: string };
    ProfileWizard: undefined;
};

export type MainTabParams = {
    Discovery: undefined;
    Activity: undefined;
    ChatList: undefined;
    Premium: undefined;
    Profile: undefined;
};

export type RootStackParams = {
    Auth: undefined;
    Main: undefined;
    ChatRoom: { conversationId: string; partnerName: string; partnerAvatar?: string };
    SecurityCenter: undefined;
    PrivacySettings: undefined;
    AccessibilitySettings: undefined;
};

const AuthStack = createStackNavigator<AuthStackParams>();
const Tab = createBottomTabNavigator<MainTabParams>();
const RootStack = createStackNavigator<RootStackParams>();

const DiscoveryIcon = ({ color }: { color: string }) => <Text style={{ color, fontSize: 20 }}>🔍</Text>;
const ActivityIcon = ({ color }: { color: string }) => <Text style={{ color, fontSize: 20 }}>❤️</Text>;
const ChatListIcon = ({ color }: { color: string }) => <Text style={{ color, fontSize: 20 }}>✉️</Text>;
const PremiumIcon = ({ color }: { color: string }) => <Text style={{ color, fontSize: 20 }}>💎</Text>;
const ProfileIcon = ({ color }: { color: string }) => <Text style={{ color, fontSize: 20 }}>👤</Text>;

// ─── Tab Navigator ────────────────────────────────────────────────────────────
function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.surface,
                    borderTopColor: Colors.border,
                    borderTopWidth: 1,
                    paddingBottom: 8,
                    height: 64,
                },
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textSecondary,
                tabBarLabelStyle: {
                    fontSize: FontSize.xs,
                    marginBottom: 4,
                },
            }}
        >
            <Tab.Screen
                name="Discovery"
                component={DiscoveryScreen}
                options={{
                    tabBarLabel: 'Cari',
                    tabBarIcon: DiscoveryIcon,
                    tabBarAccessibilityLabel: 'Cari, tab 1 dari 5',
                }}
            />
            <Tab.Screen
                name="Activity"
                component={ActivityScreen}
                options={{
                    tabBarLabel: 'Aktivitas',
                    tabBarIcon: ActivityIcon,
                    tabBarAccessibilityLabel: 'Aktivitas, tab 2 dari 5',
                }}
            />
            <Tab.Screen
                name="ChatList"
                component={ChatListScreen}
                options={{
                    tabBarLabel: 'Pesan',
                    tabBarIcon: ChatListIcon,
                    tabBarAccessibilityLabel: 'Pesan, tab 3 dari 5',
                }}
            />
            <Tab.Screen
                name="Premium"
                component={PremiumScreen}
                options={{
                    tabBarLabel: 'Premium',
                    tabBarIcon: PremiumIcon,
                    tabBarAccessibilityLabel: 'Premium, tab 4 dari 5',
                }}
            />
            <Tab.Screen
                name="Profile"
                component={MyProfileScreen}
                options={{
                    tabBarLabel: 'Profil',
                    tabBarIcon: ProfileIcon,
                    tabBarAccessibilityLabel: 'Profil, tab 5 dari 5',
                }}
            />
        </Tab.Navigator>
    );
}

// ─── Auth Navigator ───────────────────────────────────────────────────────────
function AuthNavigator() {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Splash" component={SplashScreen} />
            <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
            <AuthStack.Screen name="OTP" component={OTPScreen} />
            <AuthStack.Screen name="ProfileWizard" component={ProfileWizardScreen} />
        </AuthStack.Navigator>
    );
}

// ─── Root Navigator ───────────────────────────────────────────────────────────
export function RootNavigator() {
    const { isAuthenticated } = useAuthStore();

    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    <RootStack.Screen name="Auth" component={AuthNavigator} />
                ) : (
                    <>
                        <RootStack.Screen name="Main" component={MainTabs} />
                        <RootStack.Screen name="ChatRoom"
                            component={ChatRoomScreen}
                            options={{ presentation: 'card', gestureEnabled: true }}
                        />
                        <RootStack.Screen name="SecurityCenter" component={SecurityCenterScreen} />
                        <RootStack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
                        <RootStack.Screen name="AccessibilitySettings" component={AccessibilitySettingsScreen} />
                    </>
                )}
            </RootStack.Navigator>
        </NavigationContainer>
    );
}
