import React, { useEffect, useRef } from 'react';

/**
 * CinematicAVFlame
 *
 * Cinematic procedural WebGL fire simulation where luxurious metallic gold and
 * soft white flames are dynamically BORN FROM the edges and curves of the AV symbol.
 *
 * Features:
 * - Samples the 4K AV emblem geometry to emit flames directly from its contours
 * - Flames flow upward and curl slightly outward along domain-warped turbulence fields
 * - White-hot flame highlights at the emission core, cooling to radiant molten gold and amber
 * - Floating glowing embers and tiny sparks rising from the letter spurs and peaks
 * - Smooth, slow, living 60fps animation (ultralow GPU footprint)
 * - Automatic graceful 2D Canvas fallback
 */
export const CinematicAVFlame: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animFrameId: number;
    let isCleanedUp = false;

    // Initialize WebGL
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
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        // Soft radial flame base
        const grad = ctx.createRadialGradient(w * 0.5, h * 0.55, 10, w * 0.5, h * 0.4, w * 0.45);
        grad.addColorStop(0.0, 'rgba(255, 255, 255, 0.45)');
        grad.addColorStop(0.2, 'rgba(255, 235, 170, 0.35)');
        grad.addColorStop(0.5, 'rgba(245, 166, 35, 0.20)');
        grad.addColorStop(0.8, 'rgba(180, 115, 15, 0.08)');
        grad.addColorStop(1.0, 'transparent');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

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
      uniform sampler2D u_emblem;
      uniform float u_emblem_loaded;

      // Fast Simplex Noise
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187,
                            0.366025403784439,
                           -0.577350269189626,
                            0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
              + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
        m = m * m;
        m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      // Fractional Brownian Motion (fBm)
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(cos(0.52), sin(0.52), -sin(0.52), cos(0.52));
        for (int i = 0; i < 4; ++i) {
          v += a * snoise(p);
          p = rot * p * 2.08 + vec2(8.5, 17.2);
          a *= 0.5;
        }
        return v;
      }

      // Transform canvas UV to emblem texture UV
      vec2 toEmblemUv(vec2 uv) {
        // Center the emblem horizontally and place slightly lower vertically (center at y=0.38)
        // so flames have ample room to billow and rise into the upper canvas
        vec2 center = vec2(0.5, 0.38);
        vec2 scale = vec2(0.68, 0.68 * (540.0 / 404.0) * (404.0 / 456.0));
        return (uv - center) / scale + 0.5;
      }

      void main() {
        vec2 uv = v_uv;
        float t = u_time * 0.42;

        // Limited Edition Flame: Controlled, elegant, clearly visible without being overwhelming
        float heat = 0.0;
        float whiteCore = 0.0;
        float edgeHeat = 0.0;

        const int STEPS = 6;
        for (int i = 0; i < STEPS; ++i) {
          float fi = float(i);
          float weight = pow(1.0 - (fi / float(STEPS)), 1.25);

          // Fluid rising drift with silky lateral sway
          vec2 samplePos = uv + vec2(
            snoise(uv * 3.8 + vec2(t * 0.55, fi * 0.35)) * 0.024 * (fi * 0.4 + 1.0),
            -fi * 0.028 // look downward toward the AV source
          );

          vec2 eUv = toEmblemUv(samplePos);
          if (eUv.x >= 0.0 && eUv.x <= 1.0 && eUv.y >= 0.0 && eUv.y <= 1.0) {
            float alpha = texture2D(u_emblem, eUv).a;
            float turb = fbm(samplePos * 5.0 - vec2(0.0, t * 1.5)) * 0.5 + 0.5;
            float stepFlame = alpha * weight * (turb * 0.85 + 0.25);

            heat += stepFlame;

            if (i <= 2) {
              whiteCore += alpha * (1.0 - fi * 0.4) * turb;
            }
          }
        }

        // Direct edge detection for bright fiery contour glints
        vec2 directEUv = toEmblemUv(uv);
        if (directEUv.x >= 0.005 && directEUv.x <= 0.995 && directEUv.y >= 0.005 && directEUv.y <= 0.995) {
          float aCenter = texture2D(u_emblem, directEUv).a;
          float aRight  = texture2D(u_emblem, directEUv + vec2(0.007, 0.0)).a;
          float aLeft   = texture2D(u_emblem, directEUv - vec2(0.007, 0.0)).a;
          float aUp     = texture2D(u_emblem, directEUv + vec2(0.0, 0.007)).a;
          float aDown   = texture2D(u_emblem, directEUv - vec2(0.0, 0.007)).a;
          float edge = abs(aRight - aLeft) + abs(aUp - aDown);
          edgeHeat = edge * (snoise(uv * 6.5 + t * 1.8) * 0.35 + 0.65);
        }

        heat = clamp(heat * 0.20, 0.0, 1.0);
        whiteCore = clamp(whiteCore * 0.28 + edgeHeat * 0.60, 0.0, 1.0);

        // 14 Distinct glowing ember sparks rising into the night
        float embers = 0.0;
        for (int j = 0; j < 14; ++j) {
          float fj = float(j);
          float seedX = fract(sin(fj * 13.567 + 3.14) * 43758.5453);
          float speed = 0.14 + fract(cos(fj * 31.89) * 23456.78) * 0.16;
          float life = fract(t * speed + seedX);

          float ex = 0.24 + seedX * 0.52 + sin(life * 6.5 + fj * 2.3) * 0.038;
          float ey = 0.30 + life * 0.58;

          float d = length(uv - vec2(ex, ey));
          float spark = smoothstep(0.009, 0.0, d) * (1.0 - life) * (sin(t * 12.0 + fj * 4.5) * 0.35 + 0.65);
          embers += spark;
        }

        // Color Palette: Deep Bronze-Gold -> Rich Molten Gold -> Radiant Gold Flame -> Soft White Flame -> Pure White-Hot Core
        vec3 deepGold    = vec3(0.55, 0.38, 0.08); // #8c6114
        vec3 moltenGold  = vec3(0.96, 0.68, 0.15); // #f5ad26
        vec3 radiantGold = vec3(1.00, 0.85, 0.32); // #ffd952
        vec3 softWhite   = vec3(1.00, 0.96, 0.88); // #fff5e0
        vec3 whiteHot    = vec3(1.00, 1.00, 1.00); // pure white core

        vec3 col = deepGold;
        if (heat < 0.22) {
          col = mix(deepGold, moltenGold, heat / 0.22);
        } else if (heat < 0.55) {
          col = mix(moltenGold, radiantGold, (heat - 0.22) / 0.33);
        } else if (heat < 0.80) {
          col = mix(radiantGold, softWhite, (heat - 0.55) / 0.25);
        } else {
          col = mix(softWhite, whiteHot, (heat - 0.80) / 0.20);
        }

        col = mix(col, whiteHot, whiteCore * 0.75);
        col += vec3(embers * 1.8, embers * 1.5, embers * 1.0);

        // Limited Edition Balanced Alpha: Clearly visible flame presence without overwhelming the page
        float outAlpha = clamp(heat * 0.85 + whiteCore * 0.55 + embers * 1.1, 0.0, 1.0);
        outAlpha *= smoothstep(0.96, 0.72, uv.y);

        gl_FragColor = vec4(col, outAlpha * 0.75);
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
    const uEmblem = gl.getUniformLocation(program, 'u_emblem');
    const uEmblemLoaded = gl.getUniformLocation(program, 'u_emblem_loaded');

    // Canvas internal buffer resolution (optimized for high crispness and ultralow GPU overhead)
    canvas.width = 440;
    canvas.height = 560;
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (uResolution) {
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    }

    // Load AV emblem texture into WebGL
    const emblemTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, emblemTexture);

    // Placeholder 1x1 white pixel while texture loads
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([255, 255, 255, 255])
    );

    const emblemImg = new Image();
    emblemImg.crossOrigin = 'anonymous';
    emblemImg.src = '/assets/brand/av-emblem-transparent.png';

    emblemImg.onload = () => {
      if (isCleanedUp || !gl) return;
      gl.bindTexture(gl.TEXTURE_2D, emblemTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, emblemImg);

      if (uEmblemLoaded) {
        gl.uniform1f(uEmblemLoaded, 1.0);
      }
    };

    if (uEmblem) {
      gl.uniform1i(uEmblem, 0);
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
        gl.deleteTexture(emblemTexture);
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
