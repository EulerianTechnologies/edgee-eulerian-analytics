/**
 * @typedef {import("../types/interfaces/edgee-components-data-collection").EdgeeComponentsDataCollection} EdgeeComponentsDataCollection
 * @typedef {import("../types/interfaces/edgee-components-data-collection").EdgeeRequest} EdgeeRequest
 * @typedef {import("../types/interfaces/edgee-components-data-collection").Dict} Dict
 * @typedef {import("../types/interfaces/edgee-components-data-collection").Event} Event
 * @typedef {import("../types/interfaces/edgee-components-data-collection").PageData} PageData
 * @typedef {import("../types/interfaces/edgee-components-data-collection").TrackData} TrackData
 * @typedef {import("../types/interfaces/edgee-components-data-collection").UserData} UserData
 * @typedef {import("../types/interfaces/edgee-components-data-collection").Context} Context
 */

/**
 * Convert a {@link Dict} into a native JavaScript object
 *
 * Needed since Wasm Component doesn't have a native map type.
 *
 * @param {Dict} dict
 *
 * @returns {Map}
 */
export const convertDict = (dict) => {
  let data = {};

  for (let [key, value] of dict) {
    data[key] = value;
  }

  return data;
};

/**
 * @param {any} payload
 * @param {string} payload
 *
 * @returns {EdgeeRequest}
 */
const buildEdgeeRequest = (payload, trackingTarget, website) => ({
  method: 'POST',
  url: `https://${trackingTarget}.eulerian.net/collector/${website}/`,
  headers: [
    ['X-Forwarded-For', payload['ereplay-ip'] ],
    ['User-Agent', payload['ereplay-ua'] ],
    ['Content-Type', 'application/json'],
  ],
  body: new URLSearchParams(payload).toString(),
  forwardClientHeaders: true,
});

/**
 * @param {PageData} data
 * @param {Context} context
 *
 * @returns {any}
 */
const buildPayload = (data, context) => {
  const eventProperties = convertDict(data.properties);
  let utm = {};
  if ( context.campaign?.medium ) {
    utm.utm_medium = context.campaign?.medium;
  }
  if ( context.campaign?.source ) {
    utm.utm_source = context.campaign?.source;
  }
  if ( context.campaign?.name ) {
    utm.utm_campaign = context.campaign?.name;
  }
  if ( context.campaign?.content ) {
    utm.utm_content = context.campaign?.content;
  }
  if ( context.campaign?.term ) {
    utm.utm_term = context.campaign?.term;
  }
  return {
    "ereplay-platform"  : "edgee",
    "euidl"             : context.user.edgee_id,
    "url"               : data.url ?? "",
    "urlp"              : data.path ?? "",
    "rf"                : data.referrer ?? "",
    "uid"               : data.user_id ?? context.user?.user_id ?? "",
    "ereplay-ip"        : context.client.ip ?? "",
    "ereplay-ua"        : context.client.user_agent ?? "",
    "ereplay-time"      : Math.floor(Date.now() / 1000),
    "ss"                : context.client.screen_width+"x"+context.client.screen_height,
    "sd"                : context.client.screen_density ?? "",
    "category"          : data.category ?? "",
    "search"            : data.search ?? "",
    "title"             : data.title ?? "",
    "event_name"        : data.name ?? "",
    ...eventProperties,
    ...utm
  };
};

/** @type {EdgeeComponentsDataCollection} */
export const dataCollection = {

  /**
   * @param {Event} e
   * @param {Dict} settings
  */
  page(e, settings) {
    if (e.data.tag != 'page') {
      throw new Error("Missing page data");
    }

    // convert to native object
    settings = convertDict(settings);

    // build payload
    const payload = buildPayload(e.data.val, e.context);

    // build and return EdgeeRequest
    return buildEdgeeRequest(
      payload,
      settings['trackingTarget'],
      settings['website']
    );
  },

  /**
   * @param {Event} e
   * @param {Dict} settings
  */
  track(e, settings) {
    if (e.data.tag != 'track') {
      throw new Error("Missing track data");
    }

    // convert to native object
    settings = convertDict(settings);

    // build payload
    const payload = buildPayload(e.data.val, e.context);

    // build and return EdgeeRequest
    return buildEdgeeRequest(
      payload,
      settings['trackingTarget'],
      settings['website']
    );
  },

  /**
   * @param {Event} e
   * @param {Dict} settings
  */
  user(e, settings) {
    if (e.data.tag != 'user') {
      throw new Error("Missing user data");
    }

    // convert to native object
    settings = convertDict(settings);

    // build payload
    const payload = buildPayload(e.data.val, e.context);

    // build and return EdgeeRequest
    return buildEdgeeRequest(
      payload,
      settings['trackingTarget'],
      settings['website']
    );
  },
};
