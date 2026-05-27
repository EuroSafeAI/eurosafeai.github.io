import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Fluid Vortex — shader #1 from the Shader wallpapers reference.
// White → icy blue → #003399 palette, cursor-driven vortex with click pulse.
const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;
uniform vec2  u_click;
uniform float u_ctime;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}

float gnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash2(i), f),
                 dot(hash2(i + vec2(1, 0)), f - vec2(1, 0)), u.x),
             mix(dot(hash2(i + vec2(0, 1)), f - vec2(0, 1)),
                 dot(hash2(i + vec2(1, 1)), f - vec2(1, 1)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * gnoise(p); p = p * 2.1 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / u_res.y;
  vec2 p = (uv - 0.5) * vec2(asp, 1.0) * 2.5;
  vec2 m = (u_mouse - 0.5) * vec2(asp, 1.0) * 2.5;
  float t = u_time * 0.07;

  vec2 dm = m - p;
  float rd = length(dm);
  vec2 vortex = vec2(-dm.y, dm.x) / (rd * rd + 0.6) * 0.20;

  vec2 q = p + vortex;
  float n1 = fbm(q + t);
  float n2 = fbm(q + vec2(n1 * 1.2) + t * 0.7);
  float n3 = fbm(q + vec2(n2, n1) + t * 1.1);

  float val = fbm(q + vec2(n3, n2) * 1.4 + t * 0.5) * 0.5 + 0.5;

  float pulse = 0.0;
  if (u_ctime > 0.0) {
    vec2 cp = (u_click - 0.5) * vec2(asp, 1.0) * 2.5;
    float cd = length(p - cp);
    float age = u_time - u_ctime;
    pulse = sin(cd * 10.0 - age * 7.0) * exp(-age * 2.5) * exp(-cd * 1.2);
  }
  val += pulse * 0.2;

  vec3 c0 = vec3(1.00, 1.00, 1.00);
  vec3 c1 = vec3(0.88, 0.93, 1.00);
  vec3 c2 = vec3(0.35, 0.58, 1.00);
  vec3 c3 = vec3(0.00, 0.20, 0.60);

  vec3 col = mix(c0, c1, smoothstep(0.0, 0.4, val));
  col = mix(col, c2, smoothstep(0.4, 0.7, val));
  col = mix(col, c3, smoothstep(0.75, 0.95, val));

  col += vec3(0.1, 0.2, 0.5) * smoothstep(0.6, 0.0, rd) * 0.3;

  gl_FragColor = vec4(col, 1.0);
}
`;

const GeometricMesh = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    const compile = (src: string, type: number) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    };

    const vs = compile(VERT, gl.VERTEX_SHADER);
    const fs = compile(FRAG, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(prog);
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uClick = gl.getUniformLocation(prog, "u_click");
    const uCtime = gl.getUniformLocation(prog, "u_ctime");

    const state = { w: 0, h: 0, time: 0, mx: 0.5, my: 0.5, cx: 0.5, cy: 0.5, ctime: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      state.w = canvas.width;
      state.h = canvas.height;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const parent = canvas.parentElement;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      state.mx = (e.clientX - rect.left) / rect.width;
      state.my = 1.0 - (e.clientY - rect.top) / rect.height;
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      state.cx = (e.clientX - rect.left) / rect.width;
      state.cy = 1.0 - (e.clientY - rect.top) / rect.height;
      state.ctime = state.time;
    };

    resize();
    window.addEventListener("resize", resize);
    parent?.addEventListener("mousemove", onMouseMove);
    parent?.addEventListener("click", onClick);

    let start: number | null = null;
    let animationId = 0;
    const loop = (ts: number) => {
      if (start === null) start = ts;
      state.time = (ts - start) * 0.001;

      gl.uniform2f(uRes, state.w, state.h);
      gl.uniform1f(uTime, state.time);
      gl.uniform2f(uMouse, state.mx, state.my);
      gl.uniform2f(uClick, state.cx, state.cy);
      gl.uniform1f(uCtime, state.ctime);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationId = requestAnimationFrame(loop);
    };
    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      parent?.removeEventListener("mousemove", onMouseMove);
      parent?.removeEventListener("click", onClick);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default GeometricMesh;
