const express = require("express");
const connectDB = require("./database");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const notFoundHandler = require("./middlewares/notFoundHandler");
const errorHandler = require("./middlewares/errorHandler");
const { localStrategy, jwtStrategy } = require("./middlewares/passport");
const passport = require("passport");
const voucherRouter = require("./apis/vouchers/routes");
const ratingRouter = require("./apis/ratings/routes");

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use(morgan("dev"));
//passport
app.use(passport.initialize());
passport.use("local", localStrategy);
passport.use("jwt", jwtStrategy);

//multer
app.use("/media", express.static(path.join(__dirname, "media")));

//Routes here...
app.use("/vouchers", voucherRouter);
app.use("/ratings", ratingRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(8000, () => {
  console.log("localhost 8000");
});
