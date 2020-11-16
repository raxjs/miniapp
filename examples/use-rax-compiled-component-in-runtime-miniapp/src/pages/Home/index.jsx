import { createElement, useState } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Modal from 'rax-modal';
import CompiledComp1 from '../../miniapp-compiled/CompiledComp1';
import CompiledComp2 from '../../miniapp-compiled/CompiledComp2';

import './index.css';

const Home = () => {
  const [visible, setVisible] = useState(false);
  return (
    <View>
      <View onClick={() => { setVisible(true); }}>
        open1
      </View>
      <CompiledComp1 name="chris" />
      <CompiledComp2 name="paul" />
      <Modal
        visible={visible}
        onHide={() => {
          setVisible(false);
        }}
      >
        <Text className="info">Hello, world</Text>
      </Modal>
    </View>
  );
};

export default Home;
