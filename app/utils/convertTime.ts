/**
 *
 * @param time
 * @returns Number of milliseconds
 */
// eslint-disable-next-line complexity
const convertTime = (time: string): number => {
  /** ======================================== Validation ============================================ */
  if (typeof time !== 'string') throw new Error('Invalid time format. Expected format: 1s, 1m, 1h, 1d');
  if (time.length < 2 || time.length > 3) throw new Error('Invalid time format. Expected format: 1s, 1m, 1h, 1d');
  if (!time.includes('s') && !time.includes('m') && !time.includes('h') && !time.includes('d')) {
    throw new Error('Invalid time format. Expected format: 1s, 1m, 1h, 1d');
  }

  if (time.includes('s')) return Number(time.split('s')[0]) * 1000;
  if (time.includes('m')) return Number(time.split('m')[0]) * 60 * 1000;
  if (time.includes('h')) return Number(time.split('h')[0]) * 60 * 60 * 1000;
  if (time.includes('d')) return Number(time.split('d')[0]) * 24 * 60 * 60 * 1000;
  return 0;
};

export { convertTime };
