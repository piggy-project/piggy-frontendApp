import { chatbotApi } from '@/components/utils/api';
import { useAuth } from '@/components/utils/AuthContext';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BaseHeader from '../Header/BaseHeader';
import { styles as baseStyles } from '../Header/BaseHeader.styles';
import BackButton from '../Header/component/BackButton';
import { styles } from './ChatbotPage.styles';

type ChatMessage = {
  id: string;
  role: 'bot' | 'user';
  text: string;
  createdAt: Date;
  navigationLinks?: NavigationLink[];
  suggestedQuestions?: SuggestedQuestion[];
};

type NavigationLink = {
  label: string;
  route: string;
};

type SuggestedQuestion = {
  question: string;
};

const getTimeText = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours < 12 ? '오전' : '오후'} ${hours % 12 || 12}:${minutes}`;
};

export default function ChatbotPage() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  const { user } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const dateText = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, '0');
    const day = `${now.getDate()}`.padStart(2, '0');
    return `${year}.${month}.${day}`;
  }, []);

  useEffect(() => {
    const currentName = user?.nickname || '회원';
    
    setMessages([
      {
        id: 'welcome',
        role: 'bot',
        // 백틱(``) 기호와 ${} 표준 템플릿 리터럴 문법을 사용하여 변수를 동적으로 매핑합니다.
        text: `안녕하세요. ${currentName}님!\nAI 챗봇 피기예요.\n\n무엇을 도와드릴까요?`,
        createdAt: new Date(),
      },
    ]);
  }, [user]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSubscription = Keyboard.addListener(showEvent, () => setIsKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener(hideEvent, () => setIsKeyboardVisible(false));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  };

  const sendQuestion = async (nextQuestion?: string) => {
    const trimmed = (nextQuestion ?? question).trim();
    if (!trimmed || isLoading) return;

    const now = new Date();
    const userMessage: ChatMessage = {
      id: `user-${now.getTime()}`,
      role: 'user',
      text: trimmed,
      createdAt: now,
    };

    setQuestion('');
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    scrollToBottom();

    try {
      const response = await chatbotApi.ask(trimmed);
      const payload = response?.data || response;
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        text: payload?.answer || '답변을 가져오지 못했어요. 잠시 후 다시 물어봐 주세요.',
        createdAt: new Date(),
        navigationLinks: payload?.navigationLinks || [],
        suggestedQuestions: payload?.suggestedQuestions || [],
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('챗봇 응답 에러:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-error-${Date.now()}`,
          role: 'bot',
          text: '지금은 답변을 불러오지 못했어요. 네트워크 상태를 확인한 뒤 다시 시도해 주세요.',
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleNavigate = (route: string) => {
    router.push(route as any);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 18 : -18}
    >
      <BaseHeader
        left={
          <>
            <BackButton onPress={() => router.back()} />
            <Text style={baseStyles.title}>AI 챗봇 피기</Text>
          </>
        }
        center={null}
        right={null}
      />

      <ScrollView
        ref={scrollRef}
        style={styles.messageList}
        contentContainerStyle={styles.messageContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToBottom}
      >
        <View style={styles.dateDivider}>
          <View style={styles.dateLine} />
          <Text style={[styles.dateText, Typography.Pretendard_M_12]}>{dateText}</Text>
          <View style={styles.dateLine} />
        </View>

        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageRow,
              message.role === 'user' ? styles.userMessageRow : styles.botMessageRow,
            ]}
          >
            {message.role === 'bot' && (
              <Image source={require('@/assets/images/piggychatbot.png')} style={styles.avatar} />
            )}

            <View style={styles.messageBlock}>
              {message.role === 'bot' && (
                <Text style={[styles.botName, Typography.Pretendard_B_16]}>피기</Text>
              )}
              <View
                style={[
                  styles.bubble,
                  message.role === 'user' ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text style={[styles.messageText, Typography.Pretendard_M_14]}>
                  {message.text}
                </Text>
              </View>

              {!!message.navigationLinks?.length && (
                <View style={styles.quickActionList}>
                  {message.navigationLinks.map((link) => (
                    <TouchableOpacity
                      key={`${message.id}-${link.route}-${link.label}`}
                      style={styles.quickActionButton}
                      onPress={() => handleNavigate(link.route)}
                    >
                      <Text style={[styles.quickActionText, Typography.Pretendard_M_12]}>
                        {link.label}
                      </Text>
                      <Ionicons name="chevron-forward" size={14} color="#555" />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {!!message.suggestedQuestions?.length && (
                <View style={styles.suggestedList}>
                  {message.suggestedQuestions.map((item) => (
                    <TouchableOpacity
                      key={`${message.id}-${item.question}`}
                      style={styles.suggestedButton}
                      onPress={() => sendQuestion(item.question)}
                    >
                      <Text style={[styles.suggestedText, Typography.Pretendard_M_12]}>
                        {item.question}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text
                style={[
                  styles.timeText,
                  message.role === 'user' ? styles.userTimeText : styles.botTimeText,
                  Typography.Pretendard_M_11,
                ]}
              >
                {getTimeText(message.createdAt)}
              </Text>
            </View>
          </View>
        ))}

        {isLoading && (
          <View style={[styles.messageRow, styles.botMessageRow]}>
            <Image source={require('@/assets/images/piggychatbot.png')} style={styles.avatar} />
            <View style={styles.messageBlock}>
              <Text style={[styles.botName, Typography.Pretendard_B_16]}>피기</Text>
              <View style={[styles.bubble, styles.botBubble, styles.loadingBubble]}>
                <ActivityIndicator size="small" color="#FF8FAA" />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View
        style={[
          styles.inputWrapper,
          {
            paddingBottom: isKeyboardVisible
              ? Platform.OS === 'android' ? 18 : 8
              : Math.max(insets.bottom, 12),
          },
        ]}
      >
        <View style={styles.inputBox}>
          <TextInput
            value={question}
            onChangeText={setQuestion}
            style={[styles.input, Typography.Pretendard_M_14]}
            placeholder="궁금한 점을 입력해주세요."
            placeholderTextColor="#9A9A9A"
            returnKeyType="send"
            onSubmitEditing={() => sendQuestion()}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => sendQuestion()}
            disabled={!question.trim() || isLoading}
          >
            <Ionicons
              name="send"
              size={22}
              color={question.trim() && !isLoading ? '#555' : '#C8C8C8'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
