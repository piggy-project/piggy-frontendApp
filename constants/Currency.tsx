import AmericaFlag from '@/assets/icons/americaflag.svg';
import AustraliaFlag from '@/assets/icons/australiaflag.svg';
import ChinaFlag from '@/assets/icons/chinaflag.svg';
import FrenchFlag from '@/assets/icons/frenchflag.svg';
import GermanyFlag from '@/assets/icons/germanyflag.svg';
import JapanFlag from '@/assets/icons/japanflag.svg';
import PhilippinesFlag from '@/assets/icons/philippinesflag.svg';
import ThailandFlag from '@/assets/icons/thailandflag.svg';
import UkFlag from '@/assets/icons/ukflag.svg';
import VietnamFlag from '@/assets/icons/vietnamflag.svg';
import type React from 'react';
import { SvgProps } from 'react-native-svg';

export interface CurrencyInfo {
  code: string;
  apiCode: string;
  label: string;
  FlagIcon: React.FC<SvgProps>;
}

// 1. 국가별 통화/국기 정보
export const CURRENCY_INFO_MAP: Record<string, CurrencyInfo> = {
  JPY: { code: 'JPY', apiCode: 'JPY', label: '일본', FlagIcon: JapanFlag },
  USD: { code: 'USD', apiCode: 'USD', label: '미국', FlagIcon: AmericaFlag },
  CNY: { code: 'CNY', apiCode: 'CNY', label: '중국', FlagIcon: ChinaFlag },
  VND: { code: 'VND', apiCode: 'VND', label: '베트남', FlagIcon: VietnamFlag },
  THB: { code: 'THB', apiCode: 'THB', label: '태국', FlagIcon: ThailandFlag },
  PHP: { code: 'PHP', apiCode: 'PHP', label: '필리핀', FlagIcon: PhilippinesFlag },
  DEU_EUR: { code: 'DEU_EUR', apiCode: 'EUR', label: '독일', FlagIcon: GermanyFlag },
  FRA_EUR: { code: 'FRA_EUR', apiCode: 'EUR', label: '프랑스', FlagIcon: FrenchFlag },
  AUD: { code: 'AUD', apiCode: 'AUD', label: '호주', FlagIcon: AustraliaFlag },
  GBP: { code: 'GBP', apiCode: 'GBP', label: '영국', FlagIcon: UkFlag },
};

// 2. 국가별 국기 SVG 아이콘 맵
export const FLAG_ICON_MAP: Record<string, React.FC<SvgProps>> = Object.fromEntries(
  Object.entries(CURRENCY_INFO_MAP).map(([code, info]) => [code, info.FlagIcon])
);

// 3. 지원 국가/통화 정보 (ChoiceCountry 등에서 사용)
export const AVAILABLE_CURRENCIES = Object.values(CURRENCY_INFO_MAP).map(({ label, code }) => ({
  label,
  code,
}));

export const getCurrencyApiCode = (code: string) => CURRENCY_INFO_MAP[code]?.apiCode || code;

export const getCurrencyLabel = (code: string) => CURRENCY_INFO_MAP[code]?.label;
