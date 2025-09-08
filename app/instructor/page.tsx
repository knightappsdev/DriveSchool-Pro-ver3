import { db } from '@/lib/db/drizzle';
import { students, lessons, bookings } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { eq, and, gte } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, Clock, CheckCircle } from 'lucide-react';

export default async function InstructorDashboard() {
  const user = await getUser();
  
  if (!user || user.role !== 'instructor') {
    return null;
  }

  // Get today's date for filtering
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch instructor statistics
  const [assignedStudents, todaysLessons, completedLessons, upcomingBookings] = await Promise.all([
    // Assigned students count
    db.select().from(students).where(eq(students.instructorId, user.id)),
    
    // Today's lessons
    db.select({
      id: lessons.id,
      date: lessons.date,
      time: lessons.time,
      type: lessons.type,
      status: lessons.status,
      student: students.name,
      studentId: students.id
    })
    .from(lessons)
    .leftJoin(students, eq(lessons.studentId, students.id))
    .where(
      and(
        eq(lessons.instructorId, user.id),
        gte(lessons.date, today.toISOString().split('T')[0])
      )
    ),

    // Completed lessons this month
    db.select()
    .from(lessons)
    .where(
      and(
        eq(lessons.instructorId, user.id),
        eq(lessons.status, 'completed')
      )
    ),

    // Upcoming bookings
    db.select({
      id: bookings.id,
      date: bookings.preferredDate,
      time: bookings.preferredTime,
      status: bookings.status,
      student: students.name,
      studentPhone: students.phone
    })
    .from(bookings)
    .leftJoin(students, eq(bookings.studentId, students.id))
    .where(
      and(
        eq(bookings.instructorId, user.id),
        eq(bookings.status, 'pending')
      )
    )
  ]);

  const stats = [
    {
      title: "Assigned Students",
      value: assignedStudents.length.toString(),
      description: "Total students under your guidance",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Today's Lessons",
      value: todaysLessons.filter(lesson => 
        lesson.date === today.toISOString().split('T')[0]
      ).length.toString(),
      description: "Lessons scheduled for today",
      icon: CalendarDays,
      color: "text-green-600"
    },
    {
      title: "Completed Lessons",
      value: completedLessons.length.toString(),
      description: "This month",
      icon: CheckCircle,
      color: "text-purple-600"
    },
    {
      title: "Pending Bookings",
      value: upcomingBookings.length.toString(),
      description: "Awaiting confirmation",
      icon: Clock,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Instructor Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back, {user.name}! Here's your overview for today.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Today's Lessons</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Your scheduled lessons for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysLessons.filter(lesson => 
                lesson.date === today.toISOString().split('T')[0]
              ).length > 0 ? (
                todaysLessons
                  .filter(lesson => lesson.date === today.toISOString().split('T')[0])
                  .map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {lesson.student}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {lesson.time} - {lesson.type}
                        </p>
                      </div>
                      <Badge variant={lesson.status === 'completed' ? 'default' : 'secondary'}>
                        {lesson.status}
                      </Badge>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No lessons scheduled for today
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Pending Bookings</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Bookings awaiting your confirmation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {booking.student}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {booking.date} at {booking.time}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {booking.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No pending bookings
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}