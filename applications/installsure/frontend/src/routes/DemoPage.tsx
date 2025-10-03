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
  status: "open" | "resolved";
}

interface DraftData {
  planUrl?: string;
  ifcUrl?: string;
  pins: Pin[];
  qtoResult?: { quantity: number; unit: string; cost: number };
}

const STORAGE_KEY = "installsure_demo_draft";

export default function DemoPage() {
  // Load from localStorage on mount
  const [draftData, setDraftData] = useState<DraftData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { pins: [] };
      }
    }
    return { pins: [] };
  });

  const [selectedPinId, setSelectedPinId] = useState<string | undefined>();
  const [view3D, setView3D] = useState(false);
  
  // QTO form state
  const [qtoAssembly, setQtoAssembly] = useState<Assembly>("paint_wall");
  const [qtoLength, setQtoLength] = useState(12);
  const [qtoHeight, setQtoHeight] = useState(3);
  const [qtoWidth, setQtoWidth] = useState(5);
  const [qtoThickness, setQtoThickness] = useState(0.1);

  // Persist to localStorage whenever draftData changes
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));
  }, [draftData]);

  const handlePlanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setDraftData((prev) => ({ ...prev, planUrl: url }));
    }
  };

  const handleOpenPlan = () => {
    // Plan is already loaded via upload, just ensure it's visible
    setView3D(false);
  };

  const handleClickTag = (pt: { x: number; y: number }) => {
    const newPin: Pin = {
      id: `pin-${Date.now()}`,
      x: pt.x,
      y: pt.y,
      note: "",
      status: "open",
    };
    setDraftData((prev) => ({ ...prev, pins: [...prev.pins, newPin] }));
    setSelectedPinId(newPin.id);
  };

  const handlePinUpdate = (pinId: string, updates: Partial<Pin>) => {
    setDraftData((prev) => ({
      ...prev,
      pins: prev.pins.map((p) => (p.id === pinId ? { ...p, ...updates } : p)),
    }));
  };

  const handleOpen3D = () => {
    setView3D(true);
    // For demo, we use a placeholder IFC URL
    if (!draftData.ifcUrl) {
      setDraftData((prev) => ({ ...prev, ifcUrl: "/sample.ifc" }));
    }
  };

  const handleRunQTO = () => {
    const inputs: Record<string, number> = {};
    if (qtoAssembly === "paint_wall") {
      inputs.length = qtoLength;
      inputs.height = qtoHeight;
    } else if (qtoAssembly === "concrete_slab") {
      inputs.length = qtoLength;
      inputs.width = qtoWidth;
      inputs.thickness = qtoThickness;
    }
    
    const result = qtoDemo(qtoAssembly, inputs);
    setDraftData((prev) => ({ ...prev, qtoResult: result }));
  };

  const selectedPin = draftData.pins.find((p) => p.id === selectedPinId);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left nav index */}
      <div className="w-60 bg-white border-r p-4 flex-shrink-0">
        <h2 className="text-lg font-bold mb-4">InstallSure Demo</h2>
        
        <div className="space-y-4">
          {/* Plan Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Plan (PDF)
            </label>
            <input
              type="file"
              name="plan"
              accept=".pdf,image/*"
              onChange={handlePlanUpload}
              className="block w-full text-xs text-gray-500
                file:mr-2 file:py-1 file:px-2
                file:rounded file:border-0
                file:text-xs file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          <button
            onClick={handleOpenPlan}
            disabled={!draftData.planUrl}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Open Plan
          </button>

          <button
            onClick={handleOpen3D}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Open 3D
          </button>

          {/* Pin List */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Pins ({draftData.pins.length})</h3>
            <div className="space-y-1">
              {draftData.pins.map((pin) => (
                <button
                  key={pin.id}
                  onClick={() => setSelectedPinId(pin.id)}
                  className={`w-full text-left px-2 py-1 text-xs rounded ${
                    selectedPinId === pin.id
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {pin.note || "Untitled pin"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Center viewer (80% of remaining space) */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4" style={{ flex: "0 0 80%" }}>
          {view3D ? (
            <div className="h-full bg-white rounded shadow">
              <IFCViewer src={draftData.ifcUrl || ""} />
            </div>
          ) : (
            <div className="h-full bg-white rounded shadow relative">
              {draftData.planUrl ? (
                <>
                  <PlanViewer src={draftData.planUrl} onClickTag={handleClickTag} />
                  {/* Pin markers */}
                  {draftData.pins.map((pin) => (
                    <div
                      key={pin.id}
                      onClick={() => setSelectedPinId(pin.id)}
                      style={{
                        position: "absolute",
                        left: `${pin.x * 100}%`,
                        top: `${pin.y * 100}%`,
                        transform: "translate(-50%, -50%)",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: pin.status === "resolved" ? "#10b981" : "#ef4444",
                        border: "2px solid white",
                        cursor: "pointer",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                    />
                  ))}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Upload a plan to begin
                </div>
              )}
            </div>
          )}
        </div>

        {/* QTO Panel (bottom 20%) */}
        {view3D && (
          <div className="p-4 bg-white border-t" style={{ flex: "0 0 20%" }}>
            <h3 className="text-lg font-semibold mb-4">QTO Demo</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assembly
                </label>
                <select
                  name="Assembly"
                  value={qtoAssembly}
                  onChange={(e) => setQtoAssembly(e.target.value as Assembly)}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="paint_wall">Paint Wall</option>
                  <option value="concrete_slab">Concrete Slab</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  length (m)
                </label>
                <input
                  type="number"
                  name="length"
                  value={qtoLength}
                  onChange={(e) => setQtoLength(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {qtoAssembly === "paint_wall" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    height (m)
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={qtoHeight}
                    onChange={(e) => setQtoHeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {qtoAssembly === "concrete_slab" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      width (m)
                    </label>
                    <input
                      type="number"
                      value={qtoWidth}
                      onChange={(e) => setQtoWidth(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      thickness (m)
                    </label>
                    <input
                      type="number"
                      value={qtoThickness}
                      onChange={(e) => setQtoThickness(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              <div className="flex items-end">
                <button
                  onClick={handleRunQTO}
                  className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Run QTO
                </button>
              </div>
            </div>

            {/* QTO Output */}
            {draftData.qtoResult && (
              <div 
                data-testid="qto-output"
                className="mt-4 p-4 bg-gray-50 rounded border"
              >
                <h4 className="font-semibold mb-2">Results:</h4>
                <p>Quantity: {draftData.qtoResult.quantity.toFixed(2)} {draftData.qtoResult.unit}</p>
                <p>Cost: ${draftData.qtoResult.cost}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right action panel */}
      {!view3D && (
        <PinSidebar
          pins={draftData.pins}
          selectedPin={selectedPin}
          onPinUpdate={handlePinUpdate}
        />
      )}
    </div>
  );
}
