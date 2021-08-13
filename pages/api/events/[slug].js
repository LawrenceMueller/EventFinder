const { events } = require('./data.json');

export default function handler(req, res) {
  const evt = events.filter((ev) => ev.slug === req.query.slug); //Create a variable that is equal to the single event determined by slug

  if (req.method === 'GET') {
    res.status(200).json(evt);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
  res.status(200).json(events);
}
