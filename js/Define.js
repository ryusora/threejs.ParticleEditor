var Define =
{
    // time scale 
    TIME_SCALE: 1,
    // Fog
    FOG_COLOR: 0x33ccff,
    FOG_DISTANE: 650,
    SPECULAR_COLOR: 0x0096ff,

    // MINION FORCE
    GRAVITY_FORCE: -0.1,
    ROLLING_GRAVITY_FORCE: -0.5,
    JUMP_FORCE: 2.25,
    MOVE_FORCE: 1.5,
    MINION_BOUNCE_FORCE: 5.0,

    // MINION STATES
    STATE_RUNNING       : 1<<0,
    STATE_JUMP          : 1<<1,
    STATE_MOVE_LEFT     : 1<<2,
    STATE_MOVE_RIGHT    : 1<<3,
    STATE_HOLE_FALLING  : 1<<4,
    STATE_DEAD          : 1<<5,
    STATE_ROLLING       : 1<<6,

    // Action States
    PAN_LEFT :  1,
    PAN_RIGHT:  2,
    PAN_UP:     3,
    PAN_DOWN:   4,
    // SEGMENT
    VISIBLE_SEGMENT: 35,

    KEYCODE_W: 87,
    KEYCODE_A: 65,
    KEYCODE_D: 68,
    KEYCODE_S: 83,

    KEYCODE_ARROW_UP: 38,
    KEYCODE_ARROW_LEFT: 37,
    KEYCODE_ARROW_RIGHT: 39,
    KEYCODE_ARROW_DOWN: 40,

    INITIAL_SPEED: 1,
    INC_SPEED: 0.08,
    BANANAS_TO_INC_SPEED_BASE: 25,
    MINION_POSITION: 3,
    MINION_SWITCH_LANDE_MS_BASE : 150,
    MINION_JUMP_MS_BASE : 400,
    MINION_BOUNCE_MS_BASE : 600,
    MINION_ROLL_MS_BASE : 750,
    MINION_JUMP_HEIGHT : 20,
    MINION_BOUNCE_HEIGHT : 50,
    MINION_FALL_HEIGHT : 140,
    MINION_MC_BASE_ACCELERATION : 5,
    NORMAL_BOUNDING_OFFSET : 10, 
    BOMB_CART_BOUNDING_OFFSET : 23, 
    
    ROCKET_SCALE: 0.7,
    ELECTRIC_TRAP_SCALE: 0.7,
    ELECTRIC_LANE_SCALE: 1,
    MONITOR_SCALE: 0.4,
    
    SAW_SCALE: 1,

    RUNWAY_MOVE_MS_BASE : 180,
    RUNWAY_SCALE: 0.15,
    RUNWAY_LANE_WIDTH: 125,
    RUNWAY_SEGMENT_LENGTH: 122,

    RUNWAY_MAP_WEIGHT: 50,

    WALL_SEGMENT_WEIGHT: 12,
    WALL_DISTANCE: 70,
    WALL_SCALE: 0.5,
    WALL_REAL_WIDTH: 512,

    BOMB_CART_ACTIVE_SEGMENT: 20,
    BOMB_CART_BASE_MOVE_SPEED_BASE: 2,

    SFX_MOVEMENT_MAX: 10,
    SFX_JUMP_MAX: 6, 
    SFX_RUNNING_MAX:4,
    
    POOL_SIZE:
    {
        'segment': 50,
        'leftwall': 12,
        'rightwall': 12,
        'banana': 300,
        'rocket': 30,
        'standingrocket': 30,
        'bombcart': 30,
        'electrictrap': 30,
        'electriclane': 20,
        'deco': 60,
        'speedup': 30,
        'saw': 10,
        "bounce": 10,
    },
    
    ELECTRIC_TRAP_TYPE: 0,
    MONITOR_TYPE: 1,
    RUNWAY_SEGMENT_TYPE: 2,
    LEFT_WALL_TYPE: 3,
    RIGHT_WALL_TYPE: 4,
    WALL_DECO_TYPE: 5,
    ELECTRIC_LANE_TYPE: 6,
    SPEEDUP_TYPE: 7,
    SAW_TYPE: 8,
    TEMPORARY_TYPE:9,

    HEX_MAP: ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'],

    getWallWidth: function()
    {
        return this.WALL_REAL_WIDTH * this.WALL_SCALE
    },

    getLaneWidth: function()
    {
        return this.RUNWAY_LANE_WIDTH * this.RUNWAY_SCALE
    },

    getSegmentLength: function()
    {
        return this.RUNWAY_SEGMENT_LENGTH * this.RUNWAY_SCALE
    },
    
    getSegmentTimeout: function()
    {
        return this.RUNWAY_MOVE_MS
    },

    getRunwayVelocity: function()
    {
        return this.RUNWAY_VELOCITY
    },

    DECORATION_LIST_LEFT:
    [
        {
            sprite: 'lab',
            frame: '2002',
            height: 20,
            offset: 50,
        },
        {
            sprite: 'lab',
            frame: '2000',
            height: 40,
            offset: 50,
        },
        {
            sprite: 'lab',
            frame: '2003',
            height: 10,
            offset: 50,
        },
        {
            sprite: 'lab',
            frame: '2001',
            height: 30,
            offset: 50,
        },
        {
            sprite: 'lab',
            frame: '200B',
            scale: 0.7 * 0.15,
            height: -10,
            offset: 60,
        },
        {
            sprite: 'lab',
            frame: '2004',
            scale: 1.5 * 0.15,
            height: 0,
            offset: 65,
            angle: - Math.PI / 2,
        },
        {
            sprite: 'lab',
            frame: '200C',
            scale: 0.7 * 0.15,
            height: 30,
            offset: 60,
        },
        {
            sprite: 'lab',
            frame: '200D',
            scale: 0.7 * 0.15,
            height: 60,
            offset: 50,
        },
        {
            sprite: 'lab',
            frame: '2007',
            scale: 1.2 * 0.15,
            height: -18,
            offset: 0,
        },
        {
            sprite: 'lab',
            frame: '2008',
            scale: 1.4 * 0.15,
            height: 80,
            offset: 0,
        },
        {
            sprite: 'lab',
            frame: '200E',
            scale: 0.7 * 0.15,
            height: 80,
            offset: 10,
        },
        {
            sprite: 'lab',
            frame: '200F',
            scale: 0.15,
            height: 70,
            offset: 0,
        },
    ],

    DECORATION_LIST_RIGHT:
    [
        {
            sprite: 'labnew',
            frame: '2000',
            height: 40,
            offset: -50,

        },
        {
            sprite: 'labnew',
            frame: '2001',
            height: 30,
            offset: -50,
        },
        {
            sprite: 'labnew',
            frame: '2002',
            height: 20,
            offset: -50,
        },
        {
            sprite: 'labnew',
            frame: '2003',
            height: 10,
            offset: -50,
        },
        {
            sprite: 'labnew',
            frame: '2004',
            scale: 0.7 * 0.15,
            height: -10,
            offset: -60,
        },
        {
            sprite: 'lab',
            frame: '2004',
            scale: 1.5 * 0.15,
            height: 0,
            offset: -69,
            angle: Math.PI / 2,
        },
        {
            sprite: 'lab',
            frame: '200C',
            scale: 0.7 * 0.15,
            height: 30,
            offset: -60,
        },
        {
            sprite: 'lab',
            frame: '200D',
            scale: 0.7 * 0.15,
            height: 60,
            offset: -50,
        },
        {
            sprite: 'lab',
            frame: '2009',
            scale: 0.8 * 0.15,
            height: 30,
            offset: -69,
        },
    ],

    updateSpeed: function(val)
    {
        this.TIME_SCALE = val
        ///*
        var factor = 1
        this.RUNWAY_MOVE_MS = this.RUNWAY_MOVE_MS_BASE / factor 
        this.RUNWAY_VELOCITY = this.getSegmentLength() / this.RUNWAY_MOVE_MS

        this.MINION_INITIAL_SPEED= factor * this.MINION_INITIAL_SPEED_BASE
        this.MINION_SWITCH_LANDE_MS=  this.MINION_SWITCH_LANDE_MS_BASE / factor
        this.MINION_JUMP_MS= this.MINION_JUMP_MS_BASE / factor
        this.MINION_BOUNCE_MS= this.MINION_BOUNCE_MS_BASE / factor
        this.MINION_ROLL_MS= this.MINION_ROLL_MS_BASE / factor
        this.BOMB_CART_BASE_MOVE_SPEED = this.BOMB_CART_BASE_MOVE_SPEED_BASE * factor
        //*/
    },
}

module.exports = Define
