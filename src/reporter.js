var Q = require('q'),
    utils = require('./utils'),
    fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    stream = require('stream'),
    PNG = require('pngjs').PNG;

function loadFromStream(stream) {
    var deferred = Q.defer();
    stream.pipe(new PNG({
        filterType: 4
    })).on('parsed', function() {
        deferred.resolve(this);
    });
    return deferred.promise;
}

function pixel(image, x, y, value) {
    if(x >= image.width || y >= image.height) {
        return [0,0,0,0];
    }

    var idx = (image.width * y + x) << 2;
    if(typeof value !== 'undefined') {
        image.data[idx] = value[0];
        image.data[idx+1] = value[1];
        image.data[idx+2] = value[2];
        image.data[idx+3] = value[3];
    }

    return [
        image.data[idx],
        image.data[idx+1],
        image.data[idx+2],
        image.data[idx+3]
    ];
}

function pixelwise(width, height, fn) {
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            fn(x,y);
        }
    }
}

function createDir(dirname) {
    var deferred = Q.defer();

    mkdirp(dirname, function (err) {
        if (err) console.error(err);
        deferred.resolve();
    });

    return deferred.promise;
}

var completedPromises = [];

module.exports = {
    specDone: function(result) {
        result.failedExpectations.forEach(function(exp) {
            var deferred = Q.defer();
            completedPromises.push(deferred.promise);

            if(exp.matcherName !== 'toLookLike') {
                return;
            }

            var file = utils.getResultPathByName(exp.expected),
                combinedFile = utils.getResultPathByName(exp.expected+'-combined'),
                dirname = path.dirname(utils.getResultPathByName(exp.expected)),
                actual;

            createDir(dirname)
                .then(function() {
                    fs.writeFileSync(file, exp.actual, {encoding: 'base64'}, console.log);

                    var actualStream = stream.Readable();
                    actualStream.push(new Buffer(exp.actual, 'base64'));
                    actualStream.push(null);

                    return loadFromStream(actualStream);
                })
                .then(function(image) {
                    actual = image;

                    var expectedPath = utils.getFixturePathByName(exp.expected);
                    var expectedStream = fs.createReadStream(expectedPath);
                    return loadFromStream(expectedStream);
                })
                .then(function(expected) {
                    var maxWidth = Math.max(actual.width, expected.width),
                        maxHeight = Math.max(actual.height, expected.height);

                    var result = new PNG({
                        filterType: 4,
                        width: actual.width+expected.width+maxWidth,
                        height: maxHeight
                    });

                    pixelwise(maxWidth, maxHeight, function(x, y) {
                        var actualValue = pixel(actual, x, y);
                        var expectedValue = pixel(expected, x, y);
                        var equal = true;
                        for(var i = 0; i < 4; i++) {
                            if(actualValue[i] !== expectedValue[i]) {
                                equal = false;
                                break;
                            }
                        }
                        pixel(result, x, y, equal ? [255,255,255,255] : [0,0,0,255]);
                    });

                    pixelwise(expected.width, expected.height, function(x, y) {
                        var value = pixel(expected, x, y);
                        pixel(result, x+maxWidth, y, value);
                    });

                    pixelwise(actual.width, actual.height, function(x, y) {
                        var value = pixel(actual, x, y);
                        pixel(result, x+maxWidth+expected.width, y, value);
                    });

                    result.on('end', function() {
                        deferred.resolve();
                    });

                    result.pack().pipe(fs.createWriteStream(combinedFile));
                });
        });
    },
    completed: function() {
        return Q.all(completedPromises);
    }
};