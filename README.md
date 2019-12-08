# fe-boltzmann
基于ant design封装常用工具组件


## 可配置的表单组件 BaseForm
- ### 使用
```
import React from 'react';
import { BaseForm } from 'fe-boltzmann';

export default class BaseFormDemo extends React.Component {
    render () {
      return (
        <BaseForm
          formItem={[
            {
              dataType: 'input',
              dataKey: 'name',
              label: '姓名',
              defaultValue: '',
              placeholder: '',
              rules: 'required',
              showRule: ''
            },
            {
              dataType: 'input',
              dataKey: 'age',
              label: '年龄',
              defaultValue: '',
              rules: 'required|number|max:1000|min:0|len:1,2',
              showRule: 'name eq 张三'
            },
          ]}
        />
      )
    }
}
```

- ### API

 属性&方法  | 类型 | 描述
---- | ----- | ------
formItem | Array | 表单项
formData | Object | 表单填充数据
dataSource | Array | 表单源数据
uiConfig | Object | 表单布局
