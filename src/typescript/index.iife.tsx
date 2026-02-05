import "../styles/index.scss";
import {StormPlayerConfig} from "./types/StormPlayerConfig";
import {StormPlayerUI} from "./StormPlayerUI";
import {StormStreamConfig} from "@stormstreaming/player-core";
import StormPlayerCustomElement from "./StormPlayerElement";

export default function(playerConfig:StormPlayerConfig, stormConfig:StormStreamConfig, wait:boolean):StormPlayerUI{
    return new StormPlayerUI(playerConfig, stormConfig, wait);
}

customElements.define("storm-player", StormPlayerCustomElement);