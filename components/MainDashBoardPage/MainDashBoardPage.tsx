import React from 'react';
import { Text, View } from 'react-native';
import MainHeader from '../Header/MainHeader';
import { styles } from './MainDashBoard.styles';
import EstimatedMonthRanking from './component/EstimatedMonthRanking';
import MoneyGoodCountry from './component/MoneyGoodCountry';
import QuestionAI from './component/QuestionAI';
import TodayRecommendCountry from './component/TodayRecommendCountry';

export default function MainDashBoardPage() {
  return (
    <View style={styles.container}>
      <MainHeader />
      <View style={[styles.sectionGap, { flex: 1 }]}>
        {/*<기능 컴포넌트 넣기/>*/}
        <TodayRecommendCountry/>
        <Text style={{fontWeight: 'bold'}}>
          가성비 탑3 국가
        </Text>
        <MoneyGoodCountry/>
        <Text style={{fontWeight: 'bold'}}>
          예상 월별 랭킹
        </Text >
        <EstimatedMonthRanking/>
        <Text style={{fontWeight: 'bold'}}>
          AI에게 물어보세요~
        </Text>
        <QuestionAI/>
      </View>
    </View>
  );
}