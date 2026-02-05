# StormPlayer UI

Full-featured video player with customizable UI for [Storm Streaming Server](https://stormstreaming.com) & Cloud. Ready-to-use component with controls, progress bar, quality selector, and more.

Built on top of [@stormstreaming/player-core](https://github.com/StormStreaming/player-core-js). For headless implementation without UI, use player-core directly.

## Installation

```bash
npm install @stormstreaming/player-ui
```

Also available: [yarn](https://yarnpkg.com/package/@stormstreaming/player-ui) | [CDN](https://cdn.stormstreaming.com/player-ui/latest/umd/index.js)

## Quick Start

```javascript
import { StormPlayer } from "@stormstreaming/player-ui";

const player = new StormPlayer(
  // Player config (UI)
  {
    containerID: "player-container",
    aspectRatio: "16:9",
    width: "100%",
    title: "Live Stream",
    subtitle: "Welcome!"
  },
  // Stream config (Core)
  {
    stream: {
      serverList: [
        { host: "your-server.com", application: "live", port: 443, ssl: true }
      ],
      streamKey: "your-stream"
    },
    settings: {
      autoStart: true
    }
  }
);
```

```html
<div id="player-container"></div>
```

## Module Formats

Available as **ESM**, **UMD**, **AMD**,  and **CJS**. TypeScript definitions included.

## Features

- Play/pause, volume, mute controls
- Fullscreen support
- Quality selector (ABR)
- Progress bar with DVR/seek support
- Customizable title & subtitle
- CUE points on timeline
- Responsive design
- Customizable colors

## Accessing Core API

```javascript
// Get underlying StormPlayerCore instance
const core = player.getPlayerCore();

// Use any core method
core.subscribe("another-stream", true);
core.setVolume(50);
```

## Documentation

- [Configuration](https://docs.stormstreaming.com/player-ui/configuration)
- [API Reference](https://docs.stormstreaming.com/player-ui/api)
- [Events](https://docs.stormstreaming.com/player-ui/events)
- [Customization](https://docs.stormstreaming.com/player-ui/customization)

## Browser Support

Chrome 31+ · Firefox 42+ · Safari 13+ · Edge 12+ · Opera 15+

Legacy browsers fall back to HLS mode.

## Related Packages

| Package | Description |
|---------|-------------|
| [@stormstreaming/player-core](https://github.com/StormStreaming/player-core-js) | Headless playback engine |
| [@stormstreaming/player-react](https://github.com/StormStreaming/player-react-js) | React wrapper |

## License

See [LICENSE](LICENSE.txt)