const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "web_db_mid",
});

// Test database connection
db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // First find user by email
    const findUser = () => {
      return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE email = ?";
        db.query(query, [email], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    const users = await findUser();

    // Check if user exists
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    // Compare password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // If password is valid, send success response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName, // Changed from name to fullName to match registration
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login. Please try again.",
    });
  }
});

// Register endpoint
app.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validate required fields
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists (using promises)
    const checkUser = () => {
      return new Promise((resolve, reject) => {
        const checkUserQuery = "SELECT * FROM users WHERE email = ?";
        db.query(checkUserQuery, [email], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    const existingUser = await checkUser();

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user (using promises)
    const insertUser = () => {
      return new Promise((resolve, reject) => {
        const insertUserQuery =
          "INSERT INTO users (Name, email, password) VALUES (?, ?, ?)";
        const values = [fullName, email, hashedPassword];

        db.query(insertUserQuery, values, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    await insertUser();

    // Send success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during registration. Please try again.",
    });
  }
});

app.post("/send-event", async (req, res) => {
  try {
    const {
      title,
      date,
      time,
      location,
      attendees,
      description,
      category,
      status,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !date ||
      !time ||
      !location ||
      !attendees ||
      !description ||
      !category ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if event already exists (using promises)
    const checkEvent = () => {
      return new Promise((resolve, reject) => {
        const checkEventQuery = "SELECT * FROM events WHERE title = ?";
        db.query(checkEventQuery, [title], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    const existingEvent = await checkEvent();

    if (existingEvent.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Event already exists",
      });
    }

    // Insert new event (using promises)
    const insertEvent = () => {
      return new Promise((resolve, reject) => {
        const insertEventQuery =
          "INSERT INTO events (title, date, time, location, attendees, description, category, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
          title,
          date,
          time,
          location,
          attendees,
          description,
          category,
          status,
        ];

        db.query(insertEventQuery, values, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    await insertEvent();

    // Send success response
    return res.status(201).json({
      success: true,
      message: "Event added successfully",
    });
  } catch (error) {
    console.error("Event error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during event. Please try again.",
    });
  }
});

app.get("/events-data", async (req, res) => {
  try {
    const getEvents = () => {
      return new Promise((resolve, reject) => {
        const query = "SELECT * FROM events ORDER BY title DESC";
        db.query(query, (err, result) => {
          if (err) {
            reject(err);
          } else {
            
            const formattedEvents = [];
            
            result.forEach(event => {
              const date = new Date(event.date);
              
              const formattedEvent = {
                ...event,
                date: date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: '2-digit'
                }),
                time: date.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                }).toLowerCase()
              };
              
              formattedEvents.push(formattedEvent);
            });

            // If you need to process the last event differently
            // you can use pop() and then push() it back
            const lastEvent = formattedEvents.pop();
            if (lastEvent) {
              // You can modify the last event here if needed
              formattedEvents.push(lastEvent);
            }
            
            resolve(formattedEvents);
          }
        });
      });
    };
    
    const events = await getEvents();
    return res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Event error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during event. Please try again.",
    });
  }
});

app.put("/update-event/:event_id", async (req, res) => {

  try {
    const { id, title, date, time, location, attendees, description, category, status } = req.body;
    const query =
      "UPDATE events SET title = ?, date = ?, time = ?, location = ?, attendees = ?, description = ?, category = ?, status = ? WHERE id = ?";
    db.query(query, [title, date, time, location, attendees, description, category, status, id],
      function (err, results) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "An error occurred during event update. Please try again.",
          });
        }
        res.status(200).json({
          success: true,
          message: "Event updated successfully",
        });
      }
    );
  } catch (error) {
    console.error("Event update error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during event update. Please try again.",
    });
  }
});

app.delete("/delete-event/:event_id", async (req, res) => {
  
  try {
    const eventId = req.params.event_id;
    const query = "DELETE FROM events WHERE id = ?";
    db.query(query, [eventId], function (err, results) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "An error occurred during event deletion. Please try again.",
        });
      }
      res.status(200).json({
        success: true,
        message: "Event deleted successfully",
      });
    });
  } catch (error) {
    console.error("Event deletion error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during event deletion. Please try again.",
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Handle server errors
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});
