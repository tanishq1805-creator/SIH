import sqlite3
import json
import datetime
from database import get_db

def get_investigations_for_mine(mine_id: str):
    """
    Compliance Investigation Engine:
    Gathers active rule violations, detected sensor anomalies, and assembled evidence dossiers.
    """
    conn = get_db()
    cursor = conn.cursor()

    # Fetch open or investigating violations
    cursor.execute("""
    SELECT v.*, r.code as reg_code, r.title as reg_title, r.penalty_tier, r.standard_limit, r.operator as reg_op, r.unit as reg_unit
    FROM violations v
    JOIN regulations r ON v.regulation_id = r.id
    WHERE v.mine_id = ?
    ORDER BY CASE v.severity WHEN 'CRITICAL' THEN 1 WHEN 'HIGH' THEN 2 WHEN 'MEDIUM' THEN 3 ELSE 4 END
    """, (mine_id,))
    violations = [dict(r) for r in cursor.fetchall()]

    investigations = []

    for v in violations:
        v_id = v["id"]
        # Fetch linked evidence
        cursor.execute("SELECT * FROM evidences WHERE violation_id = ?", (v_id,))
        evidences = [dict(e) for e in cursor.fetchall()]

        # Parse payloads
        for ev in evidences:
            try:
                ev["data_payload"] = json.loads(ev["data_payload"])
            except:
                pass

        # Fetch linked corrective action
        cursor.execute("SELECT * FROM corrective_actions WHERE violation_id = ?", (v_id,))
        ca_row = cursor.fetchone()
        ca = dict(ca_row) if ca_row else None

        # Build investigation case
        investigations.append({
            "case_id": f"INV-{v_id}",
            "violation": v,
            "evidence_count": len(evidences),
            "evidences": evidences,
            "corrective_action": ca,
            "status": v["status"],
            "timestamp": v["timestamp"],
            "anomaly_level": "Severe" if v["severity"] == "CRITICAL" else "Elevated",
            "historical_baseline_comparison": {
                "30_day_average": round(v["limit_value"] * 0.45, 2),
                "current_spike": v["detected_value"],
                "deviation_percentage": f"+{round(((v['detected_value'] - v['limit_value']) / v['limit_value']) * 100, 1)}%"
            }
        })

    conn.close()
    return investigations
