//顶点着色器
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main(){\n' +
    'gl_Position = a_Position;\n' +
    'v_TexCoord = a_TexCoord;\n' +
    '}\n';

//片元着色器
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform sampler2D u_Sampler0;\n' +
    'uniform sampler2D u_Sampler1;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main(){\n' +
    'vec4 color0 = texture2D(u_Sampler0, v_TexCoord);\n' +
    'vec4 color1 = texture2D(u_Sampler1, v_TexCoord);\n' +
    'gl_FragColor = color0 * color1;\n' +
    '}\n';

function main() {
    var canvas = document.getElementById('webgl');

    var gl = getWebGLContext(canvas);

    if(!gl){
        console.log('获取画布失败');
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

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    if(!initTextures(gl, n)){
        console.log('设置纹理失败');
        return;
    }
}

//设置顶点信息
function initVertexBuffers(gl) {
    var verticesTexCoords = new Float32Array([
        -0.5, 0.5,   0.0, 1.0,
        -0.5,-0.5,   0.0, 0.0,
         0.5, 0.5,   1.0, 1.0,
         0.5,-0.5,   1.0, 0.0,
    ]);
    var n = 4;

    //创建缓冲区对象
    var vertexTexCoordBuffer = gl.createBuffer();
    if(!vertexTexCoordBuffer){
        console.log('创建缓冲区失败');
        return -1;
    }

    //绑定缓冲区
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    //发送顶点位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0){
        console.log('获取a_Position失败');
        return;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*4, 0);
    gl.enableVertexAttribArray(a_Position);

    //发送纹理
    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    if(a_TexCoord < 0){
        console.log('获取a_TexCoord失败');
        return;
    }
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
}

//初始化纹理
function initTextures(gl, n) {
    var texture0 = gl.createTexture();
    var texture1 = gl.createTexture();
    // if(!texture){
    //     console.log('创建纹理失败');
    //     return false;
    // }
    //获取取样器的存储位置
    var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    var u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if(!(u_Sampler0 && u_Sampler1)){
        console.log('获取取样器失败');
        return;
    }
    //创建图形对象
    var image0 = new Image();
    var image1 = new Image();
    // if(!image){
    //     console.log('创建图形对象失败');
    //     return;
    // }
    //注册图像加载事件的响应函数
    image0.onload = function () {loadTexture(gl, n, texture0, u_Sampler0, image0, 0);};
    image1.onload = function () {loadTexture(gl, n, texture1, u_Sampler1, image1, 1);};
    //请求浏览器加载图像
    image0.src = 'sky.JPG';
    image1.src = 'circle.gif';
    return true;
}

//标记纹理单元是否就绪
var g_texUnit0 = false, g_texUnit1 = false;
//加载纹理
function loadTexture(gl, n, texture, u_Sampler, image, texUnit) {
    //将图像进行Y轴反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    //激活纹理单元
    if(texUnit == 0){
        gl.activeTexture(gl.TEXTURE0);
        g_texUnit0 = true;
    }
    else {
        gl.activeTexture(gl.TEXTURE1);
        g_texUnit1 = true;
    }
    //绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);
    //设置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //将纹理图像分配给纹理对象
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    //将纹理单元传递给片元着色器
    gl.uniform1i(u_Sampler, texUnit);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if(g_texUnit0 && g_texUnit1){
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }
}