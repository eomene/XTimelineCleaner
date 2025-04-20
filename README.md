# XTimelineCleaner

A Chrome extension that helps you clean up your Twitter/X timeline by easily adding mute words from predefined categories.

## Features

- Predefined categories of common mute words:
  - Politics
  - Sports
  - Entertainment
  - Technology
- Custom mute word list option
- One-click addition of multiple mute words to your Twitter settings
- Clean, modern UI with easy category switching

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the directory containing this extension
5. The extension icon should now appear in your browser toolbar

## How to Use

1. Navigate to Twitter/X in your browser
2. Click the extension icon in your toolbar
3. Select a category of words you'd like to mute (Politics, Sports, etc.)
4. Uncheck any words in the list you don't want to mute
5. Click "Clean Up Timeline"
6. The extension will automatically:
   - Navigate to your Twitter muted words settings
   - Add all the selected words to your mute list
   - Notify you when the process is complete

For custom words:
1. Select the "Custom" tab
2. Enter your words/phrases, one per line
3. Click "Clean Up Timeline"

## Troubleshooting

- Make sure you're logged in to Twitter/X before using the extension
- If navigation to settings fails, try manually navigating to Twitter settings first
- Some Twitter/X UI updates may affect the extension functionality; please check for updates

## Privacy

This extension:
- Does NOT collect any user data
- Does NOT communicate with external servers
- Only interacts with Twitter/X to add your selected mute words

## License

MIT License

## Note for Development

If you want to contribute or customize the extension:

1. The word lists are defined in `wordLists.js` and gotten from "https://github.com/eomene/XMuteList"
2. The UI is controlled by `popup.js` and `popup.html`
3. Twitter interaction is handled by the injection script in `popup.js` 
