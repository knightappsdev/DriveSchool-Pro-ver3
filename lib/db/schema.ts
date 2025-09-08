import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  int,
  bigint,
  decimal,
  boolean,
  json,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Users table with role-based access
export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: mysqlEnum('role', ['admin', 'instructor', 'student']).notNull().default('student'),
  avatar: varchar('avatar', { length: 500 }),
  phone: varchar('phone', { length: 20 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

// Instructors table with detailed information
export const instructors = mysqlTable('instructors', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.id),
  licenseNumber: varchar('license_number', { length: 50 }).notNull().unique(),
  experience: int('experience').notNull(),
  specialties: json('specialties').$type<string[]>().notNull(),
  transmissionTypes: json('transmission_types').$type<string[]>().notNull(),
  pricePerHour: decimal('price_per_hour', { precision: 8, scale: 2 }).notNull(),
  location: varchar('location', { length: 100 }).notNull(),
  bio: text('bio'),
  rating: decimal('rating', { precision: 3, scale: 2 }).notNull().default('4.5'),
  totalReviews: int('total_reviews').notNull().default(0),
  availability: text('availability'),
  languages: json('languages').$type<string[]>(),
  nationality: varchar('nationality', { length: 50 }),
  religion: varchar('religion', { length: 50 }),
  ethnicity: varchar('ethnicity', { length: 50 }),
  gender: mysqlEnum('gender', ['Male', 'Female', 'Other']),
  isApproved: boolean('is_approved').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Students table
export const students = mysqlTable('students', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.id),
  dateOfBirth: timestamp('date_of_birth'),
  address: text('address'),
  emergencyContact: varchar('emergency_contact', { length: 20 }),
  licenseStatus: mysqlEnum('license_status', ['none', 'provisional', 'full']).notNull().default('none'),
  medicalConditions: text('medical_conditions'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Courses table
export const courses = mysqlTable('courses', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description').notNull(),
  level: mysqlEnum('level', ['absolute-beginner', 'beginner', 'intermediate', 'advanced']).notNull(),
  totalHours: int('total_hours').notNull(),
  price: decimal('price', { precision: 8, scale: 2 }).notNull(),
  features: json('features').$type<string[]>().notNull(),
  color: varchar('color', { length: 20 }).notNull().default('blue'),
  isRecommended: boolean('is_recommended').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Bookings table
export const bookings = mysqlTable('bookings', {
  id: int('id').primaryKey().autoincrement(),
  studentId: int('student_id').notNull().references(() => students.id),
  instructorId: int('instructor_id').notNull().references(() => instructors.id),
  courseId: int('course_id').notNull().references(() => courses.id),
  status: mysqlEnum('status', ['pending', 'confirmed', 'completed', 'cancelled']).notNull().default('pending'),
  scheduledDate: timestamp('scheduled_date').notNull(),
  duration: int('duration').notNull(), // in minutes
  totalCost: decimal('total_cost', { precision: 8, scale: 2 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Lessons table (individual lesson records)
export const lessons = mysqlTable('lessons', {
  id: int('id').primaryKey().autoincrement(),
  bookingId: int('booking_id').notNull().references(() => bookings.id),
  studentId: int('student_id').notNull().references(() => students.id),
  instructorId: int('instructor_id').notNull().references(() => instructors.id),
  lessonDate: timestamp('lesson_date').notNull(),
  startTime: varchar('start_time', { length: 8 }).notNull(),
  endTime: varchar('end_time', { length: 8 }).notNull(),
  status: mysqlEnum('status', ['scheduled', 'completed', 'cancelled', 'no-show']).notNull().default('scheduled'),
  studentProgress: text('student_progress'),
  instructorNotes: text('instructor_notes'),
  skills: json('skills').$type<string[]>(),
  rating: int('rating'), // student rating of the lesson (1-5)
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Reviews table
export const reviews = mysqlTable('reviews', {
  id: int('id').primaryKey().autoincrement(),
  studentId: int('student_id').notNull().references(() => students.id),
  instructorId: int('instructor_id').notNull().references(() => instructors.id),
  rating: int('rating').notNull(), // 1-5 stars
  comment: text('comment'),
  isPublic: boolean('is_public').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Activity logs
export const activityLogs = mysqlTable('activity_logs', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.id),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
  metadata: json('metadata'),
});

// Settings table for admin configuration
export const settings = mysqlTable('settings', {
  id: int('id').primaryKey().autoincrement(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  instructor: one(instructors),
  student: one(students),
  activityLogs: many(activityLogs),
}));

export const instructorsRelations = relations(instructors, ({ one, many }) => ({
  user: one(users, {
    fields: [instructors.userId],
    references: [users.id],
  }),
  bookings: many(bookings),
  lessons: many(lessons),
  reviews: many(reviews),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  bookings: many(bookings),
  lessons: many(lessons),
  reviews: many(reviews),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  student: one(students, {
    fields: [bookings.studentId],
    references: [students.id],
  }),
  instructor: one(instructors, {
    fields: [bookings.instructorId],
    references: [instructors.id],
  }),
  course: one(courses, {
    fields: [bookings.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one }) => ({
  booking: one(bookings, {
    fields: [lessons.bookingId],
    references: [bookings.id],
  }),
  student: one(students, {
    fields: [lessons.studentId],
    references: [students.id],
  }),
  instructor: one(instructors, {
    fields: [lessons.instructorId],
    references: [instructors.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  student: one(students, {
    fields: [reviews.studentId],
    references: [students.id],
  }),
  instructor: one(instructors, {
    fields: [reviews.instructorId],
    references: [reviews.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Instructor = typeof instructors.$inferSelect;
export type NewInstructor = typeof instructors.$inferInsert;
export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;

// Enums
export enum UserRole {
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
  STUDENT = 'student',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum LessonStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no-show',
}

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  BOOKING_CREATED = 'BOOKING_CREATED',
  BOOKING_UPDATED = 'BOOKING_UPDATED',
  LESSON_COMPLETED = 'LESSON_COMPLETED',
  REVIEW_SUBMITTED = 'REVIEW_SUBMITTED',
}