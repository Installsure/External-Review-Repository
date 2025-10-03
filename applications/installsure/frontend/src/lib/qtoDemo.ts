export type Assembly = "paint_wall" | "concrete_slab";

export function qtoDemo(assembly: Assembly, inputs: Record<string, number>) {
  if (assembly === "paint_wall") {
    const area = (inputs.length || 10) * (inputs.height || 3); // m²
    const cost = area * (inputs.unitCost || 2.5);              // $/m²
    return { quantity: area, unit: "m2", cost: Math.round(cost*100)/100 };
  }
  if (assembly === "concrete_slab") {
    const volume = (inputs.length || 5) * (inputs.width || 5) * (inputs.thickness || 0.1); // m³
    const cost = volume * (inputs.unitCost || 120);                                        // $/m³
    return { quantity: volume, unit: "m3", cost: Math.round(cost*100)/100 };
  }
  return { quantity: 0, unit: "", cost: 0 };
}
