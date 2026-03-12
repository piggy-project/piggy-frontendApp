import { getToken, removeToken } from './authStore';

// 1. 기본 서버 주소 설정 (안드로이드 에뮬레이터 기준) - 현재 내 ip
const BASE_URL = 'https://piggys.mooo.com';

// 2. Fetch를 더 편하게 쓰기 위한 래퍼 함수 (Interceptor 역할)
const request = async (endpoint: string, options: any = {}) => {
  try {
    const { skipAuth = false, ...fetchOptions } = options;

    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (!skipAuth) {
      const token = await getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const responseText = await response.text();
    let data: any = {};
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        data = { message: responseText };
      }
    }

    if (!response.ok) {
      if (response.status === 401 && !skipAuth) {
        console.warn("🚨 인증 만료: 금고를 비우고 로그아웃 처리를 유도합니다.");
        await removeToken();
      }
      throw { status: response.status, message: data.message || '서버 오류 발생', data };
    }

    return data;
  } catch (error: any) {
    console.error('API Error:', error);
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
      headers: { 'Content-Type': 'multipart/form-data' },
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
  // category: '환율 수다방' | '여행 공유방' | '정보방'
  createPost: (postData: { title: string; content: string; category: string }) => {
    return request('/api/community', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  // 2. 게시글 목록 조회하기 (필터 및 검색 포함)
  getPosts: (category: string, search: string = '') => {
    const encodedCategory = encodeURIComponent(category);
    const encodedSearch = encodeURIComponent(search);
    return request(`/api/community?category=${encodedCategory}&search=${encodedSearch}`, {
      method: 'GET'
    });
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
};