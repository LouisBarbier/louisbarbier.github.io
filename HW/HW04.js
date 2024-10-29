"use strict";

var canvas;
var gl;

var axis = 0;
var xAxis = 0;
var yAxis =1;
var zAxis = 2;

var numElements = 89; // Originaly 29

var theta = [0, 0, 0];
var thetaLoc;
var t = 0;
var tLoc;

var flag = true;
var morphing = true;

var v = 0.01;
var delay = 50;

var verticesI=[
    vec3( -0.5 , 0.5 , 0.5 ), // FRONT
    vec3( 0.5 , 0.5 , 0.5 ),
    vec3( 0.5 , 0.26 , 0.5 ),
    vec3( 0.24 , 0.26 , 0.5 ),
    vec3( 0.24 , -0.26 , 0.5 ),
    vec3( 0.5 , -0.26 , 0.5 ),
    vec3( 0.5 , -0.5 , 0.5 ),
    vec3( -0.5 , -0.5 , 0.5 ),
    vec3( -0.5 , -0.26 , 0.5 ),
    vec3( -0.24 , -0.26 , 0.5 ),
    vec3( -0.24 , 0.26 , 0.5 ),
    vec3( -0.5 , 0.26 , 0.5 ),
    vec3( -0.5 , 0.5 , -0.5 ), // BACK
    vec3( 0.5 , 0.5 , -0.5 ),
    vec3( 0.5 , 0.26 , -0.5 ),
    vec3( 0.24 , 0.26 , -0.5 ),
    vec3( 0.24 , -0.26 , -0.5 ),
    vec3( 0.5 , -0.26 , -0.5 ),
    vec3( 0.5 , -0.5 , -0.5 ),
    vec3( -0.5 , -0.5 , -0.5 ),
    vec3( -0.5 , -0.26 , -0.5 ),
    vec3( -0.24 , -0.26 , -0.5 ),
    vec3( -0.24 , 0.26 , -0.5 ),
    vec3( -0.5 , 0.26 , -0.5 )
];

var verticesU=[
    vec3( 0.5 , 0.5 , 0.5 ), // FRONT
    vec3( 0.5 , -0.5 , 0.5 ),
    vec3( 0.24 , -0.5 , 0.5 ),
    vec3( 0.24 , -0.5 , 0.5 ),
    vec3( -0.24 , -0.5 , 0.5 ),
    vec3( -0.24 , -0.5 , 0.5 ),
    vec3( -0.5 , -0.5 , 0.5 ),
    vec3( -0.5 , 0.5 , 0.5 ),
    vec3( -0.24 , 0.5 , 0.5 ),
    vec3( -0.24 , -0.24 , 0.5 ),
    vec3( 0.24 , -0.24 , 0.5 ),
    vec3( 0.24 , 0.5 , 0.5 ),
    vec3( 0.5 , 0.5 , -0.5 ), // BACK
    vec3( 0.5 , -0.5 , -0.5 ),
    vec3( 0.24 , -0.5 , -0.5 ),
    vec3( 0.24 , -0.5 , -0.5 ),
    vec3( -0.24 , -0.5 , -0.5 ),
    vec3( -0.24 , -0.5 , -0.5 ),
    vec3( -0.5 , -0.5 , -0.5 ),
    vec3( -0.5 , 0.5 , -0.5 ),
    vec3( -0.24 , 0.5 , -0.5 ),
    vec3( -0.24 , -0.24 , -0.5 ),
    vec3( 0.24 , -0.24 , -0.5 ),
    vec3( 0.24 , 0.5 , -0.5 )
];

var vertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0),  // black // FRONT
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(1.0, 1.0, 1.0, 1.0),  // white
    vec4(0.0, 1.0, 1.0, 1.0),  // cyan
    vec4(1.0, 0.26, 0.0, 1.0),  // orange ?
    vec4(0.26, 0.26, 0.26, 1.0),  // grey
    vec4(0.6, 0.0, 0.6, 1.0),  // pink ?
    vec4(0.0, 0.0, 0.26, 1.0),  // light blue
    vec4(0.0, 0.0, 0.26, 1.0),  // light blue // BACK
    vec4(0.6, 0.0, 0.6, 1.0),  // pink ?
    vec4(0.26, 0.26, 0.26, 1.0),  // grey
    vec4(1.0, 0.26, 0.0, 1.0),  // orange ?
    vec4(0.0, 1.0, 1.0, 1.0),  // cyan
    vec4(1.0, 1.0, 1.0, 1.0),  // white
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(0.0, 0.0, 0.0, 1.0)  // black
];

// indices of the 12 triangles that compise the cube

var indices = [
    0, 1, 2, 11, 255, // 0, 1, 2 + 0, 2, 11
    3, 4, 9, 10, 255, // 3, 4, 9 + 3, 9, 10
    5, 6, 7, 8, 255, // 5, 6, 7 + 5, 7, 8
    0, 11, 23, 12, 255, // 0, 11, 23 + 0, 23, 12
    10, 11, 23, 22, 255, // 10, 11, 23 + 10, 23, 22
    9, 10, 22, 21, 255, // 9, 10, 22 + 9, 22, 21
    8, 9, 21, 20, 255, // 8, 9, 21 + 8, 21, 20
    7, 8, 20, 19, 255, // 7, 8, 20 + 7, 20, 19
    6, 7, 19, 18, 255, // 6, 7, 19 + 6, 19, 18
    5, 6, 18, 17, 255, // 5, 6, 18 + 5, 18, 17
    4, 5, 17, 16, 255, // 4, 5, 17 + 4, 17, 16
    3, 4, 16, 15, 255, // 3, 4, 16 + 3, 16, 15
    2, 3, 15, 14, 255, // 2, 3, 15 + 2, 15, 14
    1, 2, 14, 13, 255, // 1, 2, 14 + 1, 14, 13
    0, 1, 13, 12, 255, // 0, 1, 13 + 0, 13, 12
    12, 13, 14, 23, 255, // 12, 13, 14 + 12, 14, 23
    15, 16, 21, 22, 255, // 15, 16, 21 + 15, 21, 22
    17, 18, 19, 20 // 17, 18, 19 + 17, 19, 20
];

init();

function init()
{
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");


    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.PRIMITIVE_RESTART_FIXED_INDEX);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // array element buffer

    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    // color array atrribute buffer

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    // vertex array attribute buffer

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesI), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "iPosition");
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesU), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "uPosition");
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "uTheta");

    tLoc = gl.getUniformLocation( program, "t" );

    //event listeners for buttons

    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    document.getElementById('toggle').addEventListener('click', function () {morphing = !morphing;});

    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag) theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);

    
    if(morphing) t += v;

    if ((t > 1) || (t < 0)) {
        v *= -1;

        if (t > 1) t = 1;
        else t = 0;
    }
    
    gl.uniform1f(tLoc, t);

    gl.drawElements(gl.TRIANGLE_FAN, numElements, gl.UNSIGNED_BYTE, 0);
    
    setTimeout(
        function (){requestAnimationFrame(render);}, delay
    );
}
