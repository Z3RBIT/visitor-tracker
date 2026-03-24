import { useEffect, useState } from "react";
import type { StatsData } from "../types/visitor";
import { getStats, downloadLog } from "../services/api";

const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) => (
  <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-5 shadow-xl text-center">
    <div className="text-4xl mb-2">{icon}</div>
    <div className="text-3xl font-bold text-white">{value}</div>
    <div className="text-white/60 text-sm mt-1">{label}</div>
  </div>
);

const BarItem = ({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-white/80">{label}</span>
        <span className="text-white/60">
          {value} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const GroupSection = ({
  title,
  data,
}: {
  title: string;
  data: Record<string, number>;
}) => {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return (
    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-5 shadow-xl">
      <h3 className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-4">
        {title}
      </h3>
      {sorted.length === 0 ? (
        <p className="text-white/40 text-sm">Sin datos</p>
      ) : (
        sorted.map(([label, value]) => (
          <BarItem key={label} label={label} value={value} total={total} />
        ))
      )}
    </div>
  );
};

const StatsPanel = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [downloading, setDownloading] = useState(false);

  const handleDownloadLog = async () => {
    setDownloading(true);
    try {
      await downloadLog();
    } catch {
      alert("Error al generar el log");
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch {
        setError("Error al cargar estadísticas");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refrescar cada 30 segundos
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-red-400 text-center py-10">
        {error || "Sin datos"}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl text-center">
        <div className="text-5xl mb-3">📊</div>
        <h1 className="text-2xl font-bold text-white">Panel de Visitantes</h1>
        <p className="text-white/40 text-sm mt-1">
          Se actualiza cada 30 segundos
        </p>
        <button
          onClick={handleDownloadLog}
          disabled={downloading}
          className="mt-4 px-6 py-2 rounded-xl text-sm font-medium bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {downloading ? "⏳ Generando..." : "📥 Exportar Log JSON"}
        </button>
      </div>

      {/* Totales */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Total visitantes" value={stats.total} icon="👥" />
        <StatCard label="Visitantes hoy" value={stats.today} icon="📅" />
      </div>

      {/* Grupos */}
      <GroupSection title="🌍 Por País" data={stats.byCountry} />
      <GroupSection title="🧭 Por Navegador" data={stats.byBrowser} />
      <GroupSection title="💻 Por Sistema Operativo" data={stats.byOS} />
      <GroupSection title="📱 Por Dispositivo" data={stats.byDevice} />
    </div>
  );
};

export default StatsPanel;
