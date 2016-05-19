var express = require('express');
var router = express.Router();

///////////////////////////////////////////////////////////////////////////
// GET page - Home
router.get('/', function(req, res, next)
{
  res.render('index', { title: 'Album of the Day' });
});

///////////////////////////////////////////////////////////////////////////
// GET page - Albumlist
router.get('/albumlist', function(req, res, next)
{
  var db = req.db;
  var sCollection = process.env.AOTD_DB_COLLECTION;
  var collection  = db.get(sCollection);

  collection.find({},{},
                  function(e,docs)
                  {
                    res.render('albumlist', {"albumlist":docs});
                  });
});

///////////////////////////////////////////////////////////////////////////
// GET page - New Album
router.get('/newalbum', function(req, res, next)
{
  res.render('newalbum', { title: 'Add New Album' });
});

///////////////////////////////////////////////////////////////////////////
/* POST to Add Album Service */
router.post('/addalbum', function(req, res)
{
    var db = req.db;
    var sCollection = process.env.AOTD_DB_COLLECTION;
    var collection  = db.get(sCollection);    

    // Get our form values. These rely on the "name" attributes  
    var album_DateRecommended = req.body.DateRecommended;
    var album_RecommendedBy   = req.body.RecommendedBy;
    var album_Artist          = req.body.Artist;
    var album_Album           = req.body.Album;

    // Submit to the DB
    collection.insert(
      { "DateRecommended" : album_DateRecommended,
        "RecommendedBy"   : album_RecommendedBy,
        "Artist"          : album_Artist,
        "Album"           : album_Album },
      function(err, doc)
      {
          if (err)
          {
              // If it failed, return error
              res.send("There was a problem adding the information to the database.");
          }
          else
          {
              // And forward to success page
              res.redirect("albumlist");
          }
      });
});

///////////////////////////////////////////////////////////////////////////

module.exports = router;
