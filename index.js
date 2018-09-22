const watch = require('node-watch');
const path = require('path');
const dogapi = require('dogapi');

function send_request(title, text) {
    dogapi.client.request('POST', '/events',
        {
            body:
                {
                    "title": title,
                    "text": text,
                    "priority": "normal",
                    "alert_type": "error"
                }
        },
        function (err, results) {
            console.dir(results);
        });
}

module.exports = function (directory, api_key, monitors) {

    const options = {
        'api_key': api_key
    };

    dogapi.initialize(options);

    let monitors_parsed_regex = monitors.map(function (el) {
        let new_el = el.replace('.', '\\.');
        new_el = new_el.replace('*', '.*');
        return '^' + new_el + '$';
    });

    monitors_parsed_regex = monitors_parsed_regex.join('|');

    console.log('monitor ' + directory + ' for modifications to ' + monitors_parsed_regex);

    var regex = new RegExp(monitors_parsed_regex, 'g');

    watch(directory, {recursive: true}, function (evt, name) {

        base_name = path.basename(name);
        if (base_name.match(regex)) {
            if (evt === 'update') {
                console.log('created a file at ' + name);
                send_request('FILE MODIFICATION. ALERT! created/modified a suspicious file at ' + name, '');
            }

            if (evt === 'remove') {
                console.log('deleted a file at' + name);
                send_request('FILE MODIFICATION. ALERT! deleted file at' + name, '')

            }
        }
    });
};


