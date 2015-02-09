var config = require('./config.js');
var Q = require('q');

function getSectionSuffix() {
    var section = config.get().section;
    return section ? section+'-' : '';
}

function getBrowserSubdir() {
    var deferred = Q.defer();

    if (!browser || typeof browser.getCapabilities !== 'function') {
        deferred.resolve('');
    } else {
        browser.getCapabilities().then(function (capabilities) {
            deferred.resolve([capabilities.caps_.platform, capabilities.caps_.browserName, capabilities.caps_.version].join('-') + '/');
        });
    }

    return deferred.promise;
}

function getFixturePathByName(name) {
    return config.get().data+getBrowserSubdir()+name+getSectionSuffix()+'.png';
}
function getResultPathByName(name) {
    return config.get().results+getBrowserSubdir()+name+getSectionSuffix()+'.png';
}

exports.getFixturePathByName = getFixturePathByName;
exports.getResultPathByName = getResultPathByName;