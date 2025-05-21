import {expect} from "vitest";

export {test, beforeEach, describe} from "vitest";

export function assertTrue(actual: any, errorMessage?: string): void {
  expect(actual).to.deep.equal(true, errorMessage);
}

export function assertFalse(actual: any, errorMessage?: string): void {
  expect(actual).to.deep.equal(false, errorMessage);
}

export function assertEquals(expected: any, actual: any, errorMessage?: string): void {
  expect(actual).to.deep.equal(expected, errorMessage);
}

export function assertNotEquals(expected: any, actual: any): void {
  expect(actual).to.not.deep.equal(expected);
}

export function assertContains(expected: any, actual: any): void {
  expect(actual).to.contain(expected);
}

export function assertNotContains(expected: any, actual: any): void {
  expect(actual).to.not.contain(expected);
}

export function assertThrows(block: Runnable, expectedMessage: string): void {
  expect(block).to.throw(expectedMessage);
}

type Runnable = () => void;
