export const toHHMMSS = (s: number): string => {
  var date = new Date(0);
  date.setSeconds(s);
  return date.toISOString().substr(11, 8).replace('00:', '');
};
