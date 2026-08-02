import { FLAG_ICON_MAP } from '@/constants/Currency';
import { Typography } from '@/constants/Typography';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BaseHeader from './BaseHeader';
import { styles as baseStyles } from './BaseHeader.styles';
import BackButton from './component/BackButton';
import Piggylogo from './component/piggylogo';

interface Props {
    title?: string;
    country?: string;
    code?: string;
    displayCode?: string;
    flag?: string;
    time?: string;
    showBackButton?: boolean;
}

export default function ExchangeHeader({ title, country, code, displayCode, flag, time, showBackButton = false }: Props) {
    const iconCode = displayCode || code;
    const FlagIcon = iconCode ? FLAG_ICON_MAP[iconCode] : null;

    return (
        <BaseHeader
            left={
                <>
                    {showBackButton ? <BackButton /> : <Piggylogo />}
                    {/* 1순위: title이 있으면 title 표시 */}
                    {title ? (
                        <Text style={baseStyles.title}>
                            {title}
                        </Text>
                    ) : (
                        /* 2순위: title은 없지만 국가명이나 코드가 있으면 표시 */
                        (country || code) && (
                            <Text style={baseStyles.title}>
                                {country} <Text style={styles.codeText}>({code})</Text>
                            </Text>
                        )
                    )}
                </>
            }

            center={null}

            right={
                <>
                    {/* 시간이 있으면 시간 표시 */}
                    {time && (
                        <Text style={[styles.timeText, Typography.Pretendard_M_12]}>
                            {time} 기준
                        </Text>
                    )}
                    {/* 국기가 있으면 국기 표시 */}
                    {FlagIcon ? (
                        <FlagIcon/>
                    ) : flag ? (
                        <Text style={styles.flagText}>{flag}</Text>
                    ) : (
                        // 시간도 국기도 없으면 간격 유지용 빈 뷰
                        !time && <View style={{ width: 26 }} />
                    )}
                </>
            }
        />
    );
}

const styles = StyleSheet.create({
    codeText: {
        color: '#000',
    },
    timeText: {
        color: '#888',
    },
    flagText: {
        fontSize: 20,
    },
});
