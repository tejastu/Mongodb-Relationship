let express = require("express");
let app = express();
let mongoose = require("mongoose");
let movieGenre = require("./genre");
let movieShow = require("./movie");
let Joi = require("@hapi/joi");




app.use(express.json());

mongoose.connect("mongodb://localhost:27017/records",{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(()=> console.log("Connected to db"))
   .catch((error)=> console.log(`something went wrong  ${error.message}`));

app.post("/genre",async(req,res) =>{
    let {error} = genreValidationError(req.body);
    if(error){
        return res.send(error.details[0].message)
    };
    let genre = new movieGenre.Genre({
        name : req.body.name
    });
    let result =await genre.save();
    res.send(result);

});


app.post("/movie",async(req,res) =>{
    let {error} = movieValidationError(req.body);
    if(error) {
        return res.send(error.details[0].message)
    };
    let genreDetails = await movieGenre.Genre.findById(req.body.genreId);
    if(!genreDetails){return res.status(403).send({message: "invalid genre id"})};
    let result =  new movieShow({
        name: req.body.name,
        actor: req.body.actor,
        price: req.body.price,
        stocks: req.body.stocks,
        genre: {
            name: genreDetails.name
        }

    });
    let data = await result.save();
    res.send(data);
});





function genreValidationError(error){
    let schema = Joi.object({
        name: Joi.string().min(4).max(100).required()
        });
        return schema.validate(error);
}

function  movieValidationError(error) {
    let schema = Joi.object({
        name: Joi.string().min(4).max(100).required(),
        actor: Joi.string().min(4).max(100).required(),
        price: Joi.number().required(),
        stocks: Joi.number().required(),
        genreId: Joi.string().required()
    });
    return schema.validate(error);
    
}



app.listen(4800,()=>console.log(`port working on 4800`));