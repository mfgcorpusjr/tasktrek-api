const express = require("express");
const { z } = require("zod");

const app = express();
app.use(express.json());

const tasks = [
  {
    id: 1,
    text: "Finish math homework",
    tags: ["school", "math"],
    status: "PENDING",
  },
  {
    id: 2,
    text: "Clean my room",
    tags: ["home", "chores"],
    status: "COMPLETED",
  },
  {
    id: 3,
    text: "Practice guitar",
    tags: ["music", "practice"],
    status: "PENDING",
  },
  {
    id: 4,
    text: "Read a chapter of a book",
    tags: ["reading", "personal"],
    status: "IN_PROGRESS",
  },
  {
    id: 5,
    text: "Prepare for science test",
    tags: ["school", "science"],
    status: "PENDING",
  },
];

const upsertTaskSchema = z.object({
  text: z.string().min(5),
  tags: z.array(z.string()).min(1),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
});

app.get("/tasks", (req, res) => {
  res.json({ status: "SUCCESS", data: tasks });
});

app.get("/tasks/:id", (req, res) => {
  const id = +req.params.id;
  const task = tasks.find((task) => task.id === id);
  if (!task) {
    return res.status(404).json({ status: "ERROR", message: "Task not found" });
  }

  res.json({ status: "SUCCESS", data: task });
});

app.post("/tasks", (req, res) => {
  const result = upsertTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ status: "ERROR", error: result.error.flatten().fieldErrors });
  }

  tasks.push(result.data);

  res.status(201).json({ status: "SUCCESS", data: result.data });
});

app.patch("/tasks/:id", (req, res) => {
  const id = +req.params.id;
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return res.status(404).json({ status: "ERROR", message: "Task not found" });
  }

  const result = upsertTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ status: "ERROR", error: result.error.flatten().fieldErrors });
  }

  tasks[index] = { ...tasks[index], ...result.data };

  res.json({ status: "SUCCESS", data: tasks[index] });
});

app.delete("/tasks/:id", (req, res) => {
  const id = +req.params.id;
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return res.status(404).json({ status: "ERROR", message: "Task not found" });
  }

  tasks.splice(index, 1);

  res.json({ status: "SUCCESS", message: "Task deleted successfully" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
