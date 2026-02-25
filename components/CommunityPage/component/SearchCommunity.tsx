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
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder="검색어를 입력하세요"
          placeholderTextColor="#C7C7CD"
          value={searchText}
          onChangeText={setSearchText} // 입력 시 상태 업데이트
        />
        <Ionicons name="search" size={20} color="#C7C7CD" style={styles.searchIcon} />
      </View>
    </View>
  );
};

export default SearchCommunity;