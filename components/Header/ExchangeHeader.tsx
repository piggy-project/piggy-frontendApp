import { Typography } from '@/constants/Typography';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BaseHeader from './BaseHeader';
import BackButton from './component/BackButton';
import WonSign from './component/WonSign';

interface Props {
    title?: string;
    country?: string;
    code?: string;
    flag?: string;
    time?: string;
}

export default function ExchangeHeader({ title, country, code, flag, time }: Props) {
    return (
        <BaseHeader
            left={
                <View style={styles.leftContainer}>
                    <WonSign/>
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
                <View style={styles.rightContainer}>
                    {/* 시간이 있으면 시간 표시 */}
                    {time && (
                        <Text style={[styles.timeText, Typography.Pretendard_M_12]}>
                            {time} 기준
                        </Text>
                    )}
                    {/* 국기가 있으면 국기 표시 */}
                    {flag ? (
                        <Text style={styles.flagText}>{flag}</Text>
                    ) : (
                        // 시간도 국기도 없으면 간격 유지용 빈 뷰
                        !time && <View style={{ width: 26 }} />
                    )}
                </View>
            }
        />
    );
}

const styles = StyleSheet.create({
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightContainer: {
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
    timeText: {
        color: '#888',
        marginRight: 8, // 국기와의 간격
    },
    flagText: {
        fontSize: 20,
    },
});