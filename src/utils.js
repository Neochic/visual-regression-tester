var config = require('./config.js');

function getSectionSuffix() {
    var section = config.get().section;
    return section ? section+'-' : '';
}

function getBrowserSubdir() {
    var capabilities = config.get().capabilities;
    if (!capabilities || typeof capabilities.get !== "function") {
        return "default/";
    }

    return [capabilities.get("platform"), capabilities.get("browserName"), capabilities.get("version")].join('-') + '/';
}

function getFixturePathByName(name) {
    return config.get().data+getBrowserSubdir()+name+getSectionSuffix()+'.png';
}
function getResultPathByName(name) {
    return config.get().results+getBrowserSubdir()+name+getSectionSuffix()+'.png';
}

exports.getFixturePathByName = getFixturePathByName;
exports.getResultPathByName = getResultPathByName;
