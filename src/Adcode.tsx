import data from './adcode.json';

interface Adcode {
  parent: string | null;
  children: string[];
  name: string;
}

interface Adcodes {
  [key: string]: Adcode;
}

const adcodes: Adcodes = data

export default adcodes;

const get_name = (adcode: string) => {
  let name = `${adcodes[adcode].name} (${adcode})`
  let parent = adcodes[adcode].parent
  while (parent !== null && parent !== '100000') {
    name = adcodes[parent].name + " - " + name
    parent = adcodes[parent].parent
  }
  return name
}

export const add_adcode = (adcode: string) => {
  let ret: string[] = []
  if (adcode === '100000') {
    for (let sub_adcode of adcodes[adcode].children) {
      ret = ret.concat(add_adcode(sub_adcode))
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
  else if (adcode.slice(2, 6) === '0000') {
    for (let sub_adcode of adcodes[adcode].children) {
      ret = ret.concat(add_adcode(sub_adcode))
    }
  }
  else {
    ret.push(get_name(adcode))
  }
  return ret
}

export function shuffle(a: any[]) {
  let ret = a.slice()
  for (let i = ret.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ret[i], ret[j]] = [ret[j], ret[i]];
  }
  return ret;
}
