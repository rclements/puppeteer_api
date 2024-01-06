# Puppeteer API

This main objective of this project is to provide a way of converting `HTML`
into `PDF`.

## Requirements

- Node 12.5+

## Installation

```sh
npm install
```

## Run

```sh
npm run start
```

This will start the application with port 6000.
To change port

```sh
PORT=3030 npm run start
```

## Endpoints

Post to `/pdf` with these params

- marginLeft: unit (text)
- marginRight: unit (text)
- marginTop: unit (text)
- marginBottom: unit (text)
- format: type (letter, legal, tabloid, Ledger, A0, A1, A2, A3, A4, A5, A6)
- printBackground: true
- headerTemplate: (text)
- footerTemplate: (text)
- content: (text)
- locale: (ar,en)
- timezone: text (Asia/Riyadh)
- landscape: boolean (false)

the result will be the `PDF` binary.

