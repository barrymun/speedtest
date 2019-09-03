const express = require('express');
const app = express();
const port = 3001;

app.get(`/api/hello`, (req, res) => {
    res.send({test: "hello"});
});

app.listen(port, () => console.log(`app listening on port ${port}`));