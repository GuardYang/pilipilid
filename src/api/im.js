/**
 * Created by buhe on 16/9/19.
 */
import resource from 'resource-router-middleware';
import level from 'level';
import rongcloudSDK from 'rongcloud-sdk';
const db = level('./im');
rongcloudSDK.init( 'c9kqb3rdkc8kj', '6b43dquzFMJJ' );

let ims = [];

db.get("ims", function (err, value) {
  if (err) {
    if (err.notFound) {

    }
  }else{
    ims = JSON.parse(value);
  }

});

export default ({ config }) => resource({

  /** Property name to store preloaded entity on `request`. */
  id : 'im',

  /** For requests with an `id`, you can auto-load the entity.
   *  Errors terminate the request, success sets `req[id] = data`.
   */
  load(req, id, callback) {
  let im = ims.find( im => im.id===id ),
  err = im ? null : 'Not found';
  callback(err, im);
},

/** GET / - List all entities */
index({ params }, res) {
  res.json(ims);
},


/** POST / - Create a new entity */
create({ body }, res) {
  let userId = body.userId | null;
  let nickname = body.nickname | null;

  rongcloudSDK.user.getToken( userId, nickname, '', function( err, resultText ) {
    if( err ) {
      console.log(err + 'error code: ' + err.errorCode + 'http code: ' + err.httpCode);
      res.json({error:err})
    }
    else {
      var result = JSON.parse( resultText );
      if( result.code === 200 ) {
        //Handle the result.token
        console.log(resultText)
        ims.push(result);
        db.put('im',JSON.stringify({token:result.token,userId:result.userId}));
        res.json({token:result.token,userId:result.userId});
      }
    }
  } );

},

/** GET /:id - Return a given entity */
read({ im }, res) {
  console.log(im);
  res.json(im);
},

/** PUT /:id - Update a given entity */
update({ im, body }, res) {
  //for (let key in body) {
  //	if (key!=='id') {
  //		im[key] = body[key];
  //	}
  //}
  res.sendStatus(204);
},

/** DELETE /:id - Delete a given entity */
delete({ im }, res) {
  //ims.splice(ims.indexOf(im), 1);
  res.sendStatus(204);
}

});
