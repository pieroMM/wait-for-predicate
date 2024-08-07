# Wait For Predicate
A function which resolves a promise whether a given predicate becomes true.
## Installation

```bash
npm i wait-for-predicate
```

## Usage

```javascript
const { waitForPredicate, TIMEOUT_EXPIRED } = require("wait-for-predicate");

let exit = false;
const predicate = () => !!exit;
try {
    setTimeout(() => { exit = true }, 5000);
    await waitForPredicate(predicate, { timeout: 3000 });
} catch(error) {
    if (error.message === TIMEOUT_EXPIRED) {
        console.error(TIMEOUT_EXPIRED);
    }
    throw error;
}
```
## License
[ISC](http://opensource.org/licenses/ISC)
