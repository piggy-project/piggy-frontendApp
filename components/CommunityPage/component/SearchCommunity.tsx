import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './SearchCommunity.styles';

interface SearchCommunityProps {
  onSearch?: (text: string) => void;
  onClear?: () => void;
  onFocus?: () => void;
  onBack?: () => void;
  variant?: 'header' | 'search';
  autoFocus?: boolean;
}

const RECENT_SEARCHES_KEY = 'piggy-community-recent-searches';
const RECENT_SEARCH_LIMIT = 12;

const SearchCommunity = ({
  onSearch,
  onClear,
  onFocus,
  onBack,
  variant = 'header',
  autoFocus = false,
}: SearchCommunityProps) => {
  const inputRef = useRef<TextInput>(null);
  const [searchText, setSearchText] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const isSearchVariant = variant === 'search';

  const insets = useSafeAreaInsets();
  const androidStatusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;
  const topInset = Platform.OS === 'android'
    ? Math.max(insets.top, androidStatusBarHeight)
    : insets.top;

  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const saved = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        const parsed = saved ? JSON.parse(saved) : [];
        setRecentSearches(Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : []);
      } catch (error) {
        console.error('최근 검색어 로딩 실패:', error);
      }
    };
    loadRecentSearches();
  }, []);

  useEffect(() => {
    if (!autoFocus) return;
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [autoFocus]);

  const saveRecentSearch = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const nextSearches = [
      trimmed,
      ...recentSearches.filter((item) => item !== trimmed),
    ].slice(0, RECENT_SEARCH_LIMIT);

    setRecentSearches(nextSearches);

    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(nextSearches));
    } catch (error) {
      console.error('최근 검색어 저장 실패:', error);
    }
  };

  const handleSearch = async (nextText: string = searchText) => {
    const trimmed = nextText.trim();
    if (!trimmed) return;

    setSearchText(trimmed);
    await saveRecentSearch(trimmed);
    if (onSearch) onSearch(trimmed);
  };

  const handleClear = () => {
    setSearchText('');
    if (onClear) onClear();
  };

  const handleRecentPress = (text: string) => {
    handleSearch(text);
  };

  return (
    <View
      style={[
        isSearchVariant && styles.searchModeContainer,
        isSearchVariant && { paddingTop: topInset + 10 },
      ]}
    >
      <View style={isSearchVariant ? styles.searchModeHeader : undefined}>
        {isSearchVariant && (
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={25} color="#555" />
          </TouchableOpacity>
        )}

        <View style={[styles.searchSection, isSearchVariant && styles.searchModeSection]}>
          <Ionicons name="search-outline" size={16} color="#777" style={styles.searchIcon} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="검색어를 입력하세요"
            placeholderTextColor="#999"
            value={searchText}
            onFocus={onFocus}
            onChangeText={(text) => {
              setSearchText(text);
              if (text === '' && onClear) onClear();
            }}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={handleClear} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isSearchVariant && (
        <View style={styles.recentContainer}>
          <Text style={styles.recentTitle}>최근 검색어</Text>
          <View style={styles.recentList}>
            {recentSearches.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.recentChip}
                activeOpacity={0.75}
                onPress={() => handleRecentPress(item)}
              >
                <Text style={styles.recentChipText} numberOfLines={1}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default SearchCommunity;