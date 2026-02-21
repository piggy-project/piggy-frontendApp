import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 전체 컨테이너 (KeyboardAvoidingView)
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // 내부 콘텐츠 컨테이너 (패딩 담당)
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    marginBottom: 40,
  },
  title: {
    color: '#000',
    paddingTop: 50,
    marginBottom: 80, // 간격 살짝 조정
  },
  inputContainer: {
    marginBottom: 10,
  },
  linksContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 40,
  },
  linkText: {
    fontSize: 14,
    color: '#555',
  },
  divider: {
    marginHorizontal: 10,
    color: '#ddd',
  },
  bottomContainer: {
    // marginTop: 'auto'
    paddingBottom: 20,   // 하단 여백
  },
});