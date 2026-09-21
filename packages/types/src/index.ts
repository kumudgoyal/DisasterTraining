export type Role = 'SUPER_ADMIN' | 'NDMA_ADMIN' | 'SDMA' | 'ATI' | 'NGO' | 'TRAINER' | 'REVIEWER' | 'DATA_ENTRY_OPERATOR' | 'NDMA_VIEWER';
export type OrgType = 'GOVERNMENT' | 'NGO' | 'PRIVATE' | 'ACADEMIC' | 'OTHER';
export type TrainingStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertStatus = 'OPEN' | 'RESOLVED';
export type NotificationType = 'INFO' | 'WARNING' | 'ALERT' | 'REPORT';
export type ReportType = 'SUMMARY' | 'COVERAGE' | 'ATTENDANCE' | 'IMPACT';
export type ReportFormat = 'PDF' | 'EXCEL' | 'CSV';
export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';

// API response types
export interface ApiResponse<T> { success: boolean; data?: T; error?: ApiError; }
export interface ApiError { code: string; message: string; details?: Record<string, string[]>; }
export interface PaginatedResponse<T> { data: T[]; pagination: { page: number; limit: number; total: number; totalPages: number; }; }
export interface PaginationParams { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc'; }

// Auth types
export interface LoginRequest { email: string; password: string; }
export interface LoginResponse { user: UserSummary; accessToken: string; refreshToken: string; }
export interface RegisterRequest { name: string; email: string; password: string; phone?: string; role: Role; orgId?: string; }
export interface TokenPayload { userId: string; email: string; role: Role; orgId?: string; }
export interface ChangePasswordRequest { currentPassword: string; newPassword: string; }

// User types
export interface UserSummary { id: string; name: string; email: string; role: Role; orgId?: string; organizationName?: string; isActive: boolean; }
export interface UserDetail extends UserSummary { phone?: string; lastLogin?: string; createdAt: string; updatedAt: string; }
export interface CreateUserRequest { name: string; email: string; password: string; phone?: string; role: Role; orgId?: string; }
export interface UpdateUserRequest { name?: string; phone?: string; role?: Role; orgId?: string; isActive?: boolean; }
export interface UserFilters extends PaginationParams { role?: Role; orgId?: string; isActive?: boolean; search?: string; }

// Organization types
export interface OrganizationSummary { id: string; name: string; type: OrgType; state?: string; district?: string; isActive: boolean; }
export interface OrganizationDetail extends OrganizationSummary { contactEmail?: string; contactPhone?: string; createdAt: string; userCount?: number; trainingCount?: number; }
export interface CreateOrganizationRequest { name: string; type: OrgType; state?: string; district?: string; contactEmail?: string; contactPhone?: string; }
export interface UpdateOrganizationRequest { name?: string; type?: OrgType; state?: string; district?: string; contactEmail?: string; contactPhone?: string; isActive?: boolean; }
export interface OrganizationFilters extends PaginationParams { type?: OrgType; state?: string; search?: string; isActive?: boolean; }

// Training types
export interface TrainingSummary { id: string; title: string; status: TrainingStatus; typeName: string; themeName: string; organizationName: string; stateName: string; districtName: string; startDate: string; endDate: string; participantCount: number; }
export interface TrainingDetail extends TrainingSummary { description?: string; typeId: number; themeId: number; orgId: string; createdBy: string; creatorName: string; trainerName?: string; venue?: string; address?: string; latitude?: number; longitude?: number; capacity: number; objectives?: string; createdAt: string; updatedAt: string; stateId: number; districtId: number; sessions: SessionSummary[]; participants: ParticipantSummary[]; }
export interface CreateTrainingRequest { title: string; description?: string; typeId: number; themeId: number; orgId: string; trainerName?: string; startDate: string; endDate: string; venue?: string; stateId: number; districtId: number; address?: string; latitude?: number; longitude?: number; capacity: number; objectives?: string; }
export interface UpdateTrainingRequest extends Partial<CreateTrainingRequest> {}
export interface TrainingFilters extends PaginationParams { status?: TrainingStatus; typeId?: number; themeId?: number; orgId?: string; stateId?: number; districtId?: number; startDateFrom?: string; startDateTo?: string; search?: string; }

// Session types
export interface SessionSummary { id: string; trainingId: string; title: string; date: string; startTime: string; endTime: string; venue?: string; }
export interface CreateSessionRequest { title: string; date: string; startTime: string; endTime: string; venue?: string; }

// Participant types
export interface ParticipantSummary { id: string; name: string; email?: string; phone?: string; gender?: Gender; age?: number; designation?: string; organizationName?: string; }
export interface CreateParticipantRequest { name: string; email?: string; phone?: string; gender?: Gender; age?: number; designation?: string; orgId?: string; stateId?: number; districtId?: number; }
export interface ParticipantFilters extends PaginationParams { search?: string; gender?: Gender; stateId?: number; districtId?: number; }

// Attendance types
export interface AttendanceRecord { id: string; participantId: string; participantName: string; status: AttendanceStatus; remarks?: string; }
export interface RecordAttendanceRequest { participantId: string; status: AttendanceStatus; remarks?: string; }
export interface AttendanceSummary { trainingId: string; totalSessions: number; totalParticipants: number; averageAttendance: number; sessionSummaries: { date: string; present: number; absent: number; late: number; }[]; }

// Assessment types
export interface AssessmentScores { knowledgeScore: number; preparednessScore: number; confidenceScore: number; overallScore: number; }
export interface CreateAssessmentRequest extends AssessmentScores { participantId: string; feedback?: string; }
export interface ImpactAssessmentSummary { trainingId: string; avgKnowledgeImprovement: number; avgPreparednessImprovement: number; avgConfidenceImprovement: number; avgOverallImprovement: number; impactScore: number; participantsAssessed: number; }

// Feedback types
export interface FeedbackSummary { id: string; participantName: string; overallRating: number; contentRating: number; trainerRating: number; venueRating: number; comments?: string; createdAt: string; }
export interface CreateFeedbackRequest { participantId: string; overallRating: number; contentRating: number; trainerRating: number; venueRating: number; comments?: string; suggestions?: string; }

// Analytics types
export interface DashboardStats { totalTrainings: number; completedTrainings: number; upcomingTrainings: number; inProgressTrainings: number; totalParticipants: number; activeOrganizations: number; totalTrainers: number; pendingApprovals: number; districtsCovered: number; averageAttendance: number; }
export interface TrainingTrend { month: string; count: number; participants: number; }
export interface CategoryDistribution { name: string; count: number; }
export interface StateCoverage { stateId: number; stateName: string; trainingCount: number; participantCount: number; districtsCovered: number; }
export interface DistrictCoverage { districtId: number; districtName: string; stateName: string; trainingCount: number; participantCount: number; }
export interface ImpactMetrics { averagePreScore: number; averagePostScore: number; averageImprovement: number; totalAssessed: number; certificatesIssued: number; averageFeedbackRating: number; }
export interface AnalyticsFilters { startDate?: string; endDate?: string; stateId?: number; districtId?: number; orgId?: string; typeId?: number; themeId?: number; }

// GIS types
export interface MapMarker { id: string; title: string; latitude: number; longitude: number; status: TrainingStatus; typeName: string; themeName: string; organizationName: string; stateName: string; districtName: string; startDate: string; endDate: string; participantCount: number; }
export interface HeatmapPoint { latitude: number; longitude: number; intensity: number; }
export interface GeoFilter { stateId?: number; districtId?: number; status?: TrainingStatus; typeId?: number; orgId?: string; startDate?: string; endDate?: string; }
export interface NearbyQuery { latitude: number; longitude: number; radiusKm: number; }

// Notification types
export interface NotificationItem { id: string; title: string; message: string; type: NotificationType; refId?: string; refType?: string; isRead: boolean; createdAt: string; }
export interface NotificationFilters extends PaginationParams { isRead?: boolean; type?: NotificationType; }

// Alert types
export interface AlertItem { id: string; severity: Severity; message: string; status: AlertStatus; trainingId?: string; trainingTitle?: string; districtName?: string; resolvedBy?: string; resolvedAt?: string; createdAt: string; }
export interface AlertSummary { total: number; open: number; resolved: number; bySeverity: Record<Severity, number>; }
export interface AlertFilters extends PaginationParams { severity?: Severity; status?: AlertStatus; }

// Report types
export interface ReportItem { id: string; title: string; reportType: ReportType; format: ReportFormat; generatedBy: string; generatorName: string; generatedAt: string; filePath: string; }
export interface GenerateReportRequest { title: string; reportType: ReportType; format: ReportFormat; filters?: AnalyticsFilters; }
export interface ReportFilters extends PaginationParams { reportType?: ReportType; }

// Audit log types
export interface AuditLogItem { id: string; userId?: string; userName?: string; role?: string; action: AuditAction; module: string; recordId?: string; ipAddress?: string; createdAt: string; }
export interface AuditLogFilters extends PaginationParams { userId?: string; action?: AuditAction; module?: string; startDate?: string; endDate?: string; }

// Reference data types
export interface StateRef { id: number; name: string; code: string; }
export interface DistrictRef { id: number; name: string; stateId: number; }
export interface TrainingTypeRef { id: number; name: string; description?: string; }
export interface TrainingThemeRef { id: number; name: string; colorCode?: string; }

// Integration types
export interface IntegrationSourceItem { id: string; name: string; type: string; apiUrl: string; isActive: boolean; lastSyncAt?: string; }
export interface IntegrationSyncLog { id: string; sourceId: string; status: string; recordsProcessed: number; recordsFailed: number; errorLog?: string; startedAt: string; completedAt?: string; }
export interface ApiKeyItem { id: string; name: string; maskedKey: string; isActive: boolean; lastUsedAt?: string; expiresAt?: string; createdAt: string; }
