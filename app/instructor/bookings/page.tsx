import { db } from '@/lib/db/drizzle';
import { bookings, students } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { eq, desc } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle } from 'lucide-react';

export default async function InstructorBookings() {
  const user = await getUser();
  
  if (!user || user.role !== 'instructor') {
    return null;
  }

  // Fetch all bookings for this instructor
  const instructorBookings = await db
    .select({
      id: bookings.id,
      preferredDate: bookings.preferredDate,
      preferredTime: bookings.preferredTime,
      lessonType: bookings.lessonType,
      status: bookings.status,
      notes: bookings.notes,
      createdAt: bookings.createdAt,
      studentName: students.name,
      studentId: students.id,
      studentPhone: students.phone,
      studentEmail: students.email,
    })
    .from(bookings)
    .leftJoin(students, eq(bookings.studentId, students.id))
    .where(eq(bookings.instructorId, user.id))
    .orderBy(desc(bookings.createdAt));

  // Group bookings by status for statistics
  const bookingStats = {
    pending: instructorBookings.filter(b => b.status === 'pending').length,
    confirmed: instructorBookings.filter(b => b.status === 'confirmed').length,
    cancelled: instructorBookings.filter(b => b.status === 'cancelled').length,
    completed: instructorBookings.filter(b => b.status === 'completed').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handleBookingAction = async (bookingId: number, action: 'confirm' | 'cancel') => {
    try {
      const response = await fetch(`/api/instructor/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action === 'confirm' ? 'confirmed' : 'cancelled' }),
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bookings
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage student booking requests
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {bookingStats.pending}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {bookingStats.confirmed}
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
              {bookingStats.completed}
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
              {bookingStats.cancelled}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">All Bookings</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Manage all booking requests from students
          </CardDescription>
        </CardHeader>
        <CardContent>
          {instructorBookings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-900 dark:text-white">Student</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Preferred Date & Time</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Lesson Type</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Requested</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instructorBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {booking.studentName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                            <Phone className="w-3 h-3" />
                            <span>{booking.studentPhone}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{booking.preferredDate}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{booking.preferredTime}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900 dark:text-white capitalize">
                        {booking.lessonType?.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(booking.status || '')}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {booking.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() => handleBookingAction(booking.id, 'confirm')}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Confirm
                            </Button>
                            <Button 
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleBookingAction(booking.id, 'cancel')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.location.href = `/instructor/bookings/${booking.id}`}
                        >
                          View Details
                        </Button>
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
                No Bookings Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                You don't have any booking requests yet. Students will be able to book lessons with you once you're assigned.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}