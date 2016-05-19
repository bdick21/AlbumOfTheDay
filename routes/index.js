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
  
  collection.find( {$query: {}, $orderby: { "Score" : -1 }}, // Order by 'Score'
                   {},
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
// GET page - Battle

router.get('/battle', function(req, res, next)
{
  var db = req.db;
  var sCollection = process.env.AOTD_DB_COLLECTION;
  var collection = db.get(sCollection);

  collection.find({},{},
                  function(e,docs)
                  {
                    console.log("Getting first")
                    a1 = get_random_album_with_spotify_tracks( docs );
                    console.log("Getting second")
                    a2 = get_random_album_with_spotify_tracks( docs );
                    res.render('battle', { title: 'Battle of the day', album1:a1, album2:a2 });
                  });
});

function get_random_album_with_spotify_tracks( docs )
{
  while (true)
  {
    randpos = Math.floor(Math.random() * Object.keys(docs).length);
 
    a = docs[randpos];

    if ( !("TopTracks" in a) )
      continue;

    if ( a["TopTracks"][0][1] )
      break;
  }
 
  return a; 
}

///////////////////////////////////////////////////////////////////////////
// GET page - Vote

router.get('/vote/:id', function(req, res, next)
{
  var db = req.db;
  var sCollection = process.env.AOTD_DB_COLLECTION;
  var collection = db.get(sCollection);
  
  var id = req.params.id;
  
  console.log( db );
  console.log( id );
  
  collection.find({ "_id": id },{},
                  function(e,doc)
                  {
                    console.log(e)
                    console.log( "doc" + doc )
                    // doc.update_one({  "$inc": { "Score": 1 } });
                    collection.update({ "_id":id }, {  "$inc": { "Score": 1 } });
                  });
                  // collection.find({  "id": id }).update_one({  "$inc": { "Score": 1 } });
  
  res.redirect("/battle");
});

///////////////////////////////////////////////////////////////////////////
// POST to Add Album Service

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
