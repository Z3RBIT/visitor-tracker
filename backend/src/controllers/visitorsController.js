const {
  saveVisitor,
  getVisitors,
  getVisitorById,
  getStats,
} = require("../services/firebaseService");

// Convierte array de visitantes a CSV
const toCSV = (visitors) => {
  if (visitors.length === 0) return "";

  const headers = [
    "id",
    "timestamp",
    "network.ip",
    "network.isp",
    "network.timezone",
    "location.country",
    "location.countryCode",
    "location.region",
    "location.city",
    "location.lat",
    "location.lon",
    "location.source",
    "browser.name",
    "browser.version",
    "browser.engine",
    "browser.language",
    "browser.cookiesEnabled",
    "browser.doNotTrack",
    "os.name",
    "os.version",
    "os.architecture",
    "device.type",
    "device.vendor",
    "device.model",
    "device.screen",
    "device.colorDepth",
    "device.touchSupport",
    "device.memory",
    "device.cores",
    "device.connection",
    "device.architecture",
    "session.referrer",
    "session.userAgent",
  ];

  const escape = (val) => {
    if (val === null || val === undefined) return "";
    const str = String(val);
    return str.includes(",") || str.includes('"') || str.includes("\n")
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };

  const rows = visitors.map((v) =>
    [
      v.id,
      v.timestamp,
      v.network?.ip,
      v.network?.isp,
      v.network?.timezone,
      v.location?.country,
      v.location?.countryCode,
      v.location?.region,
      v.location?.city,
      v.location?.lat,
      v.location?.lon,
      v.location?.source,
      v.browser?.name,
      v.browser?.version,
      v.browser?.engine,
      v.browser?.language,
      v.browser?.cookiesEnabled,
      v.browser?.doNotTrack,
      v.os?.name,
      v.os?.version,
      v.os?.architecture,
      v.device?.type,
      v.device?.vendor,
      v.device?.model,
      v.device?.screen,
      v.device?.colorDepth,
      v.device?.touchSupport,
      v.device?.memory,
      v.device?.cores,
      v.device?.connection,
      v.device?.architecture,
      v.session?.referrer,
      v.session?.userAgent,
    ]
      .map(escape)
      .join(","),
  );

  return [headers.join(","), ...rows].join("\n");
};

// POST /api/visitors
const createVisitor = async (req, res, next) => {
  try {
    const visitorData = req.body;
    const saved = await saveVisitor(visitorData);
    return res.status(201).json({ success: true, data: saved });
  } catch (error) {
    next(error);
  }
};

// GET /api/visitors
const getAllVisitors = async (req, res, next) => {
  try {
    const { limit, page, startDate, endDate, country, format } = req.query;
    const visitors = await getVisitors({
      limit,
      page,
      startDate,
      endDate,
      country,
    });

    if (format === "csv") {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="visitors.csv"',
      );
      return res.send(toCSV(visitors));
    }

    return res.json({ success: true, count: visitors.length, data: visitors });
  } catch (error) {
    next(error);
  }
};

// GET /api/visitors/:id
const getOneVisitor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const visitor = await getVisitorById(id);

    if (!visitor) {
      return res
        .status(404)
        .json({ error: `Visitante con id "${id}" no encontrado` });
    }

    return res.json({ success: true, data: visitor });
  } catch (error) {
    next(error);
  }
};

// GET /api/visitors/stats
const getStatistics = async (req, res, next) => {
  try {
    const stats = await getStats();
    return res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVisitor,
  getAllVisitors,
  getOneVisitor,
  getStatistics,
};
