import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { TextStyle } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarLabelStyle: {
                    ...(Typography.Pretendard_M_11 as TextStyle),
                    marginTop: -3, // 아이콘와의 간격
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: '홈',
                    tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="exchange"
                options={{
                    title: '환율',
                    tabBarIcon: ({ color }) => <Ionicons name="cash-outline" size={24} color={color} />, // 아이콘 설정
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
                name="favorites"
                options={{
                    title: '즐겨찾기',
                    tabBarIcon: ({ color }) => <Ionicons name="star-outline" size={24} color={color} />,
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