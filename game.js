// --- 1. Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const simplex = new SimplexNoise();

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
let player = { /* ... (unchanged) ... */ };
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
    // ... (noise setup) ...
    for (let x = 0; x < WORLD_WIDTH_TILES; x++) {
        // ... (terrain height) ...
        for (let y = 0; y < WORLD_HEIGHT_TILES; y++) {
            // ... (terrain gen) ...
            if (y >= 35) { // Underground
                worldData[y][x] = TILES.STONE;
                let oreNoise = simplex.noise2D(x / 10, y / 10);
                
                // NEW: Added COAL
                if (oreNoise > 0.6) worldData[y][x] = TILES.COAL;
                else if (oreNoise > 0.7) worldData[y][x] = TILES.COPPER;
                else if (oreNoise > 0.75) worldData[y][x] = TILES.IRON;
                else if (oreNoise > 0.8) worldData[y][x] = TILES.DIAMOND;
                else if (oreNoise > 0.85) worldData[y][x] = TILES.COBALT;
                else if (oreNoise > 0.9) worldData[y][x] = TILES.PLATINUM;
            }
            // ... (cave gen) ...
        }
    }
    // ... (tree gen) ...
    // ... (player spawn) ...
}
// ... (generateTree unchanged) ...

// --- 6. Inventory Helpers ---
function addBlockToInventory(tileType) { /* ... (unchanged) ... */ }
function removeBlockFromInventory(slotArray, slotIndex) { /* ... (unchanged) ... */ }

// --- 7. Input Handlers ---
// MODIFIED: 'e' key logic, mousedown logic
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

    canvas.addEventListener('mousemove', (e) => { /* ... (unchanged) ... */ });
    
    // MODIFIED: Mousedown checks for UI
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
    window.addEventListener('wheel', (e) => { /* ... (unchanged) ... */ });
    window.addEventListener('resize', resizeCanvas);
}
function resizeCanvas() { /* ... (unchanged) ... */ }

// --- 8. Interaction Logic ---

// NEW: Central handler for right-click
function handleRightClick() {
    // Check range
    const playerTileX = toTileCoord(player.x + player.width / 2);
    const playerTileY = toTileCoord(player.y + player.height / 2);
    const dist = Math.sqrt(Math.pow(playerTileX - mouse.tileX, 2) + Math.pow(playerTileY - mouse.tileY, 2));
    if (dist > INTERACTION_RANGE) return;

    // Check if clicking a block
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

// REFACTORED: Now uses mining tiers
function mineBlock() {
    const playerTileX = toTileCoord(player.x + player.width / 2);
    const playerTileY = toTileCoord(player.y + player.height / 2);
    const dist = Math.sqrt(Math.pow(playerTileX - mouse.tileX, 2) + Math.pow(playerTileY - mouse.tileY, 2));
    if (dist > INTERACTION_RANGE) return;
    
    if (mouse.tileY < 0 || mouse.tileY >= WORLD_HEIGHT_TILES ||
        mouse.tileX < 0 || mouse.tileX >= WORLD_WIDTH_TILES) return;
            
    const tileType = worldData[mouse.tileY][mouse.tileX];
    if (tileType === TILES.AIR) return;
    
    // NEW: Progression Check
    const requiredTier = BLOCK_TIER[tileType] ?? 0; // Get tier, default to 0
    
    const heldSlot = hotbarSlots[selectedSlot];
    const toolTier = heldSlot ? (TOOL_TIER[heldSlot.id] ?? 0) : 0; // Get tool tier, default to 0
    
    if (toolTier >= requiredTier) {
        // Can mine!
        addBlockToInventory(tileType);
        worldData[mouse.tileY][mouse.tileX] = TILES.AIR;
    } else {
        // Can't mine!
        // (Maybe play a "tink" sound)
        console.log(`Need tier ${requiredTier} pickaxe!`);
    }
}

function placeBlock() {
    const slot = hotbarSlots[selectedSlot];
    if (!slot) return;
    
    // Can't place items that aren't blocks
    if (slot.id >= 100) return; 

    // ... (All other checks: range, air, player collision are UNCHANGED from Part 4) ...
    // ...
    
    // All checks passed!
    if (removeBlockFromInventory(hotbarSlots, selectedSlot)) {
        worldData[mouse.tileY][mouse.tileX] = slot.id;
    }
}

// --- 9. Crafting & Furnace Logic ---

// REFACTORED: Central click handler
function handleInventoryClick(button, uiType) {
    // Find which slot was clicked
    for (const key in slotCoords) {
        const { x, y } = slotCoords[key];
        
        if (mouse.x > x && mouse.x < x + SLOT_SIZE &&
            mouse.y > y && mouse.y < y + SLOT_SIZE) {
            
            const [arrayName, index] = key.split('-');
            let slotArray;
            
            if (arrayName === 'inv') slotArray = inventorySlots;
            else if (arrayName === 'hotbar') slotArray = hotbarSlots;
            else if (arrayName === 'crafting') slotArray = craftingGrid;
            else if (arrayName === 'furnaceIn') slotArray = [furnaceInput];
            else if (arrayName === 'furnaceFuel') slotArray = [furnaceFuel];
            else if (arrayName === 'craftingOut') {
                handleOutputClick(craftingOutput, 'crafting'); return;
            } else if (arrayName === 'furnaceOut') {
                handleOutputClick(furnaceOutput, 'furnace'); return;
            }
            
            handleSlotClick(slotArray, index, button);
            
            if (uiType === 'crafting') checkCrafting();
            return;
        }
    }
}

// REFACTORED: Now works with array references
function handleSlotClick(slotArray, index, button) {
    let slot = slotArray[index];
    let held = mouse.heldItem;
    // ... (This function's internal logic is UNCHANGED from Part 5) ...
    // ... (It picks up, places, splits, and merges stacks) ...
}

// REFACTORED: Now generic
function handleOutputClick(outputSlot, uiType) {
    if (outputSlot && !mouse.heldItem) {
        mouse.heldItem = outputSlot;
        
        if (uiType === 'crafting') {
            craftingOutput = null;
            // Consume crafting grid
            for (let i = 0; i < craftingGrid.length; i++) {
                if (craftingGrid[i]) {
                    craftingGrid[i].count--;
                    if (craftingGrid[i].count <= 0) craftingGrid[i] = null;
                }
            }
            checkCrafting(); // Re-check
        } else if (uiType === 'furnace') {
            furnaceOutput = null;
        }
    }
}

// REFACTORED: More robust pattern matching
function checkCrafting() {
    craftingOutput = null;
    const gridIds = craftingGrid.map(slot => slot ? slot.id : null);

    for (const key in CRAFTING_RECIPES) {
        const recipe = CRAFTING_RECIPES[key];
        
        if (recipe.type === 'shapeless') {
            // ... (Shapeless logic unchanged) ...
        } else if (recipe.type === 'shaped') {
            const pattern = recipe.pattern;
            const pHeight = pattern.length;
            const pWidth = pattern[0].length;
            
            // This is a simple 1:1 match in the top-left
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
                // Check if grid is empty outside the pattern
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

function dropHeldItem() { /* ... (unchanged) ... */ }

// NEW: Furnace update logic
function updateFurnace() {
    if (!isFurnaceOpen) return;
    
    // 1. Has fuel, is cooking
    if (furnaceFuelTime > 0 && furnaceCookTime > 0) {
        furnaceCookTime--;
        furnaceFuelTime--;
        
        // 1a. Cooking finished!
        if (furnaceCookTime === 0) {
            const resultId = SMELT_RECIPES[furnaceInput.id];
            if (furnaceOutput === null) {
                furnaceOutput = { id: resultId, count: 1 };
            } else {
                furnaceOutput.count++;
            }
            // Consume input
            furnaceInput.count--;
            if (furnaceInput.count <= 0) furnaceInput = null;
        }
    }
    
    // 2. Has fuel, not cooking, but can cook
    if (furnaceFuelTime > 0 && furnaceCookTime === 0) {
        if (furnaceInput && SMELT_RECIPES[furnaceInput.id]) {
            const resultId = SMELT_RECIPES[furnaceInput.id];
            // Check if output stack is full
            if (furnaceOutput === null || (furnaceOutput.id === resultId && furnaceOutput.count < MAX_STACK)) {
                furnaceCookTime = COOK_TIME; // Start cooking
            }
        }
    }
    
    // 3. No fuel, try to consume fuel
    if (furnaceFuelTime <= 0) {
        if (furnaceFuel && FUEL_TIMES[furnaceFuel.id]) {
            furnaceFuelTime = FUEL_TIMES[furnaceFuel.id];
            furnaceFuel.count--;
            if (furnaceFuel.count <= 0) furnaceFuel = null;
        } else {
            furnaceCookTime = 0; // Stop cooking if fuel runs out
        }
    }
}

// --- 10. Game Loop (Update Logic) ---
function update() {
    // MODIFIED: Pause player if UI is open
    if (!isCraftingOpen && !isFurnaceOpen) {
        // ... (Player physics, input, collision logic UNCHANGED) ...
    } else {
        // Stop player movement
        player.vx = 0;
        player.vy = 0;
    }
    
    // NEW: Update furnace
    if (isFurnaceOpen) {
        updateFurnace();
    }
    
    // Update Camera (always update)
    // ... (Camera logic unchanged) ...
}

// --- 11. Game Loop (Drawing) ---
const SLOT_SIZE = 36;
const SLOT_PADDING = 4;
let slotCoords = {}; // Stores {x, y} for all slots

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // --- START CAMERA ---
    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    // ... (Draw World, Player, Mouse Highlight UNCHANGED) ...
    ctx.restore();
    // --- END CAMERA ---

    // --- DRAW UI ---
    drawHotbar();
    // ... (Draw coords unchanged) ...
    
    if (isCraftingOpen) {
        drawCraftingUI();
    } else if (isFurnaceOpen) {
        drawFurnaceUI(); // NEW
    }
    
    if (mouse.heldItem) {
        // ... (Draw held item unchanged) ...
    }
}

// REFACTORED: drawHotbar is now unchanged
function drawHotbar() { /* ... (unchanged) ... */ }

// NEW: Draws the shared player inventory UI
function drawPlayerInventoryUI(startX, startY) {
    const s = SLOT_SIZE;
    const p = SLOT_PADDING;
    
    // Main Inventory (3x9)
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 9; x++) {
            const i = y * 9 + x;
            const sx = startX + x * (s + p);
            const sy = startY + y * (s + p);
            slotCoords[`inv-${i}`] = { x: sx, y: sy };
            drawSlot(inventorySlots[i], sx, sy);
        }
    }
    
    // Hotbar (1x9)
    const hotbarY = startY + 3 * (s + p) + 10;
    for (let x = 0; x < 9; x++) {
        const sx = startX + x * (s + p);
        const sy = hotbarY;
        slotCoords[`hotbar-${x}`] = { x: sx, y: sy };
        drawSlot(hotbarSlots[x], sx, sy);
        if (x === selectedSlot) {
            ctx.strokeStyle = '#FFFF00';
            ctx.lineWidth = 3;
            ctx.strokeRect(sx - 1, sy - 1, s + 2, s + 2);
        }
    }
}

// MODIFIED: Uses the reusable player inventory
function drawCraftingUI() {
    slotCoords = {};
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const s = SLOT_SIZE;
    const p = SLOT_PADDING;
    
    // --- Crafting Grid (3x3) ---
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
    
    // --- Output Slot ---
    const outputX = craftGridX + 4 * (s + p);
    const outputY = craftGridY + (s + p);
    slotCoords['craftingOut-0'] = { x: outputX, y: outputY };
    drawSlot(craftingOutput, outputX, outputY);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '30px Arial';
    ctx.fillText('->', craftGridX + 3 * (s+p), outputY + s/1.5);

    // --- Player Inventory ---
    const invGridWidth = 9 * (s + p) - p;
    const invGridX = (canvas.width / 2) - (invGridWidth / 2);
    const invGridY = (canvas.height / 2) + 20;
    drawPlayerInventoryUI(invGridX, invGridY);
}

// NEW: UI for the furnace
function drawFurnaceUI() {
    slotCoords = {};
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const s = SLOT_SIZE;
    const p = SLOT_PADDING;
    
    // --- Furnace Slots ---
    const furnaceX = (canvas.width / 2) - 100;
    const furnaceY = (canvas.height / 2) - 100;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '18px Arial';
    ctx.fillText('Furnace', furnaceX, furnaceY - 10);
    
    // Input
    const inputX = furnaceX;
    const inputY = furnaceY;
    slotCoords['furnaceIn-0'] = { x: inputX, y: inputY };
    drawSlot(furnaceInput, inputX, inputY);
    
    // Fuel
    const fuelX = furnaceX;
    const fuelY = furnaceY + 2 * (s + p);
    slotCoords['furnaceFuel-0'] = { x: fuelX, y: fuelY };
    drawSlot(furnaceFuel, fuelX, fuelY);
    
    // Output
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
    

    // --- Player Inventory ---
    const invGridWidth = 9 * (s + p) - p;
    const invGridX = (canvas.width / 2) - (invGridWidth / 2);
    const invGridY = (canvas.height / 2) + 20;
    drawPlayerInventoryUI(invGridX, invGridY);
}

// REFACTORED: drawSlot is now unchanged
function drawSlot(slot, x, y) { /* ... (unchanged) ... */ }

// --- 12. Start the Game ---
generateWorld();
setupInputListeners();
resizeCanvas();
gameLoop();
