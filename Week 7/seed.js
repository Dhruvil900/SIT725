const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/myprojectDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ProjectSchema = new mongoose.Schema({
  title: String,
  image: String,
  link: String,
  description: String,
});

const Project = mongoose.model("Project", ProjectSchema);

const sampleProject = new Project({
  title: "Jimbei",
  image: "images/Jimbei.jpeg",
  link: "Helsman of the strawhat pirates",
  description: "Jimbei known as the first son of the sea and the captain of the fishman pirates.",
});
sampleProject.save().then(() => console.log("Sample project saved!"));
