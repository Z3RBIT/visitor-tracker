const admin = require("firebase-admin");

const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n").replace(
    /"/g,
    "",
  ),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const COLLECTION = "visitors";

// Guardar un visitante
const saveVisitor = async (visitorData) => {
  const docRef = await db.collection(COLLECTION).add({
    ...visitorData,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { id: docRef.id, ...visitorData };
};

// Obtener todos los visitantes (con filtros opcionales)
const getVisitors = async ({
  limit = 100,
  page = 1,
  startDate,
  endDate,
  country,
} = {}) => {
  let query = db.collection(COLLECTION).orderBy("timestamp", "desc");

  if (country) {
    query = query.where("location.country", "==", country);
  }

  if (startDate) {
    query = query.where("timestamp", ">=", new Date(startDate));
  }

  if (endDate) {
    query = query.where("timestamp", "<=", new Date(endDate));
  }

  const offset = (page - 1) * limit;
  query = query.limit(Number(limit)).offset(Number(offset));

  const snapshot = await query.get();
  const visitors = [];

  snapshot.forEach((doc) => {
    visitors.push({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate().toISOString() || null,
    });
  });

  return visitors;
};

// Obtener un visitante por ID
const getVisitorById = async (id) => {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return {
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate().toISOString() || null,
  };
};

// Obtener estadísticas
const getStats = async () => {
  const snapshot = await db.collection(COLLECTION).get();
  const total = snapshot.size;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let todayCount = 0;
  const byCountry = {};
  const byBrowser = {};
  const byOS = {};
  const byDevice = {};

  snapshot.forEach((doc) => {
    const data = doc.data();
    const ts = data.timestamp?.toDate();

    if (ts && ts >= today) todayCount++;

    const country = data.location?.country || "Unknown";
    byCountry[country] = (byCountry[country] || 0) + 1;

    const browser = data.browser?.name || "Unknown";
    byBrowser[browser] = (byBrowser[browser] || 0) + 1;

    const os = data.os?.name || "Unknown";
    byOS[os] = (byOS[os] || 0) + 1;

    const device = data.device?.type || "Unknown";
    byDevice[device] = (byDevice[device] || 0) + 1;
  });

  return { total, today: todayCount, byCountry, byBrowser, byOS, byDevice };
};

module.exports = { saveVisitor, getVisitors, getVisitorById, getStats };
