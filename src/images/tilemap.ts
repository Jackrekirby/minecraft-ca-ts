
      export interface TileInfo {
        x: number
        y: number
        w: number
        h: number
      }

      export const tilemap: { [key: string]: TileInfo } = {
  "black_concrete_powder": {
    "x": 1,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "black_wool": {
    "x": 35,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "blue_concrete_powder": {
    "x": 69,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "blue_wool": {
    "x": 103,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "brown_concrete_powder": {
    "x": 137,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "brown_wool": {
    "x": 171,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "button_off": {
    "x": 205,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "button_on": {
    "x": 239,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "cyan_concrete_powder": {
    "x": 273,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "cyan_wool": {
    "x": 307,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "extension_complete_down": {
    "x": 341,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "extension_complete_left": {
    "x": 375,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "extension_complete_right": {
    "x": 409,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "extension_complete_up": {
    "x": 443,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "extension_pending_down": {
    "x": 477,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "extension_pending_left": {
    "x": 511,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "extension_pending_right": {
    "x": 1,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "extension_pending_up": {
    "x": 35,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "fallen": {
    "x": 69,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "falling": {
    "x": 103,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "glass": {
    "x": 137,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "gray_concrete_powder": {
    "x": 171,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "gray_wool": {
    "x": 205,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "green_concrete_powder": {
    "x": 239,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "green_wool": {
    "x": 273,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "lever_off": {
    "x": 307,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "lever_on": {
    "x": 341,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "light_blue_concrete_powder": {
    "x": 375,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "light_blue_wool": {
    "x": 409,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "light_gray_concrete_powder": {
    "x": 443,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "light_gray_wool": {
    "x": 477,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "lime_concrete_powder": {
    "x": 511,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "lime_wool": {
    "x": 1,
    "y": 69,
    "w": 16,
    "h": 16
  },
  "magenta_concrete_powder": {
    "x": 35,
    "y": 69,
    "w": 16,
    "h": 16
  },
  "magenta_wool": {
    "x": 69,
    "y": 69,
    "w": 16,
    "h": 16
  },
  "number_0": {
    "x": 103,
    "y": 69,
    "w": 32,
    "h": 32
  },
  "number_1": {
    "x": 137,
    "y": 69,
    "w": 32,
    "h": 32
  },
  "number_10": {
    "x": 171,
    "y": 69,
    "w": 32,
    "h": 32
  },
  "number_11": {
    "x": 205,
    "y": 69,
    "w": 32,
    "h": 32
  },
  "number_12": {
    "x": 239,
    "y": 69,
    "w": 32,
    "h": 32
  },
  "number_13": {
    "x": 273,
    "y": 69,
    "w": 32,
    "h": 32
  },
  "number_14": {
    "x": 307,
    "y": 69,
    "w": 32,
    "h": 32
  },
  "number_15": {
    "x": 341,
    "y": 69,
    "w": 32,
    "h": 32
  },
  "number_2": {
    "x": 375,
    "y": 69,
    "w": 32,
    "h": 32
  },
  "number_3": {
    "x": 409,
    "y": 69,
    "w": 32,
    "h": 32
  },
  "number_4": {
    "x": 443,
    "y": 69,
    "w": 32,
    "h": 32
  },
  "number_5": {
    "x": 477,
    "y": 69,
    "w": 32,
    "h": 32
  },
  "number_6": {
    "x": 511,
    "y": 69,
    "w": 32,
    "h": 32
  },
  "number_7": {
    "x": 1,
    "y": 103,
    "w": 32,
    "h": 32
  },
  "number_8": {
    "x": 35,
    "y": 103,
    "w": 32,
    "h": 32
  },
  "number_9": {
    "x": 69,
    "y": 103,
    "w": 32,
    "h": 32
  },
  "observer_off_down": {
    "x": 103,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "observer_off_left": {
    "x": 137,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "observer_off_right": {
    "x": 171,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "observer_off_up": {
    "x": 205,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "observer_on_down": {
    "x": 239,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "observer_on_left": {
    "x": 273,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "observer_on_right": {
    "x": 307,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "observer_on_up": {
    "x": 341,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "obsidian": {
    "x": 375,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "orange_concrete_powder": {
    "x": 409,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "orange_wool": {
    "x": 443,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "pink_concrete_powder": {
    "x": 477,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "pink_wool": {
    "x": 511,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "piston_head_down": {
    "x": 1,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_extending_down": {
    "x": 35,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_extending_left": {
    "x": 69,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_extending_right": {
    "x": 103,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_extending_up": {
    "x": 137,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_left": {
    "x": 171,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_retracting_down": {
    "x": 205,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_retracting_left": {
    "x": 239,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_retracting_right": {
    "x": 273,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_retracting_up": {
    "x": 307,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_right": {
    "x": 341,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_up": {
    "x": 375,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_off_down": {
    "x": 409,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_off_extended_down": {
    "x": 443,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_off_extended_left": {
    "x": 477,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_off_extended_right": {
    "x": 511,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_off_extended_up": {
    "x": 1,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "piston_off_left": {
    "x": 35,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "piston_off_right": {
    "x": 69,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "piston_off_up": {
    "x": 103,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "piston_on_down": {
    "x": 137,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "piston_on_left": {
    "x": 171,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "piston_on_right": {
    "x": 205,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "piston_on_up": {
    "x": 239,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "purple_concrete_powder": {
    "x": 273,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "purple_wool": {
    "x": 307,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_block": {
    "x": 341,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_off": {
    "x": 375,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_on": {
    "x": 409,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_right_off": {
    "x": 443,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_right_on": {
    "x": 477,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_off": {
    "x": 511,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_on": {
    "x": 1,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_right_off": {
    "x": 35,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_right_on": {
    "x": 69,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_off": {
    "x": 103,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_on": {
    "x": 137,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_right_off": {
    "x": 171,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_right_on": {
    "x": 205,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_off": {
    "x": 239,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_on": {
    "x": 273,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_right_off": {
    "x": 307,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_right_on": {
    "x": 341,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_off": {
    "x": 375,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_on": {
    "x": 409,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_right_off": {
    "x": 443,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_right_on": {
    "x": 477,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_off": {
    "x": 511,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_on": {
    "x": 1,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_right_off": {
    "x": 35,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_right_on": {
    "x": 69,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_off": {
    "x": 103,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_on": {
    "x": 137,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_right_off": {
    "x": 171,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_right_on": {
    "x": 205,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_off": {
    "x": 239,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_on": {
    "x": 273,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_right_off": {
    "x": 307,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_right_on": {
    "x": 341,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_off": {
    "x": 375,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_on": {
    "x": 409,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_base_down": {
    "x": 443,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_base_left": {
    "x": 477,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_base_right": {
    "x": 511,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_base_up": {
    "x": 1,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_locked_down": {
    "x": 35,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_locked_left": {
    "x": 69,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_locked_right": {
    "x": 103,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_locked_up": {
    "x": 137,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_1_down": {
    "x": 171,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_1_left": {
    "x": 205,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_1_right": {
    "x": 239,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_1_up": {
    "x": 273,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_2_down": {
    "x": 307,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_2_left": {
    "x": 341,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_2_right": {
    "x": 375,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_2_up": {
    "x": 409,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_3_down": {
    "x": 443,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_3_left": {
    "x": 477,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_3_right": {
    "x": 511,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_3_up": {
    "x": 1,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_4_down": {
    "x": 35,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_4_left": {
    "x": 69,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_4_right": {
    "x": 103,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_4_up": {
    "x": 137,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_0_down": {
    "x": 171,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_0_left": {
    "x": 205,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_0_right": {
    "x": 239,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_0_up": {
    "x": 273,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_1_down": {
    "x": 307,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_1_left": {
    "x": 341,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_1_powered_down": {
    "x": 375,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_1_powered_left": {
    "x": 409,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_1_powered_right": {
    "x": 443,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_1_powered_up": {
    "x": 477,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_1_right": {
    "x": 511,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_1_up": {
    "x": 1,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_2_down": {
    "x": 35,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_2_left": {
    "x": 69,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_2_powered_down": {
    "x": 103,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_2_powered_left": {
    "x": 137,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_2_powered_right": {
    "x": 171,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_2_powered_up": {
    "x": 205,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_2_right": {
    "x": 239,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_2_up": {
    "x": 273,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_3_down": {
    "x": 307,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_3_left": {
    "x": 341,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_3_powered_down": {
    "x": 375,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_3_powered_left": {
    "x": 409,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_3_powered_right": {
    "x": 443,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_3_powered_up": {
    "x": 477,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_3_right": {
    "x": 511,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_3_up": {
    "x": 1,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_0_down": {
    "x": 35,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_0_left": {
    "x": 69,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_0_right": {
    "x": 103,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_0_up": {
    "x": 137,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_1_down": {
    "x": 171,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_1_left": {
    "x": 205,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_1_powered_down": {
    "x": 239,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_1_powered_left": {
    "x": 273,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_1_powered_right": {
    "x": 307,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_1_powered_up": {
    "x": 341,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_1_right": {
    "x": 375,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_1_up": {
    "x": 409,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_2_down": {
    "x": 443,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_2_left": {
    "x": 477,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_2_powered_down": {
    "x": 511,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_2_powered_left": {
    "x": 1,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_2_powered_right": {
    "x": 35,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_2_powered_up": {
    "x": 69,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_2_right": {
    "x": 103,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_2_up": {
    "x": 137,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_0_down": {
    "x": 171,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_0_left": {
    "x": 205,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_0_right": {
    "x": 239,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_0_up": {
    "x": 273,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_1_down": {
    "x": 307,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_1_left": {
    "x": 341,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_1_powered_down": {
    "x": 375,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_1_powered_left": {
    "x": 409,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_1_powered_right": {
    "x": 443,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_1_powered_up": {
    "x": 477,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_1_right": {
    "x": 511,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_1_up": {
    "x": 1,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_4_off_0_down": {
    "x": 35,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_4_off_0_left": {
    "x": 69,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_4_off_0_right": {
    "x": 103,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_4_off_0_up": {
    "x": 137,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_torch_off_down": {
    "x": 171,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_torch_off_left": {
    "x": 205,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_torch_off_right": {
    "x": 239,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_torch_off_up": {
    "x": 273,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_torch_on_down": {
    "x": 307,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_torch_on_left": {
    "x": 341,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_torch_on_right": {
    "x": 375,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_torch_on_up": {
    "x": 409,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "red_concrete_powder": {
    "x": 443,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "red_wool": {
    "x": 477,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "retraction_complete_down": {
    "x": 511,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "retraction_complete_left": {
    "x": 1,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "retraction_complete_right": {
    "x": 35,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "retraction_complete_up": {
    "x": 69,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "retraction_pending_down": {
    "x": 103,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "retraction_pending_left": {
    "x": 137,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "retraction_pending_right": {
    "x": 171,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "retraction_pending_up": {
    "x": 205,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_down": {
    "x": 239,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_extending_down": {
    "x": 273,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_extending_left": {
    "x": 307,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_extending_right": {
    "x": 341,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_extending_up": {
    "x": 375,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_left": {
    "x": 409,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_retracting_down": {
    "x": 443,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_retracting_left": {
    "x": 477,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_retracting_right": {
    "x": 511,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_retracting_up": {
    "x": 1,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_right": {
    "x": 35,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_up": {
    "x": 69,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "sticky_piston_off_down": {
    "x": 103,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "sticky_piston_off_extended_down": {
    "x": 137,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "sticky_piston_off_extended_left": {
    "x": 171,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "sticky_piston_off_extended_right": {
    "x": 205,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "sticky_piston_off_extended_up": {
    "x": 239,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "sticky_piston_off_left": {
    "x": 273,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "sticky_piston_off_right": {
    "x": 307,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "sticky_piston_off_up": {
    "x": 341,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "target_block": {
    "x": 375,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "white_concrete_powder": {
    "x": 409,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "white_wool": {
    "x": 443,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "yellow_concrete_powder": {
    "x": 477,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "yellow_wool": {
    "x": 511,
    "y": 511,
    "w": 16,
    "h": 16
  }
};
    