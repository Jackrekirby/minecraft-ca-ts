
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
  "command_block": {
    "x": 273,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "comparator_add_off_down": {
    "x": 307,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "comparator_add_off_left": {
    "x": 341,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "comparator_add_off_right": {
    "x": 375,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "comparator_add_off_up": {
    "x": 409,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "comparator_add_on_down": {
    "x": 443,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "comparator_add_on_left": {
    "x": 477,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "comparator_add_on_right": {
    "x": 511,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "comparator_add_on_up": {
    "x": 545,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "comparator_base_down": {
    "x": 579,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "comparator_base_left": {
    "x": 613,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "comparator_base_right": {
    "x": 647,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "comparator_base_up": {
    "x": 681,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "comparator_subtract_off_down": {
    "x": 715,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "comparator_subtract_off_left": {
    "x": 749,
    "y": 1,
    "w": 16,
    "h": 16
  },
  "comparator_subtract_off_right": {
    "x": 1,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "comparator_subtract_off_up": {
    "x": 35,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "comparator_subtract_on_down": {
    "x": 69,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "comparator_subtract_on_left": {
    "x": 103,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "comparator_subtract_on_right": {
    "x": 137,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "comparator_subtract_on_up": {
    "x": 171,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "cross": {
    "x": 205,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "cyan_concrete_powder": {
    "x": 239,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "cyan_wool": {
    "x": 273,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "dirt": {
    "x": 307,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "extension_complete_down": {
    "x": 341,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "extension_complete_left": {
    "x": 375,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "extension_complete_right": {
    "x": 409,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "extension_complete_up": {
    "x": 443,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "extension_pending_down": {
    "x": 477,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "extension_pending_left": {
    "x": 511,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "extension_pending_right": {
    "x": 545,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "extension_pending_up": {
    "x": 579,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "fallen": {
    "x": 613,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "falling": {
    "x": 647,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "glass": {
    "x": 681,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "gray_concrete_powder": {
    "x": 715,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "gray_wool": {
    "x": 749,
    "y": 35,
    "w": 16,
    "h": 16
  },
  "green_concrete_powder": {
    "x": 1,
    "y": 69,
    "w": 16,
    "h": 16
  },
  "green_wool": {
    "x": 35,
    "y": 69,
    "w": 16,
    "h": 16
  },
  "junction": {
    "x": 69,
    "y": 69,
    "w": 16,
    "h": 16
  },
  "junction_on_horizontal": {
    "x": 103,
    "y": 69,
    "w": 16,
    "h": 16
  },
  "junction_on_vertical": {
    "x": 137,
    "y": 69,
    "w": 16,
    "h": 16
  },
  "lever_off": {
    "x": 171,
    "y": 69,
    "w": 16,
    "h": 16
  },
  "lever_on": {
    "x": 205,
    "y": 69,
    "w": 16,
    "h": 16
  },
  "light_blue_concrete_powder": {
    "x": 239,
    "y": 69,
    "w": 16,
    "h": 16
  },
  "light_blue_wool": {
    "x": 273,
    "y": 69,
    "w": 16,
    "h": 16
  },
  "light_gray_concrete_powder": {
    "x": 307,
    "y": 69,
    "w": 16,
    "h": 16
  },
  "light_gray_wool": {
    "x": 341,
    "y": 69,
    "w": 16,
    "h": 16
  },
  "lime_concrete_powder": {
    "x": 375,
    "y": 69,
    "w": 16,
    "h": 16
  },
  "lime_wool": {
    "x": 409,
    "y": 69,
    "w": 16,
    "h": 16
  },
  "magenta_concrete_powder": {
    "x": 443,
    "y": 69,
    "w": 16,
    "h": 16
  },
  "magenta_wool": {
    "x": 477,
    "y": 69,
    "w": 16,
    "h": 16
  },
  "number_0": {
    "x": 511,
    "y": 69,
    "w": 32,
    "h": 32
  },
  "number_1": {
    "x": 545,
    "y": 69,
    "w": 32,
    "h": 32
  },
  "number_10": {
    "x": 579,
    "y": 69,
    "w": 32,
    "h": 32
  },
  "number_11": {
    "x": 613,
    "y": 69,
    "w": 32,
    "h": 32
  },
  "number_12": {
    "x": 647,
    "y": 69,
    "w": 32,
    "h": 32
  },
  "number_13": {
    "x": 681,
    "y": 69,
    "w": 32,
    "h": 32
  },
  "number_14": {
    "x": 715,
    "y": 69,
    "w": 32,
    "h": 32
  },
  "number_15": {
    "x": 749,
    "y": 69,
    "w": 32,
    "h": 32
  },
  "number_2": {
    "x": 1,
    "y": 103,
    "w": 32,
    "h": 32
  },
  "number_3": {
    "x": 35,
    "y": 103,
    "w": 32,
    "h": 32
  },
  "number_4": {
    "x": 69,
    "y": 103,
    "w": 32,
    "h": 32
  },
  "number_5": {
    "x": 103,
    "y": 103,
    "w": 32,
    "h": 32
  },
  "number_6": {
    "x": 137,
    "y": 103,
    "w": 32,
    "h": 32
  },
  "number_7": {
    "x": 171,
    "y": 103,
    "w": 32,
    "h": 32
  },
  "number_8": {
    "x": 205,
    "y": 103,
    "w": 32,
    "h": 32
  },
  "number_9": {
    "x": 239,
    "y": 103,
    "w": 32,
    "h": 32
  },
  "oak_leaves": {
    "x": 273,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "oak_log": {
    "x": 307,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "oak_sapling": {
    "x": 341,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "observer_off_down": {
    "x": 375,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "observer_off_left": {
    "x": 409,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "observer_off_right": {
    "x": 443,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "observer_off_up": {
    "x": 477,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "observer_on_down": {
    "x": 511,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "observer_on_left": {
    "x": 545,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "observer_on_right": {
    "x": 579,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "observer_on_up": {
    "x": 613,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "obsidian": {
    "x": 647,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "orange_concrete_powder": {
    "x": 681,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "orange_wool": {
    "x": 715,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "pink_concrete_powder": {
    "x": 749,
    "y": 103,
    "w": 16,
    "h": 16
  },
  "pink_wool": {
    "x": 1,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_down": {
    "x": 35,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_extending_down": {
    "x": 69,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_extending_left": {
    "x": 103,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_extending_right": {
    "x": 137,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_extending_up": {
    "x": 171,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_left": {
    "x": 205,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_retracting_down": {
    "x": 239,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_retracting_left": {
    "x": 273,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_retracting_right": {
    "x": 307,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_retracting_up": {
    "x": 341,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_right": {
    "x": 375,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_head_up": {
    "x": 409,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_off_down": {
    "x": 443,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_off_extended_down": {
    "x": 477,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_off_extended_left": {
    "x": 511,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_off_extended_right": {
    "x": 545,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_off_extended_up": {
    "x": 579,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_off_left": {
    "x": 613,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_off_right": {
    "x": 647,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_off_up": {
    "x": 681,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_on_down": {
    "x": 715,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_on_left": {
    "x": 749,
    "y": 137,
    "w": 16,
    "h": 16
  },
  "piston_on_right": {
    "x": 1,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "piston_on_up": {
    "x": 35,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "purple_concrete_powder": {
    "x": 69,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "purple_wool": {
    "x": 103,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_block": {
    "x": 137,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_cauldron": {
    "x": 171,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_cauldron_on_1": {
    "x": 205,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_cauldron_on_11": {
    "x": 239,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_cauldron_on_13": {
    "x": 273,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_cauldron_on_15": {
    "x": 307,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_cauldron_on_3": {
    "x": 341,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_cauldron_on_5": {
    "x": 375,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_cauldron_on_7": {
    "x": 409,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_cauldron_on_9": {
    "x": 443,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_dust_0": {
    "x": 477,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_dust_1": {
    "x": 511,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_dust_10": {
    "x": 545,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_dust_11": {
    "x": 579,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_dust_12": {
    "x": 613,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_dust_13": {
    "x": 647,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_dust_14": {
    "x": 681,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_dust_15": {
    "x": 715,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_dust_2": {
    "x": 749,
    "y": 171,
    "w": 16,
    "h": 16
  },
  "redstone_dust_3": {
    "x": 1,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_4": {
    "x": 35,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_5": {
    "x": 69,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_6": {
    "x": 103,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_7": {
    "x": 137,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_8": {
    "x": 171,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_9": {
    "x": 205,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_0": {
    "x": 239,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_1": {
    "x": 273,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_10": {
    "x": 307,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_11": {
    "x": 341,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_12": {
    "x": 375,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_13": {
    "x": 409,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_14": {
    "x": 443,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_15": {
    "x": 477,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_2": {
    "x": 511,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_3": {
    "x": 545,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_4": {
    "x": 579,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_5": {
    "x": 613,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_6": {
    "x": 647,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_7": {
    "x": 681,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_8": {
    "x": 715,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_9": {
    "x": 749,
    "y": 205,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_0": {
    "x": 1,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_1": {
    "x": 35,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_10": {
    "x": 69,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_11": {
    "x": 103,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_12": {
    "x": 137,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_13": {
    "x": 171,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_14": {
    "x": 205,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_15": {
    "x": 239,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_2": {
    "x": 273,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_3": {
    "x": 307,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_4": {
    "x": 341,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_5": {
    "x": 375,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_6": {
    "x": 409,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_7": {
    "x": 443,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_8": {
    "x": 477,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_9": {
    "x": 511,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_right_0": {
    "x": 545,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_right_1": {
    "x": 579,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_right_10": {
    "x": 613,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_right_11": {
    "x": 647,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_right_12": {
    "x": 681,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_right_13": {
    "x": 715,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_right_14": {
    "x": 749,
    "y": 239,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_right_15": {
    "x": 1,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_right_2": {
    "x": 35,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_right_3": {
    "x": 69,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_right_4": {
    "x": 103,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_right_5": {
    "x": 137,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_right_6": {
    "x": 171,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_right_7": {
    "x": 205,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_right_8": {
    "x": 239,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_left_right_9": {
    "x": 273,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_right_0": {
    "x": 307,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_right_1": {
    "x": 341,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_right_10": {
    "x": 375,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_right_11": {
    "x": 409,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_right_12": {
    "x": 443,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_right_13": {
    "x": 477,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_right_14": {
    "x": 511,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_right_15": {
    "x": 545,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_right_2": {
    "x": 579,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_right_3": {
    "x": 613,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_right_4": {
    "x": 647,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_right_5": {
    "x": 681,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_right_6": {
    "x": 715,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_right_7": {
    "x": 749,
    "y": 273,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_right_8": {
    "x": 1,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_down_right_9": {
    "x": 35,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_0": {
    "x": 69,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_1": {
    "x": 103,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_10": {
    "x": 137,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_11": {
    "x": 171,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_12": {
    "x": 205,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_13": {
    "x": 239,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_14": {
    "x": 273,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_15": {
    "x": 307,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_2": {
    "x": 341,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_3": {
    "x": 375,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_4": {
    "x": 409,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_5": {
    "x": 443,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_6": {
    "x": 477,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_7": {
    "x": 511,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_8": {
    "x": 545,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_9": {
    "x": 579,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_right_0": {
    "x": 613,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_right_1": {
    "x": 647,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_right_10": {
    "x": 681,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_right_11": {
    "x": 715,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_right_12": {
    "x": 749,
    "y": 307,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_right_13": {
    "x": 1,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_right_14": {
    "x": 35,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_right_15": {
    "x": 69,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_right_2": {
    "x": 103,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_right_3": {
    "x": 137,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_right_4": {
    "x": 171,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_right_5": {
    "x": 205,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_right_6": {
    "x": 239,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_right_7": {
    "x": 273,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_right_8": {
    "x": 307,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_left_right_9": {
    "x": 341,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_right_0": {
    "x": 375,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_right_1": {
    "x": 409,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_right_10": {
    "x": 443,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_right_11": {
    "x": 477,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_right_12": {
    "x": 511,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_right_13": {
    "x": 545,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_right_14": {
    "x": 579,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_right_15": {
    "x": 613,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_right_2": {
    "x": 647,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_right_3": {
    "x": 681,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_right_4": {
    "x": 715,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_right_5": {
    "x": 749,
    "y": 341,
    "w": 16,
    "h": 16
  },
  "redstone_dust_right_6": {
    "x": 1,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_right_7": {
    "x": 35,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_right_8": {
    "x": 69,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_right_9": {
    "x": 103,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_0": {
    "x": 137,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_1": {
    "x": 171,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_10": {
    "x": 205,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_11": {
    "x": 239,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_12": {
    "x": 273,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_13": {
    "x": 307,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_14": {
    "x": 341,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_15": {
    "x": 375,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_2": {
    "x": 409,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_3": {
    "x": 443,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_4": {
    "x": 477,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_5": {
    "x": 511,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_6": {
    "x": 545,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_7": {
    "x": 579,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_8": {
    "x": 613,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_9": {
    "x": 647,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_0": {
    "x": 681,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_1": {
    "x": 715,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_10": {
    "x": 749,
    "y": 375,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_11": {
    "x": 1,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_12": {
    "x": 35,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_13": {
    "x": 69,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_14": {
    "x": 103,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_15": {
    "x": 137,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_2": {
    "x": 171,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_3": {
    "x": 205,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_4": {
    "x": 239,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_5": {
    "x": 273,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_6": {
    "x": 307,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_7": {
    "x": 341,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_8": {
    "x": 375,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_9": {
    "x": 409,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_0": {
    "x": 443,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_1": {
    "x": 477,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_10": {
    "x": 511,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_11": {
    "x": 545,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_12": {
    "x": 579,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_13": {
    "x": 613,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_14": {
    "x": 647,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_15": {
    "x": 681,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_2": {
    "x": 715,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_3": {
    "x": 749,
    "y": 409,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_4": {
    "x": 1,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_5": {
    "x": 35,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_6": {
    "x": 69,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_7": {
    "x": 103,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_8": {
    "x": 137,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_9": {
    "x": 171,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_right_0": {
    "x": 205,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_right_1": {
    "x": 239,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_right_10": {
    "x": 273,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_right_11": {
    "x": 307,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_right_12": {
    "x": 341,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_right_13": {
    "x": 375,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_right_14": {
    "x": 409,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_right_15": {
    "x": 443,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_right_2": {
    "x": 477,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_right_3": {
    "x": 511,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_right_4": {
    "x": 545,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_right_5": {
    "x": 579,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_right_6": {
    "x": 613,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_right_7": {
    "x": 647,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_right_8": {
    "x": 681,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_left_right_9": {
    "x": 715,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_right_0": {
    "x": 749,
    "y": 443,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_right_1": {
    "x": 1,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_right_10": {
    "x": 35,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_right_11": {
    "x": 69,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_right_12": {
    "x": 103,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_right_13": {
    "x": 137,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_right_14": {
    "x": 171,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_right_15": {
    "x": 205,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_right_2": {
    "x": 239,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_right_3": {
    "x": 273,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_right_4": {
    "x": 307,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_right_5": {
    "x": 341,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_right_6": {
    "x": 375,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_right_7": {
    "x": 409,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_right_8": {
    "x": 443,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_down_right_9": {
    "x": 477,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_0": {
    "x": 511,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_1": {
    "x": 545,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_10": {
    "x": 579,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_11": {
    "x": 613,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_12": {
    "x": 647,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_13": {
    "x": 681,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_14": {
    "x": 715,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_15": {
    "x": 749,
    "y": 477,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_2": {
    "x": 1,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_3": {
    "x": 35,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_4": {
    "x": 69,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_5": {
    "x": 103,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_6": {
    "x": 137,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_7": {
    "x": 171,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_8": {
    "x": 205,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_9": {
    "x": 239,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_right_0": {
    "x": 273,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_right_1": {
    "x": 307,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_right_10": {
    "x": 341,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_right_11": {
    "x": 375,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_right_12": {
    "x": 409,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_right_13": {
    "x": 443,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_right_14": {
    "x": 477,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_right_15": {
    "x": 511,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_right_2": {
    "x": 545,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_right_3": {
    "x": 579,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_right_4": {
    "x": 613,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_right_5": {
    "x": 647,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_right_6": {
    "x": 681,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_right_7": {
    "x": 715,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_right_8": {
    "x": 749,
    "y": 511,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_left_right_9": {
    "x": 1,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_right_0": {
    "x": 35,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_right_1": {
    "x": 69,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_right_10": {
    "x": 103,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_right_11": {
    "x": 137,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_right_12": {
    "x": 171,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_right_13": {
    "x": 205,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_right_14": {
    "x": 239,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_right_15": {
    "x": 273,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_right_2": {
    "x": 307,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_right_3": {
    "x": 341,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_right_4": {
    "x": 375,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_right_5": {
    "x": 409,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_right_6": {
    "x": 443,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_right_7": {
    "x": 477,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_right_8": {
    "x": 511,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_dust_up_right_9": {
    "x": 545,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_off": {
    "x": 579,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_on": {
    "x": 613,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_base_down": {
    "x": 647,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_base_left": {
    "x": 681,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_base_right": {
    "x": 715,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_base_up": {
    "x": 749,
    "y": 545,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_locked_down": {
    "x": 1,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_locked_left": {
    "x": 35,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_locked_right": {
    "x": 69,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_locked_up": {
    "x": 103,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_1_down": {
    "x": 137,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_1_left": {
    "x": 171,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_1_right": {
    "x": 205,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_1_up": {
    "x": 239,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_2_down": {
    "x": 273,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_2_left": {
    "x": 307,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_2_right": {
    "x": 341,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_2_up": {
    "x": 375,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_3_down": {
    "x": 409,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_3_left": {
    "x": 443,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_3_right": {
    "x": 477,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_3_up": {
    "x": 511,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_4_down": {
    "x": 545,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_4_left": {
    "x": 579,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_4_right": {
    "x": 613,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_0_off_4_up": {
    "x": 647,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_0_down": {
    "x": 681,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_0_left": {
    "x": 715,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_0_right": {
    "x": 749,
    "y": 579,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_0_up": {
    "x": 1,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_1_down": {
    "x": 35,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_1_left": {
    "x": 69,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_1_powered_down": {
    "x": 103,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_1_powered_left": {
    "x": 137,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_1_powered_right": {
    "x": 171,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_1_powered_up": {
    "x": 205,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_1_right": {
    "x": 239,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_1_up": {
    "x": 273,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_2_down": {
    "x": 307,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_2_left": {
    "x": 341,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_2_powered_down": {
    "x": 375,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_2_powered_left": {
    "x": 409,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_2_powered_right": {
    "x": 443,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_2_powered_up": {
    "x": 477,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_2_right": {
    "x": 511,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_2_up": {
    "x": 545,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_3_down": {
    "x": 579,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_3_left": {
    "x": 613,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_3_powered_down": {
    "x": 647,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_3_powered_left": {
    "x": 681,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_3_powered_right": {
    "x": 715,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_3_powered_up": {
    "x": 749,
    "y": 613,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_3_right": {
    "x": 1,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_1_off_3_up": {
    "x": 35,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_0_down": {
    "x": 69,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_0_left": {
    "x": 103,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_0_right": {
    "x": 137,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_0_up": {
    "x": 171,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_1_down": {
    "x": 205,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_1_left": {
    "x": 239,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_1_powered_down": {
    "x": 273,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_1_powered_left": {
    "x": 307,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_1_powered_right": {
    "x": 341,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_1_powered_up": {
    "x": 375,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_1_right": {
    "x": 409,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_1_up": {
    "x": 443,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_2_down": {
    "x": 477,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_2_left": {
    "x": 511,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_2_powered_down": {
    "x": 545,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_2_powered_left": {
    "x": 579,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_2_powered_right": {
    "x": 613,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_2_powered_up": {
    "x": 647,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_2_right": {
    "x": 681,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_2_off_2_up": {
    "x": 715,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_0_down": {
    "x": 749,
    "y": 647,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_0_left": {
    "x": 1,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_0_right": {
    "x": 35,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_0_up": {
    "x": 69,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_1_down": {
    "x": 103,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_1_left": {
    "x": 137,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_1_powered_down": {
    "x": 171,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_1_powered_left": {
    "x": 205,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_1_powered_right": {
    "x": 239,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_1_powered_up": {
    "x": 273,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_1_right": {
    "x": 307,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_3_off_1_up": {
    "x": 341,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_4_off_0_down": {
    "x": 375,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_4_off_0_left": {
    "x": 409,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_4_off_0_right": {
    "x": 443,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "redstone_repeater_on_4_off_0_up": {
    "x": 477,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "redstone_torch_off_down": {
    "x": 511,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "redstone_torch_off_left": {
    "x": 545,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "redstone_torch_off_right": {
    "x": 579,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "redstone_torch_off_up": {
    "x": 613,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "redstone_torch_on_down": {
    "x": 647,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "redstone_torch_on_left": {
    "x": 681,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "redstone_torch_on_right": {
    "x": 715,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "redstone_torch_on_up": {
    "x": 749,
    "y": 681,
    "w": 16,
    "h": 16
  },
  "red_concrete_powder": {
    "x": 1,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "red_wool": {
    "x": 35,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "retraction_complete_down": {
    "x": 69,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "retraction_complete_left": {
    "x": 103,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "retraction_complete_right": {
    "x": 137,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "retraction_complete_up": {
    "x": 171,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "retraction_pending_down": {
    "x": 205,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "retraction_pending_left": {
    "x": 239,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "retraction_pending_right": {
    "x": 273,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "retraction_pending_up": {
    "x": 307,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "sign": {
    "x": 341,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_down": {
    "x": 375,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_extending_down": {
    "x": 409,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_extending_left": {
    "x": 443,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_extending_right": {
    "x": 477,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_extending_up": {
    "x": 511,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_left": {
    "x": 545,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_retracting_down": {
    "x": 579,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_retracting_left": {
    "x": 613,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_retracting_right": {
    "x": 647,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_retracting_up": {
    "x": 681,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_right": {
    "x": 715,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "sticky_piston_head_up": {
    "x": 749,
    "y": 715,
    "w": 16,
    "h": 16
  },
  "sticky_piston_off_down": {
    "x": 1,
    "y": 749,
    "w": 16,
    "h": 16
  },
  "sticky_piston_off_extended_down": {
    "x": 35,
    "y": 749,
    "w": 16,
    "h": 16
  },
  "sticky_piston_off_extended_left": {
    "x": 69,
    "y": 749,
    "w": 16,
    "h": 16
  },
  "sticky_piston_off_extended_right": {
    "x": 103,
    "y": 749,
    "w": 16,
    "h": 16
  },
  "sticky_piston_off_extended_up": {
    "x": 137,
    "y": 749,
    "w": 16,
    "h": 16
  },
  "sticky_piston_off_left": {
    "x": 171,
    "y": 749,
    "w": 16,
    "h": 16
  },
  "sticky_piston_off_right": {
    "x": 205,
    "y": 749,
    "w": 16,
    "h": 16
  },
  "sticky_piston_off_up": {
    "x": 239,
    "y": 749,
    "w": 16,
    "h": 16
  },
  "target_block": {
    "x": 273,
    "y": 749,
    "w": 16,
    "h": 16
  },
  "white_concrete_powder": {
    "x": 307,
    "y": 749,
    "w": 16,
    "h": 16
  },
  "white_wool": {
    "x": 341,
    "y": 749,
    "w": 16,
    "h": 16
  },
  "yellow_concrete_powder": {
    "x": 375,
    "y": 749,
    "w": 16,
    "h": 16
  },
  "yellow_wool": {
    "x": 409,
    "y": 749,
    "w": 16,
    "h": 16
  }
};
    