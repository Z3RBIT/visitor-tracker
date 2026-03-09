export type LocationSource = "gps" | "ip";
export type DeviceType = "desktop" | "mobile" | "tablet" | "Unknown";
export type ColorScheme = "dark" | "light" | "Unknown";

export interface NetworkInfo {
  ip: string;
  isp: string;
  timezone: string;
}

export interface LocationInfo {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  lat: number | null;
  lon: number | null;
  source: LocationSource;
}

export interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  language: string;
  languages: string[];
  cookiesEnabled: boolean;
  doNotTrack: boolean;
}

export interface OSInfo {
  name: string;
  version: string;
  architecture: string;
  timezone: string;
}

export interface DeviceInfo {
  type: DeviceType;
  vendor: string;
  model: string;
  screen: string;
  screenAvailable: string;
  colorDepth: number | null;
  pixelRatio: number;
  touchSupport: boolean;
  memory: string;
  cores: number | null;
  connection: string;
  connectionRTT: number | null;
  architecture: string;
  gpu: string;
  battery: string;
  colorScheme: ColorScheme;
}

export interface SessionInfo {
  referrer: string;
  userAgent: string;
}

export interface VisitorData {
  network: NetworkInfo;
  location: LocationInfo;
  browser: BrowserInfo;
  os: OSInfo;
  device: DeviceInfo;
  session: SessionInfo;
}

export interface VisitorResponse extends VisitorData {
  id: string;
  timestamp: string;
}

export interface StatsData {
  total: number;
  today: number;
  byCountry: Record<string, number>;
  byBrowser: Record<string, number>;
  byOS: Record<string, number>;
  byDevice: Record<string, number>;
}
