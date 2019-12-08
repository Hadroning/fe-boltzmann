/**
 * 试图转换一个值为数字 如果不为NaN则返回数字 否则返回原值
 */
const transformNum = n => {
  if (n === '') return n;
  return isNaN(n*1) ? n : n*1;
};
/**
 * 条件比较方法
 * @type {{eq: (function(*, *): boolean), gt: (function(*, *): boolean), lt: (function(*, *): boolean)}}
 */
const compareVal = {
  eq: (v1, v2) => v1 == v2,
  gt: (v1, v2) => (v1*1) > (v2*1),
  lt: (v1, v2) => (v1*1) < (v2*1),
  uneq: (v1, v2) => v1 != v2,
}

/**
 * 生成表单校验规则
 * @param label
 * @param labelName
 * @param rules
 * @param errMsg
 * @returns {Array}
 */
const getFormCheckRule = ({ label, labelName, rules, errMsg, validator }, that) => {
  if (!rules) return [];
  label = label || labelName;
  const ruleArr = rules.split('|');
  const checkRules = [];
  if (validator) {
    checkRules.push({
      validator: (r, v, c) => {
        validator(r, v, c, Object.assign(that.props.form.getFieldsValue(), that.getGroupParams()))
      }
    })
  }
  ruleArr.forEach(r => {
    if (r === 'required') checkRules.push({ required: true, message: errMsg || `请填写${label}` });
    if (r === 'email') checkRules.push({ pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/, message: errMsg || `${label}格式不正确` })
    if (r === 'mobile') checkRules.push({ pattern: /^1[3456789]\d{9}$/, message: errMsg || `${label}格式不正确` })
    if (r === 'id_card') checkRules.push({ pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, message: errMsg || `${label}格式不正确` })
    if (r === 'yuan') checkRules.push({ pattern: /^(([0-9]+)|([0-9]+\.[0-9]{1,2}))$/, message: errMsg || `${label}格式不正确` })
    if (r === 'number') checkRules.push({ validator: (_, v, cb) => isNaN(v * 1) ? cb(errMsg || `${label}必须为纯数字`) : cb() });

    // 特殊规则 len:1,5、max:10、min:3...
    if (r.indexOf(':') != -1) {
      let other = r.split(':');
      if (other[0] === 'len') {
        const lenVal = other[1].split(',');
        if (lenVal[0]) checkRules.push({ min: lenVal[0] * 1, message: `${label}不得小于${lenVal[0]}位` })
        if (lenVal[1]) checkRules.push({ max: lenVal[1] * 1, message: `${label}不得大于${lenVal[1]}位` })
      }
      if (other[0] === 'max') checkRules.push({ validator: (_, v, cb) => {
          if (typeof v != 'number' && !v) return cb();
          (v*1) > (other[1]*1) ? cb(errMsg || `${label}不得大于${other[1]}`) : cb()
        } });
      if (other[0] === 'min') checkRules.push({ validator: (_, v, cb) => {
          if (typeof v != 'number' && !v) return cb();
          (v*1) < (other[1]*1) ? cb(errMsg || `${label}不得小于${other[1]}`) : cb()
        } });
    }

  })
  return checkRules;
}

const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  })
}

export default {
  transformNum,
  compareVal,
  getFormCheckRule,
  uuid
}
