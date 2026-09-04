import React, { useEffect, useRef } from 'react';

/**
 * CinematicAVFlame
 *
 * Procedural WebGL flame/plasma generator simulating an ethereal mixture of
 * liquid metallic gold and soft white flames flowing organically through the AV contours.
 *
 * Features:
 * - Domain-warped Fractional Brownian Motion (fBm) fluid turbulence
 * - Smooth upward flame flow with gentle organic lateral swaying
 * - Gold + white flame palette with bright white-hot peak highlights
 * - High performance (lightweight quad fragment shader at 60fps)
 * - Built-in graceful 2D Canvas fallback if WebGL is unavailable
 */
export const CinematicAVFlame: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animFrameId: number;
    let isCleanedUp = false;

    // Check for WebGL support
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl', {
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
        premultipliedAlpha: false,
      }) || (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    } catch {
      gl = null;
    }

    if (!gl) {
      // 2D Canvas Fallback
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let t = 0;
      const render2D = () => {
        if (isCleanedUp) return;
        t += 0.02;
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        // Fluid flame gradient waves
        const grad = ctx.createLinearGradient(0, height, 0, 0);
        grad.addColorStop(0.0, 'rgba(160, 110, 20, 0.2)');
        grad.addColorStop(0.3, 'rgba(218, 165, 32, 0.7)');
        grad.addColorStop(0.65, 'rgba(255, 215, 100, 0.9)');
        grad.addColorStop(0.85, 'rgba(255, 245, 220, 0.95)');
        grad.addColorStop(1.0, 'rgba(255, 255, 255, 1.0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        animFrameId = requestAnimationFrame(render2D);
      };
      render2D();

      return () => {
        isCleanedUp = true;
        cancelAnimationFrame(animFrameId);
      };
    }

    // WebGL Shader Implementation
    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform float u_time;
      uniform vec2 u_resolution;

      // Fast Simplex Noise
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187,
                            0.366025403784439,
                           -0.577350269189626,
                            0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
              + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m * m;
        m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      // Fractional Brownian Motion (fBm) with domain warping
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(cos(0.55), sin(0.55), -sin(0.55), cos(0.55));
        for (int i = 0; i < 4; ++i) {
          v += a * snoise(p);
          p = rot * p * 2.05 + vec2(12.3, 45.6);
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = v_uv;
        float t = u_time * 0.42;

        // Elegant upward flame motion with silky lateral wave
        vec2 p = uv * 3.2;
        p.y -= t * 0.95; // Gentle upward flame ascent
        p.x += sin(uv.y * 3.4 + t * 0.75) * 0.18; // Soft organic sway

        // Dual-domain warping: creates luxurious, curling liquid-flame ribbons
        vec2 q = vec2(fbm(p + vec2(0.0, 0.0)), fbm(p + vec2(4.3, 2.1)));
        vec2 r = vec2(fbm(p + 2.8 * q + vec2(1.5, 7.2) - t * 0.35),
                      fbm(p + 2.8 * q + vec2(6.8, 3.4) + t * 0.28));

        float flame = fbm(p + 3.2 * r);
        flame = clamp(flame * 0.5 + 0.5, 0.0, 1.0);

        // Secondary soft flame tendril flowing diagonally
        float diag = snoise(uv * 2.6 - vec2(t * 0.25, t * 0.7));
        diag = diag * 0.5 + 0.5;
        flame = mix(flame, diag, 0.28);

        // Living breath modulation
        float breath = sin(u_time * 0.9) * 0.06 + 0.94;
        flame *= breath;

        // Color Palette: Deep Metallic Gold -> Warm Molten Gold -> Luminous Amber -> Soft White Flame -> White-Hot Highlights
        vec3 deepGold    = vec3(0.48, 0.32, 0.06); // #7a5210
        vec3 richGold    = vec3(0.82, 0.58, 0.12); // #d1941f
        vec3 moltenGold  = vec3(0.98, 0.74, 0.20); // #fbbc33
        vec3 amberGlow   = vec3(1.00, 0.88, 0.52); // #ffe085
        vec3 softWhite   = vec3(1.00, 0.96, 0.88); // #fff5e0
        vec3 whiteHot    = vec3(1.00, 1.00, 1.00); // pure white-hot core

        vec3 col;
        if (flame < 0.28) {
          col = mix(deepGold, richGold, flame / 0.28);
        } else if (flame < 0.55) {
          col = mix(richGold, moltenGold, (flame - 0.28) / 0.27);
        } else if (flame < 0.75) {
          col = mix(moltenGold, amberGlow, (flame - 0.55) / 0.20);
        } else if (flame < 0.88) {
          col = mix(amberGlow, softWhite, (flame - 0.75) / 0.13);
        } else {
          col = mix(softWhite, whiteHot, (flame - 0.88) / 0.12);
        }

        // Concentrated white-hot filament highlights
        float hotCore = pow(flame, 3.6) * 1.4;
        col += vec3(hotCore * 0.95, hotCore * 0.94, hotCore * 0.90);

        gl_FragColor = vec4(col, 0.96);
      }
    `;

    function compileShader(source: string, type: number): WebGLShader | null {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('WebGL Shader Compile Error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('WebGL Program Link Error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Full screen quad buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uResolution = gl.getUniformLocation(program, 'u_resolution');

    // Set resolution (400x450 canvas is optimal for crisp quality and ultralow GPU overhead)
    canvas.width = 404;
    canvas.height = 456;
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (uResolution) {
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    }

    const startTime = performance.now();

    const render = () => {
      if (isCleanedUp || !gl) return;
      const currentTime = (performance.now() - startTime) * 0.001;

      if (uTime) {
        gl.uniform1f(uTime, currentTime);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      isCleanedUp = true;
      cancelAnimationFrame(animFrameId);
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteBuffer(positionBuffer);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`w-full h-full object-contain pointer-events-none select-none ${className}`}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
};
