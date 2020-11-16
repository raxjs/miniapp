import { createElement } from 'rax';
import View from 'rax-view';
import styles from './index.module.less';

const CompiledComp2 = (props) => {
  const { name } = props;
  return (
    <View className={styles.compiledComp2}>我是 CompiledComp2 {name}</View>
  );
};

export default CompiledComp2;
