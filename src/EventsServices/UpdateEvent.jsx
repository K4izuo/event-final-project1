import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const EditEventModal = ({ setShowEditModal, selectedEvent, setAllEvents, setSelectedEvent }) => {
  const [editFormData, setEditFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    attendees: "",
    description: "",
    category: "",
    status: ""
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (selectedEvent) {
      setEditFormData(selectedEvent);
    }
  }, [selectedEvent]);

  const updateEventsData = async (e) => {
    e.preventDefault();

    try {
      const config = { headers: { "Content-Type": "application/json" } };

      const response = await axios.put(
        `http://localhost:4000/update-event/${editFormData.id}`,
        editFormData,
        config
      );

      if (response.data) {
        setAllEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === editFormData.id ? response.data : event
          )
        );
        alert("Event updated successfully!");
        setShowEditModal(false);
        setSelectedEvent(null);
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleError = (err) => {
    if (err.response) {
      setErrorMessage(err.response.data.message || "An error occurred. Please try again.");
    } else if (err.request) {
      setErrorMessage("No response from server. Please try again.");
    } else {
      setErrorMessage("Error updating event. Please try again.");
    }
  };

  return (
    <div className="fixed font-poppins inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Update Event</h2>
          <button onClick={() => setShowEditModal(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={updateEventsData}>
          <div className="grid grid-cols-3 gap-4">
            {/* First Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium mb-1">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <label className="block text-base font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={editFormData.category}
                  onChange={handleEditInputChange}
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
                <label className="block text-base font-medium mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  className="w-full p-2 border rounded-md"
                  value={editFormData.location}
                  onChange={handleEditInputChange}
                  placeholder="Enter location"
                />
              </div>
            </div>

            {/* Second Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={editFormData.date}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-base font-medium mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  value={editFormData.time}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-base font-medium mb-1">Status</label>
                <input
                  type="text"
                  name="status"
                  className="w-full p-2 border rounded-md"
                  value={editFormData.status}
                  onChange={handleEditInputChange}
                  placeholder="Enter event status"
                />
              </div>
            </div>

            {/* Third Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium mb-1">Attendees</label>
                <input
                  type="text"
                  name="attendees"
                  value={editFormData.attendees}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter number of attendees"
                />
              </div>
              <div>
                <label className="block text-base font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  className="w-full p-2 border rounded-md"
                  rows="5"
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                  placeholder="Enter event description"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Event
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

export default EditEventModal;