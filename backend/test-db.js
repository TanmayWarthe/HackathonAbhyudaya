const db = require('./config/database');

async function test() {
  try {
    // Test INSERT
    console.log('Testing INSERT...');
    const insertResult = await db.query(
      'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Test User', `test${Date.now()}@test.com`, 'hashedpw', 'student']
    );
    console.log('INSERT result:', JSON.stringify(insertResult, null, 2));
    console.log('insertId:', insertResult.rows.insertId);
    
    // Test SELECT
    console.log('\nTesting SELECT...');
    const selectResult = await db.query('SELECT * FROM users WHERE id = ?', [insertResult.rows.insertId]);
    console.log('SELECT result:', JSON.stringify(selectResult, null, 2));
    
    // Cleanup
    await db.query('DELETE FROM users WHERE id = ?', [insertResult.rows.insertId]);
    
    process.exit(0);
  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  }
}

test();
