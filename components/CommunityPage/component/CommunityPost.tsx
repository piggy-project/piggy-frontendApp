import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './CommunityPost.styles';

interface PostProps {
  user: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
}

const CommunityPost: React.FC<PostProps> = ({ user, time, content, likes, comments }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.profileCircle} />
        <Text style={[styles.userName, Typography.Pretendard_M_14]}>{user}</Text>
        <Text style={[styles.timeText, Typography.Pretendard_M_11]}>{time}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <Text style={[styles.content, Typography.Pretendard_M_14]}>{content}</Text>
      
      <View style={styles.footer}>
        <View style={styles.interactionBox}>
          <Ionicons name="thumbs-up-outline" size={16} color="#888" />
          <Text style={[styles.interactionText, Typography.Pretendard_M_12]}>{likes}</Text>
          <Ionicons name="chatbubble-outline" size={16} color="#888" style={{ marginLeft: 10 }} />
          <Text style={[styles.interactionText, Typography.Pretendard_M_12]}>{comments}</Text>
        </View>
      </View>
    </View>
  );
};

export default CommunityPost;