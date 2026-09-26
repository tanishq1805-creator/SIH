import sqlite3
import json
from database import get_db

def detect_contradictions(mine_id: str):
    """
    Contradiction Engine:
    Cross-checks official human shift supervisor / DGMS inspection reports
    against raw IoT sensor ground truth telemetry.
    Identifies discrepancies, falsified safety declarations, and computes a Human-Sensor Trust Index.
    """
    conn = get_db()
    cursor = conn.cursor()

    # Get latest inspection
    cursor.execute("SELECT * FROM inspections WHERE mine_id = ? ORDER BY date DESC LIMIT 1", (mine_id,))
    insp_row = cursor.fetchone()

    # Get latest safety and environment telemetry
    cursor.execute("SELECT * FROM safety_telemetry WHERE mine_id = ? ORDER BY id DESC LIMIT 1", (mine_id,))
    safety_row = cursor.fetchone()
    cursor.execute("SELECT * FROM environment_telemetry WHERE mine_id = ? ORDER BY id DESC LIMIT 1", (mine_id,))
    env_row = cursor.fetchone()

    # Get equipment status
    cursor.execute("SELECT * FROM equipment WHERE mine_id = ?", (mine_id,))
    equipment_rows = [dict(r) for r in cursor.fetchall()]

    conn.close()

    if not insp_row or not safety_row:
        return {
            "mine_id": mine_id,
            "trust_index": 100,
            "status": "INSUFFICIENT_DATA",
            "contradictions": [],
            "summary": "No recent inspection report or sensor telemetry available for cross-verification."
        }

    insp = dict(insp_row)
    safety = dict(safety_row)
    env = dict(env_row) if env_row else {}

    contradictions = []
    trust_deductions = 0

    # 1. Check Methane Discrepancy (Human Report vs IoT Sensor)
    reported_ch4 = insp.get("declared_methane", 0.0)
    actual_ch4 = safety.get("ch4_percent", 0.0)
    ch4_delta = abs(actual_ch4 - reported_ch4)

    if ch4_delta > 0.3:
        severity = "CRITICAL" if actual_ch4 > 0.75 else "HIGH"
        contradictions.append({
            "id": f"cntr-ch4-{mine_id}",
            "parameter": "Inflammable Gas (CH4)",
            "unit": "%",
            "inspector_declared": reported_ch4,
            "sensor_actual": actual_ch4,
            "discrepancy_delta": round(ch4_delta, 2),
            "severity": severity,
            "category": "Report vs Sensor",
            "inspector_name": insp["inspector_name"],
            "inspection_date": insp["date"],
            "finding": f"Inspector declared CH4 as safe ({reported_ch4}%), but telemetry sensor logged dangerous level ({actual_ch4}%). Discrepancy ratio: {round(actual_ch4 / max(reported_ch4, 0.01), 1)}x higher than reported!",
            "recommendation": "Initiate DGMS Section 22 inquiry for safety log falsification."
        })
        trust_deductions += 45

    # 2. Check Ventilation Air Velocity Discrepancy
    reported_vel = insp.get("declared_ventilation", 0.0)
    actual_vel = safety.get("air_velocity_mps", 0.0)
    vel_delta = abs(actual_vel - reported_vel)

    if vel_delta > 0.25 and actual_vel < 0.50:
        contradictions.append({
            "id": f"cntr-vel-{mine_id}",
            "parameter": "Face Air Velocity",
            "unit": "m/s",
            "inspector_declared": reported_vel,
            "sensor_actual": actual_vel,
            "discrepancy_delta": round(vel_delta, 2),
            "severity": "HIGH",
            "category": "Report vs Sensor",
            "inspector_name": insp["inspector_name"],
            "inspection_date": insp["date"],
            "finding": f"Shift log claimed ventilation flow was adequate ({reported_vel} m/s), but ultrasonic anemometer registered substandard flow ({actual_vel} m/s).",
            "recommendation": "Audit main exhaust fan damper and verify auxiliary booster fan status."
        })
        trust_deductions += 30

    # 3. Check Dust Suppression & PM10 Discrepancy
    reported_dust_sup = insp.get("declared_dust_suppression", 100.0)
    actual_pm10 = env.get("pm10", 0.0) if env else 0.0

    if reported_dust_sup >= 90.0 and actual_pm10 > 250.0:
        contradictions.append({
            "id": f"cntr-dust-{mine_id}",
            "parameter": "Respirable Coal Dust (PM10)",
            "unit": "µg/m³",
            "inspector_declared": f"{reported_dust_sup}% suppression active",
            "sensor_actual": f"{actual_pm10} µg/m³",
            "discrepancy_delta": round(actual_pm10 - 250.0, 1),
            "severity": "MEDIUM",
            "category": "Inspection vs Environment",
            "inspector_name": insp["inspector_name"],
            "inspection_date": insp["date"],
            "finding": f"Inspector certified dust suppression at {reported_dust_sup}%, yet continuous PM10 stations detected severe particulate breach ({actual_pm10} µg/m³).",
            "recommendation": "Inspect haul road mist nozzles for particulate blockages."
        })
        trust_deductions += 20

    trust_index = max(0, 100 - trust_deductions)
    
    status = "VERIFIED_ALIGNED"
    if trust_index < 50:
        status = "CRITICAL_FALSIFICATION_SUSPECTED"
    elif trust_index < 80:
        status = "SIGNIFICANT_DISCREPANCY"

    return {
        "mine_id": mine_id,
        "trust_index": trust_index,
        "status": status,
        "inspector_name": insp["inspector_name"],
        "inspection_date": insp["date"],
        "declared_summary": insp["summary"],
        "contradictions": contradictions,
        "total_contradictions": len(contradictions)
    }
