import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
    const insets = useSafeAreaInsets();
    const bottomInset = Math.max(insets.bottom, 8);

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarStyle: {
                    height: 58 + bottomInset,
                    paddingTop: 6,
                    paddingBottom: bottomInset,
                    borderTopWidth: 0.5,
                    borderTopColor: '#E5E5E5',
                    backgroundColor: '#fff',
                },
                tabBarLabelStyle: {
                    ...(Typography.Pretendard_M_11 as TextStyle),
                    marginTop: -2, // 아이콘와의 간격
                },
            }}
        >
            <Tabs.Screen
                name="exchange"
                options={{
                    title: '탐색',
                    tabBarIcon: ({ color }) => <Ionicons name="cash-outline" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="shopping"
                options={{
                    title: '쇼핑',
                    tabBarIcon: ({ color }) => <Ionicons name="star-outline" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: '홈',
                    tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="community"
                options={{
                    title: '커뮤니티',
                    tabBarIcon: ({ color }) => <Ionicons name="chatbubbles-outline" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="mypage"
                options={{
                    title: '마이페이지',
                    tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
