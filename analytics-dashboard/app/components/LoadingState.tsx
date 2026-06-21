export default function LoadingState() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-brand-beige/30 p-8 min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-brand-sage border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-brand-forest">Cargando analíticas...</p>
      </div>
    </div>
  );
}
