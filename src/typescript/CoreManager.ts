import {StormPlayerUI} from "./StormPlayerUI";
import {StormPlayerCore, StormStreamConfig} from "@stormstreaming/player-core";
import {VideoConfig} from "@stormstreaming/player-core/dist/types/types/VideoConfig";
import {UserCapabilities} from "@app/typescript/utilities/UserCapabilities";
import {StormPlayerConfig} from "@app/typescript/types/StormPlayerConfig";

/**
 * Class responsible for managing StormLibrary instance
 */
export class CoreManager {

    /**
     * Reference to the player
     * @private
     */
    private stormPlayer: StormPlayerUI;

    /**
     * A configuration object for the library
     * @private
     */
    private config: StormStreamConfig;

    /**
     * The StormLibrary Instance
     * @private
     */
    private playerCore: StormPlayerCore;

    /**
     * Timeout for checking resolution;
     * @private
     */
    private resolutionTimeout:number;

    /**
     * Whenever we are in FS mode or not
     * @private
     */
    private isFullScreenMode:boolean = false;

    /**
     * Current player width
     * @private
     */
    private currWidth:number | string = 0;

    /**
     * Current player height
     * @private
     */
    private currHeight:number | string = 0;

    private isLibraryReady:boolean = false;

    /**
     * Reference to the newst video element
     * @private
     */
    private videoElement:HTMLVideoElement | undefined;

    private hadAutostart:boolean = false;

    /**
     * Constructor for the LibraryManager
     *
     * @param config a config for the library
     * @param stormPlayer a reference to the main player class
     */
    constructor(stormPlayer: StormPlayerUI) {
        this.stormPlayer = stormPlayer;
    }

    public initialize(config: StormStreamConfig):void {

        this.config = config;

        if(typeof this.config.settings.video != "undefined") {

            this.hadAutostart = this.config.settings.autoStart;
            this.config.settings.autoStart = false;
            this.config.settings.video.containerID = this.stormPlayer.getInstanceName() + "_video";
            this.config.settings.video.width = this.stormPlayer.getPlayerConfigManager().getWidth();
            this.config.settings.video.height = this.stormPlayer.getPlayerConfigManager().getHeight();

        } else {

            let video:VideoConfig = {
                containerID: this.stormPlayer.getInstanceName() + "_video",
                width: this.stormPlayer.getPlayerConfigManager().getWidth(),
                height: this.stormPlayer.getPlayerConfigManager().getHeight(),
            };

            this.config.settings.video = video;

        }

        this.currWidth = this.stormPlayer.getPlayerConfigManager().getWidth();
        this.currHeight = this.stormPlayer.getPlayerConfigManager().getHeight();

        this.attachListeners();

    }

    /**
     * Returns library config
     */
    public getConfig(): StormStreamConfig {
        return this.config;
    }

    /**
     * Returns library instance
     */
    public getPlayerCore(): StormPlayerCore {
        return this.playerCore;
    }

    public setStreamConfig(streamConfig: StormStreamConfig):void {
        this.config = streamConfig;
        if(this.playerCore != null){
            this.playerCore.setStreamConfig(streamConfig);
        }
    }

    /**
     * Initializes the library
     */
    public initializeLibrary(): void {

        const that:CoreManager = this;

        this.playerCore = new StormPlayerCore(this.config);
        this.playerCore.getLogger().info(this, "Attaching StormPlayerUI v. "+this.stormPlayer.getVersion())
        this.playerCore.getLogger().setPlayerID(this.stormPlayer.getInstanceID());

        this.stormPlayer.dispatchEvent("coreCreate",{ref:this.stormPlayer, core:this.playerCore});

        // libraryReady
        this.playerCore.addEventListener("playerReady", function(event){
            that.stormPlayer.dispatchEvent("playerReady", {ref:that.stormPlayer})
        },false)

        // libraryConnected
        this.playerCore.addEventListener("serverConnectionInitiate", function(event){
            that.stormPlayer.dispatchEvent("serverConnectionInitiate", {ref:that.stormPlayer, serverURL:event.serverURL})
        },false)

        // libraryConnected
        this.playerCore.addEventListener("serverConnect", function(event){
            that.stormPlayer.dispatchEvent("serverConnect", {ref:that.stormPlayer, serverURL:event.serverURL})
        },false)

        // libraryDisconnected
        this.playerCore.addEventListener("serverDisconnect", function(event){
            that.stormPlayer.dispatchEvent("serverDisconnect", {ref:that.stormPlayer, serverURL:event.serverURL, restart:event.restart})
        },false)

        // libraryConnectionFailed
        this.playerCore.addEventListener("serverConnectionError", function(event){
            that.stormPlayer.dispatchEvent("serverConnectionError", {ref:that.stormPlayer, serverURL:event.serverURL, restart:event.restart})
        },false)

        // allConnectionsFailed
        this.playerCore.addEventListener("allConnectionsFailed", function(event){
            that.stormPlayer.dispatchEvent("allConnectionsFailed", {ref:that.stormPlayer, mode:event.mode})
        },false)

        // interactionRequired
        this.playerCore.addEventListener("interactionRequired", function(event){
            that.stormPlayer.dispatchEvent("interactionRequired", {ref:that.stormPlayer, mode:event.mode})
        },false)

        // compatibilityError
        this.playerCore.addEventListener("compatibilityError", function(event){
            that.stormPlayer.dispatchEvent("compatibilityError", {ref:that.stormPlayer, message:event.message})
        },false)

        // playbackInitiated
        this.playerCore.addEventListener("playbackInitiate", function(event){
            that.stormPlayer.dispatchEvent("playbackInitiate", {ref:that.stormPlayer, streamKey:event.streamKey})
        },false)

        // streamBuffering
        this.playerCore.addEventListener("bufferingStart", function(event){
            that.stormPlayer.dispatchEvent("bufferingStart", {ref:that.stormPlayer})
        },false)

        // streamBuffering
        this.playerCore.addEventListener("bufferingComplete", function(event){
            that.stormPlayer.dispatchEvent("bufferingComplete", {ref:that.stormPlayer})
        },false)

        this.playerCore.addEventListener("authorizationComplete", function(event){
            that.stormPlayer.dispatchEvent("authorizationComplete", {ref:that.stormPlayer})
        }, false)

        this.playerCore.addEventListener("authorizationError", function(event){
            that.stormPlayer.dispatchEvent("authorizationError", {ref:that.stormPlayer})
        }, false)

        // playbackStarted
        this.playerCore.addEventListener("playbackStart", function(event){
            that.stormPlayer.dispatchEvent("playbackStart", {ref:that.stormPlayer, streamKey:event.streamKey})
        },false)

        // playbackPaused
        this.playerCore.addEventListener("playbackPause", function(event){
            that.stormPlayer.dispatchEvent("playbackPause", {ref:that.stormPlayer, streamKey:event.streamKey})
        },false)

        // playbackStopped
        this.playerCore.addEventListener("playbackStop", function(event){
            that.stormPlayer.dispatchEvent("playbackStop", {ref:that.stormPlayer, streamKey:event.streamKey})
        },false)

        // streamEnd
        this.playerCore.addEventListener("streamStop", function(event){
            that.stormPlayer.dispatchEvent("streamStop", {ref:that.stormPlayer, streamKey:event.streamKey})
        },false)

        // playbackError
        this.playerCore.addEventListener("playbackError", function(event){
            that.stormPlayer.dispatchEvent("playbackError", {ref:that.stormPlayer, mode:event.mode, streamKey:event.streamKey})
        },false)

        // playbackError
        this.playerCore.addEventListener("sourceListUpdate", function(event){
            that.stormPlayer.dispatchEvent("sourceListUpdate", {ref:that.stormPlayer, sourceList:event.sourceList})
        },false)

        // playbackProgress
        this.playerCore.addEventListener("playbackProgress", function(event){
            that.stormPlayer.dispatchEvent("playbackProgress", {
                ref:that.stormPlayer,
                streamKey:event.streamKey,
                playbackDuration:event.playbackDuration,
                playbackStartTime:event.playbackStartTime,
                streamStartTime:event.streamStartTime,
                streamDuration:event.streamDuration,
                dvrCacheSize:event.dvrCacheSize
            })
        },false)

        // streamNotFound
        this.playerCore.addEventListener("streamNotFound", function(event){
            that.stormPlayer.dispatchEvent("streamNotFound", {ref:that.stormPlayer, streamKey:event.streamKey})
        },false)

        // newStreamSourceAdded
        this.playerCore.addEventListener("streamSourceAdd", function(event){
            that.stormPlayer.dispatchEvent("streamSourceAdd", {ref:that.stormPlayer, mode:event.mode, streamKey:event.streamKey})
        },false)

        // metadataReceived
        this.playerCore.addEventListener("streamMetadataUpdate", function(event){
            that.stormPlayer.dispatchEvent("streamMetadataUpdate", {ref:that.stormPlayer, metadata:event.metadata})
        },false)

        // volumeChanged
        this.playerCore.addEventListener("volumeChange", (event) => {
            this.stormPlayer.dispatchEvent("volumeChange", {ref:that.stormPlayer, volume:event.volume, muted:event.muted, invokedBy:event.invokedBy})
        },false)

        // videoElementCreated
        this.playerCore.addEventListener("videoElementCreate", function(event){
            that.videoElement = event.videoElement;
            that.stormPlayer.dispatchEvent("videoElementCreate", {ref:that.stormPlayer, videoElement:event.videoElement})
        },false)

        // SSLError
        this.playerCore.addEventListener("SSLError", function(event){
            that.stormPlayer.dispatchEvent("SSLError", {ref:that.stormPlayer, mode:event.mode})
        },false)

        // incompatibleProtocol
        this.playerCore.addEventListener("incompatibleProtocol", function(event){
            that.stormPlayer.dispatchEvent("incompatibleProtocol", {ref:that.stormPlayer, clientProtocolVer:event.clientProtocolVer, serverProtocolVersion:event.serverProtocolVersion})
        },false)

        // invalid license
        this.playerCore.addEventListener("invalidLicense", function(event){
            that.stormPlayer.dispatchEvent("invalidLicense", {ref:that.stormPlayer})
        },false)

        // state
        this.playerCore.addEventListener("streamStateChange", function(event){
            that.stormPlayer.dispatchEvent("streamStateChange", {ref:that.stormPlayer, streamKey:event.streamKey, state:event.state})
        },false)

        // this.library.addEventListener("optionalStreamData", function (event){
        //
        //     if(event.optData != null){
        //
        //         let newTheme:StormPlayerConfig = null;
        //         let posterURL:string = "";
        //
        //         // title
        //         if(event.optData.title != null)
        //             that.stormPlayer.setTitle(event.optData.title);
        //         else
        //             that.stormPlayer.setTitle("");
        //
        //         // subtitle
        //         if(event.optData.subtitle != null)
        //             that.stormPlayer.setSubtitle(event.optData.subtitle);
        //         else
        //             that.stormPlayer.setSubtitle("");
        //
        //
        //
        //         // thumbnail
        //         if(event.optData.thumbnail != null){
        //             const sizeName:string = event.optData.thumbnail.sizeName;
        //             for(let i:number=0;i<event.optData.thumbnail.length;i++){
        //                 posterURL = event.optData.thumbnail[i].path;
        //                 break;
        //             }
        //         }
        //
        //         // theme (styles, languages, interface)
        //         if(event.optData.theme != null){
        //             if(event.optData.theme != null){
        //
        //                 switch(typeof event.optData.theme){
        //                     case "string":
        //                         newTheme = JSON.parse(event.optData.theme) as StormPlayerConfig;
        //                         break;
        //                     case "object":
        //                         newTheme = event.optData.theme as StormPlayerConfig;
        //                         break;
        //                 }
        //                 newTheme.posterURL = posterURL;
        //             }
        //         }
        //
        //         if(event.optData.countdown != null){
        //
        //             let splashScreenURL:string = null;
        //
        //             if(newTheme == null)
        //                 newTheme = new Object() as StormPlayerConfig;
        //
        //             newTheme.waitingRoom = {createTime:event.optData.countdown.createTime, startTime:event.optData.countdown.startTime, timeZone: event.optData.countdown.timezone } ;
        //
        //             if(event.optData.splashscreen != null) {
        //                 for (let i: number = 0; i < event.optData.splashscreen.length; i++) {
        //                     splashScreenURL = event.optData.splashscreen[i].path;
        //                     break;
        //                 }
        //             }
        //
        //             if(splashScreenURL != null){
        //                 newTheme.waitingRoom.posterURL = splashScreenURL;
        //             }
        //         }
        //
        //         if(event.optData.theme == null && newTheme == null)
        //             return;
        //
        //         that.stormPlayer.getPlayerConfigManager().matchConfig(newTheme);
        //
        //         // najpierw musimy się dowiedzieć czy tam miał być autostart w ogóle
        //         let wasAutoStartDefined = false;
        //         let initialAutoStartValue = false;
        //
        //         if(that.stormPlayer.getRawStreamConfig()?.settings?.autoStart != undefined){
        //             wasAutoStartDefined = true;
        //             initialAutoStartValue = that.stormPlayer.getRawStreamConfig().settings.autoStart;
        //         }
        //
        //         if(!wasAutoStartDefined){
        //
        //             if(newTheme.settings != null){
        //                 if(newTheme.settings.autoStart != null){
        //
        //                     if(newTheme.settings.autoStart == true){
        //
        //                         if(!that.stormPlayer.getLibrary().getIfUnmuted())
        //                             that.stormPlayer.getLibrary().mute();
        //
        //                         that.stormPlayer.dispatchEvent("volumeChange", {
        //                             ref: that.stormPlayer,
        //                             mode: "",
        //                             volume: that.stormPlayer.getLibrary().getVolume(),
        //                             muted: that.stormPlayer.getLibrary().isMute(),
        //                             invokedBy: "browser"
        //                         })
        //
        //                         that.stormPlayer.getLibrary().getConfigManager().getSettings().setAutoStart(true);
        //                         that.stormPlayer.getLibrary().getPlaybackController().setCommand("play");
        //
        //                     } else {
        //                         that.stormPlayer.getLibrary().unmute();
        //                     }
        //
        //                 }
        //             }
        //
        //         }
        //
        //         that.stormPlayer.dispatchEvent("playerConfigUpdate", {ref: that.stormPlayer});
        //
        //     }
        //
        // });

        this.playerCore.addEventListener("fullScreenExit", () => {
            this.stormPlayer.dispatchEvent("fullscreenExit",{ref:this.stormPlayer});
        })

        this.playerCore.addEventListener("serverConnectionRestart", function(event){
            that.stormPlayer.dispatchEvent("serverConnectionRestart", {ref:that.stormPlayer, isSilent:event.isSilent})
        }, false)

        this.playerCore.addEventListener("playbackRequest", function(event){
            that.stormPlayer.dispatchEvent("playbackRequest", {ref:that.stormPlayer, streamKey:event.streamKey})
        }, false)

        this.playerCore.addEventListener("playbackForcePause", function(event){
            that.stormPlayer.dispatchEvent("playbackForcePause", {ref:that.stormPlayer})
        }, false)

        this.playerCore.addEventListener("playbackForceMute", function(event){
            that.stormPlayer.dispatchEvent("playbackForceMute", {ref:that.stormPlayer})
        }, false)

        this.playerCore.addEventListener("subscriptionStart", function(event){
            that.stormPlayer.dispatchEvent("subscriptionStart", {ref:that.stormPlayer, streamKey:event.streamKey})
        }, false)

        this.playerCore.addEventListener("subscriptionComplete", function(event){
            that.stormPlayer.dispatchEvent("subscriptionComplete", {ref:that.stormPlayer, streamKey:event.streamKey, sourceList:event.sourceList})
        }, false)

        this.playerCore.addEventListener("subscriptionFailed", function(event){
            that.stormPlayer.dispatchEvent("subscriptionFailed", {ref:that.stormPlayer, streamKey:event.streamKey})
        }, false)

        this.playerCore.addEventListener("playbackStateChange", function(event){
            that.stormPlayer.dispatchEvent("playbackStateChange", {ref:that.stormPlayer, streamKey:event.streamKey, state:event.state})
        }, false)

        this.playerCore.addEventListener("qualityListUpdate", function(event){
            that.stormPlayer.dispatchEvent("qualityListUpdate", {ref:that.stormPlayer, qualityList:event.qualityList})
        }, false)

        this.playerCore.addEventListener("containerChange", function(event){
            that.stormPlayer.dispatchEvent("containerChange", {ref:that.stormPlayer, container:event.container})
        }, false)

        this.playerCore.addEventListener("resizeUpdate", function(event){
            that.stormPlayer.dispatchEvent("resizeUpdate", {ref:that.stormPlayer, width:event.width, height:event.height})
        }, false)

        this.playerCore.addEventListener("sourceDowngrade", function(event){
            that.stormPlayer.dispatchEvent("sourceDowngrade", {ref:that.stormPlayer, bandwidthCap:event.bandwidthCap})
        }, false)

        this.playerCore.addEventListener("videoUnmuted", function(event){
            that.stormPlayer.dispatchEvent("videoUnmuted", {ref:that.stormPlayer})
        }, false)

        this.playerCore.addEventListener("fullScreenEnter", function(event){
            that.stormPlayer.dispatchEvent("fullScreenEnter", {ref:that.stormPlayer})
        }, false)

        this.playerCore.initialize();
        this.stormPlayer.dispatchEvent("coreInitialize",{ref:this.stormPlayer, core:this.playerCore});



    }

    /**
     * Attaches basic events to both the player & the library
     * @private
     */
    private attachListeners(): void {

        const that:CoreManager = this;

        // when gui is ready, let's create an instance of the library
        this.stormPlayer.addEventListener("interfaceReady", function(event){
           that.initializeLibrary();
        });

        // this.stormPlayer.addEventListener("videoElementCreate", function(event){
        //     document.querySelector("#" + that.stormPlayer.getInstanceName()+"_video" + " video").classList.add("sp-video");
        // })


        // library is now ready to register events
        this.stormPlayer.addEventListener("coreInitialize", function () {

            this.isLibraryReady = true;

            // when play is clicked
            that.stormPlayer.addEventListener("playClick", function () {
                that.getPlayerCore().play();
            });

            // when pause is cliked
            that.stormPlayer.addEventListener("pauseClick", function () {
                that.getPlayerCore().pause();
            });

            // when mute is clicked
            that.stormPlayer.addEventListener("muteClick", function () {
                that.getPlayerCore().mute();
            });

            // when mute is clicked again/or unmute button is clicked
            that.stormPlayer.addEventListener("unmuteClick", function () {
                that.getPlayerCore().unmute();
            });

            // when toggle play button is clicked (works as pause/play)
            that.stormPlayer.addEventListener("videoClick", function () {
                that.getPlayerCore().togglePlay();
            });

            // when volume is changed
            that.stormPlayer.addEventListener("volumeSet", function (event) {
                that.getPlayerCore().setVolume(event.volume);
            });

            // when video quality is changed
            that.stormPlayer.addEventListener("qualityChange", function (event) {
                if(that.stormPlayer.getRawPlayerConfig().demoMode != true)
                    that.getPlayerCore().playQualityItem(event.qualityId);
            });

            // when user clicks on progress bar or uses thumb to seek
            // that.stormPlayer.addEventListener("seekSet", function (event) {
            //     that.getLibrary().seek(event.time);
            // });

            // when user enters full-screen mode
            that.stormPlayer.addEventListener("fullscreenEnter", function () {
                that.isFullScreenMode = true;


                if(UserCapabilities.isMobile() && that.stormPlayer.getPlayerConfigManager().getIfNativeMobileGUI()){
                    that.playerCore.getVideoElement().setAttribute("controls","true");
                }

                if(that.resolutionTimeout != null)
                    clearInterval(that.resolutionTimeout);

                // @ts-ignore
                that.resolutionTimeout = setInterval(function(){
                    that.checkResolution();
                },100);

            });

            // when user enters full-screen mode
            that.stormPlayer.addEventListener("fullscreenExit", function () {
                that.isFullScreenMode = false

                if(UserCapabilities.isMobile() && that.stormPlayer.getPlayerConfigManager().getIfNativeMobileGUI())
                    that.playerCore.getVideoElement().removeAttribute("controls");

            });

        });

        this.stormPlayer.addEventListener("playerConfigUpdate", () => {


        });

    }

    /**
     * Returs reference to the Video Element
     */
    public getVideoElement():HTMLVideoElement | null {
        return this.videoElement;
    }

    public checkResolution():void{

        if(this.isFullScreenMode) {

            let newWidth = window.screen.width;
            let newHeight = window.screen.height;

            if(this.currWidth == newWidth && this.currHeight == newHeight){

                if(this.resolutionTimeout != null)
                    clearInterval(this.resolutionTimeout);

                this.getPlayerCore().setSize(window.innerWidth, window.innerHeight);

            } else {

                this.currWidth = newWidth;
                this.currHeight = newHeight;

            }

        }
    }

    public destroy():void{
        if(this.playerCore != null){
            this.playerCore.destroy();
        }
    }

}
