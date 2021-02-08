const express = require("express");
const {
  generatePdfFile,
  browserActive,
  startBrowser,
} = require("./generatePdfFile");

const bodyParser = require("body-parser");
const port = parseInt(process.env.PORT, 10) || 6000;
const server = express();
server.use(
  bodyParser.json({
    limit: "100mb",
  })
);
server.post("/pdf", async (req, res) => {
  const pdf = await generatePdfFile(req.body);
  res.contentType("application/pdf");
  res.end(pdf);
});
server.get("/ready", async (req, res) => {
  if (!browserActive()) {
    res.statusCode(504);
    res.send({ ready: false });
  } else {
    res.send({ ready: true });
  }
});
startBrowser().then(() => {
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
