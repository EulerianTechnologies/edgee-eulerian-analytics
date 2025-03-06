/**
 * @typedef {import("../types/wit").dataCollection} EdgeeDataCollection
 * @typedef {import("../types/wit").dataCollection.EdgeeRequest} EdgeeRequest
 * @typedef {import("../types/wit").dataCollection.Dict} Dict
 * @typedef {import("../types/wit").dataCollection.Event} Event
 * @typedef {import("../types/wit").dataCollection.PageData} PageData
 * @typedef {import("../types/wit").dataCollection.TrackData} TrackData
 * @typedef {import("../types/wit").dataCollection.UserData} UserData
 * @typedef {import("../types/wit").dataCollection.Context} Context
 */

/* All vendors + All purposes */
const TCFV2_DEFAULT_GRANTED = "CQN3nOXQN3nOXEBAAAENCZCAAP_AAAAAAAqII7Nd_X__bX9n-_7_6ft0eY1f9_r37uQzDhfNs-8F3L_W_LwX32E7NF36tq4KmR4ku1bBIQNtHMnUDUmxaolVrzHsak2cpyNKJ_JkknsZe2dYGF9Pn9lD-YKZ7_5_9_f52T_9_9_-39z3_9f___dv_-__-vjf_599n_v9fV_78_Kf9______-____________8AAAAAA.II7Nd_X__bX9n-_7_6ft0eY1f9_r37uQzDhfNs-8F3L_W_LwX32E7NF36tq4KmR4ku1bBIQNtHMnUDUmxaolVrzHsak2cpyNKJ_JkknsZe2dYGF9Pn9lD-YKZ7_5_9_f52T_9_9_-39z3_9f___dv_-__-vjf_599n_v9fV_78_Kf9______-____________8A";
/* Only Eulerian + No purposes */
const TCFV2_DEFAULT_PENDING_DENIED = "CQN3nOXQN3nOXEBAAAENCZCAAAAAAAAAAAqII7QAQDOgAAAA.II7Nd_X__bX9n-_7_6ft0eY1f9_r37uQzDhfNs-8F3L_W_LwX32E7NF36tq4KmR4ku1bBIQNtHMnUDUmxaolVrzHsak2cpyNKJ_JkknsZe2dYGF9Pn9lD-YKZ7_5_9_f52T_9_9_-39z3_9f___dv_-__-vjf_599n_v9fV_78_Kf9______-____________8A";

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
  let gdpr_consent = eventProperties?.gdpr_consent ?? "";
  if ( !gdpr_consent.length ) {
    if ( data.consent === "granted" ) {
      gdpr_consent = TCFV2_DEFAULT_GRANTED;
    } else {
      gdpr_consent = TCFV2_DEFAULT_PENDING_DENIED;
    }
  }
  return {
    "ereplay-platform"  : "edgee",
    "euidl"             : context.user.edgeeId,
    "url"               : data.url ?? context.page?.url ?? "",
    "urlp"              : data.path ?? "",
    "rf"                : data.referrer ?? "",
    "uid"               : data.user_id ?? context.user?.userId ?? "",
    "ereplay-ip"        : context.client.ip ?? "",
    "ereplay-ua"        : context.client.userAgent ?? "",
    "ereplay-time"      : Math.floor(Date.now() / 1000),
    "ss"                : context.client.screenWidth+"x"+context.client.screenHeight,
    "sd"                : context.client.screenDensity ?? "",
    "category"          : data.category ?? "",
    "search"            : data.search ?? "",
    "title"             : data.title ?? "",
    "event_name"        : data.name ?? "",
    gdpr_consent,
    ...eventProperties,
    ...utm
  };
};

/** @type {EdgeeDataCollection} */
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
