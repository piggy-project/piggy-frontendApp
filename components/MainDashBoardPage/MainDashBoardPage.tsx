import React from 'react';
import { Text, View } from 'react-native';
import MainHeader from '../Header/MainHeader';
import { styles } from './MainDashBoard.styles';
import ChoiceCountry from './component/ChoiceCountry';
import EstimatedMonthRanking from './component/EstimatedMonthRanking';
import MoneyGoodCountry from './component/MoneyGoodCountry';
import QuestionAI from './component/QuestionAI';

export default function MainDashBoardPage() {
  const handleCountrySelect = (country: string) => {
    console.log(`[메인페이지] ${country} 데이터 요청 중...`);
    
    // 나중에 여기에 API 코드를 넣으면 됩니다.
    // fetch(`http://.../api/rates?country=${country}`)
    //   .then(res => res.json())
    //   .then(data => { ... })
  };

  return (
    <View style={styles.container}>
      <MainHeader />
      <View style={[styles.sectionGap, { flex: 1 }]}>
        {/*<기능 컴포넌트 넣기/>*/}
        <ChoiceCountry onSelect={handleCountrySelect}/>
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