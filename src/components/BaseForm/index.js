import React from 'react';
import Util from './util';
import GroupForm from './group';
import { Form, Input, Select, Radio, Button, Row, Col } from 'antd';
import './index.less';

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 12 },
};

export function createForm (that) {
  const register = that.props.form.getFieldDecorator;

  return function ({config, groupData, groupIdx, suffix}) {
    const { dataType, dataKey, list, defaultValue } = config;

    const checkRules = Util.getFormCheckRule(config, that);
    const defaultFormData = this.state.formData;
    const { dataSource = {}, formItem } = that.props;
    const formData = groupData || defaultFormData || {};
    const formEvent = {};
    const renderFormItem = ({ config, el }) => {
      let layoutConfig = that.formItemLayout || {};
      if (suffix) layoutConfig = Object.assign(JSON.parse(JSON.stringify(layoutConfig)), {wrapperCol: {span:24}});

      return (
        <Form.Item
          label={config.label}
          key={config.dataKey || Util.uuid()}
          {...layoutConfig}
        >
          <Row>
            <Col span={suffix ? 22 : 24}>{el}</Col>
            <Col span={suffix ? 2 : 0} className="group-separate-item-row">
              <div className="suffix">
                {suffix}
              </div>
              <span className="symbol">_</span>
            </Col>
          </Row>
        </Form.Item>
      )
    }

    let groupDataKey;

    if (groupData) {
      groupDataKey = `${dataKey}_${config.itemKey}`;
      formEvent.onChange = e => {
        that.updateGroupData(e, config, groupIdx);
      }
    }

    const formFnMap = {
      input: renderInput,
      select: renderSelect,
      select_multi: renderSelect,
      radio: renderRadio,
      textarea: renderInput,

      buttons: renderBtn,
      group: renderGroup,
      custom: renderCustom
    };

    function renderInput () {
      let initialValue = formData[dataKey] || defaultValue || '';
      const el = dataType === 'input' ? <Input {...formEvent}/> : <Input.TextArea {...formEvent} aotusize={{ minRows: 2, maxRows: 6 }}/>;
      return renderFormItem({
        config,
        el: register(groupDataKey || dataKey, {
          initialValue,
          rules: checkRules
        })(el)
      })
    }
    function renderSelect () {
      const list = dataSource[dataKey] || [];
      const selectAttr = {};
      let initialValue = Util.transformNum(formData[dataKey] || defaultValue);
      if (dataType === 'select_multi') {
        selectAttr['mode'] = 'multiple';
        if (initialValue !== '') {
          initialValue = initialValue instanceof Array ? initialValue : [initialValue]
        } else {
          initialValue = [];
        }
      }
      const el = (
        <Select {...selectAttr} {...formEvent}>
          {list.map(item => <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)}
        </Select>
      )
      return renderFormItem({
        config,
        el: register(groupDataKey || dataKey, {
          initialValue,
          rules: checkRules
        })(el)
      })
    }
    function renderRadio () {
      const list = dataSource[dataKey] || [];
      let initialValue = formData[dataKey] || defaultValue || '';

      const el = (
        <Radio.Group {...formEvent}>
          {list.map(item => <Radio.Button key={item.value} value={item.value}>{item.label}</Radio.Button>)}
        </Radio.Group>
      )

      return renderFormItem({
        config,
        el: register(groupDataKey || dataKey, {
          initialValue: Util.transformNum(initialValue),
          rules: checkRules
        })(el)
      })
    }
    function renderBtn () {
      const btnArr = list.map((item, idx) => {
        const type = { confirmBtn: 'primary', resetBtn: '' }[item.dataType] || item.btnType || '';
        let btnAttr = {
          type,
          style:{marginRight: 10}
        }
        if (item.event) btnAttr = Object.assign(btnAttr, item.event);
        if (item.icon) btnAttr['icon'] = item.icon;
        if (item.dataType === 'confirmBtn') btnAttr['htmlType'] = 'submit';
        if (item.dataType === 'resetBtn') btnAttr['onClick'] = () => {
          that.setState({formItem: []}, () => {
            that.setState({formItem}, () => {
              that.props.form.resetFields();
              // 重置组表单数据
              Object.keys(that.refList).forEach(item => {
                that.refList[item].props.form.resetFields()
              })
            })
          });
        }
        return <Button {...btnAttr} key={idx} >{item.name}</Button>
      })
      return <Form.Item key={'btnGroup'} wrapperCol={{ offset: that.formItemLayout.labelCol.span }}>{btnArr}</Form.Item>
    }
    function renderGroup () {
      const list = formData[dataKey] || [];
      const groupDataSource = dataSource[dataKey];
      return renderFormItem({
        config,
        el: (
            <div key={dataKey}>
              {register(dataKey)(<span></span>)}
              <GroupForm
                wrappedComponentRef={e => that.refList[dataKey] = e}
                config={config}
                list={list}
                dataSource={groupDataSource}
                uiConfig={that.props.uiConfig.groupItemLayout || formItemLayout}
              />
            </div>
        )
      })
    }
    function renderCustom() {
      return renderFormItem({
        config,
        el: config.element || ''
      })
    }
    return formFnMap[dataType] ? formFnMap[dataType]() : false
  }
}

class BaseForm extends React.Component {
  constructor(prop) {
    super(prop);
    this.refList = {};
    this.state = {
      // 更新表单
      updateKey: new Date().getTime(),
      formItem: this.props.formItem,
      formData: this.props.formData,
    }
    // 布局
    const { uiConfig = {} } = this.props;
    this.formItemLayout = uiConfig.formItemLayout || formItemLayout;
    // 表单渲染对应方法
    this.createForm = createForm(this);
  }
  renderForm () {
    const { formItem = [] } = this.state;
    return formItem.map(itemConfig => {
      const isShow = this.getFormShowRule(itemConfig);
      if (!isShow || !this.createForm({config:itemConfig})) return;
      return this.createForm({config:itemConfig})
    })
  }
  // 表单显示规则
  getFormShowRule ({ showRule }) {
    if (!showRule) return true;
    const ruleArr = showRule.split('|');
    let isShow = true;
    ruleArr.forEach(item => {
      if (!isShow) return;
      const ruleItem = item.split(' ');
      const key = ruleItem[0];
      const where = ruleItem[1];
      const target = ruleItem[2];
      const v = this.props.form.getFieldsValue([key])[key];

      isShow = Util.compareVal[where](v, target);
    })

    return isShow;
  }
  // 获取组参数
  getGroupParams () {
    let groupRefKeys = Object.keys(this.refList);
    let groupList = {};
    groupRefKeys.forEach(item => {
      const data = this.refList[item].state.list;
      groupList[item] = data.map(item => {
        const _item = JSON.parse(JSON.stringify(item))
        delete _item.itemKey;
        delete _item.$rowId;
        return _item;
      });
      // 单个表单情况
      if (groupList[item].length && Object.keys(groupList[item][0]).length === 1) {
        groupList[item] = groupList[item].map(v => {
          let key = Object.keys(v)[0];
          return v[key];
        })
      }
    })
    return groupList;
  }
  // 触发提交 建议父级直接获取此方法取值
  submit (e) {
    return new Promise((resolve, reject) => {
      const isFn = typeof e === 'function';
      if (!isFn) e.preventDefault();

      this.props.form.validateFields((err, values) => {
        // 校验组表单
        let groupErr = [];
        let groupRefKeys = Object.keys(this.refList);
        groupRefKeys.forEach(key => {
          this.refList[key].props.form.validateFields(_err => {
            if (_err) groupErr.push(_err);
          })
        });

        if (err) return reject(err);
        if (groupErr.length) return reject(groupErr[0]);
        if (!err) {
          // 过滤非法参数、格式化参数
          Object.keys(values).forEach(k => {
            const { rules } = this.state.formItem.find(item => item.dataKey === k);
            if (values[k] === void 0 || values[k] === null) return delete values[k];

            if (rules.indexOf('yuan') != -1) values[k] = values[k] * 100;
            values[k] = Util.transformNum(values[k]);
          });

          // 获取组参数
          const groupList = this.getGroupParams();

          values = Object.assign(values, groupList);

          if (isFn) e(values);
          if (this.props.onSubmit) this.props.onSubmit(values);

          resolve(values)
        }
      });
    })
  }
  render() {
    const { updateKey } = this.state;
    return(
      <div>
        <Form key={updateKey} {...this.formItemLayout} onSubmit={this.submit.bind(this)}>
          {this.renderForm()}
        </Form>
      </div>
    )
  }
}

export default Form.create()(BaseForm)
