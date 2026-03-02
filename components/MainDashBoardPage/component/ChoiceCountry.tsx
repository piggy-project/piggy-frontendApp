import { Typography } from '@/constants/Typography';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { styles } from './ChoiceCountry.style';

// 모든 지원 국가 및 코드 매핑
const COUNTRY_MAP: { [key: string]: string } = {
    '일본': 'JPY',
    '미국': 'USD',
    '유럽': 'EUR',
    '중국': 'CNY',
    '베트남': 'VND',
    '태국': 'THB',
    '필리핀': 'PHP',
    '홍콩': 'HKD',
    '대만': 'TWD',
    '영국': 'GBP',
};

const AVAILABLE_CURRENCIES = [
    { label: '베트남', code: 'VND' },
    { label: '유럽', code: 'EUR' },
    { label: '태국', code: 'THB' },
    { label: '필리핀', code: 'PHP' },
    { label: '홍콩', code: 'HKD' },
    { label: '대만', code: 'TWD' },
];

interface Props {
    // 이제 부모에게 'JPY', 'USD' 같은 코드를 넘겨줍니다.
    onSelect?: (currencyCode: string) => void; 
}

export default function ChoiceCountry({ onSelect }: Props) {
    // 탭 리스트 관리 (화면 표시용 이름)
    const [tabList, setTabList] = useState(['일본', '미국', '베트남', '태국', '필리핀', '+']);
    const [selectedLabel, setSelectedLabel] = useState('일본');
    const [dropdownVisible, setDropdownVisible] = useState(false);

    // 탭 클릭 핸들러
    const handleTabPress = (label: string) => {
        if (label === '+') {
            setDropdownVisible(true);
        } else {
            setSelectedLabel(label);
            const code = COUNTRY_MAP[label];
            if (onSelect && code) onSelect(code);
        }
    };

    // 드롭다운에서 국가 추가 핸들러
    const handleAddCountry = (currency: any) => {
        setDropdownVisible(false);
        
        // 이미 탭에 있는 경우 선택만 변경
        if (tabList.includes(currency.label)) {
            setSelectedLabel(currency.label);
            if (onSelect) onSelect(currency.code);
            return;
        }

        // 새 국가를 '+' 앞에 추가
        const newList = [...tabList];
        newList.splice(newList.length - 1, 0, currency.label);
        setTabList(newList);
        setSelectedLabel(currency.label);
        
        if (onSelect) onSelect(currency.code);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                bounces={false}
            >
                {tabList.map((label) => {
                    const isSelected = selectedLabel === label;
                    return (
                        <TouchableOpacity
                            key={label}
                            style={[
                                styles.tabItem,
                                isSelected && styles.selectedTabItem
                            ]}
                            onPress={() => handleTabPress(label)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.text, 
                                isSelected && styles.selectedText, 
                                Typography.Pretendard_M_16
                            ]}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <Modal
                visible={dropdownVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setDropdownVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setDropdownVisible(false)}
                >
                    <TouchableWithoutFeedback>
                        <View style={styles.dropdownContainer}>
                            <FlatList
                                data={AVAILABLE_CURRENCIES}
                                keyExtractor={(item) => item.code}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.dropdownItem}
                                        onPress={() => handleAddCountry(item)}
                                    >
                                        <Text style={[styles.dropdownText, Typography.Pretendard_M_14]}>
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}