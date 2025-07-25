import { MainTodo } from "../models/main_todo.model.js";
import { SubTodo } from "../models/sub_todo.model.js";

export const createSubTodo = async (req, res) => {
  try {
    const { taskName, comment, description, slug, color, textColor } = req.body;
    const user = req.user;
    const mainTodo = await MainTodo.findOne({ slug });

    if (!mainTodo) {
      return res.status(400).send({
        success: false,
        error: "Main Todo Not available",
      });
    }

    if (!taskName || taskName === "" || taskName == null) {
      return res.status(400).send({
        success: false,
        error: "Task Name is required",
      });
    }
    const exitsTask = await SubTodo.findOne({
      taskName: taskName.toLowerCase(),
    });

    if (exitsTask) {
      return res.status(400).send({
        success: false,
        error: "Already Exist task",
      });
    }

    if (!exitsTask) {
      const newTask = new SubTodo({
        taskName,
        comment: comment || "No comment",
        description: description || "No description",
        author: user._id,
        mainTodo: mainTodo._id,
        color,
        textColor,
      });

      await newTask.save();

      return res.status(201).send({
        success: true,
        task: newTask,
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      error: error.message,
    });
  }
};

export const getAllTodos = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).send({
        success: false,
        error: "Slug is required",
      });
    }

    const existMainTodo = await MainTodo.findOne({ slug });

    if (!existMainTodo) {
      return res.status(404).send({
        success: false,
        error: "Main TODO not found",
      });
    }

    const user = req.user;

    if (!user) {
      return res.status(401).send({
        success: false,
        error: "Unauthorized access",
      });
    }

    const SubTodos = await SubTodo.find({ mainTodo: existMainTodo._id });

    if (SubTodos.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No SubTodos available",
        tasks: [],
      });
    }

    return res.status(200).send({
      success: true,
      count: SubTodos.length,
      tasks: SubTodos,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error: error.message,
    });
  }
};

export const editSubTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { taskName, description, color, textColor, complete } = req.body;
    const user = req.user;

    if (!id || !user) {
      return res.status(400).json({
        success: false,
        message: "User or SubTodo ID is missing",
      });
    }

    const updatedTodo = await SubTodo.findByIdAndUpdate(
      id,
      { taskName, description, color, textColor, complete },
  
    );

    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        message: "SubTodo not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "SubTodo updated successfully",
      todo: updatedTodo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteSubTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    // if (!id || !user) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "User or SubTodo ID is missing",
    //   });
    // }

    const deleted = await SubTodo.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "SubTodo not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "SubTodo deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
