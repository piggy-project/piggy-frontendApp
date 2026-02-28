import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  profileSection: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 30,
    marginBottom: 8,
  },
  largeProfileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 15,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#495057',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname: {
    color: '#212529',
  },
  // 3. 정보 섹션 공통
  infoSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#495057',
  },
  editLink: {
    fontSize: 14,
    color: '#ADB5BD',
  },
  // 4. 개별 정보 행 (이름, 전화번호 등)
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    color: '#868E96',
    width: 100, // 레이블 너비 고정으로 정렬 유지
  },
  infoValue: {
    color: '#212529',
    flex: 1,
    textAlign: 'left',
  },
  // 5. 하단 로그아웃
  logoutContainer: {
    marginTop: 20,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 40,
  },
  logoutText: {
    fontSize: 15,
    color: '#ADB5BD',
    textDecorationLine: 'underline',
  },
});