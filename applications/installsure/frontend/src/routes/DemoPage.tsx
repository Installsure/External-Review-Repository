import React, { useState } from "react";
import PlanViewer from "../components/PlanViewer";
import PinSidebar from "../components/PinSidebar";
import IFCViewer from "../components/IFCViewer";
import { qtoDemo, Assembly } from "../lib/qtoDemo";

interface Pin {
  id: string;
  x: number;
  y: number;
  note: string;
  photoUrl?: string;
  status: string;
}

export default function DemoPage() {
  const [planFile, setPlanFile] = useState<File | null>(null);
  const [planUrl, setPlanUrl] = useState<string>("");
  const [pins, setPins] = useState<Pin[]>([]);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [showIFC, setShowIFC] = useState(false);
  const [ifcFile] = useState<string>("sample.ifc");
  
  // QTO state
  const [assembly, setAssembly] = useState<Assembly>("paint_wall");
  const [qtoInputs, setQtoInputs] = useState<Record<string, number>>({
    length: 10,
    height: 3,
    width: 5,
    thickness: 0.1,
    unitCost: 2.5,
  });
  const [qtoResult, setQtoResult] = useState<{quantity: number; unit: string; cost: number} | null>(null);

  // Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("installsure_demo_state");
    if (saved) {
      try {
        const state = JSON.parse(saved);
        if (state.pins) setPins(state.pins);
        if (state.planUrl) setPlanUrl(state.planUrl);
        if (state.assembly) setAssembly(state.assembly);
        if (state.qtoInputs) setQtoInputs(state.qtoInputs);
      } catch (err) {
        console.error("Failed to load saved state:", err);
      }
    }
  }, []);

  // Save to localStorage on changes
  React.useEffect(() => {
    const state = {
      pins,
      planUrl,
      assembly,
      qtoInputs,
    };
    localStorage.setItem("installsure_demo_state", JSON.stringify(state));
  }, [pins, planUrl, assembly, qtoInputs]);

  const handlePlanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPlanFile(file);
    }
  };

  const handleOpenPlan = () => {
    if (planFile) {
      const url = URL.createObjectURL(planFile);
      setPlanUrl(url);
    }
  };

  const handleClickTag = (pt: { x: number; y: number }) => {
    const newPin: Pin = {
      id: Date.now().toString(),
      x: pt.x,
      y: pt.y,
      note: "",
      status: "open",
    };
    setPins([...pins, newPin]);
    setSelectedPin(newPin);
  };

  const handleUpdatePin = (updates: Partial<Pin>) => {
    if (!selectedPin) return;
    
    const updatedPin = { ...selectedPin, ...updates };
    setPins(pins.map(p => p.id === selectedPin.id ? updatedPin : p));
    setSelectedPin(updatedPin);
  };

  const handleRunQTO = () => {
    const result = qtoDemo(assembly, qtoInputs);
    setQtoResult(result);
  };

  const handleQtoInputChange = (field: string, value: string) => {
    setQtoInputs({
      ...qtoInputs,
      [field]: parseFloat(value) || 0,
    });
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900">InstallSure A→Z Demo</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Nav Index */}
        <div className="w-48 bg-gray-50 border-r p-4 overflow-y-auto">
          <h3 className="font-semibold text-sm mb-3">Navigation</h3>
          <div className="space-y-2">
            <button
              onClick={() => setShowIFC(false)}
              className={`w-full text-left px-3 py-2 text-sm rounded ${!showIFC ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
            >
              Plan Viewer
            </button>
            <button
              onClick={() => setShowIFC(true)}
              className={`w-full text-left px-3 py-2 text-sm rounded ${showIFC ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
            >
              3D Viewer
            </button>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-sm mb-3">Pins ({pins.length})</h3>
            <div className="space-y-1">
              {pins.map(pin => (
                <button
                  key={pin.id}
                  onClick={() => setSelectedPin(pin)}
                  className={`w-full text-left px-2 py-1 text-xs rounded ${selectedPin?.id === pin.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                >
                  Pin {pin.id.slice(-4)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Viewer (80% width) */}
        <div className="flex-1 flex flex-col" style={{ width: '80%' }}>
          {/* Upload Controls */}
          {!showIFC && !planUrl && (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center p-8">
                <h2 className="text-lg font-semibold mb-4">Upload Plan</h2>
                <input
                  type="file"
                  name="plan"
                  accept=".pdf,image/*"
                  onChange={handlePlanUpload}
                  className="mb-4"
                />
                {planFile && (
                  <button
                    onClick={handleOpenPlan}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Open Plan
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Plan Viewer */}
          {!showIFC && planUrl && (
            <div className="flex-1 relative">
              <PlanViewer src={planUrl} onClickTag={handleClickTag} />
              {/* Pin markers */}
              {pins.map(pin => (
                <div
                  key={pin.id}
                  onClick={() => setSelectedPin(pin)}
                  style={{
                    position: 'absolute',
                    left: `${pin.x * 100}%`,
                    top: `${pin.y * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '24px',
                    height: '24px',
                    background: selectedPin?.id === pin.id ? '#3b82f6' : '#ef4444',
                    borderRadius: '50%',
                    border: '2px solid white',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                />
              ))}
            </div>
          )}

          {/* IFC Viewer */}
          {showIFC && (
            <div className="flex-1 p-4">
              <div className="h-full flex flex-col">
                <div className="flex-1 mb-4">
                  <IFCViewer src={ifcFile} />
                </div>

                {/* QTO Demo Section */}
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Quantity Takeoff Demo</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Assembly</label>
                      <select
                        value={assembly}
                        onChange={(e) => setAssembly(e.target.value as Assembly)}
                        aria-label="Assembly"
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="paint_wall">Paint Wall</option>
                        <option value="concrete_slab">Concrete Slab</option>
                      </select>
                    </div>

                    {assembly === "paint_wall" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-1">Length (m)</label>
                          <input
                            type="number"
                            value={qtoInputs.length}
                            onChange={(e) => handleQtoInputChange('length', e.target.value)}
                            aria-label="length"
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Height (m)</label>
                          <input
                            type="number"
                            value={qtoInputs.height}
                            onChange={(e) => handleQtoInputChange('height', e.target.value)}
                            aria-label="height"
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>
                      </>
                    )}

                    {assembly === "concrete_slab" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-1">Length (m)</label>
                          <input
                            type="number"
                            value={qtoInputs.length}
                            onChange={(e) => handleQtoInputChange('length', e.target.value)}
                            aria-label="length"
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Width (m)</label>
                          <input
                            type="number"
                            value={qtoInputs.width}
                            onChange={(e) => handleQtoInputChange('width', e.target.value)}
                            aria-label="width"
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Thickness (m)</label>
                          <input
                            type="number"
                            value={qtoInputs.thickness}
                            onChange={(e) => handleQtoInputChange('thickness', e.target.value)}
                            aria-label="thickness"
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={handleRunQTO}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Run QTO
                  </button>

                  {qtoResult && (
                    <div 
                      data-testid="qto-output"
                      className="mt-4 p-3 bg-green-50 border border-green-200 rounded"
                    >
                      <p className="text-sm">
                        <strong>Quantity:</strong> {qtoResult.quantity} {qtoResult.unit}
                      </p>
                      <p className="text-sm">
                        <strong>Cost:</strong> ${qtoResult.cost}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Action Panel (20% width) */}
        <div style={{ width: '20%' }} className="bg-white border-l overflow-y-auto">
          <PinSidebar pin={selectedPin} onUpdate={handleUpdatePin} />
        </div>
      </div>
    </div>
  );
}
