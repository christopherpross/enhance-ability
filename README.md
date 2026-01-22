# enhanceAbility

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/kghelpgekkgankomahhpjcelnhndeinc?label=Chrome%20Web%20Store&style=flat-square&logo=google-chrome)](https://chromewebstore.google.com/detail/enhance-ability-better-a1/kghelpgekkgankomahhpjcelnhndeinc)
[![Firefox Add-on](https://img.shields.io/amo/v/enhanceability?label=Firefox%20Add-on&style=flat-square&logo=firefox)](https://addons.mozilla.org/firefox/addon/enhanceability)

This is a small browser extension I threw together to make D&D Beyond actually usable with a screen reader and keyboard. The name comes from the 2nd-level spell _Enhance Ability_. In D&D, you cast it to give a creature advantage on checks. This extension casts it on _you_, giving you advantage on the Check needed to navigate the app properly!

Ideally, this project shouldn't exist. My dream is for this code to become obsolete because the actual site developers fixed their markup or added these patches directly.

## What it does

The main goal is to stop the site from being a headache to navigate.

- **Status Shortcuts:**
    - For now, we have hp: press `Alt+H` to know your hp from anywhere in the site
    - Press `Alt+Shift+H` to jump standard focus straight to the HP adjustment input box so you can heal or take damage immediately.

- **Table Fixes:**
  The site likes to use divs that look like tables but aren't tables. This script forces correct grid/table semantics onto spell lists, actions, inventory, and extras so your screen reader can actually understand the rows and columns. Instead of having to arrow down through every column, you can now use your table navigation keys to skim a specific column across all your items!

- **Sidebar Accessibility :**
  This is the biggest boost! Normally, if you want to read what a spell or ability actually does, you have to click it, arrow through everything to get to the sidebar (losing your focus), and by the time you're done, you've lost your place in the main list. It's a massive slowdown.

    **enhanceAbility fixes this.** Just Press `Alt+S` to jump straight into the details sidebar when you open something, read what you need, and Press Escape to snap focus instantly back to the exact item you were looking at in the list.

    It finally lets us glance at information. You can pop into the sidebar, check a saving throw DC or damage type, and pop back to the list in a split second without losing your cursor position. It puts us on par with a sighted player who can just look right, then look left.

- **Dice Toolbar:**
  Accessing the custom dice roller is now possible. Proper button roles and labels to the dice menu have been added, so you can actually open it. When you click to open the menu, your focus moves right into the dice setup.

    There is also a shortcut: Press `Alt+R` to open the dice menu instantly from anywhere.

- **Dice Logs:**
  Screen readers always miss the visual popups when you or someone rolls dice, and the log is very inconvenient to navigate, which makes it hard to stay caught up with the action. This adds a log companion that catches every roll and lets you review them without ever losing focus!

    The results of your own rolls are always automatically announced. Previously, the site would actually re-announce the entire visual history every time a new roll happened because of how the ARIA roles were set up. We've removed those properties since we handle the announcements now.

    Press `Alt+[ left bracket` or `Alt+] right bracket` to move through the history of rolls. Use `Alt+P` to toggle "Live Mode" which controls whether new rolls from others that you can see are announced automatically as they happen.

    The visual log itself is a mess to navigate with screen readers and clutters the page because every single line is there near the bottum of the page, so we've turned it into a dialog role. This lets you skip over the whole thing in browse mode if you aren't interested. If you do want to clear it, just use your screen reader to enter the dialog (that is the `Enter` key with NVDA brows mode) and press the clear button.

- **Dropdown Fixes:**
  The site is full of dropdowns that claim to be standard Comboboxes but are actually buttons hiding a list of options. This confuses screen readers into switching to Focus / Forms Mode and often getting you stuck. This has been fixed so that you see an expandable button that opens a list of choices below it.

- **And More!**
  I'm the worst when it comes to keeping feature lists up to date, but this is under active development. At the least, expect tons of new status check keys, shortcuts to jump around, etc.

## Contributions

This is very much a work in progress. D&D Beyond is a massive site with a lot of moving parts, and we're just taking off.

If you find a bug, or have an idea for a feature, please open an issue! Better yet, if you know your way around TypeScript and your browsers inspector and devtools, pull requests are extremely welcome. We still have a lot of parts of the site to tackle!

## License

This project is in the public domain.

I feel very strongly about this. To me, accessibility is a fundemental, like air or water. You don't license the air. Even copyleft licenses, which are well-intentioned and I heavily use in my other projects, imply an ownership structure that I don't think applies here. If this code helps you, take it.
