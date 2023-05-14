import React from 'react';
import { useState } from 'react';
import { Layout, Button, Space, Divider, List } from 'antd';
import { TreeSelect } from 'antd';
import adcodes, { add_adcode, shuffle } from './Adcode';

const { Footer, Content } = Layout;

interface TreeData {
  title: string;
  value: string;
  key: string;
  children?: TreeData[];
}

const getTreeData = () => {
  let tree_data: TreeData[] = [
    {
      title: 'All',
      value: '100000',
      key: '100000'
    }
  ]

  function tree_data_traverse(code: string, current: TreeData) {
    if (adcodes[code].children.length > 0) {
      current.children = []
      for (let i = 0; i < adcodes[code].children.length; i++) {
        let child: TreeData = {
          title: adcodes[adcodes[code].children[i]].name,
          value: adcodes[code].children[i],
          key: adcodes[code].children[i]
        }
        current.children.push(child)
        tree_data_traverse(adcodes[code].children[i], child)
      }
    }
  }

  tree_data_traverse('100000', tree_data[0])
  return tree_data
}

const tree_data = getTreeData()

const App: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>(['100000']);

  const onChange = (value: string[]) => {
    setSelected(value)
  };

  const onClick = () => {
    let ret: string[] = []
    for (let adcode of selected) {
      let a = add_adcode(adcode)
      ret = ret.concat(a)
    }
    ret = shuffle(ret).slice(0, 10);
    setResults(ret)
  }

  return (
    <Layout style={{ width: '100%', minHeight: "100vh" }}>
      <Content>
        <TreeSelect
          style={{ width: '100%' }}
          treeData={tree_data}
          value={selected}
          onChange={onChange}
          treeCheckable={true}
          showCheckedStrategy={TreeSelect.SHOW_PARENT}
          maxTagCount="responsive"
        />
        <Divider orientation="left">结果</Divider>
        <List
          size="small"
          bordered
          dataSource={results}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Content>
      <Footer>
        <Space>
          <Button>No use</Button>
          <Button size="large" onClick={onClick}>生成</Button>
          <Button>No use</Button>
        </Space>
      </Footer>
    </Layout>)
};

export default App;
