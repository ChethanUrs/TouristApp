const Destination = require('../models/Destination');
const Review = require('../models/Review');
const { fetchDestinationDetails } = require('../utils/geminiHelper');

// @desc    Fetch all destinations
// @route   GET /api/destinations
// @access  Public
const getDestinations = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.pageSize) || 8;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const rating = req.query.rating ? { rating: { $gte: Number(req.query.rating) } } : {};

    const query = { ...keyword, ...category, ...rating };
    const count = await Destination.countDocuments(query);
    const destinations = await Destination.find(query)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    console.log(`Found ${destinations.length} destinations out of ${count} total. Query:`, JSON.stringify(query));
    res.json({ destinations, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single destination
// @route   GET /api/destinations/:id
// @access  Public
const getDestinationById = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id).populate({
      path: 'reviews',
      populate: { path: 'user', select: 'name avatar' },
    });

    if (destination) {
      res.json(destination);
    } else {
      res.status(404);
      throw new Error('Destination not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a destination
// @route   POST /api/destinations
// @access  Private/Admin
const createDestination = async (req, res, next) => {
  try {
    const { name, description, location, category, images, isFeatured } = req.body;

    const destination = new Destination({
      name,
      description,
      location,
      category,
      images,
      isFeatured,
      createdBy: req.user._id,
    });

    const createdDestination = await destination.save();
    res.status(201).json(createdDestination);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
const updateDestination = async (req, res, next) => {
  try {
    const { name, description, location, category, images, isFeatured } = req.body;

    const destination = await Destination.findById(req.params.id);

    if (destination) {
      destination.name = name || destination.name;
      destination.description = description || destination.description;
      destination.location = location || destination.location;
      destination.category = category || destination.category;
      destination.images = images || destination.images;
      destination.isFeatured = isFeatured !== undefined ? isFeatured : destination.isFeatured;

      const updatedDestination = await destination.save();
      res.json(updatedDestination);
    } else {
      res.status(404);
      throw new Error('Destination not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
const deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (destination) {
      await destination.deleteOne();
      res.json({ message: 'Destination removed' });
    } else {
      res.status(404);
      throw new Error('Destination not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured destinations
// @route   GET /api/destinations/featured
// @access  Public
const getFeaturedDestinations = async (req, res, next) => {
  try {
    const destinations = await Destination.find({ isFeatured: true }).limit(5);
    res.json(destinations);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/destinations/:id/reviews
// @access  Private
const createDestinationReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const destination = await Destination.findById(req.params.id);

    if (destination) {
      const alreadyReviewed = await Review.findOne({
        user: req.user._id,
        destination: req.params.id,
      });

      if (alreadyReviewed) {
        res.status(400);
        throw new Error('Destination already reviewed');
      }

      const review = new Review({
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
        destination: req.params.id,
      });

      const savedReview = await review.save();

      destination.reviews.push(savedReview._id);
      destination.numReviews = destination.reviews.length;
      
      // Calculate average rating
      const allReviews = await Review.find({ destination: req.params.id });
      destination.rating =
        allReviews.reduce((acc, item) => item.rating + acc, 0) /
        allReviews.length;

      await destination.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404);
      throw new Error('Destination not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch destination details from AI
// @route   POST /api/destinations/ai-fetch
// @access  Private/Admin
const fetchDestinationAI = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400);
      throw new Error('Place name is required');
    }

    const details = await fetchDestinationDetails(name);
    res.json(details);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
  getFeaturedDestinations,
  createDestinationReview,
  fetchDestinationAI,
};
