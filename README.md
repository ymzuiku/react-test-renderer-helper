## 为什么给 react-test-renderer 编写扩展，而不是直接使用 `enzyme`

- react-test-renderer 对 React 新功能如 hooks 有着很好的支持
- react-test-renderer 对 styled-component 等对象有着很好的样式内容的识别
- TDD 的目的是辅助监督我们的代码实现，对于 UI 组件来说我们只需要有 DOM 快照、DOM 事件修改状态、组件状态校验即可，react-test-renderer 已经满足了以上需求，缺点只是不方便检索对象，所以编写一个 helper 扩展即可
- enzyme 虽然有着非常好的查询功能，但是绝大部分情况下，我们仅仅使用 ID 或查询即可
- enzyme 依赖者不同版本的 Adapter, 如 'enzyme-adapter-react-16' , 而这些库无法很及时的更新新版的 React，如此时对 react-hooks 还没有很好的支持，而且 Airbnb 放弃对 ReactNative 的使用让人怀疑未来 enzyme 的更新进展

## react-component 例子

App.js

```js
import React from 'react';
import tester from 'react-test-renderer-helper/tester';

class App extends React.Component {
  state = {
    num: 0,
  };
  handleAddNum = () => {
    this.setState(({ num }) => {
      return { num: num + 1 };
    });
  };
  render() {
    return (
      <div>
        <h2 id="showNextNum">{this.state.num}</h2>
        <p id="info" onClick={this.handleAddNum}>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
```

App.test.js

```js
import 'jest-styled-components'; // 如果使用了 styled-components
import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { find, toSnapshot, getStatus } from 'react-test-renderer-helper';
import App from './App';

test('App 启动不崩溃', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('App 初始化渲染快照', () => {
  const comp = renderer.create(<App bb={20} />);
  expect(toSnapshot(comp)).toMatchSnapshot('render');
});

test('App 点击10次p标签, 修改状态的快照', () => {
  const comp = renderer.create(<App bb={20} />);
  for (let i = 0; i < 10; i++) {
    find(comp, '#info').props.onClick();
  }
  expect(toSnapshot(comp)).toMatchSnapshot('render at 10 onClick');
  expect(comp.getInstance().state.num).toEqual(10);
});
```

## react-hooks 例子

### 为什么当使用 react-hooks 时需要引入一个全局状态，单元测试不应该是独立、原子性的么？

由于 react-test-renderer 无法对函数组件进行 getInstance() 实例化, 所以无法拿到函数组件的 state ，这在以前是无关紧要的，因为函数组件本身就是无状态的。

但是在 react-hooks 的引入，函数组件其实是拥有状态的，react-test-renderer 暂时无法获取其中间的状态，所以只能使用一个相对污染的方式，把测试所需的状态储存在全局，并且在每次测试开始前清空状态。

未来如果 react-test-renderer 可以获取到 hooks 的中间状态，就可以放弃使用 setStatus 函数

App.js

```js
import React from 'react';
import tester from 'react-test-renderer-helper/tester';

function App() {
  const [num, setNum] = React.useState(0);
  function handleAddNum() {
    setNum(num + 1);
  }
  function render() {
    // tester 内的函数只有在测试环境才会执行
    // 为了让函数式组件能在测试过程中取到相应的状态以做检测, 我们把当前对象的状态绑定在全局环境中
    tester.setStatus('App', { prevStatus, num });
    return (
      <div>
        <h2 id="showNextNum">{num}</h2>
        <p id="info" onClick={handleAddNum}>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
  return React.useMemo(render, [num]);
}

export default App;
```

App.test.js

```js
import 'jest-styled-components'; // 如果使用了 styled-components
import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { find, toSnapshot, getStatus, clearStatus } from 'react-test-renderer-helper';
import App from './App';

beforeEach(() => {
  // 在每次测试之前，清空全局状态，防止每个测试之间的状态污染
  // * 表示清空所有，也可以使用 key，如 clearStatus('App')
  clearStatus('*');
});

test('App 启动不崩溃', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('App 初始化渲染快照', () => {
  const comp = renderer.create(<App bb={20} />);
  expect(toSnapshot(comp)).toMatchSnapshot('render');
});

test('App 点击10次p标签, 修改状态的快照', () => {
  const comp = renderer.create(<App bb={20} />);
  for (let i = 0; i < 10; i++) {
    find(comp, '#info').props.onClick();
  }
  expect(toSnapshot(comp), 'App').toMatchSnapshot('render at 10 onClick');
  expect(getStatus('App').num).toEqual(10);
});
```

## 查找器的使用

```js
find(comp, 'button'); //查找 第一个 button 对象
find(comp, 'input', 1); //查找 input 对象, 跳过 1 个匹配的对象
find(comp, '#dog'); //查找 id = ”dog“ 的对象
find(comp, '.dog', 2); //查找 className = ”dog“ 的对象, 跳过 2 个匹配的对象
find(comp, '@dog'); //查找 name = ”dog“ 的对象
find(comp, 'id=dog'); //查找 id = ”dog“ 的对象
find(comp, 'alt=dog'); //查找 alt = ”dog“ 的对象
```

## toSnapshot

toSnapshot 是把 react 组件的较为重要的状态合并成一个对象，以方便 jest 进行快照
默认开启保存全局 status , 所以记得需要在每次测试时清空全局 clearStatus('\*')

```js
export function toSnapshot(component, id) {
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
```

## Test

以上业务均已通过测试，项目和 Demo 的测试覆盖率 100%

```
----------------|----------|----------|----------|----------|-------------------|
File            |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------------|----------|----------|----------|----------|-------------------|
All files       |      100 |      100 |      100 |      100 |                   |
 src            |      100 |      100 |      100 |      100 |                   |
  App.js        |      100 |      100 |      100 |      100 |                   |
  Hooks.js      |      100 |      100 |      100 |      100 |                   |
 src/lib        |      100 |      100 |      100 |      100 |                   |
  index.lib.js  |      100 |      100 |      100 |      100 |                   |
  tester.lib.js |      100 |      100 |      100 |      100 |                   |
----------------|----------|----------|----------|----------|-------------------|
```

## Licenes

```
MIT License

Copyright (c) 2013-present, Facebook, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
