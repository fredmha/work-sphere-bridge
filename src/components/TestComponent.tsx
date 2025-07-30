import React from 'react';

const TestComponent = () => {
  console.log("🧪 TestComponent: Rendering...");
  
  return (
    <div className="min-h-screen bg-red-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">🧪 Test Component</h1>
        <p className="text-gray-600 mb-4">
          This is a test component to verify that React rendering is working.
        </p>
        <p className="text-sm text-gray-500">
          If you can see this, React is working correctly!
        </p>
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p className="text-green-800 font-medium">✅ React is working!</p>
        </div>
      </div>
    </div>
  );
};

export default TestComponent; 