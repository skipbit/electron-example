
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('input-form').onsubmit = () => {
        const inputText = document.getElementById('input-text');
        if (inputText.value === '') {
            return false;
        }

        const newText = document.createElement('p');
        newText.innerText = inputText.value;
        document.getElementById('list').appendChild(newText);

        inputText.value = '';
        return false;
    };
});

window.onload = function() {
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl')
    if (! gl) {
        console.error('WebGL not supported');
        return;
    }

    // Vertex shader program
    const vsSource = `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
            gl_PointSize = 20.0;
        }
    `;

    // Fragment shader program
    const fsSource = `
    precision mediump float;
        uniform vec4 u_color;
        void main() {
            gl_FragColor = u_color;
        }
    `;

    // Compile shader
    function compileShader(gl, source, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    // Create program
    const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program linking error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return;
    }
    gl.useProgram(program);

    // Set vertex positions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        0, 0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Set uniform color
    const colorUniformLocation = gl.getUniformLocation(program, 'u_color');
    gl.uniform4fv(colorUniformLocation, [1, 0, 0, 1]);

    // Animation loop
    let angle = 0;
    function animate() {
        angle += 0.01;
        const x = Math.cos(angle) * 0.5;
        const y = Math.sin(angle) * 0.5;
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x, y]), gl.STATIC_DRAW);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, 1);
        requestAnimationFrame(animate);
    }
    animate();
};
