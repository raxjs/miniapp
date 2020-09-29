import { createElement, useState } from 'rax';
import View from 'rax-view';
import TextInput from 'rax-textinput';

import './index.css';

export default function Home() {
  const [ valOne, setValOne ] = useState('');
  const [ valTwo, setValTwo ] = useState('');
  const [ valThree, setValThreee ] = useState('');
  const [ valFour, setValFour ] = useState('');

  const [ count, setCount ] = useState(0);

  const onInputOne = (e) => {
    setValOne(e.value);
  }

  const onInputTwo = (e) => {
    setValTwo(e.value);
  }

  const onInputThree = (e) => {
    setValThreee(e.detail.value);
  }

  const onInputFour = (e) => {
    setValFour(e.detail.value);
  }

  return (
    <View className="home">
      <View onClick={() => {setCount(Math.random())}}>{count}</View>
      <TextInput placeholder="rax-textinput 自动聚焦" value={valOne} autoFocus={true} onInput={onInputOne} />
      <TextInput placeholder="rax-textinput 非自动聚焦" value={valTwo} autoFocus={false} onInput={onInputTwo} />

      {/* <input placeholder="内置 input 自动聚焦" value={valThree} focus={true} onInput={onInputThree} />
      <input placeholder="内置 input 非自动聚焦" value={valFour} focus={false} onInput={onInputFour} /> */}

    </View>
  );
}
