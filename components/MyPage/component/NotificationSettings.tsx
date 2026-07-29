import { notificationApi } from '@/components/utils/api';
import { AVAILABLE_CURRENCIES, getCurrencyApiCode } from '@/constants/Currency';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

type PercentSetting = {
  id: number;
  currencyCode: string;
  targetPercent: number;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  periodLabel?: string;
  isActive: boolean;
};

type TargetPriceSetting = {
  id: number;
  currencyCode: string;
  targetPrice: number;
  direction: 'ABOVE' | 'BELOW';
  directionLabel?: string;
  isActive: boolean;
};

const PERIOD_OPTIONS = [
  { label: '전일', value: 'DAILY' },
  { label: '주간', value: 'WEEKLY' },
  { label: '월간', value: 'MONTHLY' },
] as const;

const DIRECTION_OPTIONS = [
  { label: '이하', value: 'BELOW' },
  { label: '이상', value: 'ABOVE' },
] as const;

export default function NotificationSettings() {
  const currencyOptions = useMemo(() => AVAILABLE_CURRENCIES.slice(0, 6), []);
  const [selectedCurrency, setSelectedCurrency] = useState('JPY');
  const [targetPercent, setTargetPercent] = useState('3');
  const [period, setPeriod] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY');
  const [targetPrice, setTargetPrice] = useState('');
  const [direction, setDirection] = useState<'ABOVE' | 'BELOW'>('BELOW');
  const [percentSettings, setPercentSettings] = useState<PercentSetting[]>([]);
  const [targetPriceSettings, setTargetPriceSettings] = useState<TargetPriceSetting[]>([]);
  const [lowestAlertOn, setLowestAlertOn] = useState(false);
  const [volatilityAlertOn, setVolatilityAlertOn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const apiCurrencyCode = getCurrencyApiCode(selectedCurrency);

  const fetchSettings = async () => {
    try {
      const [percentRes, targetPriceRes] = await Promise.all([
        notificationApi.getPercentSettings(),
        notificationApi.getTargetPrices(),
      ]);
      const percentItems = percentRes?.data || percentRes || [];
      const targetPriceItems = targetPriceRes?.data || targetPriceRes || [];
      setPercentSettings(Array.isArray(percentItems) ? percentItems : []);
      setTargetPriceSettings(Array.isArray(targetPriceItems) ? targetPriceItems : []);
    } catch (error: any) {
      console.error('알림 설정 조회 실패:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSavePercent = async () => {
    const parsedPercent = Number(targetPercent);
    if (!parsedPercent) {
      Alert.alert('알림', '퍼센트를 입력해주세요.');
      return;
    }

    try {
      setIsSaving(true);
      await notificationApi.updatePercentSetting({
        currencyCode: apiCurrencyCode,
        targetPercent: parsedPercent,
        period,
        isActive: true,
      });
      await fetchSettings();
      Alert.alert('알림', '퍼센트 알림 설정이 저장되었습니다.');
    } catch (error: any) {
      console.error('퍼센트 알림 저장 실패:', error.response?.data || error.message);
      Alert.alert('오류', '퍼센트 알림 저장 중 문제가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTargetPrice = async () => {
    const parsedPrice = Number(targetPrice);
    if (!parsedPrice) {
      Alert.alert('알림', '목표 환율을 입력해주세요.');
      return;
    }

    try {
      setIsSaving(true);
      await notificationApi.updateTargetPrice({
        currencyCode: apiCurrencyCode,
        targetPrice: parsedPrice,
        direction,
        isActive: true,
      });
      setTargetPrice('');
      await fetchSettings();
      Alert.alert('알림', '목표가 알림이 설정되었습니다.');
    } catch (error: any) {
      console.error('목표가 알림 저장 실패:', error.response?.data || error.message);
      Alert.alert('오류', '목표가 알림 저장 중 문제가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePercent = async (id: number) => {
    await notificationApi.deletePercentSetting(id);
    await fetchSettings();
  };

  const handleDeleteTargetPrice = async (id: number) => {
    await notificationApi.deleteTargetPrice(id);
    await fetchSettings();
  };

  const handleToggleLowest = async () => {
    try {
      const response = await notificationApi.toggleLowestPrice(apiCurrencyCode);
      setLowestAlertOn(Boolean(response?.isLowestAlertOn ?? response?.data?.isLowestAlertOn));
    } catch (error: any) {
      console.error('최저가 알림 토글 실패:', error.response?.data || error.message);
      Alert.alert('오류', '최저가 알림 변경 중 문제가 발생했습니다.');
    }
  };

  const handleToggleVolatility = async () => {
    try {
      const response = await notificationApi.toggleVolatility(apiCurrencyCode);
      setVolatilityAlertOn(Boolean(response?.isVolatilityAlertOn ?? response?.data?.isVolatilityAlertOn));
    } catch (error: any) {
      console.error('급등락 알림 토글 실패:', error.response?.data || error.message);
      Alert.alert('오류', '급등락 알림 변경 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, Typography.Pretendard_B_16]}>알림 설정</Text>

      <View style={styles.currencyList}>
        {currencyOptions.map((currency) => (
          <TouchableOpacity
            key={currency.code}
            style={[styles.chip, selectedCurrency === currency.code && styles.activeChip]}
            onPress={() => setSelectedCurrency(currency.code)}
          >
            <Text style={[styles.chipText, selectedCurrency === currency.code && styles.activeChipText]}>
              {currency.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.settingBox}>
        <Text style={[styles.boxTitle, Typography.Pretendard_M_14]}>변동률 알림</Text>
        <View style={styles.inputRow}>
          <TextInput
            value={targetPercent}
            onChangeText={setTargetPercent}
            keyboardType="decimal-pad"
            style={styles.input}
            placeholder="3.0"
          />
          <Text style={styles.unitText}>%</Text>
        </View>
        <View style={styles.optionRow}>
          {PERIOD_OPTIONS.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[styles.optionButton, period === item.value && styles.activeOptionButton]}
              onPress={() => setPeriod(item.value)}
            >
              <Text style={[styles.optionText, period === item.value && styles.activeOptionText]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSavePercent} disabled={isSaving}>
          <Text style={[styles.saveButtonText, Typography.Pretendard_M_14]}>변동률 알림 저장</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingBox}>
        <Text style={[styles.boxTitle, Typography.Pretendard_M_14]}>목표가 알림</Text>
        <View style={styles.inputRow}>
          <TextInput
            value={targetPrice}
            onChangeText={setTargetPrice}
            keyboardType="decimal-pad"
            style={styles.input}
            placeholder="목표 환율"
          />
          <Text style={styles.unitText}>원</Text>
        </View>
        <View style={styles.optionRow}>
          {DIRECTION_OPTIONS.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[styles.optionButton, direction === item.value && styles.activeOptionButton]}
              onPress={() => setDirection(item.value)}
            >
              <Text style={[styles.optionText, direction === item.value && styles.activeOptionText]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveTargetPrice} disabled={isSaving}>
          <Text style={[styles.saveButtonText, Typography.Pretendard_M_14]}>목표가 알림 저장</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.toggleRow}>
        <Text style={[styles.toggleLabel, Typography.Pretendard_M_14]}>최저가 알림</Text>
        <View style={styles.switchWrapper}>
          <Switch value={lowestAlertOn} onValueChange={handleToggleLowest} />
        </View>
      </View>
      <View style={styles.toggleRow}>
        <Text style={[styles.toggleLabel, Typography.Pretendard_M_14]}>급등락 변동성 알림</Text>
        <View style={styles.switchWrapper}>
          <Switch value={volatilityAlertOn} onValueChange={handleToggleVolatility} />
        </View>
      </View>

      {[...percentSettings, ...targetPriceSettings].length > 0 && (
        <View style={styles.savedList}>
          {percentSettings.map((item) => (
            <SavedRow
              key={`percent-${item.id}`}
              title={`${item.currencyCode} ${item.targetPercent}% ${item.periodLabel || item.period}`}
              onDelete={() => handleDeletePercent(item.id)}
            />
          ))}
          {targetPriceSettings.map((item) => (
            <SavedRow
              key={`target-${item.id}`}
              title={`${item.currencyCode} ${Number(item.targetPrice).toLocaleString()}원 ${item.directionLabel || item.direction}`}
              onDelete={() => handleDeleteTargetPrice(item.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function SavedRow({ title, onDelete }: { title: string; onDelete: () => void }) {
  return (
    <View style={styles.savedRow}>
      <Text style={[styles.savedText, Typography.Pretendard_M_12]} numberOfLines={1}>{title}</Text>
      <TouchableOpacity onPress={onDelete} hitSlop={8}>
        <Ionicons name="close" size={18} color="#999" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#495057',
    marginBottom: 14,
  },
  currencyList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  activeChip: {
    backgroundColor: '#FFD3DD',
  },
  chipText: {
    color: '#777',
    fontSize: 12,
  },
  activeChipText: {
    color: '#111',
    fontWeight: '700',
  },
  settingBox: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  boxTitle: {
    color: '#222',
    marginBottom: 10,
  },
  inputRow: {
    height: 42,
    borderRadius: 8,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#222',
    paddingVertical: 0,
  },
  unitText: {
    color: '#777',
    fontSize: 13,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  optionButton: {
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  activeOptionButton: {
    backgroundColor: '#333',
  },
  optionText: {
    color: '#777',
    fontSize: 12,
  },
  activeOptionText: {
    color: '#fff',
  },
  saveButton: {
    height: 40,
    borderRadius: 8,
    marginTop: 12,
    backgroundColor: '#FFD3DD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#111',
  },
  toggleRow: {
    minHeight: 52,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  toggleLabel: {
    color: '#333',
  },
  switchWrapper: {
    width: 52,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedList: {
    marginTop: 10,
    gap: 8,
  },
  savedRow: {
    minHeight: 36,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  savedText: {
    flex: 1,
    color: '#555',
    marginRight: 8,
  },
});
