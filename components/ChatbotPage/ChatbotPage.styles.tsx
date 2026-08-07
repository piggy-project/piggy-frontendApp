import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  backButton: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  messageList: {
    flex: 1,
  },
  messageContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  dateDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DADADA',
  },
  dateText: {
    color: '#888',
    marginHorizontal: 12,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 22,
  },
  botMessageRow: {
    flexDirection: 'column', // 가로 배치가 아닌 세로 정렬로 변경
    alignItems: 'flex-start',
  },
  userMessageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  botProfileHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8, // 프로필/이름과 말풍선 사이 간격
},
  avatar: {
  width: 36,
  height: 36,
  borderRadius: 18,
  marginRight: 8,
},
  messageBlock: {
    maxWidth: '82%',
  },
  userMessageBlock: {
  alignItems: 'flex-end',
},
  botName: {
    color: '#111',
    marginBottom: 0,
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderTopLeftRadius: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFD3DD',
    borderTopRightRadius: 4,
  },
  loadingBubble: {
    minWidth: 58,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  messageText: {
    color: '#222',
  },
  timeText: {
    color: '#8E8E8E',
    marginTop: 6,
  },
  botTimeText: {
    alignSelf: 'flex-end',
  },
  userTimeText: {
    alignSelf: 'flex-start',
  },
  quickActionList: {
    marginTop: 8,
    gap: 8,
  },
  quickActionButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quickActionText: {
    color: '#555',
  },
  suggestedList: {
    marginTop: 8,
    gap: 8,
  },
  suggestedButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFE8EE',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  suggestedText: {
    color: '#333',
  },
  inputWrapper: {
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#F4F4F4',
  },
  inputBox: {
    minHeight: 42,
    borderRadius: 9,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E7E7E7',
    paddingLeft: 14,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 42,
    color: '#222',
    paddingVertical: 0,
  },
  sendButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
