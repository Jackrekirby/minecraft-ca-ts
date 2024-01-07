# Minecraft Cellular Automaton in Typescript

This project aims to recreate minecraft redstone using cellular automaton.

## Using Website

Below is a link to the website where you can run the cellular automaton.

https://jackrekirby.github.io/minecraft-ca-ts/

### Guide

- Control the update speed on the top left input. Default 200ms.
- If the update speed is zero, manually update by clicking the top right input.

- Pan around the world map by clicking and dragging the mouse.
- Scale the world map using the mouse scroll wheel.

- Single click will place a block if the location is air, otherwise it will pick the block.
- Double Click will delete a block.

## Current To Do List

- [x] Make `isOutputtingPower` directional
- [x] Make placement directional
- [x] Convert all create block function to take state input
- [x] World loading from local storage
- [ ] Pull out powerable block interface
- [x] Make generic moveable block function
- [x] Make piston powered texture
- [x] Add redstone lamp
- [x] piston will not retract if pending block
- [ ] side blocks disappear on complete block
- [ ] make saveable state (to file so users can try them out)
- [ ] test pistons pushin eachother
- [ ] make blocks classes so they can use prototypes
- [ ] add subticks
