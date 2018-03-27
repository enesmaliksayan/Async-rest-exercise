var express = require('express');
var xmlify = require('xmlify');


var router = express.Router();

const Ders = require('../models/derslerModel');
/* GET home page. */
router.get('/', (req, res, next) => {
  Ders.getDersler((err, dersler) => {
    if (err) res.status(500).json({ ok: false, err });
    else {
      res.json({ dersler });
    }
  })
});

router.get('/getDetay', (req, res, next) => {
  let id = req.query.id;
  Ders.getDersById(id, (err, ders) => {
    if (err) res.status(500).json({ ok: false, err });
    else {
      res.json({
        ders
      })
    }
  })
})

router.post('/updateDers', (req, res, next) => {
  let id = req.body.id;
  Ders.updateDers(id, req.body, (err, ders) => {
    res.json({ ok: true, updatedDers: ders });
  })
})

router.get('/getDersJson', (req, res, next) => {
  let id = req.query.id;
  Ders.getDersById(id, (err, ders) => {
    res.json({ ok: true, ders });
  })
})

router.get('/getDersXml', (req, res, next) => {
  let id = req.query.id;
  Ders.getDersById(id, (err, ders) => {
    var xml = xmlify(ders);
    res.send(xml);
  })
})


module.exports = router;
