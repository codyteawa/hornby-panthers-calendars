import { createIcsFromFixtures } from './calendar-builder.js';
import { getFixturesApi, COMP_IDS, GRADE_IDS, ORG_IDS } from './sporty-api.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { statusCode, body: resBody } = await getFixturesApi({
    compId: COMP_IDS['OPEN_GRADE_HADLEY'],
    orgId: ORG_IDS['RICCARTON'],
    gradeId: GRADE_IDS['SATURDAY']
});

console.log(`Status: ${statusCode}`);
const responseText = await resBody.text();
const jsonResponse = JSON.parse(responseText);
console.log(jsonResponse);

const icsContent = createIcsFromFixtures(jsonResponse.Fixtures, `Riccarton C - 2025 Games`);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the existing .ics file (in repo root, one level up)
const outputPath = path.resolve(__dirname, '../2025_riccarton_c_game_calendar.ics');

// Check if file exists and is identical
let existingContent = '';
if (fs.existsSync(outputPath)) {
  existingContent = fs.readFileSync(outputPath, 'utf-8');
}

if (existingContent === icsContent) {
  console.log('No changes to calendar file. Exiting.');
  process.exit(0); // success, but nothing to commit
}

// Write new file
fs.writeFileSync(outputPath, icsContent, 'utf-8');
process.exit(10); // indicate "change occurred"