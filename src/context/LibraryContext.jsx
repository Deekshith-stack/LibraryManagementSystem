import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  initialBooks,
  initialUsers,
  initialTransactions,
  initialReservations,
  initialSettings,
  initialNotifications
} from '../utils/mockData';

export const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  // Clear any legacy localStorage versions from earlier iterations to ensure fresh start
  useEffect(() => {
    try {
      const oldVersion = localStorage.getItem('lms_data_version');
      if (oldVersion !== '3.0') {
        localStorage.removeItem('lms_books');
        localStorage.removeItem('lms_users');
        localStorage.removeItem('lms_transactions');
        localStorage.removeItem('lms_reservations');
        localStorage.removeItem('lms_settings');
        localStorage.removeItem('lms_payment_records');
        localStorage.removeItem('lms_notifications');
        localStorage.removeItem('lms_sessions');
        localStorage.removeItem('lms_system_logs');
        localStorage.removeItem('lms_current_user_id');
        localStorage.setItem('lms_data_version', '3.0');
      }
    } catch (e) {
      console.warn("LocalStorage clear failed", e);
    }
  }, []);

  // Books State
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('lms_v3_books');
    return saved ? JSON.parse(saved) : initialBooks.map(b => ({
      ...b,
      reviews: b.reviews || [],
      wishlist: b.wishlist || [],
      rating: b.rating || 0
    }));
  });

  // Users State
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('lms_v3_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  // Transactions State (Loans)
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('lms_v3_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  // Reservations State
  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem('lms_v3_reservations');
    return saved ? JSON.parse(saved) : initialReservations;
  });

  // Settings State (Fine rate in ₹, etc.)
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('lms_v3_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  // Payment Records State
  const [paymentRecords, setPaymentRecords] = useState(() => {
    const saved = localStorage.getItem('lms_v3_payment_records');
    return saved ? JSON.parse(saved) : [];
  });

  // Notifications State
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('lms_v3_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // User Sessions State (track login/logout times)
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('lms_v3_sessions');
    if (saved) return JSON.parse(saved);
    
    const initial = {};
    initialUsers.forEach(u => {
      initial[u.id] = { login: '09:00:00 AM', logout: 'Never' };
    });
    return initial;
  });

  // System Audit Logs State
  const [systemLogs, setSystemLogs] = useState(() => {
    const saved = localStorage.getItem('lms_v3_system_logs');
    if (saved) return JSON.parse(saved);
    
    const today = new Date().toISOString().split('T')[0];
    return [
      { id: 'log-1', timestamp: `${today}, 09:00:00 AM`, text: "Library Management System initialized with fresh seed catalog.", type: "info" }
    ];
  });

  // Current Active User (defaults to student 'a')
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('lms_v3_current_user_id');
    const matched = users.find(u => u.id === saved);
    return matched || users.find(u => u.name === 'a') || users[0];
  });

  // Synchronize state with local storage
  useEffect(() => {
    localStorage.setItem('lms_v3_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('lms_v3_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('lms_v3_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('lms_v3_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('lms_v3_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('lms_v3_payment_records', JSON.stringify(paymentRecords));
  }, [paymentRecords]);

  useEffect(() => {
    localStorage.setItem('lms_v3_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('lms_v3_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('lms_v3_system_logs', JSON.stringify(systemLogs));
  }, [systemLogs]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lms_v3_current_user_id', currentUser.id);
    }
  }, [currentUser]);

  // Recalculate fines dynamically for overdue transactions in ₹
  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date().toISOString().split('T')[0];
      let updated = false;

      const newTx = transactions.map(tx => {
        if (!tx.returnDate && tx.dueDate < today) {
          const due = new Date(tx.dueDate);
          const now = new Date(today);
          const diffTime = Math.abs(now - due);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const calculatedFine = diffDays * settings.fineRatePerDay;

          if (tx.fineAmount !== calculatedFine || tx.status !== 'overdue') {
            updated = true;
            return {
              ...tx,
              fineAmount: calculatedFine,
              status: 'overdue'
            };
          }
        }
        return tx;
      });

      if (updated) {
        setTransactions(newTx);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [transactions, settings.fineRatePerDay]);

  // Log creation helper
  const logEvent = (text, type = "info") => {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const timeStr = date.toLocaleTimeString();
    const newLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: `${dateStr}, ${timeStr}`,
      text,
      type
    };
    setSystemLogs(prev => [newLog, ...prev]);
  };

  const clearSystemLogs = () => {
    setSystemLogs([]);
    logEvent("System activity audit logs cleared.", "security");
  };

  // Notification creation helper
  const addNotification = (text, targetRole = 'student', type = 'info', actionTab = '') => {
    const date = new Date();
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newNotif = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      text,
      timestamp: timeStr,
      read: false,
      role: targetRole,
      type,
      actionTab
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = (role) => {
    setNotifications(prev => prev.map(n => (!role || n.role === role) ? { ...n, read: true } : n));
  };

  const deleteNotification = (notifId) => {
    setNotifications(prev => prev.filter(n => n.id !== notifId));
  };

  const clearNotifications = (role) => {
    if (role) {
      setNotifications(prev => prev.filter(n => n.role !== role));
    } else {
      setNotifications([]);
    }
  };

  // Switch active user
  const changeCurrentUser = (userId) => {
    const nextUser = users.find(u => u.id === userId);
    if (!nextUser) return;

    const timeStr = new Date().toLocaleTimeString();

    setSessions(prev => ({
      ...prev,
      [currentUser.id]: {
        ...prev[currentUser.id],
        logout: timeStr
      },
      [nextUser.id]: {
        ...prev[nextUser.id],
        login: timeStr,
        logout: prev[nextUser.id]?.logout || 'Never'
      }
    }));

    logEvent(`User "${currentUser.name}" switched session.`, "user");
    setCurrentUser(nextUser);
    logEvent(`User "${nextUser.name}" logged in (Role: ${nextUser.role}).`, "user");
  };

  // Book management
  const addBook = (bookData) => {
    const newBook = {
      id: `book-${Date.now()}`,
      ...bookData,
      copiesAvailable: parseInt(bookData.totalCopies),
      totalCopies: parseInt(bookData.totalCopies),
      price: parseFloat(bookData.price) || 0,
      reviews: [],
      wishlist: [],
      rating: 0
    };
    setBooks(prev => [...prev, newBook]);
    logEvent(`Book "${newBook.title}" by ${newBook.author} added to inventory.`, "book");
    addNotification(`🎉 New books added in ${newBook.category}: "${newBook.title}".`, 'student', 'new_arrival', 'student-catalog');
  };

  const updateBook = (updatedBook) => {
    setBooks(prev => prev.map(b => b.id === updatedBook.id ? {
      ...b,
      ...updatedBook,
      price: parseFloat(updatedBook.price) || 0,
      totalCopies: parseInt(updatedBook.totalCopies),
      copiesAvailable: Math.min(parseInt(updatedBook.totalCopies), b.copiesAvailable + (parseInt(updatedBook.totalCopies) - b.totalCopies))
    } : b));
    logEvent(`Updated metadata for "${updatedBook.title}".`, "book");
  };

  const deleteBook = (bookId) => {
    const book = books.find(b => b.id === bookId);
    setBooks(prev => prev.filter(b => b.id !== bookId));
    setReservations(prev => prev.filter(r => !(r.bookId === bookId && r.status === 'pending')));
    logEvent(`Book "${book ? book.title : bookId}" deleted from inventory.`, "book");
  };

  // User management
  const addUser = (userData) => {
    const newUser = {
      id: `user-${Date.now()}`,
      status: 'active',
      ...userData,
      enrollmentId: userData.role === 'student' ? `STU-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}` : undefined,
      employeeId: userData.role !== 'student' ? `${userData.role.substring(0,3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}` : undefined
    };
    setUsers(prev => [...prev, newUser]);
    
    setSessions(prev => ({
      ...prev,
      [newUser.id]: { login: 'Never', logout: 'Never' }
    }));

    logEvent(`Created user profile "${newUser.name}" (Role: ${newUser.role}).`, "user");
  };

  const updateUser = (updatedUser) => {
    const prevUser = users.find(u => u.id === updatedUser.id);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    
    if (prevUser && prevUser.status !== updatedUser.status) {
      logEvent(`Access status for "${updatedUser.name}" changed to "${updatedUser.status.toUpperCase()}".`, "security");
    } else {
      logEvent(`User profile for "${updatedUser.name}" updated.`, "user");
    }
  };

  const deleteUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    logEvent(`User account deleted for "${user ? user.name : userId}".`, "user");
  };

  // Settings
  const updateSettings = (newSettings) => {
    setSettings({
      fineRatePerDay: parseFloat(newSettings.fineRatePerDay) || 0,
      maxBooksAllowed: parseInt(newSettings.maxBooksAllowed) || 1,
      borrowPeriodDays: parseInt(newSettings.borrowPeriodDays) || 1
    });
    logEvent(`Circulation policies updated: Fine Rate=₹${parseFloat(newSettings.fineRatePerDay).toFixed(2)}/day, Max Limit=${newSettings.maxBooksAllowed} Books, Lending Duration=${newSettings.borrowPeriodDays} Days.`, "settings");
    addNotification(`Library lending duration rules modified. Check Dashboard for details.`, 'student', 'system', 'student-dashboard');
  };

  // Issue / Return logic
  const issueBook = (studentId, bookId, customDueDate) => {
    const student = users.find(u => u.id === studentId);
    const book = books.find(b => b.id === bookId);

    if (!student || student.status !== 'active') {
      throw new Error("Student account is not active or is suspended.");
    }

    if (!book || book.copiesAvailable <= 0) {
      throw new Error("Book is currently unavailable in stock.");
    }

    const activeBorrows = transactions.filter(t => t.studentId === studentId && !t.returnDate).length;
    if (activeBorrows >= settings.maxBooksAllowed) {
      throw new Error(`Student has reached maximum lending limit of ${settings.maxBooksAllowed} books.`);
    }

    const today = new Date().toISOString().split('T')[0];
    let dueDateString = customDueDate;
    if (!dueDateString) {
      const due = new Date();
      due.setDate(due.getDate() + settings.borrowPeriodDays);
      dueDateString = due.toISOString().split('T')[0];
    }

    const newTx = {
      id: `tx-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      studentId: student.id,
      studentName: student.name,
      issueDate: today,
      dueDate: dueDateString,
      returnDate: null,
      fineAmount: 0,
      status: "issued"
    };

    setTransactions(prev => [newTx, ...prev]);
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, copiesAvailable: b.copiesAvailable - 1 } : b));
    logEvent(`Issued "${book.title}" to student "${student.name}" (Due: ${dueDateString}).`, "issue");
    
    addNotification(`🔔 Your book "${book.title}" is checked out. Return due date is ${dueDateString}.`, 'student', 'due', 'student-dashboard');
  };

  const returnBook = (transactionId, customReturnDate = null) => {
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx || tx.returnDate) return;

    const returnDateString = customReturnDate || new Date().toISOString().split('T')[0];
    const due = new Date(tx.dueDate);
    const ret = new Date(returnDateString);

    let fine = 0;
    if (ret > due) {
      const diffTime = Math.abs(ret - due);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = diffDays * settings.fineRatePerDay;
    }

    setTransactions(prev => prev.map(t => t.id === transactionId ? {
      ...t,
      returnDate: returnDateString,
      fineAmount: fine,
      status: "returned"
    } : t));

    setBooks(prev => prev.map(b => b.id === tx.bookId ? { ...b, copiesAvailable: Math.min(b.totalCopies, b.copiesAvailable + 1) } : b));
    logEvent(`Checked in "${tx.bookTitle}" from "${tx.studentName}". Fine assessed: ₹${fine.toFixed(2)}.`, "return");

    if (fine > 0) {
      addNotification(`⚠️ You have ₹${fine.toFixed(2)} pending fine for overdue return of "${tx.bookTitle}".`, 'student', 'fine', 'student-fines');
      addNotification(`Overdue return: "${tx.bookTitle}" has pending fine of ₹${fine.toFixed(2)}.`, 'admin', 'fine', 'admin-dashboard');
    }
  };

  const payFine = (transactionId) => {
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx) return;

    const amount = tx.fineAmount;
    if (amount <= 0) return;

    const today = new Date().toISOString().split('T')[0];

    const newPayment = {
      id: `pay-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      studentId: tx.studentId,
      studentName: tx.studentName,
      bookTitle: tx.bookTitle,
      amountPaid: amount,
      date: today
    };

    setPaymentRecords(prev => [newPayment, ...prev]);

    setTransactions(prev => prev.map(t => t.id === transactionId ? {
      ...t,
      fineAmount: 0,
      status: t.returnDate ? "returned" : "issued"
    } : t));

    logEvent(`Received fine payment of ₹${amount.toFixed(2)} from "${tx.studentName}".`, "payment");
    addNotification(`Fine payment of ₹${amount.toFixed(2)} received from ${tx.studentName}.`, 'admin', 'system', 'admin-dashboard');
  };

  // Renew Loan
  const renewLoan = (transactionId) => {
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx || tx.returnDate) return;

    const currentDue = new Date(tx.dueDate);
    currentDue.setDate(currentDue.getDate() + 7);
    const nextDueString = currentDue.toISOString().split('T')[0];

    setTransactions(prev => prev.map(t => t.id === transactionId ? {
      ...t,
      dueDate: nextDueString,
      status: "issued"
    } : t));

    logEvent(`Renewed loan for "${tx.bookTitle}" (Student: ${tx.studentName}) by 7 days to ${nextDueString}.`, "settings");
    addNotification(`Loan renewed for "${tx.bookTitle}". New due date: ${nextDueString}.`, 'student', 'due', 'student-dashboard');
  };

  const sendOverdueReminder = (transactionId) => {
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx) return;

    logEvent(`Dispatched overdue alert email to "${tx.studentName}" (<${tx.studentName.toLowerCase().replace(/\s+/g, '.')}@library.edu>) for "${tx.bookTitle}".`, "security");
    addNotification(`⚠️ Reminder: Your loan for "${tx.bookTitle}" is overdue. Please return immediately.`, 'student', 'due', 'student-dashboard');
  };

  // Star Ratings and Reviews
  const addBookReview = (bookId, studentName, ratingCount, reviewText) => {
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        const reviews = b.reviews || [];
        const newReview = {
          id: `rev-${Date.now()}`,
          studentName,
          rating: parseInt(ratingCount),
          comment: reviewText,
          date: new Date().toISOString().split('T')[0]
        };
        const updatedReviews = [newReview, ...reviews];
        const avg = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        
        return {
          ...b,
          reviews: updatedReviews,
          rating: parseFloat(avg.toFixed(1))
        };
      }
      return b;
    }));

    const book = books.find(b => b.id === bookId);
    logEvent(`Student "${studentName}" submitted a ${ratingCount}-star review for "${book ? book.title : bookId}".`, "info");
  };

  // Toggle Wishlist Bookmark
  const toggleWishlist = (studentId, bookId) => {
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        const wishlists = b.wishlist || [];
        const isWish = wishlists.includes(studentId);
        const updated = isWish 
          ? wishlists.filter(id => id !== studentId) 
          : [...wishlists, studentId];
        return {
          ...b,
          wishlist: updated
        };
      }
      return b;
    }));
  };

  // Reservations
  const requestReservation = (studentId, bookId) => {
    const student = users.find(u => u.id === studentId);
    const book = books.find(b => b.id === bookId);

    if (!student || !book) return;

    const newRes = {
      id: `res-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      studentId: student.id,
      studentName: student.name,
      requestDate: new Date().toISOString().split('T')[0],
      status: "pending"
    };

    setReservations(prev => [newRes, ...prev]);
    logEvent(`Student "${student.name}" placed a hold reservation for "${book.title}".`, "reservation");
    addNotification(`Student ${student.name} placed a reservation hold for "${book.title}".`, 'librarian', 'reservation', 'lib-reservations');
  };

  const updateReservationStatus = (reservationId, status) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return;

    if (status === 'approved') {
      const book = books.find(b => b.id === res.bookId);
      if (book && book.copiesAvailable > 0) {
        setBooks(prev => prev.map(b => b.id === res.bookId ? { ...b, copiesAvailable: Math.max(0, b.copiesAvailable - 1) } : b));
      }
      addNotification(`📚 Your reserved book "${res.bookTitle}" is now available and approved!`, 'student', 'reservation', 'student-dashboard');
    }

    setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, status } : r));
    logEvent(`Reservation hold for "${res.bookTitle}" by "${res.studentName}" marked as ${status.toUpperCase()}.`, "reservation");
  };

  const approveReservation = (reservationId) => {
    updateReservationStatus(reservationId, 'approved');
  };

  const rejectReservation = (reservationId) => {
    updateReservationStatus(reservationId, 'rejected');
  };

  // ⭐ Priority 4: Smart Book Recommendations Engine
  const getSmartRecommendations = useCallback((studentId) => {
    const targetStudentId = studentId || currentUser?.id;
    if (!books || books.length === 0) return [];

    // Gather student history & signals
    const studentTxs = transactions.filter(t => t.studentId === targetStudentId);
    const borrowedBookIds = new Set(studentTxs.map(t => t.bookId));
    
    // Category frequencies from borrowed books
    const categoryScores = {};
    studentTxs.forEach(t => {
      const b = books.find(bk => bk.id === t.bookId);
      if (b) {
        categoryScores[b.category] = (categoryScores[b.category] || 0) + 3;
      }
    });

    // Wishlist signals
    const wishlistedBooks = books.filter(b => b.wishlist && b.wishlist.includes(targetStudentId));
    wishlistedBooks.forEach(b => {
      categoryScores[b.category] = (categoryScores[b.category] || 0) + 2;
    });

    // Top categories with fallback
    const topCategories = Object.keys(categoryScores).sort((a, b) => categoryScores[b] - categoryScores[a]);
    const favoriteCategory = topCategories.length > 0 ? topCategories[0] : 'Programming';

    // Score all available/catalog books
    const scoredBooks = books.map(book => {
      let score = 50; // base score
      let reasons = [];

      // Category affinity
      if (categoryScores[book.category]) {
        score += Math.min(30, categoryScores[book.category] * 8);
        reasons.push(`Because you like ${book.category}`);
      } else if (book.category === 'Programming' || book.category === 'Computer Science') {
        score += 15;
        reasons.push(`Trending in ${book.category}`);
      }

      // Rating bonus
      if (book.rating >= 4.8) {
        score += 20;
        reasons.push(`Top Rated (${book.rating} ⭐)`);
      } else if (book.rating >= 4.5) {
        score += 10;
      }

      // Availability bonus
      if (book.copiesAvailable > 0) {
        score += 8;
      } else {
        score -= 5;
      }

      // If already borrowed, lower priority slightly
      if (borrowedBookIds.has(book.id)) {
        score -= 15;
      }

      // If in wishlist, high priority
      if (book.wishlist && book.wishlist.includes(targetStudentId)) {
        score += 15;
        reasons.push('In your Bookmarks');
      }

      const matchPercentage = Math.min(99, Math.max(75, score));
      const primaryReason = reasons.length > 0 ? reasons[0] : `Popular in ${favoriteCategory}`;

      return {
        ...book,
        matchScore: score,
        matchPercentage,
        recommendationReason: primaryReason
      };
    });

    // Sort by match score descending
    return scoredBooks.sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [books, transactions, currentUser]);

  return (
    <LibraryContext.Provider value={{
      books,
      users,
      transactions,
      reservations,
      settings,
      currentUser,
      systemLogs,
      sessions,
      paymentRecords,
      notifications,
      changeCurrentUser,
      addBook,
      updateBook,
      deleteBook,
      addUser,
      updateUser,
      deleteUser,
      updateSettings,
      issueBook,
      returnBook,
      payFine,
      renewLoan,
      sendOverdueReminder,
      addBookReview,
      toggleWishlist,
      requestReservation,
      updateReservationStatus,
      approveReservation,
      rejectReservation,
      clearSystemLogs,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      clearNotifications,
      getSmartRecommendations
    }}>
      {children}
    </LibraryContext.Provider>
  );
};
