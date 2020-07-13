import { onUnmounted } from '@vue/composition-api';

/**
 *
 * @param fn function to call
 * @param interval
 */
export default function (fn: (delta: number) => void, interval: number) {
  console.log('int', interval)
  const id = setInterval(() => fn(1000 / interval), interval);
  onUnmounted(() => clearInterval(id));
  return (newInterval: number) => {
    // clearInterval(id);
    // id = setInterval(() => fn(interval), interval);
  }
}
