# Minecraft Cellular Automaton in Typescript

This project aims to recreate minecraft redstone using cellular automaton.

## Using Website

Below is a link to the website where you can run the cellular automaton.

https://jackrekirby.github.io/minecraft-ca-ts/

### Guide

### Commands

Use the command window run commands including

- set and step game ticks
- load and delete worlds
- list and pick blocks
- toggle debug and command window visibility

To open the command window click on it on the bottom left corner or press `/`

- Press `tab` to switch between command suggestions
- Press `up` to switch between commands in your history

### Mouse

- Pan around the world map by clicking and dragging the mouse.
- Scale the world map using the mouse scroll wheel.

- `Left click` will place a block if the location is air, otherwise it will pick the block.
- `Right click` will delete a block.

### Keys

- Press `e` to log a block to the console.

## Task List

- [x] Add zoomable and pannable world renderer
- [x] Make tool for layering and rotating textures
- [x] Make texture atlas generator
- [x] Add pistons, redstone block, moveable block
- [x] Add redstone torch
- [x] Make `isOutputtingPower` directional
- [x] Make placement directional
- [x] Convert all create block function to take state input
- [x] World loading from local storage
- [ ] Pull out powerable block interface
- [x] Make generic moveable block function
- [x] Make piston powered texture
- [x] Add redstone lamp
- [x] Piston will not retract if pending block
- [ ] Side blocks disappear on complete movement block
- [x] Make saveable state (to file so users can try them out)
- [x] Test pistons pushing and facing eachother (they replicate infinitely!!!)
- [x] Make blocks classes so they can use prototypes
- [x] Add subticks
- [x] Add chunk system (infinite world)
- [ ] Add moveable pistons
- [ ] Make rendering block more efficient (chunking?)
- [ ] Make block picker
- [ ] Make world selection system
- [ ] Make world snap to grid
- [x] Make minor and major grid lines
- [x] Make world panning have minimum threshold
- [x] Negate the single click select block function on double click delete block
- [ ] Cannot just check if block is of moveable type. A moveable type can be temporarily immovable. Must check movement method
- [ ] Reconsider movement method function on block interface
- [x] Save world location and scale
- [ ] Auto-position camera at largest mass of blocks?
- [ ] Fix duplicate pistons in double piston extender when powered incorrectly
- [ ] Remove defaults from blocks (maybe have explicit default function)
- [x] Convert blocks to use prototypes to improve efficiency / performance
- [ ] Add touch support
- [ ] Add controller support
- [x] Split index.ts into more files
- [x] Support Full Screen Canvas
- [x] Add basic command line (history, hints, output)
- [ ] Add bitmap font rendering
- [ ] Prevent texture bleeding on atlas
- [x] Grid size should be based on pixel width of block, large screens should remain at unit grid size longer
- [ ] If updates are faster than the frame rate then do not render (do not wait to render before processing next step)
- [x] Fix panning freeze / jitter
- [x] Make number of allowed subticks unlimited (until all processed)
- [x] Improve user input so place and delete events are easy to distinguish (single vs double click)
- [ ] Add failing state to block movement once subupdate block movement implemented
- [ ] Overhaul game loop - render at any time, rendering and logic should not be in same loop
- [ ] Overhaul local storage save system (should not be saving multiple times per second)
- [x] History only toggles between two
- [ ] Overhaul command line html/css - list grouping so they both disappear correctly
- [x] Fix overlapping textures by flooring and ceiling together/seperate?
- [x] Add hide command output command
- [ ] Add commands for hiding fields in debug panel
- [x] Put ups and sups in state management
