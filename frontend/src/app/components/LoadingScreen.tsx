export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary to-primary/80">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
        <h2 className="text-white text-xl font-semibold">Loading...</h2>
      </div>
    </div>
  );
}
