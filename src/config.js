var extend = require('util')._extend;

var config = {
    results: 'test-results/css-regression/',
    data: 'test/css-regression/fixtures/',
    section: ''
};

function set(obj) {
    extend(config, obj);
};

function get() {
    return config;
};

module.exports = {
    set: set,
    get: get
};