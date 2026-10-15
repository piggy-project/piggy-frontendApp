import axios, { AxiosRequestConfig } from 'axios';
import { DeviceEventEmitter } from 'react-native';
import { getAccessToken, getRefreshToken, removeTokens, saveTokens } from './authStore';

const BASE_URL = 'https://piggys.mooo.com';

const api = axios.create({
  baseURL: BASE_URL,
});

// 리프레시 토큰으로 새 토큰을 받는 중인지 확인하는 변수
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Axios 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고, 리프레시 시도를 하지 않았던 요청이라면 (로그인 요청 제외)
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url?.includes('/users/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
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

        console.log('[API] 토큰 만료 발견, 재발급 시도 중...');
        // 서버에 토큰 재발급 요청 (인터셉터 무한 루프 방지를 위해 axios 직발신)
        const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });

        const newAccess = res.data?.accessToken || res.data?.data?.accessToken;
        const newRefresh = res.data?.refreshToken || res.data?.data?.refreshToken || refreshToken;

        if (newAccess) {
          console.log('[API] 토큰 재발급 성공');
          await saveTokens(newAccess, newRefresh);
          processQueue(null, newAccess);

          // 원래 실패했던 요청 다시 시도
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccess}`,
          };
          return api(originalRequest);
        } else {
          throw new Error('Invalid token response from server');
        }
      } catch (refreshError: any) {
        // 저장된 리프레시 토큰이 원래 없는 경우(로그인 전)는 세션 만료가 아니므로 알림 없이 에러만 반환
        if (refreshError.message === 'No refresh token available') {
          processQueue(refreshError, null);
          return Promise.reject(refreshError);
        }

        console.error('[API] 리프레시 실패:', refreshError.response?.data || refreshError.message);
        processQueue(refreshError, null);

        const status = refreshError.response?.status;
        const shouldExpireSession =
          status === 401 ||
          status === 403 ||
          refreshError.message === 'Invalid token response from server';

        if (shouldExpireSession) {
          await removeTokens();

          // 전역 세션 만료 알림 (AuthContext 등에서 감지)
          DeviceEventEmitter.emit('auth-session-expired');
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

  const config: AxiosRequestConfig = {
    url: endpoint,
    method: method,
    headers: { ...customHeaders },
  };

  // 요청 직전에 최신 토큰을 가져옵니다.
  if (!skipAuth) {
    const token = await getAccessToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
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
    // 인터셉터에서 이미 처리된 401 에러는 여기서 다시 던져집니다.
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
      body: JSON.stringify({ token, fcmToken: token }),
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
  // 4. 일일 시간별(09:00 ~ 22:00) 히스토리 조회
  getDailyHourlyHistory: (code: string) => {
    return request(`/api/exchange/history/daily/${encodeURIComponent(code)}`, { 
      method: 'GET' 
    });
  },
  getDailyHourlyHistoryByQuery: (code: string) => {
    return request(`/api/exchange/history/daily?code=${encodeURIComponent(code)}`, {
      method: 'GET',
    });
  },
  // 5. 가성비 여행지 추천 조회
  getTravelRecommendations: () => {
    return request('/api/exchange/travel-recommendations', { method: 'GET' });
  },
  // 6. 환율 즐겨찾기 등록/해제
  toggleFavorite: (currencyCode: string) => {
    return request(`/api/exchange/favorites/${currencyCode}`, {
      method: 'POST',
    });
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
  },
  getFavorites: () => {
    return request('/api/v1/shopping/favorites', {
      method: 'GET',
    });
  },
  toggleFavorite: (favoriteData: {
    source: string;
    externalProductId: string;
    name?: string;
    imageUrl?: string;
    productUrl?: string;
    price?: number;
    shopName?: string;
    currencyCode?: string;
    exchangeRate?: number;
  }) => {
    return request('/api/v1/shopping/favorites/toggle', {
      method: 'POST',
      body: JSON.stringify(favoriteData),
    });
  },
  checkFavorite: (source: string, externalProductId: string) => {
    return request(
      `/api/v1/shopping/favorites/check?source=${encodeURIComponent(source)}&externalProductId=${encodeURIComponent(externalProductId)}`,
      { method: 'GET' }
    );
  },
  deleteFavorite: (favoriteId: number) => {
    return request(`/api/v1/shopping/favorites/${favoriteId}`, {
      method: 'DELETE',
    });
  },
  deleteFavoriteByProduct: (source: string, externalProductId: string) => {
    return request(
      `/api/v1/shopping/favorites?source=${encodeURIComponent(source)}&externalProductId=${encodeURIComponent(externalProductId)}`,
      { method: 'DELETE' }
    );
  },
};

export const chatbotApi = {
  ask: (question: string) => {
    return request(`/api/chatbot/ask?question=${encodeURIComponent(question)}`, {
      method: 'GET',
      skipAuth: true,
    });
  },
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

  // 3. 내 커뮤니티 활동 전체 조회
  getMyActivity: () => {
    return request('/api/community/me', { method: 'GET' });
  },

  // 4. 내가 작성한 게시글 조회
  getMyPosts: () => {
    return request('/api/community/me/posts', { method: 'GET' });
  },

  // 5. 내가 작성한 댓글 조회
  getMyComments: () => {
    return request('/api/community/me/comments', { method: 'GET' });
  },

  // 6. 내가 좋아요한 게시글 조회
  getMyLikedPosts: () => {
    return request('/api/community/me/liked-posts', { method: 'GET' });
  },

  // 7. 게시글 상세 조회 (게시글 클릭 시 사용)
  getPostDetail: (postId: number) => {
    return request(`/api/community/${postId}`, {
      method: 'GET'
    });
  },

  // 8. 게시글 삭제 (본인 글일 경우)
  deletePost: (postId: number) => {
    return request(`/api/community/${postId}`, {
      method: 'DELETE'
    });
  },
  // 9. 좋아요
  toggleLike: (postId: number) => {
    return request(`/api/community/${postId}/like`, {
      method: 'POST',
      body: JSON.stringify({})
    });
  },
  // 10. 댓글 쓰기
  createComment: (postId: number, content: string) => {
    return request(`/api/community/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
  // 11. 댓글 삭제
  deleteComment: (commentId: number) => {
    return request(`/api/community/comments/${commentId}`, {
      method: 'DELETE',
    });
  },
  // 12. 댓글 목록 조회
  getComments: (postId: number) => {
    return request(`/api/community/${postId}/comments`, {
      method: 'GET',
    });
  },
  // 13. 실시간 핫 게시물(1위) 조회
  getTopHotPost: () => {
    return request('/api/community/hot', {
      method: 'GET'
    });
  },
  // 14. 게시글 수정하기 (PATCH)
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
  getNotifications: () => {
    return request('/api/notifications', {
      method: 'GET',
    });
  },
  markNotificationAsRead: (notificationId: number | string) => {
    return request(`/api/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  },
  deleteNotification: (notificationId: number | string) => {
    return request(`/api/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  },
  updatePercentSetting: (data: {
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
  updateSetting: (data: {
    currencyCode: string;
    targetPercent: number;
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    isActive: boolean;
  }) => {
    return notificationApi.updatePercentSetting(data);
  },
  getPercentSettings: () => {
    return request('/api/notifications/settings', {
      method: 'GET',
    });
  },
  getMySettings: () => {
    return notificationApi.getPercentSettings();
  },
  deletePercentSetting: (settingId: number) => {
    return request(`/api/notifications/settings/${settingId}`, {
      method: 'DELETE',
    });
  },
  deleteSetting: (settingId: number) => {
    return notificationApi.deletePercentSetting(settingId);
  },
  updateTargetPrice: (data: {
    currencyCode: string;
    targetPrice: number;
    direction: 'ABOVE' | 'BELOW';
    isActive: boolean;
  }) => {
    return request('/api/notifications/target-price', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  getTargetPrices: () => {
    return request('/api/notifications/target-price', {
      method: 'GET',
    });
  },
  deleteTargetPrice: (settingId: number) => {
    return request(`/api/notifications/target-price/${settingId}`, {
      method: 'DELETE',
    });
  },
  toggleLowestPrice: (currencyCode: string) => {
    return request(`/api/notifications/lowest-price/${currencyCode}`, {
      method: 'POST',
    });
  },
  toggleVolatility: (currencyCode: string) => {
    return request(`/api/notifications/volatility/${currencyCode}`, {
      method: 'POST',
    });
  },
  updateFcmToken: (token: string) => {
    return request('/api/notifications/token', {
      method: 'POST',
      body: JSON.stringify({ fcmToken: token, token: token }),
    });
  },
};
