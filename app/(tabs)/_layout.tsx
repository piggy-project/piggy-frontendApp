import CommunityIcon from '@/assets/icons/communityIcon.svg';
import FindIcon from '@/assets/icons/findIcon.svg';
import HomeIcon from '@/assets/icons/homeIcon.svg';
import MypageIcon from '@/assets/icons/mypageIcon.svg';
import ShoppingIcon from '@/assets/icons/shoppingIcon.svg';
import { Typography } from '@/constants/Typography';
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
                    marginTop: -2,
                },
            }}
        >
            <Tabs.Screen
                name="exchange"
                options={{
                    title: '탐색',
                    tabBarIcon: ({ color }) => (
                        <FindIcon width={24} height={24} fill={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="shopping"
                options={{
                    title: '쇼핑',
                    tabBarIcon: ({ color }) => <ShoppingIcon width={24} height={24} fill={color} />,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: '홈',
                    tabBarIcon: ({ color }) => <HomeIcon width={24} height={24} fill={color} />,
                }}
            />
            <Tabs.Screen
                name="community"
                options={{
                    title: '커뮤니티',
                    tabBarIcon: ({ color }) => <CommunityIcon width={24} height={24} fill={color} />,
                }}
            />
            <Tabs.Screen
                name="mypage"
                options={{
                    title: '마이페이지',
                    tabBarIcon: ({ color }) => <MypageIcon width={24} height={24} fill={color} />,
                }}
            />
        </Tabs>
    );
}
