import 'jest-styled-components';
import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { toSnapshotByHooks, getStatus, clearStatus, find } from '../lib/index.lib';
import Hooks from '../Hooks';

beforeEach(() => {
  clearStatus('*');
});

test('App 启动不崩溃', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Hooks />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('App 初始化渲染快照', () => {
  const comp = renderer.create(<Hooks bb={20} />);
  expect(toSnapshotByHooks(comp)).toMatchSnapshot('render');
});

test('App click 10次', () => {
  const comp = renderer.create(<Hooks bb={20} />);
  for (let i = 0; i <  10 ; i++) {
    find(comp, '#test-click').props.onClick();
  }

  expect(toSnapshotByHooks(comp)).toMatchSnapshot();
  expect(getStatus().num).toEqual(10);
});
