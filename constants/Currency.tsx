// 1. 깃발 이모지 맵
export const FLAG_MAP: Record<string, string> = {
  USD: '🇺🇸', EUR: '🇪🇺', JPY: '🇯🇵', CNY: '🇨🇳', HKD: '🇭🇰',
  TWD: '🇹🇼', GBP: '🇬🇧', CHF: '🇨🇭', CAD: '🇨🇦', AUD: '🇦🇺',
  NZD: '🇳🇿', SGD: '🇸🇬', THB: '🇹🇭', MYR: '🇲🇾', IDR: '🇮🇩',
  VND: '🇻🇳', PHP: '🇵🇭', INR: '🇮🇳', SAR: '🇸🇦', AED: '🇦🇪',
  KWD: '🇰🇼', BHD: '🇧🇭'
};

// 2. 통화 정보
export const AVAILABLE_CURRENCIES = [
  { label: '베트남', code: 'VND' },
  { label: '태국', code: 'THB' },
  { label: '필리핀', code: 'PHP' },
  { label: '홍콩', code: 'HKD' },
  { label: '대만', code: 'TWD' },
  { label: '영국', code: 'GBP' },
  { label: '일본', code: 'JPY' },
  { label: '미국', code: 'USD' },
];
export interface DetailedFlag {
  icon: string;
  color: string;
  name: string;
}

export const DETAILED_FLAG_MAP: Record<string, DetailedFlag> = {
  JPY: { icon: 'disc', color: '#BC002D', name: '일본 엔' },
  USD: { icon: 'logo-usd', color: '#85bb65', name: '미국 달러' },
  CNY: { icon: 'flag', color: '#EE1C25', name: '중국 위안' },
  VND: { icon: 'star', color: '#FFFF00', name: '베트남 동' },
  THB: { icon: 'flag', color: '#ED1C24', name: '태국 바트' },
  PHP: { icon: 'flag', color: '#0038A8', name: '필리핀 페소' },
  HKD: { icon: 'flower', color: '#7B001C', name: '홍콩 달러' },
  TWD: { icon: 'flag', color: '#FE0000', name: '대만 달러' },
  GBP: { icon: 'flag', color: '#00247D', name: '영국 파운드' },
  CAD: { icon: 'leaf', color: '#FF0000', name: '캐나다 달러' },
};