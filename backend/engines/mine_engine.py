import sqlite3
import json
import datetime
from database import get_db

def get_all_mines():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT m.*, 
           (SELECT COUNT(*) FROM violations v WHERE v.mine_id = m.id AND v.status = 'OPEN') as active_violations_count,
           (SELECT ch4_percent FROM safety_telemetry s WHERE s.mine_id = m.id ORDER BY s.id DESC LIMIT 1) as latest_ch4,
           (SELECT pm10 FROM environment_telemetry e WHERE e.mine_id = m.id ORDER BY e.id DESC LIMIT 1) as latest_pm10
    FROM mines m
    ORDER BY active_violations_count DESC, m.name ASC;
    """)
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_mine_by_id(mine_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM mines WHERE id = ?", (mine_id,))
    mine = cursor.fetchone()
    if not mine:
        conn.close()
        return None
    
    # Fetch safety telemetry
    cursor.execute("SELECT * FROM safety_telemetry WHERE mine_id = ? ORDER BY id DESC LIMIT 20", (mine_id,))
    safety = [dict(r) for r in cursor.fetchall()]

    # Fetch environment telemetry
    cursor.execute("SELECT * FROM environment_telemetry WHERE mine_id = ? ORDER BY id DESC LIMIT 20", (mine_id,))
    environment = [dict(r) for r in cursor.fetchall()]

    # Fetch equipment
    cursor.execute("SELECT * FROM equipment WHERE mine_id = ?", (mine_id,))
    equipment = [dict(r) for r in cursor.fetchall()]

    # Fetch inspections
    cursor.execute("SELECT * FROM inspections WHERE mine_id = ? ORDER BY date DESC", (mine_id,))
    inspections = [dict(r) for r in cursor.fetchall()]

    # Fetch violations
    cursor.execute("""
    SELECT v.*, r.code as reg_code, r.title as reg_title, r.standard_limit, r.operator as reg_op, r.unit as reg_unit
    FROM violations v
    JOIN regulations r ON v.regulation_id = r.id
    WHERE v.mine_id = ?
    ORDER BY v.timestamp DESC
    """, (mine_id,))
    violations = [dict(r) for r in cursor.fetchall()]

    conn.close()
    return {
        "mine": dict(mine),
        "safety": safety,
        "environment": environment,
        "equipment": equipment,
        "inspections": inspections,
        "violations": violations
    }

def import_mine_data(data: dict):
    """Import new mine or batch telemetry data"""
    conn = get_db()
    cursor = conn.cursor()
    
    if "mine" in data:
        m = data["mine"]
        cursor.execute("""
        INSERT OR REPLACE INTO mines (id, name, code, state, district, coalfield, type, operator, depth_m, capacity_mtpa, latitude, longitude, status, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            m.get("id"), m.get("name"), m.get("code"), m.get("state"), m.get("district"),
            m.get("coalfield"), m.get("type"), m.get("operator"), m.get("depth_m", 100),
            m.get("capacity_mtpa", 1.0), m.get("latitude", 23.5), m.get("longitude", 85.5),
            m.get("status", "Operational"), m.get("description", "")
        ))

    if "telemetry" in data:
        t = data["telemetry"]
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()
        if "ch4_percent" in t:
            cursor.execute("""
            INSERT INTO safety_telemetry (mine_id, timestamp, ch4_percent, co_ppm, o2_percent, air_velocity_mps, temp_c, humidity_pct, strata_stress_mpa)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                t.get("mine_id"), now, t.get("ch4_percent", 0.1), t.get("co_ppm", 5.0),
                t.get("o2_percent", 20.9), t.get("air_velocity_mps", 1.2), t.get("temp_c", 28.0),
                t.get("humidity_pct", 60.0), t.get("strata_stress_mpa", 5.0)
            ))

    conn.commit()
    conn.close()
    return {"status": "success", "message": "Mine data successfully imported."}

def simulate_mine_scenario(mine_id: str, scenario: str):
    """Simulate real-world critical mining emergency scenarios for presentation"""
    conn = get_db()
    cursor = conn.cursor()
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()

    if scenario == "methane_surge":
        cursor.execute("""
        INSERT INTO safety_telemetry (mine_id, timestamp, ch4_percent, co_ppm, o2_percent, air_velocity_mps, temp_c, humidity_pct, strata_stress_mpa)
        VALUES (?, ?, 1.85, 32.0, 18.2, 0.18, 35.8, 92.0, 17.5)
        """, (mine_id, now))
        cursor.execute("UPDATE mines SET status = 'Critical_Watch' WHERE id = ?", (mine_id,))

    elif scenario == "dust_storm_failure":
        cursor.execute("""
        INSERT INTO environment_telemetry (mine_id, timestamp, pm25, pm10, noise_db, water_ph, turbidity_ntu, so2, nox)
        VALUES (?, ?, 245.0, 560.0, 94.0, 6.2, 110.0, 58.0, 72.0)
        """, (mine_id, now))
        cursor.execute("UPDATE mines SET status = 'Critical_Watch' WHERE id = ?", (mine_id,))

    elif scenario == "reset_normal":
        cursor.execute("""
        INSERT INTO safety_telemetry (mine_id, timestamp, ch4_percent, co_ppm, o2_percent, air_velocity_mps, temp_c, humidity_pct, strata_stress_mpa)
        VALUES (?, ?, 0.22, 6.0, 20.8, 1.25, 29.0, 65.0, 7.2)
        """, (mine_id, now))
        cursor.execute("""
        INSERT INTO environment_telemetry (mine_id, timestamp, pm25, pm10, noise_db, water_ph, turbidity_ntu, so2, nox)
        VALUES (?, ?, 55.0, 115.0, 68.0, 7.2, 35.0, 18.0, 24.0)
        """, (mine_id, now))
        cursor.execute("UPDATE mines SET status = 'Operational' WHERE id = ?", (mine_id,))

    conn.commit()
    conn.close()
    return {"status": "success", "scenario": scenario, "timestamp": now}
