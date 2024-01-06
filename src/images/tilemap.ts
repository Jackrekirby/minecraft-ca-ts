
      export interface TileInfo {
        x: number
        y: number
        w: number
        h: number
      }

      export const tilemap: { [key: string]: TileInfo } = {
  "glass": {
    "x": 0,
    "y": 0,
    "w": 16,
    "h": 16
  },
  "glass_extension_complete_down": {
    "x": 16,
    "y": 0,
    "w": 16,
    "h": 16
  },
  "glass_extension_complete_left": {
    "x": 32,
    "y": 0,
    "w": 16,
    "h": 16
  },
  "glass_extension_complete_right": {
    "x": 48,
    "y": 0,
    "w": 16,
    "h": 16
  },
  "glass_extension_complete_up": {
    "x": 64,
    "y": 0,
    "w": 16,
    "h": 16
  },
  "glass_extension_pending_down": {
    "x": 80,
    "y": 0,
    "w": 16,
    "h": 16
  },
  "glass_extension_pending_left": {
    "x": 96,
    "y": 0,
    "w": 16,
    "h": 16
  },
  "glass_extension_pending_right": {
    "x": 112,
    "y": 0,
    "w": 16,
    "h": 16
  },
  "glass_extension_pending_up": {
    "x": 128,
    "y": 0,
    "w": 16,
    "h": 16
  },
  "glass_retraction_complete_down": {
    "x": 144,
    "y": 0,
    "w": 16,
    "h": 16
  },
  "glass_retraction_complete_left": {
    "x": 160,
    "y": 0,
    "w": 16,
    "h": 16
  },
  "glass_retraction_complete_right": {
    "x": 176,
    "y": 0,
    "w": 16,
    "h": 16
  },
  "glass_retraction_complete_up": {
    "x": 192,
    "y": 0,
    "w": 16,
    "h": 16
  },
  "glass_retraction_pending_down": {
    "x": 0,
    "y": 16,
    "w": 16,
    "h": 16
  },
  "glass_retraction_pending_left": {
    "x": 16,
    "y": 16,
    "w": 16,
    "h": 16
  },
  "glass_retraction_pending_right": {
    "x": 32,
    "y": 16,
    "w": 16,
    "h": 16
  },
  "glass_retraction_pending_up": {
    "x": 48,
    "y": 16,
    "w": 16,
    "h": 16
  },
  "piston_extended_down": {
    "x": 64,
    "y": 16,
    "w": 16,
    "h": 16
  },
  "piston_extended_left": {
    "x": 80,
    "y": 16,
    "w": 16,
    "h": 16
  },
  "piston_extended_right": {
    "x": 96,
    "y": 16,
    "w": 16,
    "h": 16
  },
  "piston_extended_up": {
    "x": 112,
    "y": 16,
    "w": 16,
    "h": 16
  },
  "piston_head_down": {
    "x": 128,
    "y": 16,
    "w": 16,
    "h": 16
  },
  "piston_head_left": {
    "x": 144,
    "y": 16,
    "w": 16,
    "h": 16
  },
  "piston_head_retracting_down": {
    "x": 160,
    "y": 16,
    "w": 16,
    "h": 16
  },
  "piston_head_retracting_left": {
    "x": 176,
    "y": 16,
    "w": 16,
    "h": 16
  },
  "piston_head_retracting_right": {
    "x": 192,
    "y": 16,
    "w": 16,
    "h": 16
  },
  "piston_head_retracting_up": {
    "x": 0,
    "y": 32,
    "w": 16,
    "h": 16
  },
  "piston_head_right": {
    "x": 16,
    "y": 32,
    "w": 16,
    "h": 16
  },
  "piston_head_up": {
    "x": 32,
    "y": 32,
    "w": 16,
    "h": 16
  },
  "piston_off_down": {
    "x": 48,
    "y": 32,
    "w": 16,
    "h": 16
  },
  "piston_off_down_extension_complete_down": {
    "x": 64,
    "y": 32,
    "w": 16,
    "h": 16
  },
  "piston_off_down_extension_complete_left": {
    "x": 80,
    "y": 32,
    "w": 16,
    "h": 16
  },
  "piston_off_down_extension_complete_right": {
    "x": 96,
    "y": 32,
    "w": 16,
    "h": 16
  },
  "piston_off_down_extension_complete_up": {
    "x": 112,
    "y": 32,
    "w": 16,
    "h": 16
  },
  "piston_off_down_extension_pending_down": {
    "x": 128,
    "y": 32,
    "w": 16,
    "h": 16
  },
  "piston_off_down_extension_pending_left": {
    "x": 144,
    "y": 32,
    "w": 16,
    "h": 16
  },
  "piston_off_down_extension_pending_right": {
    "x": 160,
    "y": 32,
    "w": 16,
    "h": 16
  },
  "piston_off_down_extension_pending_up": {
    "x": 176,
    "y": 32,
    "w": 16,
    "h": 16
  },
  "piston_off_down_retraction_complete_down": {
    "x": 192,
    "y": 32,
    "w": 16,
    "h": 16
  },
  "piston_off_down_retraction_complete_left": {
    "x": 0,
    "y": 48,
    "w": 16,
    "h": 16
  },
  "piston_off_down_retraction_complete_right": {
    "x": 16,
    "y": 48,
    "w": 16,
    "h": 16
  },
  "piston_off_down_retraction_complete_up": {
    "x": 32,
    "y": 48,
    "w": 16,
    "h": 16
  },
  "piston_off_down_retraction_pending_down": {
    "x": 48,
    "y": 48,
    "w": 16,
    "h": 16
  },
  "piston_off_down_retraction_pending_left": {
    "x": 64,
    "y": 48,
    "w": 16,
    "h": 16
  },
  "piston_off_down_retraction_pending_right": {
    "x": 80,
    "y": 48,
    "w": 16,
    "h": 16
  },
  "piston_off_down_retraction_pending_up": {
    "x": 96,
    "y": 48,
    "w": 16,
    "h": 16
  },
  "piston_off_left": {
    "x": 112,
    "y": 48,
    "w": 16,
    "h": 16
  },
  "piston_off_left_extension_complete_down": {
    "x": 128,
    "y": 48,
    "w": 16,
    "h": 16
  },
  "piston_off_left_extension_complete_left": {
    "x": 144,
    "y": 48,
    "w": 16,
    "h": 16
  },
  "piston_off_left_extension_complete_right": {
    "x": 160,
    "y": 48,
    "w": 16,
    "h": 16
  },
  "piston_off_left_extension_complete_up": {
    "x": 176,
    "y": 48,
    "w": 16,
    "h": 16
  },
  "piston_off_left_extension_pending_down": {
    "x": 192,
    "y": 48,
    "w": 16,
    "h": 16
  },
  "piston_off_left_extension_pending_left": {
    "x": 0,
    "y": 64,
    "w": 16,
    "h": 16
  },
  "piston_off_left_extension_pending_right": {
    "x": 16,
    "y": 64,
    "w": 16,
    "h": 16
  },
  "piston_off_left_extension_pending_up": {
    "x": 32,
    "y": 64,
    "w": 16,
    "h": 16
  },
  "piston_off_left_retraction_complete_down": {
    "x": 48,
    "y": 64,
    "w": 16,
    "h": 16
  },
  "piston_off_left_retraction_complete_left": {
    "x": 64,
    "y": 64,
    "w": 16,
    "h": 16
  },
  "piston_off_left_retraction_complete_right": {
    "x": 80,
    "y": 64,
    "w": 16,
    "h": 16
  },
  "piston_off_left_retraction_complete_up": {
    "x": 96,
    "y": 64,
    "w": 16,
    "h": 16
  },
  "piston_off_left_retraction_pending_down": {
    "x": 112,
    "y": 64,
    "w": 16,
    "h": 16
  },
  "piston_off_left_retraction_pending_left": {
    "x": 128,
    "y": 64,
    "w": 16,
    "h": 16
  },
  "piston_off_left_retraction_pending_right": {
    "x": 144,
    "y": 64,
    "w": 16,
    "h": 16
  },
  "piston_off_left_retraction_pending_up": {
    "x": 160,
    "y": 64,
    "w": 16,
    "h": 16
  },
  "piston_off_right": {
    "x": 176,
    "y": 64,
    "w": 16,
    "h": 16
  },
  "piston_off_right_extension_complete_down": {
    "x": 192,
    "y": 64,
    "w": 16,
    "h": 16
  },
  "piston_off_right_extension_complete_left": {
    "x": 0,
    "y": 80,
    "w": 16,
    "h": 16
  },
  "piston_off_right_extension_complete_right": {
    "x": 16,
    "y": 80,
    "w": 16,
    "h": 16
  },
  "piston_off_right_extension_complete_up": {
    "x": 32,
    "y": 80,
    "w": 16,
    "h": 16
  },
  "piston_off_right_extension_pending_down": {
    "x": 48,
    "y": 80,
    "w": 16,
    "h": 16
  },
  "piston_off_right_extension_pending_left": {
    "x": 64,
    "y": 80,
    "w": 16,
    "h": 16
  },
  "piston_off_right_extension_pending_right": {
    "x": 80,
    "y": 80,
    "w": 16,
    "h": 16
  },
  "piston_off_right_extension_pending_up": {
    "x": 96,
    "y": 80,
    "w": 16,
    "h": 16
  },
  "piston_off_right_retraction_complete_down": {
    "x": 112,
    "y": 80,
    "w": 16,
    "h": 16
  },
  "piston_off_right_retraction_complete_left": {
    "x": 128,
    "y": 80,
    "w": 16,
    "h": 16
  },
  "piston_off_right_retraction_complete_right": {
    "x": 144,
    "y": 80,
    "w": 16,
    "h": 16
  },
  "piston_off_right_retraction_complete_up": {
    "x": 160,
    "y": 80,
    "w": 16,
    "h": 16
  },
  "piston_off_right_retraction_pending_down": {
    "x": 176,
    "y": 80,
    "w": 16,
    "h": 16
  },
  "piston_off_right_retraction_pending_left": {
    "x": 192,
    "y": 80,
    "w": 16,
    "h": 16
  },
  "piston_off_right_retraction_pending_right": {
    "x": 0,
    "y": 96,
    "w": 16,
    "h": 16
  },
  "piston_off_right_retraction_pending_up": {
    "x": 16,
    "y": 96,
    "w": 16,
    "h": 16
  },
  "piston_off_up": {
    "x": 32,
    "y": 96,
    "w": 16,
    "h": 16
  },
  "piston_off_up_extension_complete_down": {
    "x": 48,
    "y": 96,
    "w": 16,
    "h": 16
  },
  "piston_off_up_extension_complete_left": {
    "x": 64,
    "y": 96,
    "w": 16,
    "h": 16
  },
  "piston_off_up_extension_complete_right": {
    "x": 80,
    "y": 96,
    "w": 16,
    "h": 16
  },
  "piston_off_up_extension_complete_up": {
    "x": 96,
    "y": 96,
    "w": 16,
    "h": 16
  },
  "piston_off_up_extension_pending_down": {
    "x": 112,
    "y": 96,
    "w": 16,
    "h": 16
  },
  "piston_off_up_extension_pending_left": {
    "x": 128,
    "y": 96,
    "w": 16,
    "h": 16
  },
  "piston_off_up_extension_pending_right": {
    "x": 144,
    "y": 96,
    "w": 16,
    "h": 16
  },
  "piston_off_up_extension_pending_up": {
    "x": 160,
    "y": 96,
    "w": 16,
    "h": 16
  },
  "piston_off_up_retraction_complete_down": {
    "x": 176,
    "y": 96,
    "w": 16,
    "h": 16
  },
  "piston_off_up_retraction_complete_left": {
    "x": 192,
    "y": 96,
    "w": 16,
    "h": 16
  },
  "piston_off_up_retraction_complete_right": {
    "x": 0,
    "y": 112,
    "w": 16,
    "h": 16
  },
  "piston_off_up_retraction_complete_up": {
    "x": 16,
    "y": 112,
    "w": 16,
    "h": 16
  },
  "piston_off_up_retraction_pending_down": {
    "x": 32,
    "y": 112,
    "w": 16,
    "h": 16
  },
  "piston_off_up_retraction_pending_left": {
    "x": 48,
    "y": 112,
    "w": 16,
    "h": 16
  },
  "piston_off_up_retraction_pending_right": {
    "x": 64,
    "y": 112,
    "w": 16,
    "h": 16
  },
  "piston_off_up_retraction_pending_up": {
    "x": 80,
    "y": 112,
    "w": 16,
    "h": 16
  },
  "piston_on_down": {
    "x": 96,
    "y": 112,
    "w": 16,
    "h": 16
  },
  "piston_on_left": {
    "x": 112,
    "y": 112,
    "w": 16,
    "h": 16
  },
  "piston_on_right": {
    "x": 128,
    "y": 112,
    "w": 16,
    "h": 16
  },
  "piston_on_up": {
    "x": 144,
    "y": 112,
    "w": 16,
    "h": 16
  },
  "redstone_block": {
    "x": 160,
    "y": 112,
    "w": 16,
    "h": 16
  },
  "redstone_block_extension_complete_down": {
    "x": 176,
    "y": 112,
    "w": 16,
    "h": 16
  },
  "redstone_block_extension_complete_left": {
    "x": 192,
    "y": 112,
    "w": 16,
    "h": 16
  },
  "redstone_block_extension_complete_right": {
    "x": 0,
    "y": 128,
    "w": 16,
    "h": 16
  },
  "redstone_block_extension_complete_up": {
    "x": 16,
    "y": 128,
    "w": 16,
    "h": 16
  },
  "redstone_block_extension_pending_down": {
    "x": 32,
    "y": 128,
    "w": 16,
    "h": 16
  },
  "redstone_block_extension_pending_left": {
    "x": 48,
    "y": 128,
    "w": 16,
    "h": 16
  },
  "redstone_block_extension_pending_right": {
    "x": 64,
    "y": 128,
    "w": 16,
    "h": 16
  },
  "redstone_block_extension_pending_up": {
    "x": 80,
    "y": 128,
    "w": 16,
    "h": 16
  },
  "redstone_block_retraction_complete_down": {
    "x": 96,
    "y": 128,
    "w": 16,
    "h": 16
  },
  "redstone_block_retraction_complete_left": {
    "x": 112,
    "y": 128,
    "w": 16,
    "h": 16
  },
  "redstone_block_retraction_complete_right": {
    "x": 128,
    "y": 128,
    "w": 16,
    "h": 16
  },
  "redstone_block_retraction_complete_up": {
    "x": 144,
    "y": 128,
    "w": 16,
    "h": 16
  },
  "redstone_block_retraction_pending_down": {
    "x": 160,
    "y": 128,
    "w": 16,
    "h": 16
  },
  "redstone_block_retraction_pending_left": {
    "x": 176,
    "y": 128,
    "w": 16,
    "h": 16
  },
  "redstone_block_retraction_pending_right": {
    "x": 192,
    "y": 128,
    "w": 16,
    "h": 16
  },
  "redstone_block_retraction_pending_up": {
    "x": 0,
    "y": 144,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_off": {
    "x": 16,
    "y": 144,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_off_extension_complete_down": {
    "x": 32,
    "y": 144,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_off_extension_complete_left": {
    "x": 48,
    "y": 144,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_off_extension_complete_right": {
    "x": 64,
    "y": 144,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_off_extension_complete_up": {
    "x": 80,
    "y": 144,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_off_extension_pending_down": {
    "x": 96,
    "y": 144,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_off_extension_pending_left": {
    "x": 112,
    "y": 144,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_off_extension_pending_right": {
    "x": 128,
    "y": 144,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_off_extension_pending_up": {
    "x": 144,
    "y": 144,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_off_retraction_complete_down": {
    "x": 160,
    "y": 144,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_off_retraction_complete_left": {
    "x": 176,
    "y": 144,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_off_retraction_complete_right": {
    "x": 192,
    "y": 144,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_off_retraction_complete_up": {
    "x": 0,
    "y": 160,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_off_retraction_pending_down": {
    "x": 16,
    "y": 160,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_off_retraction_pending_left": {
    "x": 32,
    "y": 160,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_off_retraction_pending_right": {
    "x": 48,
    "y": 160,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_off_retraction_pending_up": {
    "x": 64,
    "y": 160,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_on": {
    "x": 80,
    "y": 160,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_on_extension_complete_down": {
    "x": 96,
    "y": 160,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_on_extension_complete_left": {
    "x": 112,
    "y": 160,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_on_extension_complete_right": {
    "x": 128,
    "y": 160,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_on_extension_complete_up": {
    "x": 144,
    "y": 160,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_on_extension_pending_down": {
    "x": 160,
    "y": 160,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_on_extension_pending_left": {
    "x": 176,
    "y": 160,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_on_extension_pending_right": {
    "x": 192,
    "y": 160,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_on_extension_pending_up": {
    "x": 0,
    "y": 176,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_on_retraction_complete_down": {
    "x": 16,
    "y": 176,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_on_retraction_complete_left": {
    "x": 32,
    "y": 176,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_on_retraction_complete_right": {
    "x": 48,
    "y": 176,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_on_retraction_complete_up": {
    "x": 64,
    "y": 176,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_on_retraction_pending_down": {
    "x": 80,
    "y": 176,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_on_retraction_pending_left": {
    "x": 96,
    "y": 176,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_on_retraction_pending_right": {
    "x": 112,
    "y": 176,
    "w": 16,
    "h": 16
  },
  "redstone_lamp_on_retraction_pending_up": {
    "x": 128,
    "y": 176,
    "w": 16,
    "h": 16
  },
  "redstone_torch_off_down": {
    "x": 144,
    "y": 176,
    "w": 16,
    "h": 16
  },
  "redstone_torch_off_left": {
    "x": 160,
    "y": 176,
    "w": 16,
    "h": 16
  },
  "redstone_torch_off_right": {
    "x": 176,
    "y": 176,
    "w": 16,
    "h": 16
  },
  "redstone_torch_off_up": {
    "x": 192,
    "y": 176,
    "w": 16,
    "h": 16
  },
  "redstone_torch_on_down": {
    "x": 0,
    "y": 192,
    "w": 16,
    "h": 16
  },
  "redstone_torch_on_left": {
    "x": 16,
    "y": 192,
    "w": 16,
    "h": 16
  },
  "redstone_torch_on_right": {
    "x": 32,
    "y": 192,
    "w": 16,
    "h": 16
  },
  "redstone_torch_on_up": {
    "x": 48,
    "y": 192,
    "w": 16,
    "h": 16
  }
};
    