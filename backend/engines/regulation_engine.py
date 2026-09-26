import sqlite3
from database import get_db

def get_all_regulations():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM regulations ORDER BY category, code")
    regs = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return regs

def evaluate_regulations_for_mine(mine_id: str):
    """
    Evaluates current mine telemetry against codified DGMS & CPCB machine-readable rules.
    Returns structured results: PASS, FAIL, UNKNOWN with margin and severity.
    """
    conn = get_db()
    cursor = conn.cursor()

    # Get latest safety and environmental telemetry
    cursor.execute("SELECT * FROM safety_telemetry WHERE mine_id = ? ORDER BY id DESC LIMIT 1", (mine_id,))
    safety_row = cursor.fetchone()
    cursor.execute("SELECT * FROM environment_telemetry WHERE mine_id = ? ORDER BY id DESC LIMIT 1", (mine_id,))
    env_row = cursor.fetchone()

    cursor.execute("SELECT * FROM regulations")
    regs = [dict(r) for r in cursor.fetchall()]

    evaluations = []
    
    safety = dict(safety_row) if safety_row else {}
    env = dict(env_row) if env_row else {}

    for r in regs:
        code = r["code"]
        op = r["operator"]
        limit = r["standard_limit"]
        unit = r["unit"]
        actual_val = None
        status = "UNKNOWN"
        detail = ""

        # Map regulation to telemetry field
        if "CH4" in code or code == "DGMS-CMR-2017-R169":
            actual_val = safety.get("ch4_percent")
            param_name = "Methane (CH4)"
        elif "VEL" in code or code == "DGMS-CMR-2017-R153":
            actual_val = safety.get("air_velocity_mps")
            param_name = "Air Velocity"
        elif "CO" in code:
            actual_val = safety.get("co_ppm")
            param_name = "Carbon Monoxide (CO)"
        elif "O2" in code:
            actual_val = safety.get("o2_percent")
            param_name = "Atmospheric Oxygen (O2)"
        elif "PM10" in code:
            actual_val = env.get("pm10")
            param_name = "Respirable Dust (PM10)"
        elif "STRATA" in code or code == "DGMS-CMR-2017-R106":
            actual_val = safety.get("strata_stress_mpa")
            param_name = "Roof Strata Stress"
        elif "PH-MIN" in code:
            actual_val = env.get("water_ph")
            param_name = "Water Discharge pH (Min)"
        elif "PH-MAX" in code:
            actual_val = env.get("water_ph")
            param_name = "Water Discharge pH (Max)"
        else:
            param_name = r["title"]

        if actual_val is not None:
            if op == "<=":
                passed = actual_val <= limit
            elif op == ">=":
                passed = actual_val >= limit
            elif op == "==":
                passed = abs(actual_val - limit) < 0.01
            else:
                passed = True

            status = "PASS" if passed else "FAIL"
            margin = round(abs(actual_val - limit), 2)
            if passed:
                detail = f"Within standard ({actual_val} {unit} vs limit {op} {limit} {unit})"
            else:
                detail = f"BREACH DETECTED: {actual_val} {unit} violates limit {op} {limit} {unit} (exceeded by {margin} {unit})"
        else:
            status = "UNKNOWN"
            detail = "No sensor telemetry available for parameter"

        evaluations.append({
            "regulation_id": r["id"],
            "code": r["code"],
            "title": r["title"],
            "category": r["category"],
            "parameter": param_name,
            "standard_limit": limit,
            "operator": op,
            "unit": unit,
            "actual_value": actual_val,
            "status": status,
            "penalty_tier": r["penalty_tier"],
            "detail": detail,
            "legal_section": r["section"],
            "description": r["description"]
        })

    conn.close()
    return evaluations
