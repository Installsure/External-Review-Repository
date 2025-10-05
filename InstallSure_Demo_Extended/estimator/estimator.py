#!/usr/bin/env python3
"""
InstallSure Cost Estimator
Processes BIM quantity takeoff data and calculates cost estimates

Usage:
    python estimator.py <tags_export.csv> > estimate_out.csv
    python estimator.py tags_export.csv --format json > estimate_out.json
"""

import sys
import csv
import json
from typing import Dict, List, Tuple
from decimal import Decimal, ROUND_HALF_UP

# Cost database - unit costs for various materials and labor
COST_DATABASE = {
    # Linear costs (per linear foot)
    'Pipe': {
        'Copper': {'material': 8.50, 'labor': 12.00, 'unit': 'LF'},
        'PVC': {'material': 2.25, 'labor': 6.50, 'unit': 'LF'},
        'Steel': {'material': 6.75, 'labor': 10.50, 'unit': 'LF'},
        'PEX': {'material': 1.85, 'labor': 5.00, 'unit': 'LF'},
    },
    'Cable': {
        'Electrical': {'material': 1.25, 'labor': 3.50, 'unit': 'LF'},
        'Data': {'material': 0.85, 'labor': 2.75, 'unit': 'LF'},
        'Fiber': {'material': 2.50, 'labor': 5.00, 'unit': 'LF'},
    },
    'Framing': {
        'Wood': {'material': 3.50, 'labor': 8.00, 'unit': 'LF'},
        'Steel': {'material': 5.25, 'labor': 12.50, 'unit': 'LF'},
        'Aluminum': {'material': 7.00, 'labor': 10.00, 'unit': 'LF'},
    },
    # Area costs (per square foot)
    'Wall': {
        'Drywall': {'material': 1.85, 'labor': 3.25, 'unit': 'SF'},
        'Plaster': {'material': 3.50, 'labor': 6.00, 'unit': 'SF'},
        'Tile': {'material': 8.50, 'labor': 12.00, 'unit': 'SF'},
        'Paint': {'material': 0.35, 'labor': 1.25, 'unit': 'SF'},
    },
    'Floor': {
        'Concrete': {'material': 4.50, 'labor': 6.50, 'unit': 'SF'},
        'Tile': {'material': 9.00, 'labor': 14.00, 'unit': 'SF'},
        'Hardwood': {'material': 12.50, 'labor': 8.00, 'unit': 'SF'},
        'Carpet': {'material': 3.25, 'labor': 2.50, 'unit': 'SF'},
        'Vinyl': {'material': 4.00, 'labor': 3.00, 'unit': 'SF'},
    },
    'Ceiling': {
        'Drywall': {'material': 2.00, 'labor': 3.50, 'unit': 'SF'},
        'Drop Ceiling': {'material': 4.50, 'labor': 5.00, 'unit': 'SF'},
        'Paint': {'material': 0.40, 'labor': 1.50, 'unit': 'SF'},
    },
    # Volume costs (per cubic yard)
    'Concrete': {
        'Concrete': {'material': 125.00, 'labor': 45.00, 'unit': 'CY'},
        'Reinforced': {'material': 165.00, 'labor': 60.00, 'unit': 'CY'},
    },
    'Excavation': {
        'Earth': {'material': 15.00, 'labor': 35.00, 'unit': 'CY'},
        'Rock': {'material': 25.00, 'labor': 75.00, 'unit': 'CY'},
    },
    # Count costs (per each)
    'Fixture': {
        'Plumbing': {'material': 285.00, 'labor': 125.00, 'unit': 'EA'},
        'Electrical': {'material': 95.00, 'labor': 65.00, 'unit': 'EA'},
    },
    'Door': {
        'Hardware': {'material': 450.00, 'labor': 180.00, 'unit': 'EA'},
        'Interior': {'material': 325.00, 'labor': 150.00, 'unit': 'EA'},
        'Exterior': {'material': 850.00, 'labor': 250.00, 'unit': 'EA'},
    },
    'Window': {
        'Glass': {'material': 425.00, 'labor': 175.00, 'unit': 'EA'},
        'Vinyl': {'material': 375.00, 'labor': 150.00, 'unit': 'EA'},
        'Wood': {'material': 625.00, 'labor': 200.00, 'unit': 'EA'},
    },
}

def get_unit_cost(item_type: str, material: str) -> Tuple[float, float, str]:
    """
    Get unit costs for material and labor
    Returns: (material_cost, labor_cost, unit)
    """
    if item_type in COST_DATABASE:
        if material in COST_DATABASE[item_type]:
            costs = COST_DATABASE[item_type][material]
            return costs['material'], costs['labor'], costs['unit']
    
    # Default fallback costs if not in database
    return 10.00, 15.00, 'UN'

def calculate_line_item(tag: str, category: str, item_type: str, quantity: float, 
                       unit: str, material: str, notes: str) -> Dict:
    """
    Calculate costs for a single line item
    """
    material_cost_per_unit, labor_cost_per_unit, cost_unit = get_unit_cost(item_type, material)
    
    quantity_decimal = Decimal(str(quantity))
    material_cost_per_unit_decimal = Decimal(str(material_cost_per_unit))
    labor_cost_per_unit_decimal = Decimal(str(labor_cost_per_unit))
    
    total_material = (quantity_decimal * material_cost_per_unit_decimal).quantize(
        Decimal('0.01'), rounding=ROUND_HALF_UP
    )
    total_labor = (quantity_decimal * labor_cost_per_unit_decimal).quantize(
        Decimal('0.01'), rounding=ROUND_HALF_UP
    )
    total_cost = total_material + total_labor
    
    return {
        'tag': tag,
        'category': category,
        'type': item_type,
        'quantity': float(quantity),
        'unit': unit,
        'material': material,
        'notes': notes,
        'material_cost_per_unit': float(material_cost_per_unit),
        'labor_cost_per_unit': float(labor_cost_per_unit),
        'total_material_cost': float(total_material),
        'total_labor_cost': float(total_labor),
        'total_cost': float(total_cost)
    }

def process_csv(input_file: str) -> List[Dict]:
    """
    Process CSV file and calculate estimates
    """
    estimates = []
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                try:
                    quantity = float(row.get('Quantity', 0))
                    
                    estimate = calculate_line_item(
                        tag=row.get('Tag', ''),
                        category=row.get('Category', ''),
                        item_type=row.get('Type', ''),
                        quantity=quantity,
                        unit=row.get('Unit', ''),
                        material=row.get('Material', ''),
                        notes=row.get('Notes', '')
                    )
                    
                    estimates.append(estimate)
                    
                except (ValueError, KeyError) as e:
                    print(f"Warning: Error processing row {row}: {e}", file=sys.stderr)
                    continue
                    
    except FileNotFoundError:
        print(f"Error: File not found: {input_file}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: Failed to process file: {e}", file=sys.stderr)
        sys.exit(1)
    
    return estimates

def output_csv(estimates: List[Dict]):
    """
    Output estimates in CSV format
    """
    if not estimates:
        print("Error: No estimates to output", file=sys.stderr)
        return
    
    fieldnames = [
        'tag', 'category', 'type', 'quantity', 'unit', 'material', 'notes',
        'material_cost_per_unit', 'labor_cost_per_unit',
        'total_material_cost', 'total_labor_cost', 'total_cost'
    ]
    
    writer = csv.DictWriter(sys.stdout, fieldnames=fieldnames)
    writer.writeheader()
    
    for estimate in estimates:
        writer.writerow(estimate)
    
    # Calculate totals
    total_material = sum(e['total_material_cost'] for e in estimates)
    total_labor = sum(e['total_labor_cost'] for e in estimates)
    grand_total = sum(e['total_cost'] for e in estimates)
    
    # Write summary row
    writer.writerow({
        'tag': 'TOTAL',
        'category': '',
        'type': '',
        'quantity': '',
        'unit': '',
        'material': '',
        'notes': '',
        'material_cost_per_unit': '',
        'labor_cost_per_unit': '',
        'total_material_cost': f'{total_material:.2f}',
        'total_labor_cost': f'{total_labor:.2f}',
        'total_cost': f'{grand_total:.2f}'
    })

def output_json(estimates: List[Dict]):
    """
    Output estimates in JSON format
    """
    total_material = sum(e['total_material_cost'] for e in estimates)
    total_labor = sum(e['total_labor_cost'] for e in estimates)
    grand_total = sum(e['total_cost'] for e in estimates)
    
    output = {
        'estimates': estimates,
        'summary': {
            'total_material_cost': round(total_material, 2),
            'total_labor_cost': round(total_labor, 2),
            'grand_total': round(grand_total, 2),
            'item_count': len(estimates)
        }
    }
    
    print(json.dumps(output, indent=2))

def main():
    """
    Main entry point
    """
    if len(sys.argv) < 2:
        print("Usage: python estimator.py <tags_export.csv> [--format json]", file=sys.stderr)
        print("", file=sys.stderr)
        print("Examples:", file=sys.stderr)
        print("  python estimator.py tags_export.csv > estimate_out.csv", file=sys.stderr)
        print("  python estimator.py tags_export.csv --format json > estimate_out.json", file=sys.stderr)
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_format = 'csv'
    
    if len(sys.argv) > 2 and sys.argv[2] == '--format' and len(sys.argv) > 3:
        output_format = sys.argv[3].lower()
    
    # Process input file
    estimates = process_csv(input_file)
    
    if not estimates:
        print("Error: No valid estimates generated", file=sys.stderr)
        sys.exit(1)
    
    # Output results
    if output_format == 'json':
        output_json(estimates)
    else:
        output_csv(estimates)

if __name__ == '__main__':
    main()
