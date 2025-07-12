# Library Management System

A comprehensive library management application built with Angular 20, featuring role-based access control for administrators and users.

## Features

### Admin Features
- **Book Management**: Add, edit, and view all books in the library
- **User Management**: View all registered users and their details
- **Transaction Tracking**: Monitor all book borrowing and return transactions
- **Analytics Dashboard**: View statistics on books, users, and transactions
- **Profile Management**: Edit admin profile information

### User Features
- **Book Browsing**: Search and filter available books by title, author, or genre
- **Book Borrowing**: Borrow books with a limit of 6 books per user
- **Borrowed Books Management**: View currently borrowed books and return them
- **Profile Management**: Edit user profile information
- **Transaction History**: View personal borrowing history

### General Features
- **Authentication System**: Secure login and registration with role selection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations
- **Role-based Navigation**: Different menu options based on user role

## Prerequisites

Before running this application locally, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Angular CLI** (version 20 or higher)

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd library-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Angular CLI globally** (if not already installed)
   ```bash
   npm install -g @angular/cli@20
   ```

## Running the Application

1. **Start the development server**
   ```bash
   npm start
   ```
   or
   ```bash
   ng serve
   ```

2. **Open your browser**
   Navigate to `http://localhost:4200`

3. **Login with demo accounts**
   
   **Admin Account:**
   - Email: `admin@library.com`
   - Password: `admin123`
   
   **User Account:**
   - Email: `user@library.com`
   - Password: `user123`
   
   Or click the "Login as Admin" or "Login as User" buttons on the login page.

## Project Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── manage-books/
│   │   ├── manage-users/
│   │   └── transactions/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   ├── navbar/
│   ├── profile/
│   └── user/
│       ├── browse-books/
│       └── borrowed-books/
├── guards/
│   ├── admin.guard.ts
│   └── auth.guard.ts
├── models/
│   ├── book.model.ts
│   └── user.model.ts
├── services/
│   ├── auth.service.ts
│   └── book.service.ts
├── app.routes.ts
├── main.ts
└── global_styles.css
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build the project for production
- `npm run build:dev` - Build the project for development
- `ng serve` - Start development server (alternative)
- `ng build` - Build the project
- `ng test` - Run unit tests (if configured)

## Technology Stack

- **Frontend Framework**: Angular 20
- **Language**: TypeScript
- **Styling**: CSS3 with custom design system
- **State Management**: RxJS with Services
- **Routing**: Angular Router with Guards
- **Data Storage**: Local Storage (for demo purposes)
- **Build Tool**: Angular CLI with Vite

## Key Components

### Authentication
- Role-based authentication system
- Route guards for protected pages
- Persistent login state

### Data Management
- Local storage for user data and transactions
- Reactive data flow with RxJS
- Service-based architecture

### UI/UX
- Responsive grid layouts
- Modern card-based design
- Smooth transitions and hover effects
- Accessibility-friendly design

## Default Data

The application comes with pre-loaded sample data:

### Books
- "The Great Gatsby" by F. Scott Fitzgerald
- "To Kill a Mockingbird" by Harper Lee

### Users
- Admin user (admin@library.com)
- Demo user account can be created via registration

## User Roles & Permissions

### Admin
- Full access to all features
- Can manage books and users
- Can view all transactions
- Access to admin dashboard

### User
- Can browse and borrow books
- Limited to 6 borrowed books at a time
- Can view personal transaction history
- Access to user dashboard

## Customization

### Changing Borrow Limit
The default borrow limit for users is set to 6 books. To change this:

1. Open `src/services/auth.service.ts`
2. Modify the `borrowLimit` value in the `register` method:
   ```typescript
   borrowLimit: userData.role === 'user' ? 6 : 0  // Change 6 to desired limit
   ```

### Adding New Book Genres
Books can be categorized by genre. The system automatically extracts genres from added books.

### Styling Customization
The application uses a custom CSS design system. Main colors can be modified in `src/global_styles.css`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   ng serve --port 4201
   ```

2. **Node modules issues**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Angular CLI not found**
   ```bash
   npm install -g @angular/cli@20
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support or questions, please create an issue in the repository or contact the development team.