import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { UserModel } from "../models/User";
import { BookModel } from "../models/Book";
import { ReaderModel } from "../models/Reader";
import bcrypt from "bcrypt";

export const connectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    return;
  }

  if (process.env.NODE_ENV === "test") {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    await seedInitialData();
    return;
  }

  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ceylonshelf_db";
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    console.log("Connected to MongoDB database server successfully.");
  } catch (error) {
    console.warn("Local MongoDB connection failed. Starting in-memory MongoDB fallback...");
    try {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`Connected to MongoMemoryServer (In-Memory DB) at: ${uri}`);
    } catch (memErr) {
      console.error("Failed to start in-memory MongoDB:", memErr);
      process.exit(1);
    }
  }

  await seedInitialData();
};

const seedInitialData = async () => {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminEmail = "admin@ceylonshelf.lk";
    
    const existingAdmin = await UserModel.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await UserModel.create({
        name: "Kavinda Perera (Admin)",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
    } else {
      existingAdmin.name = "Kavinda Perera (Admin)";
      existingAdmin.password = hashedPassword;
      existingAdmin.role = "admin";
      await existingAdmin.save();
    }

    const genericBook = await BookModel.findOne({ title: "The Great Gatsby" });
    if (genericBook) {
      await BookModel.deleteMany({ title: { $in: ["The Great Gatsby", "To Kill a Mockingbird", "1984"] } });
    }

    const bookCount = await BookModel.countDocuments();
    if (bookCount === 0) {
      await BookModel.insertMany([
        {
          title: "Madol Doova",
          author: "Martin Wickramasinghe",
          genre: "Classic Fiction",
          availableCopies: 6,
          publishedDate: new Date("1947-01-01"),
        },
        {
          title: "Gamperaliya",
          author: "Martin Wickramasinghe",
          genre: "Novel",
          availableCopies: 4,
          publishedDate: new Date("1944-01-01"),
        },
        {
          title: "The Seven Moons of Maali Almeida",
          author: "Shehan Karunatilaka",
          genre: "Magical Realism",
          availableCopies: 3,
          publishedDate: new Date("2022-08-04"),
        },
        {
          title: "Chinaman: The Legend of Pradeep Mathew",
          author: "Shehan Karunatilaka",
          genre: "Sports Fiction",
          availableCopies: 5,
          publishedDate: new Date("2010-02-15"),
        },
        {
          title: "Running in the Family",
          author: "Michael Ondaatje",
          genre: "Memoir",
          availableCopies: 4,
          publishedDate: new Date("1982-01-01"),
        },
      ]);
    }

    const genericReader = await ReaderModel.findOne({ email: "john.doe@example.com" });
    if (genericReader) {
      await ReaderModel.deleteMany({ email: { $in: ["john.doe@example.com", "jane.smith@example.com"] } });
    }

    const readerCount = await ReaderModel.countDocuments();
    if (readerCount === 0) {
      await ReaderModel.insertMany([
        {
          name: "Kasun Perera",
          email: "kasun.perera@ceylonshelf.lk",
          phoneNumber: "+94 77 123 4567",
          address: "No. 45, Galle Road, Colombo 03",
          registerDate: new Date(),
        },
        {
          name: "Dilhani Rajapaksha",
          email: "dilhani.r@ceylonshelf.lk",
          phoneNumber: "+94 71 987 6543",
          address: "No. 12, Peradeniya Road, Kandy",
          registerDate: new Date(),
        },
        {
          name: "Pathum Nissanka",
          email: "pathum.nissanka@ceylonshelf.lk",
          phoneNumber: "+94 75 345 6789",
          address: "No. 88, Main Street, Kurunegala",
          registerDate: new Date(),
        },
        {
          name: "Tharushi Fernando",
          email: "tharushi.fernando@ceylonshelf.lk",
          phoneNumber: "+94 76 567 8901",
          address: "No. 24, Beach Road, Galle",
          registerDate: new Date(),
        },
      ]);
    }
  } catch (seedErr) {
    console.error("Error during initial data seeding:", seedErr);
  }
};