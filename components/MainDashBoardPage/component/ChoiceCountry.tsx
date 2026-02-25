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

const AVAILABLE_CURRENCIES = [
    { label: '베트남', code: 'VND' },
    { label: '태국', code: 'THB' },
    { label: '필리핀', code: 'PHP' },
    { label: '홍콩', code: 'HKD' },
    { label: '대만', code: 'TWD' },
    { label: '영국', code: 'GBP' },
];

interface Props {
    onSelect?: (country: string) => void;
}

export default function ChoiceCountry({ onSelect }: Props) {
    const [tabList, setTabList] = useState(['일본', '미국', '중국', '+']);
    const [selectedCountry, setSelectedCountry] = useState(tabList[0]);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const handleTabPress = (country: string) => {
        if (country === '+') {
            setDropdownVisible(true);
        } else {
            setSelectedCountry(country);
            if (onSelect) onSelect(country);
        }
    };

    const handleAddCountry = (currency: any) => {
        setDropdownVisible(false);
        if (tabList.includes(currency.label)) {
            setSelectedCountry(currency.label);
            return;
        }
        const newList = [...tabList];
        newList.splice(newList.length - 1, 0, currency.label);
        setTabList(newList);
        setSelectedCountry(currency.label);
        if (onSelect) onSelect(currency.label);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                bounces={false}
            >
                {tabList.map((country) => {
                    const isSelected = selectedCountry === country;
                    return (
                        <TouchableOpacity
                            key={country}
                            style={[
                                styles.tabItem,
                                isSelected && styles.selectedTabItem
                            ]}
                            onPress={() => handleTabPress(country)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.text, 
                                isSelected && styles.selectedText, 
                                Typography.Pretendard_M_16
                            ]}>
                                {country}
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