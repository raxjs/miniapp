import { createElement } from 'rax';
import View from 'rax-view';

const CompiledComp1 = (props) => {
  const { name } = props;
  return (
    <View>我是 CompiledComp1 {name}</View>
  );
};

export default CompiledComp1;
