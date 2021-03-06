var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var uniqid = require('uniqid');
var fs = require('fs');

var uid2 = require('uid2')
var SHA256 = require('crypto-js/sha256')
var encBase64 = require('crypto-js/enc-base64')

var cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'dxszylkun',
  api_key: '891548583882368',
  api_secret: 'SdK_HfGZf2o1VJzYwuRn96pJkLY'
});

var BouteilleModel = require('../models/Bouteille');
var CavisteModel = require('../models/Caviste');
var VigneronModel = require('../models/Vigneron');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'GlouGlou Social Club' });
});

// ----------------- SIGN-UP --------------------\\
router.post('/sign-up', async function (req, res, next) {
  var error = []
  var result = false
  var saveCaviste = null
  var saveVigneron = null

  // CHAMPS VIDES
  if (req.body.usernameFromFront == ''
    || req.body.emailFromFront == ''
    || req.body.telFromFront == ''
  ) {
    error.push('veuillez compléter les champs vides !')
  }

  // SIGNUP CAVISTES
  const dataCaviste = await CavisteModel.findOne({
    Email: req.body.emailFromFront
  })

  if (dataCaviste != null) {
    result = false;
    error.push('Utilisateur déjà présent')
  }

  if (error.length == 0 && req.body.statusFromFront === 'Caviste') {

    var salt = uid2(32)
    var newCaviste = new CavisteModel({
      Nom: req.body.usernameFromFront,
      Email: req.body.emailFromFront,
      Tel: req.body.telFromFront,
      Status: req.body.statusFromFront,
      MDP: SHA256(req.body.passwordFromFront + salt).toString(encBase64),
      token: uid2(32),
      salt: salt,
    })
    saveCaviste = await newCaviste.save()

    if (saveCaviste) {
      result = true
      token = saveCaviste.token
    }
  }

  // SIGNUP VIGNERONS
  const dataVigneron = await VigneronModel.findOne({
    Email: req.body.emailFromFront
  })

  if (dataVigneron != null) {
    result = false;
    error.push('Utilisateur déjà présent')
  }

  if (error.length == 0 && req.body.statusFromFront === 'Vigneron') {

    var salt = uid2(32)
    var newVigneron = new VigneronModel({
      Nom: req.body.usernameFromFront,
      Email: req.body.emailFromFront,
      Tel: req.body.telFromFront,
      Status: req.body.statusFromFront,
      MDP: SHA256(req.body.passwordFromFront + salt).toString(encBase64),
      token: uid2(32),
      salt: salt,
    })

    saveVigneron = await newVigneron.save()

    if (saveVigneron) {
      result = true
      token = saveVigneron.token
    }
  }
  res.json({ result, saveCaviste, saveVigneron, error })
});


// ------------------ SIGN-IN --------------------\\
router.post('/sign-in', async function (req, res, next) {

  var result = false
  var error = []
  var token = null
  var status = null

  // CHAMPS VIDES
  if (req.body.emailFromFront == ''
    || req.body.passwordFromFront == ''
  ) {
    error.push('veuillez compléter les champs vides !')
  }

  if (error.length == 0) {


    // SIGN-IN CAVISTES 
    const userCaviste = await CavisteModel.findOne({
      Email: req.body.emailFromFront,
    })

    if (userCaviste) {
      const passwordEncrypt = SHA256(req.body.passwordFromFront + userCaviste.salt).toString(encBase64)

      if (passwordEncrypt == userCaviste.MDP) {
        result = true
        token = userCaviste.token
        status = userCaviste.Status
      } else {
        result = false
        error.push('mot de passe ou email incorrect')
      }
    }

    // SIGN-IN VIGNERONS
    const userVigneron = await VigneronModel.findOne({
      Email: req.body.emailFromFront,
    })

    if (userVigneron) {
      const passwordEncrypt = SHA256(req.body.passwordFromFront + userVigneron.salt).toString(encBase64)

      if (passwordEncrypt == userVigneron.MDP) {
        result = true
        token = userVigneron.token
        status = userVigneron.Status
      } else {
        result = false
        error.push('mot de passe ou email incorrect')
      }
    }
  }
  res.json({ result, error, token, status })
});

// --------------- INFOS VIGNERON ---------------- \\
router.get('/info-v/:token', async function (req, res, next) {

  const user = await VigneronModel.findOne({ token: req.params.token })

  if (user != null) {
    res.json({ result: true, user })
  } else {
    res.json({ result: false })
  }
})

router.post('/info-update-v', async function (req, res, next) {

  var userinfosFB = JSON.parse(req.body.userinfos)
  var image = req.files.avatar

  if (image.size == 0) {

    var update = await VigneronModel.updateOne(
      { token: userinfosFB.token }, {
      Nom: userinfosFB.nom,
      Domaine: userinfosFB.domaine,
      Region: userinfosFB.region,
      Ville: userinfosFB.ville,
      Desc: userinfosFB.desc,
    })

    if (update) {
      const user = await VigneronModel.findOne(
        { token: userinfosFB.token }
      )
      var infos = {
        Nom: user.Nom,
        Domaine: user.Domaine,
        Ville: user.Ville,
        Region: user.Region,
        Desc: user.Desc
      }
    }
  } else {

    var imgpath = './tmp/' + uniqid() + '.jpg'
    var resultCopy = await image.mv(imgpath);

    if (!resultCopy) {
      var resultCloudinary = await cloudinary.uploader.upload(imgpath);
      var CloudURL = resultCloudinary.url
    }

    fs.unlinkSync(imgpath)

    var update = await VigneronModel.updateOne(
      { token: userinfosFB.token }, {
      Photo: CloudURL,
      Nom: userinfosFB.nom,
      Domaine: userinfosFB.domaine,
      Region: userinfosFB.region,
      Ville: userinfosFB.ville,
      Desc: userinfosFB.desc,
    })

    if (update) {
      const user = await VigneronModel.findOne(
        { token: userinfosFB.token }
      )
      var infos = {
        Photo: CloudURL,
        Nom: user.Nom,
        Domaine: user.Domaine,
        Ville: user.Ville,
        Region: user.Region,
        Desc: user.Desc
      }

    }

  }

  res.json({ result: true, infos })

})


// ----------------- INFOS CAVISTE ---------------- \\
router.get('/info-c', async function (req, res, next) {
  var infos = []
  var token = null
  const user = await CavisteModel.findOne({ token: req.query.token })

  if (user != null) {
    res.json({ result: true, user })
  } else {
    res.json({ result: false })
  }
})

router.post('/info-update-c', async function (req, res, next) {

  var userinfosFB = JSON.parse(req.body.userinfos)
  var image = req.files.avatar

  if (image.size == 0) {

    var update = await CavisteModel.updateOne(
      { token: userinfosFB.token }, {
      Nom: userinfosFB.nom,
      Etablissement: userinfosFB.etablissement,
      Ville: userinfosFB.ville,
      Region: userinfosFB.region,
      Desc: userinfosFB.desc
    })

    if (update) {
      const user = await CavisteModel.findOne(
        { token: userinfosFB.token }
      )

      var infos = {
        Nom: user.Nom,
        Etablissement: user.Etablissement,
        Ville: user.Ville,
        Region: user.Region,
        Desc: user.Desc
      }
    }

  } else {

    var imgpath = './tmp/' + uniqid() + '.jpg'
    var resultCopy = await image.mv(imgpath);

    if (!resultCopy) {
      var resultCloudinary = await cloudinary.uploader.upload(imgpath);
      var CloudURL = resultCloudinary.url
    }

    fs.unlinkSync(imgpath)

    var update = await CavisteModel.updateOne(
      { token: userinfosFB.token }, {
      Photo: CloudURL,
      Nom: userinfosFB.nom,
      Etablissement: userinfosFB.etablissement,
      Ville: userinfosFB.ville,
      Region: userinfosFB.region,
      Desc: userinfosFB.desc
    })

    if (update) {
      const user = await CavisteModel.findOne(
        { token: userinfosFB.token }
      )

      var infos = {
        Photo: CloudURL,
        Nom: user.Nom,
        Etablissement: user.Etablissement,
        Ville: user.Ville,
        Region: user.Region,
        Desc: user.Desc
      }
    }
  }

  res.json({ result: true, infos })
})


// ---------------- CAVE VIGNERON -----------------\\
router.get('/macave/:token', async function (req, res, next) {

  const user = await VigneronModel.findOne({ token: req.params.token })

  if (user) {
    var ID = user._id;

    const infosUser = {
      NomV: user.Nom,
      Domaine: user.Domaine,
      Ville: user.Ville,
      Region: user.Region,
    }

    var cave = await BouteilleModel.find({ IdVigneron: ID })
      .populate('IdVigneron')
      .exec();

    if (cave != null) {
      res.json({ result: true, cave, infosUser })
    } else {
      res.json({ result: false })
    }
  }
})

router.post('/AddVin', async function (req, res, next) {

  var result = false
  var bottleinfosFB = JSON.parse(req.body.bottleinfos)
  var saveBouteille = {}

  if (!req.files) {

    const vigneronID = await VigneronModel.findOne({ token: bottleinfosFB.token })

    var newBouteille = new BouteilleModel({

      Nom: bottleinfosFB.NomRef,
      Couleur: bottleinfosFB.Couleur,
      AOC: bottleinfosFB.AOC,
      Desc: bottleinfosFB.Desc,
      Cepage: bottleinfosFB.Cepage,
      Millesime: bottleinfosFB.Millesime,
      IdVigneron: vigneronID.id,
    })

    saveBouteille = await newBouteille.save()
    result = true

  } else {

    var image = req.files.avatar
    var imgpath = './tmp/' + uniqid() + '.jpg'
    var resultCopy = await image.mv(imgpath);

    if (!resultCopy) {
      var resultCloudinary = await cloudinary.uploader.upload(imgpath);
      var CloudURL = resultCloudinary.url
    }

    fs.unlinkSync(imgpath)

    const vigneronID = await VigneronModel.findOne({ token: bottleinfosFB.token })

    var newBouteille = new BouteilleModel({

      Nom: bottleinfosFB.NomRef,
      Couleur: bottleinfosFB.Couleur,
      AOC: bottleinfosFB.AOC,
      Desc: bottleinfosFB.Desc,
      Cepage: bottleinfosFB.Cepage,
      Millesime: bottleinfosFB.Millesime,
      IdVigneron: vigneronID.id,
      Photo: CloudURL,

    })

    saveBouteille = await newBouteille.save()
    result = true

  }
  res.json({ result, saveBouteille })
});

router.delete('/delete-ref/:Nom', async function (req, res, next) {

  var result = false
  var suppr = await BouteilleModel.deleteOne({ Nom: req.params.Nom })
  if (suppr.deletedCount > 0) {
    result = true
  }

  res.json({ result })
});


// ---------------- CATALOGUE CAVISTE ------------- \\
router.get('/catalogue/:token', async function (req, res, next) {

  const userCaviste = await CavisteModel.findOne({
    token: req.params.token
  })

  var catalogue = await BouteilleModel.find()
    .populate('IdVigneron')
    .exec()

  if (catalogue != null) {
    res.json({ result: true, catalogue, userCaviste })
  } else {
    res.json({ result: false })
  }
})

router.post('/filtre', async function (req, res, next) {

  const catalogue = await BouteilleModel.find({ Couleur: req.body.filtreFF })

  if (catalogue != null) {
    res.json({ result: true, catalogue })
  } else {
    res.json({ result: false })
  }
})


// ---------------- FAVORIS CAVISTE ------------- \\
router.get('/favoris/:token', async function (req, res, next) {

  var favCaviste = await CavisteModel.findOne({ token: req.params.token })

  if (favCaviste != null) {
    res.json({ result: true, favCaviste })
  } else {
    res.json({ result: false })
  }
})

router.post('/add-favoris', async function (req, res, next) {

  result = false;

  const userCaviste = await CavisteModel.findOne({
    token: req.body.tokenFF
  })

  const bouteille = await BouteilleModel.findOne({
    id: req.body.IdFF
  })

  if (bouteille) {
    var favorisCaviste = await CavisteModel.updateOne(
      { token: req.body.tokenFF }, {
      $push: {
        Favoris:
        {
          Nom: req.body.NomFF,
          Couleur: req.body.CouleurFF,
          Millesime: req.body.MillesimeFF,
          Cepage: req.body.CepageFF,
          Desc: req.body.DescFF,
          AOC: req.body.AOCFF,
          Photo: req.body.PhotoFF,
          NomVi: req.body.NomViFF,
          RegionVi: req.body.RegionViFF,
          DescVi: req.body.DescViFF,
          PhotoVi: req.body.PhotoViFF,
        },
      }
    })
    result = true
  }

  res.json({ result, bouteille, favorisCaviste, userCaviste })

})

router.delete('/delete-favoris/:Nom/:Token', async function (req, res, next) {

  result = false;

  const userCaviste = await CavisteModel.findOne({
    token: req.params.Token
  })

  var fav = userCaviste.Favoris

  let neFa = fav.filter((e) => (e.Nom != req.params.Nom))

  const updateCaviste = await CavisteModel.updateOne({
    token: req.params.Token
  }, { Favoris: neFa })

  if (updateCaviste) {
    result = true
  }

  res.json({ result, updateCaviste })
});


// ------------- MESS. CAVISTE -------------------- \\
router.get('/mailbox-main/:token', async function (req, res, next) {

  var Caviste = await CavisteModel.findOne(
    { token: req.params.token })

  if (Caviste != null) {
    res.json({ Caviste, result: true })
  } else {
    res.json({ result: false })
  }
});

router.get('/mailbox-read/:token', async function (req, res, next) {

  var msgClicked = await CavisteModel.findOne(
    { MessagesR: { Texte: req.params.Texte } })

  res.json({ msgClicked })

});

router.post('/mailbox-write', async function (req, res, next) {

  var msg = await CavisteModel.updateOne(
    { token: req.body.token }, {
    $push: {
      MessagesS: {
        Texte: req.body.Texte,
        Nom: req.body.NomVigneron,
        Photo: req.body.PhotoFF
      }
    }
  });

  var searchVigneron = await VigneronModel.findOne({
    Nom: req.body.NomVigneron
  })

  if (searchVigneron != null) {
    var msgVigneron = await VigneronModel.updateOne(
      { Nom: req.body.NomVigneron }, {
      $push: {
        MessagesR: {
          Texte: req.body.Texte,
          Nom: req.body.NomCaviste,
          Photo: req.body.PhotoFF
        }
      }
    });
  }

  res.json({ msg, msgVigneron })
});


// ------------- MESS. VIGNERON -------------------- \\

router.get('/mailbox-main-v/:token', async function (req, res, next) {

  var Vigneron = await VigneronModel.findOne(
    { token: req.params.token })

  if (Vigneron != null) {
    res.json({ Vigneron, result: true })
  } else {
    res.json({ result: false })
  }
});

router.get('/mailbox-read-v/:token', async function (req, res, next) {

  var Vigneron = await VigneronModel.findOne(
    { token: req.params.token })

  if (Vigneron != null) {
    res.json({ Vigneron, result: true })
  } else {
    res.json({ result: false })
  }
});

router.post('/mailbox-write-v', async function (req, res, next) {

  var msg = await VigneronModel.updateOne(
    { token: req.body.token }, {
    $push: {
      MessagesS: {
        Texte: req.body.Texte,
        Nom: req.body.NomCaviste,
        Photo: req.body.PhotoFF
      }
    }
  });

  var searchCaviste = await CavisteModel.findOne({
    Nom: req.body.NomCaviste
  })

  if (searchCaviste != null) {
    var msgCaviste = await CavisteModel.updateOne(
      { Nom: req.body.NomCaviste }, {
      $push: {
        MessagesR: {
          Texte: req.body.Texte,
          Nom: req.body.NomVigneron,
          Photo: req.body.PhotoFF
        }
      }
    });
  }

  res.json({ msg, msgCaviste, searchCaviste })

});


module.exports = router;