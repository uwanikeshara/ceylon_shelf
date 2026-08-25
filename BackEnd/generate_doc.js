const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
} = require("docx");

const primaryColor = "0D9488"; // Teal
const secondaryColor = "0F172A"; // Dark Slate
const accentColor = "0284C7"; // Blue Accent
const lightBg = "F8FAFC"; // Light Slate
const highlightBg = "F0FDFA"; // Mint Light
const borderColor = "CBD5E1"; // Border Slate
const codeBg = "1E293B"; // Dark Editor BG

const createHeader = (text) =>
  new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 140 },
  });

const createSubHeader = (text) =>
  new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 100 },
  });

const createSubSubHeader = (text) =>
  new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
  });

const createPara = (text, bold = false) =>
  new Paragraph({
    spacing: { after: 120, line: 276 },
    children: [
      new TextRun({
        text: text,
        bold: bold,
        font: "Arial",
        size: 22,
        color: "334155",
      }),
    ],
  });

const createBullet = (text, boldPrefix = "") =>
  new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80, line: 250 },
    children: [
      ...(boldPrefix ? [new TextRun({ text: boldPrefix, bold: true, font: "Arial", size: 22, color: secondaryColor })] : []),
      new TextRun({ text: text, font: "Arial", size: 22, color: "334155" }),
    ],
  });

const createCallout = (title, text) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: primaryColor },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: primaryColor },
      left: { style: BorderStyle.SINGLE, size: 24, color: primaryColor },
      right: { style: BorderStyle.SINGLE, size: 6, color: primaryColor },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: highlightBg, type: ShadingType.CLEAR },
            margins: { top: 140, bottom: 140, left: 180, right: 180 },
            children: [
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: title, bold: true, font: "Arial", size: 22, color: primaryColor }),
                ],
              }),
              new Paragraph({
                spacing: { after: 0, line: 240 },
                children: [
                  new TextRun({ text: text, font: "Arial", size: 20, color: "334155" }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

const createCodeBlock = (codeText) => {
  const lines = codeText.split("\n");
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: primaryColor },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: primaryColor },
      left: { style: BorderStyle.SINGLE, size: 16, color: primaryColor },
      right: { style: BorderStyle.SINGLE, size: 6, color: primaryColor },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: codeBg, type: ShadingType.CLEAR },
            margins: { top: 140, bottom: 140, left: 180, right: 180 },
            children: lines.map(
              (line) =>
                new Paragraph({
                  spacing: { after: 30, line: 210 },
                  children: [
                    new TextRun({
                      text: line,
                      font: "Consolas",
                      size: 18,
                      color: "F1F5F9",
                    }),
                  ],
                })
            ),
          }),
        ],
      }),
    ],
  });
};

const createTable = (headers, rows) => {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: borderColor },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: borderColor },
      left: { style: BorderStyle.SINGLE, size: 6, color: borderColor },
      right: { style: BorderStyle.SINGLE, size: 6, color: borderColor },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map(
          (h) =>
            new TableCell({
              shading: { fill: secondaryColor, type: ShadingType.CLEAR },
              margins: { top: 120, bottom: 120, left: 140, right: 140 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({ text: h, bold: true, font: "Arial", size: 20, color: "FFFFFF" }),
                  ],
                }),
              ],
            })
        ),
      }),
      ...rows.map(
        (row, idx) =>
          new TableRow({
            children: row.map(
              (cellText) =>
                new TableCell({
                  shading: { fill: idx % 2 === 0 ? "FFFFFF" : lightBg, type: ShadingType.CLEAR },
                  margins: { top: 100, bottom: 100, left: 140, right: 140 },
                  children: [
                    new Paragraph({
                      spacing: { after: 0, line: 220 },
                      children: [
                        new TextRun({ text: cellText, font: "Arial", size: 19, color: "334155" }),
                      ],
                    }),
                  ],
                })
            ),
          })
      ),
    ],
  });
};

const createScriptScene = (sceneNum, title, duration, sayText, showText) => {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: primaryColor },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: primaryColor },
      left: { style: BorderStyle.SINGLE, size: 18, color: primaryColor },
      right: { style: BorderStyle.SINGLE, size: 6, color: primaryColor },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: secondaryColor, type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 160, right: 160 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: `SCENE ${sceneNum}: ${title.toUpperCase()}`, bold: true, font: "Arial", size: 22, color: "FFFFFF" }),
                  new TextRun({ text: `   |   Target Duration: ${duration}`, font: "Arial", size: 20, color: accentColor }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: lightBg, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: [
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: "🎬 WHAT TO SHOW / SCREEN ACTION:", bold: true, font: "Arial", size: 20, color: primaryColor }),
                ],
              }),
              new Paragraph({
                spacing: { after: 120, line: 240 },
                children: [
                  new TextRun({ text: showText, font: "Arial", size: 20, color: "334155" }),
                ],
              }),
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: "🎙️ WHAT TO SAY / NARRATION SCRIPT:", bold: true, font: "Arial", size: 20, color: secondaryColor }),
                ],
              }),
              new Paragraph({
                spacing: { after: 0, line: 240 },
                children: [
                  new TextRun({ text: `"${sayText}"`, italic: true, font: "Arial", size: 20, color: "1E293B" }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
};

const doc = new Document({
  styles: {
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { font: "Arial", size: 28, bold: true, color: primaryColor },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { font: "Arial", size: 24, bold: true, color: secondaryColor },
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { font: "Arial", size: 22, bold: true, color: accentColor },
      },
    ],
  },
  sections: [
    {
      properties: {},
      children: [
        // Title Block
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 100 },
          children: [
            new TextRun({
              text: "CEYLONSHELF DIGITAL LIBRARY HUB",
              bold: true,
              size: 36,
              color: primaryColor,
              font: "Arial",
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: "COMPLETE PROJECT DOCUMENTATION & VIDEO RECORDING SCRIPT",
              bold: true,
              size: 22,
              color: secondaryColor,
              font: "Arial",
            }),
          ],
        }),

        createCallout(
          "📋 Master Document Purpose & Owner Video Guide",
          "This single, comprehensive document contains the complete technical architecture, technology stack specifications, database entity models, REST API reference tables, automated testing procedures, Docker deployment guides, and a scene-by-scene script specifically designed for the project owner to record a full video demonstration of all system functions."
        ),

        new Paragraph({ spacing: { after: 240 } }),

        // SECTION 1: EXECUTIVE SUMMARY
        createHeader("SECTION 1: EXECUTIVE SUMMARY & PROJECT SPECIFICATIONS"),
        createSubHeader("1.1 System Overview"),
        createPara(
          "CeylonShelf is a modern, full-stack, real-time Digital Library & Knowledge Management System tailored for public and academic library networks in Sri Lanka. It connects multiple regional library branches (including Colombo, Kandy, Galle, Peradeniya, and Kurunegala) into a centralized, synchronized digital platform."
        ),
        createPara(
          "The system addresses traditional library manual bottlenecks—such as physical record books, untracked overdue returns, manual fine calculations, and delayed notifications—by providing real-time WebSockets synchronization, automated fine tracking (LKR 50.00/day), automated email overdue notices, and interactive dashboard analytics."
        ),

        createSubHeader("1.2 Core Project Capabilities"),
        createBullet(" Secure JWT-based authentication with dual token storage (access tokens & HTTP-only refresh cookies) supporting Admin and User roles.", "• User & Role Management:"),
        createBullet(" Comprehensive catalog management supporting title, author, genre filtering, live search, and dynamic available copy tracking.", "• Book Catalog System:"),
        createBullet(" Member directory tracking contact details, registration dates, and active lending status across regional branches.", "• Reader Directory:"),
        createBullet(" Issue 14-day book loans, track active borrowings, process returns, and automatically increment/decrement available stock counts.", "• Book Loan Circulation:"),
        createBullet(" Real-time identification of late returns, automated LKR 50/day fine calculation, and one-click email notification dispatch via Nodemailer SMTP.", "• Overdue & Fine Processing:"),
        createBullet(" Instant browser multi-client state update via Socket.IO WebSockets whenever inventory, reader, or loan records change.", "• Real-Time Event Sync:"),

        // SECTION 2: TECH STACK
        createHeader("SECTION 2: COMPLETE TECHNOLOGY STACK & SPECIFICATIONS"),
        createPara("CeylonShelf leverages industry-standard, production-grade technologies across all tiers of the application:"),

        createTable(
          ["Category", "Technology / Framework", "Version", "Key Function & Purpose"],
          [
            ["Frontend Core", "React", "v19.1.0", "Declarative component-based UI library"],
            ["Frontend Language", "TypeScript", "v5.8.3", "Static typing & compile-time error prevention"],
            ["Build Tool", "Vite", "v6.3.5", "Ultra-fast frontend dev server & asset bundling"],
            ["Styling", "TailwindCSS", "v4.1.7", "Utility-first CSS styling framework"],
            ["Client Routing", "React Router DOM", "v7.6.1", "Declarative browser routing & protected guards"],
            ["Real-Time Client", "Socket.IO Client", "v4.8.3", "WebSocket client for live data event listening"],
            ["HTTP Client", "Axios", "v1.9.0", "Promise-based HTTP client with auth interceptors"],
            ["Notifications", "React Hot Toast", "v2.5.2", "Toast popups for real-time notifications"],
            ["Data Visualization", "Recharts", "v2.15.3", "Interactive charts for dashboard analytics"],
            ["Backend Runtime", "Node.js", "v20.x / v24.x", "Asynchronous event-driven JavaScript runtime"],
            ["Backend Framework", "Express", "v5.1.0", "REST API web framework for Node.js"],
            ["Backend Language", "TypeScript", "v5.8.3", "Type safety across server controllers & routes"],
            ["Real-Time Server", "Socket.IO Server", "v4.8.3", "WebSocket server for broadcasting live updates"],
            ["Database Persistence", "MongoDB", "v6.0", "Document-oriented NoSQL database"],
            ["Object Data Modeling", "Mongoose ORM", "v8.15.2", "Schema validation & MongoDB query abstraction"],
            ["In-Memory Database", "MongoMemoryServer", "v11.2.0", "In-memory MongoDB fallback for dev & tests"],
            ["Email Service", "Nodemailer", "v7.0.5", "SMTP transport for automated overdue email notices"],
            ["Authentication", "JSON Web Token (JWT)", "v9.0.2", "Stateless authorization tokens"],
            ["Password Security", "Bcrypt", "v6.0.0", "Salted password hashing algorithms"],
            ["Testing Suite", "Jest & Supertest", "v30.x / v7.x", "Unit & API integration testing framework"],
            ["Containerization", "Docker & Docker Compose", "v3.8", "Multi-container containerized deployment"],
          ]
        ),

        new Paragraph({ spacing: { after: 200 } }),

        // SECTION 3: SYSTEM ARCHITECTURE
        createHeader("SECTION 3: SYSTEM ARCHITECTURE & ENTITY SCHEMAS"),
        createSubHeader("3.1 Architectural Overview"),
        createPara("CeylonShelf follows a 3-Tier Layered Architecture with decoupled responsibilities:"),
        createBullet(" Built with React 19, TypeScript, and Vite. Renders views, handles state, and communicates asynchronously via REST APIs and WebSockets.", "1. Presentation Layer (Client):"),
        createBullet(" Node.js Express 5 API server following the Model-View-Controller (MVC) pattern. Houses business logic, JWT authentication, mail services, and WebSockets broadcasting.", "2. Application & Logic Layer (Server):"),
        createBullet(" MongoDB database managed via Mongoose ORM models, with MongoMemoryServer fallback for seamless execution.", "3. Persistence Layer (Database):"),

        createSubHeader("3.2 Software Design Patterns Implemented"),
        createBullet(" Strict separation between data schemas (models/), API route handlers (controllers/), and client UI views.", "• Model-View-Controller (MVC):"),
        createBullet(" Socket.IO acts as an event emitter/publisher broadcasting system-wide changes to connected subscribers in real time.", "• Publisher-Subscriber (Pub/Sub):"),
        createBullet(" Independent modules for mail handling (mail.service.ts), socket events (socket.ts), database seeding (mongo.ts), and error handling (errorHandler.ts).", "• Single Responsibility Principle:"),

        createSubHeader("3.3 Database Entity Schemas"),
        createPara("The system manages four core MongoDB collection models defined in TypeScript:"),

        createSubSubHeader("1. User Entity (models/User.ts)"),
        createCodeBlock(
`interface IUser {
  _id: ObjectId;
  name: string;
  email: string; // Unique, lowercased
  password: string; // Bcrypt hashed (SALT=10)
  role: "admin" | "user"; // Default: "user"
  createdAt: Date;
  updatedAt: Date;
}`
        ),

        createSubSubHeader("2. Book Entity (models/Book.ts)"),
        createCodeBlock(
`interface IBook {
  _id: ObjectId;
  title: string;
  author: string;
  genre: string;
  availableCopies: number; // Decrements on borrow, increments on return
  publishedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}`
        ),

        createSubSubHeader("3. Reader Entity (models/Reader.ts)"),
        createCodeBlock(
`interface IReader {
  _id: ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  registerDate: Date;
  createdAt: Date;
  updatedAt: Date;
}`
        ),

        createSubSubHeader("4. Lending Entity (models/Lending.ts)"),
        createCodeBlock(
`interface ILending {
  _id: ObjectId;
  bookId: ObjectId; // Ref: Book
  readerId: ObjectId; // Ref: Reader
  bookTitle: string;
  readerName: string;
  borrowDate: Date; // Default: Date.now
  dueDate: Date; // Default: borrowDate + 14 days
  returnDate?: Date | null;
  status: "borrowed" | "returned" | "overdue";
  createdAt: Date;
  updatedAt: Date;
}`
        ),

        new Paragraph({ spacing: { after: 200 } }),

        // SECTION 4: REST API ROUTE REFERENCE
        createHeader("SECTION 4: COMPLETE REST API ROUTE REFERENCE"),
        createPara("The backend exposes a structured RESTful API under the `/api` namespace:"),

        createTable(
          ["Module", "Method", "Endpoint", "Auth Guard", "Description & Payload"],
          [
            ["Auth", "POST", "/api/auth/signup", "Public", "Register standard user & auto-create reader"],
            ["Auth", "POST", "/api/auth/admin-signup", "Admin", "Register admin staff member"],
            ["Auth", "POST", "/api/auth/login", "Public", "Authenticate & set HTTP-only refresh cookie"],
            ["Auth", "POST", "/api/auth/refresh", "Public", "Issue new short-lived JWT access token"],
            ["Auth", "POST", "/api/auth/logout", "Public", "Clear refresh cookie"],
            ["Auth", "GET", "/api/auth/users", "Admin", "List all registered staff/user accounts"],
            ["Auth", "DELETE", "/api/auth/users/:id", "Admin", "Remove registered user account"],
            ["Books", "GET", "/api/book", "Public", "Fetch all book catalog items"],
            ["Books", "POST", "/api/book", "Admin", "Create new book entry"],
            ["Books", "GET", "/api/book/:id", "Public", "Fetch specific book details"],
            ["Books", "PUT", "/api/book/:id", "Admin", "Update book details & stock"],
            ["Books", "DELETE", "/api/book/:id", "Admin", "Delete book from catalog"],
            ["Books", "GET", "/api/book/count/total", "Public", "Count distinct book titles"],
            ["Books", "GET", "/api/book/count/copies", "Public", "Calculate sum of all available copies"],
            ["Readers", "GET", "/api/reader", "Public", "Fetch all registered library readers"],
            ["Readers", "POST", "/api/reader", "Admin", "Register new library reader"],
            ["Readers", "GET", "/api/reader/:id", "Public", "Fetch reader details"],
            ["Readers", "PUT", "/api/reader/:id", "Admin", "Update reader profile"],
            ["Readers", "DELETE", "/api/reader/:id", "Admin", "Delete reader record"],
            ["Lendings", "GET", "/api/lending", "Public", "Fetch all lending transactions"],
            ["Lendings", "POST", "/api/lending", "Admin", "Issue book loan & auto-decrement copy count"],
            ["Lendings", "POST", "/api/lending/complete/:id", "Admin", "Process book return & increment stock"],
            ["Lendings", "DELETE", "/api/lending/:id", "Admin", "Delete lending record"],
            ["Lendings", "GET", "/api/lending/overdue/all", "Public", "List all overdue book loans"],
            ["Lendings", "POST", "/api/lending/overdue/notify/:lendingId", "Admin", "Send automated Nodemailer email alert"],
          ]
        ),

        new Paragraph({ spacing: { after: 200 } }),

        // SECTION 5: VIDEO RECORDING GUIDE & SCRIPT
        createHeader("SECTION 5: VIDEO RECORDING GUIDE & SCENE-BY-SCENE SCRIPT FOR OWNER"),
        createPara(
          "This section provides a turn-key script and recording walkthrough for the project owner to record a high-impact, demonstration video covering all system functions and technologies."
        ),

        createCallout(
          "💡 Video Presentation Preparation Tips",
          "• Recommended Video Duration: 8 to 10 Minutes.\n" +
            "• Resolution & Setup: 1080p Screen Recording (OBS Studio or Windows Game Bar) + Clear Microphone Audio.\n" +
            "• Web Browsers: Open Chrome (Admin session) and Edge/Firefox or Chrome Incognito (Second client session for WebSockets demo).\n" +
            "• Initial State: Run `start_app.bat` beforehand so database seeding creates initial Sri Lankan sample data."
        ),

        new Paragraph({ spacing: { after: 180 } }),

        createScriptScene(
          "1",
          "Introduction & Tech Stack Overview",
          "1:30 Mins",
          "Welcome everyone! Today I am presenting CeylonShelf, a real-time, full-stack Digital Library & Knowledge Management System designed for library networks in Sri Lanka. " +
            "This project is built using React 19 with TypeScript, Vite, and TailwindCSS on the frontend. The backend is powered by Node.js, Express 5, and Mongoose ORM connected to MongoDB. " +
            "We also integrate Socket.IO for real-time WebSockets synchronization, Nodemailer for automated email overdue notices, Jest and Supertest for testing, and Docker for containerized deployment.",
          "Display project root directory in VS Code, highlight `package.json` dependencies, `docker-compose.yml`, and `README.md`."
        ),

        new Paragraph({ spacing: { after: 140 } }),

        createScriptScene(
          "2",
          "Automated Launch & Resilient In-Memory Fallback",
          "1:00 Min",
          "To ensure seamless deployment on any machine, CeylonShelf features a single-click launcher script called `start_app.bat`. " +
            "It automatically manages environment variables, installs missing npm packages, builds TypeScript source code, and launches both backend API server on port 3000 and frontend client on port 5173. " +
            "Furthermore, if a local MongoDB service is unavailable, our custom `mongo.ts` database connector automatically spins up MongoMemoryServer—an in-memory MongoDB fallback—and seeds initial Sri Lankan library records automatically!",
          "Show command prompt running `start_app.bat`, watch the automated log outputs, and demonstrate Chrome launching automatically at http://localhost:5173."
        ),

        new Paragraph({ spacing: { after: 140 } }),

        createScriptScene(
          "3",
          "Authentication & Role-Based Security Guard",
          "1:15 Mins",
          "CeylonShelf implements role-based authentication using JSON Web Tokens (JWT). " +
            "Access tokens are maintained in client state while refresh tokens are secured using HTTP-only, SameSite cookies. " +
            "Let me log in using our seeded administrator account: admin@ceylonshelf.lk with password admin123. " +
            "Notice how non-authenticated users or standard users cannot access protected administrative dashboard routes due to our React Router `AdminRoutes` security wrapper.",
          "Show Login screen (`/login`), type credentials `admin@ceylonshelf.lk`, submit form, show instant redirection to `/dashboard`, and inspect Developer Tools HTTP-only cookie."
        ),

        new Paragraph({ spacing: { after: 140 } }),

        createScriptScene(
          "4",
          "Dashboard Analytics & Visual Recharts Breakdown",
          "1:00 Min",
          "Upon login, administrators are greeted with a visual Dashboard. " +
            "It displays metric summary cards for Total Book Titles, Total Stock Copies, Total Registered Readers, Active Borrowings, and Overdue Accounts. " +
            "Below the metrics, interactive Recharts visualizations show real-time distribution of loan statuses and book availability ratios across branches.",
          "Navigate through `/dashboard`, hover over count cards, interact with Recharts graphs showing loan distributions."
        ),

        new Paragraph({ spacing: { after: 140 } }),

        createScriptScene(
          "5",
          "Book Catalog & Reader Directory CRUD Operations",
          "1:30 Mins",
          "Let's check the Book Catalog page. Here staff can view, search, add, edit, and delete books. " +
            "I will add a new Sri Lankan literary work: 'The Village in the Jungle' by Leonard Woolf, with 5 available copies. " +
            "We can immediately filter titles using the live instant search bar. " +
            "Next, on the Readers page, we manage member profiles, including contact numbers, email addresses, and branch registration dates.",
          "Navigate to `/dashboard/books`, click 'Add Book', fill details, submit modal. Filter list using search bar. Then navigate to `/dashboard/readers` and demonstrate reader management."
        ),

        new Paragraph({ spacing: { after: 140 } }),

        createScriptScene(
          "6",
          "Circulation: Issue Loans & Process Returns",
          "1:15 Mins",
          "Now let's demonstrate the lending workflow. On the Lending Management page, staff can issue a 14-day book loan by selecting a reader and an available book title. " +
            "When issued, the book's available copy count automatically decrements by 1 in the database. " +
            "When the member returns the book, clicking 'Mark Returned' updates the lending status to Returned and automatically restores the book copy back to the available inventory!",
          "Navigate to `/dashboard/lending`, issue a loan for a reader, show copy count decrement in Books table. Click 'Complete Return', verify status change and stock restoration."
        ),

        new Paragraph({ spacing: { after: 140 } }),

        createScriptScene(
          "7",
          "Overdue Fine Processing & Automated Email Alerts",
          "1:15 Mins",
          "On the Overdue page, the system automatically scans for loans exceeding their 14-day due date. " +
            "It dynamically computes late penalties at a standard rate of LKR 50.00 per overdue day. " +
            "With one click on 'Send Email Notice', CeylonShelf invokes Nodemailer via SMTP transport to send a polite email reminder directly to the member's registered email address!",
          "Navigate to `/dashboard/overdue`, highlight overdue loan items and calculated LKR fine amount. Click 'Send Email Notice', show green toast notification and server terminal SMTP send log."
        ),

        new Paragraph({ spacing: { after: 140 } }),

        createScriptScene(
          "8",
          "Real-Time WebSockets Synchronization Demonstration",
          "1:00 Min",
          "One of CeylonShelf's standout features is multi-client real-time synchronization via WebSockets (Socket.IO). " +
            "I have two browser windows side by side: Chrome on the left and Edge on the right. " +
            "Watch closely: when I issue a book loan or add a new book in Chrome, Socket.IO instantly broadcasts `book_updated` and `lending_updated` events. " +
            "The right window updates its table metrics and displays a real-time toast popup instantly without reloading the page!",
          "Place Chrome and Edge side by side. Perform action in Chrome (e.g. return a book). Show instant toast notification and dynamic table update appearing in Edge automatically."
        ),

        new Paragraph({ spacing: { after: 140 } }),

        createScriptScene(
          "9",
          "Automated Jest Testing & Docker Deployment",
          "1:00 Min",
          "To conclude, CeylonShelf is fully tested and containerized. " +
            "Running `npm test` inside the BackEnd directory runs automated Jest and Supertest integration tests validating REST API endpoints, JWT token verification, and database persistence. " +
            "For production deployment, running `docker-compose up --build` launches isolated microservice containers for MongoDB, Node.js API server, and Nginx frontend web server seamlessly!",
          "Show terminal running `npm test` with 100% passing tests. Display `docker-compose.yml` and explain containerization setup."
        ),

        new Paragraph({ spacing: { after: 200 } }),

        // SECTION 6: INSTALLATION & DEPLOYMENT GUIDE
        createHeader("SECTION 6: INSTALLATION, TESTING & CONTAINER DEPLOYMENT"),
        createSubHeader("6.1 Local Manual Setup"),
        createCodeBlock(
`# 1. Clone & Enter Repository
cd CeylonShelf

# 2. Setup BackEnd
cd BackEnd
npm install
npm run dev  # Starts backend server on http://localhost:3000

# 3. Setup FrontEnd (in separate terminal)
cd FrontEnd
npm install
npm run dev  # Starts React Vite client on http://localhost:5173`
        ),

        createSubHeader("6.2 Automated One-Click Windows Setup"),
        createCodeBlock(
`# Simply double-click or run from command prompt:
start_app.bat`
        ),

        createSubHeader("6.3 Running Automated Test Suite"),
        createCodeBlock(
`cd BackEnd
npm test`
        ),

        createSubHeader("6.4 Multi-Container Docker Deployment"),
        createCodeBlock(
`# Build and launch isolated containers for Database, Backend API, and Nginx Frontend:
docker-compose up --build`
        ),

        new Paragraph({ spacing: { after: 300 } }),

        // Document Footer
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          children: [
            new TextRun({
              text: "— End of Official Documentation & Video Recording Guide —",
              italic: true,
              size: 20,
              color: "64748B",
              font: "Arial",
            }),
          ],
        }),
      ],
    },
  ],
});

const outputPath = path.join(__dirname, "..", "CeylonShelf_Complete_Project_and_Video_Guide.docx");

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`[SUCCESS] Master Word Document generated successfully at:\n  ${outputPath}`);
});
