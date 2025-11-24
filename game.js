// --- GAME MAKER: v10.1 (Dynamic Spill Lighting - FIXED) ---
// --- 1. Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- 2. World Configuration ---
const TILE_SIZE = 20;
const CHUNK_SIZE = 16;

const TILES = {
    AIR: 0, GRASS: 1, DIRT: 2, STONE: 3, IRON: 4, COPPER: 5, DIAMOND: 6, COBALT: 7,
    PLATINUM: 8, WOOD_LOG: 9, LEAVES: 10, WOOD_PLANK: 11, CRAFTING_TABLE: 12, STICK: 13,
    COAL: 14, FURNACE: 15, TORCH: 16,
    WOOD_PICKAXE: 100, STONE_PICKAXE: 101, COPPER_PICKAXE: 102, IRON_PICKAXE: 103,
    DIAMOND_PICKAXE: 104, COBALT_PICKAXE: 105, PLATINUM_PICKAXE: 106,
    COPPER_INGOT: 107, IRON_INGOT: 108, DIAMOND_INGOT: 109, COBALT_INGOT: 110,
    PLATINUM_INGOT: 111
};
const TILE_NAMES = {
    [TILES.GRASS]: 'Grass', [TILES.DIRT]: 'Dirt', [TILES.STONE]: 'Stone', [TILES.IRON]: 'Iron Ore',
    [TILES.COPPER]: 'Copper Ore', [TILES.DIAMOND]: 'Diamond Ore', [TILES.COBALT]: 'Cobalt Ore',
    [TILES.PLATINUM]: 'Platinum Ore', [TILES.WOOD_LOG]: 'Wood Log', [TILES.LEAVES]: 'Leaves',
    [TILES.WOOD_PLANK]: 'Wood Plank', [TILES.CRAFTING_TABLE]: 'Crafting Table', [TILES.STICK]: 'Stick',
    [TILES.COAL]: 'Coal', [TILES.FURNACE]: 'Furnace', [TILES.TORCH]: 'Torch',
    [TILES.WOOD_PICKAXE]: 'Wood Pickaxe', [TILES.STONE_PICKAXE]: 'Stone Pickaxe',
    [TILES.COPPER_PICKAXE]: 'Copper Pickaxe', [TILES.IRON_PICKAXE]: 'Iron Pickaxe',
    [TILES.DIAMOND_PICKAXE]: 'Diamond Pickaxe', [TILES.COBALT_PICKAXE]: 'Cobalt Pickaxe',
    [TILES.PLATINUM_PICKAXE]: 'Platinum Pickaxe', [TILES.COPPER_INGOT]: 'Copper Ingot',
    [TILES.IRON_INGOT]: 'Iron Ingot', [TILES.DIAMOND_INGOT]: 'Diamond',
    [TILES.COBALT_INGOT]: 'Cobalt Ingot', [TILES.PLATINUM_INGOT]: 'Platinum Ingot'
};
const TILE_COLORS = {
    [TILES.AIR]: '#87CEEB', [TILES.GRASS]: '#34A853', [TILES.DIRT]: '#8B4513',
    [TILES.STONE]: '#808080', [TILES.IRON]: '#D2B48C', [TILES.COPPER]: '#B87333',
    [TILES.DIAMOND]: '#B9F2FF', [TILES.COBALT]: '#0047AB', [TILES.PLATINUM]: '#E5E4E2',
    [TILES.WOOD_LOG]: '#663300', [TILES.LEAVES]: '#006400', [TILES.WOOD_PLANK]: '#AF8F53',
    [TILES.CRAFTING_TABLE]: '#A07040', [TILES.STICK]: '#8B4513', [TILES.COAL]: '#2E2E2E',
    [TILES.FURNACE]: '#505050', [TILES.TORCH]: '#FFA500',
    [TILES.WOOD_PICKAXE]: '#AF8F53', [TILES.STONE_PICKAXE]: '#808080', [TILES.COPPER_PICKAXE]: '#B87333',
    [TILES.IRON_PICKAXE]: '#D2B48C', [TILES.DIAMOND_PICKAXE]: '#B9F2FF', [TILES.COBALT_PICKAXE]: '#0047AB',
    [TILES.PLATINUM_PICKAXE]: '#E5E4E2', [TILES.COPPER_INGOT]: '#B87333', [TILES.IRON_INGOT]: '#D2B4D2',
    [TILES.DIAMOND_INGOT]: '#B9F2FF', [TILES.COBALT_INGOT]: '#0047AB', [TILES.PLATINUM_INGOT]: '#E5E4E2'
};

const BLOCK_OPACITY = {
    [TILES.AIR]: 1,
    [TILES.LEAVES]: 2, // Leaves dim light
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
    [TILES.DIAMOND]: 3, [TILES.COBALT]: 4, [TILES.PLATINUM]: 5
};
const TOOL_TIER = {
    [TILES.WOOD_PICKAXE]: 1, [TILES.STONE_PICKAXE]: 2, [TILES.COPPER_PICKAXE]: 3,
    [TILES.IRON_PICKAXE]: 3, [TILES.DIAMOND_PICKAXE]: 4, [TILES.COBALT_PICKAXE]: 5,
    [TILES.PLATINUM_PICKAXE]: 6
};

const worldChunks = new Map();
const lightChunks = new Map();

// --- 3. Game State ---
let player = {
    x: 0, y: 0, width: TILE_SIZE * 0.8,
    height: TILE_SIZE * 1.8, vx: 0, vy: 0, isOnGround: false
};
let camera = { x: 0, y: 0 };
let keys = { w: false, a: false, d: false, e: false };
let mouse = { x: 0, y: 0, tileX: 0, tileY: 0, heldItem: null };
const GRAVITY = 0.3;
const JUMP_STRENGTH = -8;
const MOVE_SPEED = 3;
const INTERACTION_RANGE = 4;
const CAMERA_SMOOTH_FACTOR = 0.1;

let hotbarSlots = new Array(9).fill(null);
let inventorySlots = new Array(27).fill(null);
let selectedSlot = 0;

let isCraftingOpen = false;
let isFurnaceOpen = false;
let craftingGrid = new Array(9).fill(null);
let craftingOutput = null;

let furnaceInput = null;
let furnaceFuel = null;
let furnaceOutput = null;
let furnaceCookTime = 0;
let furnaceFuelTime = 0;
const COOK_TIME = 200;

// --- Light Engine ---
const MAX_LIGHT = 15;
const AMBIENT_LIGHT_LEVEL = MAX_LIGHT;
let lightQueue = [];
let removeQueue = [];

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
    
    // Pass 1: Terrain
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
    
    // Pass 2: Trees
    for (let x = 0; x < CHUNK_SIZE; x++) {
        for (let y = 0; y < CHUNK_SIZE; y++) {
            if (chunk[y][x] === TILES.GRASS && y > 0 && chunk[y-1][x] === TILES.AIR) {
                if (Math.random() < 0.05) {
                    generateTreeInChunk(chunk, x, y - 1);
                }
            }
        }
    }

    // Pass 3: Sunlight
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
    setLeaf(0, leafBaseY - 2);
    setLeaf(-1, leafBaseY - 1); setLeaf(0, leafBaseY - 1); setLeaf(1, leafBaseY - 1);
    setLeaf(-2, leafBaseY); setLeaf(-1, leafBaseY); setLeaf(1, leafBaseY); setLeaf(2, leafBaseY);
    setLeaf(-2, leafBaseY + 1); setLeaf(-1, leafBaseY + 1); setLeaf(1, leafBaseY + 1); setLeaf(2, leafBaseY + 1);
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
        if (isCraftingOpen || isFurnaceOpen) {
             if (e.key === 'e' || e.key === 'E' || e.key === 'Escape') {
                if (!keys.e) {
                    isCraftingOpen = false;
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
                isCraftingOpen = true;
                isFurnaceOpen = false;
            }
            keys.e = true;
        }
        if (e.key >= '1' && e.key <= '9') selectedSlot = parseInt(e.key) - 1;
    });
    window.addEventListener('keyup', (e) => {
        if (e.key === 'w' || e.key === 'W' || e.key === ' ') keys.w = false;
        if (e.key === 'a' || e.key === 'A') keys.a = false;
        if (e.key === 'd' || e.key === 'D') keys.d = false;
        if (e.key === 'e' || e.key === 'E' || e.key === 'Escape') keys.e = false;
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        let mouseWorldX = mouse.x + camera.x;
        let mouseWorldY = mouse.y + camera.y;
        mouse.tileX = toTileCoord(mouseWorldX);
        mouse.tileY = toTileCoord(mouseWorldY);
    });
    
    canvas.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const isShiftClick = e.shiftKey;
        if (isCraftingOpen) {
            handleInventoryClick(e.button, 'crafting', isShiftClick);
        } else if (isFurnaceOpen) {
            handleInventoryClick(e.button, 'furnace', isShiftClick);
        } else {
            if (e.button === 0) mineBlock();
            if (e.button === 2) handleRightClick();
        }
    });
    
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    window.addEventListener('wheel', (e) => {
        if (isCraftingOpen || isFurnaceOpen) return;
        if (e.deltaY > 0) {
            selectedSlot++;
            if (selectedSlot > 8) selectedSlot = 0;
        } else if (e.deltaY < 0) {
            selectedSlot--;
            if (selectedSlot < 0) selectedSlot = 8;
        }
    });
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// --- 8. Interaction Logic ---
function updateSunlightColumn(tileX) {
    let sunBlocked = false;
    let surfaceY = findSurfaceY(tileX);
    
    // Check from sky down to a reasonable depth
    for (let y = 0; y < 100; y++) { // Assume reasonable world height
        const tileId = getTile(tileX, y);
        let light = 0;
        
        if (!sunBlocked) {
            if (y < surfaceY) {
                if (isBlockSolid(tileId)) {
                    sunBlocked = true;
                } else {
                    light = AMBIENT_LIGHT_LEVEL;
                }
            } else {
                sunBlocked = true;
            }
        }
        
        if (tileId === TILES.TORCH) {
            light = 14;
        }
        
        setLight(tileX, y, light);
    }
}

function handleRightClick() {
    const playerTileX = toTileCoord(player.x + player.width / 2);
    const playerTileY = toTileCoord(player.y + player.height / 2);
    const dist = Math.sqrt(Math.pow(playerTileX - mouse.tileX, 2) + Math.pow(playerTileY - mouse.tileY, 2));
    if (dist > INTERACTION_RANGE) return;
    
    const block = getTile(mouse.tileX, mouse.tileY);
    const slot = hotbarSlots[selectedSlot]; // Check what item we're holding
    
    if (block === TILES.CRAFTING_TABLE) {
        isCraftingOpen = true; isFurnaceOpen = false;
    } else if (block === TILES.FURNACE) {
        isCraftingOpen = false; isFurnaceOpen = true;
    } else if (block === TILES.AIR || (slot && slot.id === TILES.TORCH && !isBlockSolid(block))) { 
        // Allow placing blocks in air
        // OR placing torches on non-solid blocks (like leaves)
        placeBlock();
    }
}

function mineBlock() {
    const playerTileX = toTileCoord(player.x + player.width / 2);
    const playerTileY = toTileCoord(player.y + player.height / 2);
    const dist = Math.sqrt(Math.pow(playerTileX - mouse.tileX, 2) + Math.pow(playerTileY - mouse.tileY, 2));
    if (dist > INTERACTION_RANGE) return;
    
    const tileType = getTile(mouse.tileX, mouse.tileY);
    if (tileType === TILES.AIR) return;
    
    const requiredTier = BLOCK_TIER[tileType] ?? 0;
    const heldSlot = hotbarSlots[selectedSlot];
    const toolTier = heldSlot ? (TOOL_TIER[heldSlot.id] ?? 0) : 0;
    
    if (toolTier >= requiredTier) {
        addBlockToInventory(tileType);
        setTile(mouse.tileX, mouse.tileY, TILES.AIR);
        
        // --- BUG FIX ---
        // Call setLight(x,y,0) instead of the non-existent removeLight()
        if (tileType === TILES.TORCH) {
            setLight(mouse.tileX, mouse.tileY, 0); // This will queue a light removal
        } else if (isBlockSolid(tileType)) {
            // Blocked light, so re-propagate
            updateSunlightColumn(mouse.tileX);
            lightQueue.push([mouse.tileX + 1, mouse.tileY]);
            lightQueue.push([mouse.tileX - 1, mouse.tileY]);
            lightQueue.push([mouse.tileX, mouse.tileY + 1]);
            lightQueue.push([mouse.tileX, mouse.tileY - 1]);
        }
    } else {
        console.log(`Need tier ${requiredTier} pickaxe!`);
    }
}

function placeBlock() {
    const slot = hotbarSlots[selectedSlot];
    if (!slot) return;
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
            // --- BUG FIX ---
            // Call setLight(x,y,0) instead of the non-existent removeLight()
            setLight(mouse.tileX, mouse.tileY, 0);
            updateSunlightColumn(mouse.tileX);
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
            else if (arrayName === 'crafting') { slotArray = craftingGrid; setter = (item) => craftingGrid[index] = item; }
            else if (arrayName === 'furnaceIn') { slotArray = [furnaceInput]; setter = (item) => furnaceInput = item; }
            else if (arrayName === 'furnaceFuel') { slotArray = [furnaceFuel]; setter = (item) => furnaceFuel = item; }
            else if (arrayName === 'craftingOut') {
                handleOutputClick(craftingOutput, 'crafting', (item) => craftingOutput = item, isShiftClicking);
                return;
            } else if (arrayName === 'furnaceOut') {
                handleOutputClick(furnaceOutput, 'furnace', (item) => furnaceOutput = item, isShiftClicking);
                return;
            }

            if (isShiftClicking && arrayName !== 'craftingOut' && arrayName !== 'furnaceOut') {
                quickMoveItem(slotArray, index, fromArea, setter);
            } else if (slotArray) {
                handleSlotClick(slotArray, index, button, setter);
            }
            
            if (uiType === 'crafting') checkCrafting();
            return;
        }
    }
}

function quickMoveItem(slotArray, index, fromArea, setter) {
    let itemStack = slotArray[index];
    if (!itemStack) return;
    let remainingStack = null;
    if (fromArea === 'crafting' || fromArea === 'furnaceIn' || fromArea === 'furnaceFuel' || fromArea === 'furnaceOut') {
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
    if (uiType === 'crafting') {
        setter(null);
        for (let i = 0; i < craftingGrid.length; i++) {
            if (craftingGrid[i]) {
                craftingGrid[i].count--;
                if (craftingGrid[i].count <= 0) craftingGrid[i] = null;
            }
        }
        checkCrafting();
    } else if (uiType === 'furnace') {
        setter(null);
    }
}

/**
 * --- BUG FIX ---
 * This function now correctly checks for shapeless recipes
 * with multiple, different ingredients.
 */
function checkCrafting() {
    craftingOutput = null;
    const gridIds = craftingGrid.map(slot => slot ? slot.id : null);
    const gridIsEmpty = gridIds.every(id => id === null);
    if (gridIsEmpty) return;

    for (const key in CRAFTING_RECIPES) {
        const recipe = CRAFTING_RECIPES[key];
        
        if (recipe.type === 'shapeless') {
            let gridItems = gridIds.filter(id => id !== null); // Get all non-null items
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
                craftingOutput = { ...recipe.output };
                return;
            }
        } else if (recipe.type === 'shaped') {
            const pattern = recipe.pattern;
            const pHeight = pattern.length;
            const pWidth = pattern[0].length;
            
            let match = true;
            for(let y=0; y<3; y++) {
                for(let x=0; x<3; x++) {
                    const gridIndex = y * 3 + x;
                    const gridId = gridIds[gridIndex];
                    const patternId = (y < pHeight && x < pWidth) ? pattern[y][x] : null;
                    if (gridId !== patternId) {
                        match = false;
                        break;
                    }
                }
                if (!match) break;
            }

            if (match) {
                craftingOutput = { ...recipe.output };
                return;
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
    if (!isCraftingOpen && !isFurnaceOpen) {
        if (keys.a) player.vx = -MOVE_SPEED;
        else if (keys.d) player.vx = MOVE_SPEED;
        else player.vx = 0;
        if (keys.w && player.isOnGround) {
            player.vy = JUMP_STRENGTH;
            player.isOnGround = false;
        }

        player.vy += GRAVITY;
        let newY = player.y + player.vy;
        if (player.vy > 0) {
            let tileX1 = toTileCoord(player.x);
            let tileX2 = toTileCoord(player.x + player.width);
            let tileY = toTileCoord(newY + player.height);
            if (isTileSolid(tileX1, tileY) || isTileSolid(tileX2, tileY)) {
                player.vy = 0; player.y = (tileY * TILE_SIZE) - player.height; player.isOnGround = true;
            } else {
                player.y = newY; player.isOnGround = false;
            }
        } else if (player.vy < 0) {
            let tileX1 = toTileCoord(player.x);
            let tileX2 = toTileCoord(player.x + player.width);
            let tileY = toTileCoord(newY);
            if (isTileSolid(tileX1, tileY) || isTileSolid(tileX2, tileY)) {
                player.vy = 0; player.y = (tileY * TILE_SIZE) + TILE_SIZE;
            } else {
                player.y = newY;
            }
        }
        
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
    
    if (isFurnaceOpen) {
        updateFurnace();
    }
    
    // --- Light Engine Processing ---
    processLightQueue();
    processRemoveQueue();

    // Chunk Loading
    const playerChunkX = Math.floor(toTileCoord(player.x + player.width/2) / CHUNK_SIZE);
    const playerChunkY = Math.floor(toTileCoord(player.y + player.height/2) / CHUNK_SIZE);
    const renderDist = 2;
    for (let cy = playerChunkY - renderDist; cy <= playerChunkY + renderDist; cy++) {
        for (let cx = playerChunkX - renderDist; cx <= playerChunkX + renderDist; cx++) {
            getOrCreateChunk(cx, cy);
        }
    }

    // Camera
    let targetCamX = player.x - (canvas.width / 2) + (player.width / 2);
    let targetCamY = player.y - (canvas.height / 2);
    camera.x += (targetCamX - camera.x) * CAMERA_SMOOTH_FACTOR;
    camera.y += (targetCamY - camera.y) * CAMERA_SMOOTH_FACTOR;
    if (Math.abs(targetCamX - camera.x) < 0.1) camera.x = targetCamX;
    if (Math.abs(targetCamY - camera.y) < 0.1) camera.y = targetCamY;
}

// --- Light Processing Functions ---
function processLightQueue() {
    let limit = 1000;
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
    let limit = 1000;
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

function isTileSolid(tileX, tileY) {
    const tileType = getTile(tileX, tileY);
    return isBlockSolid(tileType);
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
    ctx.translate(Math.round(-camera.x), Math.round(-camera.y));

    const startTileX = toTileCoord(camera.x);
    const endTileX = startTileX + toTileCoord(canvas.width) + 2;
    const startTileY = toTileCoord(camera.y);
    const endTileY = startTileY + toTileCoord(canvas.height) + 2;

    for (let y = startTileY; y < endTileY; y++) {
        for (let x = startTileX; x < endTileX; x++) {
            const tileType = getTile(x, y);
            const baseColor = TILE_COLORS[tileType];
            
            const lightLevel = getLight(x, y) / MAX_LIGHT;
            
            if (tileType === TILES.AIR && lightLevel === 0) {
                ctx.fillStyle = '#000000';
            } else {
                ctx.fillStyle = blendColor(baseColor, lightLevel);
            }
            
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    ctx.fillStyle = '#FF0000';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    const playerTileX = toTileCoord(player.x + player.width / 2);
    const playerTileY = toTileCoord(player.y + player.height / 2);
    const dist = Math.sqrt(Math.pow(playerTileX - mouse.tileX, 2) + Math.pow(playerTileY - mouse.tileY, 2));
    if (dist <= INTERACTION_RANGE) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.strokeRect(mouse.tileX * TILE_SIZE, mouse.tileY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
    
    ctx.restore();

    // --- DRAW UI ---
    if (!isCraftingOpen && !isFurnaceOpen) {
        drawHotbar();
    }
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.textAlign = "right";
    const tX = toTileCoord(player.x + player.width / 2);
    const tY = toTileCoord(player.y + player.height / 2);
    ctx.fillText(`Player: ${tX}, ${tY}`, canvas.width - 10, 20);
    ctx.textAlign = "left";
    if (isCraftingOpen) {
        drawCraftingUI();
    } else if (isFurnaceOpen) {
        drawFurnaceUI();
    }
    if (mouse.heldItem) {
        ctx.fillStyle = TILE_COLORS[mouse.heldItem.id];
        ctx.fillRect(mouse.x - (SLOT_SIZE/2) + 4, mouse.y - (SLOT_SIZE/2) + 4, SLOT_SIZE - 8, SLOT_SIZE - 8);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(mouse.heldItem.count, mouse.x + SLOT_SIZE/2 - 4, mouse.y + SLOT_SIZE/2 - 4);
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
        drawSlot(slot, x, y);
        if (i === selectedSlot) {
            ctx.strokeStyle = '#FFFF00';
            ctx.lineWidth = 3;
            ctx.strokeRect(x - 1, y - 1, slotSize + 2, slotSize + 2);
        }
    }
}

function drawPlayerInventoryUI(startX, startY) {
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

function drawCraftingUI() {
    slotCoords = {};
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const s = SLOT_SIZE; const p = SLOT_PADDING;
    const craftGridX = (canvas.width / 2) - 100;
    const craftGridY = (canvas.height / 2) - 100;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '18px Arial';
    ctx.fillText('Crafting', craftGridX, craftGridY - 10);
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            const i = y * 3 + x;
            const sx = craftGridX + x * (s + p);
            const sy = craftGridY + y * (s + p);
            slotCoords[`crafting-${i}`] = { x: sx, y: sy };
            drawSlot(craftingGrid[i], sx, sy);
        }
    }
    const outputX = craftGridX + 4 * (s + p);
    const outputY = craftGridY + (s + p);
    slotCoords['craftingOut-0'] = { x: outputX, y: outputY };
    drawSlot(craftingOutput, outputX, outputY);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '30px Arial';
    ctx.fillText('->', craftGridX + 3 * (s+p), outputY + s/1.5);
    const invGridWidth = 9 * (s + p) - p;
    const invGridX = (canvas.width / 2) - (invGridWidth / 2);
    const invGridY = (canvas.height / 2) + 20;
    drawPlayerInventoryUI(invGridX, invGridY);
}

function drawFurnaceUI() {
    slotCoords = {};
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const s = SLOT_SIZE; const p = SLOT_PADDING;
    const furnaceX = (canvas.width / 2) - 100;
    const furnaceY = (canvas.height / 2) - 100;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '18px Arial';
    ctx.fillText('Furnace', furnaceX, furnaceY - 10);
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
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '30px Arial';
    ctx.fillText('->', furnaceX + 2 * (s+p) - 10, outputY + s/1.5);
    ctx.fillStyle = '#444';
    ctx.fillRect(furnaceX, furnaceY + 1 * (s+p) + 10, s, 4);
    if(furnaceCookTime > 0) {
        ctx.fillStyle = '#FFD700';
        const progress = (COOK_TIME - furnaceCookTime) / COOK_TIME;
        ctx.fillRect(furnaceX, furnaceY + 1 * (s+p) + 10, s * progress, 4);
    }
    ctx.fillStyle = '#444';
    ctx.fillRect(fuelX, fuelY - 8, s, 4);
    if(furnaceFuelTime > 0) {
        ctx.fillStyle = '#FF6347';
        const maxFuel = FUEL_TIMES[Object.keys(FUEL_TIMES).find(e=>furnaceFuelTime<FUEL_TIMES[e])] || 800;
        const progress = furnaceFuelTime / maxFuel;
        ctx.fillRect(fuelX, fuelY - 8, s * progress, 4);
    }
    const invGridWidth = 9 * (s + p) - p;
    const invGridX = (canvas.width / 2) - (invGridWidth / 2);
    const invGridY = (canvas.height / 2) + 20;
    drawPlayerInventoryUI(invGridX, invGridY);
}

function drawSlot(slot, x, y) {
    const s = SLOT_SIZE;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x, y, s, s);
    if (slot) {
        ctx.fillStyle = TILE_COLORS[slot.id];
        ctx.fillRect(x + 4, y + 4, s - 8, s - 8);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(slot.count, x + s - 4, y + s - 4);
        ctx.textAlign = 'left';
    }
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
    player.x = spawnX * TILE_SIZE;
    player.y = spawnY * TILE_SIZE - player.height;
    camera.x = player.x - (canvas.width / 2) + (player.width / 2);
    camera.y = player.y - (canvas.height / 2);
    const playerChunkX = Math.floor(spawnX / CHUNK_SIZE);
    const playerChunkY = Math.floor(spawnY / CHUNK_SIZE);
    const renderDist = 2;
    for (let cy = playerChunkY - renderDist; cy <= playerChunkY + renderDist; cy++) {
        for (let cx = playerChunkX - renderDist; cx <= playerChunkX + renderDist; cx++) {
            getOrCreateChunk(cx, cy);
        }
    }
    
    // Initial light propagation
    console.log("Propagating initial light...");
    processLightQueue();
    console.log("Light propagated.");
    
    setupInputListeners();
    resizeCanvas();
    gameLoop();
    console.log("Game started!");
}

// Start the game!
init();
