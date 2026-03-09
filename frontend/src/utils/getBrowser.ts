import type { BrowserInfo } from "../types/visitor";

const getBrowser = (): BrowserInfo => {
  const ua = navigator.userAgent;
  const language = navigator.language || "Unknown";
  const languages = Array.from(navigator.languages || [language]);
  const cookiesEnabled = navigator.cookieEnabled;
  const doNotTrack =
    navigator.doNotTrack === "1" || (window as any).doNotTrack === "1";

  let name = "Unknown";
  let version = "Unknown";
  let engine = "Unknown";

  if (/Edg\//.test(ua)) {
    name = "Edge";
    version = ua.match(/Edg\/([\d.]+)/)?.[1] || "Unknown";
    engine = "Blink";
  } else if (/OPR\//.test(ua) || /Opera/.test(ua)) {
    name = "Opera";
    version = ua.match(/OPR\/([\d.]+)/)?.[1] || "Unknown";
    engine = "Blink";
  } else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) {
    name = "Chrome";
    version = ua.match(/Chrome\/([\d.]+)/)?.[1] || "Unknown";
    engine = "Blink";
  } else if (/Firefox\//.test(ua)) {
    name = "Firefox";
    version = ua.match(/Firefox\/([\d.]+)/)?.[1] || "Unknown";
    engine = "Gecko";
  } else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) {
    name = "Safari";
    version = ua.match(/Version\/([\d.]+)/)?.[1] || "Unknown";
    engine = "WebKit";
  } else if (/Chromium\//.test(ua)) {
    name = "Chromium";
    version = ua.match(/Chromium\/([\d.]+)/)?.[1] || "Unknown";
    engine = "Blink";
  }

  return {
    name,
    version,
    engine,
    language,
    languages,
    cookiesEnabled,
    doNotTrack,
  };
};

export default getBrowser;
