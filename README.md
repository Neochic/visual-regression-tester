# visual-regression-tester
Matcher and reporter for jasmine 2.x to compare screenshots and report differences. It is designed to be used with protractor and jasmine for CSS regression tests.

## Installation
```npm install --save-dev https://github.com/Neochic/visual-regression-tester/archive/v0.0.2-alpha.tar.gz```

Put the following lines into your ```onPrepare```-function of protractor configuration:
```javascript
var visualRegresisonTester = require("visual-regression-tester");

jasmine.getEnv().addReporter(visualRegresisonTester.reporter);

beforeEach(function() {
    jasmine.addMatchers(visualRegresisonTester.matcher);
});
```

If you test multiple browsers you should add the capabilities to the visual regression tester configuration. That way separate directories for different browsers and browserversions are used.
In that case your ```onPrepare```-function should look like:
```javascript
var Q = require('q');
var visualRegresisonTester = require("visual-regression-tester");
var deferred = Q.defer();

jasmine.getEnv().addReporter(visualRegresisonTester.reporter);

browser.getCapabilities().then(function (_capabilities_) {
    // you may want to set additional configuration like results- and data-directories here 
    visualRegresisonTester.config.set({
        capabilities: _capabilities_
    });
    deferred.resolve();
});

beforeEach(function() {
    jasmine.addMatchers(visualRegresisonTester.matcher);
});

return deferred.promise;
```

## Possible config variables
| variable | type | default | description |
| --- | --- | --- | --- |
| results | string  | ```'test-results/css-regression/'``` | Path for tested screens. |
| data| string | ```'test/css-regression/fixtures/'``` | Fixture path with data to compare to. |
| section | string | ```''``` | Additional suffix to add to filename before file extension. |
| capabilities | capabilities | ```null``` | Capabilities to get browser information from. | 
