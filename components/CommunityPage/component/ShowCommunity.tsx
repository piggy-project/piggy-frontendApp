import { Typography } from '@/constants/Typography';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './ShowCommunity.styles';

interface ShowCommunityProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeCode: string | null;
  setActiveCode: (code: string | null) => void;
  onInteract?: () => void; // 추가: 탭/드롭다운 조작 시 호출
}

const ShowCommunity = ({ activeTab, setActiveTab, activeCode, setActiveCode, onInteract }: ShowCommunityProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const tabs = ['자유게시판', '환율게시판', '여행게시판'];

  const currencyList = [
    { code: 'ALL', name: '전체보기' },
    { code: 'USD', name: '미국 달러' },
    { code: 'JPY', name: '일본 엔' },
    { code: 'CNY', name: '중국 위안' },
    { code: 'EUR', name: '유럽연합 유로' },
    { code: 'VND', name: '베트남 동' },
    { code: 'PHP', name: '필리핀 페소' },
    { code: 'THB', name: '태국 바트' },
    { code: 'AUD', name: '호주 달러' },
    { code: 'GBP', name: '영국 파운드' },
  ];

  const handleTabPress = (tab: string) => {
    if (tab === '환율게시판') {
      if (activeTab === '환율게시판') {
        setIsDropdownOpen(!isDropdownOpen);
      } else {
        setActiveTab(tab);
        setIsDropdownOpen(false);
      }
    } else {
      setActiveTab(tab);
      setIsDropdownOpen(false);
      setActiveCode(null);
    }
    onInteract?.(); // 탭 클릭 시 검색 초기화
  };

  const handleSelectCode = (code: string) => {
    setActiveCode(code);
    setIsDropdownOpen(false);
    onInteract?.(); // 통화 선택 시(전체보기 포함) 검색 초기화
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {tabs.map((tab) => (
          <View key={tab} style={styles.tabWrapper}>
            <TouchableOpacity
              onPress={() => handleTabPress(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <Text style={[
                  styles.tabText,
                  Typography.Pretendard_M_16,
                  activeTab === tab && styles.activeTabText
                ]}>
                  {tab === '환율게시판' && activeCode && activeCode !== 'ALL'
                    ? `${tab}(${activeCode})`
                    : tab}
                </Text>

                {tab === '환율게시판' && (
                  <Image
                    source={require('@/assets/images/dropdown.png')}
                    style={{ width: 10, height: 10, marginLeft: 4, tintColor: '#C9C9C9' }}
                    resizeMode="contain"
                  />
                )}
              </View>
            </TouchableOpacity>

            {tab === '환율게시판' && isDropdownOpen && (
              <View style={[styles.dropdownContainer, { height: 250 }]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {currencyList.map((item) => (
                    <TouchableOpacity
                      key={item.code}
                      style={styles.dropdownItem}
                      onPress={() => handleSelectCode(item.code)}
                    >
                      <Text style={[
                        Typography.Pretendard_M_14,
                        {
                          color: (activeCode === item.code) ? '#FF6B6B' : '#333'
                        }
                      ]}>
                        {item.code === 'ALL' ? item.name : `${item.name}(${item.code})`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default ShowCommunity;