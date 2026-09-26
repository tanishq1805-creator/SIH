import sqlite3
import json
import hashlib
import datetime
from config import DATABASE_PATH

def get_db():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Mines Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS mines (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT UNIQUE NOT NULL,
        state TEXT NOT NULL,
        district TEXT NOT NULL,
        coalfield TEXT NOT NULL,
        type TEXT NOT NULL, -- Opencast, Underground, Mixed
        operator TEXT NOT NULL, -- BCCL, SECL, ECL, NCL, etc.
        depth_m REAL NOT NULL,
        capacity_mtpa REAL NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        status TEXT NOT NULL, -- Operational, Critical_Watch, Halted
        description TEXT
    );
    """)

    # Safety Telemetry Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS safety_telemetry (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mine_id TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        ch4_percent REAL NOT NULL,
        co_ppm REAL NOT NULL,
        o2_percent REAL NOT NULL,
        air_velocity_mps REAL NOT NULL,
        temp_c REAL NOT NULL,
        humidity_pct REAL NOT NULL,
        strata_stress_mpa REAL NOT NULL,
        FOREIGN KEY (mine_id) REFERENCES mines(id)
    );
    """)

    # Environment Telemetry Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS environment_telemetry (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mine_id TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        pm25 REAL NOT NULL,
        pm10 REAL NOT NULL,
        noise_db REAL NOT NULL,
        water_ph REAL NOT NULL,
        turbidity_ntu REAL NOT NULL,
        so2 REAL NOT NULL,
        nox REAL NOT NULL,
        FOREIGN KEY (mine_id) REFERENCES mines(id)
    );
    """)

    # Equipment Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS equipment (
        id TEXT PRIMARY KEY,
        mine_id TEXT NOT NULL,
        code TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL, -- Dragline, Dumper, Continuous Miner, Longwall Shearer, Main Fan, Gas Pump
        health_score REAL NOT NULL, -- 0 to 100
        vibration_mms REAL NOT NULL,
        temp_c REAL NOT NULL,
        status TEXT NOT NULL, -- Operational, Warning, Critical
        maintenance_due TEXT NOT NULL,
        FOREIGN KEY (mine_id) REFERENCES mines(id)
    );
    """)

    # Inspection Logs Table (Human shift records)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS inspections (
        id TEXT PRIMARY KEY,
        mine_id TEXT NOT NULL,
        inspector_name TEXT NOT NULL,
        designation TEXT NOT NULL,
        date TEXT NOT NULL,
        summary TEXT NOT NULL,
        declared_methane REAL NOT NULL,
        declared_ventilation REAL NOT NULL,
        declared_dust_suppression REAL NOT NULL,
        declared_status TEXT NOT NULL, -- Satisfactory, Minor_Issue, Critical
        notes TEXT,
        FOREIGN KEY (mine_id) REFERENCES mines(id)
    );
    """)

    # Regulations Table (DGMS Coal Mines Regulations 2017 & CPCB)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS regulations (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL, -- e.g. DGMS-CMR-2017-R153
        title TEXT NOT NULL,
        section TEXT NOT NULL,
        category TEXT NOT NULL, -- Safety, Environment, Strata
        standard_limit REAL NOT NULL,
        operator TEXT NOT NULL, -- <=, >=, ==, between
        unit TEXT NOT NULL,
        penalty_tier TEXT NOT NULL, -- Severe, High, Medium, Low
        description TEXT NOT NULL
    );
    """)

    # Violations Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS violations (
        id TEXT PRIMARY KEY,
        mine_id TEXT NOT NULL,
        regulation_id TEXT NOT NULL,
        detected_value REAL NOT NULL,
        limit_value REAL NOT NULL,
        severity TEXT NOT NULL, -- CRITICAL, HIGH, MEDIUM, LOW
        status TEXT NOT NULL, -- OPEN, INVESTIGATING, RESOLVED
        timestamp TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        FOREIGN KEY (mine_id) REFERENCES mines(id),
        FOREIGN KEY (regulation_id) REFERENCES regulations(id)
    );
    """)

    # Evidence Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS evidences (
        id TEXT PRIMARY KEY,
        violation_id TEXT NOT NULL,
        mine_id TEXT NOT NULL,
        evidence_type TEXT NOT NULL, -- SENSOR_TELEMETRY, CONTRADICTION_AUDIT, SATELLITE_ANOMALY
        data_payload TEXT NOT NULL, -- JSON string
        hash TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        source TEXT NOT NULL,
        FOREIGN KEY (violation_id) REFERENCES violations(id)
    );
    """)

    # Corrective Actions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS corrective_actions (
        id TEXT PRIMARY KEY,
        violation_id TEXT NOT NULL,
        mine_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        assigned_to TEXT NOT NULL,
        deadline TEXT NOT NULL,
        status TEXT NOT NULL, -- PENDING, IN_PROGRESS, RESOLVED
        verification_hash TEXT,
        resolution_notes TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (violation_id) REFERENCES violations(id)
    );
    """)

    # Audit Hash Chain Table (SHA-256 blockchain-style immutable ledger)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_chain (
        block_index INTEGER PRIMARY KEY,
        timestamp TEXT NOT NULL,
        event_type TEXT NOT NULL, -- VIOLATION_CREATED, CONTRADICTION_DETECTED, ACTION_CLOSED, TELEMETRY_INGEST
        actor TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        prev_hash TEXT NOT NULL,
        current_hash TEXT NOT NULL
    );
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database schema successfully initialized.")
