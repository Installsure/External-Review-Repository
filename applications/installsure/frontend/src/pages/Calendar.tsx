import React from 'react';
import { Calendar as CalendarIcon, Clock, Users } from 'lucide-react';

export default function Calendar() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <p className="mt-1 text-sm text-gray-600">
          Schedule and manage project milestones and deadlines
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <CalendarIcon className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Project Kickoff Meeting</h4>
                <p className="text-sm text-gray-600 mt-1">Discuss project scope and timeline</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Tomorrow, 10:00 AM</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>5 attendees</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Site Inspection</h4>
                <p className="text-sm text-gray-600 mt-1">Final walkthrough before installation</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Next Week, 2:00 PM</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>3 attendees</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Installation Deadline</h4>
                <p className="text-sm text-gray-600 mt-1">Complete all installations by end of month</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>End of Month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Calendar View</h3>
        <div className="border rounded-lg p-8 text-center text-gray-500">
          <CalendarIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p>Calendar view coming soon</p>
        </div>
      </div>
    </div>
  );
}
