import "../styles/index.scss";
import {StormPlayerUI} from "./StormPlayerUI";
import StormPlayerCustomElement from "./StormPlayerElement";
import {StormPlayerConfig} from "./types/StormPlayerConfig";
import {StormStreamConfig} from "@stormstreaming/player-core";
import {StormLibraryListener} from "@stormstreaming/player-core";
import {StormLibraryEvent} from "@stormstreaming/player-core";
import {StormPlayerEvent} from "./events/StormPlayerEvent";
import {StormPlayerListener} from "./events/StormPlayerListener";
import {StreamMetadata} from "@stormstreaming/player-core";

export type {StormPlayerConfig} from "./types/StormPlayerConfig";
export type {StormStreamConfig} from "@stormstreaming/player-core";
export type {StormPlayerEvent} from "./events/StormPlayerEvent";
export type {StormPlayerListener} from "./events/StormPlayerListener";
export type {StormLibraryListener} from "@stormstreaming/player-core";
export type {StormLibraryEvent} from "@stormstreaming/player-core";
export type {StreamMetadata} from "@stormstreaming/player-core";

export {StormPlayerUI} from "./StormPlayerUI";

export function create(playerConfig:StormPlayerConfig, streamConfig:StormStreamConfig, wait:boolean = false):StormPlayerUI{
    return new StormPlayerUI(playerConfig, streamConfig, wait);
}

customElements.define("storm-player", StormPlayerCustomElement);
