const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidate");
const User = require("../models/user");
const { jwtAuthMiddleware } = require("../jwt");

async function checkAdminRole(id) {
    try {
        const user = await User.findById(id);
        return (user.role === "admin");
    } catch (err) {
        return false;
    }

}

router.route("/").post(jwtAuthMiddleware, async (req, res) => {
    try {

        const { id } = req.user.userData;
        if (!await checkAdminRole(id)) return res.status(403).json({ error: "You don't have access" });

        const formData = req.body;
        const newCandidate = new Candidate(formData);
        const savedCandidate = await newCandidate.save();
        console.log("New Candidate Saved to DB : ", savedCandidate);
        return res.status(200).json(savedCandidate);

    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


router.route("/:candidateId").put(jwtAuthMiddleware, async (req, res) => {
    try {
        const { id } = req.user.userData;
        if (!await checkAdminRole(id)) return res.status(403).json({ error: "You don't have access" });


        const { candidateId } = req.params;
        const updatedData = req.body;

        const updatedCandidate = await Candidate.findByIdAndUpdate(candidateId, updatedData, {
            runValidators: true,
            new: true
        });

        if (!updatedCandidate) return res.status(404).json({ error: "Candidate Not Found" });

        console.log("Candidate data Updated");
        return res.status(200).json(updatedCandidate);


    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

router.route("/:candidateId").delete(jwtAuthMiddleware, async (req, res) => {
    try {
        const { id } = req.user.userData;
        if (!await checkAdminRole(id)) return res.status(403).json({ error: "You don't have access" });


        const { candidateId } = req.params;
        const deletedCandidate = await Candidate.findByIdAndDelete(candidateId);

        if (!deletedCandidate) return res.status(404).json({ error: "Candidate Not Found" });

        console.log("Candidate Deleted : ", deletedCandidate);
        return res.status(200).json({ deletedCandidate: deletedCandidate });

    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

// get candidates
router.route("/").get(async (req, res) => {
    try {
        const candidates = await Candidate.find();
        if (candidates.length === 0) return res.status(200).json({ oops: "No candidate found" });
        return res.status(200).json(candidates);
    } catch (err) {
        console.log("error on getting candidates list : ", err);
        return res.status(500).json({ error: "Internal server error" });
    }
})

// voting routes
router.route("/vote/:candidateId").post(jwtAuthMiddleware, async (req, res) => {
    try {
        // no admin can vote
        // user can vote only one time
        const { id } = req.user.userData;
        const user = await User.findById(id);

        if (user.role == "admin") return res.status(403).json({ message: "Admin is not allowed to give vote" });
        if (user.isVoted) return res.status(403).json({ message: "You have already voted" });

        const { candidateId } = req.params;
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) return res.status(404).json({ error: "Candidate not found" });

        candidate.votes.push({ user: user.id });
        candidate.voteCount++;
        await candidate.save();

        // updating user document
        user.isVoted = true;
        await user.save();

        return res.status(200).json({ message: "voted successfully" })
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" })
    }
})

router.route("/vote/counts").get(async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ voteCounts: "desc" });
        const voteRecord  = candidates.map((candidate) => {
            return { party: candidate.party, totalVotes: candidate.voteCount }
        })
       
        return res.status(200).json(voteRecord);
      
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" })
    }
})
module.exports = router;