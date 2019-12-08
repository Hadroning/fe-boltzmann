import React from 'react';
import { Button, Form, Card, Row, Col } from 'antd';
import { createForm } from './index';
import Util from "./util";
import './index.less'

class GroupForm extends React.Component{
  constructor(prop) {
    super(prop);
    this.formItemLayout = this.props.uiConfig;
    this.createForm = createForm(this);

    const list = JSON.parse(JSON.stringify(this.props.list));

    this.defaultValList = list || [];
    this.state = {
      list: list.map((item, idx) => {
        item.itemKey = idx;
        item.$rowId = Util.uuid();
        return item
      })
    }
  }
  // 添加组数据
  addGroupItem () {
    const { list } = this.state;
    list.push({ itemKey: list.length, $rowId: Util.uuid() })
    this.setState({ list })
  }
  // 更新组数据
  updateGroupData (e, formConfig, groupIdx) {
    const { dataType } = formConfig;
    const { list } = this.state;
    let value;
    if (dataType === 'input') value = e.target.value;
    if (dataType === 'select') value = e;

    list[groupIdx][formConfig.dataKey] = Util.transformNum(value);
    this.state.list = list;
  }
  // 删除组数据
  circleGroup (idx) {
    const { list } = this.state;
    list.splice(idx, 1)
    this.setState({ list })
  }
  // 重置组表单数据
  resetGroupData () {
    this.setState({
      list: this.state.list.map((row) => {
        const { itemKey } = row;
        let currentDefault = this.defaultValList.find(_item => _item.itemKey === itemKey);
        return currentDefault || { itemKey };
      })
    }, () => this.props.form.resetFields())
  }
  render() {
    const { list } = this.state;
    const { config } = this.props;
    return (
      <div>
        {list.map((n, idx) => {
          const btn = <Button type="dashed" shape="circle" icon="minus" size="small" onClick={() => this.circleGroup(idx)}></Button>;
          const cardTitle = (
            <div className="card-title">
              <div>{config.cardTitle ? config.cardTitle : config.label} - {idx+1}</div>
              {btn}
            </div>
          )
          let formList = config.formItem.map((item) => {
            item.groupIdx = idx;
            item.groupKey = config.dataKey;
            // 注册表单 使用唯一key防止冲突
            item.itemKey = `${n.$rowId}${idx}`;
            const suffix = config.formItem.length == 1 ? btn : false;
            if (config.formItem.length === 1) delete item.label;
            return this.createForm.bind(this)({config: item, groupData: n, groupIdx: idx, suffix})
          });

          if (config.formItem.length === 1) {
            return (formList)
          }

          return (<Card size="small" title={cardTitle} key={idx} className="base-form-group-card">{formList}</Card>)
        })}
        <Button type="dashed" icon="plus" onClick={this.addGroupItem.bind(this)}>添加{config.label}</Button>
      </div>
    )
  }
}

export default Form.create()(GroupForm)
