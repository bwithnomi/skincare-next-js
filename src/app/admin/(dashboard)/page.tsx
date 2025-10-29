import { dashboardStats } from "@/actions/adminAuth";
import React from "react";

const Dashboard = async () => {

  const stats = await dashboardStats();
  return (
    <div>
      <p className="font-bold text-lg">Dashboard</p>

      <div className="flex flex-wrap">
        <div className="bg-white shadow-md rounded-lg p-6 m-4 w-64 basis-1/5">
          <p className="text-2xl font-semibold">{stats.totalUsers}</p>
          <p className="text-gray-600">Total Users</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 m-4 w-64 basis-1/5">
          <p className="text-2xl font-semibold">{stats.totalAppointments}</p>
          <p className="text-gray-600">Total Appointment</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 m-4 w-64 basis-1/5">
          <p className="text-2xl font-semibold">{stats.totalPendingAppointments}</p>
          <p className="text-gray-600">Pending</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 m-4 w-64 basis-1/5">
          <p className="text-2xl font-semibold">{stats.totalConfirmedAppointments}</p>
          <p className="text-gray-600">Confirmed</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
