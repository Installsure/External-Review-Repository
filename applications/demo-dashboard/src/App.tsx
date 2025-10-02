function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Demo Applications</h1>
        <p className="text-xl text-gray-600 mb-8">All your applications are ready for testing!</p>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">InstallSure</h2>
            <p className="text-gray-600 mb-4">
              Construction project management with AutoCAD integration
            </p>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Launch Demo
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">ZeroStack</h2>
            <p className="text-gray-600 mb-4">Infrastructure management platform</p>
            <a
              href="http://localhost:3004"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Launch Demo
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">RedEye</h2>
            <p className="text-gray-600 mb-4">Project tracking and management system</p>
            <a
              href="http://localhost:3003"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              Launch Demo
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Hello</h2>
            <p className="text-gray-600 mb-4">Social networking and communication platform</p>
            <a
              href="http://localhost:3005"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
            >
              Launch Demo
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">FF4U</h2>
            <p className="text-gray-600 mb-4">Fitness and wellness platform</p>
            <a
              href="http://localhost:3002"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
            >
              Launch Demo
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Avatar</h2>
            <p className="text-gray-600 mb-4">AI-powered avatar platform for customer service</p>
            <a
              href="http://localhost:3006"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-600"
            >
              Launch Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
