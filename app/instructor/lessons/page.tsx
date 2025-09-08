import { db } from '@/lib/db/drizzle';
import { lessons, students } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { eq, desc } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, User, Plus } from 'lucide-react';

export default async function InstructorLessons() {
  const user = await getUser();
  
  if (!user || user.role !== 'instructor') {
    return null;
  }

  // Fetch all lessons for this instructor
  const instructorLessons = await db
    .select({
      id: lessons.id,
      date: lessons.date,
      time: lessons.time,
      duration: lessons.duration,
      type: lessons.type,
      status: lessons.status,
      notes: lessons.notes,
      studentName: students.name,
      studentId: students.id,
      studentPhone: students.phone,
    })
    .from(lessons)
    .leftJoin(students, eq(lessons.studentId, students.id))
    .where(eq(lessons.instructorId, user.id))
    .orderBy(desc(lessons.date), desc(lessons.time));

  // Group lessons by status for statistics
  const lessonStats = {
    scheduled: instructorLessons.filter(l => l.status === 'scheduled').length,
    completed: instructorLessons.filter(l => l.status === 'completed').length,
    cancelled: instructorLessons.filter(l => l.status === 'cancelled').length,
    inProgress: instructorLessons.filter(l => l.status === 'in_progress').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Lessons
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and track all your lessons
          </p>
        </div>
        <Button onClick={() => window.location.href = '/instructor/lessons/new'}>
          <Plus className="w-4 h-4 mr-2" />
          Schedule New Lesson
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {lessonStats.scheduled}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {lessonStats.inProgress}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {lessonStats.completed}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">
              Cancelled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {lessonStats.cancelled}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lessons Table */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">All Lessons</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Complete history of your lessons
          </CardDescription>
        </CardHeader>
        <CardContent>
          {instructorLessons.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-900 dark:text-white">Student</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Date & Time</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Type</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Duration</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instructorLessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {lesson.studentName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {lesson.studentPhone}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{lesson.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900 dark:text-white capitalize">
                        {lesson.type?.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900 dark:text-white">
                        {lesson.duration} min
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(lesson.status || '')}>
                        {lesson.status?.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.location.href = `/instructor/lessons/${lesson.id}`}
                        >
                          View
                        </Button>
                        {lesson.status === 'scheduled' && (
                          <Button 
                            size="sm"
                            onClick={() => window.location.href = `/instructor/lessons/${lesson.id}/edit`}
                          >
                            Edit
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Lessons Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You haven't scheduled any lessons yet. Start by creating your first lesson.
              </p>
              <Button onClick={() => window.location.href = '/instructor/lessons/new'}>
                <Plus className="w-4 h-4 mr-2" />
                Schedule First Lesson
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}