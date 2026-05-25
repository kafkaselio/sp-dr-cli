export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">fps-manager</h1>
        <p className="text-gray-500 mb-8">Assembled by SP//DR Build System</p>
        <div className="flex gap-4 justify-center">
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Documentation
          </a>
          <a
            href="/api/health"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Health Check
          </a>
        </div>
      </div>
    </main>
  );
}
