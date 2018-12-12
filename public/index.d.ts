import { ReactElement, ReactType } from 'react';

interface ReactTestRendererJSON {
  type: string;
  props: { [propName: string]: any };
  children: null | ReactTestRendererJSON[];
}
interface ReactTestRendererTree extends ReactTestRendererJSON {
  nodeType: 'component' | 'host';
  instance: any;
  rendered: null | ReactTestRendererTree;
}
interface ReactTestInstance {
  instance: any;
  type: ReactType;
  props: { [propName: string]: any };
  parent: null | ReactTestInstance;
  children: Array<ReactTestInstance | string>;

  find(predicate: (node: ReactTestInstance) => boolean): ReactTestInstance;
  findByType(type: ReactType): ReactTestInstance;
  findByProps(props: { [propName: string]: any }): ReactTestInstance;

  findAll(predicate: (node: ReactTestInstance) => boolean, options?: { deep: boolean }): ReactTestInstance[];
  findAllByType(type: ReactType, options?: { deep: boolean }): ReactTestInstance[];
  findAllByProps(props: { [propName: string]: any }, options?: { deep: boolean }): ReactTestInstance[];
}

interface ReactTestRenderer {
  toJSON(): null | ReactTestRendererJSON;
  toTree(): null | ReactTestRendererTree;
  unmount(nextElement?: ReactElement<any>): void;
  update(nextElement: ReactElement<any>): void;
  getInstance(): null | ReactTestInstance;
  root: ReactTestInstance;
}
interface ISnapshot {
  status: any;
  state: any;
  props: { [propName: string]: any };
  zip: Object;
}

export function find(component: ReactTestRenderer, id: string): ReactTestInstance;
export function getStatus(key: any): any;
export function clearStatus(key: any): void;
export function toSnapshotByHooks(component: ReactTestRenderer): ISnapshot;
export function toSnapshot(component: ReactTestRenderer, ...any): ISnapshot;
