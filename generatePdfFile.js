const puppeteer = require("puppeteer");
function get(obj, field, defaultValue) {
  if (obj[field] !== undefined) {
    return obj[field];
  } else {
    return defaultValue;
  }
}
/*
Supported params are 
  * width: unit (text),
  * height: unit (text),
  * marginLeft: unit (text),
  * marginRight: unit (text),
  * marginTop: unit (text),
  * marginBottom: unit (text),
  * format: type (letter, legal, tabloid, Ledger, A0, A1, A2, A3, A4, A5, A6),
  * printBackground: true,
  * headerTemplate: (text),
  * footerTemplate: (text),
  * content: (text),
  * landscape: boolean (false)
*/
let browser;
async function loadEmptyPage() {
  const dummy = "<span class='r'>r</span><span class='b'>b</span>";
  return generatePdfFile({
    headerTemplate: `${dummy}`,
    footerTemplate: `${dummy}`,
    content: `<html><head></head><body>${dummy}</body></html>`,
  });
}
async function startBrowser() {
  if (browser) {
    browser.removeListener("disconnected", startBrowser);
    browser.close();
  }
  console.log("initializing new browser");
  browser = await puppeteer.launch({
    args: [
      "--ignore-certificate-errors",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-web-security",
      "--disable-gpu",
    ],
  });
  browser.on("disconnected", startBrowser);
  await loadEmptyPage();
  return browser;
}
function generateOptions(params) {
  const marginLeft = get(params, "marginLeft", "6.25mm");
  const marginRight = get(params, "marginRight", "6.25mm");
  const marginTop = get(params, "marginTop", "16.25mm");
  const marginBottom = get(params, "marginBottom", "14.11mm");
  const format = normalizeFormat(get(params, "format", "a4"));
  const printBackground = !!get(params, "printBackground", false);
  const landscape = get(params, "landscape", false);
  const headerTemplate = get(params, "headerTemplate");
  const footerTemplate = get(params, "footerTemplate");
  const content = get(
    params,
    "content",
    "<html><head></head><body></body></html>"
  );
  const displayHeaderFooter = !!headerTemplate || !!footerTemplate;
  const options = {
    displayHeaderFooter,
    headerTemplate: headerTemplate,
    footerTemplate: footerTemplate,
    content: content,
    printBackground,
    landscape,
    format,
    height: get(params, "height"),
    width: get(params, "width"),
    margin: {
      left: marginLeft,
      right: marginRight,
      top: marginTop,
      bottom: marginBottom,
    },
  };
  return options;
}
async function generatePdfFile(params) {
  const start = new Date();
  const page = await browser.newPage();
  const { content, ...options } = generateOptions(params);
  let renderedCorrectly = true;
  try {
    await page.setContent(content);
    await page.evaluateHandle("document.fonts.ready");
    const pdf = await page.pdf(options);
    return pdf;
  } catch (error) {
    console.log("something went wrong", error);
    renderedCorrectly = false;
    return null;
  } finally {
    const end = new Date();
    const renderPeriod = `${end - start}ms`;
    console.log(JSON.stringify({ renderPeriod, renderedCorrectly }));
    await page.close();
  }
}

function normalizeFormat(format) {
  return {
    letter: "Letter",
    legal: "Legal",
    tabloid: "Tabloid",
    ledger: "Ledger",
    a0: "A0",
    a1: "A1",
    a2: "A2",
    a3: "A3",
    a4: "A4",
    a5: "A5",
    a6: "A6",
  }[`${format}`.toLowerCase()];
}
function browserActive() {
  if (browser && browser.isConnected()) {
    return true;
  } else {
    return false;
  }
}
module.exports = { generatePdfFile, browserActive, startBrowser };
