// --- GAME MAKER: v10.17 (Pop-up UI & Steve Doll) ---
// --- 1. Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// --- 2. World Configuration ---
const TILE_SIZE = 20;
const CHUNK_SIZE = 16;
const SPRITE_SIZE = 16;

const TILES = {
    AIR: 0, GRASS: 1, DIRT: 2, STONE: 3, IRON: 4, COPPER: 5, DIAMOND: 6, COBALT: 7,
    PLATINUM: 8, WOOD_LOG: 9, LEAVES: 10, WOOD_PLANK: 11, CRAFTING_TABLE: 12, STICK: 13,
    COAL: 14, FURNACE: 15, TORCH: 16, SLIME_GEL: 17, USSR_BOOK: 18,
    // Pickaxes
    WOOD_PICKAXE: 100, STONE_PICKAXE: 101, COPPER_PICKAXE: 102, IRON_PICKAXE: 103,
    DIAMOND_PICKAXE: 104, COBALT_PICKAXE: 105, PLATINUM_PICKAXE: 106,
    // Ingots
    COPPER_INGOT: 107, IRON_INGOT: 108, DIAMOND_INGOT: 109, COBALT_INGOT: 110,
    PLATINUM_INGOT: 111,
    // Swords
    WOOD_SWORD: 1000, STONE_SWORD: 1001, COPPER_SWORD: 1002, IRON_SWORD: 1003,
    DIAMOND_SWORD: 1004, COBALT_SWORD: 1005, PLATINUM_SWORD: 1006
    // Armor items will be added later
};
const TILE_NAMES = {
    [TILES.GRASS]: 'Grass', [TILES.DIRT]: 'Dirt', [TILES.STONE]: 'Stone', [TILES.IRON]: 'Iron Ore',
    [TILES.COPPER]: 'Copper Ore', [TILES.DIAMOND]: 'Diamond Ore', [TILES.COBALT]: 'Cobalt Ore',
    [TILES.PLATINUM]: 'Platinum Ore', [TILES.WOOD_LOG]: 'Wood Log', [TILES.LEAVES]: 'Leaves',
    [TILES.WOOD_PLANK]: 'Wood Plank', [TILES.CRAFTING_TABLE]: 'Crafting Table', [TILES.STICK]: 'Stick',
    [TILES.COAL]: 'Coal', [TILES.FURNACE]: 'Furnace', [TILES.TORCH]: 'Torch', [TILES.SLIME_GEL]: 'Slime Gel',
    [TILES.USSR_BOOK]: 'Book: USSR',
    [TILES.WOOD_PICKAXE]: 'Wood Pickaxe', [TILES.STONE_PICKAXE]: 'Stone Pickaxe',
    [TILES.COPPER_PICKAXE]: 'Copper Pickaxe', [TILES.IRON_PICKAXE]: 'Iron Pickaxe',
    [TILES.DIAMOND_PICKAXE]: 'Diamond Pickaxe', [TILES.COBALT_PICKAXE]: 'Cobalt Pickaxe',
    [TILES.PLATINUM_PICKAXE]: 'Platinum Pickaxe',
    [TILES.COPPER_INGOT]: 'Copper Ingot', [TILES.IRON_INGOT]: 'Iron Ingot',
    [TILES.DIAMOND_INGOT]: 'Diamond', [TILES.COBALT_INGOT]: 'Cobalt Ingot',
    [TILES.PLATINUM_INGOT]: 'Platinum Ingot',
    [TILES.WOOD_SWORD]: 'Wood Sword', [TILES.STONE_SWORD]: 'Stone Sword',
    [TILES.COPPER_SWORD]: 'Copper Sword', [TILES.IRON_SWORD]: 'Iron Sword',
    [TILES.DIAMOND_SWORD]: 'Diamond Sword', [TILES.COBALT_SWORD]: 'Cobalt Sword',
    [TILES.PLATINUM_SWORD]: 'Platinum Sword'
};
const TILE_COLORS = {
    [TILES.AIR]: '#87CEEB', [TILES.GRASS]: '#34A853', [TILES.DIRT]: '#8B4513',
    [TILES.STONE]: '#808080', [TILES.IRON]: '#D2B48C', [TILES.COPPER]: '#B87333',
    [TILES.DIAMOND]: '#B9F2FF', [TILES.COBALT]: '#0047AB', [TILES.PLATINUM]: '#E5E4E2',
    [TILES.WOOD_LOG]: '#663300', [TILES.LEAVES]: '#006400', [TILES.WOOD_PLANK]: '#AF8F53',
    [TILES.CRAFTING_TABLE]: '#A07040', [TILES.STICK]: '#8B4513', [TILES.COAL]: '#2E2E2E',
    [TILES.FURNACE]: '#505050', [TILES.TORCH]: '#FFA500', [TILES.SLIME_GEL]: '#00BFFF',
    [TILES.USSR_BOOK]: '#CC0000',
    [TILES.WOOD_PICKAXE]: '#AF8F53', [TILES.STONE_PICKAXE]: '#808080', [TILES.COPPER_PICKAXE]: '#B87333',
    [TILES.IRON_PICKAXE]: '#D2B4D2', [TILES.DIAMOND_PICKAXE]: '#B9F2FF', [TILES.COBALT_PICKAXE]: '#0047AB',
    [TILES.PLATINUM_PICKAXE]: '#E5E4E2',
    [TILES.COPPER_INGOT]: '#B87333', [TILES.IRON_INGOT]: '#D2B4D2',
    [TILES.DIAMOND_INGOT]: '#B9F2FF', [TILES.COBALT_INGOT]: '#0047AB',
    [TILES.PLATINUM_INGOT]: '#E5E4E2',
    [TILES.WOOD_SWORD]: '#AF8F53', [TILES.STONE_SWORD]: '#808080', [TILES.COPPER_SWORD]: '#B87333',
    [TILES.IRON_SWORD]: '#D2B4D2', [TILES.DIAMOND_SWORD]: '#B9F2FF', [TILES.COBALT_SWORD]: '#0047AB',
    [TILES.PLATINUM_SWORD]: '#E5E4E2'
};

const TILE_SPRITES = {
    [TILES.STONE]: [0, 0],
    [TILES.WOOD_PLANK]: [1, 0],
    [TILES.CRAFTING_TABLE]: [2, 0],
    [TILES.FURNACE]: [3, 0],
    [TILES.COAL]: [4, 0],
    [TILES.TORCH]: [5, 0],
    [TILES.DIRT]: [6, 0],
    [TILES.IRON]: [7, 0],
    [TILES.COPPER]: [8, 0],
    [TILES.DIAMOND]: [9, 0],
    [TILES.COBALT]: [10, 0],
    [TILES.PLATINUM]: [11, 0],
    [TILES.WOOD_LOG]: [12, 0],
    [TILES.LEAVES]: [13, 0],
    [TILES.GRASS]: [14, 0],
    
    [TILES.STICK]: [0, 1],
    [TILES.WOOD_PICKAXE]: [1, 1],
    [TILES.STONE_PICKAXE]: [2, 1],
    [TILES.COPPER_PICKAXE]: [3, 1],
    [TILES.IRON_PICKAXE]: [4, 1],
    [TILES.DIAMOND_PICKAXE]: [5, 1],
    [TILES.COBALT_PICKAXE]: [6, 1],
    [TILES.PLATINUM_PICKAXE]: [7, 1],
    
    [TILES.COPPER_INGOT]: [0, 2],
    [TILES.IRON_INGOT]: [1, 2],
    [TILES.DIAMOND_INGOT]: [2, 2],
    [TILES.COBALT_INGOT]: [3, 2],
    [TILES.PLATINUM_INGOT]: [4, 2],
    [TILES.SLIME_GEL]: [5, 2],
    [TILES.USSR_BOOK]: [6, 2],

    [TILES.WOOD_SWORD]: [0, 3],
    [TILES.STONE_SWORD]: [1, 3],
    [TILES.COPPER_SWORD]: [2, 3],
    [TILES.IRON_SWORD]: [3, 3],
    [TILES.DIAMOND_SWORD]: [4, 3],
    [TILES.COBALT_SWORD]: [5, 3],
    [TILES.PLATINUM_SWORD]: [6, 3]
};

const BLOCK_OPACITY = {
    [TILES.AIR]: 1,
    [TILES.LEAVES]: 2,
    [TILES.TORCH]: 1,
    [TILES.GRASS]: 16, [TILES.DIRT]: 16, [TILES.STONE]: 16, [TILES.IRON]: 16,
    [TILES.COPPER]: 16, [TILES.DIAMOND]: 16, [TILES.COBALT]: 16, [TILES.PLATINUM]: 16,
    [TILES.WOOD_LOG]: 16, [TILES.WOOD_PLANK]: 16, [TILES.CRAFTING_TABLE]: 16,
    [TILES.COAL]: 16, [TILES.FURNACE]: 16
};
function getBlockOpacity(tileId) {
    return BLOCK_OPACITY[tileId] ?? 16;
}
function isBlockSolid(tileId) {
    return getBlockOpacity(tileId) >= 16;
}

const MAX_STACK = 64;
const BLOCK_TIER = {
    [TILES.DIRT]: 0, [TILES.GRASS]: 0, [TILES.WOOD_LOG]: 0, [TILES.LEAVES]: 0,
    [TILES.STONE]: 1, [TILES.COAL]: 1, [TILES.COPPER]: 2, [TILES.IRON]: 2,
    [TILES.DIAMOND]: 3, [TILES.COBALT]: 4, [TILES.PLATINUM]: 5,
    [TILES.CRAFTING_TABLE]: 0, [TILES.FURNACE]: 1, [TILES.TORCH]: 0
};
const TOOL_TIER = {
    [TILES.WOOD_PICKAXE]: 1,
    [TILES.STONE_PICKAXE]: 2,
    [TILES.COPPER_PICKAXE]: 3,
    [TILES.IRON_PICKAXE]: 3,
    [TILES.DIAMOND_PICKAXE]: 4,
    [TILES.COBALT_PICKAXE]: 5,
    [TILES.PLATINUM_PICKAXE]: 6
};

const BLOCK_HARDNESS = {
    [TILES.GRASS]: 10, [TILES.DIRT]: 10,
    [TILES.WOOD_LOG]: 20, [TILES.LEAVES]: 2,
    [TILES.STONE]: 30, [TILES.COAL]: 35,
    [TILES.COPPER]: 40, [TILES.IRON]: 40,
    [TILES.DIAMOND]: 60, [TILES.COBALT]: 70,
    [TILES.PLATINUM]: 80,
    [TILES.CRAFTING_TABLE]: 20, [TILES.FURNACE]: 30,
    [TILES.TORCH]: 1
};
const TOOL_POWER = {
    [TILES.WOOD_PICKAXE]: 2,
    [TILES.STONE_PICKAXE]: 3,
    [TILES.COPPER_PICKAXE]: 4,
    [TILES.IRON_PICKAXE]: 4,
    [TILES.DIAMOND_PICKAXE]: 6,
    [TILES.COBALT_PICKAXE]: 8,
    [TILES.PLATINUM_PICKAXE]: 10,
};

const WEAPON_DAMAGE = {
    [TILES.WOOD_SWORD]: 7,
    [TILES.STONE_SWORD]: 9,
    [TILES.COPPER_SWORD]: 12,
    [TILES.IRON_SWORD]: 12,
    [TILES.DIAMOND_SWORD]: 16,
    [TILES.COBALT_SWORD]: 20,
    [TILES.PLATINUM_SWORD]: 25,
    
    [TILES.WOOD_PICKAXE]: 3,
    [TILES.STONE_PICKAXE]: 4,
    [TILES.COPPER_PICKAXE]: 5,
    [TILES.IRON_PICKAXE]: 5,
    [TILES.DIAMOND_PICKAXE]: 7,
    [TILES.COBALT_PICKAXE]: 9,
    [TILES.PLATINUM_PICKAXE]: 12,
};

// --- Procedural Texture Atlas Generator ---
function createTextureAtlas() {
    console.log("Generating procedural texture atlas...");
    const atlasCanvas = document.createElement('canvas');
    atlasCanvas.width = 256;
    atlasCanvas.height = 256;
    const atlasCtx = atlasCanvas.getContext('2d');

    const noise = (ctx, x, y, w, h, alpha) => {
        for (let i = 0; i < 50; i++) {
            ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${alpha})`;
            ctx.fillRect(x + Math.random() * w, y + Math.random() * h, 1, 1);
        }
    };

    for (const tileId in TILE_SPRITES) {
        const [x, y] = TILE_SPRITES[tileId];
        const sx = x * SPRITE_SIZE;
        const sy = y * SPRITE_SIZE;
        const color = TILE_COLORS[tileId];
        
        atlasCtx.fillStyle = color;
        atlasCtx.fillRect(sx, sy, SPRITE_SIZE, SPRITE_SIZE);

        switch (Number(tileId)) {
            case TILES.GRASS:
                atlasCtx.fillStyle = '#8B4513';
                atlasCtx.fillRect(sx, sy + 12, SPRITE_SIZE, 4);
                noise(atlasCtx, sx, sy, 16, 12, 0.1);
                break;
            case TILES.DIRT: case TILES.STONE: case TILES.IRON: case TILES.COPPER:
            case TILES.DIAMOND: case TILES.COBALT: case TILES.PLATINUM: case TILES.COAL:
                noise(atlasCtx, sx, sy, 16, 16, 0.2);
                break;
            case TILES.WOOD_LOG:
                atlasCtx.fillStyle = 'rgba(0,0,0,0.2)';
                atlasCtx.fillRect(sx, sy, 16, 16);
                atlasCtx.fillStyle = '#A07040';
                atlasCtx.fillRect(sx + 2, sy + 2, 12, 12);
                atlasCtx.fillStyle = 'rgba(0,0,0,0.2)';
                for (let i = 0; i < 16; i += 4) atlasCtx.fillRect(sx + i, sy, 1, 16);
                break;
            case TILES.LEAVES:
                noise(atlasCtx, sx, sy, 16, 16, 0.3);
                break;
            case TILES.CRAFTING_TABLE:
                atlasCtx.fillStyle = 'rgba(0,0,0,0.2)';
                atlasCtx.fillRect(sx, sy, 16, 4);
                atlasCtx.fillRect(sx, sy, 4, 16);
                atlasCtx.fillRect(sx + 12, sy, 4, 16);
                atlasCtx.fillRect(sx + 4, sy + 8, 8, 4);
                break;
            case TILES.FURNACE:
                atlasCtx.fillStyle = 'rgba(0,0,0,0.4)';
                atlasCtx.fillRect(sx, sy, 16, 16);
                atlasCtx.fillStyle = '#FFA500';
                atlasCtx.fillRect(sx + 4, sy + 6, 8, 6);
                break;
            case TILES.TORCH:
                atlasCtx.clearRect(sx, sy, 16, 16);
                atlasCtx.fillStyle = '#8B4513';
                atlasCtx.fillRect(sx + 6, sy + 8, 4, 8);
                atlasCtx.fillStyle = '#FFA500';
                atlasCtx.fillRect(sx + 5, sy, 6, 6);
                break;
            case TILES.STICK:
                atlasCtx.clearRect(sx, sy, 16, 16);
                atlasCtx.fillStyle = TILE_COLORS[TILES.STICK];
                atlasCtx.fillRect(sx + 6, sy + 2, 4, 12);
                break;
            case TILES.WOOD_PICKAXE: case TILES.STONE_PICKAXE: case TILES.COPPER_PICKAXE:
            case TILES.IRON_PICKAXE: case TILES.DIAMOND_PICKAXE: case TILES.COBALT_PICKAXE:
            case TILES.PLATINUM_PICKAXE:
                atlasCtx.clearRect(sx, sy, 16, 16);
                atlasCtx.fillStyle = TILE_COLORS[TILES.STICK];
                atlasCtx.fillRect(sx + 6, sy + 2, 4, 12);
                atlasCtx.fillStyle = color;
                atlasCtx.fillRect(sx + 2, sy + 2, 12, 4);
                break;
            case TILES.COPPER_INGOT: case TILES.IRON_INGOT: case TILES.DIAMOND_INGOT:
            case TILES.COBALT_INGOT: case TILES.PLATINUM_INGOT:
                atlasCtx.clearRect(sx, sy, 16, 16);
                atlasCtx.fillStyle = color;
                atlasCtx.fillRect(sx + 3, sy + 4, 10, 8);
                atlasCtx.fillStyle = 'rgba(255,255,255,0.3)';
                atlasCtx.fillRect(sx + 3, sy + 4, 10, 2);
                break;
            case TILES.SLIME_GEL:
                atlasCtx.clearRect(sx, sy, 16, 16);
                atlasCtx.fillStyle = color;
                atlasCtx.beginPath();
                atlasCtx.moveTo(sx + 8, sy + 14);
                atlasCtx.bezierCurveTo(sx, sy + 14, sx, sy + 6, sx + 8, sy + 6);
                atlasCtx.bezierCurveTo(sx + 16, sy + 6, sx + 16, sy + 14, sx + 8, sy + 14);
                atlasCtx.fill();
                break;
            case TILES.USSR_BOOK:
                atlasCtx.clearRect(sx, sy, 16, 16);
                atlasCtx.fillStyle = color; // Red
                atlasCtx.fillRect(sx + 3, sy + 2, 10, 12);
                atlasCtx.fillStyle = '#FFD700'; // Gold
                atlasCtx.fillRect(sx + 7, sy + 4, 2, 8);
                atlasCtx.fillRect(sx + 5, sy + 7, 6, 2);
                break;
            case TILES.WOOD_SWORD: case TILES.STONE_SWORD: case TILES.COPPER_SWORD:
            case TILES.IRON_SWORD: case TILES.DIAMOND_SWORD: case TILES.COBALT_SWORD:
            case TILES.PLATINUM_SWORD:
                atlasCtx.clearRect(sx, sy, 16, 16);
                atlasCtx.fillStyle = TILE_COLORS[TILES.STICK]; // Handle
                atlasCtx.fillRect(sx + 7, sy + 10, 2, 4);
                atlasCtx.fillStyle = color; // Blade
                atlasCtx.fillRect(sx + 6, sy + 2, 4, 8);
                atlasCtx.fillStyle = TILE_COLORS[TILES.WOOD_PLANK]; // Hilt
                atlasCtx.fillRect(sx + 4, sy + 9, 8, 2);
                break;
        }
    }
    
    console.log("Atlas generation complete.");
    return atlasCanvas;
}

const textureAtlas = createTextureAtlas();
const worldChunks = new Map();
const lightChunks = new Map();

// --- 3. Game State ---
let player = {
    x: 0, y: 0,
    width: TILE_SIZE * 0.8,
    height: TILE_SIZE * 1.8,
    vx: 0, vy: 0,
    isOnGround: false,
    direction: 1,
    state: 'idle',
    animationFrame: 0,
    animationTimer: 0,
    health: 100,
    maxHealth: 100,
    lastDamageTime: 0,
    fallDistance: 0,
    attackCooldown: 0
};
let camera = {
    x: 0, y: 0,
    targetZoom: 1.0,
    currentZoom: 1.0,
    zoomSpeed: 0.05
};
let keys = { w: false, a: false, d: false, e: false, z: false, x: false };
let mouse = {
    x: 0, y: 0,
    tileX: 0, tileY: 0,
    isDown: false,
    heldItem: null
};
let miningState = {
    isMining: false,
    tileX: 0,
    tileY: 0,
    progress: 0,
    requiredTime: 0
};
const GRAVITY = 0.3;
const JUMP_STRENGTH = -8;
const MOVE_SPEED = 3;
const INTERACTION_RANGE = 4;
const CAMERA_SMOOTH_FACTOR = 0.1;
const INVINCIBILITY_TIME = 60;

let hotbarSlots = new Array(9).fill(null);
let inventorySlots = new Array(27).fill(null);
let selectedSlot = 0;

// --- MODIFIED: UI States & Grids ---
let isInventoryOpen = false;
let isCraftingTableOpen = false;
let isFurnaceOpen = false;

let playerCraftingGrid = new Array(4).fill(null);
let playerCraftingOutput = null;
let tableCraftingGrid = new Array(9).fill(null);
let tableCraftingOutput = null;

let helmetSlot = null;
let chestplateSlot = null;
let leggingsSlot = null;
// ---

let furnaceInput = null;
let furnaceFuel = null;
let furnaceOutput = null;
let furnaceCookTime = 0;
let furnaceFuelTime = 0;
const COOK_TIME = 200;

// --- Light Engine ---
const MAX_LIGHT = 15;
const AMBIENT_LIGHT_LEVEL = MAX_LIGHT;
const MIN_GLOBAL_LIGHT = 3;
let lightQueue = [];
let removeQueue = [];

// --- Enemy System ---
let enemies = [];
let spawnPos = { x: 0, y: 0 };

let hoveredItem = null;
const simplex = new SimplexNoise();

// --- 4. Recipe Databases ---
const CRAFTING_RECIPES = {
    WOOD_PLANK: {
        type: 'shapeless', input: [{ id: TILES.WOOD_LOG, count: 1 }],
        output: { id: TILES.WOOD_PLANK, count: 4 }
    },
    STICK: {
        type: 'shaped',
        pattern: [[TILES.WOOD_PLANK], [TILES.WOOD_PLANK]],
        output: { id: TILES.STICK, count: 4 }
    },
    CRAFTING_TABLE: {
        type: 'shaped',
        pattern: [[TILES.WOOD_PLANK, TILES.WOOD_PLANK], [TILES.WOOD_PLANK, TILES.WOOD_PLANK]],
        output: { id: TILES.CRAFTING_TABLE, count: 1 }
    },
    FURNACE: {
        type: 'shaped',
        pattern: [
            [TILES.STONE, TILES.STONE, TILES.STONE],
            [TILES.STONE, null, TILES.STONE],
            [TILES.STONE, TILES.STONE, TILES.STONE]
        ],
        output: { id: TILES.FURNACE, count: 1 }
    },
    TORCH: {
        type: 'shapeless',
        input: [{id: TILES.WOOD_LOG, count: 1}, {id: TILES.COAL, count: 1}],
        output: {id: TILES.TORCH, count: 4}
    }
};
function addPickaxeRecipes() {
    const materials = [
        { id: TILES.WOOD_PLANK, pick: TILES.WOOD_PICKAXE },
        { id: TILES.STONE, pick: TILES.STONE_PICKAXE },
        { id: TILES.COPPER_INGOT, pick: TILES.COPPER_PICKAXE },
        { id: TILES.IRON_INGOT, pick: TILES.IRON_PICKAXE },
        { id: TILES.DIAMOND_INGOT, pick: TILES.DIAMOND_PICKAXE },
        { id: TILES.COBALT_INGOT, pick: TILES.COBALT_PICKAXE },
        { id: TILES.PLATINUM_INGOT, pick: TILES.PLATINUM_PICKAXE }
    ];
    for (const mat of materials) {
        CRAFTING_RECIPES[TILE_NAMES[mat.pick]] = {
            type: 'shaped',
            pattern: [
                [mat.id, mat.id, mat.id],
                [null, TILES.STICK, null],
                [null, TILES.STICK, null]
            ],
            output: { id: mat.pick, count: 1 }
        };
    }
}
addPickaxeRecipes();

function addSwordRecipes() {
    const materials = [
        { id: TILES.WOOD_PLANK, sword: TILES.WOOD_SWORD },
        { id: TILES.STONE, sword: TILES.STONE_SWORD },
        { id: TILES.COPPER_INGOT, sword: TILES.COPPER_SWORD },
        { id: TILES.IRON_INGOT, sword: TILES.IRON_SWORD },
        { id: TILES.DIAMOND_INGOT, sword: TILES.DIAMOND_SWORD },
        { id: TILES.COBALT_INGOT, sword: TILES.COBALT_SWORD },
        { id: TILES.PLATINUM_INGOT, sword: TILES.PLATINUM_SWORD }
    ];
    for (const mat of materials) {
        CRAFTING_RECIPES[TILE_NAMES[mat.sword]] = {
            type: 'shaped',
            pattern: [
                [null, mat.id, null],
                [null, mat.id, null],
                [null, TILES.STICK, null]
            ],
            output: { id: mat.sword, count: 1 }
        };
    }
}
addSwordRecipes();

const SMELT_RECIPES = {
    [TILES.COPPER_ORE]: TILES.COPPER_INGOT, [TILES.IRON_ORE]: TILES.IRON_INGOT,
    [TILES.DIAMOND]: TILES.DIAMOND_INGOT, [TILES.COBALT]: TILES.COBALT_INGOT,
    [TILES.PLATINUM]: TILES.PLATINUM_INGOT, [TILES.WOOD_LOG]: TILES.COAL
};
const FUEL_TIMES = {
    [TILES.WOOD_LOG]: 150, [TILES.WOOD_PLANK]: 75, [TILES.COAL]: 800
};

// --- 5. Chunk Management ---
const TERRAIN_HEIGHT_SCALE = 50;
const TERRAIN_HEIGHT_AMOUNT = 15;
const BASE_HEIGHT = 30;
const ORE_NOISE_SCALE = 10;
const CAVE_NOISE_SCALE = 25;
function getChunkKey(chunkX, chunkY) {
    return `${chunkX},${chunkY}`;
}
function generateChunk(chunkX, chunkY) {
    let chunk = new Array(CHUNK_SIZE).fill(0).map(() => new Array(CHUNK_SIZE).fill(TILES.AIR));
    let lightChunk = new Array(CHUNK_SIZE).fill(0).map(() => new Array(CHUNK_SIZE).fill(0));
    
    for (let x = 0; x < CHUNK_SIZE; x++) {
        const globalX = chunkX * CHUNK_SIZE + x;
        let heightNoise = simplex.noise2D(globalX / TERRAIN_HEIGHT_SCALE, 0);
        let surfaceY = Math.floor(BASE_HEIGHT + heightNoise * TERRAIN_HEIGHT_AMOUNT);
        for (let y = 0; y < CHUNK_SIZE; y++) {
            const globalY = chunkY * CHUNK_SIZE + y;
            if (globalY < surfaceY) chunk[y][x] = TILES.AIR;
            else if (globalY === surfaceY) chunk[y][x] = TILES.GRASS;
            else if (globalY > surfaceY && globalY < surfaceY + 5) chunk[y][x] = TILES.DIRT;
            else if (globalY >= surfaceY + 5) {
                chunk[y][x] = TILES.STONE;
                let oreNoise = simplex.noise2D(globalX / ORE_NOISE_SCALE, globalY / ORE_NOISE_SCALE);
                if (oreNoise > 0.6) chunk[y][x] = TILES.COAL;
                else if (oreNoise > 0.7) chunk[y][x] = TILES.COPPER;
                else if (oreNoise > 0.75) chunk[y][x] = TILES.IRON;
                else if (oreNoise > 0.8) chunk[y][x] = TILES.DIAMOND;
                else if (oreNoise > 0.85) chunk[y][x] = TILES.COBALT;
                else if (oreNoise > 0.9) chunk[y][x] = TILES.PLATINUM;
            }
            if (chunk[y][x] === TILES.DIRT || chunk[y][x] === TILES.STONE) {
                let caveNoise = simplex.noise2D(globalX / CAVE_NOISE_SCALE, globalY / CAVE_NOISE_SCALE);
                if (caveNoise > 0.6) chunk[y][x] = TILES.AIR;
            }
        }
    }
    for (let x = 0; x < CHUNK_SIZE; x++) {
        for (let y = 0; y < CHUNK_SIZE; y++) {
            if (chunk[y][x] === TILES.GRASS && y > 0 && chunk[y-1][x] === TILES.AIR) {
                if (Math.random() < 0.05) {
                    generateTreeInChunk(chunk, x, y - 1);
                }
            }
        }
    }
    for (let x = 0; x < CHUNK_SIZE; x++) {
        let sunBlocked = false;
        const globalX = chunkX * CHUNK_SIZE + x;
        const surfaceY = findSurfaceY(globalX);
        for (let y = 0; y < CHUNK_SIZE; y++) {
            const globalY = chunkY * CHUNK_SIZE + y;
            const tileId = chunk[y][x];
            if (globalY < surfaceY) {
                if (isBlockSolid(tileId)) sunBlocked = true;
                lightChunk[y][x] = sunBlocked ? 0 : AMBIENT_LIGHT_LEVEL;
            } else {
                sunBlocked = true;
                lightChunk[y][x] = 0;
            }
            if (tileId === TILES.TORCH) {
                lightChunk[y][x] = 14;
            } else if (isBlockSolid(tileId)) {
                lightChunk[y][x] = 0;
            }
        }
    }
    const key = getChunkKey(chunkX, chunkY);
    worldChunks.set(key, chunk);
    lightChunks.set(key, lightChunk);
}
function getOrCreateChunk(chunkX, chunkY) {
    const key = getChunkKey(chunkX, chunkY);
    if (!worldChunks.has(key)) {
        generateChunk(chunkX, chunkY);
    }
    return worldChunks.get(key);
}
function getLightChunk(chunkX, chunkY) {
    const key = getChunkKey(chunkX, chunkY);
    if (!lightChunks.has(key)) {
        getOrCreateChunk(chunkX, chunkY);
    }
    return lightChunks.get(key);
}
function correctMod(n, m) {
    return ((n % m) + m) % m;
}
function getTile(tileX, tileY) {
    const chunkX = Math.floor(tileX / CHUNK_SIZE);
    const chunkY = Math.floor(tileY / CHUNK_SIZE);
    const chunk = getOrCreateChunk(chunkX, chunkY);
    const localX = correctMod(tileX, CHUNK_SIZE);
    const localY = correctMod(tileY, CHUNK_SIZE);
    return chunk[localY][localX];
}
function setTile(tileX, tileY, tileId) {
    const chunkX = Math.floor(tileX / CHUNK_SIZE);
    const chunkY = Math.floor(tileY / CHUNK_SIZE);
    const chunk = getOrCreateChunk(chunkX, chunkY);
    const localX = correctMod(tileX, CHUNK_SIZE);
    const localY = correctMod(tileY, CHUNK_SIZE);
    chunk[localY][localX] = tileId;
}
function getLight(tileX, tileY) {
    const chunkX = Math.floor(tileX / CHUNK_SIZE);
    const chunkY = Math.floor(tileY / CHUNK_SIZE);
    const chunk = getLightChunk(chunkX, chunkY);
    if (!chunk) return 0;
    const localX = correctMod(tileX, CHUNK_SIZE);
    const localY = correctMod(tileY, CHUNK_SIZE);
    return chunk[localY][localX];
}
function setLight(tileX, tileY, lightLevel) {
    const chunkX = Math.floor(tileX / CHUNK_SIZE);
    const chunkY = Math.floor(tileY / CHUNK_SIZE);
    const chunk = getLightChunk(chunkX, chunkY);
    if (!chunk) return;
    const localX = correctMod(tileX, CHUNK_SIZE);
    const localY = correctMod(tileY, CHUNK_SIZE);
    
    const oldLevel = chunk[localY][localX];
    
    if (lightLevel > oldLevel) {
        chunk[localY][localX] = lightLevel;
        lightQueue.push([tileX, tileY]);
    } else if (lightLevel < oldLevel) {
        chunk[localY][localX] = lightLevel;
        removeQueue.push([tileX, tileY, oldLevel]);
    }
}
function findSurfaceY(globalX) {
    let heightNoise = simplex.noise2D(globalX / TERRAIN_HEIGHT_SCALE, 0);
    return Math.floor(BASE_HEIGHT + heightNoise * TERRAIN_HEIGHT_AMOUNT);
}
function generateTreeInChunk(chunk, x, y) {
    const trunkHeight = Math.floor(Math.random() * 3) + 4;
    
    for (let i = 0; i < trunkHeight; i++) {
        const currentY = y - i;
        if (currentY < 0) break;
        if (chunk[currentY][x] === TILES.AIR) {
            chunk[currentY][x] = TILES.WOOD_LOG;
        }
    }
    const leafBaseY = y - trunkHeight;
    const setLeaf = (lx, ly) => {
        const newX = x + lx;
        const newY = ly;
        if (newX >= 0 && newX < CHUNK_SIZE && newY >= 0 && newY < CHUNK_SIZE && chunk[newY][newX] === TILES.AIR) {
            chunk[newY][newX] = TILES.LEAVES;
        }
    };
    
    if (leafBaseY - 2 >= 0) {
        setLeaf(0, leafBaseY - 2);
    }
    if (leafBaseY - 1 >= 0) {
        setLeaf(-1, leafBaseY - 1);
        setLeaf(0, leafBaseY - 1);
        setLeaf(1, leafBaseY - 1);
    }
    if (leafBaseY >= 0) {
        setLeaf(-2, leafBaseY);
        setLeaf(-1, leafBaseY);
        setLeaf(0, leafBaseY);
        setLeaf(1, leafBaseY);
        setLeaf(2, leafBaseY);
    }
    if (leafBaseY + 1 >= 0) {
        setLeaf(-2, leafBaseY + 1);
        setLeaf(-1, leafBaseY + 1);
        setLeaf(0, leafBaseY + 1);
        setLeaf(1, leafBaseY + 1);
        setLeaf(2, leafBaseY + 1);
    }
}

// --- 6. Inventory Helpers ---
function addItemToInventory(itemStack) {
    if (!itemStack) return null;
    for (let slot of hotbarSlots) {
        if (slot && slot.id === itemStack.id && slot.count < MAX_STACK) {
            let canTake = MAX_STACK - slot.count;
            let willTake = Math.min(canTake, itemStack.count);
            slot.count += willTake;
            itemStack.count -= willTake;
            if (itemStack.count <= 0) return null;
        }
    }
    for (let slot of inventorySlots) {
        if (slot && slot.id === itemStack.id && slot.count < MAX_STACK) {
            let canTake = MAX_STACK - slot.count;
            let willTake = Math.min(canTake, itemStack.count);
            slot.count += willTake;
            itemStack.count -= willTake;
            if (itemStack.count <= 0) return null;
        }
    }
    for (let i = 0; i < hotbarSlots.length; i++) {
        if (hotbarSlots[i] === null) {
            hotbarSlots[i] = itemStack;
            return null;
        }
    }
    for (let i = 0; i < inventorySlots.length; i++) {
        if (inventorySlots[i] === null) {
            inventorySlots[i] = itemStack;
            return null;
        }
    }
    return itemStack;
}

function addBlockToInventory(tileType) {
    if (tileType === TILES.AIR || tileType === TILES.LEAVES) return;
    let itemStack = { id: tileType, count: 1 };
    let remaining = addItemToInventory(itemStack);
    if (remaining) {
        console.log("Inventory full!");
    }
}

function removeBlockFromInventory(slotArray, slotIndex) {
    let slot = slotArray[slotIndex];
    if (slot) {
        slot.count--;
        if (slot.count <= 0) {
            slotArray[slotIndex] = null;
        }
        return true;
    }
    return false;
}

// --- 7. Input Handlers ---
function setupInputListeners() {
    window.addEventListener('keydown', (e) => {
        if (isInventoryOpen || isCraftingTableOpen || isFurnaceOpen) {
             if (e.key === 'e' || e.key === 'E' || e.key === 'Escape') {
                if (!keys.e) {
                    isInventoryOpen = false;
                    isCraftingTableOpen = false;
                    isFurnaceOpen = false;
                    dropHeldItem();
                }
                keys.e = true;
            }
            return;
        }
        if (e.key === 'w' || e.key === 'W' || e.key === ' ') keys.w = true;
        if (e.key === 'a' || e.key === 'A') keys.a = true;
        if (e.key === 'd' || e.key === 'D') keys.d = true;
        if (e.key === 'e' || e.key === 'E') {
            if (!keys.e) {
                isInventoryOpen = true;
                isCraftingTableOpen = false;
                isFurnaceOpen = false;
            }
            keys.e = true;
        }
        if (e.key === 'z' || e.key === 'Z') keys.z = true;
        if (e.key === 'x' || e.key === 'X') keys.x = true;

        if (e.key >= '1' && e.key <= '9') {
            selectedSlot = parseInt(e.key) - 1;
            stopMining();
        }
    });
    window.addEventListener('keyup', (e) => {
        if (e.key === 'w' || e.key === 'W' || e.key === ' ') keys.w = false;
        if (e.key === 'a' || e.key === 'A') keys.a = false;
        if (e.key === 'd' || e.key === 'D') keys.d = false;
        if (e.key === 'e' || e.key === 'E' || e.key === 'Escape') keys.e = false;
        if (e.key === 'z' || e.key === 'Z') keys.z = false;
        if (e.key === 'x' || e.key === 'X') keys.x = false;
    });
    
    window.addEventListener('mouseup', (e) => {
        mouse.isDown = false;
        stopMining();
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;

        const oldTileX = mouse.tileX;
        const oldTileY = mouse.tileY;

        let mouseWorldX = (mouse.x / camera.currentZoom) + camera.x;
        let mouseWorldY = (mouse.y / camera.currentZoom) + camera.y;
        mouse.tileX = toTileCoord(mouseWorldX);
        mouse.tileY = toTileCoord(mouseWorldY);

        if (mouse.tileX !== oldTileX || mouse.tileY !== oldTileY) {
            stopMining();
            if (mouse.isDown && !isInventoryOpen && !isCraftingTableOpen && !isFurnaceOpen) {
                const didAttack = tryAttack(mouse.tileX, mouse.tileY);
                if (!didAttack) {
                    startMining(mouse.tileX, mouse.tileY);
                }
            }
        }
    });
    
    canvas.addEventListener('mousedown', (e) => {
        e.preventDefault();
        mouse.isDown = true;
        const isShiftClick = e.shiftKey;
        
        if (isInventoryOpen) {
            handleInventoryClick(e.button, 'inventory', isShiftClick);
        } else if (isCraftingTableOpen) {
            handleInventoryClick(e.button, 'craftingTable', isShiftClick);
        } else if (isFurnaceOpen) {
            handleInventoryClick(e.button, 'furnace', isShiftClick);
        } else {
            if (e.button === 0) {
                const didAttack = tryAttack(mouse.tileX, mouse.tileY);
                if (!didAttack) {
                    startMining(mouse.tileX, mouse.tileY);
                }
            }
            if (e.button === 2) {
                handleRightClick();
            }
        }
    });
    
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    window.addEventListener('wheel', (e) => {
        if (isInventoryOpen || isCraftingTableOpen || isFurnaceOpen) return;
        if (e.deltaY > 0) {
            selectedSlot++;
            if (selectedSlot > 8) selectedSlot = 0;
        } else if (e.deltaY < 0) {
            selectedSlot--;
            if (selectedSlot < 0) selectedSlot = 8;
        }
        stopMining();
    });
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// --- 8. Interaction Logic ---
function tryAttack(x, y) {
    if (player.attackCooldown > 0) return false;

    const enemy = getEnemyAt(x, y);
    if (enemy) {
        const heldSlot = hotbarSlots[selectedSlot];
        const heldId = heldSlot ? heldSlot.id : null;
        const damage = WEAPON_DAMAGE[heldId] ?? 2; // Default 2 damage (hand)
        
        damageEnemy(enemy, damage);
        player.attackCooldown = 30; // 0.5 sec cooldown
        return true;
    }
    return false;
}

function startMining(x, y) {
    // --- BUG FIX: Removed redundant enemy check ---
    
    const tileType = getTile(x, y);
    if (tileType === TILES.AIR) {
        stopMining();
        return;
    }

    const playerTileX = toTileCoord(player.x + player.width / 2);
    const playerTileY = toTileCoord(player.y + player.height / 2);
    const dist = Math.sqrt(Math.pow(playerTileX - x, 2) + Math.pow(playerTileY - y, 2));
    if (dist > INTERACTION_RANGE) {
        stopMining();
        return;
    }
    
    const requiredTier = BLOCK_TIER[tileType] ?? 0;
    const heldSlot = hotbarSlots[selectedSlot];
    const toolTier = heldSlot ? (TOOL_TIER[heldSlot.id] ?? 0) : 0;

    // Check if item is a sword
    const isSword = heldSlot && heldSlot.id >= 1000;
    
    if (toolTier < requiredTier || isSword) {
        if(isSword) console.log("Can't mine with a sword!");
        else console.log("Tool not strong enough!");
        stopMining();
        return;
    }
    
    const hardness = BLOCK_HARDNESS[tileType] ?? 10;
    const toolPower = heldSlot ? (TOOL_POWER[heldSlot.id] ?? 1) : 1;
    
    miningState.isMining = true;
    miningState.tileX = x;
    miningState.tileY = y;
    miningState.progress = 0;
    miningState.requiredTime = Math.max(5, (hardness * 10) / toolPower); 
}

function stopMining() {
    miningState.isMining = false;
    miningState.progress = 0;
}


// --- REMOVED: updateSunlightColumn() ---

function handleRightClick() {
    const playerTileX = toTileCoord(player.x + player.width / 2);
    const playerTileY = toTileCoord(player.y + player.height / 2);
    const dist = Math.sqrt(Math.pow(playerTileX - mouse.tileX, 2) + Math.pow(playerTileY - mouse.tileY, 2));
    if (dist > INTERACTION_RANGE) return;
    
    const block = getTile(mouse.tileX, mouse.tileY);
    const slot = hotbarSlots[selectedSlot];
    
    if (slot && slot.id === TILES.USSR_BOOK) {
        console.log("Opening Wikipedia page...");
        window.open('https://en.wikipedia.org/wiki/Soviet_Union', '_blank');
        return;
    }
    
    if (block === TILES.CRAFTING_TABLE) {
        isCraftingTableOpen = true;
        isInventoryOpen = false;
        isFurnaceOpen = false;
    } else if (block === TILES.FURNACE) {
        isFurnaceOpen = true;
        isInventoryOpen = false;
        isCraftingTableOpen = false;
    } else if (block === TILES.AIR || (slot && slot.id === TILES.TORCH && !isBlockSolid(block))) {
        placeBlock();
    }
}

function placeBlock() {
    const slot = hotbarSlots[selectedSlot];
    if (!slot) return;
    
    // --- BUG FIX ---
    // Can't place tools, swords, or special items
    if (slot.id >= 100) return; 

    const playerTileX = toTileCoord(player.x + player.width / 2);
    const playerTileY = toTileCoord(player.y + player.height / 2);
    const dist = Math.sqrt(Math.pow(playerTileX - mouse.tileX, 2) + Math.pow(playerTileY - mouse.tileY, 2));
    if (dist > INTERACTION_RANGE) return;
    
    const currentTile = getTile(mouse.tileX, mouse.tileY);
    if (currentTile !== TILES.AIR) {
        if (slot.id !== TILES.TORCH || isBlockSolid(currentTile)) {
             return;
        }
    }
    
    const tilePixelX = mouse.tileX * TILE_SIZE;
    const tilePixelY = mouse.tileY * TILE_SIZE;
    if (player.x < tilePixelX + TILE_SIZE && player.x + player.width > tilePixelX &&
        player.y < tilePixelY + TILE_SIZE && player.y + player.height > tilePixelY) {
        return;
    }
    
    if (removeBlockFromInventory(hotbarSlots, selectedSlot)) {
        setTile(mouse.tileX, mouse.tileY, slot.id);
        
        if (slot.id === TILES.TORCH) {
            setLight(mouse.tileX, mouse.tileY, 14);
        } else if (isBlockSolid(slot.id)) {
            setLight(mouse.tileX, mouse.tileY, 0);
            // --- LAG FIX: Removed updateSunlightColumn() ---
            // Nudge neighbors to recalculate sunlight
            const lightAbove = getLight(mouse.tileX, mouse.tileY - 1);
            if (lightAbove === AMBIENT_LIGHT_LEVEL) {
                 lightQueue.push([mouse.tileX, mouse.tileY - 1]);
            }
        }
    }
}

// --- 9. Crafting & Furnace Logic ---
const SLOT_SIZE = 36;
const SLOT_PADDING = 4;
let slotCoords = {};

function handleInventoryClick(button, uiType, isShiftClicking = false) {
    for (const key in slotCoords) {
        const { x, y } = slotCoords[key];
        if (mouse.x > x && mouse.x < x + SLOT_SIZE && mouse.y > y && mouse.y < y + SLOT_SIZE) {
            
            const [arrayName, indexStr] = key.split('-');
            const index = parseInt(indexStr);
            let slotArray, setter;
            
            if (arrayName === 'inv') { slotArray = inventorySlots; setter = (item) => inventorySlots[index] = item; }
            else if (arrayName === 'hotbar') { slotArray = hotbarSlots; setter = (item) => hotbarSlots[index] = item; }
            
            else if (uiType === 'inventory') {
                if (arrayName === 'pCraft') { slotArray = playerCraftingGrid; setter = (item) => playerCraftingGrid[index] = item; }
                else if (arrayName === 'pCraftOut') { handleOutputClick(playerCraftingOutput, 'playerCrafting', (item) => playerCraftingOutput = item, isShiftClicking); return; }
                else if (arrayName === 'armor') {
                    if (index === 0) { slotArray = [helmetSlot]; setter = (item) => helmetSlot = item; }
                    else if (index === 1) { slotArray = [chestplateSlot]; setter = (item) => chestplateSlot = item; }
                    else if (index === 2) { slotArray = [leggingsSlot]; setter = (item) => leggingsSlot = item; }
                }
            }
            else if (uiType === 'craftingTable') {
                if (arrayName === 'tCraft') { slotArray = tableCraftingGrid; setter = (item) => tableCraftingGrid[index] = item; }
                else if (arrayName === 'tCraftOut') { handleOutputClick(tableCraftingOutput, 'tableCrafting', (item) => tableCraftingOutput = item, isShiftClicking); return; }
            }
            else if (uiType === 'furnace') {
                if (arrayName === 'furnaceIn') { slotArray = [furnaceInput]; setter = (item) => furnaceInput = item; }
                else if (arrayName === 'furnaceFuel') { slotArray = [furnaceFuel]; setter = (item) => furnaceFuel = item; }
                else if (arrayName === 'furnaceOut') { handleOutputClick(furnaceOutput, 'furnace', (item) => furnaceOutput = item, isShiftClicking); return; }
            }

            if (isShiftClicking && slotArray) {
                quickMoveItem(slotArray, index, arrayName, setter);
            } else if (slotArray) {
                handleSlotClick(slotArray, index, button, setter);
            }
            
            if (uiType === 'inventory') checkPlayerCrafting();
            else if (uiType === 'craftingTable') checkTableCrafting();
            return;
        }
    }
}

function quickMoveItem(slotArray, index, fromArea, setter) {
    let itemStack = slotArray[index];
    if (!itemStack) return;
    let remainingStack = null;
    
    if (fromArea === 'pCraft' || fromArea === 'tCraft' || fromArea === 'furnaceIn' || fromArea === 'furnaceFuel' || fromArea === 'furnaceOut' || fromArea === 'armor') {
        remainingStack = addItemToInventory(itemStack);
    } else if (fromArea === 'inv' || fromArea === 'hotbar') {
        if (isFurnaceOpen) {
            if (SMELT_RECIPES[itemStack.id] && !furnaceInput) furnaceInput = itemStack;
            else if (FUEL_TIMES[itemStack.id] && !furnaceFuel) furnaceFuel = itemStack;
            else remainingStack = addItemToInventory(itemStack);
        } else {
            remainingStack = addItemToInventory(itemStack);
        }
    }
    
    if (!remainingStack) setter(null);
    else setter(remainingStack);
}

function handleSlotClick(slotArray, index, button, setter) {
    let slot = slotArray[index];
    let held = mouse.heldItem;
    if (button === 0) {
        if (held && !slot) { setter(held); mouse.heldItem = null; }
        else if (!held && slot) { mouse.heldItem = slot; setter(null); }
        else if (held && slot) {
            if (held.id === slot.id && slot.count < MAX_STACK) {
                let canTake = MAX_STACK - slot.count;
                let willTake = Math.min(canTake, held.count);
                slot.count += willTake;
                held.count -= willTake;
                if (held.count <= 0) mouse.heldItem = null;
                setter(slot);
            } else { mouse.heldItem = slot; setter(held); }
        }
    } else if (button === 2) {
        if (!held && slot) {
            let half = Math.ceil(slot.count / 2);
            mouse.heldItem = { id: slot.id, count: half };
            slot.count -= half;
            if (slot.count <= 0) setter(null);
            else setter(slot);
        } else if (held && !slot) {
            setter({ id: held.id, count: 1 });
            held.count--;
            if (held.count <= 0) mouse.heldItem = null;
        } else if (held && slot && held.id === slot.id && slot.count < MAX_STACK) {
            slot.count++;
            held.count--;
            if (held.count <= 0) mouse.heldItem = null;
            setter(slot);
        }
    }
}

function handleOutputClick(outputSlot, uiType, setter, isShiftClicking = false) {
    if (!outputSlot) return;
    if (isShiftClicking) {
        let remaining = addItemToInventory({ ...outputSlot });
        if (!remaining) {
            consumeCraftingMaterials(uiType, setter);
        }
    } else if (!mouse.heldItem || (mouse.heldItem.id === outputSlot.id && mouse.heldItem.count < MAX_STACK)) {
        if (!mouse.heldItem) {
            mouse.heldItem = { ...outputSlot };
        } else {
            mouse.heldItem.count += outputSlot.count;
        }
        consumeCraftingMaterials(uiType, setter);
    }
}

function consumeCraftingMaterials(uiType, setter) {
    if (uiType === 'playerCrafting') {
        setter(null);
        for (let i = 0; i < playerCraftingGrid.length; i++) {
            if (playerCraftingGrid[i]) {
                playerCraftingGrid[i].count--;
                if (playerCraftingGrid[i].count <= 0) playerCraftingGrid[i] = null;
            }
        }
        checkPlayerCrafting();
    } else if (uiType === 'tableCrafting') {
        setter(null);
        for (let i = 0; i < tableCraftingGrid.length; i++) {
            if (tableCraftingGrid[i]) {
                tableCraftingGrid[i].count--;
                if (tableCraftingGrid[i].count <= 0) tableCraftingGrid[i] = null;
            }
        }
        checkTableCrafting();
    } else if (uiType === 'furnace') {
        setter(null);
    }
}

function checkPlayerCrafting() {
    playerCraftingOutput = null;
    const gridIds = playerCraftingGrid.map(slot => slot ? slot.id : null);
    const gridIsEmpty = gridIds.every(id => id === null);
    if (gridIsEmpty) return;

    for (const key in CRAFTING_RECIPES) {
        const recipe = CRAFTING_RECIPES[key];
        
        if (recipe.type === 'shapeless') {
            let gridItems = gridIds.filter(id => id !== null);
            let recipeItems = [];
            recipe.input.forEach(item => {
                for(let i=0; i<item.count; i++) {
                    recipeItems.push(item.id);
                }
            });
            let match = true;
            if (gridItems.length !== recipeItems.length) {
                match = false;
            } else {
                let gridItemsSorted = [...gridItems].sort().join(',');
                let recipeItemsSorted = [...recipeItems].sort().join(',');
                if (gridItemsSorted !== recipeItemsSorted) {
                    match = false;
                }
            }
            if (match) {
                playerCraftingOutput = { ...recipe.output };
                return;
            }
        } else if (recipe.type === 'shaped') {
            const pattern = recipe.pattern;
            const pHeight = pattern.length;
            const pWidth = pattern[0].length;
            
            if (pHeight > 2 || pWidth > 2) continue;
            
            for (let startY = 0; startY <= 2 - pHeight; startY++) {
                for (let startX = 0; startX <= 2 - pWidth; startX++) {
                    let match = true;
                    for (let gridY = 0; gridY < 2; gridY++) {
                        for (let gridX = 0; gridX < 2; gridX++) {
                            const gridIndex = gridY * 2 + gridX;
                            const gridId = gridIds[gridIndex];
                            
                            const patternX = gridX - startX;
                            const patternY = gridY - startY;
                            
                            let patternId = null;
                            if (patternX >= 0 && patternX < pWidth && patternY >= 0 && patternY < pHeight) {
                                patternId = pattern[patternY][patternX];
                            }
                            
                            if (gridId !== patternId) {
                                match = false;
                                break;
                            }
                        }
                        if (!match) break;
                    }
                    if (match) {
                        playerCraftingOutput = { ...recipe.output };
                        return;
                    }
                }
            }
        }
    }
}

function checkTableCrafting() {
    tableCraftingOutput = null;
    const gridIds = tableCraftingGrid.map(slot => slot ? slot.id : null);
    const gridIsEmpty = gridIds.every(id => id === null);
    if (gridIsEmpty) return;

    for (const key in CRAFTING_RECIPES) {
        const recipe = CRAFTING_RECIPES[key];
        
        if (recipe.type === 'shapeless') {
            let gridItems = gridIds.filter(id => id !== null);
            let recipeItems = [];
            recipe.input.forEach(item => {
                for(let i=0; i<item.count; i++) {
                    recipeItems.push(item.id);
                }
            });
            let match = true;
            if (gridItems.length !== recipeItems.length) {
                match = false;
            } else {
                let gridItemsSorted = [...gridItems].sort().join(',');
                let recipeItemsSorted = [...recipeItems].sort().join(',');
                if (gridItemsSorted !== recipeItemsSorted) {
                    match = false;
                }
            }
            if (match) {
                tableCraftingOutput = { ...recipe.output };
                return;
            }
        } else if (recipe.type === 'shaped') {
            const pattern = recipe.pattern;
            const pHeight = pattern.length;
            const pWidth = pattern[0].length;
            
            for (let startY = 0; startY <= 3 - pHeight; startY++) {
                for (let startX = 0; startX <= 3 - pWidth; startX++) {
                    let match = true;
                    for (let gridY = 0; gridY < 3; gridY++) {
                        for (let gridX = 0; gridX < 3; gridX++) {
                            const gridIndex = gridY * 3 + gridX;
                            const gridId = gridIds[gridIndex];
                            
                            const patternX = gridX - startX;
                            const patternY = gridY - startY;
                            
                            let patternId = null;
                            if (patternX >= 0 && patternX < pWidth && patternY >= 0 && patternY < pHeight) {
                                patternId = pattern[patternY][patternX];
                            }
                            
                            if (gridId !== patternId) {
                                match = false;
                                break;
                            }
                        }
                        if (!match) break;
                    }
                    if (match) {
                        tableCraftingOutput = { ...recipe.output };
                        return;
                    }
                }
            }
        }
    }
}

function dropHeldItem() {
    mouse.heldItem = null;
}

function updateFurnace() {
    if (furnaceFuelTime > 0) furnaceFuelTime--;
    if (furnaceInput && SMELT_RECIPES[furnaceInput.id]) {
        const resultId = SMELT_RECIPES[furnaceInput.id];
        if (furnaceOutput === null || (furnaceOutput.id === resultId && furnaceOutput.count < MAX_STACK)) {
            if (furnaceFuelTime > 0) {
                if (furnaceCookTime > 0) furnaceCookTime--;
                else furnaceCookTime = COOK_TIME;
            } else if (furnaceFuel && FUEL_TIMES[furnaceFuel.id]) {
                furnaceFuelTime = FUEL_TIMES[furnaceFuel.id];
                furnaceFuel.count--;
                if (furnaceFuel.count <= 0) furnaceFuel = null;
                furnaceCookTime = COOK_TIME;
            } else {
                furnaceCookTime = 0;
            }
        } else {
             furnaceCookTime = 0;
        }
    } else {
         furnaceCookTime = 0;
    }
    if (furnaceCookTime === 1) {
        const resultId = SMELT_RECIPES[furnaceInput.id];
        if (furnaceOutput === null) furnaceOutput = { id: resultId, count: 1 };
        else furnaceOutput.count++;
        furnaceInput.count--;
        if (furnaceInput.count <= 0) furnaceInput = null;
        furnaceCookTime = 0;
    }
}

// --- 10. Game Loop (Update Logic) ---
function update() {
    if (player.lastDamageTime > 0) {
        player.lastDamageTime--;
    }
    if (player.attackCooldown > 0) {
        player.attackCooldown--;
    }
    
    if (keys.z) {
        camera.targetZoom -= 0.02;
    }
    if (keys.x) {
        camera.targetZoom += 0.02;
    }
    camera.targetZoom = Math.max(0.8, Math.min(camera.targetZoom, 3.0));
    camera.currentZoom += (camera.targetZoom - camera.currentZoom) * camera.zoomSpeed;
    
    
    if (!isInventoryOpen && !isCraftingTableOpen && !isFurnaceOpen) {
        // --- Player Physics ---
        if (keys.a) player.vx = -MOVE_SPEED;
        else if (keys.d) player.vx = MOVE_SPEED;
        else player.vx = 0;
        if (keys.w && player.isOnGround) {
            player.vy = JUMP_STRENGTH;
            player.isOnGround = false;
        }

        player.vy += GRAVITY;
        let oldY = player.y;
        let newY = player.y + player.vy;
        
        // Y-Collision
        if (player.vy > 0) {
            let tileX1 = toTileCoord(player.x);
            let tileX2 = toTileCoord(player.x + player.width);
            let tileY = toTileCoord(newY + player.height);
            if (isTileSolid(tileX1, tileY) || isTileSolid(tileX2, tileY)) {
                player.vy = 0;
                player.y = (tileY * TILE_SIZE) - player.height;
                if (!player.isOnGround) {
                    updatePlayerFallDamage(player.y - oldY); // Landed
                }
                player.isOnGround = true;
                player.fallDistance = 0;
            } else {
                player.y = newY;
                player.isOnGround = false;
            }
        } else if (player.vy < 0) {
            let tileX1 = toTileCoord(player.x);
            let tileX2 = toTileCoord(player.x + player.width);
            let tileY = toTileCoord(newY);
            if (isTileSolid(tileX1, tileY) || isTileSolid(tileX2, tileY)) {
                player.vy = 0;
                player.y = (tileY * TILE_SIZE) + TILE_SIZE;
            } else {
                player.y = newY;
            }
        }
        
        if (!player.isOnGround) {
            player.fallDistance += (player.y - oldY);
        }

        // X-Collision
        let newX = player.x + player.vx;
        if (player.vx > 0) {
            let tileX = toTileCoord(newX + player.width);
            let tileY1 = toTileCoord(player.y);
            let tileY2 = toTileCoord(player.y + player.height - 1);
            if (isTileSolid(tileX, tileY1) || isTileSolid(tileX, tileY2)) {
                player.vx = 0; player.x = (tileX * TILE_SIZE) - player.width;
            } else {
                player.x = newX;
            }
        } else if (player.vx < 0) {
            let tileX = toTileCoord(newX);
            let tileY1 = toTileCoord(player.y);
            let tileY2 = toTileCoord(player.y + player.height - 1);
            if (isTileSolid(tileX, tileY1) || isTileSolid(tileX, tileY2)) {
                player.vx = 0; player.x = (tileX * TILE_SIZE) + TILE_SIZE;
            } else {
                player.x = newX;
            }
        }
    } else {
        player.vx = 0; player.vy = 0;
    }

    // --- Player Animation ---
    if (!player.isOnGround) {
        player.state = 'jumping';
    } else if (keys.a || keys.d) {
        player.state = 'walking';
        if (keys.a) player.direction = -1;
        if (keys.d) player.direction = 1;
    } else {
        player.state = 'idle';
    }

    player.animationTimer++;
    if (player.animationTimer > 8) {
        player.animationTimer = 0;
        player.animationFrame++;
        if (player.animationFrame > 3) {
            player.animationFrame = 0;
        }
    }
    if (player.state === 'idle' || player.state === 'jumping') {
        player.animationFrame = 0;
    }
    
    // --- UI & Game States ---
    if (isFurnaceOpen) {
        updateFurnace();
    }
    
    updateMining();
    processLightQueue();
    processRemoveQueue();
    updateEnemies();
    
    hoveredItem = null;
    if (isInventoryOpen || isCraftingTableOpen || isFurnaceOpen) {
        for (const key in slotCoords) {
            const { x, y } = slotCoords[key];
            if (mouse.x > x && mouse.x < x + SLOT_SIZE && mouse.y > y && mouse.y < y + SLOT_SIZE) {
                const [arrayName, indexStr] = key.split('-');
                const index = parseInt(indexStr);
                
                if (arrayName === 'inv') hoveredItem = inventorySlots[index];
                else if (arrayName === 'hotbar') hoveredItem = hotbarSlots[index];
                else if (arrayName === 'pCraft') hoveredItem = playerCraftingGrid[index];
                else if (arrayName === 'pCraftOut') hoveredItem = playerCraftingOutput;
                else if (arrayName === 'armor') {
                    if (index === 0) hoveredItem = helmetSlot;
                    else if (index === 1) hoveredItem = chestplateSlot;
                    else if (index === 2) hoveredItem = leggingsSlot;
                }
                else if (arrayName === 'tCraft') hoveredItem = tableCraftingGrid[index];
                else if (arrayName === 'tCraftOut') hoveredItem = tableCraftingOutput;
                else if (arrayName === 'furnaceIn') hoveredItem = furnaceInput;
                else if (arrayName === 'furnaceFuel') hoveredItem = furnaceFuel;
                else if (arrayName === 'furnaceOut') hoveredItem = furnaceOutput;
                break;
            }
        }
    }

    // --- Chunk Loading ---
    const playerChunkX = Math.floor(toTileCoord(player.x + player.width/2) / CHUNK_SIZE);
    const playerChunkY = Math.floor(toTileCoord(player.y + player.height/2) / CHUNK_SIZE);
    const renderDist = 2;
    for (let cy = playerChunkY - renderDist; cy <= playerChunkY + renderDist; cy++) {
        for (let cx = playerChunkX - renderDist; cx <= playerChunkX + renderDist; cx++) {
            getOrCreateChunk(cx, cy);
        }
    }

    // --- Camera ---
    let targetCamX = player.x + (player.width / 2) - (canvas.width / 2 / camera.currentZoom);
    let targetCamY = player.y + (player.height / 2) - (canvas.height / 2 / camera.currentZoom);
    camera.x += (targetCamX - camera.x) * CAMERA_SMOOTH_FACTOR;
    camera.y += (targetCamY - camera.y) * CAMERA_SMOOTH_FACTOR;
}

// --- Player Health & Damage ---
function takeDamage(amount) {
    if (player.lastDamageTime > 0) return; // Invincible
    
    player.health -= amount;
    player.lastDamageTime = INVINCIBILITY_TIME;
    console.log(`Player took ${amount} damage. Health: ${player.health}`);
    
    if (player.health <= 0) {
        player.health = 0;
        console.log("Player died!");
        // Respawn
        player.x = spawnPos.x;
        player.y = spawnPos.y;
        player.health = player.maxHealth;
        player.vx = 0;
        player.vy = 0;
        player.fallDistance = 0;
    }
}

function updatePlayerFallDamage(pixelsFallen) {
    if (pixelsFallen <= 0) return;
    
    const blocksFallen = pixelsFallen / TILE_SIZE;
    if (blocksFallen > 4) { // Safe to fall 4 blocks
        const damage = Math.floor((blocksFallen - 4) * 5); // 5 damage per block
        if (damage > 0) {
            takeDamage(damage);
        }
    }
}

// --- Enemy Functions ---
function spawnEnemy(x, y) {
    const enemy = {
        x: x, y: y,
        width: TILE_SIZE * 0.9,
        height: TILE_SIZE * 0.9,
        vx: 0, vy: 0,
        isOnGround: false,
        health: 20,
        maxHealth: 20,
        aiTimer: 0,
        lastDamageTime: 0
    };
    enemies.push(enemy);
}

function getEnemyAt(x, y) {
    const px = x * TILE_SIZE + TILE_SIZE / 2;
    const py = y * TILE_SIZE + TILE_SIZE / 2;
    
    for (const enemy of enemies) {
        if (px > enemy.x && px < enemy.x + enemy.width &&
            py > enemy.y && py < enemy.y + enemy.height) {
            return enemy;
        }
    }
    return null;
}

function damageEnemy(enemy, amount) {
    if (enemy.lastDamageTime > 0) return;
    
    enemy.health -= amount;
    enemy.lastDamageTime = 30;
    enemy.vy = -3;
    enemy.vx = (enemy.x - player.x > 0 ? 1 : -1) * 2;
    
    if (enemy.health <= 0) {
        const dropAmount = Math.floor(Math.random() * 3) + 1;
        addItemToInventory({ id: TILES.SLIME_GEL, count: dropAmount });
        
        if (Math.random() < 0.00005) { // 0.005%
            console.log("!!! RARE DROP !!!");
            addItemToInventory({ id: TILES.USSR_BOOK, count: 1 });
        }
    }
}

function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        
        if (enemy.health <= 0) {
            enemies.splice(i, 1);
            continue;
        }
        
        if (enemy.lastDamageTime > 0) {
            enemy.lastDamageTime--;
        }

        enemy.vy += GRAVITY;
        let newY = enemy.y + enemy.vy;
        
        let tileX1 = toTileCoord(enemy.x);
        let tileX2 = toTileCoord(enemy.x + enemy.width);
        let tileY = toTileCoord(newY + enemy.height);
        
        if (isTileSolid(tileX1, tileY) || isTileSolid(tileX2, tileY)) {
            enemy.vy = 0;
            enemy.y = (tileY * TILE_SIZE) - enemy.height;
            enemy.isOnGround = true;
        } else {
            enemy.y = newY;
            enemy.isOnGround = false;
        }
        
        let newX = enemy.x + enemy.vx;
        let tileX = toTileCoord(newX + (enemy.vx > 0 ? enemy.width : 0));
        let tileY1 = toTileCoord(enemy.y);
        let tileY2 = toTileCoord(enemy.y + enemy.height - 1);
        if (isTileSolid(tileX, tileY1) || isTileSolid(tileX, tileY2)) {
            enemy.vx = 0;
        } else {
            enemy.x += enemy.vx;
        }
        
        if (enemy.isOnGround) {
            enemy.vx *= 0.8;
        }
        
        enemy.aiTimer--;
        if (enemy.aiTimer <= 0 && enemy.isOnGround) {
            const dist = player.x - enemy.x;
            if (Math.abs(dist) < TILE_SIZE * 10) {
                enemy.vy = JUMP_STRENGTH / 1.5;
                enemy.vx = (dist > 0 ? 1 : -1) * 2;
                enemy.isOnGround = false;
            }
            enemy.aiTimer = Math.random() * 100 + 80;
        }
        
        if (player.lastDamageTime === 0 &&
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y)
        {
            takeDamage(5);
            player.vy = -4;
            player.vx = (player.x - enemy.x > 0 ? 1 : -1) * 4;
        }
    }
}

function updateMining() {
    if (miningState.isMining) {
        const playerTileX = toTileCoord(player.x + player.width / 2);
        const playerTileY = toTileCoord(player.y + player.height / 2);
        const dist = Math.sqrt(Math.pow(playerTileX - miningState.tileX, 2) + Math.pow(playerTileY - miningState.tileY, 2));
        
        if (!mouse.isDown || dist > INTERACTION_RANGE) {
            stopMining();
        } else {
            miningState.progress++;
            if (miningState.progress >= miningState.requiredTime) {
                const tileType = getTile(miningState.tileX, miningState.tileY);
                
                addBlockToInventory(tileType);
                setTile(miningState.tileX, miningState.tileY, TILES.AIR);
                
                if (tileType === TILES.TORCH) {
                    setLight(miningState.tileX, miningState.tileY, 0);
                } else if (isBlockSolid(tileType)) {
                    // --- LAG FIX: Removed updateSunlightColumn() ---
                    const lightAbove = getLight(miningState.tileX, miningState.tileY - 1);
                    if (lightAbove === AMBIENT_LIGHT_LEVEL) {
                        setLight(miningState.tileX, miningState.tileY, AMBIENT_LIGHT_LEVEL);
                    }
                    lightQueue.push([miningState.tileX + 1, miningState.tileY]);
                    lightQueue.push([miningState.tileX - 1, miningState.tileY]);
                    lightQueue.push([miningState.tileX, miningState.tileY + 1]);
                    lightQueue.push([miningState.tileX, miningState.tileY - 1]);
                }
                
                stopMining();
            }
        }
    }
}

// --- Light Processing ---
function processLightQueue() {
    let limit = 250;
    while (lightQueue.length > 0 && limit > 0) {
        limit--;
        const [x, y] = lightQueue.shift();
        const currentLevel = getLight(x, y);
        
        const neighbors = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
        for (const [nx, ny] of neighbors) {
            const neighborTile = getTile(nx, ny);
            const neighborOpacity = getBlockOpacity(neighborTile);
            const neighborOldLight = getLight(nx, ny);
            
            const newLevel = currentLevel - neighborOpacity;
            
            if (newLevel > neighborOldLight) {
                setLight(nx, ny, newLevel);
            }
        }
    }
}
function processRemoveQueue() {
    let limit = 250;
    while (removeQueue.length > 0 && limit > 0) {
        limit--;
        const [x, y, oldLevel] = removeQueue.shift();
        const neighbors = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
        for (const [nx, ny] of neighbors) {
            const neighborLevel = getLight(nx, ny);
            if (neighborLevel > 0) {
                if (neighborLevel < oldLevel) {
                    setLight(nx, ny, 0);
                } else {
                    lightQueue.push([nx, ny]);
                }
            }
        }
    }
}

// --- Physics Helper ---
function isTileSolid(tileX, tileY) {
    const tileType = getTile(tileX, tileY);
    if (tileType === TILES.AIR || 
        tileType === TILES.WOOD_LOG || 
        tileType === TILES.LEAVES ||
        tileType === TILES.TORCH) {
        return false;
    }
    return true;
}

function toTileCoord(pixelCoord) {
    return Math.floor(pixelCoord / TILE_SIZE);
}

// --- 11. Game Loop (Drawing) ---
function blendColor(hexColor, lightLevel) {
    const light = Math.max(0, Math.min(1, lightLevel));
    if (light >= 1.0) return hexColor;
    if (light <= 0.0) return '#000000';
    let r=parseInt(hexColor.substring(1,3),16),g=parseInt(hexColor.substring(3,5),16),b=parseInt(hexColor.substring(5,7),16);
    r=Math.floor(r*light),g=Math.floor(g*light),b=Math.floor(b*light);
    return`#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    
    ctx.scale(camera.currentZoom, camera.currentZoom);
    ctx.translate(Math.round(-camera.x), Math.round(-camera.y));

    // --- Draw World ---
    const viewWidth = canvas.width / camera.currentZoom;
    const viewHeight = canvas.height / camera.currentZoom;
    const startTileX = toTileCoord(camera.x);
    const endTileX = startTileX + toTileCoord(viewWidth) + 2;
    const startTileY = toTileCoord(camera.y);
    const endTileY = startTileY + toTileCoord(viewHeight) + 2;

    for (let y = startTileY; y < endTileY; y++) {
        for (let x = startTileX; x < endTileX; x++) {
            const tileType = getTile(x, y);
            
            let lightLevel = getLight(x, y);
            if (!isTileSolid(x, y) && isBlockSolid(tileType)) {
                 const lightAbove = getLight(x, y - 1);
                 const lightBelow = getLight(x, y + 1);
                 const lightLeft = getLight(x - 1, y);
                 const lightRight = getLight(x + 1, y);
                 lightLevel = Math.max(lightAbove, lightBelow, lightLeft, lightRight);
            } else if (isBlockSolid(tileType)) {
                 const lightAbove = getLight(x, y - 1);
                 const lightBelow = getLight(x, y + 1);
                 const lightLeft = getLight(x - 1, y);
                 const lightRight = getLight(x + 1, y);
                 lightLevel = Math.max(lightAbove, lightBelow, lightLeft, lightRight);
            }
            
            const finalLightLevel = Math.max(lightLevel, MIN_GLOBAL_LIGHT);
            const finalLight = finalLightLevel / MAX_LIGHT;
            
            const spriteCoords = TILE_SPRITES[tileType];
            
            if (spriteCoords) {
                ctx.globalAlpha = 1.0;
                ctx.drawImage(
                    textureAtlas,
                    spriteCoords[0] * SPRITE_SIZE,
                    spriteCoords[1] * SPRITE_SIZE,
                    SPRITE_SIZE, SPRITE_SIZE,
                    x * TILE_SIZE, y * TILE_SIZE,
                    TILE_SIZE, TILE_SIZE
                );
                
                const darkness = 1.0 - finalLight;
                if (darkness > 0) {
                    ctx.fillStyle = '#000000';
                    ctx.globalAlpha = darkness;
                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    ctx.globalAlpha = 1.0;
                }
            } else if (tileType === TILES.AIR) {
                ctx.globalAlpha = 1.0;
                ctx.fillStyle = blendColor(TILE_COLORS[TILES.AIR], finalLight);
                if (finalLightLevel === MIN_GLOBAL_LIGHT && lightLevel === 0) {
                     ctx.fillStyle = '#000000';
                }
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }

    // --- Draw Entities ---
    drawPlayer();
    drawEnemies();
    
    // --- Draw Mouse & Mining ---
    const playerTileX = toTileCoord(player.x + player.width / 2);
    const playerTileY = toTileCoord(player.y + player.height / 2);
    const dist = Math.sqrt(Math.pow(playerTileX - mouse.tileX, 2) + Math.pow(playerTileY - mouse.tileY, 2));
    if (dist <= INTERACTION_RANGE && getTile(mouse.tileX, mouse.tileY) !== TILES.AIR) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.strokeRect(mouse.tileX * TILE_SIZE, mouse.tileY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    if (miningState.isMining) {
        const progress = miningState.progress / miningState.requiredTime;
        const crackFrame = Math.floor(progress * 10);
        if (crackFrame > 0) {
            const crackWidth = TILE_SIZE * (crackFrame / 10);
            const crackHeight = TILE_SIZE * (crackFrame / 10);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + progress * 0.3})`;
            ctx.fillRect(
                miningState.tileX * TILE_SIZE + (TILE_SIZE - crackWidth) / 2, 
                miningState.tileY * TILE_SIZE + (TILE_SIZE - crackHeight) / 2, 
                crackWidth, 
                crackHeight
            );
        }
    }
    
    ctx.restore();

    // --- DRAW UI (This is not scaled) ---
    if (!isInventoryOpen && !isCraftingTableOpen && !isFurnaceOpen) {
        drawHotbar();
    }
    
    drawHealthBar();
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.textAlign = "right";
    const tX = toTileCoord(player.x + player.width / 2);
    const tY = toTileCoord(player.y + player.height / 2);
    ctx.fillText(`Player: ${tX}, ${tY}`, canvas.width - 10, 20);
    ctx.textAlign = "left";
    
    if (isInventoryOpen) {
        drawPlayerInventoryScreen();
    } else if (isCraftingTableOpen) {
        drawCraftingTableUI();
    } else if (isFurnaceOpen) {
        drawFurnaceUI();
    }
    
    if (mouse.heldItem) {
        drawSprite(mouse.heldItem, mouse.x - (SLOT_SIZE/2), mouse.y - (SLOT_SIZE/2), SLOT_SIZE);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(mouse.heldItem.count, mouse.x + SLOT_SIZE/2 - 4, mouse.y + SLOT_SIZE/2 - 4);
        ctx.textAlign = 'left';
    }
    
    if (hoveredItem && !mouse.heldItem) {
        const itemName = TILE_NAMES[hoveredItem.id];
        ctx.font = '14px Arial';
        const textWidth = ctx.measureText(itemName).width;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(mouse.x + 15, mouse.y + 15, textWidth + 8, 20);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'left';
        ctx.fillText(itemName, mouse.x + 19, mouse.y + 29);
    }
}

function drawPlayer() {
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    ctx.scale(player.direction, 1);
    
    if (player.lastDamageTime > 0 && Math.floor(player.lastDamageTime / 4) % 2 === 0) {
        ctx.globalAlpha = 0.5;
    }

    const skin = '#E0A07E';
    const shirt = '#4080A0';
    const pants = '#304060';
    const hair = '#503010';
    
    const w = player.width;
    const h = player.height;
    const headSize = TILE_SIZE * 0.8;
    const bodyHeight = h - headSize;
    
    const headY = -h / 2 + headSize / 2;
    const bodyY = headY + headSize / 2 + (bodyHeight * 0.6) / 2;
    const legY = bodyY + (bodyHeight * 0.6) / 2;

    ctx.fillStyle = pants;
    const legHeight = bodyHeight * 0.4;
    const legWidth = w/2 * 0.7;
    
    if (player.state === 'walking') {
        const frame = Math.floor(player.animationFrame / 2);
        if (frame === 0) {
            ctx.fillRect(-legWidth - 1, legY, legWidth, legHeight * 0.9);
            ctx.fillRect(1, legY, legWidth, legHeight);
        } else {
            ctx.fillRect(-legWidth - 1, legY, legWidth, legHeight);
            ctx.fillRect(1, legY, legWidth, legHeight * 0.9);
        }
    } else {
        ctx.fillRect(-legWidth - 1, legY, legWidth, legHeight);
        ctx.fillRect(1, legY, legWidth, legHeight);
    }
    
    ctx.fillStyle = shirt;
    ctx.fillRect(-w/2 * 0.8, bodyY - (bodyHeight*0.6)/2, w*0.8, bodyHeight * 0.6);

    ctx.fillStyle = skin;
    ctx.fillRect(-headSize/2, headY - headSize/2, headSize, headSize);

    ctx.fillStyle = hair;
    // --- BUG FIX: Typo from headSiz to headSize ---
    ctx.fillRect(-headSize/2, headY - headSize/2, headSize, headSize/3); 

    ctx.restore();
}

function drawEnemies() {
    for (const enemy of enemies) {
        ctx.save();
        if (enemy.lastDamageTime > 0 && Math.floor(enemy.lastDamageTime / 4) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }
        
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(enemy.x + enemy.width * 0.2, enemy.y + enemy.height * 0.3, 2, 2);
        ctx.fillRect(enemy.x + enemy.width * 0.7, enemy.y + enemy.height * 0.3, 2, 2);
        
        ctx.restore();
    }
}

function drawHealthBar() {
    const numHearts = player.maxHealth / 10;
    const healthPerHeart = player.maxHealth / numHearts;
    const currentHeart = player.health / healthPerHeart;

    const heartSize = 20;
    const startX = canvas.width - (numHearts * (heartSize + 4)) - 10;
    const startY = 40;

    ctx.font = '16px Arial';
    ctx.fillStyle = '#FF0000'; // Red for hearts

    for (let i = 0; i < numHearts; i++) {
        let x = startX + i * (heartSize + 4);
        let heartFill = '♥';
        if (currentHeart <= i) {
            ctx.fillStyle = '#555555';
        } else {
            ctx.fillStyle = '#FF0000';
        }
        ctx.fillText(heartFill, x, startY + heartSize);
    }
}


function drawSprite(item, x, y, size) {
    if (!item) return;
    const spriteCoords = TILE_SPRITES[item.id];
    if (spriteCoords) {
        ctx.drawImage(
            textureAtlas,
            spriteCoords[0] * SPRITE_SIZE,
            spriteCoords[1] * SPRITE_SIZE,
            SPRITE_SIZE, SPRITE_SIZE,
            x, y, size, size
        );
    }
}

function drawSlotContents(slot, x, y) {
    const s = SLOT_SIZE;
    if (slot) {
        drawSprite(slot, x + 4, y + 4, s - 8);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(slot.count, x + s - 4, y + s - 4);
        ctx.textAlign = 'left';
    }
}

function drawHotbar() {
    const numSlots = 9;
    const slotSize = SLOT_SIZE;
    const padding = SLOT_PADDING;
    const totalWidth = numSlots * (slotSize + padding) - padding;
    const startX = (canvas.width / 2) - (totalWidth / 2);
    const startY = canvas.height - slotSize - 20;

    for (let i = 0; i < numSlots; i++) {
        const x = startX + i * (slotSize + padding);
        const y = startY;
        const slot = hotbarSlots[i];
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(x, y, slotSize, slotSize);

        drawSlotContents(slot, x, y);
        
        ctx.strokeStyle = '#8B8B8B';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, slotSize, slotSize);

        if (i === selectedSlot) {
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3;
            ctx.strokeRect(x - 2, y - 2, slotSize + 4, slotSize + 4);
        }
    }
}

function drawSlot(slot, x, y) {
    const s = SLOT_SIZE;
    ctx.fillStyle = '#707070'; // MODIFIED: Solid dark grey
    ctx.fillRect(x, y, s, s);
    drawSlotContents(slot, x, y);
}


function drawMainInventory(startX, startY) {
    const s = SLOT_SIZE;
    const p = SLOT_PADDING;
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 9; x++) {
            const i = y * 9 + x;
            const sx = startX + x * (s + p);
            const sy = startY + y * (s + p);
            slotCoords[`inv-${i}`] = { x: sx, y: sy };
            drawSlot(inventorySlots[i], sx, sy);
        }
    }
    const hotbarY = startY + 3 * (s + p) + 10;
    for (let x = 0; x < 9; x++) {
        const sx = startX + x * (s + p);
        const sy = hotbarY;
        slotCoords[`hotbar-${x}`] = { x: sx, y: sy };
        drawSlot(hotbarSlots[x], sx, sy);
    }
}

function drawPlayerInventoryScreen() {
    slotCoords = {};
    const s = SLOT_SIZE; const p = SLOT_PADDING;

    // --- NEW: Pop-up window dimensions ---
    const invGridWidth = 9 * (s + p) + p;
    const uiWidth = invGridWidth + 100; // Width for inventory + crafting/armor
    const uiHeight = (4 * (s + p) + p + 10) + 100; // Height for inv + crafting/armor
    
    const startX = (canvas.width - uiWidth) / 2;
    const startY = (canvas.height - uiHeight) / 2;
    
    // Draw the pop-up background
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(startX, startY, uiWidth, uiHeight);
    // Border
    ctx.strokeStyle = '#373737';
    ctx.lineWidth = 4;
    ctx.strokeRect(startX, startY, uiWidth, uiHeight);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX - 2, startY - 2, uiWidth + 4, uiHeight + 4);


    // --- 2x2 Crafting Grid ---
    const craftGridX = startX + uiWidth - (2 * (s+p) + 40 + (s+p)) - 20;
    const craftGridY = startY + 20;
    
    ctx.fillStyle = '#000000';
    ctx.font = '16px Arial';
    ctx.fillText('Crafting', craftGridX, craftGridY - 5);
    
    for (let y = 0; y < 2; y++) {
        for (let x = 0; x < 2; x++) {
            const i = y * 2 + x;
            const sx = craftGridX + x * (s + p);
            const sy = craftGridY + y * (s + p);
            slotCoords[`pCraft-${i}`] = { x: sx, y: sy };
            drawSlot(playerCraftingGrid[i], sx, sy);
        }
    }
    
    const outputX = craftGridX + 2.5 * (s + p);
    const outputY = craftGridY + (s + p) / 2;
    slotCoords['pCraftOut-0'] = { x: outputX, y: outputY };
    drawSlot(playerCraftingOutput, outputX, outputY);
    
    ctx.fillStyle = '#000000';
    ctx.font = '24px Arial';
    ctx.fillText('->', craftGridX + 2 * (s+p) - 5, outputY + s/1.5);

    // --- Player Doll & Armor ---
    const playerDollX = startX + 30;
    const playerDollY = startY + 20;
    
    // Draw "Steve" doll
    ctx.fillStyle = '#623B20'; // Hair
    ctx.fillRect(playerDollX, playerDollY, 40, 10);
    ctx.fillStyle = '#E0A07E'; // Skin
    ctx.fillRect(playerDollX, playerDollY + 10, 40, 10);
    ctx.fillStyle = '#44AACC'; // Shirt
    ctx.fillRect(playerDollX, playerDollY + 20, 40, 30);
    ctx.fillStyle = '#304060'; // Pants
    ctx.fillRect(playerDollX, playerDollY + 50, 40, 30);

    // Draw Armor Slots
    const armorSlotX = playerDollX + 50 + p;
    
    slotCoords['armor-0'] = { x: armorSlotX, y: playerDollY };
    drawSlot(helmetSlot, armorSlotX, playerDollY);
    
    slotCoords['armor-1'] = { x: armorSlotX, y: playerDollY + s + p };
    drawSlot(chestplateSlot, armorSlotX, playerDollY + s + p);
    
    slotCoords['armor-2'] = { x: armorSlotX, y: playerDollY + 2 * (s + p) };
    drawSlot(leggingsSlot, armorSlotX, playerDollY + 2 * (s + p));

    // --- Main Inventory ---
    const invGridX = (canvas.width - invGridWidth) / 2;
    const invGridY = startY + 130;
    drawMainInventory(invGridX, invGridY);
}

function drawCraftingTableUI() {
    slotCoords = {};
    const s = SLOT_SIZE; const p = SLOT_PADDING;
    
    const invGridWidth = 9 * (s + p) + p;
    const uiWidth = invGridWidth; // Crafting table UI is just inventory width
    const uiHeight = (4 * (s + p) + p + 10) + 110; // Taller for 3x3 grid
    
    const startX = (canvas.width - uiWidth) / 2;
    const startY = (canvas.height - uiHeight) / 2;
    
    // Draw the pop-up background
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(startX, startY, uiWidth, uiHeight);
    ctx.strokeStyle = '#373737';
    ctx.lineWidth = 4;
    ctx.strokeRect(startX, startY, uiWidth, uiHeight);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX - 2, startY - 2, uiWidth + 4, uiHeight + 4);
    
    
    const craftGridX = startX + 50;
    const craftGridY = startY + 20;
    
    ctx.fillStyle = '#000000';
    ctx.font = '18px Arial';
    ctx.fillText('Crafting', craftGridX, craftGridY - 5);
    
    // 3x3 Grid
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            const i = y * 3 + x;
            const sx = craftGridX + x * (s + p);
            const sy = craftGridY + y * (s + p);
            slotCoords[`tCraft-${i}`] = { x: sx, y: sy };
            drawSlot(tableCraftingGrid[i], sx, sy);
        }
    }
    
    const outputX = craftGridX + 4 * (s + p);
    const outputY = craftGridY + (s + p);
    slotCoords['tCraftOut-0'] = { x: outputX, y: outputY };
    drawSlot(tableCraftingOutput, outputX, outputY);
    
    ctx.fillStyle = '#000000';
    ctx.font = '30px Arial';
    ctx.fillText('->', craftGridX + 3 * (s+p) + 5, outputY + s/1.5);
    
    const invGridX = (canvas.width - invGridWidth) / 2;
    const invGridY = startY + 150;
    drawMainInventory(invGridX, invGridY);
}

function drawFurnaceUI() {
    slotCoords = {};
    const s = SLOT_SIZE; const p = SLOT_PADDING;

    const invGridWidth = 9 * (s + p) + p;
    const uiWidth = invGridWidth;
    const uiHeight = (4 * (s + p) + p + 10) + 110;
    
    const startX = (canvas.width - uiWidth) / 2;
    const startY = (canvas.height - uiHeight) / 2;

    // Draw the pop-up background
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(startX, startY, uiWidth, uiHeight);
    ctx.strokeStyle = '#373737';
    ctx.lineWidth = 4;
    ctx.strokeRect(startX, startY, uiWidth, uiHeight);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX - 2, startY - 2, uiWidth + 4, uiHeight + 4);
    
    const furnaceX = (canvas.width / 2) - (1.5 * (s + p));
    const furnaceY = startY + 20;
    
    ctx.fillStyle = '#000000';
    ctx.font = '18px Arial';
    ctx.fillText('Furnace', furnaceX, furnaceY - 5);
    
    const inputX = furnaceX; const inputY = furnaceY;
    slotCoords['furnaceIn-0'] = { x: inputX, y: inputY };
    drawSlot(furnaceInput, inputX, inputY);
    
    const fuelX = furnaceX; const fuelY = furnaceY + 2 * (s + p);
    slotCoords['furnaceFuel-0'] = { x: fuelX, y: fuelY };
    drawSlot(furnaceFuel, fuelX, fuelY);
    
    const outputX = furnaceX + 3 * (s + p);
    const outputY = furnaceY + 1 * (s + p);
    slotCoords['furnaceOut-0'] = { x: outputX, y: outputY };
    drawSlot(furnaceOutput, outputX, outputY);
    
    ctx.fillStyle = '#000000';
    ctx.font = '30px Arial';
    ctx.fillText('->', furnaceX + (s+p) + 10, outputY + s/1.5);
    
    // Progress bar
    ctx.fillStyle = '#444';
    ctx.fillRect(furnaceX, furnaceY + 1 * (s+p) + 10, s, 4);
    if(furnaceCookTime > 0) {
        ctx.fillStyle = '#FFD700';
        const progress = (COOK_TIME - furnaceCookTime) / COOK_TIME;
        ctx.fillRect(furnaceX, furnaceY + 1 * (s+p) + 10, s * progress, 4);
    }
    
    // Fuel bar
    ctx.fillStyle = '#444';
    ctx.fillRect(fuelX, fuelY - 8, s, 4);
    if(furnaceFuelTime > 0) {
        ctx.fillStyle = '#FF6347';
        const maxFuel = FUEL_TIMES[Object.keys(FUEL_TIMES).find(e=>furnaceFuelTime<FUEL_TIMES[e])] || 800;
        const progress = furnaceFuelTime / maxFuel;
        ctx.fillRect(fuelX, fuelY - 8, s * progress, 4);
    }

    const invGridX = (canvas.width - invGridWidth) / 2;
    const invGridY = startY + 150;
    drawMainInventory(invGridX, invGridY);
}


// --- 12. Main Game Loop ---
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// --- 13. Start the Game ---
function init() {
    console.log("Initializing game...");
    const spawnX = 8;
    const spawnY = findSurfaceY(spawnX) - 1;
    
    spawnPos.x = spawnX * TILE_SIZE;
    spawnPos.y = spawnY * TILE_SIZE - player.height;
    
    player.x = spawnPos.x;
    player.y = spawnPos.y;
    camera.x = player.x + (player.width / 2) - (canvas.width / 2 / camera.currentZoom);
    camera.y = player.y + (player.height / 2) - (canvas.height / 2 / camera.currentZoom);
    
    const playerChunkX = Math.floor(spawnX / CHUNK_SIZE);
    const playerChunkY = Math.floor(spawnY / CHUNK_SIZE);
    const renderDist = 2;
    for (let cy = playerChunkY - renderDist; cy <= playerChunkY + renderDist; cy++) {
        for (let cx = playerChunkX - renderDist; cx <= playerChunkX + renderDist; cx++) {
            getOrCreateChunk(cx, cy);
        }
    }
    
    console.log("Priming light queue...");
    for (const [key, chunk] of lightChunks.entries()) {
        const [chunkX, chunkY] = key.split(',').map(Number);
        for (let y = 0; y < CHUNK_SIZE; y++) {
            for (let x = 0; x < CHUNK_SIZE; x++) {
                if (chunk[y][x] > 0) {
                    const globalX = chunkX * CHUNK_SIZE + x;
                    const globalY = chunkY * CHUNK_SIZE + y;
                    lightQueue.push([globalX, globalY]);
                }
            }
        }
    }
    
    console.log(`Propagating initial light (${lightQueue.length} sources)...`);
    processLightQueue();
    console.log("Light propagated.");
    
    setupInputListeners();
    resizeCanvas();
    
    spawnEnemy(player.x + TILE_SIZE * 5, player.y);
    
    gameLoop();
    console.log("Game started!");
}

init();
