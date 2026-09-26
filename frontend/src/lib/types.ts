export interface Mine {
  id: string;
  name: string;
  code: string;
  state: string;
  district: string;
  coalfield: string;
  type: 'Opencast' | 'Underground' | 'Mixed';
  operator: string;
  depth_m: number;
  capacity_mtpa: number;
  latitude: number;
  longitude: number;
  status: 'Operational' | 'Critical_Watch' | 'Halted';
  description?: string;
  active_violations_count?: number;
  latest_ch4?: number;
  latest_pm10?: number;
}

export interface SafetyTelemetry {
  id: number;
  mine_id: string;
  timestamp: string;
  ch4_percent: number;
  co_ppm: number;
  o2_percent: number;
  air_velocity_mps: number;
  temp_c: number;
  humidity_pct: number;
  strata_stress_mpa: number;
}

export interface EnvironmentTelemetry {
  id: number;
  mine_id: string;
  timestamp: string;
  pm25: number;
  pm10: number;
  noise_db: number;
  water_ph: number;
  turbidity_ntu: number;
  so2: number;
  nox: number;
}

export interface Equipment {
  id: string;
  mine_id: string;
  code: string;
  name: string;
  type: string;
  health_score: number;
  vibration_mms: number;
  temp_c: number;
  status: 'Operational' | 'Warning' | 'Critical';
  maintenance_due: string;
}

export interface Inspection {
  id: string;
  mine_id: string;
  inspector_name: string;
  designation: string;
  date: string;
  summary: string;
  declared_methane: number;
  declared_ventilation: number;
  declared_dust_suppression: number;
  declared_status: string;
  notes?: string;
}

export interface Regulation {
  id: string;
  code: string;
  title: string;
  section: string;
  category: string;
  standard_limit: number;
  operator: string;
  unit: string;
  penalty_tier: string;
  description: string;
}

export interface RegulationEvaluation {
  regulation_id: string;
  code: string;
  title: string;
  category: string;
  parameter: string;
  standard_limit: number;
  operator: string;
  unit: string;
  actual_value: number | null;
  status: 'PASS' | 'FAIL' | 'UNKNOWN';
  penalty_tier: string;
  detail: string;
  legal_section: string;
  description: string;
}

export interface Violation {
  id: string;
  mine_id: string;
  regulation_id: string;
  detected_value: number;
  limit_value: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  timestamp: string;
  title: string;
  description: string;
  mine_name?: string;
  reg_code?: string;
  reg_title?: string;
  reg_unit?: string;
}

export interface ContradictionItem {
  id: string;
  parameter: string;
  unit: string;
  inspector_declared: any;
  sensor_actual: any;
  discrepancy_delta: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  category: string;
  inspector_name: string;
  inspection_date: string;
  finding: string;
  recommendation: string;
}

export interface ContradictionResult {
  mine_id: string;
  trust_index: number;
  status: string;
  inspector_name: string;
  inspection_date: string;
  declared_summary: string;
  contradictions: ContradictionItem[];
  total_contradictions: number;
}

export interface RadarMetric {
  subject: string;
  score: number;
  fullMark: number;
}

export interface ComplianceDna {
  mine_id: string;
  mine_name: string;
  composite_score: number;
  risk_grade: string;
  color: string;
  radar_metrics: RadarMetric[];
  open_violations_count: number;
  recurring_patterns: {
    category: string;
    frequency: string;
    impact: string;
    recommendation: string;
  }[];
  history_weeks: number[][];
}

export interface CorrectiveAction {
  id: string;
  violation_id: string;
  mine_id: string;
  title: string;
  description: string;
  assigned_to: string;
  deadline: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  verification_hash?: string;
  resolution_notes?: string;
  created_at: string;
  mine_name?: string;
  violation_title?: string;
  severity?: string;
}

export interface AuditBlock {
  block_index: number;
  timestamp: string;
  event_type: string;
  actor: string;
  payload_json: string;
  payload: any;
  prev_hash: string;
  current_hash: string;
}

export interface AuditVerification {
  is_valid: boolean;
  total_blocks: number;
  genesis_hash?: string;
  tip_hash?: string;
  corrupted_blocks: { block_index: number; reason: string }[];
  verified_at: string;
  status_message: string;
}
