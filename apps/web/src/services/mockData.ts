export const KPIS = {
  totalTrainings: 124,
  totalTrainingsTrend: "+12%",
  totalParticipants: 8420,
  totalParticipantsTrend: "+8%",
  districtsCovered: 31,
  districtsCoveredTrend: "+2",
  averageAttendance: 91,
  averageAttendanceTrend: "+1%",
  impactImprovement: 29,
  impactImprovementTrend: "+3%",
  activeOrganizations: 42,
  activeOrganizationsTrend: "+5",
};

export const TRAINING_ACTIVITY = [
  { month: "Jan", trainings: 12, participants: 450 },
  { month: "Feb", trainings: 15, participants: 620 },
  { month: "Mar", trainings: 18, participants: 750 },
  { month: "Apr", trainings: 14, participants: 580 },
  { month: "May", trainings: 22, participants: 1100 },
  { month: "Jun", trainings: 25, participants: 1350 },
  { month: "Jul", trainings: 18, participants: 890 },
  { month: "Aug", trainings: 20, participants: 1050 },
  { month: "Sep", trainings: 24, participants: 1240 },
];

export const RECENT_TRAININGS = [
  { id: "1", title: "Flood Preparedness Training", district: "Ludhiana", date: "14 Sep 2026", participants: 45, attendance: 93, status: "Completed" },
  { id: "2", title: "Fire Safety Awareness", district: "Patiala", date: "12 Sep 2026", participants: 38, attendance: 87, status: "Completed" },
  { id: "3", title: "Community Preparedness", district: "Amritsar", date: "10 Sep 2026", participants: 52, attendance: 90, status: "Completed" },
  { id: "4", title: "Mock Drill Exercise", district: "Mohali", date: "08 Sep 2026", participants: 60, attendance: 95, status: "Completed" },
  { id: "5", title: "First Aid Training", district: "Jalandhar", date: "05 Sep 2026", participants: 41, attendance: 78, status: "In Progress" },
];

export const RECENT_NOTIFICATIONS = [
  { id: "n1", title: "New training added", description: "Flood Preparedness Training in Ludhiana", time: "2 hours ago", type: "success" },
  { id: "n2", title: "Low attendance alert", description: "Fire Safety Training in Bathinda", time: "5 hours ago", type: "warning" },
  { id: "n3", title: "Training submitted", description: "Mock Drill - Patiala submitted by ATI", time: "1 day ago", type: "info" },
  { id: "n4", title: "Upcoming training", description: "Earthquake Preparedness Tomorrow, 10:00 AM", time: "1 day ago", type: "info" },
  { id: "n5", title: "Report generated", description: "Monthly Training Report is ready", time: "2 days ago", type: "report" },
];

export const THEMATIC_COVERAGE = [
  { name: "First Aid", value: 35, color: "#3b82f6" },
  { name: "Fire Safety", value: 25, color: "#f97316" },
  { name: "Earthquake", value: 15, color: "#8b5cf6" },
  { name: "Flood", value: 15, color: "#06b6d4" },
  { name: "Mock Drill", value: 10, color: "#10b981" },
];

export const DISTRICT_WISE = [
  { district: "Ludhiana", trainings: 20, participants: 1240 },
  { district: "Amritsar", trainings: 16, participants: 1080 },
  { district: "Patiala", trainings: 14, participants: 980 },
  { district: "Mohali", trainings: 12, participants: 820 },
  { district: "Jalandhar", trainings: 10, participants: 640 },
  { district: "Bathinda", trainings: 8, participants: 510 },
];

export const MAP_LOCATIONS = [
  { id: "1", title: "First Aid Training", district: "Patiala", lat: 30.3398, lng: 76.3869, participants: 45, attendance: 93, date: "14 Sep 2026", organizer: "SDMA", status: "Completed" },
  { id: "2", title: "Flood Preparedness", district: "Ludhiana", lat: 30.9010, lng: 75.8573, participants: 60, attendance: 95, date: "15 Sep 2026", organizer: "NGO", status: "In Progress" },
  { id: "3", title: "Fire Safety", district: "Amritsar", lat: 31.6340, lng: 74.8723, participants: 38, attendance: 87, date: "16 Sep 2026", organizer: "ATI", status: "Upcoming" },
];
