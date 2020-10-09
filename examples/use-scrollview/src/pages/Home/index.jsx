import { createElement, useState, useCallback, useRef } from 'rax';
import View from 'rax-view';
import ScrollView from 'rax-scrollview';

import './index.css';

export default function Home() {
  const scrollRef = useRef(null);
  const [arr, setArr] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
  const loadMore = useCallback(() => {
    console.log('触发下拉');
    setArr(arr.concat([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]));
  });
  const scroll = () => {
    scrollRef.current.scrollTo({
      y: 400
    });
  }
  return (
    <View>
      <View onClick={scroll}>点击滚动</View>
      <ScrollView ref={scrollRef} style={{height: 500}} className="home" onEndReached={loadMore}>
        <View style={{height: 300, backgroundColor: 'red'}} onClick={scroll}>scroll view 头部</View>
        {arr.map((e, i) => {
          return <View key={i} style={{height: 200}}>{i}</View>;
        })}
      </ScrollView>
    </View>
  );
}
