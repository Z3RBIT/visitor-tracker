import type { VisitorData } from "../types/visitor";

interface Props {
  data: VisitorData;
  savedId: string | null;
}

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean | null;
}) => (
  <div className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
    <span className="text-white/60 text-sm">{label}</span>
    <span className="text-white text-sm font-medium text-right max-w-[60%] truncate">
      {value === null || value === undefined ? "Unknown" : String(value)}
    </span>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-5 shadow-xl">
    <h3 className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-3">
      {title}
    </h3>
    {children}
  </div>
);

const VisitorCard = ({ data, savedId }: Props) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl text-center">
        <div className="text-5xl mb-3">👁️</div>
        <h1 className="text-2xl font-bold text-white">
          Tu información de visita
        </h1>
        {savedId && (
          <p className="text-white/40 text-xs mt-2 font-mono">ID: {savedId}</p>
        )}
      </div>

      {/* Ubicación */}
      <Section title="📍 Ubicación">
        <InfoRow
          label="País"
          value={`${data.location.country} (${data.location.countryCode})`}
        />
        <InfoRow label="Ciudad" value={data.location.city} />
        <InfoRow label="Región" value={data.location.region} />
        <InfoRow label="Latitud" value={data.location.lat} />
        <InfoRow label="Longitud" value={data.location.lon} />
        <InfoRow
          label="Fuente"
          value={data.location.source === "gps" ? "🛰️ GPS" : "🌐 IP"}
        />
      </Section>

      {/* Red */}
      <Section title="🌐 Red">
        <InfoRow label="IP" value={data.network.ip} />
        <InfoRow label="ISP" value={data.network.isp} />
        <InfoRow label="Zona horaria" value={data.network.timezone} />
      </Section>

      {/* Navegador */}
      <Section title="🧭 Navegador">
        <InfoRow label="Nombre" value={data.browser.name} />
        <InfoRow label="Versión" value={data.browser.version} />
        <InfoRow label="Motor" value={data.browser.engine} />
        <InfoRow label="Idioma" value={data.browser.language} />
        <InfoRow label="Idiomas" value={data.browser.languages?.join(", ")} />
        <InfoRow
          label="Cookies"
          value={
            data.browser.cookiesEnabled ? "✅ Habilitadas" : "❌ Deshabilitadas"
          }
        />
        <InfoRow
          label="Do Not Track"
          value={data.browser.doNotTrack ? "✅ Activado" : "❌ Desactivado"}
        />
      </Section>

      {/* Sistema Operativo */}
      <Section title="💻 Sistema Operativo">
        <InfoRow label="Nombre" value={data.os.name} />
        <InfoRow label="Versión" value={data.os.version} />
        <InfoRow label="Arquitectura" value={data.os.architecture} />
        <InfoRow label="Zona horaria" value={data.os.timezone} />
      </Section>

      {/* Dispositivo */}
      <Section title="📱 Dispositivo">
        <InfoRow label="Tipo" value={data.device.type} />
        <InfoRow label="Fabricante" value={data.device.vendor} />
        <InfoRow label="Modelo" value={data.device.model} />
        <InfoRow label="Pantalla" value={data.device.screen} />
        <InfoRow
          label="Pantalla disponible"
          value={data.device.screenAvailable}
        />
        <InfoRow label="Pixel Ratio" value={`${data.device.pixelRatio}x`} />
        <InfoRow
          label="Profundidad color"
          value={
            data.device.colorDepth ? `${data.device.colorDepth} bits` : null
          }
        />
        <InfoRow
          label="Touch"
          value={data.device.touchSupport ? "✅ Sí" : "❌ No"}
        />
        <InfoRow label="RAM" value={data.device.memory} />
        <InfoRow label="Núcleos CPU" value={data.device.cores} />
        <InfoRow label="Conexión" value={data.device.connection} />
        <InfoRow
          label="RTT"
          value={
            data.device.connectionRTT ? `${data.device.connectionRTT} ms` : null
          }
        />
        <InfoRow label="Arquitectura" value={data.device.architecture} />
        <InfoRow label="GPU" value={data.device.gpu} />
        <InfoRow label="Batería" value={data.device.battery} />
        <InfoRow label="Tema del sistema" value={data.device.colorScheme} />
      </Section>

      {/* Sesión */}
      <Section title="🔗 Sesión">
        <InfoRow label="Referrer" value={data.session.referrer} />
        <InfoRow label="User Agent" value={data.session.userAgent} />
      </Section>
    </div>
  );
};

export default VisitorCard;
