import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Must contain uppercase').regex(/[a-z]/, 'Must contain lowercase').regex(/[0-9]/, 'Must contain a number'),
  phone: z.string().regex(/^[+]?[0-9]{10,15}$/, 'Invalid phone number').optional().or(z.literal('')),
  role: z.enum(['SUPER_ADMIN', 'NDMA_ADMIN', 'SDMA', 'ATI', 'NGO', 'TRAINER', 'REVIEWER', 'DATA_ENTRY_OPERATOR', 'NDMA_VIEWER']),
  orgId: z.string().uuid().optional().or(z.literal('')),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
});

// Training schemas
const baseTrainingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().max(2000).optional().or(z.literal('')),
  typeId: z.coerce.number().int().positive('Training type is required'),
  themeId: z.coerce.number().int().positive('Training theme is required'),
  orgId: z.string().uuid('Organization is required'),
  trainerName: z.string().max(200).optional().or(z.literal('')),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  venue: z.string().max(500).optional().or(z.literal('')),
  stateId: z.coerce.number().int().positive('State is required'),
  districtId: z.coerce.number().int().positive('District is required'),
  address: z.string().max(500).optional().or(z.literal('')),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  capacity: z.coerce.number().int().positive('Capacity must be positive'),
  objectives: z.string().max(2000).optional().or(z.literal('')),
});

export const createTrainingSchema = baseTrainingSchema.refine(data => new Date(data.endDate) >= new Date(data.startDate), { message: 'End date must be after start date', path: ['endDate'] });

export const updateTrainingSchema = baseTrainingSchema.partial();

// Participant schemas
export const createParticipantSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().regex(/^[+]?[0-9]{10,15}$/).optional().or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
  age: z.coerce.number().int().min(1).max(120).optional(),
  designation: z.string().max(100).optional().or(z.literal('')),
  orgId: z.string().uuid().optional().or(z.literal('')),
  stateId: z.coerce.number().int().positive().optional(),
  districtId: z.coerce.number().int().positive().optional(),
});

// Session schemas
export const createSessionSchema = z.object({
  title: z.string().min(2).max(200),
  date: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  venue: z.string().max(500).optional().or(z.literal('')),
});

// Attendance schemas
export const recordAttendanceSchema = z.object({
  records: z.array(z.object({
    participantId: z.string().uuid(),
    status: z.enum(['PRESENT', 'ABSENT', 'LATE']),
    remarks: z.string().max(500).optional().or(z.literal('')),
  })).min(1, 'At least one attendance record required'),
});

// Assessment schemas
export const createAssessmentSchema = z.object({
  participantId: z.string().uuid(),
  knowledgeScore: z.coerce.number().min(0).max(100),
  preparednessScore: z.coerce.number().min(0).max(100),
  confidenceScore: z.coerce.number().min(0).max(100),
  overallScore: z.coerce.number().min(0).max(100),
  feedback: z.string().max(2000).optional().or(z.literal('')),
});

// Feedback schemas
export const createFeedbackSchema = z.object({
  participantId: z.string().uuid(),
  overallRating: z.coerce.number().int().min(1).max(5),
  contentRating: z.coerce.number().int().min(1).max(5),
  trainerRating: z.coerce.number().int().min(1).max(5),
  venueRating: z.coerce.number().int().min(1).max(5),
  comments: z.string().max(2000).optional().or(z.literal('')),
  suggestions: z.string().max(2000).optional().or(z.literal('')),
});

// Report schemas
export const generateReportSchema = z.object({
  title: z.string().min(3).max(200),
  reportType: z.enum(['SUMMARY', 'COVERAGE', 'ATTENDANCE', 'IMPACT']),
  format: z.enum(['PDF', 'EXCEL', 'CSV']),
  filters: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    stateId: z.coerce.number().int().optional(),
    districtId: z.coerce.number().int().optional(),
    orgId: z.string().uuid().optional(),
    typeId: z.coerce.number().int().optional(),
    themeId: z.coerce.number().int().optional(),
  }).optional(),
});

// Organization schemas
export const createOrganizationSchema = z.object({
  name: z.string().min(2).max(200),
  type: z.enum(['GOVERNMENT', 'NGO', 'PRIVATE', 'ACADEMIC', 'OTHER']),
  state: z.string().max(100).optional().or(z.literal('')),
  district: z.string().max(100).optional().or(z.literal('')),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().regex(/^[+]?[0-9]{10,15}$/).optional().or(z.literal('')),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

// User schemas
export const createUserSchema = registerSchema;
export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^[+]?[0-9]{10,15}$/).optional().or(z.literal('')),
  role: z.enum(['SUPER_ADMIN', 'NDMA_ADMIN', 'SDMA', 'ATI', 'NGO', 'TRAINER', 'REVIEWER', 'DATA_ENTRY_OPERATOR', 'NDMA_VIEWER']).optional(),
  orgId: z.string().uuid().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
});

// Infer types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type CreateTrainingInput = z.infer<typeof createTrainingSchema>;
export type UpdateTrainingInput = z.infer<typeof updateTrainingSchema>;
export type CreateParticipantInput = z.infer<typeof createParticipantSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type RecordAttendanceInput = z.infer<typeof recordAttendanceSchema>;
export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;
export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
export type GenerateReportInput = z.infer<typeof generateReportSchema>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
