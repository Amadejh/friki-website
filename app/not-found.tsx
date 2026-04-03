export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[#EE352F] text-xs font-mono uppercase tracking-[0.2em] mb-4">404</p>
      <h1 className="text-[#3D3C3A] text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Page not found.
      </h1>
      <p className="text-[#787470] text-base mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <a
        href="/"
        className="px-6 py-2.5 bg-[#EE352F] text-white text-xs font-semibold uppercase tracking-widest rounded-sm hover:bg-[#7D1519] transition-colors"
      >
        Back to home
      </a>
    </div>
  )
}
