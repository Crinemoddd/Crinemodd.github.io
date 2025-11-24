// --- GAME MAKER: v8 (Infinite Chunk World) ---
// --- 1. Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- 2. World Configuration ---
const TILE_SIZE = 20; // Using the "zoomed-in" size
const CHUNK_SIZE = 16; // World is now in 16x16 chunks
// World width/height are no longer needed

const TILES = {
    AIR: 0, GRASS: 1, DIRT: 2, STONE: 3, IRON: 4, COPPER: 5, DIAMOND: 6, COBALT: 7,
    PLATINUM: 8, WOOD_LOG: 9, LEAVES: 10, WOOD_PLANK: 11, CRAFTING_TABLE: 12, STICK: 13,
    COAL: 14, FURNACE: 15, WOOD_PICKAXE: 100, STONE_PICKAXE: 101, COPPER_PICKAXE: 102,
    IRON_PICKAXE: 103, DIAMOND_PICKAXE: 104, COBALT_PICKAXE: 105, PLATINUM_PICKAXE: 106,
    COPPER_INGOT: 107, IRON_INGOT: 108, DIAMOND_INGOT: 109, COBALT_INGOT: 110,
    PLATINUM_INGOT: 111
};
// ... (TILE_NAMES and TILE_COLORS objects are UNCHANGED) ...
const MAX_STACK = 64;
// ... (BLOCK_TIER and TOOL_TIER objects are UNCHANGED) ...

// --- NEW: Chunk-based World ---
const worldChunks = new Map(); // Stores all generated chunks

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

// Slotted Inventory (UNCHANGED)
let hotbarSlots = new Array(9).fill(null);
let inventorySlots = new Array(27).fill(null);
let selectedSlot = 0;

// UI State (UNCHANGED)
let isCraftingOpen = false;
let isFurnaceOpen = false;
let craftingGrid = new Array(9).fill(null);
let craftingOutput = null;

// Furnace State (UNCHANGED)
let furnaceInput = null;
let furnaceFuel = null;
let furnaceOutput = null;
let furnaceCookTime = 0;
let furnaceFuelTime = 0;
const COOK_TIME = 200;

const simplex = new SimplexNoise();

// --- 4. Recipe Databases ---
// ... (CRAFTING_RECIPES, addPickaxeRecipes, SMELT_RECIPES, FUEL_TIMES are UNCHANGED) ...

// --- 5. NEW: Chunk Management ---

// Noise parameters (moved here)
const TERRAIN_HEIGHT_SCALE = 50;
const TERRAIN_HEIGHT_AMOUNT = 15;
const BASE_HEIGHT = 30;
const ORE_NOISE_SCALE = 10;
const CAVE_NOISE_SCALE = 25;

/**
 * Gets a unique string key for chunk coordinates
 */
function getChunkKey(chunkX, chunkY) {
    return `${chunkX},${chunkY}`;
}

/**
 * Generates a new chunk at the given chunk coordinates
 */
function generateChunk(chunkX, chunkY) {
    let chunk = new Array(CHUNK_SIZE).fill(0).map(() => new Array(CHUNK_SIZE).fill(TILES.AIR));
    
    for (let x = 0; x < CHUNK_SIZE; x++) {
        const globalX = chunkX * CHUNK_SIZE + x;
        
        // 1. Generate Terrain Height (same as before)
        let heightNoise = simplex.noise2D(globalX / TERRAIN_HEIGHT_SCALE, 0);
        let surfaceY = Math.floor(BASE_HEIGHT + heightNoise * TERRAIN_HEIGHT_AMOUNT);

        for (let y = 0; y < CHUNK_SIZE; y++) {
            const globalY = chunkY * CHUNK_SIZE + y;

            if (globalY < surfaceY) {
                chunk[y][x] = TILES.AIR;
            } else if (globalY === surfaceY) {
                chunk[y][x] = TILES.GRASS;
            } else if (globalY > surfaceY && globalY < surfaceY + 5) {
                chunk[y][x] = TILES.DIRT;
            } else if (globalY >= surfaceY + 5) {
                chunk[y][x] = TILES.STONE;

                // 2. Generate Ores
                let oreNoise = simplex.noise2D(globalX / ORE_NOISE_SCALE, globalY / ORE_NOISE_SCALE);
                if (oreNoise > 0.6) chunk[y][x] = TILES.COAL;
                else if (oreNoise > 0.7) chunk[y][x] = TILES.COPPER;
                else if (oreNoise > 0.75) chunk[y][x] = TILES.IRON;
                else if (oreNoise > 0.8) chunk[y][x] = TILES.DIAMOND;
                else if (oreNoise > 0.85) chunk[y][x] = TILES.COBALT;
                else if (oreNoise > 0.9) chunk[y][x] = TILES.PLATINUM;
            }

            // 3. Generate Caves
            if (chunk[y][x] === TILES.DIRT || chunk[y][x] === TILES.STONE) {
                let caveNoise = simplex.noise2D(globalX / CAVE_NOISE_SCALE, globalY / CAVE_NOISE_SCALE);
                if (caveNoise > 0.6) {
                    chunk[y][x] = TILES.AIR;
                }
            }
            
            // 4. Generate Trees (if we're on a grass block)
            if (chunk[y][x] === TILES.GRASS && Math.random() < 0.05) {
                // We'll generate the tree in the *world* not the chunk,
                // as it might cross chunk boundaries.
                // Note: This is simpler, but generateTree needs to use setTile()
                generateTree(globalX, globalY - 1);
            }
        }
    }
    return chunk;
}

/**
 * Gets a chunk. If it doesn't exist, generates it.
 */
function getOrCreateChunk(chunkX, chunkY) {
    const key = getChunkKey(chunkX, chunkY);
    if (!worldChunks.has(key)) {
        // console.log(`Generating chunk: ${key}`);
        worldChunks.set(key, generateChunk(chunkX, chunkY));
    }
    return worldChunks.get(key);
}

/**
 * Helper to get the correct modulo for negative numbers
 */
function correctMod(n, m) {
    return ((n % m) + m) % m;
}

/**
 * Gets a single tile from the world at global tile coordinates
 */
function getTile(tileX, tileY) {
    const chunkX = Math.floor(tileX / CHUNK_SIZE);
    const chunkY = Math.floor(tileY / CHUNK_SIZE);
    
    const chunk = getOrCreateChunk(chunkX, chunkY);
    
    const localX = correctMod(tileX, CHUNK_SIZE);
    const localY = correctMod(tileY, CHUNK_SIZE);
    
    return chunk[localY][localX];
}

/**
 * Sets a single tile in the world at global tile coordinates
 */
function setTile(tileX, tileY, tileId) {
    const chunkX = Math.floor(tileX / CHUNK_SIZE);
    const chunkY = Math.floor(tileY / CHUNK_SIZE);
    
    const chunk = getOrCreateChunk(chunkX, chunkY);
    
    const localX = correctMod(tileX, CHUNK_SIZE);
    const localY = correctMod(tileY, CHUNK_SIZE);
    
    chunk[localY][localX] = tileId;
}

/**
 * Finds the Y-level of the surface at a given global X
 */
function findSurfaceY(globalX) {
    let heightNoise = simplex.noise2D(globalX / TERRAIN_HEIGHT_SCALE, 0);
    return Math.floor(BASE_HEIGHT + heightNoise * TERRAIN_HEIGHT_AMOUNT);
}

/**
 * Generates a tree using setTile()
 */
function generateTree(x, y) {
    const trunkHeight = Math.floor(Math.random() * 3) + 4;
    for (let i = 0; i < trunkHeight; i++) {
        setTile(x, y - i, TILES.WOOD_LOG);
    }
    const topY = y - trunkHeight;
    for (let ly = -2; ly <= 2; ly++) {
        for (let lx = -2; lx <= 2; lx++) {
            if (lx === 0 && ly > 0) continue;
            if (getTile(x + lx, topY + ly) === TILES.AIR) {
                setTile(x + lx, topY + ly, TILES.LEAVES);
            }
        }
    }
}

// --- 6. Inventory Helpers ---
// ... (addItemToInventory, addBlockToInventory, removeBlockFromInventory are UNCHANGED) ...

// --- 7. Input Handlers ---
// ... (setupInputListeners and resizeCanvas are UNCHANGED) ...

// --- 8. Interaction Logic ---

/**
 * REFACTORED: Now uses getTile() and setTile()
 */
function handleRightClick() {
    // Range check is the same
    const playerTileX = toTileCoord(player.x + player.width / 2);
    const playerTileY = toTileCoord(player.y + player.height / 2);
    const dist = Math.sqrt(Math.pow(playerTileX - mouse.tileX, 2) + Math.pow(playerTileY - mouse.tileY, 2));
    if (dist > INTERACTION_RANGE) return;

    // Get block from new function
    const block = getTile(mouse.tileX, mouse.tileY);
    
    if (block === TILES.CRAFTING_TABLE) {
        isCraftingOpen = true; isFurnaceOpen = false;
    } else if (block === TILES.FURNACE) {
        isCraftingOpen = false; isFurnaceOpen = true;
    } else if (block === TILES.AIR) {
        placeBlock(); // If it's air, try to place
    }
}

/**
 * REFACTORED: Now uses getTile() and setTile()
 */
function mineBlock() {
    // Range check is the same
    const playerTileX = toTileCoord(player.x + player.width / 2);
    const playerTileY = toTileCoord(player.y + player.height / 2);
    const dist = Math.sqrt(Math.pow(playerTileX - mouse.tileX, 2) + Math.pow(playerTileY - mouse.tileY, 2));
    if (dist > INTERACTION_RANGE) return;
    
    const tileType = getTile(mouse.tileX, mouse.tileY);
    if (tileType === TILES.AIR) return;
    
    // Tier check is the same
    const requiredTier = BLOCK_TIER[tileType] ?? 0;
    const heldSlot = hotbarSlots[selectedSlot];
    const toolTier = heldSlot ? (TOOL_TIER[heldSlot.id] ?? 0) : 0;
    
    if (toolTier >= requiredTier) {
        addBlockToInventory(tileType);
        setTile(mouse.tileX, mouse.tileY, TILES.AIR); // Use setTile
    } else {
        console.log(`Need tier ${requiredTier} pickaxe!`);
    }
}

/**
 * REFACTORED: Now uses getTile() and setTile()
 */
function placeBlock() {
    const slot = hotbarSlots[selectedSlot];
    if (!slot) return;
    if (slot.id >= 100) return;

    // Range check is the same
    const playerTileX = toTileCoord(player.x + player.width / 2);
    const playerTileY = toTileCoord(player.y + player.height / 2);
    const dist = Math.sqrt(Math.pow(playerTileX - mouse.tileX, 2) + Math.pow(playerTileY - mouse.tileY, 2));
    if (dist > INTERACTION_RANGE) return;
    
    // Check if target tile is air (using getTile)
    if (getTile(mouse.tileX, mouse.tileY) !== TILES.AIR) {
        return;
    }

    // Player collision check is the same
    const tilePixelX = mouse.tileX * TILE_SIZE;
    const tilePixelY = mouse.tileY * TILE_SIZE;
    if (player.x < tilePixelX + TILE_SIZE && player.x + player.width > tilePixelX &&
        player.y < tilePixelY + TILE_SIZE && player.y + player.height > tilePixelY) {
        return;
    }
    
    // Place block (using setTile)
    if (removeBlockFromInventory(hotbarSlots, selectedSlot)) {
        setTile(mouse.tileX, mouse.tileY, slot.id);
    }
}

// --- 9. Crafting & Furnace Logic ---
// ... (All functions are UNCHANGED: SLOT_SIZE, slotCoords, handleInventoryClick, quickMoveItem, handleSlotClick, handleOutputClick, consumeCraftingMaterials, checkCrafting, dropHeldItem, updateFurnace) ...

// --- 10. Game Loop (Update Logic) ---
function update() {
    if (!isCraftingOpen && !isFurnaceOpen) {
        // ... (Player input and velocity logic is UNCHANGED) ...
        if (keys.a) player.vx = -MOVE_SPEED;
        else if (keys.d) player.vx = MOVE_SPEED;
        else player.vx = 0;
        if (keys.w && player.isOnGround) {
            player.vy = JUMP_STRENGTH;
            player.isOnGround = false;
        }

        // --- REFACTORED: Physics now uses getTile() ---
        player.vy += GRAVITY;
        let newY = player.y + player.vy;
        if (player.vy > 0) { // Moving Down
            let tileX1 = toTileCoord(player.x);
            let tileX2 = toTileCoord(player.x + player.width);
            let tileY = toTileCoord(newY + player.height);
            if (isTileSolid(tileX1, tileY) || isTileSolid(tileX2, tileY)) { // isTileSolid now uses getTile
                player.vy = 0; player.y = (tileY * TILE_SIZE) - player.height; player.isOnGround = true;
            } else {
                player.y = newY; player.isOnGround = false;
            }
        } else if (player.vy < 0) { // Moving Up
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
        if (player.vx > 0) { // Moving Right
            let tileX = toTileCoord(newX + player.width);
            let tileY1 = toTileCoord(player.y);
            let tileY2 = toTileCoord(player.y + player.height - 1);
            if (isTileSolid(tileX, tileY1) || isTileSolid(tileX, tileY2)) {
                player.vx = 0; player.x = (tileX * TILE_SIZE) - player.width;
            } else {
                player.x = newX;
            }
        } else if (player.vx < 0) { // Moving Left
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
    
    // --- NEW: Chunk Loading ---
    const playerChunkX = Math.floor(toTileCoord(player.x + player.width/2) / CHUNK_SIZE);
    const playerChunkY = Math.floor(toTileCoord(player.y + player.height/2) / CHUNK_SIZE);
    const renderDist = 2; // Load chunks 2 in each direction
    
    for (let cy = playerChunkY - renderDist; cy <= playerChunkY + renderDist; cy++) {
        for (let cx = playerChunkX - renderDist; cx <= playerChunkX + renderDist; cx++) {
            getOrCreateChunk(cx, cy); // This will generate chunks as player moves
        }
    }

    // --- REFACTORED: Camera ---
    // Target logic is the same (centers head)
    let targetCamX = player.x - (canvas.width / 2) + (player.width / 2);
    let targetCamY = player.y - (canvas.height / 2);
    
    // REMOVED: Clamping logic is gone!
    // const maxCamX = ...
    // targetCamX = Math.max(0, Math.min(targetCamX, maxCamX));

    // Smoothing logic is the same
    camera.x += (targetCamX - camera.x) * CAMERA_SMOOTH_FACTOR;
    camera.y += (targetCamY - camera.y) * CAMERA_SMOOTH_FACTOR;
    if (Math.abs(targetCamX - camera.x) < 0.1) camera.x = targetCamX;
    if (Math.abs(targetCamY - camera.y) < 0.1) camera.y = targetCamY;
}

/**
 * REFACTORED: Now uses getTile()
 */
function isTileSolid(tileX, tileY) {
    // We can add a "bottom of the world" check if we want
    // if (tileY > 1000) return true;
    
    const tileType = getTile(tileX, tileY);
    return tileType !== TILES.AIR;
}

function toTileCoord(pixelCoord) {
    return Math.floor(pixelCoord / TILE_SIZE);
}

// --- 11. Game Loop (Drawing) ---
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(Math.round(-camera.x), Math.round(-camera.y));

    // --- REFACTORED: Draw loop now uses getTile() ---
    const startTileX = toTileCoord(camera.x);
    const endTileX = startTileX + toTileCoord(canvas.width) + 2;
    const startTileY = toTileCoord(camera.y);
    const endTileY = startTileY + toTileCoord(canvas.height) + 2;

    for (let y = startTileY; y < endTileY; y++) {
        for (let x = startTileX; x < endTileX; x++) {
            const tileType = getTile(x, y); // Get tile from chunk system
            ctx.fillStyle = TILE_COLORS[tileType];
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    // Player drawing is the same
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Mouse highlight is the same
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
    // ... (All UI draw functions are UNCHANGED: drawHotbar, drawPlayerInventoryUI, drawCraftingUI, drawFurnaceUI, drawSlot) ...
    // ... (Drawing coordinates is UNCHANGED) ...
}

// ... (All other functions are unchanged) ...

// --- 12. Main Game Loop ---
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// --- 13. NEW: Start the Game (was generateWorld) ---
function init() {
    console.log("Initializing game...");
    
    // Find a good spawn point
    const spawnX = 8;
    const spawnY = findSurfaceY(spawnX) - 1; // -1 to be just above ground
    
    player.x = spawnX * TILE_SIZE;
    player.y = spawnY * TILE_SIZE - player.height;
    
    // Set camera to spawn point immediately
    camera.x = player.x - (canvas.width / 2) + (player.width / 2);
    camera.y = player.y - (canvas.height / 2);
    
    // Pre-load initial chunks
    const playerChunkX = Math.floor(spawnX / CHUNK_SIZE);
    const playerChunkY = Math.floor(spawnY / CHUNK_SIZE);
    const renderDist = 2;
    for (let cy = playerChunkY - renderDist; cy <= playerChunkY + renderDist; cy++) {
        for (let cx = playerChunkX - renderDist; cx <= playerChunkX + renderDist; cx++) {
            getOrCreateChunk(cx, cy);
        }
    }
    
    setupInputListeners();
    resizeCanvas();
    gameLoop();
    console.log("Game started!");
}

// Start the game!
init();
