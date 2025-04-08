import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const csvFilePath = path.join(__dirname, 'data.csv');
  const jsonFilePath = path.join(__dirname, 'output.json');

  // Read the CSV file
  const csvData = fs.readFileSync(csvFilePath, 'utf-8');
  const rows = csvData.split('\n');

  const result = [];

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const row of rows) {
    const [text] = row.split(',');
    if (!text) continue;

    const url = `https://commons.wikimedia.org/wiki/File:${text}-bw.png`;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      console.log(page.url());

      // Use $$eval to find the <a> element with the desired href pattern
      const imageUrl = await page.$$eval('div.fullImageLink > a', (anchors) => {
        const anchor = anchors[0]; // Select the first matching <a> element
        return anchor ? anchor.href : null;
      });

      if (!imageUrl) {
        console.error(`Image not found for ${text}`);
        result.push({ text, imageUrl: '/placeholder.svg' });
        continue;
      }

      result.push({ text, imageUrl });
    } catch (error) {
      console.error(`Error processing ${text}:`, error);
      result.push({ text, imageUrl: '/placeholder.svg' });
    }
  }

  await browser.close();

  // Write the result to a JSON file
  fs.writeFileSync(jsonFilePath, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`Data has been written to ${jsonFilePath}`);
}

main().catch((error) => {
  console.error('Error in main():', error);
});
