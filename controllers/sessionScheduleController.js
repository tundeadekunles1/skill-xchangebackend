import SessionSchedule from "../models/SessionSchedule.js";
import Session from "../models/Session.js";

export const scheduleSession = async (req, res) => {
  try {
    const {
      sessionId,
      totalWeeks,
      sessionsPerWeek,
      startDate,
      timeSlot,
      daysOfWeek = [1, 3], // Default to Monday and Wednesday
      initialNotes,
      learningObjectives,
    } = req.body;
    console.log("Request Body for Scheduling:", req.body);

    // Validate required fields
    if (!sessionId || !startDate || !timeSlot) {
      return res.status(400).json({
        message:
          "Missing required fields: sessionId, startDate, startTime, endTime",
      });
    }

    // Validate daysOfWeek array
    if (!Array.isArray(daysOfWeek) || daysOfWeek.length === 0) {
      return res
        .status(400)
        .json({ message: "Please select at least one day for sessions" });
    }

    // Validate sessions per week
    if (sessionsPerWeek < 1 || sessionsPerWeek > 7) {
      return res
        .status(400)
        .json({ message: "Sessions per week must be between 1 and 7" });
    }

    // Validate that the number of selected days is sufficient for sessionsPerWeek
    if (daysOfWeek.length < sessionsPerWeek) {
      return res.status(400).json({
        message:
          "Number of selected days cannot be less than sessions per week",
      });
    }

    // Find the existing Session to schedule
    const sessionToSchedule = await Session.findById(sessionId);

    if (!sessionToSchedule) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (sessionToSchedule.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Session is not in pending status" });
    }
    // Generate child sessions for the SessionSchedule
    const childSessions = [];
    const start = new Date(startDate);
    const selectedDaysSet = new Set(daysOfWeek);

    for (let week = 0; week < totalWeeks; week++) {
      let sessionsThisWeek = 0;
      const currentWeekStart = new Date(start);
      currentWeekStart.setDate(start.getDate() + week * 7);

      for (
        let dayOffset = 0;
        dayOffset < 7 && sessionsThisWeek < sessionsPerWeek;
        dayOffset++
      ) {
        const currentDate = new Date(currentWeekStart);
        currentDate.setDate(currentWeekStart.getDate() + dayOffset);
        const dayOfWeek = currentDate.getDay(); // 0 (Sun) to 6 (Sat)

        if (selectedDaysSet.has(dayOfWeek)) {
          const sessionDate = new Date(currentDate);
          childSessions.push({
            date: sessionDate,
            originalDate: new Date(sessionDate), // Set originalDate here
            timeSlot,
            status: "scheduled",
            notes: initialNotes || "",
            materialsCovered: learningObjectives
              ? learningObjectives.map((obj) => ({ topic: obj }))
              : [],
          });
          sessionsThisWeek++;
        }
      }
    }

    // Create the new SessionSchedule
    const newSessionSchedule = new SessionSchedule({
      sessionId: sessionToSchedule._id, // Reference the existing Session's _id
      status: "scheduled", // Initial status of the schedule
      startDate,
      totalWeeks,
      sessionsPerWeek,
      preferredDays: daysOfWeek,
      timeSlot,
      allSessions: childSessions,
      notes: initialNotes || "",
      learningObjectives: learningObjectives
        ? learningObjectives.map((obj) => ({ topic: obj }))
        : [],
    });

    await newSessionSchedule.save();

    // Update the status of the existing Session to "scheduled"
    sessionToSchedule.status = "scheduled";
    await sessionToSchedule.save();

    res.status(201).json({
      success: true,
      data: { session: sessionToSchedule, schedule: newSessionSchedule },
    });
  } catch (err) {
    console.error("Scheduling error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to schedule session",
    });
  }
};

// Update specific class session
export const updateClassSession = async (req, res) => {
  try {
    const { scheduleId, sessionId } = req.params;
    const { status, notes, materials, attendance, newDate, reason } = req.body;

    const schedule = await SessionSchedule.findById(scheduleId);
    if (!schedule)
      return res.status(404).json({ message: "Schedule not found" });

    const session = schedule.allSessions.id(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Validate status transition
    const validTransitions = {
      scheduled: ["completed", "cancelled", "rescheduled"],
      cancelled: ["rescheduled"],
      rescheduled: ["completed", "cancelled"],
    };

    if (
      status &&
      validTransitions[session.status] &&
      !validTransitions[session.status].includes(status)
    ) {
      return res.status(400).json({
        message: `Invalid status transition from ${session.status} to ${status}`,
      });
    }

    // Apply updates
    if (status) session.status = status;
    if (notes) session.notes = notes;
    if (materials) session.materialsCovered = materials;
    if (attendance)
      session.attendance = { ...session.attendance, ...attendance };

    // Handle rescheduling
    if (status === "rescheduled" && newDate) {
      schedule.rescheduleHistory.push({
        originalDate: session.date,
        newDate,
        reason: reason || "",
      });
      session.date = newDate;
    }

    // Handle cancellation
    if (status === "cancelled") {
      schedule.cancellationHistory.push({
        date: new Date(),
        reason: reason || "",
        rescheduledTo: status === "rescheduled" ? newDate : null,
      });
    }

    await schedule.save();
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get schedule progress
export const getScheduleProgress = async (req, res) => {
  try {
    const schedule = await SessionSchedule.findById(
      req.params.scheduleId
    ).select("progress allSessions.status");

    if (!schedule)
      return res.status(404).json({ message: "Schedule not found" });

    res.json({
      completionPercentage: schedule.progress.completionPercentage,
      totalSessions: schedule.allSessions.length,
      completedSessions: schedule.allSessions.filter(
        (s) => s.status === "completed"
      ).length,
      lastUpdated: schedule.progress.lastUpdated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSchedulesForUser = async (req, res) => {
  const userId = req.user.id;

  try {
    // Find all sessions where the user is either the teacher or learner
    const sessions = await Session.find({
      $or: [{ teacherId: userId }, { learnerId: userId }],
    });

    const sessionIds = sessions.map((s) => s._id.toString());

    // Find schedules for those sessions
    const schedules = await SessionSchedule.find({
      sessionId: { $in: sessionIds },
    });

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch schedules", error });
  }
};
