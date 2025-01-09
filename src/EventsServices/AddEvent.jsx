// AddEvent.js
import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const CreateEventModal = ({ setShowCreateModal, setAllEvents }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [attendees, setAttendees] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const sendEventsData = async (e) => {
    e.preventDefault();

    try {
      const eventData = {
        title,
        date,
        time,
        location,
        attendees,
        description,
        category,
        status,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        "http://localhost:4000/send-event",
        eventData,
        config
      );

      if (response.data) {
        const newEvent = {
          id: response.data.id || Date.now(),
          ...eventData,
        };

        setAllEvents((prevEvents) => [...prevEvents, newEvent]);
        alert("Event added successfully!");
        resetForm();
        setShowCreateModal(false);
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (err) => {
    if (err.response) {
      setErrorMessage(err.response.data.message || "An error occurred. Please try again.");
    } else if (err.request) {
      setErrorMessage("No response from server. Please try again.");
    } else {
      setErrorMessage("Error adding event. Please try again.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDate("");
    setTime("");
    setLocation("");
    setAttendees("");
    setDescription("");
    setCategory("");
    setStatus("");
  };

  return (
    <div className="fixed font-poppins inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Event</h2>
          <button onClick={() => setShowCreateModal(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={sendEventsData}>
          <div className="grid grid-cols-3 gap-4">
            {/* First Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <label className="block text-base font-medium mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select a category</option>
                  <option value="Technology">Technology</option>
                  <option value="Networking">Networking</option>
                  <option value="Education">Education</option>
                  <option value="Social">Social</option>
                </select>
              </div>
              <div>
                <label className="block text-base font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location"
                />
              </div>
            </div>

            {/* Second Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-base font-medium mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-base font-medium mb-1">
                  Status
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder="Enter event status"
                />
              </div>
            </div>

            {/* Third Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium mb-1">
                  Attendees
                </label>
                <input
                  type="text"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter number of attendees"
                />
              </div>
              <div>
                <label className="block text-base font-medium mb-1">
                  Description
                </label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows="5"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter event description"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Event
            </button>
          </div>

          {errorMessage && (
            <p className="text-red-500 mt-2">{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;