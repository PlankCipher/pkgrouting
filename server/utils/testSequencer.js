// TODO: Make this a gist to use in other projects?

const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
  preferredSequence = ['connection.test.js', 'User.test.js'];

  // eslint-disable-next-line
  escapeRegExp(str) {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  // eslint-disable-next-line
  sort(tests) {
    const copyTests = Array.from(tests);

    const sequenceStart = [];

    this.preferredSequence.forEach((matcher) => {
      const sequenceRegExp = new RegExp(this.escapeRegExp(matcher));

      copyTests.forEach((test, i) => {
        if (sequenceRegExp.test(test.path)) {
          sequenceStart.push(test);
          copyTests.splice(i, 1);
        }
      });
    });

    return [...sequenceStart, ...copyTests];
  }
}

module.exports = CustomSequencer;
