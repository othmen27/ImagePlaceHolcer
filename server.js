import express from "express";
import multer from "multer";
import path from "path";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"))); 

app.get("/", async (req, res) => {
    try{
        const respone = await axios.get(API_URL)
        res.render("index.ejs", {data:respone.data})
    }catch(error){
        res.status(500).json({ message: "Error creating post", error: error.message });
    }
    
});

app.post("/api/images", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No image uploaded.");
        const postData = {title: req.body.title,image: req.file.filename,};
        const response = await axios.post(API_URL + "/images", postData);
        console.log(response.data);
        res.redirect("/");
    } catch (error) {
        res.status(500).json({ message: "Error creating post", error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server Started on ${port}`);
});
