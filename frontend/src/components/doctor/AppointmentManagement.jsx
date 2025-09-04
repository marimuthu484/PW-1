// import React, { useState } from 'react';
// import { Calendar, Clock, User, Phone, Video, Check, X, Eye, MessageSquare } from 'lucide-react';

// // Subcomponent: Appointment Card
// const AppointmentCard = ({ appointment, onAction, onViewDetails, onStartCall }) => {
//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
//       case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
//       case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high': return 'bg-red-500';
//       case 'medium': return 'bg-yellow-500';
//       case 'low': return 'bg-green-500';
//       default: return 'bg-gray-500';
//     }
//   };

//   const getTypeIcon = (type) => {
//     switch (type) {
//       case 'Video Consultation': return <Video className="h-4 w-4" />;
//       case 'Phone Call': return <Phone className="h-4 w-4" />;
//       default: return <User className="h-4 w-4" />;
//     }
//   };

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
//       <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
//         <div className="flex items-start space-x-4 mb-4 xl:mb-0 flex-1">
//           {/* Priority Indicator */}
//           <div className={`w-1 h-16 rounded-full ${getPriorityColor(appointment.priority)} flex-shrink-0`}></div>

//           {/* Patient Avatar */}
//           <img
//             src={appointment.patient.avatar}
//             alt={appointment.patient.name}
//             className="w-16 h-16 rounded-full object-cover flex-shrink-0"
//           />

//           <div className="flex-1 min-w-0">
//             {/* Patient Info Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
//               <div className="flex items-center space-x-3 mb-2 sm:mb-0">
//                 <h3 className="text-lg font-semibold text-gray-900 truncate">
//                   {appointment.patient.name}
//                 </h3>
//                 <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
//                   {appointment.status}
//                 </span>
//               </div>
//               <div className="text-sm text-gray-500">
//                 Priority: <span className="capitalize font-medium">{appointment.priority}</span>
//               </div>
//             </div>

//             {/* Appointment Details */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600 mb-4">
//               <div className="flex items-center space-x-2">
//                 <Clock className="h-4 w-4 flex-shrink-0" />
//                 <span>{appointment.time} ({appointment.duration})</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 {getTypeIcon(appointment.type)}
//                 <span>{appointment.type}</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <User className="h-4 w-4 flex-shrink-0" />
//                 <span>Age: {appointment.patient.age}</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Phone className="h-4 w-4 flex-shrink-0" />
//                 <span className="truncate">{appointment.patient.phone}</span>
//               </div>
//             </div>

//             {/* Reason and Notes */}
//             <div className="mb-4">
//               <div className="mb-2">
//                 <span className="text-sm font-medium text-gray-900">Reason: </span>
//                 <span className="text-sm text-gray-700">{appointment.reason}</span>
//               </div>
//               {appointment.notes && (
//                 <div>
//                   <span className="text-sm font-medium text-gray-900">Notes: </span>
//                   <span className="text-sm text-gray-700">{appointment.notes}</span>
//                 </div>
//               )}
//             </div>

//             {/* Medical History */}
//             <div className="bg-gray-50 rounded-lg p-3">
//               <span className="text-sm font-medium text-gray-900">Medical History: </span>
//               <span className="text-sm text-gray-700">{appointment.patient.medicalHistory}</span>
//             </div>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex flex-col sm:flex-row xl:flex-col space-y-2 sm:space-y-0 sm:space-x-3 xl:space-x-0 xl:space-y-2 xl:w-48">
//           {appointment.status === 'pending' && (
//             <>
//               <button onClick={() => onAction(appointment.id, 'accept')} className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
//                 <Check className="h-4 w-4" /> <span>Accept</span>
//               </button>
//               <button onClick={() => onAction(appointment.id, 'decline')} className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
//                 <X className="h-4 w-4" /> <span>Decline</span>
//               </button>
//             </>
//           )}
//           {appointment.status === 'confirmed' && appointment.type === 'Video Consultation' && (
//             <button onClick={() => onStartCall(appointment)} className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
//               <Video className="h-4 w-4" /> <span>Start Call</span>
//             </button>
//           )}
//           <button onClick={() => onViewDetails(appointment)} className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
//             <Eye className="h-4 w-4" /> <span>Details</span>
//           </button>
//           <button className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
//             <MessageSquare className="h-4 w-4" /> <span>Message</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main Component
// const AppointmentManagement = () => {
//   const initialAppointments = [
//     {
//       id: 1,
//       patient: {
//         name: 'John Smith',
//         age: 45,
//         avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
//         phone: '+123456789',
//         medicalHistory: 'Hypertension'
//       },
//       date: '2025-08-29',
//       time: '10:00 AM',
//       duration: '30 min',
//       status: 'pending',
//       priority: 'high',
//       type: 'Video Consultation',
//       reason: 'Regular check-up',
//       notes: 'Patient reports chest pain'
//     },
//     {
//       id: 2,
//       patient: {
//         name: 'Sarah Wilson',
//         age: 38,
//         avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
//         phone: '+987654321',
//         medicalHistory: 'Diabetes'
//       },
//       date: '2025-08-29',
//       time: '2:00 PM',
//       duration: '45 min',
//       status: 'confirmed',
//       priority: 'medium',
//       type: 'Phone Call',
//       reason: 'Follow-up',
//       notes: ''
//     }
//   ];

//   const [appointments, setAppointments] = useState(initialAppointments);
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);

//   const handleAppointmentAction = (id, action) => {
//     setAppointments(prev =>
//       prev.map(apt =>
//         apt.id === id
//           ? { ...apt, status: action === 'accept' ? 'confirmed' : 'cancelled' }
//           : apt
//       )
//     );
//     alert(`Appointment ${action === 'accept' ? 'accepted' : 'declined'} successfully!`);
//   };

//   const startVideoCall = (appointment) => alert(`Starting video call with ${appointment.patient.name}...`);

//   const filteredAppointments = appointments.filter(
//     apt => apt.date === selectedDate && (statusFilter === 'all' || apt.status === statusFilter)
//   );

//   return (
//     <div className="space-y-6 p-6">
//       {/* Filters */}
//       <div className="flex flex-wrap items-center gap-4 mb-6">
//         <input
//           type="date"
//           value={selectedDate}
//           onChange={e => setSelectedDate(e.target.value)}
//           className="px-3 py-2 border border-gray-300 rounded-lg"
//         />
//         <select
//           value={statusFilter}
//           onChange={e => setStatusFilter(e.target.value)}
//           className="px-3 py-2 border border-gray-300 rounded-lg"
//         >
//           <option value="all">All</option>
//           <option value="pending">Pending</option>
//           <option value="confirmed">Confirmed</option>
//           <option value="cancelled">Cancelled</option>
//         </select>
//       </div>

//       {/* Appointment List */}
//       {filteredAppointments.length === 0 ? (
//         <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
//           <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
//           <p className="text-gray-600">{statusFilter === 'all' ? 'No appointments scheduled' : `No ${statusFilter} appointments`}</p>
//         </div>
//       ) : (
//         filteredAppointments.map(apt => (
//           <AppointmentCard
//             key={apt.id}
//             appointment={apt}
//             onAction={handleAppointmentAction}
//             onViewDetails={(apt) => { setSelectedAppointment(apt); setShowDetails(true); }}
//             onStartCall={startVideoCall}
//           />
//         ))
//       )}

//       {/* Modal */}
//       {showDetails && selectedAppointment && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
//             <div className="flex justify-between items-start mb-6">
//               <h3 className="text-2xl font-semibold text-gray-900">Appointment Details</h3>
//               <button onClick={() => setShowDetails(false)} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
//             </div>
//             {/* Details content */}
//             <div className="space-y-3">
//               <p><span className="font-medium">Patient:</span> {selectedAppointment.patient.name}</p>
//               <p><span className="font-medium">Age:</span> {selectedAppointment.patient.age}</p>
//               <p><span className="font-medium">Phone:</span> {selectedAppointment.patient.phone}</p>
//               <p><span className="font-medium">Date:</span> {selectedAppointment.date}</p>
//               <p><span className="font-medium">Time:</span> {selectedAppointment.time}</p>
//               <p><span className="font-medium">Duration:</span> {selectedAppointment.duration}</p>
//               <p><span className="font-medium">Status:</span> {selectedAppointment.status}</p>
//               <p><span className="font-medium">Type:</span> {selectedAppointment.type}</p>
//               <p><span className="font-medium">Reason:</span> {selectedAppointment.reason}</p>
//               {selectedAppointment.notes && <p><span className="font-medium">Notes:</span> {selectedAppointment.notes}</p>}
//               <p><span className="font-medium">Medical History:</span> {selectedAppointment.patient.medicalHistory}</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AppointmentManagement;

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Video, Check, X, Eye, MessageSquare } from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { formatters } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';

const AppointmentCard = ({ appointment, onAction, onViewDetails, onStartCall }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start space-x-4 mb-4 xl:mb-0 flex-1">
          {/* Patient Avatar */}
          <img
            src={appointment.patientId?.userId?.avatar || `https://ui-avatars.com/api/?name=${appointment.patientId?.userId?.name}`}
            alt={appointment.patientId?.userId?.name}
            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            {/* Patient Info Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
              <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {appointment.patientId?.userId?.name}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>{formatters.date(appointment.date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>{appointment.timeSlot}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Video className="h-4 w-4 flex-shrink-0" />
                <span>Video Consultation</span>
              </div>
            </div>

            {/* Reason */}
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-900">Reason: </span>
              <span className="text-sm text-gray-700">{appointment.reason}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row xl:flex-col space-y-2 sm:space-y-0 sm:space-x-3 xl:space-x-0 xl:space-y-2 xl:w-48">
          {appointment.status === 'scheduled' && (
            <>
              <button 
                onClick={() => onAction(appointment._id, 'confirmed')} 
                className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Check className="h-4 w-4" /> <span>Confirm</span>
              </button>
              <button 
                onClick={() => onAction(appointment._id, 'cancelled')} 
                className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <X className="h-4 w-4" /> <span>Cancel</span>
              </button>
            </>
          )}
          {appointment.status === 'confirmed' && (
            <button 
              onClick={() => onStartCall(appointment)} 
              className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Video className="h-4 w-4" /> <span>Start Call</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate, statusFilter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = { date: selectedDate };
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const response = await doctorService.getAppointments(params);
      setAppointments(response.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentAction = async (id, status) => {
    try {
      await doctorService.updateAppointmentStatus(id, status);
      alert(`Appointment ${status} successfully!`);
      fetchAppointments();
    } catch (error) {
      alert('Error updating appointment: ' + error.message);
    }
  };

  const startVideoCall = (appointment) => {
    // Implement video call logic
    alert(`Starting video call with ${appointment.patientId?.userId?.name}...`);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="all">All</option>
          <option value="scheduled">Scheduled</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Appointment List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-600">No appointments scheduled for this date</p>
        </div>
      ) : (
        appointments.map(apt => (
          <AppointmentCard
            key={apt._id}
            appointment={apt}
            onAction={handleAppointmentAction}
            onViewDetails={() => {}}
            onStartCall={startVideoCall}
          />
        ))
      )}
    </div>
  );
};

export default AppointmentManagement;
