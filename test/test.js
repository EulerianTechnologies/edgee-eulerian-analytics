import assert from 'assert'
import {dataCollection} from '../src/index.js';

describe('data collection component', function () {

  const samplePageEvent = {
    uuid: "abc",
    timestamp: 123,
    timestampMillis: 123,
    timestampMicros: 123,
    eventType: "page",
    data: {
      tag: 'page',
      val: {
        name: "page name",
        category: "category",
        keywords: ["keyword1", "keyword2"],
        title: "page title",
        url: "https://mywebsite.com/path?ok=1",
        path: "/path",
        search: "?ok=1",
        referrer: "https://anotherwebsite.com/source",
        properties: [],
      },
    },
    context: {
      page: {}, // empty for brevity
      client: {}, // empty for brevity
      campaign: {}, // empty for brevity
      user: {
        userId: "abc",
        anonymousId: "def",
        edgeeId: "123abc",
        properties: [],
      },
      session: {
        sessionId: "42",
        previousSessionId: "qwerty",
        sessionCount: 1,
        sessionStart: false,
        firstSeen: 123,
        lastSeen: 123,
      },
    },
    consent: "granted",
  };

  const sampleSettings = [
    ["your_api_key", "api_value"]
  ];

  describe('#page()', function () {
    it('should return an EdgeeRequest object', function () {
      const req = dataCollection.page(samplePageEvent, sampleSettings);
      assert.equal(req.method, "POST");
      assert.equal(req.url, "https://your-endpoint.com/path");
      assert.equal(req.headers.length, 2);
      assert.equal(req.body, '{"sessionId":42,"pageTitle":"page title"}');
    });
  });

});
