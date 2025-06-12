import express from 'express';
import {PrismaClient} from '@prisma/client';
import { validateTask } from './middleware.js';

const app = express();
const client = new PrismaClient();

app.use(express.json());

app.post('/tasks',validateTask, async (req, res) => {
  try {
    const { title, description,isCompleted } = req.body;
    const task = await client.task.create({
      data: {
        title: title,
        description:description,
        isCompleted: isCompleted || false,
      },
    });
    res.status(201).json(task);
  } catch (e) {
    console.log('Error creating task:', e);
    res.status(500).json({ message: 'Something went wrong. Try again Later!' });
  }
});

app .get('/tasks', async (req, res) => {
    try {
    const tasks = await client.task.findMany({
        where: {
          isCompleted: false, 
        },
    });
    res.status(200).json(tasks);
    } catch (e) {
    console.log('Error getting tasks:', e);
    res.status(500).json({ message: 'Something went wrong. Try again Later!' });
    }
  });

 app.get('/tasks/id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await client.task.findUnique({
      where: { id: parseInt(id) },
    });
    if (tasks) {
        res.status(200).json(tasks);
    }else{
       res.status(404).json({ message: 'Task was not found' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Something went wrong. Try again Later!' });
  }
});

  app.patch('/tasks/:id',validateTask, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isCompleted } = req.body;
    const task = await client.task.update({
      where: {
         id: parseInt(id)
         },
      data: { 
        title: title && title,
        description: description && description,
        isCompleted: isCompleted && isCompleted,
         },
    });
    res.status(200).json(task);
  } catch (e) {
    console.error('Error updating task:', e);
    res.status(500).json({ message: 'Something went wrong. Try again Later!' });
  }
});

  app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await client.task.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (e) {
    console.error('Error deleting task:', e);
    res.status(500).json({ message: 'Something went wrong. Try again Later!' });
  }
});
let port;
if (process.env.PORT) {
  port = process.env.PORT;
}else {
  port = 3000;
}
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});