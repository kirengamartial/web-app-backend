import Test from '../models/TestModel.js';

export const createTest = async (req, res) => {
    try {
        const { type, score, result } = req.body;
        const userId = req.user._id; 
        const newTest = await Test.create({
            userId,
            type,
            score,
            result
        });

        res.status(201).json({
            success: true,
            message: 'Test marked successfully',
            data: newTest
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to create test'
        });
    }
};


export const getTestsByUserId = async (req, res) => {
    try {
        const userId = req.user._id;

        const tests = await Test.find({ userId })
            .sort({ createdAt: -1 }); 

        if (!tests.length) {
            return res.status(404).json({
                success: false,
                message: 'No tests found for this user'
            });
        }

        res.status(200).json({
            success: true,
            count: tests.length,
            data: tests
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to retrieve tests'
        });
    }
};