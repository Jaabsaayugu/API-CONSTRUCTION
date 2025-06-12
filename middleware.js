export function validateTask(req, res, next) {
  const { title, description, isCompleted } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required .' });
  }

  if (!description) {
    return res.status(400).json({ message: 'Description is required.' });
  }

  if (!isCompleted) {
    return res.status(400).json({ message: 'The status of the job should be provided.' });
  }

  next(); 
}
