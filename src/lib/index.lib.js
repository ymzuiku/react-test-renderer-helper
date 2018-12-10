import renderer from 'react-test-renderer';
import tester from './tester.lib';
window.__testerIsTest = true;

let rendererType = renderer.create().toJSON();
rendererType = null;

export function fixId(ele, id = '') {
  if (ele && ele.props) {
    if (id.search(/\=/) > 0) {
      const kv = id.split('=');
      return ele.props[kv[0]] === kv[1];
    }
    if (id.search(/\#/) === 0) {
      const kv = id.split('#');
      return ele.props.id === kv[1];
    }
    if (id.search(/\@/) === 0) {
      const kv = id.split('@');
      return ele.props.name === kv[1];
    }
    if (id.search(/\./) === 0) {
      const kv = id.split('.');
      return ele.props.className === kv[1];
    }
    return ele.type === id;
  }
  return false;
}

export function find(component, id, num = 0) {
  let child;
  let jumpNum = -1;
  function _getChild(comp) {
    if (comp && comp.children) {
      for (let i = 0; i < comp.children.length; i++) {
        if (child) {
          break;
        }
        const ele = comp.children[i];
        if (fixId(ele, id)) {
          jumpNum += 1;
        }
        if (jumpNum === num) {
          child = ele;
        } else {
          _getChild(ele);
        }
      }
    }
  }
  // 如果传入的 component 没有 toJSON，帮它toJSON
  let rootComp;
  if (component && component.toJSON) {
    rootComp = component.toJSON();
  } else {
    rootComp = component;
  }
  // 首先匹配根节点
  if (fixId(rootComp, id)) {
    jumpNum += 1;
  }
  if (jumpNum === num) {
    return rendererType || rootComp;
  }
  // 如果根节点没有匹配，递归子节点
  _getChild(rootComp);
  return rendererType || child;
}

export function getStatus(key) {
  return tester.getStatus(key);
}

export function clearStatus(key) {
  tester.clearStatus(key);
}

export function toSnapshotByHooks(component, id) {
  if (id === false) {
    return {
      props: component.root.props,
      zip: component.toJSON(),
    };
  }
  return {
    status: getStatus(id),
    props: component.root.props,
    zip: component.toJSON(),
  };
}

export function toSnapshot(component, params) {
  const instance = component.getInstance();
  const returnEle = {
    status: getStatus(component),
    props: instance.props,
    state: instance.state,
    zip: component.toJSON(),
  };
  if (params && params.length > 0) {
    let other = {};
    for (let i = 0; i < params.length; i++) {
      other[params[i]] = instance[params[i]];
    }
    return {
      ...returnEle,
      other,
    };
  }
  return returnEle;
}
