// import React, { useState } from 'react';
// import { Video, Calendar, Clock, User, CheckCircle } from 'lucide-react';

// const Consultation = () => {
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [selectedTime, setSelectedTime] = useState('');
//   const [consultationType, setConsultationType] = useState('video');
//   const [bookingSuccess, setBookingSuccess] = useState(false);

//   const doctors = [
//     {
//       id: 1,
//       name: 'Dr. Sarah Johnson',
//       specialty: 'Cardiologist',
//       rating: 4.8,
//       fee: 150,
//       image:
//         'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
//     },
//     {
//       id: 2,
//       name: 'Dr. Michael Chen',
//       specialty: 'Hepatologist',
//       rating: 4.9,
//       fee: 180,
//       image:
//         'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
//     },
//   ];

//   const timeSlots = [
//     '9:00 AM',
//     '10:00 AM',
//     '11:00 AM',
//     '2:00 PM',
//     '3:00 PM',
//     '4:00 PM',
//     '5:00 PM',
//   ];

//   // filter time slots if today
//   const isToday = selectedDate === new Date().toISOString().split('T')[0];
//   const validTimeSlots = isToday
//     ? timeSlots.filter((t) => {
//         const [time, meridiem] = t.split(' ');
//         let [hours, minutes] = time.split(':').map(Number);
//         if (meridiem === 'PM' && hours < 12) hours += 12;
//         const slotDate = new Date();
//         slotDate.setHours(hours, minutes);
//         return slotDate > new Date();
//       })
//     : timeSlots;

//   const handleBooking = () => {
//     if (selectedDoctor && selectedDate && selectedTime) {
//       setBookingSuccess(true);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-12">
//           <div className="flex justify-center mb-4">
//             <div className="bg-blue-100 p-4 rounded-full">
//               <Video className="h-12 w-12 text-blue-600" />
//             </div>
//           </div>
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Book Online Consultation
//           </h1>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             Schedule a video consultation with our expert doctors. Get
//             professional medical advice from the comfort of your home.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Booking Form */}
//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//               Schedule Your Consultation
//             </h2>

//             {/* Consultation Type */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-3">
//                 Consultation Type
//               </label>
//               <div className="grid grid-cols-2 gap-4">
//                 <button
//                   onClick={() => setConsultationType('video')}
//                   className={`p-4 rounded-lg border-2 transition-colors ${
//                     consultationType === 'video'
//                       ? 'border-blue-500 bg-blue-50 text-blue-700'
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                 >
//                   <Video className="h-6 w-6 mx-auto mb-2" />
//                   <span className="block font-medium">Video Call</span>
//                 </button>
//                 <button
//                   onClick={() => setConsultationType('audio')}
//                   className={`p-4 rounded-lg border-2 transition-colors ${
//                     consultationType === 'audio'
//                       ? 'border-blue-500 bg-blue-50 text-blue-700'
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                 >
//                   <User className="h-6 w-6 mx-auto mb-2" />
//                   <span className="block font-medium">Audio Call</span>
//                 </button>
//               </div>
//             </div>

//             {/* Doctor Selection */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-3">
//                 Select Doctor
//               </label>
//               <div className="space-y-3">
//                 {doctors.map((doctor) => (
//                   <button
//                     key={doctor.id}
//                     onClick={() => setSelectedDoctor(doctor)}
//                     className={`w-full p-4 rounded-lg border-2 transition-colors text-left flex items-center ${
//                       selectedDoctor?.id === doctor.id
//                         ? 'border-blue-500 bg-blue-50'
//                         : 'border-gray-200 hover:border-gray-300'
//                     }`}
//                   >
//                     <img
//                       src={doctor.image}
//                       alt={doctor.name}
//                       className="w-12 h-12 rounded-full object-cover mr-4"
//                     />
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-gray-900">
//                         {doctor.name}
//                       </h3>
//                       <p className="text-sm text-gray-600">
//                         {doctor.specialty}
//                       </p>
//                       <p className="text-sm font-medium text-blue-600">
//                         ${doctor.fee} consultation
//                       </p>
//                     </div>
//                     {selectedDoctor?.id === doctor.id && (
//                       <CheckCircle className="h-5 w-5 text-blue-500" />
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Date Selection */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-3">
//                 Select Date
//               </label>
//               <input
//                 type="date"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//                 min={new Date().toISOString().split('T')[0]}
//               />
//             </div>

//             {/* Time Selection */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-3">
//                 Select Time
//               </label>
//               <div className="grid grid-cols-3 gap-2">
//                 {validTimeSlots.map((time) => (
//                   <button
//                     key={time}
//                     onClick={() => setSelectedTime(time)}
//                     className={`p-2 rounded-lg border transition-colors text-sm ${
//                       selectedTime === time
//                         ? 'border-blue-500 bg-blue-50 text-blue-700'
//                         : 'border-gray-200 hover:border-gray-300'
//                     }`}
//                   >
//                     {time}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Book Button */}
//             <button
//               onClick={handleBooking}
//               disabled={!selectedDoctor || !selectedDate || !selectedTime}
//               className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
//             >
//               <Calendar className="h-5 w-5" />
//               <span>Book Consultation</span>
//             </button>

//             {/* Booking Success */}
//             {bookingSuccess && (
//               <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
//                 ✅ Consultation booked with {selectedDoctor.name} on{' '}
//                 {new Date(selectedDate).toLocaleDateString()} at {selectedTime}.
//                 You will receive a confirmation email shortly.
//               </div>
//             )}
//           </div>

//           {/* Booking Summary */}
//           <div className="space-y-6">
//             {selectedDoctor && (
//               <div className="bg-white rounded-2xl shadow-xl p-8">
//                 <h3 className="text-xl font-semibold text-gray-900 mb-4">
//                   Booking Summary
//                 </h3>

//                 <div className="space-y-4">
//                   <div className="flex items-center space-x-3">
//                     <User className="h-5 w-5 text-gray-400" />
//                     <div>
//                       <p className="font-medium text-gray-900">
//                         {selectedDoctor.name}
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         {selectedDoctor.specialty}
//                       </p>
//                     </div>
//                   </div>

//                   {selectedDate && (
//                     <div className="flex items-center space-x-3">
//                       <Calendar className="h-5 w-5 text-gray-400" />
//                       <p className="text-gray-900">
//                         {new Date(selectedDate).toLocaleDateString()}
//                       </p>
//                     </div>
//                   )}

//                   {selectedTime && (
//                     <div className="flex items-center space-x-3">
//                       <Clock className="h-5 w-5 text-gray-400" />
//                       <p className="text-gray-900">{selectedTime}</p>
//                     </div>
//                   )}

//                   <div className="flex items-center space-x-3">
//                     <Video className="h-5 w-5 text-gray-400" />
//                     <p className="text-gray-900 capitalize">
//                       {consultationType} Consultation
//                     </p>
//                   </div>

//                   <div className="border-t pt-4">
//                     <div className="flex justify-between items-center">
//                       <span className="font-medium text-gray-900">
//                         Total Fee:
//                       </span>
//                       <span className="text-2xl font-bold text-blue-600">
//                         ${selectedDoctor.fee}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="bg-white rounded-2xl shadow-xl p-8">
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">
//                 What to Expect
//               </h3>

//               <div className="space-y-4">
//                 {[
//                   {
//                     title: 'Professional Consultation',
//                     desc: 'Expert medical advice from certified specialists',
//                   },
//                   {
//                     title: 'Secure Platform',
//                     desc: 'HIPAA-compliant video conferencing',
//                   },
//                   {
//                     title: 'Digital Prescription',
//                     desc: 'Receive prescriptions electronically',
//                   },
//                   {
//                     title: 'Follow-up Support',
//                     desc: 'Access to consultation notes and recommendations',
//                   },
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-start space-x-3">
//                     <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
//                     <div>
//                       <p className="font-medium text-gray-900">{item.title}</p>
//                       <p className="text-sm text-gray-600">{item.desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Consultation;


import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, User, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { patientService } from '../services/patientService';
import { appointmentService } from '../services/appointmentService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Consultation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState('');

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    // If doctor ID passed from DoctorRecommendation page
    if (location.state?.doctorId) {
      const doctor = doctors.find(d => d._id === location.state.doctorId);
      if (doctor) setSelectedDoctor(doctor);
    }
  }, [location.state, doctors]);

  const fetchDoctors = async () => {
    try {
      const response = await patientService.getDoctors();
      setDoctors(response.doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleBooking = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !reason) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const appointmentData = {
        doctorId: selectedDoctor._id,
        date: selectedDate,
        timeSlot: selectedTime,
        reason: reason
      };

      await appointmentService.createAppointment(appointmentData);
      setBookingSuccess(true);
      
      // Reset form
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  // Filter time slots if today
  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const validTimeSlots = isToday
    ? timeSlots.filter((t) => {
        const [time, meridiem] = t.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (meridiem === 'PM' && hours < 12) hours += 12;
        const slotDate = new Date();
        slotDate.setHours(hours, minutes);
        return slotDate > new Date();
      })
    : timeSlots;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <Video className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Book Online Consultation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Schedule a video consultation with our expert doctors
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {bookingSuccess ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Appointment Booked Successfully!
              </h2>
              <p className="text-gray-600">
                You will receive a confirmation email shortly.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Redirecting to dashboard...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Doctor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Doctor
                </label>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {doctors.map((doctor) => (
                    <button
                      key={doctor._id}
                      onClick={() => setSelectedDoctor(doctor)}
                      className={`w-full p-4 rounded-lg border-2 transition-colors text-left flex items-center ${
                        selectedDoctor?._id === doctor._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={doctor.userId?.avatar || `https://ui-avatars.com/api/?name=${doctor.userId?.name}`}
                        alt={doctor.userId?.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {doctor.userId?.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {doctor.specialization} • {doctor.experience} years
                        </p>
                        <p className="text-sm font-medium text-blue-600">
                          ${doctor.consultationFee} consultation
                        </p>
                      </div>
                      {selectedDoctor?._id === doctor._id && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {validTimeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 rounded-lg border transition-colors text-sm ${
                        selectedTime === time
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason for Consultation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Reason for Consultation
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please describe your symptoms or reason for consultation..."
                />
              </div>

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={loading || !selectedDoctor || !selectedDate || !selectedTime || !reason}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                {loading ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  <>
                    <Calendar className="h-5 w-5" />
                    <span>Book Consultation</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Booking Summary */}
        {selectedDoctor && !bookingSuccess && (
          <div className="mt-6 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Booking Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-medium">{selectedDoctor.userId?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Specialization:</span>
                <span className="font-medium">{selectedDoctor.specialization}</span>
              </div>
              {selectedDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date(selectedDate).toDateString()}</span>
                </div>
              )}
              {selectedTime && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t">
                <span className="text-gray-600">Consultation Fee:</span>
                <span className="font-bold text-lg">${selectedDoctor.consultationFee}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Consultation;

