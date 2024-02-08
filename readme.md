# Minecraft Cellular Automaton in Typescript

This project aims to recreate minecraft redstone using cellular automaton.

## Using Website

Below is a link to the website where you can run the cellular automaton.

https://jackrekirby.github.io/minecraft-ca-ts/

### Guide

The guide will automatically appear for first time visitors of the website as well as when the version is bumped. To manually open the guide click the `?` icon at the top right of the website.

## Task List

- [x] Add zoomable and pannable world renderer
- [x] Make tool for layering and rotating textures
- [x] Make texture atlas generator
- [x] Add pistons, redstone block, moveable block
- [x] Add redstone torch
- [x] Make isOutputtingPower directional
- [x] Make placement directional
- [x] Convert all create block function to take state input
- [x] World loading from local storage
- [x] Pull out powerable block interface
- [x] Make generic moveable block function
- [x] Make piston powered texture
- [x] Add redstone lamp
- [x] Piston will not retract if pending block
- [-] Side blocks disappear on complete movement block
- [x] Make saveable state (to file so users can try them out)
- [ ] Test pistons pushing and facing eachother (they replicate infinitely!!!)
- [x] Make blocks classes so they can use prototypes
- [x] Add subticks
- [x] Add chunk system (infinite world)
- [x] Add moveable pistons
- [ ] Make rendering block more efficient (chunking?)
- [x] Make block picker (inventory)
- [ ] Make world selection system
- [ ] Make world snap to grid
- [x] Make minor and major grid lines
- [x] Make world panning have minimum threshold
- [x] Negate the single click select block function on double click delete block
- [x] Cannot just check if block is of moveable type. A moveable type can be temporarily immovable. Must check movement method
- [ ] Reconsider movement method function on block interface
- [x] Save world location and scale
- [-] Auto-position camera at largest mass of blocks?
- [ ] Fix duplicate pistons in double piston extender when powered incorrectly
- [ ] Remove defaults from blocks (maybe have explicit default function)
- [x] Convert blocks to use prototypes to improve efficiency / performance
- [ ] Add touch support
- [ ] Add controller support
- [x] Split index.ts into more files
- [x] Support Full Screen Canvas
- [x] Add basic command line (history, hints, output)
- [ ] Add bitmap font rendering
- [x] Prevent texture bleeding on atlas
- [x] Grid size should be based on pixel width of block, large screens should remain at unit grid size longer
- [-] If updates are faster than the frame rate then do not render (do not wait to render before processing next step)
- [x] Fix panning freeze / jitter
- [x] Make number of allowed subticks unlimited (until all processed)
- [x] Improve user input so place and delete events are easy to distinguish (single vs double click)
- [ ] Add failing state to block movement once subupdate block movement implemented
- [x] Overhaul game loop - render at any time, rendering and logic should not be in same loop
- [x] Overhaul local storage save system (should not be saving multiple times per second)
- [x] History only toggles between two
- [ ] Overhaul command line html/css - list grouping so they both disappear correctly
- [x] Fix overlapping textures by flooring and ceiling together/seperate?
- [x] Add hide command output command
- [ ] Add commands for hiding fields in debug panel
- [x] Put ups and sups in state management
- [x] Fix zoom of browser breaks panning/zooming
- [x] Add powerable block type
- [x] Fix repeater never turning on after being powered if power duration less than repeater delay
- [x] Add 1 tick sticky piston spit out block
- [x] Add non-sticky pistons
- [x] Add redstone dust
- [x] Fix pixel shifting when texture changes when zoomed out
- [x] Fix blocks like lamps should have their state ready when movement complete (quick fix with subtick power processing)
- [ ] Fix command history/hint on click makes command line disappear before execution
- [ ] Improve texture packer to handle different texture sizes
- [x] Design redstone textures and add to atlas
- [x] Add wool blocks
- [x] Add generic user interact function to blocks
- [x] Add ability to pick block with state, not just block type
- [x] Add ability to use pick block command with state, not just block type
- [ ] Add command / structure blocks
- [ ] Add clone command
- [ ] Fix bug with texture packer not waiting for all images to be generated before packing
- [x] Add lever block
- [x] Should block powering occur in subticks
- [x] Enable block pick to support state
- [x] Add drag selection copy paste
- [x] Add button block
- [x] Add force clear of local storage when version bumped
- [x] Blocks should not output power whilst moving (quick fix with subtick power processing)
- [x] Add world download
- [x] Allow blocks to filter states visible to observers
- [x] Add performance metric to debug panel (tps, stps, fps)
- [x] User block placement/deletion/interaction should update blocks on canvas on next frame instead of logic tick
- [x] Paused logical ticks should be remembered on reload and blocks should render on load
- [x] Add falling blocks
- [x] Add clear falling blocks command
- [x] Add comparator block
- [x] Remove unused toString function from blocks
- [x] Investigate performance
- [ ] Investigate object pooling rather than creating new instance
- [x] Build time should update on webpack watch
- [x] Actual FPS/TPS much lower than target (consider overshoot and sleep remaining not elapsed)
- [x] Typing in command window should not trigger keyboard shortcuts
- [x] Observer double pulses when facing piston head
- [x] Observer pulses on incomplete block movement
- [x] Demo world not loading on local storage clear
- [x] Add world update queue rather than updating entire world every tick
- [ ] Center world at 0,0 on load
- [x] Add teleport command
- [x] Add scale command
- [x] Add guide (copy readme into game)
- [ ] Consider new chunk container and iteration for improved performance
- [ ] Save on place/destroy block immediately, otherwise every 30s
- [x] Can tick/subtick processing be increased more (until fps tanks)? Yes
- [x] Add queue length to debug panel
- [x] Command callbacks to change fps/tps not always updating when tps high. Clear overshoot if it exceeds loop period.
- [-] Improve update canvas block performance by not overwriting entire array but just changes.
- [ ] Replace dictionaries with maps, much faster
- [ ] Add slime blocks
- [x] Add target block
- [x] Add obsidian
- [ ] Add random texture rotation
- [x] Add hard and soft power types
- [x] Support texture layers
- [ ] Support rotated textures
- [x] Convert all textures to texture layers that could benefit from it
- [x] Support color blending for redstone signal strength (in-browser available but slow so generate in texture atlas instead)
- [x] Support togglable redstone signal strength
- [x] Add signal strength view limit
- [ ] Reduce idle time - performance worse without updateCanvasBlocks call due to more idle
- [x] Increase signal strength number size
- [ ] Investigate web workers
- [ ] Investigate webgl canvas context
- [x] Fix world not displaying on clear/load when tick rate 0
- [x] Add redstone junction
- [ ] Make solid blocks support signal strength
- [x] Add block with variable comparator output signal
- [x] Stop storage variable initialising themselves on file import
- [x] Make pickblock goto existing slot on inventory if it exists
- [x] Make pickblock not copy state into inventory slot
- [x] Save inventory state in local storage
- [ ] Add block debug tooltip
- [ ] Add signs that make use of tooltip
- [ ] Make moving block a type rather than a feature of all blocks

### webgl canvas

- [ ] Rather than attempting to draw lines just draw a repeating texture
- [ ] Reinitialise context on window resize
- [ ] Make shader programs completely seperate
- [ ] Test if base 2 atlas size is required
