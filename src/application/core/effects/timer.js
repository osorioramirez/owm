import { eventChannel } from 'redux-saga';

export default (interval: number) => (
  eventChannel((emit) => {
    const tick = () => emit('NEXT_TICK');
    // start a timer
    const timerId = setInterval(tick, interval);
    // return an unsubscribe function
    return () => {
      clearInterval(timerId);
    };
  })
);
