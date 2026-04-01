// Fixed version of the user hoardings GET endpoint
app.get('/api/user/hoardings', authMiddleware, async (req, res) => {
  try {
    if (!db) {
      console.log('Database not connected - cannot fetch user hoardings');
      return res.status(500).json({
        success: false,
        message: 'Database not available'
      });
    }
    
    const collection = db.collection('hoardings');
    const hoardings = await collection.find(query).sort(sort).toArray();
    res.json({ success: true, data: hoardings });
    
  } catch (error) {
    console.error('Error fetching user hoardings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});
