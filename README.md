# Multiwatch

A basic web app to watch multiple youtube videos/live streams concurrently.

Features include but will not be limited to:
- Settings (for youtube embed parameters) autoplay, fullscreen, privacy enhanced, related videos panel etc.
- Export settings and layout as a json file.
- Import settings and layout from a json file.
- Customize grid width and height.
- Reset if you mess up.
- Share your layout with the current link.
- Copy to clipboard functionality for link sharing.


### Changelog

#### 10.10.2023
- Action buttons have icons with emojis
- Rows, columns and actions now have labels.
- Rows, columns and actions are hidden in a collapse panel and will be shown with show/hide controls buttton.
- Video close button is now disabled until video hovered and changed its icon with an emoji.
- Added url query parameters to set videos and settings.
- Added copy to clipboard functionality for link sharing.
- Added credits section.
- Exporting now asks for a filename.
- Added copy url of an existing video button.

### TODO
- [ ] Video queue. Will allow to add videos to a queue and play them one after another for each cell.
- [ ] A search bar to search for videos directly from youtube and add them to the grid.
- [ ] More platforms like twitch, vimeo, dailymotion etc.
- [ ] Drag and drop to rearrange videos.
- [ ] Mute, unmute, pause and play controls for every video at once.