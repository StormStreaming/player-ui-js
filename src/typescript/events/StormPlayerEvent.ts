import {StormPlayerUI} from "../StormPlayerUI";
import {ISourceItem, StormPlayerCore, PlaybackState, StreamState, QualityItem, StreamMetadata} from "@stormstreaming/player-core";
import {PlayerConfigManager} from "@app/typescript/PlayerConfigManager";

export interface StormPlayerEvent {

    /**
     * This event is triggered when a player instance is initialized via initialize() method.
     */
    "playerReady": {ref:StormPlayerUI};

    /**
     * This event is fired when a player instance initiates a connection with a Storm Streaming Server/Cloud instance.
     */
    "serverConnectionInitiate": {ref:StormPlayerUI, serverURL:string};

    /**
     * This event is triggered when a player instance successfully establishes a connection with a Storm Streaming Server/Cloud instance.
     */
    "serverConnect": {ref:StormPlayerUI, serverURL:string};

    /**
     *  This event is called when a player instance is disconnected from the Storm Streaming Server/Cloud (after a connection was previously established), which may occur due to viewer networking issues or Storm Streaming Server/Cloud problems
     */
    "serverDisconnect": {ref:StormPlayerUI, serverURL:string, restart:boolean};

    /**
     * This event is fired whenever a player instance needs to restart a connection with a Storm Streaming Server/Cloud instance.
     */
    "serverConnectionRestart": {ref:StormPlayerUI, isSilent:boolean}

    /**
     * This event is triggered when a player instance fails to establish a connection with a Storm Streaming Server/Cloud instance, possibly due to networking issues. If there are additional servers on the configuration list and the "restartOnError" parameter is set to true, the player will attempt to connect to a different server instead
     */
    "serverConnectionError": {ref:StormPlayerUI, serverURL:string, restart:boolean};

    /**
     * This event is associated with serverConnectionError. If a player instance is unable to connect to any of the servers provided in the configuration list, this event indicates that no further action can be taken.
     */
    "allConnectionsFailed": {ref:StormPlayerUI, mode:string};

    /**
     * Certain browsers and devices do not permit a video element to initiate on its own and necessitate direct user interaction, such as a mouse click or a touch gesture. This event signifies that such an engagement is required.
     */
    "interactionRequired": {ref:StormPlayerUI, mode:string};

    /**
     * This event is triggered if a browser or device does not support any of the provided sources. Please note that the player will attempt all possible measures (switching between various modes) to ensure maximum compatibility with a given device. However, there may be instances where it is simply impossible to initiate a video.
     */
    "compatibilityError": {ref:StormPlayerUI, message:string};

    /**
     * This event is indicates that a request for a stream playback has been created.
     */
    "playbackRequest": {ref:StormPlayerUI, streamKey:string}

    /**
     * This event is fired whenever a playback of a stream is successfully requested form a Storm Streaming Server/Cloud instance.
     */
    "playbackInitiate": {ref:StormPlayerUI, streamKey:string};

    /**
     * This event indicates a video content is being readied for playback. The video buffer must fill in order for the video to start
     */
    "bufferingStart": {ref:StormPlayerUI};

    /**
     * This event indicates that the buffer is full and playback is about to start.
     */
    "bufferingComplete": {ref:StormPlayerUI};

    /**
     * This event notifies that video playback has started (video is now playing)
     */
    "playbackStart": {ref:StormPlayerUI, streamKey:string | null};

    /**
     * This event notifies that video playback has been paused (due to end-user or system interaction)
     */
    "playbackPause": {ref:StormPlayerUI, streamKey:string | null};

    /**
     * This event is fired when the playback is forcefully paused by the system (not by user interaction)
     */
    "playbackForcePause": {ref:StormPlayerUI}

    /**
     * This event is fired when the playback is forcefully muted by the system (not by user interaction)
     */
    "playbackForceMute": {ref:StormPlayerUI}

    /**
     * This event notifies that video playback has been stopped
     */
    "playbackStop": {ref:StormPlayerUI, streamKey:string | null};

    /**
     * This event informs on video progress, stream/playback start-time, stream/playback duration and nDVR cache size
     */
    "playbackProgress": {ref:StormPlayerUI, streamKey:string, streamStartTime:number, streamDuration:number, playbackStartTime:number, playbackDuration:number, dvrCacheSize:number};

    /**
     * This event indicates that there was a problem with the playback (it usually means that the browser was not able to play a source material due to malformed bitcode)
     */
    "playbackError": {ref:StormPlayerUI, mode:string, streamKey:string};

    /**
     * This event is called whenever a stream with a specific name was not found on the server (this includes hibernated streams or sub-streams)
     */
    "streamNotFound": {ref:StormPlayerUI, streamKey:string};

    /**
     * This event delivers optional stream data that was provided by the publisher
     */
    "optionalStreamData": {ref:StormPlayerUI, optData:any}

    /**
     * This event is fired when a subscription request is initiated
     */
    "subscriptionStart": {ref:StormPlayerUI, streamKey:string}

    /**
     * This event is fired when a subscription request is completed
     */
    "subscriptionComplete": {ref:StormPlayerUI, streamKey:string, sourceList:Array<ISourceItem>}

    /**
     * This event notifies that a subscription request has failed
     */
    "subscriptionFailed": {ref:StormPlayerUI, streamKey:string}

    /**
     * This event notifies that stream state has changed (stream state always refers to the original stream on a server)
     */
    "streamStateChange": {ref:StormPlayerUI, streamKey:string | null, state:StreamState}

    /**
     * This event informs on video playback state change
     */
    "playbackStateChange": {ref:StormPlayerUI, streamKey:string | null, state:PlaybackState}

    /**
     * This event will be called when the stream is closed on the server side (usually it means that the broadcaster has stopped streaming, or stream was unpublished)
     */
    "streamStop": {ref:StormPlayerUI, streamKey:string}

    /**
     * This event is activated whenever a new video source is added to the player
     */
    "streamSourceAdd": {ref:StormPlayerUI, mode:string, streamKey:string};

    /**
     * This event is triggered when a player instance is initialized via initialize() method.
     */
    "sourceListUpdate": {ref:StormPlayerUI, sourceList:Array<ISourceItem>};

    /**
     * This event is fired whenever a list of available qualities (substreams) is updated
     */
    "qualityListUpdate": {ref:StormPlayerUI, qualityList:Array<QualityItem>}

    /**
     * This event informs of metadata arrival for current video. MetaData contains information about stream codecs, width, height, bitrate etc
     */
    "streamMetadataUpdate": {ref:StormPlayerUI, metadata:StreamMetadata}

    /**
     * This event notifies that video volume was changed (either its value was changed, or video was muted/un-muted)
     */
    "volumeChange": {ref:StormPlayerUI, volume:number, muted:boolean, invokedBy:"user" | "browser" | "service"};

    /**
     * This event is triggered whenever a video element within a player instance is either created or recreated
     */
    "videoElementCreate": {ref:StormPlayerUI, videoElement:HTMLVideoElement};

    /**
     * This event is fired whenever a player is detached or attached to a new container
     */
    "containerChange": {ref:StormPlayerUI, container: HTMLElement | null;};

    /**
     * This event is triggered when the video size is changed or updated
     */
    "resizeUpdate": {ref:StormPlayerUI, width:number, height:number};

    /**
     * This event is fired when the video source is downgraded due to bandwidth limitations
     */
    "sourceDowngrade": {ref:StormPlayerUI, bandwidthCap:number};

    /**
     * This event is fired when the video is successfully unmuted
     */
    "videoUnmuted": {ref:StormPlayerUI};

    /**
     * This event is fired if an SSL layer is required for specific sources and the browser does not provide it
     */
    "SSLError": { ref:StormPlayerUI, mode:string};

    /**
     * This event is fired when there is a protocol version mismatch between the client and server
     */
    "incompatibleProtocol": {ref:StormPlayerUI, clientProtocolVer:number, serverProtocolVersion:number};

    /**
     * This event is fired when a player instance fails to authorize with a server application on Storm Streaming Server/Cloud instance (e.g. incorrect token)
     */
    "authorizationError": {ref:StormPlayerUI};

    /**
     * This event is called when a player instance successfully authorizes with a server application on Storm Streaming Server/Cloud instance
     */
    "authorizationComplete": {ref:StormPlayerUI};

    /**
     * This event is fired whenever a Storm Streaming Server/Cloud license expires
     */
    "invalidLicense": {ref:StormPlayerUI}

    /**
     * This event notifies that basic stream configuration has been updated
     */
    "streamConfigChange": {ref:StormPlayerUI, newConfig:PlayerConfigManager}

    /**
     * This event is fired whenever a player instance enters browser fullscreen mode (either native or overlay type)
     */
    "fullScreenEnter": {ref:StormPlayerUI}

    /**
     * This event is fired whenever a player instance exits fullscreen mode (either native or overlay type)
     */
    "fullScreenExit": {ref:StormPlayerUI}


    "interfaceReady": {ref:StormPlayerUI};

    "cuePointAdd": {ref:StormPlayerUI, label:string, time:number};

    "cuePointRemove": {ref:StormPlayerUI, time:number};

    "coreCreate" : {ref:StormPlayerUI, core:StormPlayerCore};

    "coreInitialize" : {ref:StormPlayerUI, core:StormPlayerCore};

    "playClick": {ref:StormPlayerUI};

    "pauseClick": {ref:StormPlayerUI};

    "muteClick": {ref:StormPlayerUI};

    "unmuteClick": {ref:StormPlayerUI};

    "videoClick": {ref:StormPlayerUI};

    "volumeSet": {ref:StormPlayerUI, volume:number};

    "qualitySet": {ref:StormPlayerUI, label:string};

    "seekSet": {ref:StormPlayerUI, time:number};

    "seekStart": {ref:StormPlayerUI};

    "seekEnd": {ref:StormPlayerUI};

    "fullscreenEnter": {ref:StormPlayerUI};

    "fullscreenExit": {ref:StormPlayerUI};

    "waitingRoomCreated": {ref:StormPlayerUI};

    "waitingRoomEnded": {ref:StormPlayerUI};

    "guiShow": {ref:StormPlayerUI};

    "guiHide": {ref:StormPlayerUI};

    "hidePoster": {ref:StormPlayerUI, autoStart:boolean};

    "titleUpdate": {ref:StormPlayerUI, title:string, newHeight:number};

    "subtitleUpdate": {ref:StormPlayerUI, subtitle:string, newHeight:number};

    "boxStatShown": {ref:StormPlayerUI};

    "boxStatHid": {ref:StormPlayerUI};

    "contextMenuShown": {ref:StormPlayerUI, e: MouseEvent};

    "contextMenuHid": {ref:StormPlayerUI};

    "errorShown": {ref:StormPlayerUI, message:string};

    "qualitySwitchClick": {ref:StormPlayerUI};

    "qualityChange": {ref:StormPlayerUI, qualityId:number};

    "resize": {ref:StormPlayerUI, newWidth:number, newHeight:number};

    "streamStartNotification": {ref:StormPlayerUI}

    "playerConfigUpdate": {ref:StormPlayerUI};

    "streamConfigUpdate": {ref:StormPlayerUI};
}


