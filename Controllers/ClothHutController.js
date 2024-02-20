const multer = require('multer');
const sharp = require('sharp');
const ClothHutModel = require('../Models/ClothHutModel');
const multerStorage = multer.memoryStorage();
const User = require('../Models/UserModel');
const errorController = require('./ErrorController');

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadClothHutImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

exports.resizeTourImages = async (req, res, next) => {

  const id = req.params.id || req.user._id
  if (req.files) {
    // 1) Cover image
    if (req.files.imageCover) {
      req.body.imageCover = `ClothHut-${id}-${Date.now()}-cover.jpeg`;
      await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/ClothHut/${req.body.imageCover}`);

    }
    // 2) Images
    if (req.files.images) {
      req.body.images = [];
      await Promise.all(
        req.files.images.map(async (file, i) => {
          const id = req.params.id || req.user._id
          const filename = `ClothHut-${id}-${Date.now()}-${i + 1}.jpeg`;

          await sharp(file.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/ClothHut/${filename}`);

          req.body.images.push(filename);
        })
      );
    }
  }
  next();
}

exports.addOneClothHut = async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.summary || !req.body.openAt ||
      !req.body.description || !req.body.imageCover) {
      return res.status(400).json({
        status: 'failed',
        message: 'major fields are missing Ex - name , imageCover , description, summary  '
      })
    }
    const arry = [...req.body.sub-admins];
    let isSubAdmin = true
    for (let item = 0; item < arry.length; item++) {
      const user = await User.findById(arry[item]);
      if(!user){
        return res.status(400).json({
          status: 'fail',
          message: 'No UserFound given ID'
        })       }
      if (user.role !== 'sub-admin') {
        isSubAdmin = false;
        break;
      }
    }
    if (isSubAdmin === false) {
      return res.status(400).json({
        status: 'fail',
        message: 'Make Sure Only sub-admin IDS'
      })
    }
    const ClothHut = await ClothHutModel.create(req.body);
    return res.status(201).json({
      status: 'success',
      data: ClothHut,
    })
  } catch (err) {
    errorController(req, res, err)

  }
}

exports.updateOneClothHut = async (req, res, next) => {
  try {
   
    const ClothHut = await ClothHutModel.findByIdAndUpdate(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      data: ClothHut,
    })
  } catch (err) {
    errorController(req, res, err)

  }
}

exports.getOneClothHut = async (req, res, next) => {
  try {
    const ClothHut =
      await ClothHutModel.findById(req.params.id).populate({ path: 'Cloths' }).populate({ path: 'reviews' }).populate({ path: 'sub-admins' })
    return res.status(200).json({
      status: 'success',
      data: ClothHut,
    })
  } catch (err) {
    errorController(req, res, err)

  }
}

exports.getAllClothHuts = async (req, res, next) => {
  try {
    const ClothHuts = await ClothHutModel.find();
    return res.status(200).json({
      status: 'success',
      data: ClothHuts,
      size: ClothHuts.length
    })
  } catch (err) {
    errorController(req, res, err)

  }
}

exports.getMonthlyPlan = async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await ClothHutModel.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        ClothHut: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  return res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
}

exports.disable = async (req, res, nex) => {
  try {
    const ClothHut = await ClothHutModel.findById(req.params.id);
    ClothHut.isOffer = false;
    ClothHut.save();
    return res.status(200).json({
      status: 'done',
      data: ClothHut
    })
  } catch (err) {
    errorController(req, res, err)

  }
}


exports.getClothHutWithin = async (req, res, next) => {
  try {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide latitutr and longitude in the format lat,lng.',
      })
    }

    const ClothHut = await ClothHutModel.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    return res.status(200).json({
      status: 'success',
      results: ClothHut.length,
      data: ClothHut

    });
  } catch (err) {
    errorController(req, res, err)

  }
}

exports.getDistances = async (req, res, next) => {
  try {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    if (!lat || !lng) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide latitute and longitude in the format lat,lng.',
      })
    }

    const distances = await ClothHutModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [lng * 1, lat * 1]
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier
        }
      },
      {
        $project: {
          distance: 1,
          name: 1
        }
      }
    ]);

    return res.status(200).json({
      status: 'success',
      data: {
        data: distances
      }
    });
  } catch (err) {
    errorController(req, res, err)

  }
}
