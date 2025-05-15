import { useRef, useEffect } from 'react';
import { useTheme } from '~/components/theme-provider';
import { useReducedMotion, useSpring } from 'framer-motion';
import { useInViewport } from '~/hooks';
import { Transition } from '~/components/transition';
import styles from './skills-background.module.css';

export const SkillsBackground = ({ mousePosition, ...props }) => {
  const canvasRef = useRef();
  const containerRef = useRef();
  const start = useRef(Date.now());
  const { theme } = useTheme();
  const isInViewport = useInViewport(containerRef);
  const reduceMotion = useReducedMotion();
  
  // Create springs for mouse movement
  const rotationX = useSpring(0, { stiffness: 40, damping: 20, mass: 1.4 });
  const rotationY = useSpring(0, { stiffness: 40, damping: 20, mass: 1.4 });
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize WebGL context
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl2');
    
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Create shader program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);
    
    // Create geometry - a plane covering the screen
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,  // bottom left
         1.0, -1.0,  // bottom right
        -1.0,  1.0,  // top left
         1.0,  1.0,  // top right
      ]),
      gl.STATIC_DRAW
    );
    
    // Set up attributes
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    
    // Set up uniforms
    const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    const mouseUniformLocation = gl.getUniformLocation(program, 'u_mouse');
    const colorUniformLocation = gl.getUniformLocation(program, 'u_color');
    
    // Set the color based on theme - using a more purplish tone for skills
    const themeColor = theme === 'dark' 
      ? [0.4, 0.2, 0.8, 1.0]  // Purple color for dark theme
      : [0.2, 0.0, 0.6, 1.0];  // Darker purple for light theme
    
    // Animation loop
    let animationFrame;
    
    const render = () => {
      if (!isInViewport && !reduceMotion) return;
      
      const time = (Date.now() - start.current) * 0.001;  // Time in seconds
      
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.useProgram(program);
      gl.uniform1f(timeUniformLocation, time);
      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
      gl.uniform2f(mouseUniformLocation, rotationX.get(), rotationY.get());
      gl.uniform4fv(colorUniformLocation, themeColor);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      animationFrame = requestAnimationFrame(render);
    };
    
    if (!reduceMotion) {
      animationFrame = requestAnimationFrame(render);
    } else {
      render();
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
      
      // Clean up WebGL resources
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [isInViewport, reduceMotion, rotationX, rotationY, theme]);
  
  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = event => {
      if (reduceMotion) return;
      
      const { innerWidth, innerHeight } = window;
      const position = {
        x: (event.clientX - innerWidth / 2) / innerWidth,
        y: (event.clientY - innerHeight / 2) / innerHeight,
      };
      
      rotationX.set(position.y / 4);
      rotationY.set(position.x / 4);
    };
    
    if (isInViewport && !reduceMotion) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isInViewport, reduceMotion, rotationX, rotationY]);
  
  return (
    <Transition in timeout={3000} nodeRef={containerRef}>
      {({ visible, nodeRef }) => (
        <div className={styles.container} ref={nodeRef} data-visible={visible}>
          <canvas 
            className={styles.canvas} 
            ref={canvasRef} 
            aria-hidden="true" 
            {...props} 
          />
        </div>
      )}
    </Transition>
  );
};

// Helper function to create shader
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  
  return shader;
}

// Helper function to create program
function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  
  return program;
}

// Vertex shader
const vertexShaderSource = `#version 300 es
in vec2 a_position;
out vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_position * 0.5 + 0.5;
}
`;

// Fragment shader - creates a hexagonal pattern with animated flow
const fragmentShaderSource = `#version 300 es
precision highp float;

in vec2 v_texCoord;
out vec4 outColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec4 u_color;

// Hexagonal grid pattern
vec4 hexGrid(vec2 uv, float scale, float width) {
  // Scaling and aspect correction
  uv *= scale;
  
  // Hexagonal grid math
  vec2 r = vec2(1.0, 1.73);
  vec2 h = r * 0.5;
  vec2 a = mod(uv, r) - h;
  vec2 b = mod(uv + h, r) - h;
  
  // Distance to closest hexagon edge
  float hexDistance = min(dot(a, a), dot(b, b));
  float hexEdge = smoothstep(width - 0.05, width, hexDistance);
  
  // Animate based on time and mouse position
  float timeOffset = sin(u_time * 0.2 + uv.x * 0.5 + uv.y * 0.3);
  float mouseInfluence = length(uv * 0.1 - u_mouse) * 0.5;
  
  // Create the grid with some animation and color
  float intensity = (1.0 - hexEdge) * (0.4 + 0.2 * sin(u_time + uv.y * 2.0) + 0.2 * mouseInfluence);
  
  return vec4(u_color.rgb, intensity * 0.15);
}

void main() {
  vec2 uv = v_texCoord;
  
  // Adjust aspect ratio
  uv.x *= u_resolution.x / u_resolution.y;
  
  // Multiple overlapping hex grids at different scales for a richer effect
  vec4 grid1 = hexGrid(uv + sin(u_time * 0.1) * 0.1, 2.0, 0.05);
  vec4 grid2 = hexGrid(uv * 1.5 + cos(u_time * 0.15) * 0.12, 3.0, 0.02);
  vec4 grid3 = hexGrid(uv * 0.8 - vec2(u_time * 0.03, 0.0), 1.5, 0.1);
  
  // Blend the grids
  outColor = mix(grid1, grid2, 0.5) + grid3 * 0.3;
}
`; 