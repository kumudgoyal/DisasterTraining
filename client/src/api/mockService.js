import { getStoredData, saveStoredData } from './mockData';

// Dispatch event for UI live ticker simulation
function emitMockSocketEvent(type, payload) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('dmecs:socket_event', {
        detail: { type, payload },
      })
    );
  }
}

export function getCurrentUser() {
  try {
    const saved = localStorage.getItem('dmecs_current_user');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    // fallback
  }
  const db = getStoredData();
  return db.users[0]; // Super Admin Dr. Rajesh Kumar
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('dmecs_current_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('dmecs_current_user');
  }
}

export async function handleMockRequest(config) {
  // Simulate minor network latency for realistic feel
  await new Promise((r) => setTimeout(r, 60));

  const db = getStoredData();
  const method = (config.method || 'get').toLowerCase();
  let url = config.url || '';
  if (url.startsWith('/api')) {
    url = url.slice(4);
  }
  if (!url.startsWith('/')) {
    url = '/' + url;
  }

  // Parse path and query
  const [path, queryString] = url.split('?');
  const query = new URLSearchParams(queryString || '');
  const data = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});

  // ---------------- AUTH ----------------
  if (path === '/auth/login' && method === 'post') {
    const { email } = data;
    let user = db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!user) {
      // Auto-fallback to Super Admin or create temporary session user
      user = db.users[0];
    }
    const token = 'mock-jwt-token-' + user.id + '-' + Date.now();
    setCurrentUser(user);
    return {
      success: true,
      data: {
        token,
        user,
      },
    };
  }

  if (path === '/auth/register' && method === 'post') {
    const newUser = {
      id: db.users.length + 1,
      email: data.email,
      full_name: data.full_name || 'Volunteer',
      role: 'Volunteer',
      role_id: 7,
      organization_name: data.organization || 'Community Volunteer',
      district: data.district || 'Rohtak',
      state: 'Haryana',
      is_active: true,
    };
    db.users.push(newUser);
    saveStoredData(db);
    setCurrentUser(newUser);
    return {
      success: true,
      data: {
        token: 'mock-jwt-token-' + newUser.id,
        user: newUser,
      },
    };
  }

  if (path === '/auth/me' && method === 'get') {
    const user = getCurrentUser();
    return {
      success: true,
      data: user,
    };
  }

  // ---------------- DASHBOARD ----------------
  if (path === '/dashboard/kpis' && method === 'get') {
    const activeIncidents = db.incidents.filter((i) => !['resolved', 'closed'].includes(i.status));
    const criticalIncidents = activeIncidents.filter((i) => i.severity === 'critical');
    const totalAffected = activeIncidents.reduce((s, i) => s + (Number(i.estimated_affected) || 0), 0);
    const totalEvacuated = activeIncidents.reduce((s, i) => s + (Number(i.evacuated) || 0), 0);
    const totalCasualties = activeIncidents.reduce((s, i) => s + (Number(i.casualties) || 0), 0);
    const totalInjured = activeIncidents.reduce((s, i) => s + (Number(i.injured) || 0), 0);
    const totalMissing = activeIncidents.reduce((s, i) => s + (Number(i.missing_persons) || 0), 0);
    const deployedTeams = db.response_teams.filter((t) => t.status === 'deployed');
    const availableRes = db.resources.reduce((s, r) => s + (Number(r.available_quantity) || 0), 0);
    const pendingReqs = db.resource_requests.filter((r) => r.status === 'pending');
    const totalShelterCap = db.shelters.reduce((s, sh) => s + (Number(sh.capacity) || 0), 0);
    const totalShelterOcc = db.shelters.reduce((s, sh) => s + (Number(sh.current_occupancy) || 0), 0);
    const activeAlerts = db.alerts.filter((a) => a.status === 'active');
    const trainedPeople = db.training_programs.reduce((s, t) => s + (Number(t.participants_count) || 0), 0);
    const totalLoss = db.damage_reports.reduce((s, d) => s + (Number(d.estimated_loss) || 0), 0);

    return {
      success: true,
      data: {
        active_incidents: activeIncidents.length,
        critical_incidents: criticalIncidents.length,
        total_affected: totalAffected,
        total_evacuated: totalEvacuated,
        total_casualties: totalCasualties,
        total_injured: totalInjured,
        total_missing: totalMissing,
        active_response_teams: deployedTeams.length,
        total_response_teams: db.response_teams.length,
        available_resources: availableRes,
        pending_requests: pendingReqs.length,
        active_shelters: db.shelters.filter((s) => s.status === 'active').length,
        shelter_capacity: totalShelterCap,
        shelter_occupancy: totalShelterOcc,
        shelter_occupancy_pct: totalShelterCap > 0 ? Math.round((totalShelterOcc / totalShelterCap) * 100) : 0,
        active_alerts: activeAlerts.length,
        trained_people: trainedPeople,
        total_estimated_loss: totalLoss,
      },
    };
  }

  if (path === '/dashboard/activity-feed' && method === 'get') {
    const feed = [
      ...db.incident_updates.map((u) => ({
        id: `u-${u.id}`,
        type: 'incident_update',
        title: `Incident Update #${u.incident_id}`,
        description: u.update_text,
        sub_type: u.update_type,
        severity: 'high',
        author: u.user_name || 'EOC Official',
        timestamp: u.created_at,
      })),
      ...db.field_reports.map((r) => ({
        id: `r-${r.id}`,
        type: 'field_report',
        title: `Field Report: ${r.report_type?.replace('_', ' ')}`,
        description: `${r.location_name ? '[' + r.location_name + '] ' : ''}${r.description}`,
        sub_type: r.report_type,
        severity: r.severity || 'moderate',
        author: r.submitted_by_name || 'Field Officer',
        timestamp: r.created_at,
      })),
      ...db.alerts.map((a) => ({
        id: `a-${a.id}`,
        type: 'alert',
        title: `Alert: ${a.title}`,
        description: a.message,
        sub_type: a.alert_type,
        severity: a.severity || 'critical',
        author: a.issuing_authority || 'SDMA',
        timestamp: a.created_at,
      })),
    ];
    feed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return {
      success: true,
      data: feed.slice(0, 30),
    };
  }

  // ---------------- INCIDENTS ----------------
  if (path === '/incidents' && method === 'get') {
    let list = [...db.incidents];
    const status = query.get('status');
    const severity = query.get('severity');
    const type = query.get('type') || query.get('disaster_type');
    const search = query.get('search');
    const limit = query.get('limit');

    if (status && status !== 'all') list = list.filter((i) => i.status === status);
    if (severity && severity !== 'all') list = list.filter((i) => i.severity === severity);
    if (type && type !== 'all') list = list.filter((i) => i.disaster_type?.toLowerCase() === type.toLowerCase());
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((i) => i.title.toLowerCase().includes(q) || i.location_name?.toLowerCase().includes(q) || i.incident_id.toLowerCase().includes(q));
    }
    list.sort((a, b) => b.id - a.id);
    if (limit) list = list.slice(0, parseInt(limit));
    return {
      success: true,
      data: {
        incidents: list,
        total: list.length,
      },
    };
  }

  if (path === '/incidents' && method === 'post') {
    const user = getCurrentUser();
    const typeMap = {
      1: { name: 'Flood', icon: '🌊', color: '#2563EB', code: 'FLD' },
      2: { name: 'Earthquake', icon: '🏚️', color: '#7C3AED', code: 'EQ' },
      3: { name: 'Cyclone', icon: '🌀', color: '#0284C7', code: 'CYC' },
      4: { name: 'Landslide', icon: '⛰️', color: '#92400E', code: 'LND' },
      5: { name: 'Fire', icon: '🔥', color: '#DC2626', code: 'FIR' },
      6: { name: 'Heatwave', icon: '☀️', color: '#EA580C', code: 'HW' },
      7: { name: 'Cloudburst', icon: '⛈️', color: '#4338CA', code: 'CB' },
      8: { name: 'Industrial Accident', icon: '🏭', color: '#B45309', code: 'IND' },
      9: { name: 'Building Collapse', icon: '🏗️', color: '#78350F', code: 'BLD' },
      10: { name: 'Epidemic', icon: '☣️', color: '#047857', code: 'EPI' },
    };
    const tInfo = typeMap[data.disaster_type_id] || { name: 'General Emergency', icon: '⚠️', color: '#DC2626', code: 'INC' };
    const newId = db.incidents.length + 1;
    const year = new Date().getFullYear();
    const incident_id = `${tInfo.code}-${year}-${String(100 + newId).padStart(3, '0')}`;

    const newIncident = {
      id: newId,
      incident_id,
      disaster_type_id: data.disaster_type_id || 1,
      disaster_type: tInfo.name,
      disaster_icon: tInfo.icon,
      disaster_color: tInfo.color,
      severity: data.severity || 'high',
      status: 'reported',
      title: data.title || `${tInfo.name} Incident`,
      description: data.description || '',
      latitude: parseFloat(data.latitude) || 28.8955,
      longitude: parseFloat(data.longitude) || 76.5796,
      location_name: data.location_name || 'Haryana',
      affected_districts: data.affected_districts || 'Rohtak',
      state: 'Haryana',
      estimated_affected: parseInt(data.estimated_affected) || 0,
      casualties: parseInt(data.casualties) || 0,
      missing_persons: parseInt(data.missing_persons) || 0,
      injured: parseInt(data.injured) || 0,
      evacuated: parseInt(data.evacuated) || 0,
      reporting_org: user.organization_name || 'State EOC',
      reported_by_name: user.full_name || 'EOC Official',
      verification_status: 'reported',
      response_status: 'pending',
      detected_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.incidents.unshift(newIncident);

    // Initial update
    db.incident_updates.unshift({
      id: db.incident_updates.length + 1,
      incident_id: newId,
      user_name: user.full_name || 'EOC Official',
      update_text: `Incident ${incident_id} reported: ${newIncident.title}`,
      update_type: 'info',
      created_at: new Date().toISOString(),
    });

    saveStoredData(db);
    emitMockSocketEvent('incident:created', newIncident);
    return {
      success: true,
      data: newIncident,
    };
  }

  // Match /incidents/:id or sub-routes
  const incidentMatch = path.match(/^\/incidents\/(\d+)(.*)$/);
  if (incidentMatch) {
    const incId = parseInt(incidentMatch[1]);
    const subRoute = incidentMatch[2];
    const incident = db.incidents.find((i) => i.id === incId);

    if (!incident) {
      return { success: false, error: 'Incident not found' };
    }

    if (!subRoute && method === 'get') {
      const updates = db.incident_updates.filter((u) => u.incident_id === incId).sort((a, b) => b.id - a.id);
      const assigned_teams = db.response_teams.filter((t) => t.assigned_incident_id === incId);
      const requested_resources = db.resource_requests.filter((r) => r.incident_id === incId);
      return {
        success: true,
        data: {
          incident,
          updates,
          assigned_teams,
          requested_resources,
        },
      };
    }

    if (!subRoute && method === 'put') {
      Object.assign(incident, data, { updated_at: new Date().toISOString() });
      saveStoredData(db);
      emitMockSocketEvent('incident:updated', incident);
      return { success: true, data: incident };
    }

    if (subRoute === '/verify' && method === 'put') {
      incident.verification_status = data.verification_status || 'verified';
      incident.status = 'verified';
      incident.updated_at = new Date().toISOString();
      db.incident_updates.unshift({
        id: db.incident_updates.length + 1,
        incident_id: incId,
        user_name: getCurrentUser().full_name,
        update_text: `Incident verification updated to: ${incident.verification_status}`,
        update_type: 'status_change',
        created_at: new Date().toISOString(),
      });
      saveStoredData(db);
      emitMockSocketEvent('incident:updated', incident);
      return { success: true, data: incident };
    }

    if (subRoute === '/updates' && method === 'post') {
      const update = {
        id: db.incident_updates.length + 1,
        incident_id: incId,
        user_name: getCurrentUser().full_name,
        update_text: data.update_text || data.text,
        update_type: data.update_type || 'info',
        created_at: new Date().toISOString(),
      };
      db.incident_updates.unshift(update);
      incident.updated_at = new Date().toISOString();
      saveStoredData(db);
      emitMockSocketEvent('incident:updated', incident);
      return { success: true, data: update };
    }

    if (subRoute === '/assign-team' && method === 'put') {
      const team = db.response_teams.find((t) => t.id === parseInt(data.team_id));
      if (team) {
        team.status = 'deployed';
        team.assigned_incident_id = incId;
      }
      incident.response_status = 'teams_assigned';
      incident.status = 'responding';
      incident.updated_at = new Date().toISOString();
      db.incident_updates.unshift({
        id: db.incident_updates.length + 1,
        incident_id: incId,
        user_name: getCurrentUser().full_name,
        update_text: `Response team "${team?.name || 'Emergency Unit'}" deployed to scene.`,
        update_type: 'team',
        created_at: new Date().toISOString(),
      });
      saveStoredData(db);
      emitMockSocketEvent('team:assigned', { team, incident });
      return { success: true, data: incident };
    }
  }

  // ---------------- GIS ----------------
  if (path === '/gis/layers' && method === 'get') {
    return {
      success: true,
      data: {
        incidents: db.incidents,
        shelters: db.shelters,
        resources: db.resources,
        teams: db.response_teams,
        alerts: db.alerts.filter((a) => a.status === 'active'),
        damage_reports: db.damage_reports,
        trainings: db.training_programs,
      },
    };
  }

  // ---------------- SHELTERS ----------------
  if (path === '/shelters' && method === 'get') {
    let list = [...db.shelters];
    const district = query.get('district');
    const status = query.get('status');
    const search = query.get('search');
    if (district && district !== 'all') list = list.filter((s) => s.district?.toLowerCase() === district.toLowerCase());
    if (status && status !== 'all') list = list.filter((s) => s.status === status);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.district?.toLowerCase().includes(q));
    }
    return { success: true, data: list };
  }

  if (path === '/shelters' && method === 'post') {
    const newShelter = {
      id: db.shelters.length + 1,
      name: data.name,
      location_name: data.location_name,
      district: data.district || 'Rohtak',
      state: 'Haryana',
      latitude: parseFloat(data.latitude) || 28.89,
      longitude: parseFloat(data.longitude) || 76.58,
      capacity: parseInt(data.capacity) || 500,
      current_occupancy: parseInt(data.current_occupancy) || 0,
      food_available: Boolean(data.food_available),
      water_available: Boolean(data.water_available),
      medical_facility: Boolean(data.medical_facility),
      electricity: Boolean(data.electricity),
      toilets: parseInt(data.toilets) || 10,
      contact_person: data.contact_person || 'Care Officer',
      contact_phone: data.contact_phone || '9876543210',
      status: 'active',
    };
    db.shelters.unshift(newShelter);
    saveStoredData(db);
    emitMockSocketEvent('shelter:updated', newShelter);
    return { success: true, data: newShelter };
  }

  const shelterOccMatch = path.match(/^\/shelters\/(\d+)\/occupancy$/);
  if (shelterOccMatch && method === 'put') {
    const shId = parseInt(shelterOccMatch[1]);
    const shelter = db.shelters.find((s) => s.id === shId);
    if (shelter) {
      shelter.current_occupancy = parseInt(data.current_occupancy) || 0;
      saveStoredData(db);
      emitMockSocketEvent('shelter:updated', shelter);
      return { success: true, data: shelter };
    }
    return { success: false, error: 'Shelter not found' };
  }

  // ---------------- RESOURCES ----------------
  if (path === '/resources' && method === 'get') {
    let list = [...db.resources];
    const type = query.get('type');
    const status = query.get('status');
    const search = query.get('search');
    if (type && type !== 'all') list = list.filter((r) => r.type === type);
    if (status && status !== 'all') list = list.filter((r) => r.status === status);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q) || r.location?.toLowerCase().includes(q));
    }
    return { success: true, data: list };
  }

  if (path === '/resources' && method === 'post') {
    const newRes = {
      id: db.resources.length + 1,
      name: data.name,
      type: data.type || 'equipment',
      quantity: parseInt(data.quantity) || 1,
      available_quantity: parseInt(data.quantity) || 1,
      location: data.location || 'Central Depot',
      latitude: parseFloat(data.latitude) || 28.89,
      longitude: parseFloat(data.longitude) || 76.58,
      status: 'available',
      organization_name: data.organization_name || getCurrentUser().organization_name,
    };
    db.resources.unshift(newRes);
    saveStoredData(db);
    return { success: true, data: newRes };
  }

  if ((path === '/resources/requests/all' || path === '/resources/requests') && method === 'get') {
    return { success: true, data: db.resource_requests };
  }

  if (path === '/resources/requests' && method === 'post') {
    const user = getCurrentUser();
    const inc = db.incidents.find((i) => i.id === parseInt(data.incident_id));
    const newReq = {
      id: db.resource_requests.length + 1,
      incident_id: data.incident_id,
      incident_code: inc?.incident_id || 'INC',
      incident_title: inc?.title || 'Emergency',
      requested_by_name: user.full_name,
      resource_type: data.resource_type,
      quantity: parseInt(data.quantity) || 1,
      urgency: data.urgency || 'high',
      description: data.description || '',
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    db.resource_requests.unshift(newReq);
    saveStoredData(db);
    return { success: true, data: newReq };
  }

  const reqAssignMatch = path.match(/^\/resources\/requests\/(\d+)\/assign$/);
  if (reqAssignMatch && method === 'put') {
    const rId = parseInt(reqAssignMatch[1]);
    const req = db.resource_requests.find((r) => r.id === rId);
    if (req) {
      req.status = 'assigned';
      const resource = db.resources.find((r) => r.id === parseInt(data.resource_id));
      if (resource) {
        req.assigned_resource_name = resource.name;
        resource.status = 'deployed';
        resource.available_quantity = Math.max(0, resource.available_quantity - req.quantity);
        resource.assigned_incident_code = req.incident_code;
        resource.assigned_incident_title = req.incident_title;
      }
      saveStoredData(db);
      return { success: true, data: req };
    }
    return { success: false, error: 'Request not found' };
  }

  // ---------------- RESPONSE TEAMS ----------------
  if (path === '/response-teams' && method === 'get') {
    let list = [...db.response_teams];
    const status = query.get('status');
    if (status && status !== 'all') list = list.filter((t) => t.status === status);
    return { success: true, data: list };
  }

  if (path === '/response-teams' && method === 'post') {
    const newTeam = {
      id: db.response_teams.length + 1,
      name: data.name,
      type: data.type || 'ndrf',
      organization_name: data.organization_name || 'State Disaster Response',
      members_count: parseInt(data.members_count) || 10,
      specialization: data.specialization || 'Rapid Response',
      status: 'available',
      current_location: data.current_location || 'Base Station',
      latitude: parseFloat(data.latitude) || 28.89,
      longitude: parseFloat(data.longitude) || 76.58,
      contact_person: data.contact_person || 'Commander',
      contact_phone: data.contact_phone || '9876543210',
    };
    db.response_teams.unshift(newTeam);
    saveStoredData(db);
    return { success: true, data: newTeam };
  }

  // ---------------- FIELD REPORTS ----------------
  if (path === '/field-reports' && method === 'get') {
    let list = [...db.field_reports];
    const status = query.get('verification_status');
    if (status && status !== 'all') list = list.filter((r) => r.verification_status === status);
    return { success: true, data: list };
  }

  if (path === '/field-reports' && method === 'post') {
    const user = getCurrentUser();
    const newId = db.field_reports.length + 1;
    const report_id = `FR-2024-${String(100 + newId).padStart(3, '0')}`;
    const newReport = {
      id: newId,
      report_id,
      incident_id: data.incident_id ? parseInt(data.incident_id) : null,
      submitted_by_name: user?.full_name || data.reporter_name || 'Field Responder',
      report_type: data.report_type || 'situation_update',
      category: data.category || 'General',
      severity: data.severity || 'moderate',
      description: data.description || '',
      latitude: parseFloat(data.latitude) || 28.89,
      longitude: parseFloat(data.longitude) || 76.58,
      location_name: data.location_name || 'Field Location',
      district: data.district || 'Rohtak',
      verification_status: 'submitted',
      created_at: new Date().toISOString(),
    };
    db.field_reports.unshift(newReport);
    saveStoredData(db);
    emitMockSocketEvent('field_report:created', newReport);
    return { success: true, data: newReport };
  }

  // ---------------- DAMAGE REPORTS ----------------
  if (path === '/damage-reports' && method === 'get') {
    let list = [...db.damage_reports];
    const type = query.get('infrastructure_type');
    const status = query.get('status');
    if (type && type !== 'all') list = list.filter((d) => d.infrastructure_type === type);
    if (status && status !== 'all') list = list.filter((d) => d.status === status);
    return { success: true, data: list };
  }

  if (path === '/damage-reports' && method === 'post') {
    const user = getCurrentUser();
    const newReport = {
      id: db.damage_reports.length + 1,
      incident_id: data.incident_id ? parseInt(data.incident_id) : 1,
      incident_code: 'FLD-2024-001',
      reported_by_name: user.full_name,
      infrastructure_type: data.infrastructure_type || 'road',
      damage_level: data.damage_level || 'moderate',
      description: data.description || '',
      location_name: data.location_name || 'Damaged Site',
      district: data.district || 'Rohtak',
      affected_families: parseInt(data.affected_families) || 0,
      estimated_loss: parseFloat(data.estimated_loss) || 0,
      status: 'reported',
      created_at: new Date().toISOString(),
    };
    db.damage_reports.unshift(newReport);
    saveStoredData(db);
    return { success: true, data: newReport };
  }

  const damageStatusMatch = path.match(/^\/damage-reports\/(\d+)\/status$/);
  if (damageStatusMatch && method === 'put') {
    const dId = parseInt(damageStatusMatch[1]);
    const report = db.damage_reports.find((d) => d.id === dId);
    if (report) {
      report.status = data.status || report.status;
      saveStoredData(db);
      return { success: true, data: report };
    }
    return { success: false, error: 'Report not found' };
  }

  // ---------------- ALERTS ----------------
  if (path === '/alerts/active' && method === 'get') {
    const active = db.alerts.filter((a) => a.status === 'active');
    return { success: true, data: active };
  }

  if (path === '/alerts' && method === 'get') {
    return { success: true, data: db.alerts };
  }

  if (path === '/alerts' && method === 'post') {
    const user = getCurrentUser();
    const newAlert = {
      id: db.alerts.length + 1,
      alert_type: data.alert_type || 'warning',
      severity: data.severity || 'high',
      title: data.title,
      message: data.message,
      affected_area: data.affected_area || 'Haryana',
      latitude: parseFloat(data.latitude) || 28.8955,
      longitude: parseFloat(data.longitude) || 76.5796,
      radius_km: parseFloat(data.radius_km) || 25,
      issuing_authority: user.organization_name || 'Haryana SDMA',
      status: 'active',
      start_time: data.start_time || new Date().toISOString(),
      expiry_time: data.expiry_time || new Date(Date.now() + 48 * 3600000).toISOString(),
      created_at: new Date().toISOString(),
    };
    db.alerts.unshift(newAlert);
    saveStoredData(db);
    emitMockSocketEvent('alert:created', newAlert);
    return { success: true, data: newAlert };
  }

  const alertCancelMatch = path.match(/^\/alerts\/(\d+)\/cancel$/);
  if (alertCancelMatch && method === 'put') {
    const aId = parseInt(alertCancelMatch[1]);
    const alert = db.alerts.find((a) => a.id === aId);
    if (alert) {
      alert.status = 'cancelled';
      saveStoredData(db);
      return { success: true, data: alert };
    }
    return { success: false, error: 'Alert not found' };
  }

  // ---------------- TRAINING ----------------
  if (path === '/training' && method === 'get') {
    let list = [...db.training_programs];
    const district = query.get('district');
    if (district && district !== 'all') list = list.filter((t) => t.district?.toLowerCase() === district.toLowerCase());
    return { success: true, data: list };
  }

  if (path === '/training/analytics' && method === 'get') {
    const totalPrograms = db.training_programs.length;
    const totalParticipants = db.training_programs.reduce((s, t) => s + (t.participants_count || 0), 0);

    const distMap = {};
    db.training_programs.forEach((t) => {
      const d = t.district || 'Other';
      if (!distMap[d]) distMap[d] = { district: d, programs_count: 0, participants_count: 0 };
      distMap[d].programs_count += 1;
      distMap[d].participants_count += t.participants_count || 0;
    });

    const typeMap = {};
    db.training_programs.forEach((t) => {
      const ty = t.disaster_type_name || 'General';
      if (!typeMap[ty]) typeMap[ty] = { type_name: ty, count: 0, participants: 0 };
      typeMap[ty].count += 1;
      typeMap[ty].participants += t.participants_count || 0;
    });

    const orgMap = {};
    db.training_programs.forEach((t) => {
      const o = t.organization_name || 'State Agency';
      if (!orgMap[o]) orgMap[o] = { org_name: o, count: 0, participants: 0 };
      orgMap[o].count += 1;
      orgMap[o].participants += t.participants_count || 0;
    });

    return {
      success: true,
      data: {
        total_programs: totalPrograms,
        total_participants: totalParticipants,
        by_district: Object.values(distMap),
        by_disaster_type: Object.values(typeMap),
        by_organization: Object.values(orgMap),
      },
    };
  }

  if (path === '/training' && method === 'post') {
    const newProg = {
      id: db.training_programs.length + 1,
      title: data.title,
      organization_name: data.organization_name || getCurrentUser().organization_name,
      trainer_name: data.trainer_name || getCurrentUser().full_name,
      location: data.location || 'District Center',
      latitude: parseFloat(data.latitude) || 28.89,
      longitude: parseFloat(data.longitude) || 76.58,
      district: data.district || 'Rohtak',
      state: 'Haryana',
      disaster_type_name: data.disaster_type_name || 'Flood',
      training_date: data.training_date || new Date().toISOString().slice(0, 10),
      participants_count: parseInt(data.participants_count) || 50,
      participant_categories: data.participant_categories || 'Community members, Volunteers',
      outcome: data.outcome || 'Completed drill and response protocols',
    };
    db.training_programs.unshift(newProg);
    saveStoredData(db);
    return { success: true, data: newProg };
  }

  // ---------------- ORGANIZATIONS ----------------
  if (path === '/organizations' && method === 'get') {
    return { success: true, data: db.organizations };
  }

  // ---------------- NOTIFICATIONS ----------------
  if (path === '/notifications' && method === 'get') {
    return { success: true, data: db.notifications };
  }

  if (path === '/notifications/read-all' && method === 'put') {
    db.notifications.forEach((n) => (n.is_read = true));
    saveStoredData(db);
    return { success: true, message: 'All marked as read' };
  }

  // ---------------- ANALYTICS ----------------
  if (path === '/analytics/incidents' && method === 'get') {
    const byTypeMap = {};
    db.incidents.forEach((i) => {
      const ty = i.disaster_type || 'Unknown';
      if (!byTypeMap[ty]) byTypeMap[ty] = { disaster_type: ty, color: i.disaster_color || '#3b82f6', count: 0 };
      byTypeMap[ty].count += 1;
    });

    const bySevMap = {};
    db.incidents.forEach((i) => {
      const s = i.severity || 'moderate';
      if (!bySevMap[s]) bySevMap[s] = { severity: s, count: 0 };
      bySevMap[s].count += 1;
    });

    const byStatusMap = {};
    db.incidents.forEach((i) => {
      const st = i.status || 'reported';
      if (!byStatusMap[st]) byStatusMap[st] = { status: st, count: 0 };
      byStatusMap[st].count += 1;
    });

    const byDistMap = {};
    db.incidents.forEach((i) => {
      const l = i.location_name || 'Rohtak';
      if (!byDistMap[l]) byDistMap[l] = { location: l, count: 0, affected: 0, casualties: 0 };
      byDistMap[l].count += 1;
      byDistMap[l].affected += i.estimated_affected || 0;
      byDistMap[l].casualties += i.casualties || 0;
    });

    return {
      success: true,
      data: {
        by_type: Object.values(byTypeMap),
        by_severity: Object.values(bySevMap),
        by_status: Object.values(byStatusMap),
        by_district: Object.values(byDistMap),
      },
    };
  }

  if (path === '/analytics/response' && method === 'get') {
    const teamTypeMap = {};
    db.response_teams.forEach((t) => {
      if (!teamTypeMap[t.type]) teamTypeMap[t.type] = { type: t.type, total_teams: 0, total_members: 0 };
      teamTypeMap[t.type].total_teams += 1;
      teamTypeMap[t.type].total_members += t.members_count || 0;
    });

    const teamStatusMap = {};
    db.response_teams.forEach((t) => {
      if (!teamStatusMap[t.status]) teamStatusMap[t.status] = { status: t.status, count: 0 };
      teamStatusMap[t.status].count += 1;
    });

    const resTypeMap = {};
    db.resources.forEach((r) => {
      if (!resTypeMap[r.type]) resTypeMap[r.type] = { type: r.type, total_quantity: 0, available_quantity: 0 };
      resTypeMap[r.type].total_quantity += r.quantity || 0;
      resTypeMap[r.type].available_quantity += r.available_quantity || 0;
    });

    const reqUrgMap = {};
    db.resource_requests.forEach((rq) => {
      const key = `${rq.urgency}_${rq.status}`;
      if (!reqUrgMap[key]) reqUrgMap[key] = { urgency: rq.urgency, status: rq.status, count: 0 };
      reqUrgMap[key].count += 1;
    });

    return {
      success: true,
      data: {
        teams_by_type: Object.values(teamTypeMap),
        teams_by_status: Object.values(teamStatusMap),
        resources_by_type: Object.values(resTypeMap),
        requests_by_urgency: Object.values(reqUrgMap),
      },
    };
  }

  if (path === '/analytics/impact' && method === 'get') {
    const infraMap = {};
    db.damage_reports.forEach((d) => {
      const inf = d.infrastructure_type || 'other';
      if (!infraMap[inf]) infraMap[inf] = { infrastructure_type: inf, count: 0, loss: 0, families: 0 };
      infraMap[inf].count += 1;
      infraMap[inf].loss += d.estimated_loss || 0;
      infraMap[inf].families += d.affected_families || 0;
    });

    const levelMap = {};
    db.damage_reports.forEach((d) => {
      const lvl = d.damage_level || 'minor';
      if (!levelMap[lvl]) levelMap[lvl] = { damage_level: lvl, count: 0 };
      levelMap[lvl].count += 1;
    });

    return {
      success: true,
      data: {
        damage_by_infra: Object.values(infraMap),
        damage_by_level: Object.values(levelMap),
      },
    };
  }

  // ---------------- SITREP ----------------
  if (path === '/reports/sitrep' && method === 'get') {
    const user = getCurrentUser();
    const activeIncidents = db.incidents.filter((i) => !['resolved', 'closed'].includes(i.status));
    const deployedTeams = db.response_teams.filter((t) => t.status === 'deployed');
    const activeShelters = db.shelters.filter((s) => s.status === 'active');
    const activeAlerts = db.alerts.filter((a) => a.status === 'active');

    const infraLossMap = {};
    db.damage_reports.forEach((d) => {
      const k = d.infrastructure_type || 'other';
      if (!infraLossMap[k]) infraLossMap[k] = { infrastructure_type: k, count: 0, loss: 0 };
      infraLossMap[k].count += 1;
      infraLossMap[k].loss += d.estimated_loss || 0;
    });

    return {
      success: true,
      data: {
        generated_at: new Date().toISOString(),
        generated_by: user.full_name,
        issuing_authority: 'State Emergency Operations Centre (SEOC) Haryana',
        overview: {
          active_incidents_count: activeIncidents.length,
          deployed_teams_count: deployedTeams.length,
          active_shelters_count: activeShelters.length,
          active_alerts_count: activeAlerts.length,
          total_evacuated: activeIncidents.reduce((s, i) => s + (i.evacuated || 0), 0),
          total_casualties: activeIncidents.reduce((s, i) => s + (i.casualties || 0), 0),
          total_injured: activeIncidents.reduce((s, i) => s + (i.injured || 0), 0),
          total_affected: activeIncidents.reduce((s, i) => s + (i.estimated_affected || 0), 0),
        },
        incidents: activeIncidents,
        deployed_teams: deployedTeams,
        shelters: activeShelters.map((s) => ({
          ...s,
          occupancy_rate: s.capacity > 0 ? Math.round((s.current_occupancy / s.capacity) * 100) : 0,
        })),
        alerts: activeAlerts,
        damage_summary: Object.values(infraLossMap),
      },
    };
  }

  // ---------------- ADMIN ----------------
  if (path === '/admin/users' && method === 'get') {
    let list = [...db.users];
    const roleId = query.get('role_id');
    const search = query.get('search');
    if (roleId) list = list.filter((u) => u.role_id === parseInt(roleId));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((u) => u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    return { success: true, data: list };
  }

  const userUpdateMatch = path.match(/^\/admin\/users\/(\d+)$/);
  if (userUpdateMatch && method === 'put') {
    const uId = parseInt(userUpdateMatch[1]);
    const u = db.users.find((user) => user.id === uId);
    if (u) {
      Object.assign(u, data);
      saveStoredData(db);
      return { success: true, data: u };
    }
    return { success: false, error: 'User not found' };
  }

  if (path === '/admin/audit-logs' && method === 'get') {
    return { success: true, data: db.audit_logs };
  }

  // Generic fallback
  return {
    success: true,
    data: [],
  };
}
