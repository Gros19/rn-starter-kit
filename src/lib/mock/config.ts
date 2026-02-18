/** Mock 모드 활성화 여부 (__DEV__에서 기본 활성) */
export let USE_MOCK = __DEV__;

export function setUseMock(value: boolean) {
  USE_MOCK = value;
}
