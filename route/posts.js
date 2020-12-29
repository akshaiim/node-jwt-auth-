const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
      posts : {
          title:"posts",
          description: "this is a post"
      }
  })
});

module.exports = router;
