import Note from "../models/noteModel.js";

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const note = await Note.create({
      title,
      content,
      user: req.user._id
    });

    res.status(201).json({
      status: 'success',
      data: {
        note
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

export const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!note) {
      return res.status(404).json({
        status: 'fail',
        message: 'Note not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        note
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id })
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: notes.length,
      data: {
        notes
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!note) {
      return res.status(404).json({
        status: 'fail',
        message: 'Note not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        note
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

export  const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!note) {
      return res.status(404).json({
        status: 'fail',
        message: 'Note not found'
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

