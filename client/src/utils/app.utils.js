/**
 *
 * @param m
 * @returns {Promise<any>}
 */
export const sleep = m => new Promise(r => setTimeout(r, m));