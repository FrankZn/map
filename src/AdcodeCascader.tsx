import React from 'react';
import { useState } from 'react';
import { Cascader } from 'antd';
import adcodes from './Adcode';
import { add_adcode, shuffle } from './Adcode'

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

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

const getOptions = () => {
  let ad_options: Option[] = [
    {
      value: '100000',
      label: 'All'
    }
  ]
  traverse('100000', ad_options[0])
  return ad_options
}

const ad_options = getOptions()

const App: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[][]>([['100000']]);

  const onChange = (value: string[][]) => {
    setSelected(value)
  };

  const onClick = () => {
    let ret: string[] = []
    for (let adcode_array of selected) {
      let adcode = adcode_array[adcode_array.length - 1]
       ret = ret.concat(add_adcode(adcode))
    }

    ret = shuffle(ret).slice(0, 10);
    setResults(ret)
  }

  return (
    <Cascader
      style={{ width: '100%' }}
      options={ad_options}
      // @ts-ignore
      onChange={onChange}
      value={selected}
      multiple
      maxTagCount="responsive"
    />)
};