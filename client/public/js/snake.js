new p5(snakeProject => {

    const cells = 15;
    const cellsRight = (cells - 1) / 2;
    const startingSegments = 1;

    let snakeFood;
    let foodImage;

    let keyMappings;
    let mapWidth;
    let cellWidth;
    let zeroVector;
    let nextMoveTime;
    let demo = false;
    let rightmostCellCenter;

    snakeProject.preload = () => {

        foodImage = snakeProject.loadImage('../images/apple.png');

    };

    snakeProject.setup = () => {

        const window = snakeProject.min(snakeProject.windowWidth - 10, snakeProject.windowHeight - 50);

        snakeProject.createCanvas(window, window, snakeProject.WEBGL);

        zeroVector = snakeProject.createVector(0, 0, 0);

        mapWidth = snakeProject.round(snakeProject.width * 0.6);

        cellWidth = snakeProject.round(mapWidth/cells);

        rightmostCellCenter = cellWidth * cellsRight;

        mapKeys();

        setUp();

    };


    function positionCamera() {
        
        const cameraX = -mapWidth * 0.8;
        
        const cameraY = -mapWidth * 0.8;
        
        const cameraZ = (snakeProject.height / 2.0) / Math.tan(Math.PI * 30.0 / 180.0);
    
        snakeProject.camera(cameraX, cameraY, cameraZ,  0, 0, 0,  0, 1, 0);
    }

    function mapKeys() {

        const v = snakeProject.createVector;

        const up      = v( 0, -1,  0);

        const down    = v( 0,  1,  0);

        const left    = v(-1,  0,  0);

        const right   = v( 1,  0,  0);

        const forwards    = v( 0,  0, -1);

        const backwards = v( 0,  0,  1);

        keyMappings = {
            'w':          forwards,
            's':          backwards,
            'ArrowLeft':  left,
            'ArrowRight': right,
            'ArrowUp':    up,
            'ArrowDown':  down,
        };
    }

    function setUp() {

        direction = snakeProject.createVector(0, 0, 0);

        snakeFood = newFoodPosition();

        snakeBody = Array.from (
            {length: startingSegments}, (v, i) => 
            snakeProject.createVector(-i * cellWidth, 0, 0)
        );
    }

    // DRAWING THE PLAY AREA
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

    function at(x, y, z, fn) {

        snakeProject.push();

        snakeProject.translate(x, y, z);

        fn();

        snakeProject.pop();
    }
});
