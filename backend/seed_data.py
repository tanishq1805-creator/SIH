import sqlite3
import json
import hashlib
import datetime
from database import get_db, init_db

def calculate_hash(prev_hash, timestamp, actor, event_type, payload_str):
    raw = f"{prev_hash}|{timestamp}|{actor}|{event_type}|{payload_str}"
    return hashlib.sha256(raw.encode('utf-8')).hexdigest()

def seed():
    init_db()
    conn = get_db()
    cursor = conn.cursor()

    # Clear existing data to allow clean re-seed
    for table in ['audit_chain', 'corrective_actions', 'evidences', 'violations', 'regulations', 'inspections', 'equipment', 'environment_telemetry', 'safety_telemetry', 'mines']:
        cursor.execute(f"DELETE FROM {table};")

    now = datetime.datetime.now(datetime.timezone.utc)
    iso_now = now.isoformat()

    # 1. Seed Mines
    mines = [
        (
            "mine-jh-001",
            "Jharia Underground Pit #4",
            "BCCL-JH-04",
            "Jharkhand",
            "Dhanbad",
            "Jharia Coalfield",
            "Underground",
            "BCCL (Bharat Coking Coal Ltd)",
            380.0,
            2.4,
            23.7460,
            86.4144,
            "Critical_Watch",
            "Degree-III gassy underground seam with continuous methane monitoring and continuous miner operations."
        ),
        (
            "mine-kb-002",
            "Korba Super Opencast Pit",
            "SECL-KB-01",
            "Chhattisgarh",
            "Korba",
            "Korba Coalfield",
            "Opencast",
            "SECL (South Eastern Coalfields)",
            160.0,
            14.2,
            22.3595,
            82.7501,
            "Critical_Watch",
            "High-capacity mechanized opencast pit utilizing 42 m3 draglines, face shovels, and 240T haulers."
        ),
        (
            "mine-sg-003",
            "Singrauli Northern Block-B",
            "NCL-SG-02",
            "Madhya Pradesh",
            "Singrauli",
            "Singrauli Coalfield",
            "Opencast",
            "NCL (Northern Coalfields Ltd)",
            210.0,
            8.5,
            24.1997,
            82.6644,
            "Operational",
            "Strategically vital opencast pit supplying pit-head super thermal power plants (NTPC Vindhyachal)."
        ),
        (
            "mine-rn-004",
            "Raniganj Deep Shaft Colliery",
            "ECL-RN-07",
            "West Bengal",
            "Paschim Bardhaman",
            "Raniganj Coalfield",
            "Underground",
            "ECL (Eastern Coalfields Ltd)",
            490.0,
            1.8,
            23.6215,
            87.0315,
            "Operational",
            "Historic deep shaft underground workings equipped with mechanized longwall shearer and powered roof supports."
        ),
        (
            "mine-tl-005",
            "Talcher Mega Ananta Pit",
            "MCL-TL-09",
            "Odisha",
            "Angul",
            "Talcher Coalfield",
            "Opencast",
            "MCL (Mahanadi Coalfields Ltd)",
            145.0,
            18.0,
            20.9509,
            85.2165,
            "Operational",
            "India's premier high-output thermal coal opencast mine with computerized surface miners and conveyor belts."
        ),
        (
            "mine-gv-006",
            "Godavari Valley Longwall No. 7",
            "SCCL-GV-03",
            "Telangana",
            "Bhadradri Kothagudem",
            "Godavari Valley Coalfield",
            "Underground",
            "SCCL (Singareni Collieries)",
            310.0,
            3.2,
            17.5502,
            80.6180,
            "Operational",
            "Advanced underground mechanized longwall operation with automated gas drainage and tele-robotic monitoring."
        )
    ]
    cursor.executemany("""
    INSERT INTO mines (id, name, code, state, district, coalfield, type, operator, depth_m, capacity_mtpa, latitude, longitude, status, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, mines)

    # 2. Seed Regulations (DGMS 2017 & CPCB)
    regs = [
        (
            "reg-dgms-ch4",
            "DGMS-CMR-2017-R169",
            "DGMS Rule 169: Inflammable Gas Limits",
            "Safety - Gas Monitoring",
            "Safety",
            0.75,
            "<=",
            "%",
            "Severe",
            "Under Coal Mines Regulations 2017 Reg 169, concentration of inflammable gas (methane) shall not exceed 0.75% in general body of air. If >1.25%, immediate evacuation and power cutoff required."
        ),
        (
            "reg-dgms-airvel",
            "DGMS-CMR-2017-R153",
            "DGMS Rule 153: Minimum Ventilation Air Velocity",
            "Safety - Ventilation",
            "Safety",
            0.50,
            ">=",
            "m/s",
            "High",
            "Air velocity in underground workings and faces must maintain at least 0.50 m/s to dilute noxious gases and prevent dangerous stagnant gas pockets."
        ),
        (
            "reg-dgms-co",
            "DGMS-CMR-2017-R153-CO",
            "DGMS Rule 153: Carbon Monoxide Safe Ceiling",
            "Safety - Toxic Gas",
            "Safety",
            25.0,
            "<=",
            "ppm",
            "Severe",
            "Carbon Monoxide in underground air shall not exceed 25 ppm. Higher levels indicate spontaneous combustion or strata heating."
        ),
        (
            "reg-dgms-o2",
            "DGMS-CMR-2017-R153-O2",
            "DGMS Rule 153: Minimum Atmospheric Oxygen",
            "Safety - Air Quality",
            "Safety",
            19.0,
            ">=",
            "%",
            "High",
            "Atmospheric oxygen content in working areas shall never fall below 19.0% by volume."
        ),
        (
            "reg-cpcb-pm10",
            "CPCB-NAAQS-PM10",
            "CPCB Rule 124: Respirable Coal Particulate (PM10)",
            "Environment - Air Quality",
            "Environment",
            250.0,
            "<=",
            "µg/m³",
            "Medium",
            "Respirable coal dust PM10 in mining area buffer zones must be maintained below 250 µg/m³ with active mist suppressors."
        ),
        (
            "reg-dgms-strata",
            "DGMS-CMR-2017-R106",
            "DGMS Rule 106: Roof & Slope Strata Stress Limit",
            "Strata - Structural Integrity",
            "Strata",
            14.5,
            "<=",
            "MPa",
            "Severe",
            "Borehole stress cell reading on underground roof strata must not exceed 14.5 MPa. Exceeding triggers immediate rock bolting reinforcement."
        ),
        (
            "reg-cpcb-ph-min",
            "CPCB-WATER-PH-MIN",
            "CPCB Effluent Standard: Minimum Water Discharge pH",
            "Environment - Water Discharge",
            "Environment",
            6.5,
            ">=",
            "pH",
            "Medium",
            "Treated mine discharge water into public drainage systems must maintain pH of at least 6.5 to prevent acid mine drainage."
        ),
        (
            "reg-cpcb-ph-max",
            "CPCB-WATER-PH-MAX",
            "CPCB Effluent Standard: Maximum Water Discharge pH",
            "Environment - Water Discharge",
            "Environment",
            8.5,
            "<=",
            "pH",
            "Medium",
            "Mine discharge water must not exceed pH 8.5."
        )
    ]
    cursor.executemany("""
    INSERT INTO regulations (id, code, title, section, category, standard_limit, operator, unit, penalty_tier, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, regs)

    # 3. Seed Safety & Environment Telemetry (Realistic readings across mines)
    safety_data = [
        # Jharia (High methane spike, reduced ventilation, high strata stress)
        ("mine-jh-001", iso_now, 1.48, 18.4, 19.1, 0.26, 33.5, 88.0, 16.2),
        # Korba (Normal gas, normal strata)
        ("mine-kb-002", iso_now, 0.05, 4.2, 20.8, 1.85, 36.2, 54.0, 4.1),
        # Singrauli (Opencast normal)
        ("mine-sg-003", iso_now, 0.02, 3.1, 20.9, 1.40, 34.0, 60.0, 3.8),
        # Raniganj (Underground moderate)
        ("mine-rn-004", iso_now, 0.65, 12.0, 19.8, 0.62, 30.1, 82.0, 11.4),
        # Talcher (Opencast)
        ("mine-tl-005", iso_now, 0.01, 2.5, 20.9, 2.10, 37.5, 49.0, 2.9),
        # Godavari (Underground longwall)
        ("mine-gv-006", iso_now, 0.42, 8.5, 20.2, 0.88, 29.5, 75.0, 9.3)
    ]
    cursor.executemany("""
    INSERT INTO safety_telemetry (mine_id, timestamp, ch4_percent, co_ppm, o2_percent, air_velocity_mps, temp_c, humidity_pct, strata_stress_mpa)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, safety_data)

    env_data = [
        # Jharia
        ("mine-jh-001", iso_now, 110.0, 280.0, 72.0, 6.8, 45.0, 28.0, 34.0),
        # Korba (Severe dust violation)
        ("mine-kb-002", iso_now, 185.0, 412.0, 89.0, 6.7, 85.0, 42.0, 58.0),
        # Singrauli (Acid runoff violation: pH 5.4)
        ("mine-sg-003", iso_now, 92.0, 210.0, 81.0, 5.4, 135.0, 31.0, 40.0),
        # Raniganj
        ("mine-rn-004", iso_now, 68.0, 142.0, 64.0, 7.1, 32.0, 18.0, 22.0),
        # Talcher
        ("mine-tl-005", iso_now, 120.0, 235.0, 86.0, 7.3, 50.0, 36.0, 44.0),
        # Godavari
        ("mine-gv-006", iso_now, 45.0, 95.0, 61.0, 7.0, 24.0, 14.0, 19.0)
    ]
    cursor.executemany("""
    INSERT INTO environment_telemetry (mine_id, timestamp, pm25, pm10, noise_db, water_ph, turbidity_ntu, so2, nox)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, env_data)

    # 4. Seed Equipment
    equipments = [
        ("eq-jh-01", "mine-jh-001", "FAN-EXH-4A", "Main Underground Exhaust Fan 4A", "Main Fan", 62.0, 9.8, 68.5, "Warning", "2026-09-30"),
        ("eq-jh-02", "mine-jh-001", "CH4-DRAIN-02", "Methane Drainage Vacuum Pump", "Gas Pump", 45.0, 14.2, 82.0, "Critical", "2026-09-28"),
        ("eq-jh-03", "mine-jh-001", "CM-JOY-12M", "Joy Global Continuous Miner 12CM", "Continuous Miner", 88.0, 3.4, 52.0, "Operational", "2026-10-15"),
        ("eq-kb-01", "mine-kb-002", "DRG-MARION-96", "Marion 96/60 Heavy Walking Dragline", "Dragline", 84.0, 4.1, 55.0, "Operational", "2026-10-20"),
        ("eq-kb-02", "mine-kb-002", "MIST-CANNON-B", "Haul Road Mist Dust Suppressor B", "Dust Suppressor", 22.0, 0.0, 30.0, "Critical", "OVERDUE (Inoperative)"),
        ("eq-sg-01", "mine-sg-003", "ETP-NEUT-01", "Effluent Neutralization Plant Lime Dosing", "Water Treatment", 39.0, 6.2, 45.0, "Warning", "2026-09-29")
    ]
    cursor.executemany("""
    INSERT INTO equipment (id, mine_id, code, name, type, health_score, vibration_mms, temp_c, status, maintenance_due)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, equipments)

    # 5. Seed Human Inspection Logs (Creating the ground truth vs human log contradictions!)
    inspections = [
        (
            "insp-jh-001",
            "mine-jh-001",
            "Rajesh K. Sharma",
            "Assistant Manager (Safety & Ventilation)",
            "2026-09-26 08:30:00",
            "Shift Morning Inspection: Seam III Face 4A",
            0.15, # Declared CH4 is ONLY 0.15% (Fabricated / Outdated!)
            0.65, # Declared air velocity 0.65 m/s (Falsified!)
            95.0,
            "Satisfactory",
            "Shift inspections conducted. Ventilation working smoothly. No inflammable gas pockets detected. Working face safe for shift continuation."
        ),
        (
            "insp-kb-002",
            "mine-kb-002",
            "Vikramaditya Rao",
            "Senior Overman (Environment)",
            "2026-09-26 07:15:00",
            "Daily Environmental Compliance Audit",
            0.02,
            2.00,
            100.0, # Claimed dust suppression 100% operational (Falsified!)
            "Satisfactory",
            "All water sprinkling mist cannons along main overburden haul road are 100% active. Zero fugitive dust breaches observed."
        )
    ]
    cursor.executemany("""
    INSERT INTO inspections (id, mine_id, inspector_name, designation, date, summary, declared_methane, declared_ventilation, declared_dust_suppression, declared_status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, inspections)

    # 6. Seed Violations (Linked to Regulations)
    violations = [
        (
            "viol-jh-ch4-01",
            "mine-jh-001",
            "reg-dgms-ch4",
            1.48,
            0.75,
            "CRITICAL",
            "OPEN",
            iso_now,
            "Severe Methane Concentration Breach in General Body",
            "Telemetry sensor CH4-03 at Jharia Face 4A logged 1.48% CH4 (Permissible: <=0.75%). Exceeds evacuation threshold (1.25%) by 18.4%. Immediate power isolation required under DGMS CMR 2017 Reg 169."
        ),
        (
            "viol-jh-air-02",
            "mine-jh-001",
            "reg-dgms-airvel",
            0.26,
            0.50,
            "HIGH",
            "OPEN",
            iso_now,
            "Sub-standard Face Ventilation Air Velocity",
            "Anemometer sensor VEL-09 recorded 0.26 m/s air velocity (Mandatory minimum: >=0.50 m/s). Causes stagnant methane accumulation risk in working pocket."
        ),
        (
            "viol-jh-strata-03",
            "mine-jh-001",
            "reg-dgms-strata",
            16.2,
            14.5,
            "CRITICAL",
            "INVESTIGATING",
            iso_now,
            "Excessive Roof Strata Stress Cell Dilation",
            "Borehole stress cell BSC-04 recorded 16.2 MPa (Limit: <=14.5 MPa). Elevated risk of sudden roof spalling or local strata convergence."
        ),
        (
            "viol-kb-pm10-01",
            "mine-kb-002",
            "reg-cpcb-pm10",
            412.0,
            250.0,
            "HIGH",
            "OPEN",
            iso_now,
            "Respirable Particulate PM10 Exceedance",
            "Continuous Ambient Air Quality station AQMS-02 logged PM10 at 412.0 µg/m³ (Limit: <=250.0 µg/m³). Caused by inoperative haul road mist cannon B."
        ),
        (
            "viol-sg-ph-01",
            "mine-sg-003",
            "reg-cpcb-ph-min",
            5.4,
            6.5,
            "MEDIUM",
            "OPEN",
            iso_now,
            "Acidic Mine Effluent Water Discharge Violation",
            "Discharge outlet sensor WQ-PH-01 registered pH 5.4 (Permissible range: 6.5 - 8.5). Unneutralized pyritic runoff escaping sediment pond."
        )
    ]
    cursor.executemany("""
    INSERT INTO violations (id, mine_id, regulation_id, detected_value, limit_value, severity, status, timestamp, title, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, violations)

    # 7. Seed Evidences
    evidences = [
        (
            "evid-01",
            "viol-jh-ch4-01",
            "mine-jh-001",
            "SENSOR_TELEMETRY",
            json.dumps({"sensor_id": "CH4-03", "location": "Return Airway 4A", "readings_window": [0.65, 0.82, 1.12, 1.48], "calibration_date": "2026-09-20"}),
            "8e22b10a43f5e921d7b14",
            iso_now,
            "Continuous Methane Telemetry Station"
        ),
        (
            "evid-02",
            "viol-jh-ch4-01",
            "mine-jh-001",
            "CONTRADICTION_AUDIT",
            json.dumps({"human_report": {"inspector": "Rajesh K. Sharma", "claimed_ch4": 0.15}, "sensor_truth": {"peak_ch4": 1.48, "sensor_id": "CH4-03"}, "discrepancy_delta": 1.33, "confidence": 0.99}),
            "3a1f8d42b99c7e0123512",
            iso_now,
            "Automated CoalSentinel Contradiction Engine"
        ),
        (
            "evid-03",
            "viol-kb-pm10-01",
            "mine-kb-002",
            "CONTRADICTION_AUDIT",
            json.dumps({"human_report": {"inspector": "Vikramaditya Rao", "claimed_mist_active": "100%"}, "sensor_truth": {"pm10": 412.0, "mist_cannon_power_draw": "0 kW (DEAD)"}, "confidence": 0.98}),
            "5c4b1a89f33d2e119842a",
            iso_now,
            "Automated CoalSentinel Contradiction Engine"
        )
    ]
    cursor.executemany("""
    INSERT INTO evidences (id, violation_id, mine_id, evidence_type, data_payload, hash, timestamp, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    """, evidences)

    # 8. Seed Corrective Actions
    corrective_actions = [
        (
            "ca-jh-01",
            "viol-jh-ch4-01",
            "mine-jh-001",
            "Emergency Ventilation Boost & Face Evacuation",
            "Immediately de-energize electrical power to Face 4A continuous miner. Switch auxiliary ventilation booster fan to Stage 2 (12 m3/s). Inspect methane drainage pipeline seal.",
            "Colliery Ventilation Officer (Er. S. Sengupta)",
            "2026-09-26 12:00:00",
            "IN_PROGRESS",
            None,
            "Power disconnected at 09:15. Booster fan ramped up. Awaiting gas dilution verification below 0.70%.",
            iso_now
        ),
        (
            "ca-kb-01",
            "viol-kb-pm10-01",
            "mine-kb-002",
            "Repair Mist Cannon B & Deploy Mobile Water Tankers",
            "Fix pump impeller on static mist cannon B at haul road km 2.4. In the interim, dispatch 2x 28,000L mobile water bowsers for pressurized road sprinkling.",
            "Senior Environment Engineer (P. K. Verma)",
            "2026-09-26 14:00:00",
            "PENDING",
            None,
            "Maintenance crew dispatched with replacement impeller.",
            iso_now
        )
    ]
    cursor.executemany("""
    INSERT INTO corrective_actions (id, violation_id, mine_id, title, description, assigned_to, deadline, status, verification_hash, resolution_notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, corrective_actions)

    # 9. Seed SHA-256 Audit Chain (Tamper-proof blockchain ledger)
    genesis_payload = json.dumps({"action": "GENESIS_BLOCK", "system": "CoalSentinel AI SIH 2026", "timestamp": iso_now})
    genesis_prev = "0000000000000000000000000000000000000000000000000000000000000000"
    genesis_hash = calculate_hash(genesis_prev, iso_now, "SYSTEM", "GENESIS", genesis_payload)

    block1_payload = json.dumps({"violation_id": "viol-jh-ch4-01", "mine_id": "mine-jh-001", "ch4": 1.48, "regulation": "DGMS-CMR-2017-R169"})
    block1_hash = calculate_hash(genesis_hash, iso_now, "REGULATION_ENGINE", "VIOLATION_RECORDED", block1_payload)

    block2_payload = json.dumps({"contradiction_id": "cntr-jh-01", "inspector": "Rajesh K. Sharma", "claimed": 0.15, "actual_sensor": 1.48, "delta": 1.33})
    block2_hash = calculate_hash(block1_hash, iso_now, "CONTRADICTION_ENGINE", "FALSIFICATION_FLAGGED", block2_payload)

    block3_payload = json.dumps({"action_id": "ca-jh-01", "assigned_to": "Er. S. Sengupta", "status": "IN_PROGRESS", "deadline": "2026-09-26 12:00:00"})
    block3_hash = calculate_hash(block2_hash, iso_now, "CORRECTIVE_ENGINE", "ACTION_COMMENCED", block3_payload)

    blocks = [
        (0, iso_now, "GENESIS", "SYSTEM", genesis_payload, genesis_prev, genesis_hash),
        (1, iso_now, "VIOLATION_RECORDED", "REGULATION_ENGINE", block1_payload, genesis_hash, block1_hash),
        (2, iso_now, "FALSIFICATION_FLAGGED", "CONTRADICTION_ENGINE", block2_payload, block1_hash, block2_hash),
        (3, iso_now, "ACTION_COMMENCED", "CORRECTIVE_ENGINE", block3_payload, block2_hash, block3_hash)
    ]
    cursor.executemany("""
    INSERT INTO audit_chain (block_index, timestamp, event_type, actor, payload_json, prev_hash, current_hash)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    """, blocks)

    conn.commit()
    conn.close()
    print("Realistic Indian Coal Mine Dataset seeded successfully!")

if __name__ == "__main__":
    seed()
