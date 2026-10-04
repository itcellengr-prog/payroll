const express = require('express');
const db = require('./firebase-config');

const router = express.Router();

// Test Firebase Connection
router.get('/api/test', async (req, res) => {
  try {
    const snapshot = await db.collection('test').get();
    res.json({ success: true, message: 'Firebase connected!', count: snapshot.size });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add User to Firebase
router.post('/api/add-user', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email required' });
    }

    const docRef = await db.collection('users').add({
      name: name,
      email: email,
      createdAt: new Date()
    });
    
    res.json({ success: true, id: docRef.id, message: 'User added!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get All Users
router.get('/api/users', async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = [];
    
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    res.json({ success: true, users: users, count: users.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Single User
router.get('/api/users/:id', async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, id: doc.id, data: doc.data() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update User
router.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    await db.collection('users').doc(req.params.id).update({
      name: name,
      email: email,
      updatedAt: new Date()
    });
    
    res.json({ success: true, message: 'User updated!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete User
router.delete('/api/users/:id', async (req, res) => {
  try {
    await db.collection('users').doc(req.params.id).delete();
    res.json({ success: true, message: 'User deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
