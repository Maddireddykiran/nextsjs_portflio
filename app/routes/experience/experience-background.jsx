import { useRef, useEffect, useState } from 'react';
import { useTheme } from '~/components/theme-provider';
import { useReducedMotion, useSpring } from 'framer-motion';
import { useInViewport } from '~/hooks';
import { Transition } from '~/components/transition';
import styles from './experience-background.module.css';

export const ExperienceBackground = ({ mousePosition, ...props }) => {
  const canvasRef = useRef();
  const containerRef = useRef();
  const start = useRef(Date.now());
  const { theme } = useTheme();
  const isInViewport = useInViewport(containerRef);
  const reduceMotion = useReducedMotion();
  const [hasWebGLError, setHasWebGLError] = useState(false);
  
  // Create springs for mouse movement
  const rotationX = useSpring(0, { stiffness: 40, damping: 20, mass: 1.4 });
  const rotationY = useSpring(0, { stiffness: 40, damping: 20, mass: 1.4 });
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      // Initialize WebGL context
      const canvas = canvasRef.current;
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        console.error('WebGL not supported');
        setHasWebGLError(true);
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
      
      if (!vertexShader || !fragmentShader) {
        setHasWebGLError(true);
        return;
      }
      
      const program = createProgram(gl, vertexShader, fragmentShader);
      
      if (!program) {
        setHasWebGLError(true);
        return;
      }
      
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
      
      // Set the color based on theme
      const themeColor = theme === 'dark' 
        ? [0.3, 0.2, 0.8, 1.0]  // Purple accent color for dark theme
        : [0.1, 0.1, 0.6, 1.0];  // Deeper purple for light theme
      
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
    } catch (error) {
      console.error('WebGL error:', error);
      setHasWebGLError(true);
      return () => {};
    }
  }, [isInViewport, reduceMotion, rotationX, rotationY, theme]);
  
  // Handle mouse movement
  useEffect(() => {
    if (hasWebGLError) return;
    
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
  }, [isInViewport, reduceMotion, rotationX, rotationY, hasWebGLError]);
  
  return (
    <Transition in timeout={3000} nodeRef={containerRef}>
      {({ visible, nodeRef }) => (
        <div className={styles.container} ref={nodeRef} data-visible={visible}>
          {hasWebGLError ? (
            <div className={styles.fallbackBackground} aria-hidden="true" {...props} />
          ) : (
            <canvas 
              className={styles.canvas} 
              ref={canvasRef} 
              aria-hidden="true" 
              {...props} 
            />
          )}
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

// Fragment shader - creates a subtle flowing grid pattern
const fragmentShaderSource = `#version 300 es
precision highp float;

in vec2 v_texCoord;
out vec4 outColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec4 u_color;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 2.0;
  
  // Mouse movement influence
  p += u_mouse * 0.5;
  
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p * frequency);
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  
  return value;
}

void main() {
  vec2 uv = v_texCoord;
  
  // Adjust aspect ratio
  uv.x *= u_resolution.x / u_resolution.y;
  
  // Create flowing grid effect
  float gridSize = 20.0; // Increased grid size for more visible effect
  uv *= gridSize;
  
  // Add time-based movement to the grid
  uv.y += u_time * 0.1; // Slower movement
  uv.x += sin(u_time * 0.1) * 0.2; // Add horizontal wave movement
  
  // Create grid lines with noise-based movement
  vec2 gridUV = fract(uv);
  vec2 gridId = floor(uv);
  
  // Add some variation based on grid cell ID
  float noise1 = fbm(gridId * 0.1 + u_time * 0.05);
  float noise2 = fbm((gridId + 10.0) * 0.1 + u_time * 0.05);
  
  // Calculate distance to grid lines
  vec2 gridDist = smoothstep(0.03, 0.1, min(gridUV, 1.0 - gridUV)); // Wider lines
  
  // Add some noise to the grid appearance
  gridDist.x += noise1 * 0.3 - 0.15;
  gridDist.y += noise2 * 0.3 - 0.15;
  
  // Combine x and y grid lines
  float grid = gridDist.x * gridDist.y;
  
  // Set grid opacity based on distance from center
  float dist = length(v_texCoord - vec2(0.5));
  float fadeOut = smoothstep(0.9, 0.1, dist); // More gradual fade
  
  // Final color with increased opacity
  vec4 color = vec4(u_color.rgb, grid * 0.25 * fadeOut * u_color.a);
  
  outColor = color;
}
`;