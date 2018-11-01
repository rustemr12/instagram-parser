var express = require('express');
var router = express.Router();
var Nightmare = require('nightmare');
var mongoose = require('mongoose');
const Location = require('../models/locations');
const User = require('../models/users');
var $ = require('jquery')



/* GET home page. */
router.get('/getLocations', function(req, res, next) {

  var nightmare2 = Nightmare({ show: true })
   nightmare2
   .useragent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36")
   .goto('https://www.instagram.com/explore/locations/c2038095/oufa-russia/')
   .evaluate(function () {
  //   var links = document.querySelectorAll('.aMwHK');
     //console.log(locations)
     return [].map.call(document.querySelectorAll('.aMwHK'), function(link) {
            var url = link.getAttribute('href');
            var title = link.textContent;
            var array = [];
            array[0] = title;
            array[1] = url;
            return array; })
    })
  .then(function (result) {
    for (var i in result) {
        console.log(result[i][1])
      var location = new Location({
              location_url: result[i][1],
              location_name: result[i][0],
              created_at: new Date()
            });
      location.save(function(err) {
          if (err) {
              ///var failure_code  = err['code']
              console.log(err)
            }

          })
     }


  })
  .catch(function (error) {
    console.error('Search failed:', error);
  });

  res.render('index', { title: 'Express' });
});

router.get('/getUsers', function(req, res, next) {

   var location_id = req.query.location_id;

   var nightmare2 = Nightmare({ show: true })
    nightmare2
    .useragent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36")
    .goto('https://www.instagram.com' + location_id)
    //.scrollPage()
    .evaluate(function () {
   //   var links = document.querySelectorAll('.aMwHK');
      //console.log(locations)
      return [].map.call(document.querySelectorAll('.v1Nh3'), function(link) {
             var url = link.childNodes[0].getAttribute('href')
             return url; })
     })
   .end()
   .then(function (result) {

      callback_(result)
   })
   res.send('done')

});

function callback_(urls)
{

  urls.forEach(function(value){
     var nightmare3 = Nightmare({ show: false })
      nightmare3
      .useragent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36")
      .goto('https://www.instagram.com' + value)
      .evaluate(function () {
        var new_user = document.querySelector('._5f5mN')!== null
        var data;
        if (new_user) {
          data =  document.querySelector('.e1e1d').childNodes[0].getAttribute('href')
        }
        else{
          data = null;
        }
        return data
       })
      .end()
     .then(function (result) {

       if (result !== null ){
          var user = new User({
                  user_id: result,
                  created_at: new Date()
                });
          user.save(function(err) {
              if (err) {
                  ///var failure_code  = err['code']
                  console.log(err)
                }

              })
          }

     })
     .catch(function () {
                   console.log("Promise Rejected");
              })

   })
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

router.get('/follow', function(req, res, next) {

  var user_id = req.query.user_id;
  var nightmare2 = Nightmare({ show: true })
   nightmare2
   .useragent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36")
    .goto('https://www.instagram.com/accounts/login/')
    .wait(1000)
    .type("input[name*='username']",login)
    .type("input[name*='password']",password)
    .click('._5f5mN')
    .wait(1000)
   .goto('https://www.instagram.com' + user_id)
   .evaluate(function () {
     return document
   })
   .end()
  .then(function (result){
      console.log('test');
  })
  .catch(function () {
                console.log("Promise Rejected");
  })

})
module.exports = router;
