import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const DEST_DIR = path.join(process.cwd(), 'Graficos');

(async () => {
    console.log('Starting puppeteer...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 60000 });

    // Wait for the animations to start a bit
    await new Promise(r => setTimeout(r, 4000));

    console.log('Hiding text layers for background capture...');
    await page.evaluate(() => {
        // Hide .z-10 elements
        const z10 = document.querySelectorAll('.z-10');
        z10.forEach(el => {
            el.style.opacity = '0';
        });
    });

    // Wait a bit
    await new Promise(r => setTimeout(r, 1000));

    console.log('Capturing background...');
    await page.screenshot({
        path: path.join(DEST_DIR, 'Fondo_Aurora_Antigravity.png')
    });

    console.log('Done!');
    await browser.close();
})();
