import React from 'react';
import { useState } from 'react';
import { Layout, Cascader, Button, Space, Divider, List } from 'antd';
import data from './adcode.json';
const { Header, Footer, Sider, Content } = Layout;

interface Adcode {
  parent: string | null;
  children: string[];
  name: string;
}

interface Adcodes {
  [key: string]: Adcode;
}

let adcodes: Adcodes = data

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

let ad_options: Option[] = [
  {
    value: '100000',
    label: 'All'
  }
]

function traverse(code: string, current: Option) {
  if (adcodes[code].children.length > 0) {
    current.children = []
    for (let i = 0; i < adcodes[code].children.length; i++) {
      let child: Option = {
        label: adcodes[adcodes[code].children[i]].name,
        value: adcodes[code].children[i],
      }
      current.children.push(child)
      traverse(adcodes[code].children[i], child)
    }
  }
}

traverse('100000', ad_options[0])

function shuffle(a: any[]) {
  let ret = a.slice()
  for (let i = ret.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ret[i], ret[j]] = [ret[j], ret[i]];
  }
  return ret;
}

// Main logic
function random_select(a: string[][]) {
  let ret: string[] = []

  const get_name = (adcode: string) => {
    let name = `${adcodes[adcode].name} (${adcode})`
    let parent = adcodes[adcode].parent
    while (parent != null && parent != '100000') {
      name = adcodes[parent].name + " - " + name
      parent = adcodes[parent].parent
    }
    return name
  }
  const add_adcode = (adcode: string) => {
    if (adcode == '100000') {
      for (let sub_adcode of adcodes[adcode].children) {
        add_adcode(sub_adcode)
      }
    }
    // 北京 天津 上海 重庆
    else if (['110000', '120000', '310000', '500000'].includes(adcode)) {
      ret.push(get_name(adcode))
    }
    // 港澳台
    else if (['710000', '810000', '820000', '830000'].includes(adcode)) {
      ret.push(get_name(adcode))
    }
    // 省
    else if (adcode.slice(2, 6) == '0000') {
      for (let sub_adcode of adcodes[adcode].children) {
        add_adcode(sub_adcode)
      }
    }
    else {
      ret.push(get_name(adcode))
    }
  }

  for (let adcode_array of a) {
    let adcode = adcode_array[adcode_array.length - 1]
    add_adcode(adcode)
  }

  return shuffle(ret).slice(0, 10);
}

const App: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[][]>([]);

  const onChange = (value: string[][]) => {
    setSelected(value)
  };

  const onClick = () => {
    let ret = random_select(selected)
    setResults(ret)
  }

  return (
    <Layout style={{ width: '100%' }}>
      <Content>
        <Cascader
          style={{ width: '100%' }}
          options={ad_options}
          // @ts-ignore
          onChange={onChange}
          multiple
          maxTagCount="responsive"
        />
        <Space>
          <Button onClick={onClick}>生成</Button>
        </Space>
        <Divider orientation="left">结果</Divider>
        <List
          size="small"
          bordered
          dataSource={results}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Content>
    </Layout>)
};

export default App;
