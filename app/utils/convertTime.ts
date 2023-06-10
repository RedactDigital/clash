/**
 *
 * @param time
 * @returns Number of milliseconds
 */
const convertTime = (time: string): number | any => {
  try {
    if (time.includes('s')) return <number>+time.split('s')[0] * 1000;
    if (time.includes('m')) return <number>+time.split('m')[0] * 60 * 1000;
    if (time.includes('h')) return <number>+time.split('h')[0] * 60 * 60 * 1000;
    if (time.includes('d')) return <number>+time.split('d')[0] * 24 * 60 * 60 * 1000;
    if (!time.includes('s') && !time.includes('m') && !time.includes('h') && !time.includes('d')) {
      throw new Error('Invalid time format. Expected format: 1s, 1m, 1h, 1d');
    }
  } catch (error) {
    throw error;
  }
};

export { convertTime };
