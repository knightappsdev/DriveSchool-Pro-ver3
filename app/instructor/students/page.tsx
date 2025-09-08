import { db } from '@/lib/db/drizzle';
import { students, lessons } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { eq, count } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Calendar, BookOpen, Users } from 'lucide-react';

export default async function InstructorStudents() {
  const user = await getUser();
  
  if (!user || user.role !== 'instructor') {
    return null;
  }

  // Fetch assigned students with their lesson statistics
  const assignedStudents = await db
    .select({
      id: students.id,
      name: students.name,
      email: students.email,
      phone: students.phone,
      avatar: students.avatar,
      enrollmentDate: students.enrollmentDate,
      status: students.status,
      emergencyContact: students.emergencyContact,
      medicalConditions: students.medicalConditions,
      lessonCount: count(lessons.id),
    })
    .from(students)
    .leftJoin(lessons, eq(lessons.studentId, students.id))
    .where(eq(students.instructorId, user.id))
    .groupBy(students.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Students
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and track your assigned students
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {assignedStudents.length} Students
        </Badge>
      </div>

      {/* Students Grid */}
      {assignedStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedStudents.map((student) => (
            <Card key={student.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={student.avatar || undefined} alt={student.name || 'Student'} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {student.name?.charAt(0).toUpperCase() || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                      {student.name}
                    </CardTitle>
                    <div className="flex items-center mt-1">
                      <Badge 
                        variant={student.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {student.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Contact Information */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  {student.phone && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{student.phone}</span>
                    </div>
                  )}
                </div>

                {/* Statistics */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>{student.lessonCount} lessons</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>
                      Since {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Emergency Contact */}
                {student.emergencyContact && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <strong>Emergency:</strong> {student.emergencyContact}
                  </div>
                )}

                {/* Medical Conditions */}
                {student.medicalConditions && (
                  <div className="text-xs text-red-600 dark:text-red-400">
                    <strong>Medical:</strong> {student.medicalConditions}
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.location.href = `/instructor/students/${student.id}`}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => window.location.href = `/instructor/lessons/new?studentId=${student.id}`}
                  >
                    Schedule Lesson
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Students Assigned
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              You don't have any students assigned to you yet. Contact your administrator to get students assigned to your instruction.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}