var fs = require('fs');
var utils = require('./utils');

function toLookLike() {

    var compare = function (actual, expected) {
        var result = {
            pass: null,
            message: null
        };

        var path = utils.getFixturePathByName(expected);
        if(!fs.existsSync(path)) {
            result.pass = false;
            result.message = 'Does not look like '+path+'. Fixture image not found.';
        } else {
            var fixture = fs.readFileSync(path);
            result.pass = new Buffer(actual, 'base64').toString() == fixture.toString();
            result.message = 'Does not look like '+path+'.';
        }

        return result;
    };

    return {
        compare: compare
    };
}

module.exports = {
    toLookLike: toLookLike
};
