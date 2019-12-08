import React from "react";
import { Card } from 'antd';
import { BaseForm } from '../../src/index';
import { dataSource, formItem, uiConfig, formData } from './define';

export default class BaseFormDemo extends React.Component {
  render() {
    return (
      <div style={{ minHeight: '100vh', display: 'flex' }}>
        <Card title="表单渲染" style={{ width: 1000, margin: '100px auto'}} size={'small'} hoverable>
          <BaseForm
            dataSource={dataSource}
            formItem={formItem}
            uiConfig={uiConfig}
            formData={formData}
            onSubmit={values => console.log(values)}
          />
        </Card>
      </div>
    );
  }
}
