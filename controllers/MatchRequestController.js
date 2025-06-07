import MatchRequest from "../models/MatchRequest.js";

export const approveMatchRequest = async (req, res) => {
  try {
    const matchRequest = await MatchRequest.findById(req.params.id)
      .populate("learnerId", "fullName")
      .populate("teacherId", "fullName");

    if (!matchRequest) {
      return res.status(404).json({ message: "Match request not found" });
    }

    matchRequest.status = "approved";
    await matchRequest.save();

    res.status(200).json({ message: "Match request approved successfully" });
  } catch (error) {
    console.error("Error approving match request:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
