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
                    "alert_type": "error",
                    "status": "error"
                }
        },
        function (err, results) {
            console.dir(results);
        });
}

function ping() {
    dogapi.client.request('POST', '/events',
    {
        body:
            {
                "title": 'Monitoring files integrity is working',
                "text": 'Monitoring files int4grity is working',
                "priority": "low",
                "alert_type": "info",
                "status": 'success'
            }
    });
}

module.exports = function (directory, api_key, monitors) {

    const options = {
        'api_key': api_key
    };

    dogapi.initialize(options);

    let timerId = setInterval(ping, 1000*3600);


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
                send_request('FILE MODIFICATION. ALERT!', 'FILE MODIFICATION. ALERT! created/modified a suspicious file at ' + name);
            }

            if (evt === 'remove') {
                console.log('deleted a file at' + name);
                send_request('FILE MODIFICATION. ALERT!', 'FILE MODIFICATION. ALERT! created/modified a suspicious file at ' + name);
            }
        }
    });
};


