const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Book = require('./models/Book');
const Category = require('./models/Category');
const Settings = require('./models/Settings');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await Category.deleteMany({});
    await Settings.deleteMany({});

    // Create settings
    await Settings.create({});
    console.log('✓ Settings created');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@library.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1 234 567 8900',
      address: '123 Admin Street, Library City',
      membershipType: 'gold'
    });
    console.log('✓ Admin user created (admin@library.com / admin123)');

    // Create member users
    const members = await User.create([
      {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        password: 'member123',
        role: 'member',
        phone: '+91 98765 43210',
        address: '456 Member Lane, Book Town',
        membershipType: 'premium'
      },
      {
        name: 'Priya Patel',
        email: 'priya@example.com',
        password: 'member123',
        role: 'member',
        phone: '+91 91234 56789',
        address: '789 Reader Road, Study City',
        membershipType: 'basic'
      },
      {
        name: 'Amit Kumar',
        email: 'amit@example.com',
        password: 'member123',
        role: 'member',
        phone: '+91 87654 32100',
        address: '321 Book Street, Knowledge Park',
        membershipType: 'gold'
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha@example.com',
        password: 'member123',
        role: 'member',
        phone: '+91 76543 21098',
        address: '654 Library Avenue, Read Town',
        membershipType: 'basic'
      },
      {
        name: 'Vikram Singh',
        email: 'vikram@example.com',
        password: 'member123',
        role: 'member',
        phone: '+91 65432 10987',
        address: '987 Study Lane, Learn City',
        membershipType: 'premium'
      }
    ]);
    console.log('✓ 5 member users created');

    // Create categories
    const categories = await Category.create([
      { name: 'Fiction', description: 'Novels, short stories, and literary fiction', icon: '📖' },
      { name: 'Science', description: 'Physics, chemistry, biology, and earth sciences', icon: '🔬' },
      { name: 'Technology', description: 'Computer science, programming, and IT', icon: '💻' },
      { name: 'History', description: 'World history, ancient civilizations, and historical events', icon: '🏛️' },
      { name: 'Business', description: 'Management, finance, marketing, and entrepreneurship', icon: '💼' },
      { name: 'Self-Help', description: 'Personal development, motivation, and wellness', icon: '🌟' },
      { name: 'Mathematics', description: 'Algebra, calculus, statistics, and applied math', icon: '📐' },
      { name: 'Literature', description: 'Classic literature, poetry, and drama', icon: '📚' },
      { name: 'Philosophy', description: 'Ethics, logic, metaphysics, and epistemology', icon: '🤔' },
      { name: 'Medical', description: 'Medicine, anatomy, pharmacology, and health science', icon: '⚕️' },
      { name: 'Arts & Design', description: 'Fine arts, graphic design, and architecture', icon: '🎨' },
      { name: 'Engineering', description: 'Mechanical, civil, electrical, and chemical engineering', icon: '⚙️' }
    ]);
    console.log('✓ 12 categories created');

    // Create books
    const books = await Book.create([
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '978-0-7432-7356-5',
        category: categories[0]._id,
        description: 'A masterpiece of American fiction set in the Jazz Age, exploring themes of wealth, class, and the American Dream through the eyes of narrator Nick Carraway and the enigmatic Jay Gatsby.',
        publisher: 'Scribner',
        publishedYear: 1925,
        edition: '1st',
        language: 'English',
        pages: 180,
        totalCopies: 5,
        location: { shelf: 'A', rack: '1' },
        type: 'book',
        tags: ['classic', 'american literature', 'jazz age']
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '978-0-06-112008-4',
        category: categories[0]._id,
        description: 'A profound novel exploring racial injustice in the American South through the eyes of young Scout Finch, as her father Atticus defends a wrongly accused Black man.',
        publisher: 'J. B. Lippincott & Co.',
        publishedYear: 1960,
        edition: '50th Anniversary',
        language: 'English',
        pages: 281,
        totalCopies: 4,
        location: { shelf: 'A', rack: '2' },
        type: 'book',
        tags: ['classic', 'social justice', 'southern gothic']
      },
      {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        isbn: '978-0-553-38016-3',
        category: categories[1]._id,
        description: 'A landmark volume in science writing that explores the cosmos from the Big Bang to black holes, making complex concepts accessible to general readers.',
        publisher: 'Bantam Dell',
        publishedYear: 1988,
        edition: '10th Anniversary',
        language: 'English',
        pages: 256,
        totalCopies: 3,
        location: { shelf: 'B', rack: '1' },
        type: 'book',
        tags: ['physics', 'cosmology', 'science']
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '978-0-13-235088-4',
        category: categories[2]._id,
        description: 'A handbook of agile software craftsmanship that teaches programmers how to write code that is clean, readable, and maintainable.',
        publisher: 'Prentice Hall',
        publishedYear: 2008,
        edition: '1st',
        language: 'English',
        pages: 464,
        totalCopies: 6,
        location: { shelf: 'C', rack: '1' },
        type: 'book',
        tags: ['programming', 'software engineering', 'best practices']
      },
      {
        title: 'JavaScript: The Good Parts',
        author: 'Douglas Crockford',
        isbn: '978-0-596-51774-8',
        category: categories[2]._id,
        description: 'An authoritative guide focusing on the elegant, reliable, and powerful features of JavaScript while avoiding the problematic parts.',
        publisher: "O'Reilly Media",
        publishedYear: 2008,
        edition: '1st',
        language: 'English',
        pages: 176,
        totalCopies: 4,
        location: { shelf: 'C', rack: '2' },
        type: 'book',
        tags: ['javascript', 'web development', 'programming']
      },
      {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        isbn: '978-0-06-231609-7',
        category: categories[3]._id,
        description: 'A groundbreaking narrative of human history from the Stone Age to the Silicon Age, examining how Homo sapiens came to dominate the world.',
        publisher: 'Harper',
        publishedYear: 2011,
        edition: '1st',
        language: 'English',
        pages: 464,
        totalCopies: 5,
        location: { shelf: 'D', rack: '1' },
        type: 'book',
        tags: ['history', 'anthropology', 'evolution']
      },
      {
        title: 'The Lean Startup',
        author: 'Eric Ries',
        isbn: '978-0-307-88789-4',
        category: categories[4]._id,
        description: 'A revolutionary method for developing businesses through continuous innovation, validated learning, and scientific experimentation.',
        publisher: 'Crown Business',
        publishedYear: 2011,
        edition: '1st',
        language: 'English',
        pages: 336,
        totalCopies: 3,
        location: { shelf: 'E', rack: '1' },
        type: 'book',
        tags: ['startup', 'entrepreneurship', 'business']
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        isbn: '978-0-7352-1129-2',
        category: categories[5]._id,
        description: 'A proven framework for improving every day through tiny changes in habits, revealing how small behaviors lead to remarkable results.',
        publisher: 'Avery',
        publishedYear: 2018,
        edition: '1st',
        language: 'English',
        pages: 320,
        totalCopies: 7,
        location: { shelf: 'F', rack: '1' },
        type: 'book',
        tags: ['habits', 'self-improvement', 'productivity']
      },
      {
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        isbn: '978-0-262-03384-8',
        category: categories[6]._id,
        description: 'The comprehensive textbook on algorithms, covering a broad range of topics in depth while making their design and analysis accessible to all levels of readers.',
        publisher: 'MIT Press',
        publishedYear: 2009,
        edition: '3rd',
        language: 'English',
        pages: 1312,
        totalCopies: 4,
        location: { shelf: 'G', rack: '1' },
        type: 'book',
        tags: ['algorithms', 'data structures', 'computer science']
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        isbn: '978-0-14-143951-8',
        category: categories[7]._id,
        description: 'A timeless classic of English literature following Elizabeth Bennet as she navigates issues of morals, uprightness, and misunderstanding in the pursuit of love.',
        publisher: 'Penguin Classics',
        publishedYear: 1813,
        edition: 'Penguin Edition',
        language: 'English',
        pages: 432,
        totalCopies: 3,
        location: { shelf: 'H', rack: '1' },
        type: 'book',
        tags: ['classic', 'romance', 'english literature']
      },
      {
        title: 'Design Patterns',
        author: 'Gang of Four',
        isbn: '978-0-201-63361-0',
        category: categories[2]._id,
        description: 'The foundational book on software design patterns, presenting 23 patterns that enable flexible and reusable object-oriented software design.',
        publisher: 'Addison-Wesley',
        publishedYear: 1994,
        edition: '1st',
        language: 'English',
        pages: 395,
        totalCopies: 3,
        location: { shelf: 'C', rack: '3' },
        type: 'book',
        tags: ['design patterns', 'software engineering', 'oop']
      },
      {
        title: 'The Art of War',
        author: 'Sun Tzu',
        isbn: '978-1-59030-227-7',
        category: categories[8]._id,
        description: 'An ancient Chinese military treatise that has been influential in both military strategy and business tactics for centuries.',
        publisher: 'Shambhala',
        publishedYear: -500,
        edition: 'Translated',
        language: 'English',
        pages: 273,
        totalCopies: 2,
        location: { shelf: 'I', rack: '1' },
        type: 'book',
        tags: ['strategy', 'philosophy', 'classic']
      },
      {
        title: 'Nature Medicine Journal - Vol. 30',
        author: 'Various Authors',
        isbn: '978-1-2345-6789-0',
        category: categories[9]._id,
        description: 'A leading biomedical research journal publishing significant advances in understanding disease processes, prevention, diagnosis, and treatment.',
        publisher: 'Nature Publishing',
        publishedYear: 2024,
        edition: 'Volume 30',
        language: 'English',
        pages: 200,
        totalCopies: 2,
        location: { shelf: 'J', rack: '1' },
        type: 'journal',
        tags: ['medicine', 'research', 'biomedical']
      },
      {
        title: 'IEEE Spectrum Magazine',
        author: 'IEEE Editorial Board',
        isbn: '978-2-3456-7890-1',
        category: categories[2]._id,
        description: 'The flagships magazine of IEEE covering technology, engineering, and science with in-depth articles on emerging tech trends.',
        publisher: 'IEEE',
        publishedYear: 2024,
        edition: 'Monthly',
        language: 'English',
        pages: 80,
        totalCopies: 3,
        location: { shelf: 'J', rack: '2' },
        type: 'magazine',
        tags: ['technology', 'engineering', 'innovation']
      },
      {
        title: 'National Geographic Magazine',
        author: 'National Geographic Society',
        isbn: '978-3-4567-8901-2',
        category: categories[1]._id,
        description: 'An iconic monthly magazine known for its photography, articles about science, geography, history, and world culture.',
        publisher: 'National Geographic Partners',
        publishedYear: 2024,
        edition: 'Monthly',
        language: 'English',
        pages: 120,
        totalCopies: 4,
        location: { shelf: 'J', rack: '3' },
        type: 'magazine',
        tags: ['science', 'geography', 'photography']
      },
      {
        title: '1984',
        author: 'George Orwell',
        isbn: '978-0-451-52493-5',
        category: categories[0]._id,
        description: 'A dystopian masterpiece depicting a totalitarian society under constant surveillance, exploring themes of truth, freedom, and political control.',
        publisher: 'Signet Classics',
        publishedYear: 1949,
        edition: 'Centennial',
        language: 'English',
        pages: 328,
        totalCopies: 5,
        location: { shelf: 'A', rack: '3' },
        type: 'book',
        tags: ['dystopian', 'classic', 'political fiction']
      },
      {
        title: 'The Pragmatic Programmer',
        author: 'David Thomas & Andrew Hunt',
        isbn: '978-0-13-595705-9',
        category: categories[2]._id,
        description: 'From journeyman to master — a practical guide covering software development processes, career management, and design approaches.',
        publisher: 'Addison-Wesley',
        publishedYear: 2019,
        edition: '20th Anniversary',
        language: 'English',
        pages: 352,
        totalCopies: 4,
        location: { shelf: 'C', rack: '4' },
        type: 'book',
        tags: ['programming', 'software craft', 'best practices']
      },
      {
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        isbn: '978-0-374-53355-7',
        category: categories[8]._id,
        description: 'Nobel laureate Daniel Kahneman reveals the two systems of thinking that drive the way we think and how they shape our judgments and decisions.',
        publisher: 'Farrar, Straus and Giroux',
        publishedYear: 2011,
        edition: '1st',
        language: 'English',
        pages: 499,
        totalCopies: 3,
        location: { shelf: 'I', rack: '2' },
        type: 'book',
        tags: ['psychology', 'behavioral economics', 'decision making']
      },
      {
        title: 'The Lancet Medical Journal',
        author: 'Richard Horton (Editor)',
        isbn: '978-4-5678-9012-3',
        category: categories[9]._id,
        description: 'One of the oldest and most prestigious peer-reviewed general medical journals, publishing original research, reviews, and commentary.',
        publisher: 'Elsevier',
        publishedYear: 2024,
        edition: 'Volume 403',
        language: 'English',
        pages: 150,
        totalCopies: 2,
        location: { shelf: 'J', rack: '4' },
        type: 'journal',
        tags: ['medicine', 'research', 'clinical']
      },
      {
        title: 'Data Structures and Algorithms in Java',
        author: 'Robert Lafore',
        isbn: '978-0-672-32453-6',
        category: categories[2]._id,
        description: 'A comprehensive guide to data structures and algorithms using Java, with clear explanations, diagrams, and programming examples.',
        publisher: 'Sams Publishing',
        publishedYear: 2002,
        edition: '2nd',
        language: 'English',
        pages: 800,
        totalCopies: 5,
        location: { shelf: 'C', rack: '5' },
        type: 'book',
        tags: ['java', 'data structures', 'algorithms']
      }
    ]);
    console.log(`✓ ${books.length} books created`);

    console.log('\n=== Seed Data Complete ===');
    console.log('Admin Login: admin@library.com / admin123');
    console.log('Member Login: rahul@example.com / member123');
    console.log('Member Login: priya@example.com / member123');
    console.log('========================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
