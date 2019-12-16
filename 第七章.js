//顶点着色器
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    //'uniform mat4 u_ModelViewMatrix;\n' +
    //'uniform mat4 u_ModelMatrix;\n' +
    //'uniform mat4 u_ViewMatrix;\n' +
    'uniform mat4 u_ProjMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main(){\n' +
    //'gl_Position = u_ModelViewMatrix * a_Position;\n' +
    //'gl_Position = u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
    //'gl_Position = u_ViewMatrix * a_Position;\n' +
    'gl_Position = u_ProjMatrix * a_Position;\n' +
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
    var canvas = document.getElementById('webgl');
    //获取nearFar元素
    var nf = document.getElementById('nearFar');
    var gl = getWebGLContext(canvas);
    if(!gl){
        console.log('获取webgl上下文失败！');
    }
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
        console.log('初始化着色器失败');
        return ;
    }
    //获取顶点信息
    var n = initVertexBuffers(gl);
    if(n < 0){
        console.log('获取顶点信息失败');
        return ;
    }

    //清除画布
    gl.clearColor(0 , 0, 0, 1);

    //获取模视矩阵的位置
    //var u_ModelViewMatrix = gl.getUniformLocation(gl.program, 'u_ModelViewMatrix');

    //获取投影矩阵的位置
    var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
    if(!u_ProjMatrix){
        console.log('获取投影矩阵失败');
        return;
    }
    //创建投影矩阵
    var projMatrix = new Matrix4();

    //注册键盘响应函数
    document.onkeydown = function(ev){ keydown(ev, gl, n, u_ProjMatrix, projMatrix, nf);};
    draw(gl, n, u_ProjMatrix, projMatrix, nf);
    ////获取视图矩阵的位置
    // var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    // if(!u_ViewMatrix){
    //     console.log('获取视图矩阵失败');
    //     return;
    // }
    //指定视图矩阵的视点和视线
    //var viewMatrix = new Matrix4();

    // //注册键盘响应函数
    // document.onkeydown = function(ev){ keydown(ev, gl, n, u_ViewMatrix, viewMatrix);};
    //
    // draw(gl, n, u_ViewMatrix, viewMatrix);
    //viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);
    //设置视图矩阵
    //gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    //获取模型矩阵的位置
    //var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    //指定模型矩阵
    //var modelMatrix = new Matrix4;
    //modelMatrix.setRotate(-90, 0, 0, 1);
    //发送模型矩阵
    //gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    //计算模视矩阵
    //var modelViewMatrix = modelMatrix.multiply(viewMatrix);
    //var modelViewMatrix = viewMatrix.multiply(modelMatrix);
    //发送模视矩阵
    //gl.uniformMatrix4fv(u_ModelViewMatrix, false, modelMatrix.elements);


    //画三角形
    //gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
        // Vertex coordinates and color
        0.0,  0.5,  -0.4,  0.4,  1.0,  0.4, // The back green one
        -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,
        0.5, -0.5,  -0.4,  1.0,  0.4,  0.4,

        0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, // The middle yellow one
        -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
        0.0, -0.6,  -0.2,  1.0,  1.0,  0.4,

        0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  // The front blue one
        -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
        0.5, -0.5,   0.0,  1.0,  0.4,  0.4,
    ]);

    var n = 9;

    //创建缓冲区对象
    var vertexColorbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    //为顶点位置分配缓冲区
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE*6, 0);
    gl.enableVertexAttribArray(a_Position);

    //为顶点颜色分配缓冲区
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE*6, FSIZE*3);
    gl.enableVertexAttribArray(a_Color);

    return n;
}

var  g_near = 0.0, g_far = 0.5; //视点位置
//定义键盘的事件监听事件
function keydown(ev, gl, n, u_ProjMatrix, projMatrix, nf) {
    switch (ev.keyCode){
        case 37: g_near -=0.01; break;  //左
        case 38: g_far +=0.01; break;  //上
        case 39: g_near +=0.01; break;  //右
        case 40: g_far -=0.01; break;  //下
        // case 65: g_near -=0.01; break;  //A
        // case 87: g_far  +=0.01; break;  //W
        // case 68: g_near +=0.01; break;  //D
        // case 83: g_far  -=0.01; break;  //S
        default: return;
    }
    draw(gl, n, u_ProjMatrix, projMatrix, nf);
    // if(ev.keyCode == 39){
    //     //键盘右键
    //     g_eyeX += 0.01;
    // }
    // else if(ev.keyCode == 37){
    //     //键盘左键
    //     g_eyeX -= 0.01;
    // }
    // else if(ev.keyCode == 38){
    //     //键盘上键
    //     g_eyeZ +=0.01;
    // }
    // else if(ev.keyCode == 40){
    //     //键盘上键
    //     g_eyeZ -=0.01;
    // }
    // else
    // {
    //     return;
    // }
    //draw(gl, n, u_ViewMatrix, viewMatrix);
}

function draw(gl, n, u_ProjMatrix, projMatrix, nf) {
    //设置投影矩阵
    projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, g_near, g_far);
    //发送视图矩阵到顶点着色器
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    //清除画布
    gl.clear(gl.COLOR_BUFFER_BIT);
    //显示当前near 和 far 值
    nf.innerHTML = 'near: ' + Math.round(g_near * 100)/100 +
        ', far: ' + Math.round(g_far * 100)/100;
    //绘制三角形
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

//定义绘制函数
// function draw(gl, n, u_ViewMatrix, viewMatrix) {
//     //设置视图矩阵值--视点，观察点，上方向
//     viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);
//     //发送视图矩阵到顶点着色器
//     gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
//     //清除画布
//     gl.clear(gl.COLOR_BUFFER_BIT);
//     //绘制三角形
//     gl.drawArrays(gl.TRIANGLES, 0, n);
// }