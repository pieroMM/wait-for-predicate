import {setInterval} from "node:timers";
import * as assert from 'node:assert'

/** @typedef {Object} WaitForPredicateOptions
 * @property {number} timeout
 * @prop {number} [step=1000]
 */

export const TIMEOUT_EXPIRED = 'timeoutExpired';

/**
 * Waits for given predicate within a specified time interval
 *
 * @param {(...args: any[]) => boolean} predicate - the predicate to waiting for
 * @param {WaitForPredicateOptions} options - settings for timeout and evaluation time step
 * @returns {Promise<void>}
 */
export const waitForPredicate = (predicate, options) => new Promise((resolve, reject) => {

    const {timeout} = options;
    const step = options.step ?? 1000;

    assert.ok(predicate != null && timeout != null, "predicate and options.timeout must be defined");
    assert.ok(predicate instanceof Function, "predicate must be a function");
    assert.ok(timeout > 0, "options.timeout must be positive");
    assert.ok(step > 0, "options.step must be positive");

    let timeAcc = 0

    const interval = setInterval(() => {
        if (timeAcc >= timeout) {
            clearInterval(interval);
            reject(Error(TIMEOUT_EXPIRED));
        }
        if (!!predicate()) {
            clearInterval(interval);
            resolve();
        }
        timeAcc+= step;
    }, step)
});

