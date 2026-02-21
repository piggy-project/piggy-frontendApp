import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BaseHeader from './BaseHeader';
import BackButton from './component/BackButton';
import { Typography } from '@/constants/Typography';

interface Props {
    title?: string;
    country?: string;
    code?: string;
    flag?: string;
}

export default function ExchangeHeader({ title, country, code, flag }: Props) {
    return (
        <BaseHeader
            left={
                <View style={styles.leftContainer}>
                    <BackButton />
                    {title ? (
                        <Text style={[styles.title, Typography.Pretendard_M_16]}>{title}</Text>
                    ) : (
                        // 국가명과 코드가 있는 경우
                        <Text style={[styles.title, Typography.Pretendard_M_16]}>
                            {country} <Text style={styles.codeText}>({code})</Text>
                        </Text>
                    )}
                </View>
            }

            center={null}

            right={
                flag ? (
                    <Text style={styles.flagText}>{flag}</Text>
                ) : (
                    <View style={{ width: 26 }} />
                )
            }
        />
    );
}

const styles = StyleSheet.create({
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        color: '#000',
        marginLeft: 8,
    },
    codeText: {
        color: '#000',
    },
    flagText: {
        fontSize: 20,
    },
});