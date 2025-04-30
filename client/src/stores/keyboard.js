import { reactive } from 'vue';
import { STATE_TYPE } from '@/types.js';

export const keyboard = reactive(
  Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, (_, index) => ({
      letter: '',
      state: STATE_TYPE.EMPTY,
      position: index,
    })),
  ),
);
