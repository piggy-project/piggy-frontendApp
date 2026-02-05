import { Redirect } from 'expo-router';

export default function Index() {
  // 앱이 켜지자마자 (tabs) 폴더의 index (즉, 메인 대시보드)로 납치합니다.
  return <Redirect href="/(tabs)" />;
}