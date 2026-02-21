import { exchangeApi } from './api';

export interface ExchangeRateResponse {
  curUnit: string;
  curNm: string;
  rate: number;
  date: string;
}

export const KoreaEximRateService = {
  getLatestRates: async (): Promise<ExchangeRateResponse[]> => {
    try {
      const data = await exchangeApi.getLatestRates();
      return data;
    } catch (error) {
      console.error('KoreaEximRateService Error:', error);
      throw error;
    }
  }
};