"use strict";
var gl;
var pointsI;
var pointsU;

var color;
var colorLoc;

var t = 0;
var tLoc;

var morphing = true;

var v = 0.01;
var delay = 50;

init();

function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if ( !gl ) { alert( "WebGL isn't available" ); }

    pointsI=[
        vec2( -0.95 , 0.95 ),
        vec2( 0.95 , 0.95 ),
        vec2( 0.95 , 0.5 ),
        vec2( 0.45 , 0.5 ),
        vec2( 0.45 , -0.5 ),
        vec2( 0.95 , -0.5 ),
        vec2( 0.95 , -0.95 ),
        vec2( -0.95 , -0.95 ),
        vec2( -0.95 , -0.5 ),
        vec2( -0.45 , -0.5 ),
        vec2( -0.45 , 0.5 ),
        vec2( -0.95 , 0.5 )
    ];

    pointsU=[
        vec2( 0.95 , 0.95 ), //
        vec2( 0.95 , -0.95 ), //
        vec2( 0.57 , -0.95 ),
        vec2( 0.19 , -0.95 ),
        vec2( -0.19 , -0.95 ),
        vec2( -0.57 , -0.95 ),
        vec2( -0.95 , -0.95 ), //
        vec2( -0.95 , 0.95 ), //
        vec2( -0.45 , 0.95 ),
        vec2( -0.45 , -0.45 ),
        vec2( 0.45 , -0.45 ),
        vec2( 0.45 , 0.95 )
    ];
    
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the I points into the GPU

    var bufferI = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferI );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsI), gl.STATIC_DRAW );

    // Associate out shader variables with our I points buffer

    var positionLocI = gl.getAttribLocation( program, "iPosition" );
    gl.vertexAttribPointer( positionLocI , 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLocI );
    

    // Load the U points into the GPU

    var bufferU = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferU );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsU), gl.STATIC_DRAW );

    // Associate out shader variables with our U points buffer

    var positionLocU = gl.getAttribLocation( program, "uPosition" );
    gl.vertexAttribPointer( positionLocU , 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLocU );

    //define the uniform variable in the shader, aColor
    colorLoc = gl.getUniformLocation( program, "aColor" );

    //define the uniform variable in the shader, t
    tLoc = gl.getUniformLocation( program, "t" );

    document.getElementById('toggle').addEventListener('click', function () {
        morphing = !morphing;
        if (morphing) {
            this.value = 'ON';
            render(); // We reactivate the calls
        } else {
            this.value = 'OFF';
        }
    });

    render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    // if (morphing) { // Instead we stop the calls completely (so we don't call the GPU for nothing)
        t += v;
        if ((t > 1) || (t < 0)) {
            v *= -1;

            if (t > 1) t = 1;
            else t = 0;
        }
    // }
    
    // console.log('t : ' + t);

    gl.uniform1f(tLoc, t);

    gl.uniform4fv(colorLoc, vec4(t, 0.0, 1-t, 1.0));

    if (morphing) {
        setTimeout(
            function (){requestAnimationFrame(render);}, delay
        );
    }

    gl.drawArrays( gl.POINTS, 0, pointsI.length );
    gl.drawArrays( gl.LINE_LOOP, 0, pointsI.length );
}