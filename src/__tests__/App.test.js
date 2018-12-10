import 'jest-styled-components';
import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { toSnapshot, find } from '../lib/index.lib';
import App from '../App';

test('App 启动不崩溃', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('App 初始化渲染快照', () => {
  const comp = renderer.create(<App bb={20} />);
  expect(toSnapshot(comp)).toMatchSnapshot('render');
});

test('App click 10次', () => {
  const comp = renderer.create(<App bb={20} />);
  for (let i = 0; i <  10 ; i++) {
    find(comp, '#test-click').props.onClick();
  }
  expect(toSnapshot(comp)).toMatchSnapshot();
  expect(comp.getInstance().state.num).toEqual(10);
});
