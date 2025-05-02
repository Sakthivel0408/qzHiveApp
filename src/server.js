const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const { MongoClient } = require('mongodb');
let mongCli;
let users_coll;
let quizzes_coll;
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'myverysecretkey12345';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../../quiza_hive')));

app.post('/logging', async function (req, res) {
    const { username, password } = req.body;
    const user = await users_coll.findOne({ username: username, password: password });
    if (!user) {
        console.log("Invalid username or password.");
        return res.status(400).send("Invalid username or password.");
    } else {
        console.log(user);
        const payload = {
            username: user.username,
            fullName: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        };
        const token = jwt.sign(
            payload,
            SECRET_KEY
        );
        return res.status(200).json({ token: token, role: user.role });
    }
});

app.post('/insert', async function (req, res) {
    console.log(req.body);
    const { fullname, gender, email, country_code, phone, username, password } = req.body;

    const existingUser = await users_coll.findOne({ username: username });
    if (existingUser) {
        return res.status(200).json({ message: "User Already Exists!", msg_clr: "red" });
    }
    await users_coll.insertOne({ name: fullname, gender: gender, email: email, country_code: country_code, phone: phone, username: username, password: password, role: "User" });
    return res.status(200).json({ message: "Successful Registration!", msg_clr: "green" });
});

app.post('/api/reset-password', async function (req, res) {
    try {
        const { oldPassword, newPassword } = req.body;

        // Extract the username from the token (assuming JWT is used)
        const token = req.headers.authorization?.split(' ')[1];
        console.log('Token:', token);
        if (!token) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, SECRET_KEY);
            console.log('Decoded payload:', decoded);
        } catch (error) {
            return res.status(401).send({ message: "Invalid token" });
        }

        const username = decoded.username;

        // Find the user
        const user = await users_coll.findOne({ username });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Check if the old password matches
        if (user.password !== oldPassword) {
            return res.status(400).send({ message: "Old password is incorrect" });
        }

        // Update the password
        const updateResult = await users_coll.updateOne(
            { username },
            { $set: { password: newPassword } }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(500).send({ message: "Failed to update password" });
        }

        res.status(200).send({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

app.get('/api/quizzes', async function (req, res) {
    try {
        const quizzes = await quizzes_coll.find().toArray();
        console.log("hello");
        res.json(quizzes);
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).send("Error fetching quizzes");
    }
});

app.get('/api/quiz/:code', async function (req, res) {
    try {
        const quizCode = req.params.code;
        const quiz = await quizzes_coll.findOne({ code: quizCode });

        if (!quiz) {
            console.error(`Quiz with code ${quizCode} not found.`);
            return res.status(404).send({ message: "Quiz not found" });
        }

        console.log(`Fetched quiz with code ${quizCode}:`, quiz);

        if (!quiz.questions || quiz.questions.length === 0) {
            console.error(`Quiz with code ${quizCode} has no questions.`);
            return res.status(400).send({ message: "Quiz has no questions." });
        }

        res.json(quiz);
    } catch (error) {
        console.error("Error fetching quiz:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

// filepath: d:\Programming\Angular\qzHiveApp\src\server.js
app.delete('/api/delete-quiz/:id', async function (req, res) {
    // console.log("vantu");
    // console.log(req.params);
    try {
        const quizId = req.params.id;
        console.log(quizId);

        // Validate the ID format
        const ObjectId = require('mongodb').ObjectId;
        if (!ObjectId.isValid(quizId)) {
            console.error('Invalid quiz ID format.');
            return res.status(400).send({ message: "Invalid quiz ID format" });
        }

        const quizObjectId = new ObjectId(quizId);
        // console.log(quizObjectId);

        // Find the quiz by its ID
        const quiz = await quizzes_coll.findOne({ _id: quizObjectId });
        if (!quiz) {
            console.error('Quiz not found!');
            return res.status(404).send({ message: "Quiz not found" });
        }

        // Delete the quiz
        const result = await quizzes_coll.deleteOne({ _id: quizObjectId });
        if (result.deletedCount === 0) {
            console.error('Failed to delete the quiz.');
            return res.status(500).send({ message: "Failed to delete the quiz" });
        }

        console.log(`Quiz with ID ${quizId} deleted successfully.`);
        res.status(200).send({ message: "Quiz deleted successfully" });
    } catch (error) {
        console.error("Error deleting the quiz:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

app.post('/update-profile', async function (req, res) {
    try {
        const { username, fullName, email, phone } = req.body;

        if (!username) {
            return res.status(400).send("Username is required.");
        }

        const updatedUser = await users_coll.findOneAndUpdate(
            { username: username },
            { $set: { name: fullName, email: email, phone: phone } },
            { returnDocument: 'after' }
        );
        console.log(updatedUser);
        if (!updatedUser) {
            return res.status(400).send("User not found.");
        }

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser.value });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).send("Internal server error");
    }
});

// Generate unique quiz code
const generateQuizCode = async () => {
    const chars = '0123456789';
    let code;
    let exists;
    do {
        code = '';
        for (let i = 0; i < 4; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        exists = await quizzes_coll.findOne({ code });
    } while (exists);
    return code;
};

// POST /api/quiz - Create a new quiz
app.post('/api/quiz', async (req, res) => {
    try {
        const { title, description, category, difficulty, tags, questions } = req.body;

        // Validation
        if (!title || !description || !category || !difficulty || !questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: 'Missing required fields or invalid questions array' });
        }

        if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
            return res.status(400).json({ error: 'Difficulty must be Easy, Medium, or Hard' });
        }

        for (const question of questions) {
            if (!question.questionText || !Array.isArray(question.options) || question.options.length !== 4 || question.correctOptionIndex == null || question.correctOptionIndex < 0 || question.correctOptionIndex >= 4) {
                return res.status(400).json({ error: 'Invalid question format or correct option index' });
            }
            if (question.options.some(opt => !opt)) {
                return res.status(400).json({ error: 'All options must be non-empty' });
            }
        }

        // Generate quiz code
        const code = await generateQuizCode();

        // Create quiz
        const quiz = {
            title,
            description,
            category,
            difficulty,
            tags: tags || [],
            questions,
            code,
            createdAt: new Date()
        };

        // Save to database
        await quizzes_coll.insertOne(quiz);

        res.status(201).json(quiz);
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ error: 'Failed to create quiz' });
    }
});

app.put('/api/update-quiz/:id', async function (req, res) {
    try {
        const quizId = req.params.id;
        const { title, description, category, difficulty, tags, questions } = req.body;

        // Validate the ID format
        const ObjectId = require('mongodb').ObjectId;
        if (!ObjectId.isValid(quizId)) {
            console.error('Invalid quiz ID format.');
            return res.status(400).send({ message: "Invalid quiz ID format" });
        }

        const quizObjectId = new ObjectId(quizId);

        // Validate input fields
        if (!title || !description || !category || !difficulty || !questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: 'Missing required fields or invalid questions array' });
        }

        if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
            return res.status(400).json({ error: 'Difficulty must be Easy, Medium, or Hard' });
        }

        for (const question of questions) {
            if (!question.questionText || !Array.isArray(question.options) || question.options.length !== 4 || question.correctOptionIndex == null || question.correctOptionIndex < 0 || question.correctOptionIndex >= 4) {
                return res.status(400).json({ error: 'Invalid question format or correct option index' });
            }
            if (question.options.some(opt => !opt)) {
                return res.status(400).json({ error: 'All options must be non-empty' });
            }
        }

        // Update the quiz in the database
        const updatedQuiz = await quizzes_coll.findOneAndUpdate(
            { _id: quizObjectId },
            {
                $set: {
                    title,
                    description,
                    category,
                    difficulty,
                    tags: tags || [],
                    questions,
                    updatedAt: new Date()
                }
            },
            { returnDocument: 'after' }
        );

        if (!updatedQuiz.value) {
            return res.status(404).send({ message: "Quiz not found" });
        }

        res.status(200).json({ message: "Quiz updated successfully", quiz: updatedQuiz.value });
    } catch (error) {
        console.error("Error updating quiz:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

app.post('/api/submit-quiz', async function (req, res) {
    try {
        const { quizCode, score } = req.body;

        // Extract the username from the token (assuming JWT is used)
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, SECRET_KEY);
        } catch (error) {
            return res.status(401).send({ message: "Invalid token" });
        }

        const username = decoded.username;

        // Find the user
        const user = await users_coll.findOne({ username });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Update the user's document with the quiz code and score
        const updateResult = await users_coll.updateOne(
            { username },
            {
                $push: { quiz_attended_and_score: { quizCode, score } }
            }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(500).send({ message: "Failed to update user data" });
        }

        res.status(200).send({ message: "Quiz submission successful" });
    } catch (error) {
        console.error("Error submitting quiz:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

app.get('/api/leaderboard', async function (req, res) {
    try {
        const quizCode = req.query.quizCode; // Optional query parameter for filtering by quiz code

        // Build the query
        const query = quizCode
            ? { "quiz_attended_and_score.quizCode": quizCode }
            : {};

        // Aggregate leaderboard data
        const leaderboard = await users_coll.aggregate([
            { $match: query },
            { $unwind: "$quiz_attended_and_score" },
            {
                $group: {
                    _id: "$username",
                    totalScore: { $sum: "$quiz_attended_and_score.score" }
                }
            },
            { $sort: { totalScore: -1 } },
            { $limit: 10 },
            {
                $project: {
                    username: "$_id", // Rename _id to username
                    totalScore: 1,
                    _id: 0 // Exclude _id from the final result
                }
            }
        ]).toArray();
        console.log(leaderboard);
        // Fetch distinct quiz codes for filtering options
        const quizCodes = await quizzes_coll.distinct("code");

        res.status(200).json({ leaderboard, quizCodes });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

app.listen(5000, async function () {
    mongCli = await MongoClient.connect("mongodb://localhost:27017/");
    users_coll = await mongCli.db('qzhive').collection('users');
    quizzes_coll = await mongCli.db('qzhive').collection('quizzes');
    console.log("Server is running on http://localhost:5000");
});
