import axios, { AxiosRequestConfig } from 'axios';
import { Alert } from 'react-native';
import { getAccessToken, removeTokens } from './authStore';

// 1. 기본 서버 주소 설정
const BASE_URL = 'https://piggys.mooo.com';

// 2. Axios 인스턴스 생성
const api = axios.create({
  baseURL: BASE_URL,
});

// 3. 기존 fetch 방식과 동일한 시그니처를 유지하는 request 함수
const request = async (endpoint: string, options: any = {}) => {
  const { method = 'GET', body, skipAuth = false, headers: customHeaders } = options;

  // 토큰 가져오기
  let token = null;
  if (!skipAuth) {
    token = await getAccessToken();
  }

  const headers: any = { ...customHeaders };

  // Axios 요청 설정
  const config: AxiosRequestConfig = {
    url: endpoint,
    method: method,
    headers: {
      ...customHeaders,
    },
  };

  // 토큰이 있으면 헤더에 추가
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  // 데이터 처리 (fetch의 body -> axios의 data)
  if (body) {
    if (body instanceof FormData) {
      // formData일 경우: Content-Type을 명시하지 않아야 
      // 브라우저/Expo가 자동으로 boundary를 포함한 헤더를 만듭니다.
      // (axios.create에 기본값이 없으므로 안전합니다)
      config.data = body;
    } else {
      // 일반 객체나 JSON 문자열일 경우: JSON 헤더 명시
      config.headers = {
        ...config.headers,
        'Content-Type': 'application/json',
      };

      if (typeof body === 'string') {
        try {
          config.data = JSON.parse(body);
        } catch (e) {
          config.data = body;
        }
      } else {
        config.data = body;
      }
    }
  }

  try {
    const response = await api(config);
    return response.data; // Axios는 응답 데이터를 .data에 담아줍니다.
  } catch (error: any) {
    // 에러 처리 (기존 401 로직 유지)
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401 && !skipAuth) {
        console.warn(" 인증 만료: 금고를 비우고 로그아웃 처리를 유도합니다.");
        await removeTokens();
        Alert.alert(
          "세션 만료",
          "로그인 세션이 만료되어 자동으로 로그아웃되었습니다. 다시 로그인해주세요.",
          [{ text: "확인" }]
        );
      }

      // 기존 throw 형식 유지
      throw {
        status: status,
        message: data?.message || '서버 오류 발생',
        data: data
      };
    } else {
      // 네트워크 에러 등
      console.error('API Network Error:', error);
      throw error;
    }
  }
};

// 3. 실제 사용할 API 함수들을 모아두기
export const authApi = {
  // 이메일 중복 체크
  checkEmail: (email: string) => {
    return request(`/users/check-email?email=${email}`, { method: 'POST' });
  },

  // 회원가입
  signUp: (userData: any) => {
    return request('/users/sign-up', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // 로그인
  login: (credentials: any) => {
    return request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  // 추가 정보 업데이트 (소셜 로그인용)
  updateAdditionalInfo: (data: { nickname: string; birth: string; phoneNum: string }) => {
    return request('/users/additional-info', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  cancelSocialSignup: () => {
    return request('/users/social-cancel', { method: 'DELETE' });
  },

  // 마이페이지 정보 조회
  getMyInfo: () => {
    return request('/users/me', { method: 'GET' });
  },
  // 닉네임 중복 체크
  checkNickname: (nickname: string) => {
    return request(`/users/check-nickname?nickname=${nickname}`, { method: 'POST' });
  },
  // 프로필 이미지 변경 (PATCH)
  updateProfileImage: (formData: FormData) => {
    return request('/users/profile-image', {
      method: 'PATCH',
      body: formData,
      // headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  // 프로필 이미지 삭제 (DELETE)
  deleteProfileImage: () => {
    return request('/users/profile-image', { method: 'DELETE' });
  },
  // 비밀번호 재설정 이메일 요청
  requestPasswordReset: (email: string, source: 'web' | 'app') => {
    return request(`/users/password/reset-request?email=${email}&source=${source}`, {
      method: 'POST',
      skipAuth: true
    });
  },
  // 새 비밀번호로 재설정 (토큰 필요)
  resetPassword: (dto: { token: string; newPassword: string }) => {
    return request('/users/password/reset', {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify(dto),
    });
  },
  // FCM 토큰 업데이트 API
  updateFcmToken: (token: string) => {
    return request('/users/fcm-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },
  // 토큰 재발급 (Refresh Token Rotation)
  reissue: (refreshToken: string) => {
    return request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
      // 만료된 액세스 토큰을 헤더에 붙여서 에러가 나는 걸 방지하기 위해 
      // skipAuth가 있다면 true로 주는 것이 좋습니다.
      skipAuth: true, 
    });
  },
};

export const exchangeApi = {
  // 1. 환율 리스트 및 정렬 필터
  // sort: RISE(급상승), FALL(급하락), HIGH(높은순), LOW(낮은순)
  getExchangeRanking: (sort: string = 'RISE') => {
    return request(`/api/exchange/ranking?sort=${sort}`, {
      method: 'GET'
    });
  },
  // 2. 특정 통화 상세 정보 가져오기
  getExchangeDetail: (code: string) => {
    // URL 파라미터로 통화 코드(USD, JPY 등)를 전달합니다.
    return request(`/api/exchange/detail/${code}`, { method: 'GET' });
  },
  // 3. 특정 통화의 과거 기록 가져오기
  getExchangeHistory: (code: string) => {
    return request(`/api/exchange/history?code=${code}`, { method: 'GET' });
  },
};

export const shoppingApi = {
  // 1. 가격 비교 검색
  comparePrices: (query: string, currencyCode: string) => {
    return request(
      `/api/v1/shopping/compare?query=${encodeURIComponent(query)}&currencyCode=${currencyCode}`,
      { method: 'GET' }
    );
  },
  // 2. OCR 스캔 요청 
  scanProductPrice: (base64Image: string, currency: string) => {
    return request('/api/v1/ocr/scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        currency: currency
      }),
    });
  },
  // 3. 인기 상품 조회(많이 검색한 아이템)
  getPopularItems: (currencyCode: string) => {
    return request(`/api/v1/shopping/popular?currencyCode=${currencyCode}`, {
      method: 'GET'
    });
  },
  // 4. 추천 음식
  getRegionalFoods: (currencyCode: string) => {
    return request(`/food?currencyCode=${currencyCode}`, {
      method: 'GET'
    });
  }
};
export const communityApi = {
  // 1. 게시글 등록하기
  // components/utils/api.ts 의 createPost 수정
  createPost: (postData: {
    title: string;
    content: string;
    category: string;
    code?: string | null;
    image?: any;
  }) => {
    const formData = new FormData();

    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('category', postData.category); // 'FREE', 'TRAVEL' 등이 직접 전달됨

    if (postData.code) {
      formData.append('code', postData.code);
    }

    // 이미지 추가
    if (postData.image) {
      formData.append('image', {
        uri: postData.image.uri,
        name: 'post_image.jpg',
        type: 'image/jpeg',
      } as any);
    }

    return request('/api/community', {
      method: 'POST',
      body: formData,
      // request 함수에서 FormData일 때 Content-Type을 지워주므로 안전합니다.
    });
  },

  // 2. 게시글 목록 조회하기 (필터 및 검색 포함)
  getPosts: (category: string, code: string = '', search: string = '') => {
    const encodedCategory = encodeURIComponent(category);
    const encodedCode = encodeURIComponent(code);
    const encodedSearch = encodeURIComponent(search);

    return request(
      `/api/community?category=${encodedCategory}&code=${encodedCode}&search=${encodedSearch}`,
      { method: 'GET' }
    );
  },

  // 3. 게시글 상세 조회 (게시글 클릭 시 사용)
  getPostDetail: (postId: number) => {
    return request(`/api/community/${postId}`, {
      method: 'GET'
    });
  },

  // 4. 게시글 삭제 (본인 글일 경우)
  deletePost: (postId: number) => {
    return request(`/api/community/${postId}`, {
      method: 'DELETE'
    });
  },
  // 5. 좋아요
  toggleLike: (postId: number) => {
    return request(`/api/community/${postId}/like`, {
      method: 'POST',
      body: JSON.stringify({})
    });
  },
  // 6. 댓글 쓰기
  createComment: (postId: number, content: string) => {
    return request(`/api/community/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
  // 7. 댓글 삭제
  deleteComment: (commentId: number) => {
    return request(`/api/community/comments/${commentId}`, {
      method: 'DELETE',
    });
  },
  // 8. 댓글 목록 조회
  getComments: (postId: number) => {
    return request(`/api/community/${postId}/comments`, {
      method: 'GET',
    });
  },
  // 9. 실시간 핫 게시물(1위) 조회
  getTopHotPost: () => {
    return request('/api/community/hot', {
      method: 'GET'
    });
  },
};

export const notificationApi = {
  // 1. 알림 설정 저장 및 수정
  // { currencyCode: "JPY", targetPercent: 3.0, period: "DAILY", isActive: true }
  updateSetting: (data: {
    currencyCode: string;
    targetPercent: number;
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    isActive: boolean;
  }) => {
    return request('/api/notifications/settings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 2. 내 알림 설정 목록 조회
  getMySettings: () => {
    return request('/api/notifications/settings', {
      method: 'GET',
    });
  },

  // 3. 알림 설정 삭제
  deleteSetting: (settingId: number) => {
    return request(`/api/notifications/settings/${settingId}`, {
      method: 'DELETE',
    });
  },

  // 4. FCM 토큰 업데이트 (알림 컨트롤러 전용 경로)
  // 백엔드 Map<String, String> tokenRequest 구조에 맞춰서 전송
  updateFcmToken: (token: string) => {
    return request('/api/notifications/token', {
      method: 'POST',
      body: JSON.stringify({ fcmToken: token }), // 백엔드 key인 'fcmToken'과 일치시킴
    });
  },
};