const validateVisitor = (req, res, next) => {
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res
      .status(400)
      .json({ error: "No se enviaron datos del visitante" });
  }

  // Normalizar y garantizar estructura completa con valores por defecto
  req.body = {
    network: {
      ip: data.network?.ip || "Unknown",
      isp: data.network?.isp || "Unknown",
      timezone: data.network?.timezone || "Unknown",
    },
    location: {
      country: data.location?.country || "Unknown",
      countryCode: data.location?.countryCode || "Unknown",
      region: data.location?.region || "Unknown",
      city: data.location?.city || "Unknown",
      lat: data.location?.lat || null,
      lon: data.location?.lon || null,
      source: data.location?.source || "ip",
    },
    browser: {
      name: data.browser?.name || "Unknown",
      version: data.browser?.version || "Unknown",
      engine: data.browser?.engine || "Unknown",
      language: data.browser?.language || "Unknown",
      cookiesEnabled: data.browser?.cookiesEnabled ?? null,
      doNotTrack: data.browser?.doNotTrack ?? null,
    },
    os: {
      name: data.os?.name || "Unknown",
      version: data.os?.version || "Unknown",
      architecture: data.os?.architecture || "Unknown",
    },
    device: {
      type: data.device?.type || "Unknown",
      vendor: data.device?.vendor || "Unknown",
      model: data.device?.model || "Unknown",
      screen: data.device?.screen || "Unknown",
      colorDepth: data.device?.colorDepth || null,
      touchSupport: data.device?.touchSupport ?? null,
      memory: data.device?.memory || "Unknown",
      cores: data.device?.cores || null,
      connection: data.device?.connection || "Unknown",
      architecture: data.device?.architecture || "Unknown",
    },
    session: {
      referrer: data.session?.referrer || "Direct",
      userAgent: data.session?.userAgent || "Unknown",
    },
  };

  next();
};

module.exports = validateVisitor;
