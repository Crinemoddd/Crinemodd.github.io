// --- GAME MAKER: v6 (Furnace & Tiers) ---
// --- 1. Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// NOTE: SimplexNoise is loaded from index.html

// --- 2. World Configuration ---
const TILE_SIZE = 10;
const WORLD_WIDTH_TILES = 100;
const WORLD_HEIGHT_TILES = 60;

// REFACTORED: Added many new blocks and items
const TILES = {
    AIR: 0,
    GRASS: 1,
    DIRT: 2,
    STONE: 3,
    IRON: 4,
    COPPER: 5,
    DIAMOND: 6,
    COBALT: 7,
    PLATINUM: 8,
    WOOD_LOG: 9,
    LEAVES: 10,
    WOOD_PLANK: 11,
    CRAFTING_TABLE: 12,
    STICK: 13,
    COAL: 14,
    FURNACE: 15,
    WOOD_PICKAXE: 100, // Items start at 100
    STONE_PICKAXE: 101,
    COPPER_PICKAXE: 102,
    IRON_PICKAXE: 103,
    DIAMOND_PICKAXE: 104,
    COBALT_PICKAXE: 105,
    PLATINUM_PICKAXE: 106,
    COPPER_INGOT: 107,
    IRON_INGOT: 108,
    DIAMOND_INGOT: 109, // Using "Diamond" as its own ingot for simplicity
    COBALT_INGOT: 110,
    PLATINUM_INGOT: 111
};

const TILE_NAMES = {
    [TILES.GRASS]: 'Grass', [TILES.DIRT]: 'Dirt', [TILES.STONE]: 'Stone',
    [TILES.IRON]: 'Iron Ore', [TILES.COPPER]: 'Copper Ore', [TILES.DIAMOND]: 'Diamond Ore',
    [TILES.COBALT]: 'Cobalt Ore', [TILES.PLATINUM]: 'Platinum Ore', [TILES.WOOD_LOG]: 'Wood Log',
    [TILES.LEAVES]: 'Leaves', [TILES.WOOD_PLANK]: 'Wood Plank', [TILES.CRAFTING_TABLE]: 'Crafting Table',
    [TILES.STICK]: 'Stick', [TILES.COAL]: 'Coal', [TILES.FURNACE]: 'Furnace',
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
    [TILES.FURNACE]: '#505050',
    // Item "colors" (for UI)
    [TILES.WOOD_PICKAXE]: '#AF8F53', [TILES.STONE_PICKAXE]: '#808080', [TILES.COPPER_PICKAXE]: '#B87333',
    [TILES.IRON_PICKAXE]: '#D2B48C', [TILES.DIAMOND_PICKAXE]: '#B9F2FF', [TILES.COBALT_PICKAXE]: '#0047AB',
    [TILES.PLATINUM_PICKAXE]: '#E5E4E2', [TILES.COPPER_INGOT]: '#B87333', [TILES.IRON_INGOT]: '#D2B48C',
    [TILES.DIAMOND_INGOT]: '#B9F2FF', [TILES.COBALT_INGOT]: '#0047AB', [TILES.PLATINUM_INGOT]: '#E5E4E2'
};

const MAX_STACK = 64;

// NEW: Mining Progression Tiers
// Hand=0, Wood=1, Stone=2, Iron/Copper=3, Diamond=4, Cobalt=5, Plat=6
const BLOCK_TIER = {
    [TILES.DIRT]: 0, [TILES.GRASS]: 0, [TILES.WOOD_LOG]: 0, [TILES.LEAVES]: 0,
    [TILES.STONE]: 1, [TILES.COAL]: 1,
    [TILES.COPPER]: 2, [TILES.IRON]: 2,
    [TILES.DIAMOND]: 3,
    [TILES.COBALT]: 4,
    [TILES.PLATINUM]: 5
};
// Tools that are not pickaxes have a tier of 0
const TOOL_TIER = {
    [TILES.WOOD_PICKAXE]: 1,
    [TILES.STONE_PICKAXE]: 2,
    [TILES.COPPER_PICKAXE]: 3,
    [TILES.IRON_PICKAXE]: 3, // Iron is same as Copper
    [TILES.DIAMOND_PICKAXE]: 4,
    [TILES.COBALT_PICKAXE]: 5,
    [TILES.PLATINUM_PICKAXE]: 6
};

let worldData = [];

// --- 3. Game State ---
let player = {
    x: (WORLD_WIDTH_TILES * TILE_SIZE) / 2, // Pixel position
    y: 0,
    width: TILE_SIZE * 0.8,
    height: TILE_SIZE * 1.8,
    vx: 0, // Velocity x
    vy: 0, // Velocity y
    isOnGround: false
};
let camera = { x: 0, y: 0 };
let keys = { w: false, a: false, d: false, e: false };
let mouse = { x: 0, y: 0, tileX: 0, tileY: 0, heldItem: null };
const GRAVITY = 0.3;
const JUMP_STRENGTH = -8;
const MOVE_SPEED = 3;
const INTERACTION_RANGE = 4;

// Slotted Inventory
let hotbarSlots = new Array(9).fill(null);
let inventorySlots = new Array(27).fill(null);
let selectedSlot = 0;

// UI State
let isCraftingOpen = false;
let isFurnaceOpen = false; // NEW
let craftingGrid = new Array(9).fill(null);
let craftingOutput = null;

// NEW: Furnace State
let furnaceInput = null;
let furnaceFuel = null;
let furnaceOutput = null;
let furnaceCookTime = 0; // Ticks remaining
let furnaceFuelTime = 0; // Fuel ticks remaining
const COOK_TIME = 200; // Ticks to cook one item

// Initialize simplex noise (it's loaded in index.html)
const simplex = new SimplexNoise();

// --- 4. Recipe Databases ---
// REFACTORED: Renamed and expanded
const CRAFTING_RECIPES = {
    WOOD_PLANK: {
        type: 'shapeless', input: [{ id: TILES.WOOD_LOG, count: 1 }],
        output: { id: TILES.WOOD_PLANK, count: 4 }
    },
    STICK: {
        type: 'shaped', pattern: [[TILES.WOOD_PLANK], [TILES.WOOD_PLANK]],
        output: { id: TILES.STICK, count: 4 }
    },
    CRAFTING_TABLE: {
        type: 'shaped', pattern: [[TILES.WOOD_PLANK, TILES.WOOD_PLANK], [TILES.WOOD_PLANK, TILES.WOOD_PLANK]],
        output: { id: TILES.CRAFTING_TABLE, count: 1 }
    },
    FURNACE: { // NEW
        type: 'shaped',
        pattern: [
            [TILES.STONE, TILES.STONE, TILES.STONE],
            [TILES.STONE, null, TILES.STONE],
            [TILES.STONE, TILES.STONE, TILES.STONE]
        ],
        output: { id: TILES.FURNACE, count: 1 }
    }
    // All pickaxe recipes will be added
};

// NEW: Helper to add all pickaxe recipes
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
addPickaxeRecipes(); // Add them!

// NEW: Smelting and Fuel DBs
const SMELT_RECIPES = {
    [TILES.COPPER_ORE]: TILES.COPPER_INGOT,
    [TILES.IRON_ORE]: TILES.IRON_INGOT,
    [TILES.DIAMOND]: TILES.DIAMOND_INGOT,
    [TILES.COBALT]: TILES.COBALT_INGOT,
    [TILES.PLATINUM]: TILES.PLATINUM_INGOT,
    [TILES.WOOD_LOG]: TILES.COAL // Can make charcoal (uses Coal ID for simplicity)
};
const FUEL_TIMES = {
    [TILES.WOOD_LOG]: 150,
    [TILES.WOOD_PLANK]: 75,
    [TILES.COAL]: 800
};

// --- 5. World Generation ---
// MODIFIED: Added Coal
function generateWorld() {
    console.log("Generating world...");
    worldData = new Array(WORLD_HEIGHT_TILES).fill(0).map(() => new Array(WORLD_WIDTH_TILES).fill(TILES.AIR));
    
    let playerSpawnY = 0;
    const playerSpawnX_Tile = Math.floor(WORLD_WIDTH_TILES / 2);
    const baseHeight = 30;
    const terrainHeightScale = 50;
    const terrainHeightAmount = 15;
    const oreNoiseScale = 10;
    const caveNoiseScale = 25;

    for (let x = 0; x < WORLD_WIDTH_TILES; x++) {
        let heightNoise = simplex.noise2D(x / terrainHeightScale, 0);
        let surfaceY = Math.floor(baseHeight + heightNoise * terrainHeightAmount);

        if (x === playerSpawnX_Tile) {
            playerSpawnY = (surfaceY * TILE_SIZE) - player.height;
        }

        for (let y = 0; y < WORLD_HEIGHT_TILES; y++) {
            if (y < surfaceY) {
                worldData[y][x] = TILES.AIR;
            } else if (y === surfaceY) {
                worldData[y][x] = TILES.GRASS;
            } else if (y > surfaceY && y < surfaceY + 5) {
                worldData[y][x] = TILES.DIRT;
            } else if (y >= surfaceY + 5) { // Underground
                worldData[y][x] = TILES.STONE;
                let oreNoise = simplex.noise2D(x / oreNoiseScale, y / oreNoiseScale);
                
                // NEW: Added COAL
                if (oreNoise > 0.6) worldData[y][x] = TILES.COAL;
                else if (oreNoise > 0.7) worldData[y][x] = TILES.COPPER;
                else if (oreNoise > 0.75) worldData[y][x] = TILES.IRON;
                else if (oreNoise > 0.8) worldData[y][x] = TILES.DIAMOND;
                else if (oreNoise > 0.85) worldData[y][x] = TILES.COBALT;
                else if (oreNoise > 0.9) worldData[y][x] = TILES.PLATINUM;
            }
            
            // Generate Caves
            if (worldData[y][x] === TILES.DIRT || worldData[y][x] === TILES.STONE) {
                let caveNoise = simplex.noise2D(x / caveNoiseScale, y / caveNoiseScale);
                if (caveNoise > 0.6) {
                    worldData[y][x] = TILES.AIR;
                }
            }
        }
    }
    
    // NEW: Generate Trees (after terrain)
    for (let x = 0; x < WORLD_WIDTH_TILES; x++) {
        for (let y = 0; y < WORLD_HEIGHT_TILES; y++) {
            // If this is a grass block and a random check passes
            if (worldData[y][x] === TILES.GRASS && Math.random() < 0.05) {
                generateTree(x, y - 1); // Start tree one block above grass
            }
        }
    }

    player.x = playerSpawnX_Tile * TILE_SIZE;
    player.y = playerSpawnY;
    console.log("World generated.");
}

// NEW: Function to grow a single tree
function generateTree(x, y) {
    const trunkHeight = Math.floor(Math.random() * 3) + 4; // 4-6 blocks high
    // Place trunk
    for (let i = 0; i < trunkHeight; i++) {
        if (y - i < 0) continue; // Don't go off-world
        worldData[y - i][x] = TILES.WOOD_LOG;
    }
    // Place leaves (a 5x5 blob)
    const topY = y - trunkHeight;
    for (let ly = -2; ly <= 2; ly++) {
        for (let lx = -2; lx <= 2; lx++) {
            if (lx === 0 && ly > 0) continue; // Don't overwrite trunk
            const newX = x + lx;
            const newY = topY + ly;
            if (newX < 0 || newX >= WORLD_WIDTH_TILES || newY < 0 || newY >= WORLD_HEIGHT_TILES) continue;
            if (worldData[newY][newX] === TILES.AIR) {
                worldData[newY][newX] = TILES.LEAVES;
            }
        }
    }
}

// --- 6. Inventory Helpers ---
function addBlockToInventory(tileType) {
    if (tileType === TILES.AIR || tileType === TILES.LEAVES) return;
    
    // 1. Try to stack in hotbar
    for (let i = 0; i < hotbarSlots.length; i++) {
        let slot = hotbarSlots[i];
        if (slot && slot.id === tileType && slot.count < MAX_STACK) {
            slot.count++;
            return;
        }
    }
    // 2. Try to stack in main inventory
    for (let i = 0; i < inventorySlots.length; i++) {
        let slot = inventorySlots[i];
        if (slot && slot.id === tileType && slot.count < MAX_STACK) {
            slot.count++;
            return;
        }
    }
    // 3. Find empty hotbar slot
    for (let i = 0; i < hotbarSlots.length; i++) {
        if (hotbarSlots[i] === null) {
            hotbarSlots[i] = { id: tileType, count: 1 };
            return;
        }
    }
    // 4. Find empty main inventory slot
    for (let i = 0; i < inventorySlots.length; i++) {
        if (inventorySlots[i] === null) {
            inventorySlots[i] = { id: tileType, count: 1 };
            return;
        }
    }
}

function removeBlockFromInventory(slotArray, slotIndex) {
    let slot = slotArray[slotIndex];
    if (slot) {
        slot.count--;
        if (slot.count <= 0) {
            slotArray[slotIndex] = null; // Slot is now empty
        }
        return true;
    }
    return false;
}

// --- 7. Input Handlers ---
function setupInputListeners() {
    window.addEventListener('keydown', (e) => {
        if (isCraftingOpen || isFurnaceOpen) { // Don't move if UI is open
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
        
        // World interaction
        if (e.key === 'w' || e.key === 'W' || e.key === ' ') keys.w = true;
        if (e.key === 'a' || e.key === 'A') keys.a = true;
        if (e.key === 'd' || e.key === 'D') keys.d = true;
        
        if (e.key === 'e' || e.key === 'E') {
            if (!keys.e) {
                isCraftingOpen = true; // 'E' only opens crafting
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
        if (isCraftingOpen) {
            handleInventoryClick(e.button, 'crafting');
        } else if (isFurnaceOpen) {
            handleInventoryClick(e.button, 'furnace');
        } else {
            if (e.button === 0) mineBlock();
            if (e.button === 2) handleRightClick(); // Changed from placeBlock()
        }
    });
    
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    window.addEventListener('wheel', (e) => {
        if (isCraftingOpen || isFurnaceOpen) return; // Don't scroll hotbar if UI is open
        if (e.deltaY > 0) { // Scroll down
            selectedSlot++;
            if (selectedSlot > 8) selectedSlot = 0; // Wrap around
        } else if (e.deltaY < 0) { // Scroll up
            selectedSlot--;
            if (selectedSlot < 0) selectedSlot = 8; // Wrap around
        }
    });
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// --- 8. Interaction Logic ---
function handleRightClick() {
    const playerTileX = toTileCoord(player.x + player.width / 2);
    const playerTileY = toTileCoord(player.y + player.height / 2);
    const dist = Math.sqrt(Math.pow(playerTileX - mouse.tileX, 2) + Math.pow(playerTileY - mouse.tileY, 2));
    if (dist > INTERACTION_RANGE) return;

    if (mouse.tileY < 0 || mouse.tileY >= WORLD_HEIGHT_TILES ||
        mouse.tileX < 0 || mouse.tileX >= WORLD_WIDTH_TILES) return;

    const block = worldData[mouse.tileY][mouse.tileX];
    
    if (block === TILES.CRAFTING_TABLE) {
        isCraftingOpen = true;
        isFurnaceOpen = false;
    } else if (block === TILES.FURNACE) {
        isCraftingOpen = false;
        isFurnaceOpen = true;
    } else if (block === TILES.AIR) {
        placeBlock(); // If it's air, try to place
    }
}

function mineBlock() {
    const playerTileX = toTileCoord(player.x + player.width / 2);
    const playerTileY = toTileCoord(player.y + player.height / 2);
    const dist = Math.sqrt(Math.pow(playerTileX - mouse.tileX, 2) + Math.pow(playerTileY - mouse.tileY, 2));
    if (dist > INTERACTION_RANGE) return;
    
    if (mouse.tileY < 0 || mouse.tileY >= WORLD_HEIGHT_TILES ||
        mouse.tileX < 0 || mouse.tileX >= WORLD_WIDTH_TILES) return;
            
    const tileType = worldData[mouse.tileY][mouse.tileX];
    if (tileType === TILES.AIR) return;
    
    const requiredTier = BLOCK_TIER[tileType] ?? 0;
    
    const heldSlot = hotbarSlots[selectedSlot];
    const toolTier = heldSlot ? (TOOL_TIER[heldSlot.id] ?? 0) : 0;
    
    if (toolTier >= requiredTier) {
        addBlockToInventory(tileType);
        worldData[mouse.tileY][mouse.tileX] = TILES.AIR;
    } else {
        console.log(`Need tier ${requiredTier} pickaxe!`);
    }
}

function placeBlock() {
    const slot = hotbarSlots[selectedSlot];
    if (!slot) return;
    if (slot.id >= 100) return; // Can't place items

    // Check range (already done in handleRightClick, but good to double check)
    const playerTileX = toTileCoord(player.x + player.width / 2);
    const playerTileY = toTileCoord(player.y + player.height / 2);
    const dist = Math.sqrt(Math.pow(playerTileX - mouse.tileX, 2) + Math.pow(playerTileY - mouse.tileY, 2));
    if (dist > INTERACTION_RANGE) return;
    
    // Check if target tile is air
    if (worldData[mouse.tileY][mouse.tileX] !== TILES.AIR) {
        return; // Block already there
    }

    // Check for player collision (AABB)
    const tilePixelX = mouse.tileX * TILE_SIZE;
    const tilePixelY = mouse.tileY * TILE_SIZE;
    
    if (player.x < tilePixelX + TILE_SIZE &&
        player.x + player.width > tilePixelX &&
        player.y < tilePixelY + TILE_SIZE &&
        player.y + player.height > tilePixelY) {
        return; // Player is overlapping the block
    }
    
    if (removeBlockFromInventory(hotbarSlots, selectedSlot)) {
        worldData[mouse.tileY][mouse.tileX] = slot.id;
    }
}

// --- 9. Crafting & Furnace Logic ---
const SLOT_SIZE = 36;
const SLOT_PADDING = 4;
let slotCoords = {}; // Will store {x, y} for all slots

function handleInventoryClick(button, uiType) {
    for (const key in slotCoords) {
        const { x, y } = slotCoords[key];
        
        if (mouse.x > x && mouse.x < x + SLOT_SIZE &&
            mouse.y > y && mouse.y < y + SLOT_SIZE) {
            
            const [arrayName, indexStr] = key.split('-');
            const index = parseInt(indexStr);
            let slotArray;
            
            if (arrayName === 'inv') slotArray = inventorySlots;
            else if (arrayName === 'hotbar') slotArray = hotbarSlots;
            else if (arrayName === 'crafting') slotArray = craftingGrid;
            else if (arrayName === 'furnaceIn') {
                handleSlotClick([furnaceInput], 0, button, (item) => furnaceInput = item); return;
            }
            else if (arrayName === 'furnaceFuel') {
                handleSlotClick([furnaceFuel], 0, button, (item) => furnaceFuel = item); return;
            }
            else if (arrayName === 'craftingOut') {
                handleOutputClick(craftingOutput, 'crafting'); return;
            } else if (arrayName === 'furnaceOut') {
                handleOutputClick(furnaceOutput, 'furnace', (item) => furnaceOutput = item); return;
            }
            
            if (slotArray) {
                handleSlotClick(slotArray, index, button, (item) => slotArray[index] = item);
                if (uiType === 'crafting') checkCrafting();
            }
            return;
        }
    }
}

function handleSlotClick(slotArray, index, button, setter) {
    let slot = slotArray[index];
    let held = mouse.heldItem;

    if (button === 0) { // Left Click
        if (held && !slot) { // Place stack
            setter(held);
            mouse.heldItem = null;
        } else if (!held && slot) { // Pick up stack
            mouse.heldItem = slot;
            setter(null);
        } else if (held && slot) {
            if (held.id === slot.id && slot.count < MAX_STACK) { // Merge
                let canTake = MAX_STACK - slot.count;
                let willTake = Math.min(canTake, held.count);
                slot.count += willTake;
                held.count -= willTake;
                if (held.count <= 0) mouse.heldItem = null;
                setter(slot); // Update slot
            } else { // Swap
                mouse.heldItem = slot;
                setter(held);
            }
        }
    } else if (button === 2) { // Right Click
        if (!held && slot) { // Pick up half
            let half = Math.ceil(slot.count / 2);
            mouse.heldItem = { id: slot.id, count: half };
            slot.count -= half;
            if (slot.count <= 0) setter(null);
            else setter(slot);
        } else if (held && !slot) { // Place one
            setter({ id: held.id, count: 1 });
            held.count--;
            if (held.count <= 0) mouse.heldItem = null;
        } else if (held && slot && held.id === slot.id && slot.count < MAX_STACK) { // Place one
            slot.count++;
            held.count--;
            if (held.count <= 0) mouse.heldItem = null;
            setter(slot);
        }
    }
}

function handleOutputClick(outputSlot, uiType, setter) {
    if (outputSlot && (!mouse.heldItem || (mouse.heldItem.id === outputSlot.id && mouse.heldItem.count < MAX_STACK))) {
        
        if (!mouse.heldItem) {
             mouse.heldItem = { ...outputSlot };
        } else {
            mouse.heldItem.count += outputSlot.count;
        }

        if (uiType === 'crafting') {
            craftingOutput = null;
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
}

function checkCrafting() {
    craftingOutput = null;
    const gridIds = craftingGrid.map(slot => slot ? slot.id : null);

    for (const key in CRAFTING_RECIPES) {
        const recipe = CRAFTING_RECIPES[key];
        
        if (recipe.type === 'shapeless') {
            const input = recipe.input[0];
            let count = 0;
            let found = true;
            for (const id of gridIds) {
                if (id !== null && id !== input.id) found = false;
                if (id === input.id) count++;
            }
            if (found && count === input.count) {
                craftingOutput = { ...recipe.output };
                return;
            }
        } else if (recipe.type === 'shaped') {
            const pattern = recipe.pattern;
            const pHeight = pattern.length;
            const pWidth = pattern[0].length;
            
            let match = true;
            for(let y=0; y<pHeight; y++) {
                for(let x=0; x<pWidth; x++) {
                    const gridIndex = y * 3 + x;
                    const patternId = pattern[y][x];
                    if (patternId === null) {
                        if (gridIds[gridIndex] !== null) match = false;
                    } else {
                        if (gridIds[gridIndex] !== patternId) match = false;
                    }
                }
            }
            
            if (match) {
                for(let i=0; i<9; i++) {
                    let y = Math.floor(i / 3);
                    let x = i % 3;
                    if(y >= pHeight || x >= pWidth) {
                        if(gridIds[i] !== null) match = false;
                    }
                }
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
    if (furnaceFuelTime > 0) {
        furnaceFuelTime--;
    }

    // 1. Check if cooking can start/continue
    if (furnaceInput && SMELT_RECIPES[furnaceInput.id]) {
        const resultId = SMELT_RECIPES[furnaceInput.id];
        // Check if output is empty or can be stacked
        if (furnaceOutput === null || (furnaceOutput.id === resultId && furnaceOutput.count < MAX_STACK)) {
            // Check for fuel
            if (furnaceFuelTime > 0) {
                // Has fuel, continue cooking
                if (furnaceCookTime > 0) {
                    furnaceCookTime--;
                } else {
                    furnaceCookTime = COOK_TIME; // Start new cook
                }
            } else if (furnaceFuel && FUEL_TIMES[furnaceFuel.id]) {
                // No fuel time, but has fuel item. Consume it.
                furnaceFuelTime = FUEL_TIMES[furnaceFuel.id];
                furnaceFuel.count--;
                if (furnaceFuel.count <= 0) furnaceFuel = null;
                furnaceCookTime = COOK_TIME;
            } else {
                furnaceCookTime = 0; // No fuel, stop cooking
            }
        } else {
             furnaceCookTime = 0; // Output is full, stop
        }
    } else {
         furnaceCookTime = 0; // No input, stop
    }

    // 2. Check if cooking finished
    if (furnaceCookTime === 1) { // At 1, not 0, to prevent off-by-one
        const resultId = SMELT_RECIPES[furnaceInput.id];
        if (furnaceOutput === null) {
            furnaceOutput = { id: resultId, count: 1 };
        } else {
            furnaceOutput.count++;
        }
        
        furnaceInput.count--;
        if (furnaceInput.count <= 0) furnaceInput = null;
        
        furnaceCookTime = 0; // Reset
    }
}


// --- 10. Game Loop (Update Logic) ---
function update() {
    if (!isCraftingOpen && !isFurnaceOpen) {
        // Handle Input
        if (keys.a) player.vx = -MOVE_SPEED;
        else if (keys.d) player.vx = MOVE_SPEED;
        else player.vx = 0;
        if (keys.w && player.isOnGround) {
            player.vy = JUMP_STRENGTH;
            player.isOnGround = false;
        }

        // Apply Physics (Vertical)
        player.vy += GRAVITY;
        let newY = player.y + player.vy;
        if (player.vy > 0) {
            let tileX1 = toTileCoord(player.x);
            let tileX2 = toTileCoord(player.x + player.width);
            let tileY = toTileCoord(newY + player.height);
            if (isTileSolid(tileX1, tileY) || isTileSolid(tileX2, tileY)) {
                player.vy = 0;
                player.y = (tileY * TILE_SIZE) - player.height;
                player.isOnGround = true;
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

        // Apply Physics (Horizontal)
        let newX = player.x + player.vx;
        if (player.vx > 0) {
            let tileX = toTileCoord(newX + player.width);
            let tileY1 = toTileCoord(player.y);
            let tileY2 = toTileCoord(player.y + player.height - 1);
            if (isTileSolid(tileX, tileY1) || isTileSolid(tileX, tileY2)) {
                player.vx = 0;
                player.x = (tileX * TILE_SIZE) - player.width;
            } else {
                player.x = newX;
            }
        } else if (player.vx < 0) {
            let tileX = toTileCoord(newX);
            let tileY1 = toTileCoord(player.y);
            let tileY2 = toTileCoord(player.y + player.height - 1);
            if (isTileSolid(tileX, tileY1) || isTileSolid(tileX, tileY2)) {
                player.vx = 0;
                player.x = (tileX * TILE_SIZE) + TILE_SIZE;
            } else {
                player.x = newX;
            }
        }
    } else {
        player.vx = 0;
        player.vy = 0;
    }
    
    if (isFurnaceOpen) {
        updateFurnace();
    }
    
    // Update Camera
    camera.x = player.x - (canvas.width / 2) + (player.width / 2);
    camera.y = player.y - (canvas.height / 2) + (player.height / 2);
    const maxCamX = WORLD_WIDTH_TILES * TILE_SIZE - canvas.width;
    const maxCamY = WORLD_HEIGHT_TILES * TILE_SIZE - canvas.height;
    camera.x = Math.max(0, Math.min(camera.x, maxCamX));
    camera.y = Math.max(0, Math.min(camera.y, maxCamY));
}

function isTileSolid(tileX, tileY) {
    if (tileY < 0 || tileY >= WORLD_HEIGHT_TILES || tileX < 0 || tileX >= WORLD_WIDTH_TILES) {
        return true;
    }
    const tileType = worldData[tileY][tileX];
    return tileType !== TILES.AIR;
}

function toTileCoord(pixelCoord) {
    return Math.floor(pixelCoord / TILE_SIZE);
}

// --- 11. Game Loop (Drawing) ---
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // --- START CAMERA ---
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    const startTileX = toTileCoord(camera.x);
    const endTileX = startTileX + toTileCoord(canvas.width) + 2;
    const startTileY = toTileCoord(camera.y);
    const endTileY = startTileY + toTileCoord(canvas.height) + 2;

    for (let y = startTileY; y < endTileY; y++) {
        for (let x = startTileX; x < endTileX; x++) {
            if (y < 0 || y >= WORLD_HEIGHT_TILES || x < 0 || x >= WORLD_WIDTH_TILES) continue;
            const tileType = worldData[y][x];
            ctx.fillStyle = TILE_COLORS[tileType];
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
    // --- END CAMERA ---

    // --- DRAW UI ---
    drawHotbar();
    
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
        if (x === selectedSlot && !isCraftingOpen && !isFurnaceOpen) { // Only show selection if not in UI
            ctx.strokeStyle = '#FFFF00';
            ctx.lineWidth = 3;
            ctx.strokeRect(sx - 1, sy - 1, s + 2, s + 2);
        }
    }
}

function drawCraftingUI() {
    slotCoords = {};
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const s = SLOT_SIZE;
    const p = SLOT_PADDING;
    
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
    const invGridX = (canvas.world / 2) - (invGridWidth / 2);
    const invGridY = (canvas.height / 2) + 20;
    drawPlayerInventoryUI(invGridX, invGridY);
}

function drawFurnaceUI() {
    slotCoords = {};
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const s = SLOT_SIZE;
    const p = SLOT_PADDING;
    
    const furnaceX = (canvas.width / 2) - 100;
    const furnaceY = (canvas.height / 2) - 100;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '18px Arial';
    ctx.fillText('Furnace', furnaceX, furnaceY - 10);
    
    const inputX = furnaceX;
    const inputY = furnaceY;
    slotCoords['furnaceIn-0'] = { x: inputX, y: inputY };
    drawSlot(furnaceInput, inputX, inputY);
    
    const fuelX = furnaceX;
    const fuelY = furnaceY + 2 * (s + p);
    slotCoords['furnaceFuel-0'] = { x: fuelX, y: fuelY };
    drawSlot(furnaceFuel, fuelX, fuelY);
    
    const outputX = furnaceX + 3 * (s + p);
    const outputY = furnaceY + 1 * (s + p);
    slotCoords['furnaceOut-0'] = { x: outputX, y: outputY };
    drawSlot(furnaceOutput, outputX, outputY);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '30px Arial';
    ctx.fillText('->', furnaceX + 2 * (s+p) - 10, outputY + s/1.5);
    
    // Cook progress bar
    ctx.fillStyle = '#444';
    ctx.fillRect(furnaceX, furnaceY + 1 * (s+p) + 10, s, 4);
    if(furnaceCookTime > 0) {
        ctx.fillStyle = '#FFD700'; // Gold
        const progress = (COOK_TIME - furnaceCookTime) / COOK_TIME;
        ctx.fillRect(furnaceX, furnaceY + 1 * (s+p) + 10, s * progress, 4);
    }
    
    // Fuel progress bar
    ctx.fillStyle = '#444';
    ctx.fillRect(fuelX, fuelY - 8, s, 4);
    if(furnaceFuelTime > 0) {
        ctx.fillStyle = '#FF6347'; // Red
        const maxFuel = FUEL_TIMES[Object.keys(FUEL_TIMES).find(k => furnaceFuelTime < FUEL_TIMES[k])] || 800;
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
generateWorld();
setupInputListeners();
resizeCanvas();
gameLoop(); // This is the line that was failing
