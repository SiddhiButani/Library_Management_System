# Library Management System — Full MERN Stack Implementation Plan

A complete, production-ready Library Management System with **30+ fully functional pages**, real-time data, admin & member roles, and a modern professional UI.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite, React Router v6, Axios, React Context API, Chart.js |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (access + refresh tokens), bcrypt |
| **File Upload** | Multer (book covers, profile pictures) |
| **Email** | Nodemailer (password reset, notifications) |
| **Styling** | Vanilla CSS with CSS Variables (dark professional theme) |

---

## Design Theme

- **Dark professional theme** with deep navy/charcoal backgrounds
- Accent colors: Electric blue (#3B82F6) + Emerald green (#10B981)
- Glassmorphism cards with subtle backdrop-blur
- Smooth micro-animations and transitions
- Google Font: **Inter** for typography
- Responsive design for all screen sizes
- Sidebar navigation with collapsible menu

---

## Database Models (7 Collections)

### 1. User
- `name`, `email`, `password` (hashed), `role` (admin/member), `phone`, `address`, `profileImage`, `membershipType` (basic/premium/gold), `membershipExpiry`, `isActive`, `resetPasswordToken`, `resetPasswordExpiry`, `createdAt`

### 2. Book
- `title`, `author`, `isbn`, `category`, `description`, `coverImage`, `publisher`, `publishedYear`, `edition`, `language`, `pages`, `totalCopies`, `availableCopies`, `location` (shelf/rack), `type` (book/journal/magazine), `tags`, `isActive`, `createdAt`

### 3. BorrowRecord  
- `user` (ref), `book` (ref), `issueDate`, `dueDate`, `returnDate`, `status` (pending/issued/returned/overdue), `renewCount`, `issuedBy` (admin ref), `returnedTo` (admin ref), `fine` (amount), `fineStatus` (pending/paid/waived), `notes`

### 4. Fine
- `user` (ref), `borrowRecord` (ref), `amount`, `reason`, `status` (pending/paid/waived), `paidDate`, `paymentMethod`, `transactionId`, `createdAt`

### 5. WaitingList
- `user` (ref), `book` (ref), `position`, `status` (waiting/notified/cancelled), `notifiedAt`, `createdAt`

### 6. Category
- `name`, `description`, `icon`, `bookCount`, `isActive`

### 7. ContactMessage
- `name`, `email`, `subject`, `message`, `status` (unread/read/replied), `reply`, `createdAt`

---

## API Routes

### Auth Routes (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register new member |
| POST | `/login` | Login (returns JWT) |
| POST | `/forgot-password` | Send reset email |
| POST | `/reset-password/:token` | Reset password |
| GET | `/me` | Get current user profile |
| POST | `/logout` | Logout (clear token) |

### User Routes (`/api/users`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all users (admin) |
| GET | `/:id` | Get user by ID |
| PUT | `/profile` | Update own profile |
| PUT | `/:id` | Update user (admin) |
| DELETE | `/:id` | Deactivate user (admin) |
| GET | `/stats` | User statistics (admin) |

### Book Routes (`/api/books`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all books (with search, filter, pagination) |
| GET | `/:id` | Get book details |
| POST | `/` | Add book (admin) |
| PUT | `/:id` | Update book (admin) |
| DELETE | `/:id` | Delete book (admin) |
| GET | `/categories` | Get all categories |
| POST | `/categories` | Add category (admin) |
| GET | `/stats` | Book statistics (admin) |
| GET | `/availability/:id` | Check book availability |

### Borrow Routes (`/api/borrows`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/request` | Member requests a book |
| GET | `/my-borrows` | Get member's borrow history |
| PUT | `/issue/:id` | Admin confirms issue |
| PUT | `/return/:id` | Process return |
| PUT | `/renew/:id` | Renew a book |
| GET | `/` | Get all borrow records (admin) |
| GET | `/overdue` | Get overdue books (admin) |
| GET | `/pending` | Get pending requests (admin) |
| GET | `/stats` | Borrow statistics (admin) |

### Fine Routes (`/api/fines`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/my-fines` | Get member's fines |
| POST | `/pay/:id` | Pay a fine |
| GET | `/` | Get all fines (admin) |
| PUT | `/waive/:id` | Waive a fine (admin) |
| GET | `/stats` | Fine statistics (admin) |

### Waiting List Routes (`/api/waitlist`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/join/:bookId` | Join waiting list |
| DELETE | `/leave/:bookId` | Leave waiting list |
| GET | `/my-list` | Get member's waiting list |
| GET | `/` | Get all waiting lists (admin) |

### Contact Routes (`/api/contact`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Submit contact message |
| GET | `/` | Get all messages (admin) |
| PUT | `/:id/reply` | Reply to message (admin) |

### Report Routes (`/api/reports`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Admin dashboard stats |
| GET | `/books` | Book reports |
| GET | `/members` | Member reports |
| GET | `/fines` | Fine reports |
| GET | `/borrows` | Borrow reports |

### Settings Routes (`/api/settings`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get library settings |
| PUT | `/` | Update settings (admin) |

---

## Pages Breakdown (32 Pages)

### Public Pages (4)
1. **Login Page** — Email/password login with validation
2. **Register Page** — New member registration with full form
3. **Forgot Password Page** — Email-based password reset
4. **Reset Password Page** — New password entry from email link

### Member Pages (14)
5. **Member Dashboard** — Welcome banner, borrowed books summary, due dates, fines overview, recent activity
6. **Profile Page** — View full profile details, membership info
7. **Edit Profile Page** — Edit name, email, phone, address, profile picture
8. **Search Books Page** — Advanced search with filters (category, author, availability, type)
9. **Book Details Page** — Full book info, availability status, borrow/waitlist buttons
10. **Book Categories Page** — Browse by category with book counts
11. **Borrowed Books Page** — Current & past borrowed books, return dates, status
12. **Return/Renew Page** — Request return or renew borrowed books
13. **Fines Page** — View all fines, payment status
14. **Pay Fine Page** — Fine payment form
15. **Transaction History Page** — Complete history of borrows, returns, fines
16. **Waiting List Page** — Books member is waiting for, position in queue
17. **Journals & Magazines Page** — Browse journals and magazines separately
18. **Membership Page** — View/upgrade membership plans

### Admin Pages (12)
19. **Admin Dashboard** — Charts, stats (total books, members, active borrows, revenue), recent activity feed
20. **Book Management Page** — CRUD for books with table view, search, filters
21. **Add/Edit Book Page** — Full form for book details with cover upload
22. **Member Management Page** — View all members, activate/deactivate, edit
23. **Issue/Return Management Page** — Pending requests, confirm issue, process returns
24. **Fine Management Page** — All fines, waive fines,  auto-calculate late fines
25. **Reports Page** — Visual reports with charts (borrows over time, popular books, revenue)
26. **Settings Page** — Library settings (fine rates, borrow duration, max renewals, etc.)
27. **Category Management Page** — CRUD for book categories
28. **Contact Messages Page** — View and reply to contact messages

### Shared Pages (4)
29. **About Us Page** — Library info, mission, team, statistics
30. **Contact Us Page** — Contact form with validation
31. **Book Availability Check Page** — Quick check by title/ISBN
32. **404 Page** — Not found page

---

## Proposed Changes

### Backend Structure

```
server/
├── config/
│   └── db.js
├── middleware/
│   ├── auth.js
│   ├── admin.js
│   ├── errorHandler.js
│   └── upload.js
├── models/
│   ├── User.js
│   ├── Book.js
│   ├── BorrowRecord.js
│   ├── Fine.js
│   ├── WaitingList.js
│   ├── Category.js
│   ├── ContactMessage.js
│   └── Settings.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── books.js
│   ├── borrows.js
│   ├── fines.js
│   ├── waitlist.js
│   ├── contact.js
│   ├── reports.js
│   └── settings.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── bookController.js
│   ├── borrowController.js
│   ├── fineController.js
│   ├── waitlistController.js
│   ├── contactController.js
│   ├── reportController.js
│   └── settingsController.js
├── utils/
│   ├── sendEmail.js
│   └── fineCalculator.js
├── server.js
└── package.json
```

### Frontend Structure

```
client/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   └── MemberLayout.jsx
│   │   ├── common/
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   └── EmptyState.jsx
│   │   └── charts/
│   │       ├── BarChart.jsx
│   │       ├── LineChart.jsx
│   │       ├── PieChart.jsx
│   │       └── DoughnutChart.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── member/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── EditProfile.jsx
│   │   │   ├── SearchBooks.jsx
│   │   │   ├── BookDetails.jsx
│   │   │   ├── BookCategories.jsx
│   │   │   ├── BorrowedBooks.jsx
│   │   │   ├── ReturnRenew.jsx
│   │   │   ├── Fines.jsx
│   │   │   ├── PayFine.jsx
│   │   │   ├── TransactionHistory.jsx
│   │   │   ├── WaitingList.jsx
│   │   │   ├── JournalsMagazines.jsx
│   │   │   └── Membership.jsx
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── BookManagement.jsx
│   │   │   ├── AddEditBook.jsx
│   │   │   ├── MemberManagement.jsx
│   │   │   ├── IssueReturn.jsx
│   │   │   ├── FineManagement.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── CategoryManagement.jsx
│   │   │   └── ContactMessages.jsx
│   │   ├── shared/
│   │   │   ├── AboutUs.jsx
│   │   │   ├── ContactUs.jsx
│   │   │   ├── BookAvailability.jsx
│   │   │   └── NotFound.jsx
│   ├── services/
│   │   └── api.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useApi.js
│   ├── utils/
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

---

## Key Features & Logic

### Fine Calculation
- Auto-calculates: `(days overdue) × (fine rate per day)` from Settings
- Triggered on return and daily via cron-like check
- Admin can waive fines with reason

### Book Availability
- `availableCopies` decremented on issue, incremented on return
- If 0, member can join waiting list
- When returned, first person on waiting list gets notified

### Membership System
- **Basic**: Borrow 3 books, 14-day period, 1 renewal
- **Premium**: Borrow 5 books, 21-day period, 2 renewals  
- **Gold**: Borrow 10 books, 30-day period, 3 renewals

### Issue/Return Workflow
1. Member requests book → `status: pending`
2. Admin confirms → `status: issued`, copies decremented
3. Member returns (or admin processes) → `status: returned`, copies incremented
4. If late → fine auto-created

---

## Verification Plan

### Automated Tests
- Run `npm run dev` for both client and server
- Test all API endpoints via browser
- Verify database operations via MongoDB

### Manual Verification
- Test complete user flows: Register → Login → Browse → Borrow → Return → Fine → Pay
- Test admin flows: Login → Dashboard → Manage Books → Issue → Return → Reports
- Test edge cases: overdue books, waiting lists, membership limits
- Browser testing for responsive design

---

## Execution Order

### Phase 1: Backend Foundation
1. Initialize Node.js project, install dependencies
2. Database config & models
3. Auth middleware & routes
4. All API routes & controllers

### Phase 2: Frontend Foundation  
5. Initialize React + Vite project
6. Design system (CSS variables, global styles)
7. Layout components (Sidebar, Header)
8. Auth context & protected routes

### Phase 3: Auth Pages
9. Login, Register, Forgot Password, Reset Password

### Phase 4: Member Pages
10. Dashboard, Profile, Edit Profile
11. Search, Book Details, Categories
12. Borrowed Books, Return/Renew
13. Fines, Pay Fine, Transaction History
14. Waiting List, Journals, Membership

### Phase 5: Admin Pages
15. Admin Dashboard with charts
16. Book Management, Add/Edit Book
17. Member Management
18. Issue/Return Management
19. Fine Management
20. Reports, Settings, Categories, Contact Messages

### Phase 6: Shared Pages & Final Polish
21. About Us, Contact Us, Book Availability, 404
22. Final testing and bug fixes
