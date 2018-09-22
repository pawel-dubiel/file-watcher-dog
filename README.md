# file-watcher-dog
Watch recursively files by regex in directory and post modifications as event to Datadog

## Installation
```npm install @paweldubiel/file-watcher-dog```

## Usage
```javascript

const file_watcherd_dog = require('@paweldubiel/file-watcher-dog');


let file_watcherd_dog = ['.htaccess', '*.php'];
filewatcherdog('/path/', datadog_api_key, monitors_regex);
```