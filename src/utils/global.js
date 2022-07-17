function getLabelByValue(arr,value,isMulti=false) {
  if(!arr||!value&&value!==0)return''
  console.log("value==="+value)
  if(!isMulti){
    let obj=arr.find(item=>item['value']==value)
    return obj['label']
  }else {
    value = value.split(',');
    value = value.map(valueItem => {
      let item = arr.find(item => item && `${item.value}` === `${valueItem}`);

      return item ? item.label : valueItem
    });
    return value.join(",")
  }

}



// 空数据
export function isEmpty(value) {

  if (Array.isArray(value)) {
    return value.length === 0;

  } else if (typeof value === 'string') {
    return value.trim() === '';

  } else {
    return !value && value !== 0;
  }
}
export default {
  install:function (Vue) {
    Vue.prototype.getLabelByValue=(arr,value,isMulti)=>getLabelByValue(arr,value,isMulti);
    Vue.prototype.translator=(arr,value,isMulti)=>getLabelByValue(arr,value,isMulti);
  }
}
