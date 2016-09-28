// let intervalTime = 100;
// let interval = null;
// const runnables = new Set();
//
// function startInterval() {
//   if (interval || runnables.size === 0) {
//     return;
//   }
//
//   interval = setInterval(() => {
//     runnables.forEach(runnable => runnable.run());
//   }, intervalTime);
// }
//
// function stopInterval() {
//   if (!interval || runnables.size > 0) {
//     return;
//   }
//
//   clearInterval(interval);
//   interval = null;
// }
//
// export default {
//   start(runnable) {
//     runnables.add(runnable);
//
//     startInterval();
//   },
//
//   stop(runnable) {
//     runnables.delete(runnable);
//
//     stopInterval();
//   },
//
//   set interval(newIntervalTime: number) {
//     if (newIntervalTime === intervalTime) {
//       return;
//     }
//
//     intervalTime = newIntervalTime;
//
//     // reboot interval!
//     if (interval) {
//       clearInterval(interval);
//     }
//
//     startInterval();
//   },
// };
