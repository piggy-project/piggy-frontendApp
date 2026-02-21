import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './NotificationList.styles';
import { Typography } from '@/constants/Typography';

// 1. 알림 데이터 타입 정의
interface NotificationItem {
  id: string;
  title: string;
  time: string;
  isRead: boolean;
}

export default function NotificationList() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. 백엔드에서 데이터 가져오기 (시뮬레이션)
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // 여기에 실제 백엔드 API 주소를 넣으세요 (예: fetch('http://api.../notifications'))
      // 지금은 1초 뒤에 더미 데이터를 가져오는 척 합니다.
      await new Promise(resolve => setTimeout(resolve, 1000));

      const dummyData: NotificationItem[] = [
        { id: '1', title: '환율이 목표가에 도달했습니다!', time: '1시간 전', isRead: false },
        { id: '2', title: '미국(USD) 급등 주의 알림', time: '3시간 전', isRead: true },
        { id: '3', title: '새로운 환율 뉴스가 도착했습니다.', time: '1일 전', isRead: true },
        { id: '4', title: '일본(JPY) 최저가 갱신', time: '2일 전', isRead: true },
      ];
      setNotifications(dummyData);
    } catch (error) {
      console.error("알림 로딩 실패", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. 알림 삭제 기능
  const handleDelete = (id: string) => {
    // 실제 앱에서는 백엔드에 삭제 요청(API call)을 먼저 보내야 합니다.
    // 화면에서 지우기:
    setNotifications(prev => prev.filter(item => item.id !== id));
  };

  // 4. 로딩 중일 때
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    );
  }

  // 5. 알림이 없을 때
  if (notifications.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={[styles.emptyText, Typography.Pretendard_M_16]}>새로운 알림이 없습니다.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          {/* 왼쪽: 원형 아이콘 (회색) */}
          <View style={styles.iconCircle} />

          {/* 중간: 제목과 시간 */}
          <View style={styles.textContainer}>
            <Text style={[styles.title, Typography.Pretendard_M_14]} numberOfLines={1} ellipsizeMode="tail">
              {item.title}
            </Text>
            <Text style={[styles.time, Typography.Pretendard_M_12]}>{item.time}</Text>
          </View>

          {/* 오른쪽: 삭제 버튼 (X) */}
          <TouchableOpacity 
            onPress={() => handleDelete(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // 터치 영역 넓힘
          >
            <Ionicons name="close" size={20} color="#bbb" />
          </TouchableOpacity>
        </View>
      )}
      // 아이템 사이 구분선
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}