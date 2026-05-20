// 1. 깃발 이모지 맵 (10개국 최적화)
export const FLAG_MAP: Record<string, string> = {
  JPY: '🇯🇵',
  USD: '🇺🇸',
  CNY: '🇨🇳',
  VND: '🇻🇳',
  THB: '🇹🇭',
  PHP: '🇵🇭',
  DEU_EUR: '🇩🇪', // 독일
  FRA_EUR: '🇫🇷', // 프랑스
  AUD: '🇦🇺',
  GBP: '🇬🇧',
};

// 2. 지원 국가/통화 정보 (ChoiceCountry 등에서 사용)
export const AVAILABLE_CURRENCIES = [
  { label: '일본', code: 'JPY' },
  { label: '미국', code: 'USD' },
  { label: '중국', code: 'CNY' },
  { label: '베트남', code: 'VND' },
  { label: '태국', code: 'THB' },
  { label: '필리핀', code: 'PHP' },
  { label: '독일', code: 'DEU_EUR' },
  { label: '프랑스', code: 'FRA_EUR' },
  { label: '호주', code: 'AUD' },
  { label: '영국', code: 'GBP' },
];

export interface DetailedFlag {
  icon: string;
  color: string;
  name: string;
}

// 3. 상세 정보 맵 (유로존 국가별 색상 및 이름 분리)
export const DETAILED_FLAG_MAP: Record<string, DetailedFlag> = {
  JPY: { icon: 'disc', color: '#BC002D', name: '일본' },
  USD: { icon: 'logo-usd', color: '#85bb65', name: '미국' },
  CNY: { icon: 'flag', color: '#EE1C25', name: '중국' },
  VND: { icon: 'star', color: '#FFFF00', name: '베트남' },
  THB: { icon: 'flag', color: '#ED1C24', name: '태국' },
  PHP: { icon: 'flag', color: '#0038A8', name: '필리핀' },
  DEU_EUR: { icon: 'logo-euro', color: '#FFCE00', name: '독일' },
  FRA_EUR: { icon: 'logo-euro', color: '#003399', name: '프랑스' },
  AUD: { icon: 'flag', color: '#012169', name: '호주' },
  GBP: { icon: 'flag', color: '#00247D', name: '영국' },
};