import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TextInput, View } from 'react-native';
import { styles } from './SearchCommunity.styles';

interface SearchProps {
  searchText: string;
  setSearchText: (text: string) => void;
}

const SearchCommunity = ({ searchText, setSearchText }: SearchProps) => {
  return (
    <View style={styles.searchSection}>
      <Ionicons name="search-outline" size={16} color="#777" style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        placeholder="검색어를 입력하세요"
        placeholderTextColor="#999"
        value={searchText}
        onChangeText={setSearchText}
      />
    </View>
  );
};

export default SearchCommunity;