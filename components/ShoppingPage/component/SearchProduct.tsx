import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchProductProps {
  onSearch?: (text: string) => void;
  onClear?: () => void;
  onFocus?: () => void;
  onBack?: () => void;
  variant?: 'compact' | 'search' | 'header';
  autoFocus?: boolean;
}

const RECENT_SEARCHES_KEY = 'piggy-shopping-recent-searches';
const RECENT_SEARCH_LIMIT = 12;

export default function SearchProduct({
  onSearch,
  onClear,
  onFocus,
  onBack,
  variant = 'compact',
  autoFocus = false,
}: SearchProductProps) {
  const inputRef = useRef<TextInput>(null);
  const [searchText, setSearchText] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const isSearchVariant = variant === 'search';
  const isHeaderVariant = variant === 'header';

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
    <View style={[styles.container, isSearchVariant && styles.searchModeContainer, isHeaderVariant && styles.headerContainer]}>
      <View style={isSearchVariant ? styles.searchModeHeader : undefined}>
        {isSearchVariant && (
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={28} color="#555" />
          </TouchableOpacity>
        )}

        <View style={[styles.searchBar, isSearchVariant && styles.searchModeBar, isHeaderVariant && styles.headerSearchBar]}>
          <Ionicons name="search-outline" size={isHeaderVariant ? 16 : 20} color="#777" style={styles.icon} />
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
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  searchModeContainer: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 0,
  },
  headerContainer: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  searchModeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 34,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 48,
  },
  searchModeBar: {
    flex: 1,
    height: 42,
    borderRadius: 22,
  },
  headerSearchBar: {
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    paddingVertical: 0,
  },
  recentContainer: {
    paddingTop: 26,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  recentTitle: {
    marginBottom: 14,
    color: '#222',
    fontSize: 14,
    fontWeight: '600',
  },
  recentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 10,
    rowGap: 12,
  },
  recentChip: {
    maxWidth: '48%',
    minHeight: 30,
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 14,
  },
  recentChipText: {
    color: '#777',
    fontSize: 12,
  },
});
