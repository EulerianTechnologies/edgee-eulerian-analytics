/** @module Interface edgee:components/data-collection **/
export function page(e: Event, settings: Dict): EdgeeRequest;
export function track(e: Event, settings: Dict): EdgeeRequest;
export function user(e: Event, settings: Dict): EdgeeRequest;
export type Dict = Array<[string, string]>;
/**
 * # Variants
 * 
 * ## `"page"`
 * 
 * ## `"track"`
 * 
 * ## `"user"`
 */
export type EventType = 'page' | 'track' | 'user';
/**
 * # Variants
 * 
 * ## `"pending"`
 * 
 * ## `"granted"`
 * 
 * ## `"denied"`
 */
export type Consent = 'pending' | 'granted' | 'denied';
export interface PageData {
  name: string,
  category: string,
  keywords: Array<string>,
  title: string,
  url: string,
  path: string,
  search: string,
  referrer: string,
  properties: Dict,
}
export interface UserData {
  userId: string,
  anonymousId: string,
  edgeeId: string,
  properties: Dict,
}
export interface TrackData {
  name: string,
  properties: Dict,
  products: Array<Dict>,
}
export type Data = DataPage | DataTrack | DataUser;
export interface DataPage {
  tag: 'page',
  val: PageData,
}
export interface DataTrack {
  tag: 'track',
  val: TrackData,
}
export interface DataUser {
  tag: 'user',
  val: UserData,
}
export interface Client {
  ip: string,
  locale: string,
  timezone: string,
  userAgent: string,
  userAgentArchitecture: string,
  userAgentBitness: string,
  userAgentVersionList: string,
  userAgentFullVersionList: string,
  userAgentMobile: string,
  userAgentModel: string,
  osName: string,
  osVersion: string,
  screenWidth: number,
  screenHeight: number,
  screenDensity: number,
  continent: string,
  countryCode: string,
  countryName: string,
  region: string,
  city: string,
}
export interface Campaign {
  name: string,
  source: string,
  medium: string,
  term: string,
  content: string,
  creativeFormat: string,
  marketingTactic: string,
}
export interface Session {
  sessionId: string,
  previousSessionId: string,
  sessionCount: number,
  sessionStart: boolean,
  firstSeen: bigint,
  lastSeen: bigint,
}
export interface Context {
  page: PageData,
  user: UserData,
  client: Client,
  campaign: Campaign,
  session: Session,
}
export interface Event {
  uuid: string,
  timestamp: bigint,
  timestampMillis: bigint,
  timestampMicros: bigint,
  eventType: EventType,
  data: Data,
  context: Context,
  consent?: Consent,
}
/**
 * # Variants
 * 
 * ## `"GET"`
 * 
 * ## `"PUT"`
 * 
 * ## `"POST"`
 * 
 * ## `"DELETE"`
 */
export type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE';
export interface EdgeeRequest {
  method: HttpMethod,
  url: string,
  headers: Dict,
  forwardClientHeaders: boolean,
  body: string,
}
