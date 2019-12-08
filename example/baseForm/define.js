import React from 'react';
import { Avatar } from 'antd';

export const dataSource = {
  marital_status: [{value:1,label:'未婚'}, {value:2,label:'已婚'}],
  children_status: [{value:1,label:'是'}, {value:2,label:'否'}],
  group_list: {
    level: [{value:1,label:'P1'},{value:2,label:'P2'},{value:3,label:'P3'}]
  }
}

export const formData = {
  name: '窝窝头',
  age: 12,
  group_list: [
    {level: 1, companyName:'ddddddd', position: 'ddddddddddd'}
  ]
}

export const formItem = [
  {
    dataType: 'input',
    dataKey: 'name',
    label: '姓名(自定义校验)',
    defaultValue: '',
    placeholder: '',
    rules: 'required',
    showRule: '',
    validator:(rule, value, callback, params) => {
      if (!value || value[0] != '张') callback('必须姓张')
      callback();
    }
  },
  {
    dataType: 'custom',
    label: '自定义元素',
    element: (<Avatar icon="user" />)
  },
  {
    dataType: 'input',
    dataKey: 'age',
    label: '年龄',
    defaultValue: '',
    rules: 'required|number|max:1000|min:0',
    showRule: ''
  },
  {
    dataType: 'textarea',
    dataKey: 'addr',
    label: '家庭住址',
    defaultValue: '一块钱四个',
    rules: 'required|len:0,100',
    showRule: ''
  },
  {
    dataType: 'radio',
    dataKey: 'marital_status',
    label: '婚姻状况',
    defaultValue: '1',
    rules: 'required',
    showRule: ''
  },
  {
    dataType: 'input',
    dataKey: 'spouse_name',
    label: '配偶姓名',
    rules: 'required',
    showRule: 'marital_status eq 2'
  },
  {
    dataType: 'radio',
    dataKey: 'children_status',
    label: '是否有子女',
    defaultValue: '1',
    rules: 'required',
    showRule: 'marital_status eq 2'
  },
  {
    dataType: 'input',
    dataKey: 'children_name',
    label: '子女姓名',
    rules: 'required',
    showRule: 'children_status eq 1|marital_status eq 2'
  },
  {
    dataType: 'group',
    dataKey: 'group_list',
    label: '工作经验',
    // cardTitle: '啦啦啦',
    formItem: [
      {
        dataType: 'input',
        dataKey: 'companyName',
        label: '公司名称',
        rules: 'required',
      },
      {
        dataType: 'input',
        dataKey: 'position',
        label: '职位',
        rules: 'required',
      },
      {
        dataType: 'select',
        dataKey: 'level',
        label: '等级'
      }
    ]
  },
  {
    dataType: 'group',
    dataKey: 'colleagues',
    label: '同事',
    showDeleteButton: false,
    formItem: [
      {
        dataType: 'input',
        labelName: '同事',
        dataKey: 'colleagues',
        rules: 'required',
      }
    ]
  },
  {
    dataType: 'buttons',
    list: [
      {
        dataType: 'confirmBtn',
        name: '提交',
        icon: "check",
      },
      {
        dataType: 'resetBtn',
        name: '重置',
        icon: "reload",
      }
    ]
  }
]
export const uiConfig = {
  formItemLayout: {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  },
  groupItemLayout: {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
  }
}
