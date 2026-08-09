import { snakeCase } from 'lodash-es';

export function toUpperSnakeCase(value: string) {
  return snakeCase(value).toUpperCase();
}
