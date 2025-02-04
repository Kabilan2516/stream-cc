import {
  AbstractClient,
  ListenClient,
  ManageClient,
  ReadClient,
  OnPremClient,
  SelfHostedRestClient,
  SpeakClient,
} from "./packages";
/**
 * The DeepgramClient class provides access to various Deepgram API clients, including ListenClient, ManageClient, SelfHostedRestClient, ReadClient, and SpeakClient.
 *
 * @see https://github.com/deepgram/deepgram-js-sdk
 */
export default class DeepgramClient extends AbstractClient {
  /**
   * Returns a new instance of the ListenClient, which provides access to the Deepgram API's listening functionality.
   *
   * @returns {ListenClient} A new instance of the ListenClient.
   */
  get listen(): ListenClient;
  /**
   * Returns a new instance of the ManageClient, which provides access to the Deepgram API's management functionality.
   *
   * @returns {ManageClient} A new instance of the ManageClient.
   */
  get manage(): ManageClient;
  /**
   * Returns a new instance of the SelfHostedRestClient, which provides access to the Deepgram API's self-hosted functionality.
   *
   * @returns {OnPremClient} A new instance of the SelfHostedRestClient named as OnPremClient.
   * @deprecated use selfhosted() instead
   */
  get onprem(): OnPremClient;
  /**
   * Returns a new instance of the SelfHostedRestClient, which provides access to the Deepgram API's self-hosted functionality.
   *
   * @returns {SelfHostedRestClient} A new instance of the SelfHostedRestClient.
   */
  get selfhosted(): SelfHostedRestClient;
  /**
   * Returns a new instance of the ReadClient, which provides access to the Deepgram API's reading functionality.
   *
   * @returns {ReadClient} A new instance of the ReadClient.
   */
  get read(): ReadClient;
  /**
   * Returns a new instance of the SpeakClient, which provides access to the Deepgram API's speaking functionality.
   *
   * @returns {SpeakClient} A new instance of the SpeakClient.
   */
  get speak(): SpeakClient;
  /**
   * @deprecated
   * @see https://dpgr.am/js-v3
   */
  get transcription(): any;
  /**
   * @deprecated
   * @see https://dpgr.am/js-v3
   */
  get projects(): any;
  /**
   * @deprecated
   * @see https://dpgr.am/js-v3
   */
  get keys(): any;
  /**
   * @deprecated
   * @see https://dpgr.am/js-v3
   */
  get members(): any;
  /**
   * @deprecated
   * @see https://dpgr.am/js-v3
   */
  get scopes(): any;
  /**
   * @deprecated
   * @see https://dpgr.am/js-v3
   */
  get invitation(): any;
  /**
   * @deprecated
   * @see https://dpgr.am/js-v3
   */
  get usage(): any;
  /**
   * @deprecated
   * @see https://dpgr.am/js-v3
   */
  get billing(): any;
}
//# sourceMappingURL=DeepgramClient.d.ts.map
