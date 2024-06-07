import { describe, it, mock } from 'node:test';
import * as assert from 'node:assert';
import { waitForPredicate, TIMEOUT_EXPIRED } from '../wait-for-predicate.mjs';

describe('testing waitForPredicate function validation', async () => {
    await it('providing a non-functional predicate, should fail', async () => {
        try {
            await waitForPredicate(true, { timeout: 5000 });
        } catch (error) {
            assert.strictEqual(error.code, 'ERR_ASSERTION');
            assert.strictEqual(error.message, 'predicate must be a function');
        }
    });

    await it('providing timeout less than 0, should fail', async () => {
        try {
            await waitForPredicate(() => false, { timeout: -5000 });
        } catch (error) {
            assert.strictEqual(error.code, 'ERR_ASSERTION');
            assert.strictEqual(error.message, 'options.timeout must be positive');
        }
    });

    await it('providing timeout as 0, should fail', async () => {
        try {
            await waitForPredicate(() => false, { timeout: 0 });
        } catch (error) {
            assert.strictEqual(error.code, 'ERR_ASSERTION');
            assert.strictEqual(error.message, 'options.timeout must be positive');
        }
    });

    await it('providing step less than 0, should fail', async () => {
        try {
            await waitForPredicate(() => false, { timeout: 5000, step: -500 });
        } catch (error) {
            assert.strictEqual(error.code, 'ERR_ASSERTION');
            assert.strictEqual(error.message, 'options.step must be positive');
        }
    });

    await it('providing step as 0, should fail', async () => {
        try {
            await waitForPredicate(() => false, { timeout: 5000, step: 0});
        } catch (error) {
            assert.strictEqual(error.code, 'ERR_ASSERTION');
            assert.strictEqual(error.message, 'options.step must be positive');
        }
    });

    await it('providing incomplete params set, should fail', async () => {
        try {
            await waitForPredicate(() => false, {});
        } catch (error) {
            assert.strictEqual(error.code, 'ERR_ASSERTION');
            assert.strictEqual(error.message, 'predicate and options.timeout must be defined');
        }
        try {
            await waitForPredicate(undefined,{ timeout: 5000 });
        } catch (error) {
            assert.strictEqual(error.code, 'ERR_ASSERTION');
            assert.strictEqual(error.message, 'predicate and options.timeout must be defined');
        }
    });
});


describe('testing waitForPredicate function', async () => {

    await it('predicate is true after 5 seconds, providing no step', async () => {
        let exit = false;
        const predicate = mock.fn(() => !!exit);
        setTimeout(() => { exit = true }, 5000);
        await waitForPredicate(predicate, { timeout: 10000 });
        assert.ok(predicate.mock.calls?.length <= 5);
    });

    await it('predicate is true after 5 seconds, providing step', async () => {
        let exit = false;
        const predicate = mock.fn(() => !!exit);
        setTimeout(() => { exit = true}, 5000);
        await waitForPredicate(predicate, { timeout: 10000, step: 500 });
        assert.ok(predicate.mock.calls?.length <= 10);
    });

    await it('predicate is true after 5 seconds, with 3 seconds timeout', async () => {
        let exit = false;
        const predicate = mock.fn(() => !!exit);
        try {
            setTimeout(() => { exit = true}, 5000);
            await waitForPredicate(predicate, { timeout: 3000 });
        } catch(error) {
            assert.strictEqual(error.message, TIMEOUT_EXPIRED);
            assert.ok(predicate.mock.calls?.length <= 5);
        }
    });

    await it('timeout after at least 5 iterations, providing no step', async () => {
        const predicate = mock.fn(() => false);
        try {
            await waitForPredicate(predicate, { timeout: 5000 });
        } catch(error) {
            assert.strictEqual(error.message, TIMEOUT_EXPIRED);
            assert.ok(predicate.mock.calls?.length >= 5);
        }
    });

    await it('timeout after at least 11 iterations, providing step', async () => {
        const predicate = mock.fn(() => false);
        try {
            await waitForPredicate(predicate, { timeout: 5000, step: 500});
        } catch(error) {
            assert.strictEqual(error.message, TIMEOUT_EXPIRED);
            assert.ok(predicate.mock.calls?.length >= 11);
        }
    });

})
