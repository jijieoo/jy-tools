/**
 * 差异类型
 */
export type DiffType = "CHANGE" | "ADD" | "DELETE" | "UNCHANGED";

/**
 * 属性差异详情
 */
export interface DiffDetail<BeforeValueType, AfterValueType> {
  type?: DiffType;
  beforeValue: BeforeValueType;
  afterValue: AfterValueType;
}

/**
 * 差异比较结果
 */
export type DiffResult<T, U> = {
  [K in keyof T | keyof U]?: DiffDetail<
    K extends keyof T ? T[K] : undefined,
    K extends keyof U ? U[K] : undefined
  >;
};

/**
 * 判断两个值是否变化
 * @param beforeValue
 * @param afterValue
 * @returns
 */
function isValueChanged(beforeValue: any, afterValue: any): boolean {
  // 如果两个值都为 null 或 undefined，则视为未变化
  if (
    (beforeValue === null || beforeValue === undefined) &&
    (afterValue === null || afterValue === undefined)
  ) {
    return false;
  }

  // 其他情况使用严格相等比较
  return beforeValue !== afterValue;
}

/**
 * 对象属性差异比较
 * @param obj1
 * @param obj2
 * @returns
 */
export function diffObject<
  T extends Record<string, any>,
  U extends Record<string, any>,
>(obj1: T, obj2: U): DiffResult<T, U> {
  let result: DiffResult<any, any> = {};

  // 获取两个对象的所有键
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // 检查 obj1 中的属性在 obj2 中的变化情况
  for (const key of keys1) {
    if (obj2.hasOwnProperty(key)) {
      // 属性在两个对象中都存在
      if (isValueChanged(obj1[key], obj2[key])) {
        result[key] = {
          type: "CHANGE",
          beforeValue: obj1[key],
          afterValue: obj2[key],
        };
      } else {
        // 值未发生变化（包括 null 和 undefined 视为相同的情况）
        result[key] = {
          type: "UNCHANGED",
          beforeValue: obj1[key],
          afterValue: obj2[key],
        };
      }
    } else {
      // 属性在 obj2 中不存在，被删除了
      result[key] = {
        type: "DELETE",
        beforeValue: obj1[key],
        afterValue: undefined,
      };
    }
  }

  // 检查 obj2 中新增的属性
  for (const key of keys2) {
    if (!obj1.hasOwnProperty(key)) {
      // 属性在 obj1 中不存在，是新增的
      result[key] = {
        type: "ADD",
        beforeValue: undefined,
        afterValue: obj2[key],
      };
    }
  }

  return result;
}
