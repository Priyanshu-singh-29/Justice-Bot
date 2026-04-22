const { analyzeCase } = require('./services/aiService');

async function test() {
  try {
    const result = await analyzeCase('Test Title', 'Test description of a robbery case.', 'criminal');
    console.log('Success:', result);
  } catch (error) {
    console.error('Error Details:', error);
  }
}

test();
