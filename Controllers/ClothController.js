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
            if (req.files.coverImg &&req.files.coverImg.length > 0) {
                const fileName = `Cloth-${Math.floor(Date.now() + Date.now() + Math.random() * 8892829229)}-${Date.now()}-cover.jpeg`;
                try {
                    const fs = require('fs');
                    sharp(req.files.coverImg[0].buffer)
                     .toFormat('jpeg')
                     .toBuffer((err, data, info) => {
                         fs.writeFile(fileName, data, { flag: 'w' }, function() {
                             
                         });
                     });
             
                     req.body.coverImg = fileName;
                     console.log(`File ${fileName} saved successfully.`);
                } catch (error) {
                    console.error(`Error saving file ${fileName}:`, error);
                }
            }
            if (req.files.img && req.files.img.length <= 3) {
                req.body.img = [];
                await Promise.all(
                    req.files.img.map(async (file, i) => {
                        const fileName = `Cloth-${Math.floor(Date.now() + Date.now() + Math.random() * 8892829229)}-${Date.now()}-${i + 1}.jpeg`;
                        try {
                            const fs = require('fs');
                            sharp(file.buffer)
                              .toFormat('jpeg')
                              .toBuffer((err, data, info) => {
                                fs.writeFile(fileName, data, { flag: 'w' }, function() {
                                    
                                });
                               });
                            req.body.img.push(fileName);
                            console.log(`File ${fileName} saved successfully.`);
                          }catch (error) {
                            console.error(`Error saving file ${fileName}:`, error);
                          }

                    })
                );
            }else{
                return res.status(400).json({
                    status: 'failed',
                    message: 'Only 3 images Allowed'
                })
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

exports.getAllCloths = async (req, res, next) => {
    try {

        const newData = await ClothModel.find()
        if (req.query.userId) {
            const user = await User.findById(req.query.userId);
            newData.forEach((Cloth, i) => {
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
            size: newData.length,
            status: 'success',
            data: newData,
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
        const newData = await ClothModel.findById(req.params.id).populate({ path: 'review' })
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