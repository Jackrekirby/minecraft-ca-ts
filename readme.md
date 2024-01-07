# Minecraft Cellular Automaton in Typescript

This project aims to recreate minecraft redstone using cellular automaton.

## Using Website

Below is a link to the website where you can run the cellular automaton.

https://jackrekirby.github.io/minecraft-ca-ts/

### Guide

### Buttons

- `Tick Step` - Manually update the world by one game tick. Use only if `Step Speed (ms)` set to `zero`.

- `Step Speed (ms)` - Control the update speed on the top left input. Default `200ms`.
- `Load Demo` - Load the world demo
- `Clear World` - Clears the world but provides the basic blocks at world origin.

### Mouse

- Pan around the world map by clicking and dragging the mouse.
- Scale the world map using the mouse scroll wheel.

- Single click will place a block if the location is air, otherwise it will pick the block.
- Double Click will delete a block.

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
- [ ] Side blocks disappear on complete block
- [x] Make saveable state (to file so users can try them out)
- [x] Test pistons pushing and facing eachother (they replicate infinitely!!!)
- [ ] Make blocks classes so they can use prototypes
- [ ] Add subticks
- [x] Add chunk system (infinite world)
- [ ] Add moveable pistons
- [ ] Make rendering block more efficient (chunking?)
- [ ] Make block picker
- [ ] Make world selection system
- [ ] Make world snap to grid
- [x] Make minor and major grid lines
- [x] Make world panning have minimum threshold
- [x] Negate the single click select block function on double click delete block
- [ ] cannot just check if block is of moveable type. A moveable type can be temporarily immovable. Must check movement method
- [ ] reconsider movement method function on block interface
- [ ] save world location and scale
- [ ] auto-position camera at largest mass of blocks?
- [ ] duplicate pistons in double piston extender when powered incorrectly
