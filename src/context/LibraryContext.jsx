import React, { createContext, useState, useEffect } from 'react';
import {
  initialBooks,
  initialUsers,
  initialTransactions,
  initialReservations,
  initialSettings
} from '../utils/mockData';

export const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  // Load initial state from local storage or defaults
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('lms_books');
    return saved ? JSON.parse(saved) : initialBooks.map(b => ({
      ...b,
      reviews: b.reviews || [],
      wishlist: b.wishlist || [],
      rating: b.rating || 0
    }));
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('lms_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('lms_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem('lms_reservations');
    return saved ? JSON.parse(saved) : initialReservations;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('lms_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  // Payment Records State
  const [paymentRecords, setPaymentRecords] = useState(() => {
    const saved = localStorage.getItem('lms_payment_records');
    if (saved) return JSON.parse(saved);
    
    // Seed initial payment history
    const today = new Date().toISOString().split('T')[0];
    return [
      {
        id: "pay-1",
        studentId: "user-student-1",
        studentName: "Alex Mercer",
        bookTitle: "Clean Code",
        amountPaid: 15.00,
        date: today
      }
    ];
  });

  // Notifications State (targets 'admin', 'librarian', or 'student')
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('lms_notifications');
    if (saved) return JSON.parse(saved);
    
    return [
      {
        id: "notif-1",
        text: "System initialized with library seed catalog.",
        timestamp: "09:00 AM",
        read: false,
        role: "admin"
      },
      {
        id: "notif-2",
        text: "New book reservation hold requested by Alex Mercer.",
        timestamp: "10:10 AM",
        read: false,
        role: "librarian"
      }
    ];
  });

  // User Sessions State (track login/logout times)
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('lms_sessions');
    if (saved) return JSON.parse(saved);
    
    // Seed initial session times
    const initial = {};
    initialUsers.forEach(u => {
      initial[u.id] = { login: '09:00:00 AM', logout: '05:00:00 PM' };
    });
    return initial;
  });

  // System Audit Logs State
  const [systemLogs, setSystemLogs] = useState(() => {
    const saved = localStorage.getItem('lms_system_logs');
    if (saved) return JSON.parse(saved);
    
    // Seed initial logs
    const today = new Date().toISOString().split('T')[0];
    return [
      { id: 'log-1', timestamp: `${today}, 09:00:00 AM`, text: "LMS engine initialized with seed catalog.", type: "info" },
      { id: 'log-2', timestamp: `${today}, 09:15:30 AM`, text: "Global library settings updated. Fine rate set to $1.50/day.", type: "settings" },
      { id: 'log-3', timestamp: `${today}, 10:20:45 AM`, text: "Student Bruce Wayne was suspended due to overdue loans.", type: "security" }
    ];
  });

  // Default to the first student
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('lms_current_user_id');
    const matched = users.find(u => u.id === saved);
    return matched || users.find(u => u.role === 'student') || users[0];
  });

  // Synchronize state with local storage
  useEffect(() => {
    localStorage.setItem('lms_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('lms_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('lms_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('lms_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('lms_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('lms_payment_records', JSON.stringify(paymentRecords));
  }, [paymentRecords]);

  useEffect(() => {
    localStorage.setItem('lms_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('lms_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('lms_system_logs', JSON.stringify(systemLogs));
  }, [systemLogs]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lms_current_user_id', currentUser.id);
    }
  }, [currentUser]);

  // Recalculate fines dynamically for un-returned books that are overdue
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
    }, 10000); // Check every 10s

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
  const addNotification = (text, targetRole) => {
    const date = new Date();
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newNotif = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      text,
      timestamp: timeStr,
      read: false,
      role: targetRole
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const clearNotifications = (role) => {
    setNotifications(prev => prev.filter(n => n.role !== role));
  };

  // Actions
  const changeCurrentUser = (userId) => {
    const nextUser = users.find(u => u.id === userId);
    if (!nextUser) return;

    const timeStr = new Date().toLocaleTimeString();

    // Update session login and logout times
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

    logEvent(`User "${currentUser.name}" logged out.`, "user");
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
    logEvent(`Book "${newBook.title}" by ${newBook.author} was cataloged in the system.`, "book");
    addNotification(`New book cataloged: "${newBook.title}" by ${newBook.author}.`, 'student');
  };

  const updateBook = (updatedBook) => {
    setBooks(prev => prev.map(b => b.id === updatedBook.id ? {
      ...b,
      ...updatedBook,
      price: parseFloat(updatedBook.price) || 0,
      totalCopies: parseInt(updatedBook.totalCopies),
      copiesAvailable: Math.min(parseInt(updatedBook.totalCopies), b.copiesAvailable + (parseInt(updatedBook.totalCopies) - b.totalCopies))
    } : b));
    logEvent(`Modified attributes for book "${updatedBook.title}".`, "book");
  };

  const deleteBook = (bookId) => {
    const book = books.find(b => b.id === bookId);
    setBooks(prev => prev.filter(b => b.id !== bookId));
    // Cancel associated pending reservations
    setReservations(prev => prev.filter(r => !(r.bookId === bookId && r.status === 'pending')));
    logEvent(`Book "${book ? book.title : bookId}" deleted from active database.`, "book");
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
    
    // Seed session for new user
    setSessions(prev => ({
      ...prev,
      [newUser.id]: { login: 'Never', logout: 'Never' }
    }));

    logEvent(`Registered new user profile "${newUser.name}" (Access role: ${newUser.role}).`, "user");
  };

  const updateUser = (updatedUser) => {
    const prevUser = users.find(u => u.id === updatedUser.id);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    
    // Log suspension changes
    if (prevUser && prevUser.status !== updatedUser.status) {
      logEvent(`User Access for "${updatedUser.name}" toggled to "${updatedUser.status.toUpperCase()}".`, "security");
    } else {
      logEvent(`User profile for "${updatedUser.name}" details updated.`, "user");
    }
  };

  const deleteUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    logEvent(`Revoked credentials and deleted account for "${user ? user.name : userId}".`, "user");
  };

  // Settings
  const updateSettings = (newSettings) => {
    setSettings({
      fineRatePerDay: parseFloat(newSettings.fineRatePerDay) || 0,
      maxBooksAllowed: parseInt(newSettings.maxBooksAllowed) || 1,
      borrowPeriodDays: parseInt(newSettings.borrowPeriodDays) || 1
    });
    logEvent(`Lending policies updated: Fine Rate=$${parseFloat(newSettings.fineRatePerDay).toFixed(2)}/day, Max Limits=${newSettings.maxBooksAllowed} Books, Lending Window=${newSettings.borrowPeriodDays} Days.`, "settings");
    addNotification(`Library lending duration rules modified. Check Dashboard for details.`, 'student');
  };

  // Issue / Return logic
  const issueBook = (studentId, bookId, customDueDate) => {
    const student = users.find(u => u.id === studentId);
    const book = books.find(b => b.id === bookId);

    if (!student || student.status !== 'active') {
      throw new Error("Student is not active or suspended.");
    }

    if (!book || book.copiesAvailable <= 0) {
      throw new Error("Book is currently unavailable.");
    }

    // Check borrow limit
    const activeBorrows = transactions.filter(t => t.studentId === studentId && !t.returnDate).length;
    if (activeBorrows >= settings.maxBooksAllowed) {
      throw new Error(`Student has already reached the limit of ${settings.maxBooksAllowed} books.`);
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
    logEvent(`Checked out and issued "${book.title}" to student "${student.name}" (Deadline: ${dueDateString}).`, "issue");
    
    // Notify student
    addNotification(`You have checked out "${book.title}". Return deadline is ${dueDateString}.`, 'student');
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
    logEvent(`Checked in "${tx.bookTitle}" from student "${tx.studentName}". Fine charged: $${fine.toFixed(2)}.`, "return");

    if (fine > 0) {
      addNotification(`Overdue check-in: "${tx.bookTitle}" has fine of $${fine.toFixed(2)} pending.`, 'admin');
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
      status: t.returnDate ? "returned" : "issued" // Clear the fine
    } : t));

    logEvent(`Collected fine payment of $${amount.toFixed(2)} from student "${tx.studentName}".`, "payment");
    addNotification(`Collected fine payment of $${amount.toFixed(2)} from ${tx.studentName}.`, 'admin');
  };

  // Book loan extension (Renew)
  const renewLoan = (transactionId) => {
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx || tx.returnDate) return;

    const currentDue = new Date(tx.dueDate);
    currentDue.setDate(currentDue.getDate() + 7); // extend 7 days
    const nextDueString = currentDue.toISOString().split('T')[0];

    setTransactions(prev => prev.map(t => t.id === transactionId ? {
      ...t,
      dueDate: nextDueString,
      status: "issued" // clear overdue status on renewal
    } : t));

    logEvent(`Lending duration for "${tx.bookTitle}" (Student: ${tx.studentName}) extended by 7 days to ${nextDueString}.`, "settings");
  };

  // Send email notice reminder
  const sendOverdueReminder = (transactionId) => {
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx) return;

    logEvent(`Dispatched automated overdue email notice to student "${tx.studentName}" (<${tx.studentName.toLowerCase().replace(' ', '.')}@library.edu>) for overdue item "${tx.bookTitle}".`, "security");
  };

  // Star Ratings and Book Reviews
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
    logEvent(`Student "${studentName}" submitted a ${ratingCount}-star review for title "${book ? book.title : bookId}".`, "info");
  };

  // Toggle book wishlist bookmark
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
    logEvent(`Student "${student.name}" placed a hold reservation for title "${book.title}".`, "reservation");
    addNotification(`Student ${student.name} requested reservation for "${book.title}".`, 'librarian');
  };

  const updateReservationStatus = (reservationId, status) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return;

    if (status === 'approved') {
      const book = books.find(b => b.id === res.bookId);
      const student = users.find(u => u.id === res.studentId);

      if (!student || student.status !== 'active') {
        throw new Error("Student is not active or is suspended.");
      }

      if (!book || book.copiesAvailable <= 0) {
        throw new Error("Book is out of stock.");
      }

      const activeBorrows = transactions.filter(t => t.studentId === res.studentId && !t.returnDate).length;
      if (activeBorrows >= settings.maxBooksAllowed) {
        throw new Error(`Student has already reached the lending limit of ${settings.maxBooksAllowed} books.`);
      }

      const due = new Date();
      due.setDate(due.getDate() + settings.borrowPeriodDays);
      const dueDateString = due.toISOString().split('T')[0];

      issueBook(res.studentId, res.bookId, dueDateString);
    }

    setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, status } : r));
    logEvent(`Hold request for "${res.bookTitle}" by student "${res.studentName}" was ${status.toUpperCase()} by librarian.`, "reservation");
  };

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
      clearSystemLogs,
      markNotificationRead,
      clearNotifications
    }}>
      {children}
    </LibraryContext.Provider>
  );
};
