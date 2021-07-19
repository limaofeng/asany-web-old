import XLSX from 'xlsx';
import { message } from 'antd';

export const importExcel = (file: any, onCallBack: Function) => {
  // 获取上传的文件对象
  const { originFileObj } = file;
  // 通过FileReader对象读取文件
  const fileReader = new FileReader();

  fileReader.onload = (event: any) => {
    try {
      const { result } = event.target;
      // 以二进制流方式读取得到整份excel表格对象
      const workbook = XLSX.read(result, { type: 'binary' });
      let data = []; // 存储获取到的数据
      // 遍历每张工作表进行读取（这里默认只读取第一张表）
      for (const sheet in workbook.Sheets) {
        if (workbook.Sheets.hasOwnProperty(sheet)) {
          // 利用 sheet_to_json 方法将 excel 转成 json 数据
          data.push(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
          // break; // 如果只取第一张表，就取消注释这行
        }
      }
      onCallBack(data);
    } catch (e) {
      // 这里可以抛出文件类型错误不正确的相关提示
      message.error('文件类型不正确');
    }
  };
  // 以二进制方式打开文件
  fileReader.readAsBinaryString(originFileObj);
};

interface HeaderData {
  title: string;
  key: string;
  [propName: string]: any;
}

export const exportExcel = (header: HeaderData[], data: any[], fileName = '门户.xlsx') => {
  const _header = header
    .map((e, i) => ({ ...e, position: String.fromCharCode(65 + i) + 1 }))
    .reduce((prev, next) => ({ ...prev, ...{ [next.position]: { key: next.key, v: next.title } } }), {});

  const _data = data
    .map((e, i) => header.map((ee, j) => ({ content: e[ee.key], position: String.fromCharCode(65 + j) + (i + 2) })))
    // 对刚才的结果进行降维处理（二维数组变成一维数组）
    .reduce((prev, next) => prev.concat(next))
    // 转换成 worksheet 需要的结构
    .reduce((prev, next) => ({ ...prev, ...{ [next.position]: { v: next.content } } }), {});

  // 合并 headers 和 data
  const output = { ..._header, ..._data };

  // 获取所有单元格的位置
  const outputPos = Object.keys(output);

  // 计算出范围 ,["A1",..., "H2"]
  const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;

  // 构建 workbook 对象
  const wb = {
    SheetNames: ['Sheet1'],
    Sheets: {
      Sheet1: Object.assign({}, output, {
        '!ref': ref,
      }),
    },
  };

  // 导出 Excel
  XLSX.writeFile(wb, fileName);
};

export const formatExcelData = (header: HeaderData[], data: any[]) => {
  // 解析数据
  const res = [];

  for (let item of data) {
    let temp = {};
    // 遍历 key
    for (let key in item) {
      const defaultHeader = header.find((e) => e.title === key);
      if (!defaultHeader) {
        return false;
      }

      temp[defaultHeader.key] = item[key];
    }

    res.push(temp);
  }

  return res;
};
