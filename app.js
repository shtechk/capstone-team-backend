const express = require("express");
const connectDB = require("./database");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const notFoundHandler = require("./middlewares/notFoundHandler");
const errorHandler = require("./middlewares/errorHandler");
const { localStrategy, jwtStrategy } = require("./middlewares/passport");
const passport = require("passport");
const bookingRouter = require("./apis/booking/routes");
const chatRouter = require("./apis/chat/routes");

// middlewares before
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
app.use("/api/bookings", bookingRouter);
app.use("/api/chats", chatRouter);
app.use("/api/places", placesRouter);

app.use(notFoundHandler);
app.use(errorHandler);
connectDB();
app.listen(8000, () => {
  console.log("localhost 8000");
});
