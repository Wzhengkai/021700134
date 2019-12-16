//顶点着色器
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'void main(){\n' +
    'gl_Position = u_MvpMatrix * a_Position;\n' +
    'v_Color = a_Color;\n' +
    '}\n';

//片元着色器
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main(){\n' +
    'gl_FragColor = v_Color;\n' +
    '}\n';

function main() {
    //初始化画布和WebGL上下文
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if(!gl){
        console.log('获取上下文失败');
        return;
    }

    //初始化着色器
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
        console.log('初始化着色器失败');
        return;
    }

    //设置顶点信息
    var n = initVertexBuffers(gl);
    if(n < 0){
        console.log('设置顶点信息失败');
        return;
    }

    gl.clearColor(0, 0, 0, 1);

    // //开启隐藏面消除
    // gl.enable(gl.DEPTH_TEST);
    // //清空颜色和深度缓冲区
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //获取模型视图投影矩阵的位置
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    if(!u_MvpMatrix){
        console.log('获取模型视图投影矩阵失败');
        return;
    }

    //定义模型视图投影矩阵
    var modelMatrix = new Matrix4();
    var viewMatrix = new Matrix4();
    var projMatrix = new Matrix4();
    var mvpMatrix = new Matrix4();

    //计算模型视图投影矩阵--右侧三个三角形
    modelMatrix.setTranslate(0.75, 0, 0);
    viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
    projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
    //计算矩阵积
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    //将矩阵传送至顶点着色器
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);

    //启用多边形偏移
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.drawArrays(gl.TRIANGLES, 0, n/3);    //中间黄色
    gl.polygonOffset(1.0, 1.0);
    gl.drawArrays(gl.TRIANGLES, n/3, n/3);    //前面蓝色
    //gl.drawArrays(gl.TRIANGLES, 2*n/3, n/3);

    //计算模型视图投影矩阵--左侧三个三角形
    modelMatrix.setTranslate(-0.75, 0, 0);
    //计算矩阵积
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    //将矩阵传送至顶点着色器
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([

        0.0,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
        -0.5, -1.0,  -2.0,  1.0,  1.0,  0.4,
        0.5, -1.0,  -2.0,  1.0,  0.4,  0.4,

        0.0,  1.0,   -2.0,  0.4,  0.4,  1.0,  // The front blue one
        -0.5, -1.0,  -2.0,  0.4,  0.4,  1.0,
        0.5, -1.0,   -2.0,  1.0,  0.4,  0.4,

        0.0,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
        -0.5, -1.0, -4.0,  0.4,  1.0,  0.4,
        0.5, -1.0,  -4.0,  1.0,  0.4,  0.4,
    ]);
    var n = 9;

    //创建缓冲区对象
    var vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    return n;
}