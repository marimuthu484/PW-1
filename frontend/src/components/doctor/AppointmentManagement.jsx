import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Video, Check, X, Eye, MessageSquare } from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { consultationService } from '../../services/consultationService';
import { formatters } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const AppointmentCard = ({ appointment, onAction, onViewDetails, onStartCall }) => {
  const [starting, setStarting] = useState(false);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStartCall = async () => {
    setStarting(true);
    await onStartCall(appointment);
    setStarting(false);
  };

  // Safely get patient info
  const patientName = appointment.patientId?.userId?.name || 'Unknown Patient';
  const patientAvatar = appointment.patientId?.userId?.avatar || 
    `https://ui-avatars.com/api/?name=${patientName}`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start space-x-4 mb-4 xl:mb-0 flex-1">
          {/* Patient Avatar */}
          <img
            src={patientAvatar}
            alt={patientName}
            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            {/* Patient Info Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
              <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {patientName}
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
          {(appointment.status === 'confirmed' || appointment.status === 'in-progress') && (
            <button 
              onClick={handleStartCall}
              disabled={starting}
              className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {starting ? (
                <LoadingSpinner size="small" color="white" />
              ) : (
                <>
                  <Video className="h-4 w-4" />
                  <span>{appointment.status === 'in-progress' ? 'Join Call' : 'Start Call'}</span>
                </>
              )}
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
  const navigate = useNavigate();

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
      setAppointments(response.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentAction = async (id, status) => {
    try {
      const response = await doctorService.updateAppointmentStatus(id, status);
      
      if (response.success) {
        alert(response.message || `Appointment ${status} successfully!`);
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error updating appointment';
      alert(errorMessage);
    }
  };

  const startVideoCall = async (appointment) => {
    try {
      const response = await consultationService.startConsultation(appointment._id);
      
      if (response.success) {
        // Navigate to video call page
        window.open(response.meetingLink, '_blank');
        
        // Refresh appointments to show updated status
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error starting consultation:', error);
      alert(error.response?.data?.message || 'Error starting video consultation');
    }
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
          <option value="in-progress">In Progress</option>
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
