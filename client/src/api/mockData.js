// Realistic Seed Data for In-Browser Fallback & Static Hosting (Vercel)

export function getInitialData() {
  const now = new Date().toISOString();
  const daysAgo = (d) => new Date(Date.now() - d * 86400000).toISOString();
  const hoursAgo = (h) => new Date(Date.now() - h * 3600000).toISOString();

  return {
    users: [
      { id: 1, email: 'admin@dmp.gov.in', full_name: 'Dr. Rajesh Kumar', phone: '9876543210', role: 'Super Admin', role_id: 1, organization_name: 'Haryana SDMA', district: 'Chandigarh', state: 'Haryana', is_active: true },
      { id: 2, email: 'eoc@dmp.gov.in', full_name: 'Priya Sharma', phone: '9876543211', role: 'EOC Operator', role_id: 4, organization_name: 'Haryana SDMA', district: 'Chandigarh', state: 'Haryana', is_active: true },
      { id: 3, email: 'district@dmp.gov.in', full_name: 'Anil Verma', phone: '9876543212', role: 'District Admin', role_id: 3, organization_name: 'District Administration Rohtak', district: 'Rohtak', state: 'Haryana', is_active: true },
      { id: 4, email: 'ngo@relief.org', full_name: 'Sanjay Gupta', phone: '9876543213', role: 'NGO Admin', role_id: 5, organization_name: 'Indian Red Cross - Haryana', district: 'Chandigarh', state: 'Haryana', is_active: true },
      { id: 5, email: 'field@dmp.gov.in', full_name: 'Vikram Singh', phone: '9876543214', role: 'Field Officer', role_id: 6, organization_name: 'NDRF 5th Battalion', district: 'Rohtak', state: 'Haryana', is_active: true },
      { id: 6, email: 'volunteer@dmp.gov.in', full_name: 'Meera Patel', phone: '9876543215', role: 'Volunteer', role_id: 7, organization_name: 'Goonj Relief', district: 'Karnal', state: 'Haryana', is_active: true },
      { id: 7, email: 'citizen@example.com', full_name: 'Amit Citizen', phone: '9876543216', role: 'Public User', role_id: 8, organization_name: 'General Public', district: 'Rohtak', state: 'Haryana', is_active: true },
    ],

    incidents: [
      {
        id: 1, incident_id: 'FLD-2024-001', disaster_type_id: 1, disaster_type: 'Flood', disaster_icon: '🌊', disaster_color: '#2563EB',
        severity: 'critical', status: 'responding', title: 'Severe Flooding in Rohtak District',
        description: 'Heavy monsoon rainfall has caused severe flooding in low-lying areas of Rohtak district. Multiple villages are submerged. Immediate rescue and relief operations underway. National Highway 9 partially submerged near Asthal Bohar.',
        latitude: 28.8955, longitude: 76.5796, location_name: 'Rohtak District', affected_districts: 'Rohtak, Jhajjar', state: 'Haryana',
        estimated_affected: 45000, casualties: 12, missing_persons: 8, injured: 156, evacuated: 12000,
        reporting_org: 'District Administration Rohtak', reported_by_name: 'Anil Verma', verification_status: 'verified', response_status: 'in_progress',
        detected_at: daysAgo(3), created_at: daysAgo(3), updated_at: hoursAgo(2)
      },
      {
        id: 2, incident_id: 'FLD-2024-002', disaster_type_id: 1, disaster_type: 'Flood', disaster_icon: '🌊', disaster_color: '#2563EB',
        severity: 'high', status: 'verified', title: 'Flash Floods in Karnal',
        description: 'Sudden flash floods in Karnal district due to overflowing of Western Yamuna Canal. Water logging in commercial and residential areas.',
        latitude: 29.6857, longitude: 76.9905, location_name: 'Karnal City', affected_districts: 'Karnal', state: 'Haryana',
        estimated_affected: 15000, casualties: 2, missing_persons: 3, injured: 45, evacuated: 3000,
        reporting_org: 'District Administration Karnal', reported_by_name: 'Priya Sharma', verification_status: 'verified', response_status: 'teams_assigned',
        detected_at: daysAgo(1), created_at: daysAgo(1), updated_at: hoursAgo(4)
      },
      {
        id: 3, incident_id: 'FIR-2024-001', disaster_type_id: 5, disaster_type: 'Fire', disaster_icon: '🔥', disaster_color: '#DC2626',
        severity: 'critical', status: 'responding', title: 'Industrial Fire at Panipat Refinery Complex',
        description: 'Major fire broke out at an industrial storage unit near Panipat refinery complex. Fire service and NDRF teams deployed. Nearby areas evacuated.',
        latitude: 29.3909, longitude: 76.9635, location_name: 'Panipat Industrial Area', affected_districts: 'Panipat', state: 'Haryana',
        estimated_affected: 5000, casualties: 3, missing_persons: 0, injured: 28, evacuated: 2500,
        reporting_org: 'Haryana Fire Service', reported_by_name: 'Vikram Singh', verification_status: 'verified', response_status: 'in_progress',
        detected_at: hoursAgo(18), created_at: hoursAgo(18), updated_at: hoursAgo(1)
      },
      {
        id: 4, incident_id: 'LND-2024-001', disaster_type_id: 4, disaster_type: 'Landslide', disaster_icon: '⛰️', disaster_color: '#92400E',
        severity: 'high', status: 'responding', title: 'Landslide near Morni Hills',
        description: 'Heavy rains triggered a major landslide near Morni Hills blocking the main road. Vehicles trapped. Rescue operations underway.',
        latitude: 30.6942, longitude: 77.0857, location_name: 'Morni Hills Road', affected_districts: 'Panchkula', state: 'Haryana',
        estimated_affected: 2000, casualties: 1, missing_persons: 5, injured: 12, evacuated: 800,
        reporting_org: 'NDRF 5th Battalion', reported_by_name: 'Vikram Singh', verification_status: 'verified', response_status: 'in_progress',
        detected_at: daysAgo(2), created_at: daysAgo(2), updated_at: hoursAgo(6)
      },
      {
        id: 5, incident_id: 'EQ-2024-001', disaster_type_id: 2, disaster_type: 'Earthquake', disaster_icon: '🏚️', disaster_color: '#7C3AED',
        severity: 'moderate', status: 'verified', title: 'Minor Earthquake Tremors in Hisar',
        description: 'Tremors of magnitude 3.8 felt in Hisar and Fatehabad. Structural audits ongoing.',
        latitude: 29.1492, longitude: 75.7217, location_name: 'Hisar', affected_districts: 'Hisar, Fatehabad', state: 'Haryana',
        estimated_affected: 0, casualties: 0, missing_persons: 0, injured: 0, evacuated: 0,
        reporting_org: 'Haryana SDMA', reported_by_name: 'Priya Sharma', verification_status: 'verified', response_status: 'pending',
        detected_at: hoursAgo(12), created_at: hoursAgo(12), updated_at: hoursAgo(10)
      },
      {
        id: 6, incident_id: 'BLD-2024-001', disaster_type_id: 9, disaster_type: 'Building Collapse', disaster_icon: '🏗️', disaster_color: '#78350F',
        severity: 'critical', status: 'responding', title: 'Building Collapse in Faridabad Sector 37',
        description: 'Multi-storey building collapsed. Search and rescue operations in progress with acoustic sensors and canine squads.',
        latitude: 28.4089, longitude: 77.3178, location_name: 'Sector 37, Faridabad', affected_districts: 'Faridabad', state: 'Haryana',
        estimated_affected: 200, casualties: 7, missing_persons: 15, injured: 22, evacuated: 150,
        reporting_org: 'Haryana Fire Service', reported_by_name: 'Vikram Singh', verification_status: 'verified', response_status: 'in_progress',
        detected_at: hoursAgo(8), created_at: hoursAgo(8), updated_at: hoursAgo(1)
      }
    ],

    incident_updates: [
      { id: 1, incident_id: 1, user_name: 'Anil Verma', update_text: 'Flood waters rising in low-lying areas. District administration alerted.', update_type: 'info', created_at: daysAgo(3) },
      { id: 2, incident_id: 1, user_name: 'Priya Sharma', update_text: 'Incident verified. NDRF teams requested.', update_type: 'status_change', created_at: daysAgo(3) },
      { id: 3, incident_id: 1, user_name: 'Vikram Singh', update_text: 'NDRF Alpha Team deployed to Rohtak. 2 rescue boats operational.', update_type: 'team', created_at: daysAgo(2) },
      { id: 4, incident_id: 1, user_name: 'Anil Verma', update_text: 'Evacuation of Asthal Bohar village underway. 3000 people moved to shelters.', update_type: 'info', created_at: daysAgo(2) },
      { id: 5, incident_id: 1, user_name: 'Vikram Singh', update_text: '8 persons missing near canal area. Search operations intensified.', update_type: 'casualty', created_at: daysAgo(1) },
      { id: 6, incident_id: 1, user_name: 'Sanjay Gupta', update_text: 'Medical camp established at Government School Shelter. 50 patients treated.', update_type: 'resource', created_at: hoursAgo(12) },
      { id: 7, incident_id: 1, user_name: 'Priya Sharma', update_text: 'Casualty count updated. Total casualties: 12, Injured: 156.', update_type: 'casualty', created_at: hoursAgo(6) },
    ],

    shelters: [
      { id: 1, name: 'Government School Shelter', location_name: 'Sector 1, Rohtak', district: 'Rohtak', state: 'Haryana', latitude: 28.8900, longitude: 76.5800, capacity: 500, current_occupancy: 370, food_available: true, water_available: true, medical_facility: true, electricity: true, toilets: 20, contact_person: 'Ramesh Kumar', contact_phone: '9812345601', status: 'active' },
      { id: 2, name: 'Community Hall', location_name: 'Sector 12, Karnal', district: 'Karnal', state: 'Haryana', latitude: 29.6800, longitude: 76.9900, capacity: 300, current_occupancy: 210, food_available: true, water_available: true, medical_facility: false, electricity: true, toilets: 12, contact_person: 'Suresh Yadav', contact_phone: '9812345602', status: 'active' },
      { id: 3, name: 'Stadium Complex', location_name: 'GT Road, Panipat', district: 'Panipat', state: 'Haryana', latitude: 29.3850, longitude: 76.9700, capacity: 1000, current_occupancy: 450, food_available: true, water_available: true, medical_facility: true, electricity: true, toilets: 40, contact_person: 'Deepak Sharma', contact_phone: '9812345603', status: 'active' },
      { id: 4, name: 'Dharamshala', location_name: 'Bus Stand Area, Hisar', district: 'Hisar', state: 'Haryana', latitude: 29.1500, longitude: 75.7250, capacity: 200, current_occupancy: 45, food_available: true, water_available: true, medical_facility: false, electricity: true, toilets: 8, contact_person: 'Mohan Lal', contact_phone: '9812345604', status: 'active' },
      { id: 5, name: 'Government College', location_name: 'Sector 14, Sonipat', district: 'Sonipat', state: 'Haryana', latitude: 28.9980, longitude: 77.0200, capacity: 400, current_occupancy: 280, food_available: true, water_available: true, medical_facility: false, electricity: true, toilets: 16, contact_person: 'Kavita Devi', contact_phone: '9812345605', status: 'active' },
      { id: 6, name: 'Indoor Stadium', location_name: 'Sector 12, Faridabad', district: 'Faridabad', state: 'Haryana', latitude: 28.4100, longitude: 77.3200, capacity: 800, current_occupancy: 620, food_available: true, water_available: true, medical_facility: true, electricity: true, toilets: 30, contact_person: 'Rajender Singh', contact_phone: '9812345606', status: 'active' },
      { id: 7, name: 'Temple Complex', location_name: 'Near Brahma Sarovar, Kurukshetra', district: 'Kurukshetra', state: 'Haryana', latitude: 29.9695, longitude: 76.8783, capacity: 250, current_occupancy: 30, food_available: true, water_available: true, medical_facility: false, electricity: true, toilets: 10, contact_person: 'Pandit Shyam', contact_phone: '9812345607', status: 'active' },
      { id: 8, name: 'Relief Camp', location_name: 'Jhajjar Road', district: 'Jhajjar', state: 'Haryana', latitude: 28.6064, longitude: 76.6554, capacity: 600, current_occupancy: 410, food_available: true, water_available: true, medical_facility: true, electricity: true, toilets: 24, contact_person: 'Naresh Tanwar', contact_phone: '9812345609', status: 'active' },
    ],

    resources: [
      { id: 1, name: 'Ambulance Unit A1', type: 'ambulance', quantity: 3, available_quantity: 1, location: 'Rohtak Civil Hospital', latitude: 28.8900, longitude: 76.5700, status: 'deployed', organization_name: 'Haryana Health Department', assigned_incident_code: 'FLD-2024-001', assigned_incident_title: 'Severe Flooding in Rohtak' },
      { id: 2, name: 'Ambulance Unit A2', type: 'ambulance', quantity: 2, available_quantity: 2, location: 'Karnal Hospital', latitude: 29.6900, longitude: 76.9800, status: 'available', organization_name: 'Haryana Health Department' },
      { id: 3, name: 'NDRF Rescue Boats', type: 'boat', quantity: 8, available_quantity: 3, location: 'NDRF Base Rohtak', latitude: 28.9000, longitude: 76.5900, status: 'deployed', organization_name: 'NDRF 5th Battalion', assigned_incident_code: 'FLD-2024-001', assigned_incident_title: 'Severe Flooding in Rohtak' },
      { id: 4, name: 'Fire Tenders', type: 'rescue_vehicle', quantity: 6, available_quantity: 2, location: 'Panipat Fire Station', latitude: 29.3900, longitude: 76.9600, status: 'deployed', organization_name: 'Haryana Fire Service', assigned_incident_code: 'FIR-2024-001', assigned_incident_title: 'Industrial Fire at Panipat' },
      { id: 5, name: 'Medical Supply Kit', type: 'medical_supplies', quantity: 200, available_quantity: 120, location: 'SDMA Warehouse Chandigarh', latitude: 30.7333, longitude: 76.7794, status: 'available', organization_name: 'Haryana SDMA' },
      { id: 6, name: 'Emergency Food Packets', type: 'food', quantity: 10000, available_quantity: 4500, location: 'Central Warehouse Rohtak', latitude: 28.9000, longitude: 76.5800, status: 'deployed', organization_name: 'Indian Red Cross', assigned_incident_code: 'FLD-2024-001', assigned_incident_title: 'Severe Flooding in Rohtak' },
      { id: 7, name: 'Water Tankers', type: 'water', quantity: 15, available_quantity: 8, location: 'Public Health Depot', latitude: 28.8800, longitude: 76.5600, status: 'available', organization_name: 'Haryana SDMA' },
      { id: 8, name: 'Emergency Generator Sets', type: 'generator', quantity: 10, available_quantity: 6, location: 'PWD Store Chandigarh', latitude: 30.7400, longitude: 76.7800, status: 'available', organization_name: 'Haryana SDMA' },
      { id: 9, name: 'Rescue Tents', type: 'tent', quantity: 500, available_quantity: 200, location: 'Red Cross Depot', latitude: 30.7300, longitude: 76.7700, status: 'deployed', organization_name: 'Indian Red Cross' },
    ],

    response_teams: [
      { id: 1, name: 'NDRF Alpha Team', type: 'ndrf', organization_name: 'NDRF 5th Battalion', members_count: 45, specialization: 'Flood Rescue & Relief', status: 'deployed', current_location: 'Rohtak Flood Zone', latitude: 28.8950, longitude: 76.5800, contact_person: 'Commandant R.K. Jha', contact_phone: '9811111101', assigned_incident_id: 1 },
      { id: 2, name: 'SDRF Bravo Team', type: 'sdrf', organization_name: 'Haryana SDMA', members_count: 30, specialization: 'Multi-Hazard Response', status: 'deployed', current_location: 'Karnal Flood Area', latitude: 29.6860, longitude: 76.9900, contact_person: 'Inspector Aman Deep', contact_phone: '9811111102', assigned_incident_id: 2 },
      { id: 3, name: 'Fire Response Unit Alpha', type: 'fire', organization_name: 'Haryana Fire Service', members_count: 20, specialization: 'Industrial Fire Fighting', status: 'deployed', current_location: 'Panipat Industrial Area', latitude: 29.3910, longitude: 76.9640, contact_person: 'CFO Harbhajan Singh', contact_phone: '9811111103', assigned_incident_id: 3 },
      { id: 4, name: 'Medical Emergency Team', type: 'medical', organization_name: 'Haryana Health Dept', members_count: 15, specialization: 'Emergency Medical Care', status: 'deployed', current_location: 'Rohtak Civil Hospital', latitude: 28.8900, longitude: 76.5700, contact_person: 'Dr. Sunita Rani', contact_phone: '9811111104', assigned_incident_id: 1 },
      { id: 5, name: 'Police Rescue Squad', type: 'police', organization_name: 'Haryana Police', members_count: 25, specialization: 'Evacuation & Law Enforcement', status: 'deployed', current_location: 'Faridabad Sector 37', latitude: 28.4090, longitude: 77.3180, contact_person: 'DSP Rakesh Yadav', contact_phone: '9811111105', assigned_incident_id: 6 },
      { id: 6, name: 'SEEDS Rapid Response', type: 'rescue', organization_name: 'SEEDS India', members_count: 12, specialization: 'Community First Response', status: 'available', current_location: 'SEEDS Office Delhi', latitude: 28.6100, longitude: 77.2300, contact_person: 'Anshu Sharma', contact_phone: '9811111107' },
      { id: 7, name: 'Volunteer Corps Rohtak', type: 'volunteer', organization_name: 'Goonj Relief', members_count: 40, specialization: 'Relief Material Distribution', status: 'deployed', current_location: 'Rohtak Relief Depot', latitude: 28.9000, longitude: 76.5800, contact_person: 'Meera Patel', contact_phone: '9876543215', assigned_incident_id: 1 },
    ],

    resource_requests: [
      { id: 1, incident_id: 1, incident_code: 'FLD-2024-001', incident_title: 'Severe Flooding in Rohtak', requested_by_name: 'Anil Verma', resource_type: 'boat', quantity: 5, urgency: 'critical', description: 'Need additional rescue boats for village evacuation operations', status: 'assigned', assigned_resource_name: 'NDRF Rescue Boats', created_at: daysAgo(2) },
      { id: 2, incident_id: 1, incident_code: 'FLD-2024-001', incident_title: 'Severe Flooding in Rohtak', requested_by_name: 'Vikram Singh', resource_type: 'food', quantity: 5000, urgency: 'high', description: 'Food packets needed for 12000 evacuees in shelters', status: 'fulfilled', assigned_resource_name: 'Emergency Food Packets', created_at: daysAgo(2) },
      { id: 3, incident_id: 2, incident_code: 'FLD-2024-002', incident_title: 'Flash Floods in Karnal', requested_by_name: 'Meera Patel', resource_type: 'water', quantity: 3, urgency: 'medium', description: 'Drinking water tankers for relief centers', status: 'pending', created_at: hoursAgo(20) },
      { id: 4, incident_id: 3, incident_code: 'FIR-2024-001', incident_title: 'Industrial Fire in Panipat', requested_by_name: 'Vikram Singh', resource_type: 'ambulance', quantity: 2, urgency: 'critical', description: 'Burn victim ambulances needed immediately', status: 'assigned', assigned_resource_name: 'Ambulance Unit A1', created_at: hoursAgo(16) },
      { id: 5, incident_id: 1, incident_code: 'FLD-2024-001', incident_title: 'Severe Flooding in Rohtak', requested_by_name: 'Sanjay Gupta', resource_type: 'blanket', quantity: 500, urgency: 'medium', description: 'Blankets for flood evacuees in school shelters', status: 'pending', created_at: hoursAgo(10) },
    ],

    field_reports: [
      { id: 1, report_id: 'FR-2024-001', incident_id: 1, submitted_by_name: 'Vikram Singh', report_type: 'situation_update', category: 'Flood', severity: 'critical', description: 'Water level has risen to 6 feet in Asthal Bohar village. Evacuations in progress with NDRF boats.', latitude: 28.8800, longitude: 76.5600, location_name: 'Asthal Bohar, Rohtak', district: 'Rohtak', verification_status: 'verified', created_at: daysAgo(2) },
      { id: 2, report_id: 'FR-2024-002', incident_id: 1, submitted_by_name: 'Meera Patel', report_type: 'damage', category: 'Infrastructure', severity: 'high', description: 'Bridge on Rohtak-Jhajjar road partially collapsed. Heavy vehicles cannot pass.', latitude: 28.8500, longitude: 76.6000, location_name: 'Rohtak-Jhajjar Road Bridge', district: 'Rohtak', verification_status: 'verified', created_at: daysAgo(2) },
      { id: 3, report_id: 'FR-2024-003', incident_id: 1, submitted_by_name: 'Vikram Singh', report_type: 'road_blockage', category: 'Transport', severity: 'high', description: 'NH-9 submerged near km 45. Traffic completely blocked.', latitude: 28.8700, longitude: 76.5500, location_name: 'NH-9 near Asthal Bohar', district: 'Rohtak', verification_status: 'verified', created_at: daysAgo(2) },
      { id: 4, report_id: 'FR-2024-004', incident_id: 1, submitted_by_name: 'Meera Patel', report_type: 'shelter_update', category: 'Relief', severity: 'moderate', description: 'Government School Shelter running low on food supplies. 370 people accommodated.', latitude: 28.8900, longitude: 76.5800, location_name: 'Govt School Shelter, Rohtak', district: 'Rohtak', verification_status: 'verified', created_at: daysAgo(1) },
      { id: 5, report_id: 'FR-2024-005', incident_id: 3, submitted_by_name: 'Vikram Singh', report_type: 'situation_update', category: 'Fire', severity: 'critical', description: 'Fire spreading to adjacent warehouse. Evacuation radius extended to 1 km.', latitude: 29.3915, longitude: 76.9640, location_name: 'Panipat Industrial Area', district: 'Panipat', verification_status: 'verified', created_at: hoursAgo(14) },
      { id: 6, report_id: 'FR-2024-006', incident_id: null, submitted_by_name: 'Amit Citizen', report_type: 'incident', category: 'Flood', severity: 'moderate', description: 'Citizen distress report: Street water logging in Sector 5 Rohtak.', latitude: 28.8920, longitude: 76.5850, location_name: 'Sector 5, Rohtak', district: 'Rohtak', verification_status: 'submitted', created_at: hoursAgo(5) },
    ],

    damage_reports: [
      { id: 1, incident_id: 1, incident_code: 'FLD-2024-001', reported_by_name: 'Vikram Singh', infrastructure_type: 'road', damage_level: 'major', description: 'NH-9 highway submerged and surface eroded between km 40-48.', location_name: 'NH-9 Rohtak', district: 'Rohtak', affected_families: 0, estimated_loss: 50000000, status: 'verified', created_at: daysAgo(2) },
      { id: 2, incident_id: 1, incident_code: 'FLD-2024-001', reported_by_name: 'Meera Patel', infrastructure_type: 'bridge', damage_level: 'major', description: 'Rohtak-Jhajjar road bridge foundation undermined by flood waters.', location_name: 'Rohtak-Jhajjar Bridge', district: 'Rohtak', affected_families: 0, estimated_loss: 150000000, status: 'verified', created_at: daysAgo(2) },
      { id: 3, incident_id: 1, incident_code: 'FLD-2024-001', reported_by_name: 'Anil Verma', infrastructure_type: 'residential', damage_level: 'destroyed', description: '450 mud houses completely destroyed in Asthal Bohar area.', location_name: 'Asthal Bohar area', district: 'Rohtak', affected_families: 450, estimated_loss: 270000000, status: 'assigned', created_at: daysAgo(1) },
      { id: 4, incident_id: 1, incident_code: 'FLD-2024-001', reported_by_name: 'Vikram Singh', infrastructure_type: 'electricity', damage_level: 'major', description: '15 electricity transmission towers damaged. Power supply disrupted in 25 villages.', location_name: 'Rohtak District', district: 'Rohtak', affected_families: 5000, estimated_loss: 80000000, status: 'in_progress', created_at: daysAgo(1) },
      { id: 5, incident_id: 1, incident_code: 'FLD-2024-001', reported_by_name: 'Anil Verma', infrastructure_type: 'agricultural', damage_level: 'destroyed', description: 'Standing paddy crop in 5000 acres completely submerged.', location_name: 'Various villages, Rohtak', district: 'Rohtak', affected_families: 2000, estimated_loss: 500000000, status: 'reported', created_at: daysAgo(1) },
      { id: 6, incident_id: 3, incident_code: 'FIR-2024-001', reported_by_name: 'Vikram Singh', infrastructure_type: 'commercial', damage_level: 'destroyed', description: 'Industrial chemical unit completely gutted by fire.', location_name: 'Panipat Industrial Area', district: 'Panipat', affected_families: 0, estimated_loss: 800000000, status: 'verified', created_at: hoursAgo(12) },
      { id: 7, incident_id: 6, incident_code: 'BLD-2024-001', reported_by_name: 'Vikram Singh', infrastructure_type: 'residential', damage_level: 'destroyed', description: '4-storey residential building collapsed in Sector 37.', location_name: 'Sector 37, Faridabad', district: 'Faridabad', affected_families: 24, estimated_loss: 120000000, status: 'in_progress', created_at: hoursAgo(7) },
    ],

    alerts: [
      { id: 1, alert_type: 'flood_warning', severity: 'critical', title: 'Severe Flood Warning for Rohtak District', message: 'Yamuna water level rising rapidly. All residents in low-lying areas of Rohtak and Jhajjar districts advised to move to higher ground immediately.', affected_area: 'Rohtak, Jhajjar', latitude: 28.8955, longitude: 76.5796, radius_km: 30, issuing_authority: 'Haryana SDMA', status: 'active', start_time: daysAgo(3), expiry_time: new Date(Date.now() + 2 * 86400000).toISOString(), created_at: daysAgo(3) },
      { id: 2, alert_type: 'heavy_rainfall', severity: 'high', title: 'Heavy Rainfall Warning for Haryana', message: 'IMD has issued heavy rainfall warning for central and eastern Haryana. Expected rainfall 100-150mm in next 48 hours.', affected_area: 'Central and Eastern Haryana', latitude: 29.0588, longitude: 76.0856, radius_km: 100, issuing_authority: 'India Meteorological Department', status: 'active', start_time: daysAgo(1), expiry_time: new Date(Date.now() + 1 * 86400000).toISOString(), created_at: daysAgo(1) },
      { id: 3, alert_type: 'evacuation_order', severity: 'critical', title: 'Evacuation Order - Rohtak Lowlands', message: 'Mandatory evacuation ordered for all residents in Rohtak district low-lying areas including Asthal Bohar, Lakhan Majra. Report to nearest shelter.', affected_area: 'Rohtak Lowlands', latitude: 28.8800, longitude: 76.5600, radius_km: 15, issuing_authority: 'District Collector Rohtak', status: 'active', start_time: daysAgo(2), expiry_time: new Date(Date.now() + 3 * 86400000).toISOString(), created_at: daysAgo(2) },
      { id: 4, alert_type: 'heatwave', severity: 'high', title: 'Severe Heatwave Alert - Western Haryana', message: 'Temperatures expected to exceed 47°C in Bhiwani, Hisar, and Sirsa districts. Stay hydrated.', affected_area: 'Bhiwani, Hisar, Sirsa', latitude: 28.7751, longitude: 75.9928, radius_km: 80, issuing_authority: 'Haryana SDMA', status: 'active', start_time: daysAgo(5), expiry_time: new Date(Date.now() + 1 * 86400000).toISOString(), created_at: daysAgo(5) },
      { id: 5, alert_type: 'road_closure', severity: 'moderate', title: 'Road Closure - NH-9 Rohtak Section', message: 'NH-9 between Rohtak and Jhajjar is closed due to flooding. Vehicles must use Bhiwani bypass route.', affected_area: 'NH-9 Rohtak-Jhajjar', latitude: 28.8700, longitude: 76.5500, radius_km: 10, issuing_authority: 'Traffic Police Rohtak', status: 'active', start_time: daysAgo(2), expiry_time: new Date(Date.now() + 5 * 86400000).toISOString(), created_at: daysAgo(2) },
    ],

    training_programs: [
      { id: 1, title: 'Flood Response & Evacuation Training', organization_name: 'NDRF 5th Battalion', trainer_name: 'Commandant R.K. Jha', location: 'NDRF Training Center', latitude: 28.9100, longitude: 76.5900, district: 'Rohtak', state: 'Haryana', disaster_type_name: 'Flood', training_date: '2024-06-15', participants_count: 120, participant_categories: 'NDRF personnel, SDRF, District officials, Volunteers', outcome: 'Trained 120 personnel in flood rescue techniques, boat operations, and evacuation procedures' },
      { id: 2, title: 'First Aid & Emergency Response Training', organization_name: 'Indian Red Cross', trainer_name: 'Dr. Sunita Rani', location: 'Red Cross Bhawan, Chandigarh', latitude: 30.7333, longitude: 76.7794, district: 'Chandigarh', state: 'Haryana', disaster_type_name: 'General', training_date: '2024-07-10', participants_count: 85, participant_categories: 'Volunteers, Community leaders, Teachers', outcome: 'Basic life support, wound management, and emergency first response skills imparted' },
      { id: 3, title: 'Fire Safety Workshop for Industries', organization_name: 'Haryana Fire Service', trainer_name: 'CFO Harbhajan Singh', location: 'Panipat Fire Station', latitude: 29.3909, longitude: 76.9635, district: 'Panipat', state: 'Haryana', disaster_type_name: 'Fire', training_date: '2024-08-05', participants_count: 200, participant_categories: 'Industrial workers, Factory managers, Fire safety officers', outcome: 'Fire prevention, use of fire extinguishers, evacuation drills conducted' },
      { id: 4, title: 'Community Evacuation Drill', organization_name: 'District Administration Rohtak', trainer_name: 'Anil Verma', location: 'Various locations, Rohtak', latitude: 28.8955, longitude: 76.5796, district: 'Rohtak', state: 'Haryana', disaster_type_name: 'Flood', training_date: '2024-09-01', participants_count: 500, participant_categories: 'Community members, Village heads, Local volunteers', outcome: 'Mock evacuation drill covering 10 flood-prone villages. Identified bottlenecks in evacuation routes.' },
      { id: 5, title: 'Mock Earthquake Response Exercise', organization_name: 'Haryana SDMA', trainer_name: 'Dr. Rajesh Kumar', location: 'SDMA HQ, Chandigarh', latitude: 30.7333, longitude: 76.7794, district: 'Chandigarh', state: 'Haryana', disaster_type_name: 'Earthquake', training_date: '2024-10-05', participants_count: 300, participant_categories: 'Government officials, NDRF, SDRF, Hospital staff', outcome: 'Full-scale earthquake response simulation. Tested inter-agency coordination.' },
    ],

    organizations: [
      { id: 1, name: 'Haryana SDMA', type: 'government', contact_email: 'sdma@haryana.gov.in', contact_phone: '0172-2560144', operating_region: 'Haryana', specializations: 'State Disaster Coordination, Policy, Resource Allocation', teams_count: 1, resources_count: 4, training_count: 2 },
      { id: 2, name: 'NDRF 5th Battalion', type: 'military', contact_email: 'ndrf5@ndrf.gov.in', contact_phone: '011-26107953', operating_region: 'North India', specializations: 'Search and Rescue, Flood Response, CBRN', teams_count: 2, resources_count: 2, training_count: 1 },
      { id: 3, name: 'District Administration Rohtak', type: 'government', contact_email: 'dc-rohtak@haryana.gov.in', contact_phone: '01262-274300', operating_region: 'Rohtak District', specializations: 'District Coordination, Relief Distribution', teams_count: 0, resources_count: 0, training_count: 1 },
      { id: 4, name: 'Indian Red Cross - Haryana', type: 'ngo', contact_email: 'haryana@indianredcross.org', contact_phone: '0172-2706514', operating_region: 'Haryana', specializations: 'First Aid, Relief, Blood Bank, Disaster Response', teams_count: 1, resources_count: 2, training_count: 1 },
      { id: 5, name: 'Haryana Fire Service', type: 'fire', contact_email: 'fire@haryana.gov.in', contact_phone: '101', operating_region: 'Haryana', specializations: 'Fire Response, Building Collapse Rescue', teams_count: 1, resources_count: 1, training_count: 1 },
      { id: 6, name: 'Haryana Police Disaster Cell', type: 'police', contact_email: 'disaster@haryanapolice.gov.in', contact_phone: '100', operating_region: 'Haryana', specializations: 'Evacuation, Law and Order, Route Management', teams_count: 1, resources_count: 0, training_count: 0 },
      { id: 7, name: 'Goonj Relief', type: 'ngo', contact_email: 'info@goonj.org', contact_phone: '011-41401216', operating_region: 'Pan India', specializations: 'Relief Material, Community Preparedness, Volunteers', teams_count: 1, resources_count: 1, training_count: 0 },
      { id: 8, name: 'SEEDS India', type: 'ngo', contact_email: 'info@seedsindia.org', contact_phone: '011-27017652', operating_region: 'Pan India', specializations: 'Disaster Preparedness, Community Resilience', teams_count: 1, resources_count: 1, training_count: 0 },
    ],

    audit_logs: [
      { id: 1, user_name: 'Dr. Rajesh Kumar', action: 'login', entity_type: 'user', entity_id: 1, details: 'Admin login successful', ip_address: '192.168.1.100', created_at: daysAgo(3) },
      { id: 2, user_name: 'Anil Verma', action: 'incident_created', entity_type: 'incident', entity_id: 1, details: 'Created flood incident FLD-2024-001 in Rohtak', ip_address: '192.168.1.101', created_at: daysAgo(3) },
      { id: 3, user_name: 'Priya Sharma', action: 'incident_verified', entity_type: 'incident', entity_id: 1, details: 'Verified incident FLD-2024-001', ip_address: '192.168.1.100', created_at: daysAgo(3) },
      { id: 4, user_name: 'Priya Sharma', action: 'team_assigned', entity_type: 'response_team', entity_id: 1, details: 'NDRF Alpha Team assigned to FLD-2024-001', ip_address: '192.168.1.100', created_at: daysAgo(2) },
      { id: 5, user_name: 'Priya Sharma', action: 'alert_created', entity_type: 'alert', entity_id: 1, details: 'Flood warning alert created for Rohtak District', ip_address: '192.168.1.100', created_at: daysAgo(3) },
      { id: 6, user_name: 'Vikram Singh', action: 'field_report_created', entity_type: 'field_report', entity_id: 1, details: 'Situation update submitted for FLD-2024-001', ip_address: '10.0.0.50', created_at: daysAgo(2) },
    ],

    notifications: [
      { id: 1, category: 'critical', title: 'Critical Incident: Severe Flooding in Rohtak', message: 'A critical flood incident reported in Rohtak with 45,000 affected.', is_read: true, created_at: daysAgo(3) },
      { id: 2, category: 'high', title: 'New Resource Request: Rescue Boats', message: '5 rescue boats requested for Incident FLD-2024-001 with critical urgency.', is_read: true, created_at: daysAgo(2) },
      { id: 3, category: 'critical', title: 'Industrial Fire at Panipat', message: 'Critical fire incident reported at Panipat Refinery Complex. 3 casualties, 28 injured.', is_read: false, created_at: hoursAgo(18) },
      { id: 4, category: 'critical', title: 'Building Collapse in Faridabad', message: 'Critical: Multi-storey building collapsed in Sector 37. 7 casualties, 15 missing.', is_read: false, created_at: hoursAgo(8) },
    ],
  };
}

export function getStoredData() {
  const existing = localStorage.getItem('dmecs_mock_db');
  if (existing) {
    try {
      return JSON.parse(existing);
    } catch (e) {
      console.error(e);
    }
  }
  const init = getInitialData();
  localStorage.setItem('dmecs_mock_db', JSON.stringify(init));
  return init;
}

export function saveStoredData(data) {
  localStorage.setItem('dmecs_mock_db', JSON.stringify(data));
}
