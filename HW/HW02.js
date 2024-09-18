"use strict";
var gl;
var points;

var sliderVal = document.getElementById('slider').value;
const recursiveLevel =  document.getElementById("recursiveLevel");

init();

function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if ( !gl ) { alert( "WebGL isn't available" ); }

    points=[
        vec2( -1 , 0 ),
        vec2( 1 , 0 )
    ];
    
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc , 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );

    // slider event listener
    document.getElementById('slider').addEventListener('change', function (e) {
        sliderVal = this.value;

        points=[
            vec2( -1 , 0 ),
            vec2( 1 , 0 )
        ];

        divide(sliderVal);

        console.log(points);
        
        gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

        render();
    })

    render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    recursiveLevel.innerText = sliderVal;

    // gl.drawArrays( gl.POINTS, 0, points.length );
    gl.drawArrays( gl.LINE_STRIP, 0, points.length );
}

function divide (remaining) {
    if (remaining > 0) {
        let newPoints = [];

        for (let i=0; i<points.length-1; i++) {

            newPoints.push(points[i]);

            if ((points[i][1] == 0) && (points[i+1][1] == 0)) { // Straight line -> We divide
                let minX = points[i][0];
                let maxX = points[i+1][0];

                let third = (maxX - minX) / 3;

                let a = minX + third;
                let b = a + third;

                let c = gPeak (a, b);

                newPoints.push(vec2(a, 0), c, vec2(b, 0));
            }
        }

        newPoints.push(points[points.length-1]);

        points = newPoints;

        divide(remaining - 1);
    }
}

function gPeak (a, b) {
    let len = b - a;

    let newPointX = a + len / 2;
    // We want an equilateral triangle => Let's use pythagorean theorem
    // a = sqrt(c**2 - a**2) = sqrt(c**2 - (c / 2)**2) = sqrt(c**2 - (c / 2)**2) = sqrt((3 * c**2) / 4) = (sqrt(3)/2) * c
    let newPointY = (Math.sqrt(3) / 2) * len;

    return vec2(newPointX, newPointY);
}