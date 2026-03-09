import useVisitorInfo from "../hooks/useVisitorInfo";
import VisitorCard from "../components/VisitorCard";

const Home = () => {
  const { data, savedId, loading, error } = useVisitorInfo();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-spin text-6xl">🔍</div>
        <p className="text-white/60 text-lg">Recopilando información...</p>
        <p className="text-white/30 text-sm">
          Solicitando permisos de ubicación
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-6xl">❌</div>
        <p className="text-red-400 text-lg">{error || "Error desconocido"}</p>
      </div>
    );
  }

  return (
    <div className="py-10 px-4">
      <VisitorCard data={data} savedId={savedId} />
    </div>
  );
};

export default Home;
