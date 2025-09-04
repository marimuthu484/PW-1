import api from "./api";

export const appointmentService = {
  async createAppointment(appointmentData) {
    const response = await api.post('/appointments/create', appointmentData);
    return response.data;
  },

  async getAppointment(id) {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  async cancelAppointment(id) {
    const response = await api.delete(`/appointments/${id}/cancel`);
    return response.data;
  },

  async updateAppointmentStatus(id, status) {
    const response = await api.put(`/appointments/${id}/status`, { status });
    return response.data;
  }
};
