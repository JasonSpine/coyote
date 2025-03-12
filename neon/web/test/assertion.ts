import {expect} from "vitest";

export {test} from "vitest";

export function assertTrue(condition: any): void {
  expect(condition).toStrictEqual(true);
}

export function assertFalse(condition: any): void {
  expect(condition).toStrictEqual(false);
}

export function assertEquals(expected: any, actual: any): void {
  expect(actual).toStrictEqual(expected);
}
