/**
 * @typedef {{ everySecond: string, everyMinute: string, everyHour: string, everyDay: string, everyWeek: string, everyMonth: string, everyYear: string }} Schedule
 */
export = {
  everySecond: '* * * * * *',
  everyFifteenSeconds: '*/15 * * * * *',
  everyMinute: '0 * * * * *',
  everyFiveMinutes: '0 */5 * * * *',
  everyFifteenMinutes: '0 */15 * * * *',
  everyHour: '0 0 * * * *',
  everyDay: '0 0 0 * * *',
  everySunday: '0 0 0 * * 0',
  everyMonday: '0 0 0 * * 1',
  everyTuesday: '0 0 0 * * 2',
  everyWednesday: '0 0 0 * * 3',
  everyThursday: '0 0 0 * * 4',
  everyFriday: '0 0 0 * * 5',
  everySaturday: '0 0 0 * * 6',

  /**
   *
   * @param {string} time - '21:15'
   * @returns
   */
  everySundayAt: (time: string) => `0 ${time.split(':')[1]} ${time.split(':')[0]} * * 0`,

  /**
   *
   * @param {string} time - '21:15'
   * @returns
   */
  everyMondayAt: (time: string) => `0 ${time.split(':')[1]} ${time.split(':')[0]} * * 1`,

  /**
   *
   * @param {string} time - '21:15'
   * @returns
   */
  everyTuesdayAt: (time: string) => `0 ${time.split(':')[1]} ${time.split(':')[0]} * * 2`,

  /**
   *
   * @param {string} time - '21:15'
   * @returns
   */
  everyWednesdayAt: (time: string) => `0 ${time.split(':')[1]} ${time.split(':')[0]} * * 3`,

  /**
   *
   * @param {string} time - '21:15'
   * @returns
   */
  everyThursdayAt: (time: string) => `0 ${time.split(':')[1]} ${time.split(':')[0]} * * 4`,

  /**
   *
   * @param {string} time - '21:15'
   * @returns
   */
  everyFridayAt: (time: string) => `0 ${time.split(':')[1]} ${time.split(':')[0]} * * 5`,

  /**
   *
   * @param {string} time - '21:15'
   * @returns
   */
  everySaturdayAt: (time: string) => `0 ${time.split(':')[1]} ${time.split(':')[0]} * * 6`,

  everyQuarter: '0 0 0 1/4 * *',
};
