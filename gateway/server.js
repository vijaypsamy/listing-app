const http = require('http');
const express = require('express');
const itemsRouter = require('./routes/route.js');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require("swagger-ui-express");

const app = express();

const port = 3000;


const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: "Listing API",
      description: "Get or Create accomodation listings.",
      contact: {
        name: "vijaypsamy@gmail.com"
      },
      servers: ["http://localhost:80"]
    }
  },
  apis: ["./routes/route.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use(express.json());

app.use('/', itemsRouter);


app.listen(port, () => {
  console.log(` gateway service running at port ${port}`);
});

