# Assets Directory

This directory is used to store test IFC files and other BIM-related assets for the 3D BIM Estimating Engine.

## Purpose

- Store sample `.ifc` files for testing the BIM parser
- Store test models for viewer testing
- Store reference files for quantity takeoff validation

## Supported File Types

- `.ifc` - Industry Foundation Classes (IFC2x3, IFC4)
- `.dwg` - AutoCAD Drawing files
- `.rvt` - Revit files
- `.step` - STEP files
- `.obj` - 3D object files
- `.gltf` / `.glb` - GL Transmission Format files

## Usage

Place your test files in this directory and reference them in your tests:

```python
from pathlib import Path

test_file = Path("assets/test.ifc")
```

## Sample Files

To get started with testing, you can:
1. Download sample IFC files from [buildingSMART](https://www.buildingsmart.org/sample-ifc-files/)
2. Export IFC files from Revit, ArchiCAD, or other BIM tools
3. Use open-source BIM sample models

## Notes

- Keep file sizes reasonable for testing (< 100MB recommended)
- Document any specific model requirements or characteristics
- Use descriptive filenames that indicate the model contents
