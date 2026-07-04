import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const PORT = 3000;
const DB_PATH = path.join(process.cwd(), "src", "db.json");

// Helper function to read database
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { users: [], bookings: [], reviews: [] };
    }
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database:", err);
    return { users: [], bookings: [], reviews: [] };
  }
}

// Helper function to write database
function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing database:", err);
    return false;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- API Routes ---

  // Auth: Login
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "이메일과 비밀번호를 입력해주세요." });
    }

    const db = readDB();
    const user = db.users.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." });
    }

    // Omit password from response
    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser });
  });

  // Auth: Register
  app.post("/api/auth/register", (req, res) => {
    const { email, password, name, phone, address, addressDetail } = req.body;
    if (!email || !password || !name || !phone) {
      return res.status(400).json({ error: "필수 정보를 모두 입력해주세요." });
    }

    const db = readDB();
    const exists = db.users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ error: "이미 가입된 이메일입니다." });
    }

    const newUser = {
      id: "u_" + Date.now(),
      email,
      password,
      name,
      phone,
      address: address || "",
      addressDetail: addressDetail || "",
      role: "user", // Default role
    };

    db.users.push(newUser);
    writeDB(db);

    const { password: _, ...safeUser } = newUser;
    res.json({ user: safeUser });
  });

  // Bookings: List
  app.get("/api/bookings", (req, res) => {
    const { userId, role, search, date } = req.query;
    const db = readDB();
    let bookings = db.bookings;

    // Filter by user if not admin
    if (role !== "admin") {
      if (!userId) {
        return res.status(400).json({ error: "userId가 필요합니다." });
      }
      bookings = bookings.filter((b: any) => b.userId === userId);
    } else {
      // If admin, they can filter by userId if specified
      if (userId) {
        bookings = bookings.filter((b: any) => b.userId === userId);
      }
    }

    // Apply search filter (for customer name, phone, or requests)
    if (search) {
      const q = String(search).toLowerCase();
      bookings = bookings.filter(
        (b: any) =>
          b.userName.toLowerCase().includes(q) ||
          b.userPhone.includes(q) ||
          (b.requests && b.requests.toLowerCase().includes(q)) ||
          b.id.includes(q)
      );
    }

    // Apply date filter
    if (date) {
      bookings = bookings.filter((b: any) => b.date === date);
    }

    // Sort by date and time desc
    bookings.sort((a: any, b: any) => {
      const dateA = `${a.date}T${a.time}`;
      const dateB = `${b.date}T${b.time}`;
      return dateB.localeCompare(dateA);
    });

    res.json({ bookings });
  });

  // Bookings: Create
  app.post("/api/bookings", (req, res) => {
    const { userId, userName, userPhone, serviceType, address, addressDetail, date, time, requests } = req.body;

    if (!userId || !userName || !userPhone || !serviceType || !address || !date || !time) {
      return res.status(400).json({ error: "필수 예약 정보를 모두 입력해주세요." });
    }

    const db = readDB();

    // Check if the time slot is already booked for the same service or clean date (prevent duplicate on same exact hour/date)
    const alreadyBooked = db.bookings.some(
      (b: any) => b.date === date && b.time === time && b.status !== "취소"
    );

    if (alreadyBooked) {
      return res.status(400).json({ error: "해당 날짜와 시간은 이미 다른 예약이 차 있습니다." });
    }

    const newBooking = {
      id: String(1000 + db.bookings.length + 1), // Generate sequential ID
      userId,
      userName,
      userPhone,
      serviceType,
      address,
      addressDetail: addressDetail || "",
      date,
      time,
      requests: requests || "",
      status: "예약완료",
      memo: "",
      createdAt: new Date().toISOString(),
    };

    db.bookings.push(newBooking);
    writeDB(db);

    res.json({ booking: newBooking });
  });

  // Bookings: Update (Status, Date, Time, Requests, Memo)
  app.put("/api/bookings/:id", (req, res) => {
    const { id } = req.params;
    const { status, date, time, requests, memo } = req.body;

    const db = readDB();
    const bookingIndex = db.bookings.findIndex((b: any) => b.id === id);

    if (bookingIndex === -1) {
      return res.status(404).json({ error: "예약을 찾을 수 없습니다." });
    }

    const booking = db.bookings[bookingIndex];

    // If date and/or time is changed, check slot availability
    if ((date && date !== booking.date) || (time && time !== booking.time)) {
      const targetDate = date || booking.date;
      const targetTime = time || booking.time;
      const conflict = db.bookings.some(
        (b: any) => b.id !== id && b.date === targetDate && b.time === targetTime && b.status !== "취소"
      );
      if (conflict) {
        return res.status(400).json({ error: "해당 일정은 이미 다른 예약이 존재합니다." });
      }
    }

    // Update fields
    if (status) booking.status = status;
    if (date) booking.date = date;
    if (time) booking.time = time;
    if (requests !== undefined) booking.requests = requests;
    if (memo !== undefined) booking.memo = memo;

    db.bookings[bookingIndex] = booking;
    writeDB(db);

    res.json({ booking });
  });

  // Bookings: Export CSV
  app.get("/api/bookings/export", (req, res) => {
    const db = readDB();
    const bookings = db.bookings;

    let csvContent = "\ufeff"; // BOM for excel Korean encoding
    csvContent += "예약번호,고객명,연락처,서비스,주소,날짜,시간,상태,요청사항,메모,등록일\n";

    bookings.forEach((b: any) => {
      const row = [
        b.id,
        `"${b.userName.replace(/"/g, '""')}"`,
        b.userPhone,
        b.serviceType,
        `"${(b.address + " " + b.addressDetail).replace(/"/g, '""')}"`,
        b.date,
        b.time,
        b.status,
        `"${(b.requests || "").replace(/"/g, '""')}"`,
        `"${(b.memo || "").replace(/"/g, '""')}"`,
        b.createdAt,
      ].join(",");
      csvContent += row + "\n";
    });

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=cleanexpert_bookings.csv");
    res.status(200).send(csvContent);
  });

  // Admin: Get Dashboard Stats
  app.get("/api/stats", (req, res) => {
    const db = readDB();
    const bookings = db.bookings;

    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    
    // Get current date context
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0,0,0,0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23,59,59,999);

    const startOfMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    const endOfMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-31`; // Rough approximation

    let todayCount = 0;
    let weekCount = 0;
    let monthCount = 0;
    let completedCount = 0;
    let pendingCount = 0;

    bookings.forEach((b: any) => {
      const bDate = new Date(b.date);
      const bDateStr = b.date;

      if (bDateStr === todayStr) {
        todayCount++;
      }

      if (bDate >= startOfWeek && bDate <= endOfWeek) {
        weekCount++;
      }

      if (bDateStr >= startOfMonthStr && bDateStr <= endOfMonthStr) {
        monthCount++;
      }

      if (b.status === "완료") {
        completedCount++;
      } else if (b.status === "예약완료" || b.status === "방문중") {
        pendingCount++;
      }
    });

    res.json({
      todayCount,
      weekCount,
      monthCount,
      completedCount,
      pendingCount,
    });
  });

  // Reviews: List and Create
  app.get("/api/reviews", (req, res) => {
    const db = readDB();
    res.json({ reviews: db.reviews });
  });

  app.post("/api/reviews", (req, res) => {
    const { userName, rating, comment } = req.body;
    if (!userName || !rating || !comment) {
      return res.status(400).json({ error: "필수 후기 항목을 모두 입력해주세요." });
    }

    const db = readDB();
    const newReview = {
      id: "r_" + Date.now(),
      userName,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString(),
    };

    db.reviews.unshift(newReview); // Put newest reviews first
    writeDB(db);

    res.json({ review: newReview });
  });

  // --- Vite & Client Frontend Asset Serving ---

  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
