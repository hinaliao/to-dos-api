const express = require("express");
const Task = require("../models/Todo");

const router = express();

// list tasks
router.get("/todos", async (req, res) => {
  try {
    const { title = "" } = req.query;

    const taskDb = await Task.find({
      title: { $regex: new RegExp(title, "i") },
    });
    return res.json(taskDb);
    
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

// find one by Id
router.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const foundTask = await Task.findOne({ _id: id });

    if (!foundTask) {
      return res.status(204).json({});
    }
    return res.json(foundTask);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

// post a task
router.post("/todos", async (req, res) => {
  try {
    const { title, completed } = req.body;

    console.log(completed);
    // validation
    if (!title || completed === undefined) {
      return res
        .status(400)
        .json({ msg: "Favor preencher todos os campos da nova tarefa!" });
    }

    // Validação se tarefa informada já existe
    const taskfromDb = await Task.findOne({ title });

    if (taskfromDb) {
      return res
        .status(400)
        .json({ msg: "Tarefa existente. Favor inserir uma tarefa diferente." });
    }

    // creating new task
    const newTaskToDb = new Task({
      title,
      completed,
    });

    await newTaskToDb.save(); // saving task

    return res.status(201).json(newTaskToDb);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

//put
router.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const infoToUpdate = { title, completed };

    const updatedTask = await Task.findOne({ _id: id });

    if (!updatedTask) {
      return res
        .status(400)
        .json({ msg: `Tarefa com o id ${id} não encontrado` });
    }

    for (const info in updatedTask) {
      if (info === "id") continue;
      updatedTask[info] = infoToUpdate[info] || updatedTask[info];
    }

    await updatedTask.save();

    res.json(updatedTask);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

//delete
router.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const foundTask = await Task.findOneAndDelete({ _id: id });

    if (!foundTask) {
      return res.status(204).json({});
    }

    res.json({ message: "Tarefa deletada com sucesso" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
