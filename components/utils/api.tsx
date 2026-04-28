import axios, { AxiosRequestConfig } from 'axios';
import { Alert } from 'react-native';
import { getAccessToken, getRefreshToken, removeTokens, saveTokens } from './authStore';

const BASE_URL = 'https://piggys.mooo.com';

const api = axios.create({
  baseURL: BASE_URL,
});

// 📍 [추가] 리프레시 토큰으로 새 토큰을 받는 중인지 확인하는 변수
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// 📍 [핵심] Axios 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고, 리프레시 시도를 하지 않았던 요청이라면
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/users/login')) {
      if (isRefreshing) {
        // 이미 다른 요청이 리프레시 중이라면 큐에 담고 대기
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token available');

        // 서버에 토큰 재발급 요청 (인터셉터 무한 루프 방지를 위해 axios 직발신)
        const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });

        const access = res.data.accessToken;
        const refresh = res.data.refreshToken;

        if (access && refresh) {
          await saveTokens(access, refresh);
          processQueue(null, access);

          // 원래 실패했던 요청 다시 시도
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        console.error(" 리프레시 실패 상세 에러:", refreshError.response?.data || refreshError.message);
        
        await removeTokens();
        
        // 전역 이벤트 발생 (AuthContext에서 감지하여 setUser(null) 처리)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth-session-expired'));
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

const request = async (endpoint: string, options: any = {}) => {
  const { method = 'GET', body, skipAuth = false, headers: customHeaders } = options;

  let token = null;
  if (!skipAuth) {
    token = await getAccessToken();
  }

  const config: AxiosRequestConfig = {
    url: endpoint,
    method: method,
    headers: { ...customHeaders },
  };

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  if (body) {
    if (body instanceof FormData) {
      config.data = body;
    } else {
      config.headers = { ...config.headers, 'Content-Type': 'application/json' };
      config.data = typeof body === 'string' ? JSON.parse(body) : body;
    }
  }

  try {
    const response = await api(config);
    return response.data;
  } catch (error: any) {
    throw error;
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
  // 10. 게시글 수정하기 (PATCH)
  updatePost: (
    postId: number,
    updateData: {
      title: string;
      content: string;
      code?: string | null;
      image?: any;
      removeImage?: boolean;
    }
  ) => {
    const formData = new FormData();

    formData.append('title', updateData.title);
    formData.append('content', updateData.content);

    if (updateData.code) {
      formData.append('code', updateData.code);
    }

    // 기존 이미지를 삭제하고 싶을 때 true 전달
    if (updateData.removeImage !== undefined) {
      formData.append('removeImage', String(updateData.removeImage));
    }

    // 새로운 이미지 파일이 있는 경우 추가
    if (updateData.image) {
      formData.append('image', {
        uri: updateData.image.uri,
        name: 'update_image.jpg',
        type: 'image/jpeg',
      } as any);
    }

    return request(`/api/community/${postId}`, {
      method: 'PATCH',
      body: formData,
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