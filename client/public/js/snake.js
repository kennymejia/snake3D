new p5(snakeProject => {

    const cells = 11;
    const cellsRight = (cells - 1) / 2;
    const startingSegments = 1;
    const msMovement = 750;
    const speedFactor = 3;
    let snakeFood;
    let foodImage;
    let direction;
    let snakeBody;
    let keyMappings;
    let mapWidth;
    let cellWidth;
    let zeroVector;
    let nextMoveTime;
    let rightmostCellCenter;
    let initialCamera = true;
    let offsetX = 0;
    let offsetY = 0;
    let cameraZ;
    let cameraX;
    let cameraY;
    let initialTime = 0;
    let waitTime = 3000;
    let tiltX = 0;
    let tiltY = 1;
    let tiltZ = 0;

    // FORCING PROGRAM TO WAIT FOR FOOD IMG
    snakeProject.preload = () => {
        foodImage = snakeProject.loadImage('../images/sTexture.jpg');
        sound = snakeProject.loadSound('../music/pop.mp3');
        gameOver = snakeProject.loadSound('../music/pmsound.mp3');
        music = snakeProject.loadSound('../music/puzzle3.mp3');
    };

    // INITIALIZING THE PLAY FIELD
    snakeProject.setup = () => {

        music.loop();

        // BEGINNING OF ANY P5 APP
        const window = snakeProject.min(snakeProject.windowWidth - 10, snakeProject.windowHeight - 50);

        // WEBGL SO WE CAN PLAY IN 3D
        snakeProject.createCanvas(window * 1.2, window, snakeProject.WEBGL);

        // CENTERED AT THE ORIGIN
        zeroVector = snakeProject.createVector(0, 0, 0);

        mapWidth = snakeProject.round(snakeProject.width * 0.6);

        cellWidth = snakeProject.round(mapWidth / cells);

        rightmostCellCenter = cellWidth * cellsRight;

        snakeProject.ambientLight(100);

        // DEFINING OUR CONTROLS
        mapKeys();

        // SETTING UP THE GAME
        setUp();

    };

    // MAIN
    snakeProject.draw = () => {

        if (snakeProject.millis() > nextMoveTime) {

            moveSnake();

            let ms = msMovement;

            if (snakeProject.keyIsDown(snakeProject.SHIFT)) {

                nextMoveTime += ms/speedFactor;

            }else {

                nextMoveTime += ms;

            }
        }

        positionCamera();
        snakeProject.background(0);
        snakeProject.smooth();
        drawArena();
        drawSnake();
        drawFood();
    };

    // HANDLES KEY PRESSES EX. ONCE KEY IS ACTUALLY PRESSED
    snakeProject.keyPressed = () => {

        let requestedDir = keyMappings[snakeProject.key];

        if (requestedDir) {
            let oppositeOfCurrentDir = p5.Vector.mult(direction, -1);

            if (!requestedDir.equals(oppositeOfCurrentDir)) {
                direction = requestedDir;

                if (!nextMoveTime)
                    nextMoveTime = snakeProject.millis();
            }
        }

        // TILT LEFT
        if (snakeProject.key == 'z') {
            if(tiltX != -2) {
                tiltX-=.1;
                tiltY-=.1;
                tiltZ-=.1;
            }
        }

        // TILT RIGHT
        if (snakeProject.key == 'x') {
            if(tiltX != 2) {
                tiltX+=.1;
                tiltY+=.1;
                tiltZ+=.1;
            }
        }
    };

    // HANDLES POSITIONING THE CAMERA 
    function positionCamera() {

        if (initialCamera) {

            cameraZ = (snakeProject.height / 2.0) / Math.tan(Math.PI * 30.0 / 180.0);
            
            cameraX = -mapWidth * 0.8;
            
            cameraY = -mapWidth * 0.8;
            
            initialCamera = false;
        }
        
        // CAMERA POSITION BASED ON MOVEMENT OF THE MOUSE
        cameraX = -snakeProject.mouseX;

        cameraY = -snakeProject.mouseY;

        // DIRECTIONAL LIGHTING MOVES WITH MOUSE
        snakeProject.directionalLight(255,255,255,-cameraX * .5, -cameraY * .5, cameraX * .8);

        // CAMERA POSITION VALUE ON XYZ
        // CENTER OF THE SKETCH
        // XYZ COMPONENT UP FROM CAMERA
        snakeProject.camera(cameraX, cameraY, cameraZ, -50, 0, 0, tiltX, tiltY, tiltZ);
    }

    // KEYS USED TO NAVIGATE THE MAP
    function mapKeys() {

        const vector = snakeProject.createVector;

        const up      = vector( 0, -1,  0);

        const down    = vector( 0,  1,  0);

        const left    = vector(-1,  0,  0);

        const right   = vector( 1,  0,  0);

        const forwards    = vector( 0,  0, -1);

        const backwards = vector( 0,  0,  1);

        keyMappings = {
            'w':          forwards,
            's':          backwards,
            'ArrowLeft':  left,
            'ArrowRight': right,
            'ArrowUp':    up,
            'ArrowDown':  down,
        };
    }

    // SETS UP NEW GAME
    function setUp() {

        direction = snakeProject.createVector(0, 0, 0);

        snakeFood = newFoodPosition();

        snakeBody = Array.from (
            {length: startingSegments}, (v, i) => 
            snakeProject.createVector(-i * cellWidth, 0, 0)
        );
    }

    // GENERATING NEXT RANDOM LOCATION FOR FOOD
    function newFoodPosition() {

        let tempCellsRight = cellsRight;
        
        let random = () => 
            snakeProject.round(snakeProject.random(-tempCellsRight, tempCellsRight)) * cellWidth;
        
        return snakeProject.createVector(random(), random(), random());
    }

    // HANDLES SNAKES MOVEMENTS
    function moveSnake() {

        if (!direction.equals(zeroVector)) {

            let newHeadPos = p5.Vector.add(snakeBody[0], p5.Vector.mult(direction, cellWidth));

            if (collides(newHeadPos)) {
                
                gameOver.play();

                let brightness = 255;
                initialTime = snakeProject.millis() + 2000;
                while (initialTime - snakeProject.millis() != 0){
                
                    if(brightness > 0 && initialTime - snakeProject.millis() == 1000){
                        brightness-=80;
                        initialTime += 1000;
                        snakeProject.ambientLight(brightness);
                        snakeProject.directionalLight(brightness, brightness, brightness,0,0,0);
                        snakeProject.redraw();
                    }
                }
                setUp();

            } else {
                
                if (newHeadPos.equals(snakeFood)) {
                
                    snakeFood = newFoodPosition();
                    sound.play();
            
                } else
                    // DISCARD THE LAST ONE
                    snakeBody.pop();

                // NEW HEAD GOES ON FRONT
                snakeBody.unshift(newHeadPos);
            }
        }
    }

    // TAKES CARE OF COLLISIONS WITH FIELD OR SELF
    function collides(position) {

        let inBounds = position.array().every(coordinate => 
            Math.abs(coordinate) < mapWidth / 2);

        let collidesWithSelf = snakeBody.some((segment, location) => 
            location > 0 && segment.equals(position));

        return collidesWithSelf || !inBounds;
    }

    // HANDLES DRAWING THE PLAY AREA
    function drawArena() {

        snakeProject.stroke('purple');

        const l = rightmostCellCenter + cellWidth / 2;

        const s = -l;

        const q = snakeProject.TAU / 4;

        [
            [[0, 0, s], 0, 0],
            [[l, 0, 0], 0, q],
            [[0, l, 0], q, 0],
        ].forEach(xf => {
        
        const [position, xRot, yRot] = xf;

            at(...position, () => {

                snakeProject.rotateX(xRot);

                snakeProject.rotateY(yRot);

                for (let v = s; v <= l; v += cellWidth) {

                    snakeProject.line(s, v, 0, l, v, 0);
                    snakeProject.line(v, s, 0, v, l, 0);

                }
            });
        });
    }

    // HANDLES DRAWING THE SNAKE
    function drawSnake() {

         const segmentWidth = cellWidth * 0.6;

        snakeBody.forEach((segment, location) => {
            let r = snakeProject.random(255);
            let g = snakeProject.random(255);
            let b = snakeProject.random(255);
            
            // OUTLINE
            snakeProject.stroke('cyan');

            at(...segment.array(), () => 
                snakeProject.sphere(snakeProject.map
                    (location, 0, snakeBody.length, segmentWidth, segmentWidth * 0.3)));

            snakeProject.stroke(r, g, b);

            snakeProject.fill('cyan');

            drawReferenceStructures(snakeBody[0], segmentWidth);

        });
    }

    // HANDLES DRAWING THE FOOD
    function drawFood() {

        let r = snakeProject.random(255);
        let g = snakeProject.random(255);
        let b = snakeProject.random(255);

        snakeProject.noStroke();

        snakeProject.texture(foodImage);

        let itemWidth = cellWidth * 0.4;

        at(...snakeFood.array(), () => snakeProject.sphere(itemWidth));

        snakeProject.stroke(r,g,b);

        snakeProject.fill('red');

        snakeProject.specularMaterial(1000);

        drawReferenceStructures(snakeFood, itemWidth);

    }

    function drawReferenceStructures(position, objWidth) {

        // LARGEST COORDINATE
        const l = mapWidth / 2;
        // SMALLEST COORDINATE
        const s = -l;

        const {x, y, z} = position;

        // CONNECTING POINTS
        snakeProject.line(x, y, z,  l, y, z);

        snakeProject.line(x, y, z,  x, l, z);

        snakeProject.line(x, y, z,  x, y, s);

        snakeProject.noStroke();

        const w = objWidth;

        // LENGTH ON FLAT DIM
        const f = 0.1;

        // BOX WITH WIDTH/HEIGHT/DEPTH
        at(l, y, z, () => snakeProject.box(f, w, w));

        at(x, l, z, () => snakeProject.box(w, f, w));

        at(x, y, s, () => snakeProject.box(w, w, f));

    }

    function at(x, y, z, fn) {

        // SAVES THE CURRENT DRAWING STYLE
        snakeProject.push();

        snakeProject.translate(x, y, z);

        // CALLING THE FUNCTION THAT WAS PASSED IN
        fn();

        // RESTORES THE DRAWING
        snakeProject.pop();
    }
});