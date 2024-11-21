const express = require('express');
const executeQuery = require('../db');
const router = express.Router();

// GET: 키와 체중 정보 조회
router.get('/', async (req, res) => {
  try {
    const records = await executeQuery('SELECT * FROM bongjini');
    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST: 새로운 키와 체중 정보 추가
router.post('/', async (req, res) => {
  try {
    // JWT 또는 헤더에서 사용자 ID 가져오기 (예: API Gateway의 Lambda Authorizer 설정)
    const userID = req.headers['x-user-id']; // 헤더에서 사용자 ID를 추출
    if (!userID) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { Height, Weight } = req.body;

    // 입력 데이터 검증
    if (!Height || !Weight) {
      return res.status(400).json({ error: 'Height and Weight are required' });
    }

    // 데이터 삽입
    await executeQuery(
      'INSERT INTO bongjini (ID, Height, Weight) VALUES (:ID, :Height, :Weight)',
      [
        { name: 'ID', value: { stringValue: userID } },
        { name: 'Height', value: { longValue: Height } },
        { name: 'Weight', value: { longValue: Weight } },
      ]
    );

    res.status(201).json({ message: 'Height and Weight added successfully' });
  } catch (error) {
    console.error('Error adding height and weight:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE: 키와 체중 정보 삭제
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 데이터 삭제
    await executeQuery('DELETE FROM bongjini WHERE ID = :ID', [
      { name: 'ID', value: { stringValue: id } },
    ]);

    res.status(200).json({ message: 'Height and Weight deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
