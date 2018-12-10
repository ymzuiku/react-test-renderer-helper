import { find, getStatus, clearStatus, toSnapshotByHooks, toSnapshot, fixId } from '../lib/index.lib';
import tester from '../lib/tester.lib';
import React from 'react';
import renderer from 'react-test-renderer';

class App extends React.Component {
  data = {
    name: 'dipu',
    age: 100,
  };
  render() {
    return (
      <div>
        <div id="test-id">test-id</div>
        <div name="test-name">test-name</div>
        <div className="test-className">test-className</div>
        <img alt="test-alt" src="test-alt" />
        <input name="test-type0" />
        <input name="test-type1" />
        <input name="test-type2" />
      </div>
    );
  }
}

describe('find', () => {
  test('find key', () => {
    const comp = renderer.create(<App />);
    expect(find(comp, 'id=test-id')).toMatchSnapshot('find-id');
    expect(find(comp, 'name=test-name')).toMatchSnapshot('find-name');
    expect(find(comp, 'className=test-className')).toMatchSnapshot('find-className');
    expect(find(comp, 'alt=test-alt')).toMatchSnapshot('find-alt');

    expect(find(comp, 'input', 1)).toMatchSnapshot('find-type');
  });
  test('find root', () => {
    const comp = renderer.create(<App />);
    expect(find(comp, 'div')).toMatchSnapshot();
  });
  test('find id', () => {
    const comp = renderer.create(<App />);
    expect(find(comp, '#test-id')).toMatchSnapshot();
    expect(find(comp, '#test-id')).toEqual(find(comp, 'id=test-id'));
  });
  test('find name', () => {
    const comp = renderer.create(<App />);
    expect(find(comp, '@test-name')).toMatchSnapshot();
    expect(find(comp, '@test-name')).toEqual(find(comp, 'name=test-name'));
  });
  test('find className', () => {
    const comp = renderer.create(<App />);
    expect(find(comp, '.test-className')).toMatchSnapshot();
    expect(find(comp, '.test-className')).toEqual(find(comp, 'className=test-className'));
  });
});

describe('getStatus', () => {
  test('getStatus-set-default-key', () => {
    tester.setStatus({ dog: 'default', age: 10 });
    expect(getStatus()).toEqual({ dog: 'default', age: 10 });
  });
  test('getStatus-set-user-key', () => {
    tester.setStatus('user', { dog: 'user', age: 10 });
    expect(find());
    expect(getStatus('user')).toEqual({ dog: 'user', age: 10 });
  });
});

describe('clearStatus', () => {
  test('clearStatus-default-key', () => {
    tester.setStatus({ dog: 'default', age: 10 });
    clearStatus();
    expect(getStatus()).toEqual(undefined);
  });
  test('clearStatus-user-key', () => {
    tester.setStatus('user', { dog: 'default', age: 10 });
    clearStatus('user');
    expect(getStatus('user')).toEqual(undefined);
  });
  test('clearStatus-*-key', () => {
    tester.setStatus('user', { dog: 'default', age: 10 });
    tester.setStatus('other', { dog: 'default', age: 10 });
    clearStatus('*');
    expect(tester.status).toEqual({});
  });
});

describe('toSnapshot', () => {
  test('toSnapshot', () => {
    const comp = renderer.create(<App />);
    expect(toSnapshot(comp)).toMatchSnapshot('toSnapshot');
  });

  test('toSnapshot', () => {
    const comp = renderer.create(<App />);
    expect(toSnapshot(comp, ['data'])).toMatchSnapshot('toSnapshot');
  });
});

describe('toSnapshotByHooks', () => {
  test('toSnapshotByHooks', () => {
    const comp = renderer.create(<App />);
    expect(toSnapshotByHooks(comp)).toMatchSnapshot('toSnapshot');
  });
  test('toSnapshotByHooks no-status', () => {
    const comp = renderer.create(<App />);
    expect(toSnapshotByHooks(comp, false)).toMatchSnapshot('toSnapshot-no-status');
  });
});

describe('fixId', () => {
  test('fixId', () => {
    const comp = renderer.create(<App />);
    const input = find(comp, 'input', 2);
    expect(fixId(input, 'name=test-type2')).toEqual(true);
  });
});

describe('tester', () => {
  test('no-window.__testerIsTest', () => {
    window.__testerIsTest = false;
    expect(tester.setStatus({ test: 'noTest' })).toEqual(undefined);
  });
});
