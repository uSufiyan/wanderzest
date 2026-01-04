const { array } = require("joi");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    let { category, destination } = req.query;

    if(Array.isArray(category)){
        category = category[0];
    }

    let query = {};

    if(category) {
        query.category = category;
    }
    
    if(destination && destination.trim() !== "") {
        query.$or = [
            { title: { $regex: destination.trim(), $options: "i" } },
            { location: { $regex: destination.trim(), $options: "i" } },
            { country: { $regex: destination.trim(), $options: "i" } }
        ];
    }

    const listings = await Listing.find(query);
    if (listings.length === 0) {
        req.flash("error", "No destination found!");
        return res.render("listings/index.ejs", {
            listings: [],
            currentCategory: category || null,
            searchQuery: destination || ""
        });
    }

    res.render("listings/index.ejs", {
        listings,
        currentCategory: category || null, 
        searchQuery: destination || ""
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");  
    
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    listing.views += 1;
    await listing.save();

    if(!listing.image || !listing.image.url){
        listing.image = {
            url: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
            filename: "default"            
        };
    }

    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1 
        })
        .send();
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    if (req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = {url, filename};
    }

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = null;
    if(listing.image && listing.image.url){
        originalImageUrl = listing.image.url.replace("/upload", "/upload/h_200,w_250");
    }
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1 
        })
        .send();
    
    if (typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
    }

    listing.geometry = response.body.features[0].geometry;
    await listing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

module.exports.trendingListings = async (req, res) => {
    const listings = await Listing.find({})
        .sort({ views: -1 })
        .limit(10);

    res.render("listings/index.ejs", {
        listings,
        currentCategory: "trending"
    });
};
