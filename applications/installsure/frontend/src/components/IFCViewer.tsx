import React, { useEffect, useRef } from "react";

interface Props {
  src: string;
}

export default function IFCViewer({ src }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lazy load IFC.js and mount basic viewer
    (async () => {
      try {
        // For now, this is a minimal stub
        // In a real implementation, you would:
        // const { IFCLoader } = await import("web-ifc-three/IFCLoader");
        // ... initialize three.js scene; load src
        // Keep minimal for demo; no-op if assets missing
        console.log("IFC Viewer initialized with source:", src);
      } catch (error) {
        console.warn("IFC Viewer initialization failed (expected for demo):", error);
      }
    })();
  }, [src]);

  return (
    <div 
      ref={ref} 
      style={{ width: "100%", height: "100%", background: "#1a1a1a" }}
      className="flex items-center justify-center text-white"
    >
      <div className="text-center">
        <p className="text-lg mb-2">IFC Viewer</p>
        <p className="text-sm text-gray-400">Source: {src || "No file loaded"}</p>
        <p className="text-xs text-gray-500 mt-2">
          (IFC.js integration placeholder - full viewer requires web-ifc-three library)
        </p>
      </div>
    </div>
  );
}
