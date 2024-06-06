# Wait For Predicate
A function which resolves a promise whether a given predicate becomes true.
## Installation

```bash
npm i wait-for-predicate
```

## Usage

```javascript
import { waitForPredicate, TIMEOUT_EXPIRED } from 'wait-for-predicate';

let exit = false;
const predicate = () => !!exit;
try {
    setTimeout(() => { exit = true }, 5000);
    await waitForPredicate(predicate, { timeout: 3000 });
} catch(error) {
    if (error.message, TIMEOUT_EXPIRED) {
        console.error(TIMEOUT_EXPIRED);
    }
    throw error;
}
```
## License
[MIT](https://choosealicense.com/licenses/mit/)
