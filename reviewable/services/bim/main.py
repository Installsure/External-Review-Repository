from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import ifcopenshell
import ifcopenshell.util.element
from pathlib import Path
import uuid
import asyncio
import json
from datetime import datetime
from typing import Dict, List, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="InstallSure BIM Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data directory
DATA_DIR = Path("data")
UPLOADS_DIR = DATA_DIR / "uploads"
REPORTS_DIR = DATA_DIR / "reports"

# Create directories
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

# In-memory project storage (use Redis in production)
projects_db: Dict[str, Dict] = {}

class BIMProcessor:
    def __init__(self):
        self.cost_database = {
            "IfcWall": {"material_cost": 25.0, "labor_cost": 15.0, "unit": "m²"},
            "IfcSlab": {"material_cost": 30.0, "labor_cost": 20.0, "unit": "m²"},
            "IfcBeam": {"material_cost": 150.0, "labor_cost": 75.0, "unit": "m"},
            "IfcColumn": {"material_cost": 200.0, "labor_cost": 100.0, "unit": "m"},
            "IfcDoor": {"material_cost": 800.0, "labor_cost": 150.0, "unit": "each"},
            "IfcWindow": {"material_cost": 600.0, "labor_cost": 100.0, "unit": "each"},
            "IfcRoof": {"material_cost": 45.0, "labor_cost": 25.0, "unit": "m²"},
        }

    def parse_ifc(self, file_path: Path) -> Dict:
        """Parse IFC file and extract quantities"""
        try:
            ifc_file = ifcopenshell.open(str(file_path))
            
            # Extract project info
            project = ifc_file.by_type("IfcProject")[0] if ifc_file.by_type("IfcProject") else None
            
            quantities = {}
            total_cost = 0.0
            
            # Process each element type
            for element_type in self.cost_database.keys():
                elements = ifc_file.by_type(element_type)
                type_total = 0.0
                count = len(elements)
                
                if count > 0:
                    # Calculate quantities based on element type
                    if element_type in ["IfcWall", "IfcSlab", "IfcRoof"]:
                        # Area-based elements
                        total_area = sum(self._get_element_area(elem) for elem in elements)
                        cost_data = self.cost_database[element_type]
                        type_cost = total_area * (cost_data["material_cost"] + cost_data["labor_cost"])
                        
                        quantities[element_type] = {
                            "count": count,
                            "total_area": round(total_area, 2),
                            "unit": cost_data["unit"],
                            "material_cost": round(total_area * cost_data["material_cost"], 2),
                            "labor_cost": round(total_area * cost_data["labor_cost"], 2),
                            "total_cost": round(type_cost, 2)
                        }
                        
                    elif element_type in ["IfcBeam", "IfcColumn"]:
                        # Length-based elements
                        total_length = sum(self._get_element_length(elem) for elem in elements)
                        cost_data = self.cost_database[element_type]
                        type_cost = total_length * (cost_data["material_cost"] + cost_data["labor_cost"])
                        
                        quantities[element_type] = {
                            "count": count,
                            "total_length": round(total_length, 2),
                            "unit": cost_data["unit"],
                            "material_cost": round(total_length * cost_data["material_cost"], 2),
                            "labor_cost": round(total_length * cost_data["labor_cost"], 2),
                            "total_cost": round(type_cost, 2)
                        }
                        
                    else:
                        # Count-based elements (doors, windows)
                        cost_data = self.cost_database[element_type]
                        type_cost = count * (cost_data["material_cost"] + cost_data["labor_cost"])
                        
                        quantities[element_type] = {
                            "count": count,
                            "unit": cost_data["unit"],
                            "material_cost": round(count * cost_data["material_cost"], 2),
                            "labor_cost": round(count * cost_data["labor_cost"], 2),
                            "total_cost": round(type_cost, 2)
                        }
                    
                    total_cost += quantities[element_type]["total_cost"]
            
            return {
                "project_name": project.Name if project else "Unknown",
                "processed_at": datetime.now().isoformat(),
                "quantities": quantities,
                "summary": {
                    "total_material_cost": round(sum(q["material_cost"] for q in quantities.values()), 2),
                    "total_labor_cost": round(sum(q["labor_cost"] for q in quantities.values()), 2),
                    "total_cost": round(total_cost, 2),
                    "element_count": sum(q["count"] for q in quantities.values())
                }
            }
            
        except Exception as e:
            logger.error(f"Error parsing IFC file: {e}")
            raise HTTPException(status_code=500, detail=f"Error parsing IFC file: {str(e)}")

    def _get_element_area(self, element) -> float:
        """Calculate area for area-based elements"""
        try:
            # Try to get quantity sets
            for definition in element.IsDefinedBy:
                if definition.is_a("IfcRelDefinesByProperties"):
                    prop_set = definition.RelatingPropertyDefinition
                    if prop_set.is_a("IfcElementQuantity"):
                        for quantity in prop_set.Quantities:
                            if quantity.is_a("IfcQuantityArea"):
                                return quantity.AreaValue
            
            # Fallback: estimate from geometry (simplified)
            return 10.0  # Default area in m²
            
        except:
            return 10.0

    def _get_element_length(self, element) -> float:
        """Calculate length for length-based elements"""
        try:
            # Try to get quantity sets
            for definition in element.IsDefinedBy:
                if definition.is_a("IfcRelDefinesByProperties"):
                    prop_set = definition.RelatingPropertyDefinition
                    if prop_set.is_a("IfcElementQuantity"):
                        for quantity in prop_set.Quantities:
                            if quantity.is_a("IfcQuantityLength"):
                                return quantity.LengthValue
            
            # Fallback: estimate from geometry (simplified)
            return 3.0  # Default length in m
            
        except:
            return 3.0

    def generate_pdf_report(self, project_id: str, data: Dict) -> Path:
        """Generate PDF report (placeholder - implement with ReportLab)"""
        try:
            from reportlab.pdfgen import canvas
            from reportlab.lib.pagesizes import letter
            
            report_path = REPORTS_DIR / f"{project_id}_report.pdf"
            
            # Create PDF
            c = canvas.Canvas(str(report_path), pagesize=letter)
            width, height = letter
            
            # Title
            c.setFont("Helvetica-Bold", 20)
            c.drawString(50, height - 50, "InstallSure BIM Cost Report")
            
            # Project info
            c.setFont("Helvetica", 12)
            y = height - 100
            c.drawString(50, y, f"Project: {data['project_name']}")
            y -= 20
            c.drawString(50, y, f"Generated: {data['processed_at']}")
            y -= 40
            
            # Summary
            c.setFont("Helvetica-Bold", 14)
            c.drawString(50, y, "Cost Summary")
            y -= 20
            
            summary = data['summary']
            c.setFont("Helvetica", 12)
            c.drawString(50, y, f"Total Material Cost: ${summary['total_material_cost']:,.2f}")
            y -= 20
            c.drawString(50, y, f"Total Labor Cost: ${summary['total_labor_cost']:,.2f}")
            y -= 20
            c.drawString(50, y, f"Total Project Cost: ${summary['total_cost']:,.2f}")
            y -= 20
            c.drawString(50, y, f"Total Elements: {summary['element_count']}")
            y -= 40
            
            # Detailed breakdown
            c.setFont("Helvetica-Bold", 14)
            c.drawString(50, y, "Detailed Breakdown")
            y -= 30
            
            c.setFont("Helvetica", 10)
            for element_type, qty in data['quantities'].items():
                if y < 100:  # New page if needed
                    c.showPage()
                    y = height - 50
                
                c.drawString(50, y, f"{element_type}: {qty['count']} items, ${qty['total_cost']:,.2f}")
                y -= 15
            
            c.save()
            return report_path
            
        except ImportError:
            # Fallback: create simple text file
            report_path = REPORTS_DIR / f"{project_id}_report.txt"
            with open(report_path, 'w') as f:
                f.write(f"InstallSure BIM Cost Report\n")
                f.write(f"Project: {data['project_name']}\n")
                f.write(f"Generated: {data['processed_at']}\n\n")
                f.write(f"Total Cost: ${data['summary']['total_cost']:,.2f}\n")
                f.write(f"Total Elements: {data['summary']['element_count']}\n\n")
                for element_type, qty in data['quantities'].items():
                    f.write(f"{element_type}: {qty['count']} items, ${qty['total_cost']:,.2f}\n")
            return report_path

# Initialize processor
bim_processor = BIMProcessor()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "BIM Service",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

@app.post("/upload")
async def upload_ifc(file: UploadFile = File(...)):
    """Upload and process IFC file"""
    if not file.filename.lower().endswith('.ifc'):
        raise HTTPException(status_code=400, detail="Only IFC files are supported")
    
    try:
        # Generate project ID
        project_id = str(uuid.uuid4())
        
        # Save uploaded file
        file_path = UPLOADS_DIR / f"{project_id}_{file.filename}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Process IFC file
        logger.info(f"Processing IFC file: {file.filename}")
        processed_data = bim_processor.parse_ifc(file_path)
        
        # Store project data
        projects_db[project_id] = {
            "id": project_id,
            "filename": file.filename,
            "file_path": str(file_path),
            "uploaded_at": datetime.now().isoformat(),
            "status": "processed",
            **processed_data
        }
        
        logger.info(f"Successfully processed project {project_id}")
        
        return {
            "success": True,
            "project_id": project_id,
            "message": "IFC file processed successfully",
            "data": processed_data
        }
        
    except Exception as e:
        logger.error(f"Error processing upload: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/projects/{project_id}")
async def get_project(project_id: str):
    """Get project data"""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return projects_db[project_id]

@app.get("/projects/{project_id}/quantities")
async def get_quantities(project_id: str):
    """Get project quantities"""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = projects_db[project_id]
    return {
        "project_id": project_id,
        "quantities": project["quantities"],
        "summary": project["summary"]
    }

@app.post("/projects/{project_id}/estimate")
async def generate_estimate(project_id: str):
    """Generate cost estimate"""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = projects_db[project_id]
    
    # Add markup and overhead
    base_cost = project["summary"]["total_cost"]
    overhead = base_cost * 0.15  # 15% overhead
    profit = base_cost * 0.10    # 10% profit
    final_cost = base_cost + overhead + profit
    
    estimate = {
        "project_id": project_id,
        "base_cost": base_cost,
        "overhead": round(overhead, 2),
        "profit": round(profit, 2),
        "final_cost": round(final_cost, 2),
        "generated_at": datetime.now().isoformat()
    }
    
    # Update project with estimate
    projects_db[project_id]["estimate"] = estimate
    
    return estimate

@app.get("/projects/{project_id}/report")
async def download_report(project_id: str):
    """Download PDF report"""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = projects_db[project_id]
    
    # Generate PDF report
    report_path = bim_processor.generate_pdf_report(project_id, project)
    
    if not report_path.exists():
        raise HTTPException(status_code=500, detail="Error generating report")
    
    return FileResponse(
        path=report_path,
        filename=f"{project['project_name']}_report.pdf",
        media_type="application/pdf"
    )

@app.get("/projects")
async def list_projects():
    """List all projects"""
    return {
        "projects": [
            {
                "id": p["id"],
                "filename": p["filename"],
                "project_name": p["project_name"],
                "uploaded_at": p["uploaded_at"],
                "total_cost": p["summary"]["total_cost"]
            }
            for p in projects_db.values()
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)