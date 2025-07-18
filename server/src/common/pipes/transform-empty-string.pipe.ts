// pipes/transform-empty-string.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { isPlainObject } from 'lodash'; // 用于判断是否是对象

@Injectable()
export class TransformEmptyStringPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (isPlainObject(value)) {
      // 如果是对象，递归处理每个字段
      Object.keys(value).forEach((key) => {
        if (value[key] === '') {
          value[key] = null; // 空字符串转 null
        } else if (isPlainObject(value[key])) {
          // 如果是对象，递归处理
          value[key] = this.transform(value[key], metadata);
        }
      });
    } else if (value === '') {
      // 如果是单个参数且为空字符串，转为 null
      return null;
    }

    return value;
  }
}
