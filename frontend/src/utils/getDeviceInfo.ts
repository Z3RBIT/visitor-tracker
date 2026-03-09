import type { OSInfo, DeviceInfo, ColorScheme } from "../types/visitor";

export const getOS = (): OSInfo => {
  const ua = navigator.userAgent;
  const platform = navigator.platform || "Unknown";
  const timezone =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown";

  let name = "Unknown";
  let version = "Unknown";
  let architecture = "Unknown";

  // Arquitectura
  if (/x86_64|x64|WOW64|amd64/i.test(ua) || /x86_64|x64/i.test(platform)) {
    architecture = "x86_64";
  } else if (/arm64|aarch64/i.test(ua) || /arm/i.test(platform)) {
    architecture = "ARM64";
  } else if (/arm/i.test(ua)) {
    architecture = "ARM";
  } else if (/x86|i686|i386/i.test(ua)) {
    architecture = "x86";
  }

  // Sistema operativo
  if (/Windows NT/.test(ua)) {
    name = "Windows";
    const match = ua.match(/Windows NT ([\d.]+)/);
    const ntVersion: Record<string, string> = {
      "10.0": "10/11",
      "6.3": "8.1",
      "6.2": "8",
      "6.1": "7",
      "6.0": "Vista",
      "5.1": "XP",
    };
    version = ntVersion[match?.[1] || ""] || match?.[1] || "Unknown";
  } else if (/Mac OS X/.test(ua)) {
    name = "macOS";
    version =
      ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, ".") || "Unknown";
    architecture = /Apple Silicon|arm64/i.test(ua)
      ? "ARM64 (Apple Silicon)"
      : "x86_64";
  } else if (/Android/.test(ua)) {
    name = "Android";
    version = ua.match(/Android ([\d.]+)/)?.[1] || "Unknown";
    architecture = "ARM64";
  } else if (/iPhone|iPad|iPod/.test(ua)) {
    name = "iOS";
    version = ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g, ".") || "Unknown";
    architecture = "ARM64";
  } else if (/Linux/.test(ua)) {
    name = "Linux";
    version = "Unknown";
  }

  return { name, version, architecture, timezone };
};

// GPU via WebGL
const getGPU = (): string => {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return "Unknown";
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) return "Unknown";
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    return renderer || "Unknown";
  } catch {
    return "Unknown";
  }
};

// Batería
const getBattery = async (): Promise<string> => {
  try {
    const nav = navigator as any;
    if (!nav.getBattery) return "Not supported";
    const battery = await nav.getBattery();
    const level = Math.round(battery.level * 100);
    const charging = battery.charging ? "⚡ Cargando" : "🔋 Batería";
    return `${charging} ${level}%`;
  } catch {
    return "Unknown";
  }
};

export const getDeviceInfo = async (): Promise<DeviceInfo> => {
  const ua = navigator.userAgent;

  // Tipo de dispositivo
  let type: DeviceInfo["type"] = "desktop";
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    type = "tablet";
  } else if (
    /mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)
  ) {
    type = "mobile";
  }

  // Vendor y modelo
  let vendor = "Unknown";
  let model = "Unknown";
  if (/iPhone/.test(ua)) {
    vendor = "Apple";
    model = "iPhone";
  } else if (/iPad/.test(ua)) {
    vendor = "Apple";
    model = "iPad";
  } else if (/Samsung/i.test(ua)) {
    vendor = "Samsung";
    model = ua.match(/Samsung[\s-]?([\w]+)/i)?.[1] || "Unknown";
  } else if (/Huawei/i.test(ua)) {
    vendor = "Huawei";
    model = "Unknown";
  } else if (/Xiaomi/i.test(ua)) {
    vendor = "Xiaomi";
    model = "Unknown";
  }

  // Pantalla
  const screen = `${window.screen.width}x${window.screen.height}`;
  const screenAvailable = `${window.screen.availWidth}x${window.screen.availHeight}`;
  const colorDepth = window.screen.colorDepth || null;
  const pixelRatio = window.devicePixelRatio || 1;

  // Touch
  const touchSupport = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // RAM
  const memory = (navigator as any).deviceMemory
    ? `${(navigator as any).deviceMemory} GB`
    : "Unknown";

  // Núcleos CPU
  const cores = navigator.hardwareConcurrency || null;

  // Conexión
  const conn =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;
  const connection = conn?.effectiveType || conn?.type || "Unknown";
  const connectionRTT = conn?.rtt || null;

  // Arquitectura
  const { architecture } = getOS();

  // Color scheme
  const colorScheme: ColorScheme = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches
    ? "dark"
    : window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "Unknown";

  // GPU y batería (async)
  const [gpu, battery] = await Promise.all([
    Promise.resolve(getGPU()),
    getBattery(),
  ]);

  return {
    type,
    vendor,
    model,
    screen,
    screenAvailable,
    colorDepth,
    pixelRatio,
    touchSupport,
    memory,
    cores,
    connection,
    connectionRTT,
    architecture,
    gpu,
    battery,
    colorScheme,
  };
};
