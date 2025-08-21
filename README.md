# 工具函数

从业务和需求中抽象出来的一些函数

## diffObject

对象差异比较函数，用于比较两个对象之间的属性变化。

### 函数签名

```typescript
function diffObject<
  T extends Record<string, any>,
  U extends Record<string, any>,
>(obj1: T, obj2: U): DiffResult<T, U>;
```

### 参数说明

| 参数名 | 类型                            | 描述                     |
| ------ | ------------------------------- | ------------------------ |
| `obj1` | `T extends Record<string, any>` | 比较的原始对象（变更前） |
| `obj2` | `U extends Record<string, any>` | 比较的目标对象（变更后） |

### 返回值类型

```typescript
DiffResult<T, U> = {
  [K in keyof T | keyof U]?: DiffDetail<
    K extends keyof T ? T[K] : undefined,
    K extends keyof U ? U[K] : undefined
  >;
}
```

返回一个包含所有属性差异的对象，每个属性的值是一个 `DiffDetail` 对象，包含差异类型和前后值。

### 基本用例

#### 1. 属性值变更

```typescript
const before = { name: "Alice", age: 25 };
const after = { name: "Alice", age: 26 };

const result = diffObject(before, after);
console.log(result);
// 输出:
// {
//   age: {
//     type: "CHANGE",
//     beforeValue: 25,
//     afterValue: 26
//   }
// }
```

#### 2. 新增属性

```typescript
const before = { name: "Bob" };
const after = { name: "Bob", email: "bob@example.com" };

const result = diffObject(before, after);
console.log(result);
// 输出:
// {
//   email: {
//     type: "ADD",
//     beforeValue: undefined,
//     afterValue: "bob@example.com"
//   }
// }
```

#### 3. 删除属性

```typescript
const before = { name: "Charlie", age: 30 };
const after = { name: "Charlie" };

const result = diffObject(before, after);
console.log(result);
// 输出:
// {
//   age: {
//     type: "DELETE",
//     beforeValue: 30,
//     afterValue: undefined
//   }
// }
```

#### 4. 多种变更类型组合

```typescript
const before = { name: "David", age: 20, city: "Beijing" };
const after = { name: "Daniel", age: 20, email: "daniel@example.com" };

const result = diffObject(before, after);
console.log(result);
// 输出:
// {
//   name: {
//     type: "CHANGE",
//     beforeValue: "David",
//     afterValue: "Daniel"
//   },
//   city: {
//     type: "DELETE",
//     beforeValue: "Beijing",
//     afterValue: undefined
//   },
//   email: {
//     type: "ADD",
//     beforeValue: undefined,
//     afterValue: "daniel@example.com"
//   }
// }
```
