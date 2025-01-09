import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Plus,
  Users,
  Clock,
  MapPin,
  Search,
  Bell,
  Menu,
  Edit,
  Trash2,
} from "lucide-react";
import axios from "axios";
import CreateEventModal from "../EventsServices/AddEvent";
import EditEventModal from "../EventsServices/UpdateEvent";
import DeleteConfirmationModal from "../EventsServices/DeleteEvent";

const EventDashboard = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);

  // Configure polling interval (in milliseconds)
  const POLLING_INTERVAL = 1000; // Poll every 5 seconds

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:4000/events-data", {
        params: {
          // Send last update timestamp to get only new changes
          lastUpdate: lastUpdate ? lastUpdate.toISOString() : null,
        },
      });

      if (response.data.success) {
        setAllEvents(response.data.events);
        setLastUpdate(new Date());
        setError(null);
      } else {
        setError("Failed to fetch events");
      }
    } catch (error) {
      setError(`Error fetching events: ${error.message}`);
      console.error("Fetching events error:", error);
    }
  }, [lastUpdate]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Set up polling
  useEffect(() => {
    const pollTimer = setInterval(fetchEvents, POLLING_INTERVAL);

    // Cleanup polling on component unmount
    return () => clearInterval(pollTimer);
  }, [fetchEvents]);

  const handleDelete = async (eventId) => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `http://localhost:4000/delete-event/${eventId}`
      );

      if (response.data.success) {
        setAllEvents(allEvents.filter((event) => event.id !== eventId));
        setShowDeleteModal(false);
        setSelectedEvent(null);
        // Trigger immediate fetch after deletion
        fetchEvents();
      } else {
        setError("Failed to delete event");
      }
    } catch (error) {
      setError(`Error deleting event: ${error.message}`);
      console.error("Event deletion error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Add real-time update handler for new events
  const handleNewEvent = useCallback((newEvent) => {
    setAllEvents((prevEvents) => {
      // Check if event already exists
      const eventExists = prevEvents.some((event) => event.id === newEvent.id);
      if (eventExists) {
        // Update existing event
        return prevEvents.map((event) =>
          event.id === newEvent.id ? newEvent : event
        );
      }
      // Add new event
      return [...prevEvents, newEvent];
    });
  }, []);

  // Modified CreateEventModal handler to include real-time updates
  const handleCreateEvent = async (eventData) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/create-event",
        eventData
      );
      if (response.data.success) {
        handleNewEvent(response.data.event);
        setShowCreateModal(false);
        // Trigger immediate fetch after creation
        fetchEvents();
      }
    } catch (error) {
      setError(`Error creating event: ${error.message}`);
      console.error("Event creation error:", error);
    }
  };

  // Modified EditEventModal handler to include real-time updates
  const handleEditEvent = async (eventData) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/update-event/${eventData.id}`,
        eventData
      );
      if (response.data.success) {
        handleNewEvent(response.data.event);
        setShowEditModal(false);
        setSelectedEvent(null);
        // Trigger immediate fetch after edit
        fetchEvents();
      }
    } catch (error) {
      setError(`Error updating event: ${error.message}`);
      console.error("Event update error:", error);
    }
  };

  // Error display component
  const ErrorMessage = () => {
    if (!error) return null;
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  };

  // const handleEdit = (eventData) => {
  //   setAllEvents((prevEvents) =>
  //     prevEvents.map((event) => (event.id === eventData.id ? eventData : event))
  //   );
  //   setShowEditModal(false);
  //   setSelectedEvent(null);
  // };

  return (
    <div className="min-h-screen font-poppins bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex items-center">
                <span className="text-xl font-semibold text-gray-800">
                  EventHub
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="px-4 text-gray-500 focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-64 px-4 py-2 pl-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>
              <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                <span className="text-sm font-medium">JD</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex font-poppins">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-64 bg-white h-[calc(100vh-64px)] border-r">
            <div className="p-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" /> Create Event
              </button>
            </div>
            <nav className="mt-4">
              <a
                href="#"
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                <Calendar className="h-5 w-5 mr-3" /> All Events
              </a>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                <Users className="h-5 w-5 mr-3" /> My Events
              </a>
            </nav>
          </div>
        )}

        {/* Event List */}
        <div className="flex-1 font-poppins p-8">
          <div className="max-w-7xl mx-auto">
            <ErrorMessage />
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800">
                Upcoming Events
              </h1>
              <p className="text-gray-600">Manage and track your events</p>
            </div>

            {/* Event Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {event.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowEditModal(true);
                          }}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowDeleteModal(true);
                          }}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                        <span
                          className={`px-2 py-1 text-xs font-medium bg-blue-${event.status === "Active" ? "100" : "200"} text-blue-${event.status === "Active" ? "800" : "600"} rounded-full`}
                        >
                          {event.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {event.description}
                    </p>
                    {/* Event Details */}
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="h-4 w-4 mr-2" /> {event.date} at{" "}
                        {event.time}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="h-4 w-4 mr-2" /> {event.location}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Users className="h-4 w-4 mr-2" /> {event.attendees}{" "}
                        attendees
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-600">
                        {event.category}
                      </span>
                      <button
                        onClick={() => alert("View Details")}
                        className={`px-[1rem] py-[0.5rem] text-sm font-medium text-black hover:bg-blue-50 rounded-md`}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modals for Create, Edit and Delete Events */}
        {showCreateModal && (
          <CreateEventModal
            setShowCreateModal={setShowCreateModal}
            setAllEvents={setAllEvents}
          />
        )}
        {showDeleteModal && (
          <DeleteConfirmationModal
            event={selectedEvent}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedEvent(null);
            }}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        )}
        {showEditModal && selectedEvent && (
          <EditEventModal
            selectedEvent={selectedEvent}
            setShowEditModal={setShowEditModal}
            setAllEvents={setAllEvents}
            setSelectedEvent={setSelectedEvent}
          />
        )}
      </div>
    </div>
  );
};

export default EventDashboard;
