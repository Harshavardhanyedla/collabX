export interface VideoCourse {
    id: string;
    title: string;
    channel: string;
    duration: string;
    thumbnail: string;
    url: string;
}

export interface LanguageDetail {
    id: string;
    name: string;
    icon: string;
    description: string;
    about: string;
    uses: string[];
    features: string[];
    careerScope: string;
    whoShouldLearn: string;
    youtubeCourses: VideoCourse[];
    notesLink: string;
    notesLabel?: string;
}

export const languagesData: Record<string, LanguageDetail> = {
    'java': {
        id: 'java',
        name: 'Java',
        icon: '☕',
        description: 'Robust, object-oriented programming language used for enterprise applications and Android development.',
        about: 'Java is a high-level, class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible. It is a general-purpose programming language intended to let application developers write once, run anywhere (WORA).',
        uses: ['Enterprise Software', 'Android Mobile Apps', 'Backend Web Development', 'Big Data Technologies'],
        features: ['Object-Oriented', 'Platform Independent', 'Secure', 'Multi-threaded'],
        careerScope: 'High demand in large corporations, banking sectors, and Android app development firms.',
        whoShouldLearn: 'Anyone interested in building large-scale backend systems or Android applications.',
        youtubeCourses: [
            { id: '1', title: 'Java Full Course for free ☕', channel: 'Bro Code', duration: '12h 00m', thumbnail: 'https://img.youtube.com/vi/xTtL8E4LzTQ/hqdefault.jpg', url: 'https://www.youtube.com/watch?v=xTtL8E4LzTQ' },
            { id: '2', title: 'Learn Java 8 - Full Tutorial for Beginners', channel: 'freeCodeCamp.org', duration: '9h 32m', thumbnail: 'https://img.youtube.com/vi/grEKMHGYyns/hqdefault.jpg', url: 'https://www.youtube.com/watch?v=grEKMHGYyns' }
        ],
        notesLink: 'https://drive.google.com/file/d/1LPnOYZCFu1Vnnby74KVcgpWY8S1XOaBY/view?usp=drivesdk'
    },
    'python': {
        id: 'python',
        name: 'Python',
        icon: '🐍',
        description: 'High-level, versatile language known for its readability and extensive libraries in AI and data science.',
        about: 'Python is an interpreted, high-level and general-purpose programming language. Its design philosophy emphasizes code readability with its notable use of significant whitespace.',
        uses: ['Data Science', 'Machine Learning', 'Artificial Intelligence', 'Web Development (Django/Flask)', 'Automation Scripts'],
        features: ['Simple Syntax', 'Interpreted Language', 'Extensive Standard Library', 'Dynamically Typed'],
        careerScope: 'Explosive growth due to AI/ML revolution; widely used in startups and researchers.',
        whoShouldLearn: 'Beginners, future data scientists, and AI engineers.',
        youtubeCourses: [
            { id: '1', title: 'Python Full Course for free 🐍', channel: 'Bro Code', duration: '12h 00m', thumbnail: 'https://img.youtube.com/vi/ix9cRaBkVe0/hqdefault.jpg', url: 'https://www.youtube.com/watch?v=ix9cRaBkVe0' },
            { id: '2', title: 'Python Tutorial for Beginners (with mini-projects)', channel: 'freeCodeCamp.org', duration: '8h 41m', thumbnail: 'https://img.youtube.com/vi/qwAFL1597eM/hqdefault.jpg', url: 'https://www.youtube.com/watch?v=qwAFL1597eM' }
        ],
        notesLink: 'https://drive.google.com/file/d/1Ht-K9p4-bpNsuRly5z2VCCObLgcEw17c/view?usp=drivesdk'
    },
    'cpp': {
        id: 'cpp',
        name: 'C++',
        icon: '⚙️',
        description: 'Powerful, performance-oriented language ideal for systems programming and competitive coding.',
        about: 'C++ is a general-purpose programming language created by Bjarne Stroustrup as an extension of the C programming language, or "C with Classes".',
        uses: ['Systems Programming', 'Game Development', 'Financial Systems', 'Competitive Programming'],
        features: ['High Performance', 'Low-level Memory Manipulation', 'Multi-paradigm Support', 'Large Library Support'],
        careerScope: 'Crucial for performance-critical industries like gaming, fintech, and OS development.',
        whoShouldLearn: 'Students interested in low-level systems, game engines, or competitive programming.',
        youtubeCourses: [
            { id: '1', title: 'C++ Full Course for free ⚡️', channel: 'Bro Code', duration: '6h 00m', thumbnail: 'https://img.youtube.com/vi/-TkoO8Z07hI/hqdefault.jpg', url: 'https://www.youtube.com/watch?v=-TkoO8Z07hI' },
            { id: '2', title: 'C++ Tutorial for Beginners - Full Course', channel: 'freeCodeCamp.org', duration: '4h 01m', thumbnail: 'https://img.youtube.com/vi/vLnPwxZdW4Y/hqdefault.jpg', url: 'https://www.youtube.com/watch?v=vLnPwxZdW4Y' }
        ],
        notesLink: 'https://drive.google.com/file/d/1mmwZq9f9YcUbxrzvuIelqfedQpyNwMaX/view?usp=drivesdk'
    },
    'javascript': {
        id: 'javascript',
        name: 'JavaScript',
        icon: '🟨',
        description: 'The language of the web, essential for frontend and backend development with Node.js.',
        about: 'JavaScript (JS) is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions.',
        uses: ['Web Frontend', 'Backend with Node.js', 'Mobile Apps (React Native)', 'Game Development'],
        features: ['Lightweight', 'Asynchronous', 'Prototypal Inheritance', 'Event-Driven'],
        careerScope: 'Universal demand; essential for every full-stack developer.',
        whoShouldLearn: 'Aspiring web developers and software engineers.',
        youtubeCourses: [
            { id: '1', title: 'JavaScript Full Course for free 🌐', channel: 'Bro Code', duration: '12h 00m', thumbnail: 'https://img.youtube.com/vi/lfmg-EJ8gm4/hqdefault.jpg', url: 'https://www.youtube.com/watch?v=lfmg-EJ8gm4' },
            { id: '2', title: 'JavaScript Programming - Full Course', channel: 'freeCodeCamp.org', duration: '7h 44m', thumbnail: 'https://img.youtube.com/vi/jS4aFq5-91M/hqdefault.jpg', url: 'https://www.youtube.com/watch?v=jS4aFq5-91M' }
        ],
        notesLink: 'https://drive.google.com/file/d/1y2uGTTn77pXBYqrQIPtP6UYtFC31dEtI/view?usp=drivesdk'
    },
    'typescript': {
        id: 'typescript',
        name: 'TypeScript',
        icon: '📘',
        description: 'Superset of JavaScript that adds static types, improving developer productivity and code quality.',
        about: 'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
        uses: ['Large Scale Web Apps', 'Strictly Typed Projects', 'Frontend Frameworks (React/Angular)'],
        features: ['Static Typing', 'IDE Support', 'Object-Oriented Features', 'Readable Code'],
        careerScope: 'Increasingly preferred by top tech companies for web development over plain JS.',
        whoShouldLearn: 'JavaScript developers looking to build more reliable and scalable applications.',
        youtubeCourses: [
            { id: '1', title: 'Learn TypeScript – Full Tutorial', channel: 'freeCodeCamp.org', duration: '4h 46m', thumbnail: 'https://img.youtube.com/vi/30LWjhZzg50/hqdefault.jpg', url: 'https://www.youtube.com/watch?v=30LWjhZzg50' },
            { id: '2', title: 'Learn TypeScript - Full Course for Beginners', channel: 'freeCodeCamp.org', duration: '2h 06m', thumbnail: 'https://img.youtube.com/vi/SpwzRDUQ1GI/hqdefault.jpg', url: 'https://www.youtube.com/watch?v=SpwzRDUQ1GI' }
        ],
        notesLink: 'http://learn.microsoft.com/training/paths/build-javascript-applications-typescript/',
        notesLabel: 'Additional Resources'
    },
    'golang': {
        id: 'golang',
        name: 'Go',
        icon: '🏙️',
        description: 'Statically typed language by Google, built for modern cloud infrastructure and concurrency.',
        about: 'Go is an open source programming language that makes it easy to build simple, reliable, and efficient software.',
        uses: ['Cloud Native Development', 'Cloud Computing', 'Microservices', 'DevOps Tools'],
        features: ['Concurrency Support', 'Fast Compilation', 'Simple Syntax', 'Garbage Collected'],
        careerScope: 'Excellent scope in infrastructure-heavy companies and modern backend development.',
        whoShouldLearn: 'Backend engineers and developers interested in cloud infrastructure.',
        youtubeCourses: [
            { id: '1', title: 'Go / Golang Tutorial', channel: 'CodeAcademy', duration: '4h 30m', thumbnail: 'https://img.youtube.com/vi/placeholder/hqdefault.jpg', url: '#' }
        ],
        notesLink: '#'
    },
    'rust': {
        id: 'rust',
        name: 'Rust',
        icon: '🦀',
        description: 'Memory-safe systems programming language that provides high performance without a garbage collector.',
        about: 'Rust is a multi-paradigm, general-purpose programming language designed for performance and safety, especially safe concurrency.',
        uses: ['Systems Infrastructure', 'WebAssembly', 'Cryptocurrency Platforms', 'Embedded Systems'],
        features: ['Memory Safety', 'Concurrency without Races', 'Zero-cost Abstractions', 'Efficient C Integration'],
        careerScope: 'Highly paid niche; rapidly growing in popularity for safety-critical systems.',
        whoShouldLearn: 'Systems programmers and anyone interested in high-performance, safe software.',
        youtubeCourses: [
            { id: '1', title: 'Rust Programming Course', channel: 'No Boilerplate', duration: '5h 10m', thumbnail: 'https://img.youtube.com/vi/placeholder/hqdefault.jpg', url: '#' }
        ],
        notesLink: '#'
    },
    'swift': {
        id: 'swift',
        name: 'Swift',
        icon: '🍎',
        description: 'Powerful and intuitive programming language for iOS, iPadOS, macOS, tvOS, and watchOS.',
        about: 'Swift is a robust and intuitive programming language created by Apple for building apps for iOS, Mac, Apple TV, and Apple Watch.',
        uses: ['iOS App Development', 'macOS Applications', 'Server-side with Vapor'],
        features: ['Safe', 'Fast', 'Expressive', 'Modern Syntax'],
        careerScope: 'Strong demand in companies building high-quality Apple ecosystem products.',
        whoShouldLearn: 'Aspiring mobile developers focused on the Apple ecosystem.',
        youtubeCourses: [
            { id: '1', title: 'SwiftUI for Beginners', channel: 'Design+Code', duration: '8h 20m', thumbnail: 'https://img.youtube.com/vi/placeholder/hqdefault.jpg', url: '#' }
        ],
        notesLink: '#'
    },
    'kotlin': {
        id: 'kotlin',
        name: 'Kotlin',
        icon: '🤖',
        description: 'Modern, concise language fully interoperable with Java, and used for Android development.',
        about: 'Kotlin is a cross-platform, statically typed, general-purpose programming language with type inference.',
        uses: ['Android Mobile Apps', 'Backend Web Development', 'Multiplatform Mobile Development'],
        features: ['Concise Code', 'Null Safety', 'Java Interoperability', 'Coroutines'],
        careerScope: 'Standard for modern Android development; growing adoption in backend.',
        whoShouldLearn: 'Android developers and Java developers looking for a modern alternative.',
        youtubeCourses: [
            { id: '1', title: 'Kotlin Full Course', channel: 'SmartHerd', duration: '12h 0m', thumbnail: 'https://img.youtube.com/vi/placeholder/hqdefault.jpg', url: '#' }
        ],
        notesLink: '#'
    },
    'php': {
        id: 'php',
        name: 'PHP',
        icon: '🐘',
        description: 'Server-side scripting language primarily used for web development and creating dynamic websites.',
        about: 'PHP is a popular general-purpose scripting language that is especially suited to web development.',
        uses: ['Server-side Web Apps', 'CMS (WordPress/Drupal)', 'E-commerce Platforms'],
        features: ['Open Source', 'Easy Database Integration', 'Large Ecosystem', 'Flexible'],
        careerScope: 'Powers a massive portion of the web; steady demand in web agencies.',
        whoShouldLearn: 'Aspiring web developers and CMS enthusiasts.',
        youtubeCourses: [
            { id: '1', title: 'PHP for Beginners', channel: 'Dani Krossing', duration: '7h 45m', thumbnail: 'https://img.youtube.com/vi/placeholder/hqdefault.jpg', url: '#' }
        ],
        notesLink: '#'
    },
    'ruby': {
        id: 'ruby',
        name: 'Ruby',
        icon: '💎',
        description: 'Dynamic, open source programming language with a focus on simplicity and productivity.',
        about: 'Ruby is a dynamic, interpreted, reflective, object-oriented, general-purpose programming language.',
        uses: ['Web Development (Ruby on Rails)', 'Prototyping', 'Static Site Generators'],
        features: ['Elegant Syntax', 'Object-Oriented', 'Highly Productive', 'Developer Friendly'],
        careerScope: 'Strong niche in startups and companies valuing rapid development speed.',
        whoShouldLearn: 'Developers who value code elegance and developer happiness.',
        youtubeCourses: [
            { id: '1', title: 'Ruby Programming Course', channel: 'Giraffe Academy', duration: '4h 15m', thumbnail: 'https://img.youtube.com/vi/placeholder/hqdefault.jpg', url: '#' }
        ],
        notesLink: '#'
    },
    'sql': {
        id: 'sql',
        name: 'SQL',
        icon: '📊',
        description: 'Standard language for accessing and manipulating databases, essential for any data-related role.',
        about: 'SQL (Structured Query Language) is a domain-specific language used in programming and designed for managing data held in a relational database management system.',
        uses: ['Database Management', 'Data Analysis', 'Backend Development'],
        features: ['Declarative', 'Standard-driven', 'Powerful Querying', 'Set-based Logic'],
        careerScope: 'Essential for every backend developer, data analyst, and database administrator.',
        whoShouldLearn: 'Anyone working with data or building web backends.',
        youtubeCourses: [
            { id: '1', title: 'SQL Full Course for Beginners', channel: 'Alex The Analyst', duration: '4h 0m', thumbnail: 'https://img.youtube.com/vi/placeholder/hqdefault.jpg', url: '#' }
        ],
        notesLink: '#'
    }
};
