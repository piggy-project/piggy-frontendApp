import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  header: {
    minHeight: 76,
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    color: '#111',
    marginBottom: 5,
  },
  headerRight: {
    width: 36,
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
    justifyContent: 'flex-start',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  messageBlock: {
    maxWidth: '82%',
  },
  botName: {
    color: '#111',
    marginBottom: 10,
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
