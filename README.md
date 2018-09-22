# file-watcher-dog
Watch recursively files by regex in directory and post modifications as event to Datadog

## Installation
```npm install @paweldubiel/file-watcher-dog```

## Usage
```javascript

const file_watcher_dog = require('@paweldubiel/file-watcher-dog');


let monitors_regex = ['.htaccess', '*.php'];
file_watcher_dog('/path/', datadog_api_key, monitors_regex);
```