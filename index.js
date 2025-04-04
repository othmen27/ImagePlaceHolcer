import fs from "fs";
import express from "express";

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure JSON file exists
const filePath = "Images.json";
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf8"); // Create empty JSON array
}

// Handle storing image metadata
app.post("/images", (req, res) => {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        let jsonData;

        try {
            jsonData = JSON.parse(data);
        } catch (parseError) {
            jsonData = []; // Reset if JSON is corrupted
        }

        const id = jsonData.length;
        const date = new Date()
        console.log("the time is "+ date);
        
        const image = {
            id: id,
            title: req.body.title,
            image: req.body.image,
            date: date
        };

        jsonData.push(image);
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf8");

        res.json(image);
    } catch (error) {
        console.error("Error saving image:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

app.listen(port, () => {
    console.log(`API is running on port ${port}`);
});
