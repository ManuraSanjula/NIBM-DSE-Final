const ClothModel = require('../Models/ClothModel');
const multer = require('multer');
const sharp = require('sharp');
const multerStorage = multer.memoryStorage();
const User = require('../Models/UserModel');
const errorController = require('./errorController');

exports.deleteOneCloth = async (req, res, next) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({
                status: 'failed',
                message: 'Id not defined'
            })
        }
        const newData = await ClothModel.findById(req.params.id);
        newData.offer = false;
        newData.save();
        return res.status(400).json({
            status: 'success',
            data: newData
        })
    } catch (err) {
        // return res.status(500).json({
        //     status: 'failed',
        //     message: err.message
        // })
        errorController(req, res, err)
    }
}

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

exports.uploadTourImages = upload.fields([
    { name: 'coverImg', maxCount: 1 },
    { name: 'img', maxCount: 3 }
]);

exports.resizeTourImages = async (req, res, next) => {
    try {

        if (req.files) {
            if (req.files.coverImg) {
                req.body.coverImg = `Cloth-${Math.floor(Date.now() + Date.now() + Math.random() * 8892829229)}-${Date.now()}-cover.jpeg`;
                await sharp(req.files.coverImg[0].buffer)
                    .resize(2000, 1333)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toFile(`public/img/Cloths/${req.body.coverImg}`);
            }
            if (req.files.img) {
                req.body.img = [];
                await Promise.all(
                    req.files.img.map(async (file, i) => {
                        const filename = `Cloth-${Math.floor(Date.now() + Date.now() + Math.random() * 8892829229)}-${Date.now()}-${i + 1}.jpeg`;

                        await sharp(file.buffer)
                            .resize(2000, 1333)
                            .toFormat('jpeg')
                            .jpeg({ quality: 90 })
                            .toFile(`public/img/Cloths/${filename}`);

                        req.body.img.push(filename);
                    })
                );
            }
        }
        next();
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: err.message
        })
    }
};

exports.insertOneCloth = async (req, res, next) => {
    try {
        const newData = await ClothModel.create(req.body);
        return res.status(201).json({
            status: 'success',
            data: newData,
        })
    } catch (err) {
        // return res.status(500).json({
        //     status: 'failed',
        //     message: err.message
        // })
        errorController(req, res, err)
    }
}

exports.updateOneCloth = async (req, res, next) => {

    try {
        const updateCloth = await ClothModel.findByIdAndUpdate(req.params.id, req.body);
        return res.status(200).json({
            status: 'success',
            data: updateCloth,
        })
    } catch (err) {
        errorController(req, res, err)
    }
}

const select = (req, data) => {

    if (req.tags) {
        data = data.filter(val => {
            const tags = [...val.tags];
            let boolen = false;
            tags.forEach((val, i) => {
                (val)
                if (val === req.tags === true) {
                    boolen = true;
                }
            })
            return boolen;
        })
    }

    // REQ RATING
    if (req.rating) {
        if (req.rating.gt) {
            data = data.filter(val => {
                return val.ratingsAverage > req.rating.gt;
            })
        }
        if (req.rating.lt) {
            data = data.filter(val => {
                return req.rating.lt > val.ratingsAverage
            })
        }
    }

    // REQ LIKES
    if (req.likes) {
        if (req.likes.gt) {
            data = data.filter(val => {
                return val.likes > req.likes.gt;
            })
        }
        if (req.likes.lt) {
            data = data.filter(val => {
                return req.likes.lt > val.likes;
            })
        }
    }

    if (req.nutritionPer100g) {
        const ob = req.nutritionPer100g;
        const arry = Object.keys(ob).toString();

        const protien = arry.split('-')[0];
        const lgthan = arry.split('-')[1];

        if (lgthan === 'gt') {
            const value = ob[arry];
            data = data.filter(val => {
                
                return val.nutritionPer100g[protien] > value;
            })
        } else {
            const value = ob[arry];
            data = data.filter(val => {
                
                return val.nutritionPer100g[protien] < value;
            })
        }
    }

    if (req.nutritionPer100ml) {
        const ob = req.nutritionPer100ml;
        const arry = Object.keys(ob).toString();

        const protien = arry.split('-')[0];
        const lgthan = arry.split('-')[1];

        if (lgthan === 'gt') {
            const value = ob[arry];
            data = data.filter(val => {
                //ionPer100ml[protien], value)
                return val.nutritionPer100ml[protien] > value;
            })
        } else {
            const value = ob[arry];
            data = data.filter(val => {
                (val.nutritionPer100ml[protien], value)
                return val.nutritionPer100ml[protien] < value;
            })
        }
    }


    return data;
}

exports.getAllCloths = async (req, res, next) => {
    try {

        const newData = await ClothModel.find()
        const result = select(req.query, newData);

        if (req.query.userId) {
            const user = await User.findById(req.query.userId);
            result.forEach((Cloth, i) => {
                user.Likes.forEach((item, i) => {
                    if (Cloth._id.toString() === item) {
                        Cloth.like = true;
                    } else {
                        Cloth.like = false;
                    }
                })
                console.log(Cloth.like)
            })
        }
        return res.status(200).json({
            size: result.length,
            status: 'success',
            data: result,
        })
    } catch (err) {
        errorController(req, res, err)
    }
}

exports.getOneCloth = async (req, res, next) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({
                status: 'failed',
                message: 'Id not defined'
            })
        }
        const newData = await ClothModel.findById(req.params.id).populate({ path: 'ClothHuts' }).populate({ path: 'review' })
        if (req.query.userId) {
            const user = await User.findById(req.query.userId);
            user.Likes.forEach((item, i) => {
                if (newData._id.toString() === item) {
                    newData.like = true;
                } else {
                    newData.like = false;
                }
            })
        }
        return res.status(200).json({
            size: newData.length,
            status: 'success',
            data: newData,
        })
    } catch (err) {
        errorController(req, res, err)
    }
}


exports.getOneClothBySlug = async (req, res, next) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({
                status: 'failed',
                message: 'Id not defined'
            })
        }
        const newData = await ClothModel.findOne({ slug: req.params.slugName }).populate({ path: 'ClothHuts' }).populate({ path: 'review' })
        if (req.query.userId) {
            const user = await User.findById(req.query.userId);
            user.Likes.forEach((item, i) => {
                if (newData._id.toString() === item) {
                    newData.like = true;
                } else {
                    newData.like = false;
                }
            })
        }
        return res.status(200).json({
            size: newData.length,
            status: 'success',
            data: newData,
        })
    } catch (err) {
        errorController(req, res, err)
    }
}