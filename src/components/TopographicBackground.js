'use client';
import { useRef, useEffect, forwardRef, useImperativeHandle, memo } from 'react';
import styles from './TopographicBackground.module.css';

const vertexShaderSource = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  varying vec2 vUv;
  uniform float u_time;
  uniform vec2 u_resolution;

  // Ashima's WebGL-noise (Simplex Noise 3D)
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){ 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0 ); 
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 1.0/7.0;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  uniform float u_scroll;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    // Fix aspect ratio to avoid stretching
    uv.x *= u_resolution.x / u_resolution.y;
    
    // Scale the noise coordinate to zoom out a bit
    vec2 pos = uv * 1.2; 
    
    // Evolve the noise field smoothly over time using Z axis (3D noise)
    // This makes the shapes morph in place like water instead of panning
    float noise = snoise(vec3(pos.x, pos.y, u_time * 0.05));
    
    // Generate contour lines (Isobars)
    // Multiply noise by a factor to create multiple bands
    float bands = 8.0;
    float n = noise * bands;
    
    // Extract fractional part for the lines
    float f = fract(n);
    
    // Smoothstep for crisp anti-aliased lines
    // We create a thin band between 0.0 and lineThickness
    float lineThickness = 0.04;
    float edge = smoothstep(0.0, lineThickness, f) - smoothstep(lineThickness, lineThickness * 2.0, f);
    
    // Background and Line color interpolation based on scroll progress
    vec3 bgColor;
    vec3 lineColorRgb;
    
    // Define our palette
    vec3 dark = vec3(0.075, 0.078, 0.075);
    vec3 grey = vec3(0.4, 0.4, 0.4);
    vec3 light = vec3(0.91, 0.90, 0.87);
    vec3 lime = vec3(0.8, 1.0, 0.0); // Lando's #ccff00
    
    if (u_scroll < 0.5) {
      // First half: Background goes Dark -> Grey
      bgColor = mix(dark, grey, u_scroll * 2.0);
      
      // Lines go Lime -> Dark (high contrast against dark/grey)
      lineColorRgb = mix(lime, dark, u_scroll * 2.0);
    } else {
      // Second half: Background goes Grey -> Light
      bgColor = mix(grey, light, (u_scroll - 0.5) * 2.0);
      
      // Lines stay Dark (high contrast against light background)
      lineColorRgb = dark;
    }
    
    // Render lines over the interpolated background color
    float lineOpacity = 0.5; // keep it slightly subtle
    vec3 finalColor = mix(bgColor, lineColorRgb, edge * lineOpacity);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function compileShader(gl, source, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const TopographicBackground = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const scrollProgressRef = useRef(0.0);

  useImperativeHandle(ref, () => ({
    setScrollProgress: (val) => {
      scrollProgressRef.current = val;
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gl = canvas.getContext('webgl', { alpha: true });
    if (!gl) {
      console.warn('WebGL not supported');
      return;
    }

    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program error:', gl.getProgramInfoLog(program));
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);

    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const scrollLocation = gl.getUniformLocation(program, 'u_scroll');

    let animationFrameId;
    let startTime = Date.now();
    let isVisible = true;

    const resize = () => {
      // Match the physical pixel size of the canvas element
      const parent = canvas.parentElement;
      if (!parent) return;
      // Cap DPR to 1.5 to save massive GPU load on Retina/4K screens
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    };

    window.addEventListener('resize', resize);
    resize(); // Initial sizing

    const render = () => {
      if (!isVisible) return; // Pause rendering if off-screen

      const time = (Date.now() - startTime) / 1000;
      gl.uniform1f(timeLocation, time);
      gl.uniform1f(scrollLocation, scrollProgressRef.current);
      
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      
      animationFrameId = requestAnimationFrame(render);
    };

    // Intersection Observer to pause animation when off-screen
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible) {
        // Resume rendering
        cancelAnimationFrame(animationFrameId);
        render();
      }
    });
    observer.observe(canvas);

    return () => {
      window.removeEventListener('resize', resize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={styles.topoContainer}>
      <canvas ref={canvasRef} className={styles.topoCanvas} />
    </div>
  );
});

export default memo(TopographicBackground);
