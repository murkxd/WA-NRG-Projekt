const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const app = express();
const prisma = new PrismaClient();
const SECRET_KEY = "key";

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, error: "Access Denied" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: "Invalid Token" });
    }
    req.user = user;
    next();
  });
};

app.post("/addPost", authenticateToken, upload.single('image'), async (req, res) => {
  const { description } = req.body;
  const userId = req.user.userId;

  console.log("Uploaded file information:", req.file); 

  if (!userId) {
    return res.status(401).json({ success: false, error: "No user ID found" });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, error: "No image file provided" });
  }

  const imageUrl = `/uploads/${req.file.filename}`;

  console.log("New post data:", {
    user_id: userId,
    image_id: null,
    description,
    like_count: 0,
    dislike_count: 0,
  });

  try {
    const newImage = await prisma.image.create({
      data: {
        image: imageUrl,
      },
    });

    const newPost = await prisma.post.create({
      data: {
        user_id: userId,
        image_id: newImage.id,
        description,
        like_count: 0,
        dislike_count: 0,
      },
    });

    res.json({ success: true, post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "An error occurred while adding the post",
    });
  }
});

app.listen(5176, () => {
  console.log("Server is running");
  console.log("server listening on port 5176");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (user && password === user.pass) {
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, error: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/register", async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, error: "Passwords do not match" });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        pass: password,
      },
    });
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ success: true, token, user: newUser });
  } catch (error) {
    if (error.code === "P2002" && error.meta.target.includes("username")) {
      res.status(400).json({ success: false, error: "Username already exists" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.get("/user", authenticateToken, (req, res) => {
  res.json({ loggedIn: true, user: req.user });
});

app.get("/user-posts", authenticateToken, async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { user_id: req.user.userId },
      orderBy: { id: "desc" },
      include: { User: true },
    });

    const postsWithImages = posts.map(post => {
      if (post.image_id) {
        post.imageUrl = `http://localhost:5176/uploads/${post.image_id}`;
      } else {
        post.imageUrl = null;
      }
      return post;
    });

    res.json(postsWithImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { id: "desc" },
      include: { User: true },
    });

    const postsWithImages = posts.map(post => {
      if (post.image_id) {
        post.imageUrl = `http://localhost:5176/uploads/${post.image_id}`;
      } else {
        post.imageUrl = null;
      }
      return post;
    });

    res.json(postsWithImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/user-profile", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (user) {
      res.json({ username: user.username, bio: user.bio || 'No bio available' });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5177, () => {
  console.log("Server is running");
  console.log("server listening on port 5176");
});
