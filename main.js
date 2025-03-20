const { app, BrowserWindow, ipcMain } = require("electron");
const puppeteer = require("puppeteer");
const path = require("path");

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile("index.html");
});

ipcMain.on("buscar-alojamientos", async (event, localidad) => {
    console.log(`Buscando alojamientos en: ${localidad}`); // DEBUG

    const browser = await puppeteer.launch({ headless: false, slowMo: 100 });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    const url = `https://www.airbnb.com/s/${encodeURIComponent(localidad)}/homes`;
    await page.goto(url, { waitUntil: "networkidle2" });

    await page.waitForSelector("div[data-testid='card-container']");

    const alojamientos = await page.evaluate(() => {
        return [...document.querySelectorAll("div[data-testid='card-container']")].map(item => {
            const titulo = item.querySelector("div[data-testid='listing-card-title']")?.innerText.trim() || "No disponible";
            const precio = item.querySelector("span._hb913q")?.innerText.trim() || "No disponible";
            const valoracion = item.querySelector(".r4a59j5")?.innerText.trim() || "No disponible";
            const enlace = item.querySelector("a") ? "https://www.airbnb.com" + item.querySelector("a").getAttribute("href") : "#";
            return { titulo, precio, valoracion, enlace };
        });
    });
    

    // console.log("Resultados extraídos:", alojamientos); // DEBUG
    event.reply("resultados-alojamientos", alojamientos);

    await browser.close();
});
