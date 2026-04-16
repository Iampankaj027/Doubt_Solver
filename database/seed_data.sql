-- =============================================
-- COLLEGE DOUBT SOLVER — SEED DATA
-- Run this AFTER schema.sql to populate dummy data
-- =============================================

USE college_doubt_solver;

-- ─────────────────────────────────────────────
-- 1. DUMMY USERS (password = "password123" for all)
-- Valid bcrypt hash of "password123"
-- ─────────────────────────────────────────────
INSERT INTO users (name, email, password_hash, auth_provider, branch, year, reputation) VALUES
  ('Aarav Sharma',  'aarav@college.edu',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'local', 'CSE', 3, 245),
  ('Priya Patel',   'priya@college.edu',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'local', 'CSE', 2, 189),
  ('Rohan Gupta',   'rohan@college.edu',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'local', 'IT',  4, 312),
  ('Sneha Reddy',   'sneha@college.edu',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'local', 'ECE', 2, 156),
  ('Vikram Singh',  'vikram@college.edu',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'local', 'CSE', 3, 278),
  ('Ananya Iyer',   'ananya@college.edu',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'local', 'CSE', 1, 98),
  ('Karthik Nair',  'karthik@college.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'local', 'IT',  3, 201),
  ('Meera Joshi',   'meera@college.edu',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'local', 'ECE', 4, 167),
  ('Arjun Mehta',   'arjun@college.edu',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'local', 'ME',  2, 134),
  ('Divya Kapoor',  'divya@college.edu',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'local', 'CSE', 3, 223);


-- ═════════════════════════════════════════════
-- 2. QUESTIONS — 3 per subject (30 total)
-- ═════════════════════════════════════════════

-- ──── DSA Questions ────
INSERT INTO questions (user_id, title, body, vote_score, answer_count, view_count, is_solved, created_at) VALUES
(1, 'How to detect a cycle in a linked list?',
'I know about the brute force approach using a hash set, but I have heard there is a more efficient way using two pointers. Can someone explain Floyd cycle detection algorithm step by step? What is the time and space complexity? Also, how do you find the starting node of the cycle once detected?',
12, 2, 89, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),

(3, 'What is the difference between BFS and DFS? When to use which?',
'I understand that BFS uses a queue and DFS uses a stack or recursion, but I am confused about when to prefer one over the other. For example, in shortest path problems, why is BFS preferred over DFS? Can someone give real-world examples where each is more appropriate?',
8, 2, 67, 0, DATE_SUB(NOW(), INTERVAL 5 DAY)),

(5, 'Time complexity of building a heap — why is it O(n) and not O(n log n)?',
'Intuitively, if we insert n elements into a heap one by one, each insertion takes O(log n), so the total should be O(n log n). But I have read that building a heap using the bottom-up approach (heapify) is actually O(n). Can someone explain the mathematical proof behind this? I find it counterintuitive.',
15, 2, 134, 1, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- ──── DBMS Questions ────
INSERT INTO questions (user_id, title, body, vote_score, answer_count, view_count, is_solved, created_at) VALUES
(2, 'What is the difference between HAVING and WHERE clause in SQL?',
'I know WHERE filters rows and HAVING filters groups, but can someone explain with a practical example? Also, can we use aggregate functions in WHERE? What happens if we use both WHERE and HAVING in the same query — what is the order of execution?',
9, 2, 78, 1, DATE_SUB(NOW(), INTERVAL 7 DAY)),

(4, 'Explain the ACID properties with real-world examples',
'My professor talked about ACID properties in DBMS — Atomicity, Consistency, Isolation, Durability. I understand the definitions but can someone explain each with a real-world banking transaction example? Also, what happens when one of these properties is violated?',
11, 2, 95, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),

(6, 'What is normalization? Explain 1NF, 2NF, 3NF, and BCNF',
'I am studying normalization for my DBMS exam and I find it confusing. Can someone explain each normal form with a simple example? How do you identify whether a table is in 2NF or 3NF? What are functional dependencies and how do they relate to normalization?',
7, 2, 112, 0, DATE_SUB(NOW(), INTERVAL 4 DAY));

-- ──── OS Questions ────
INSERT INTO questions (user_id, title, body, vote_score, answer_count, view_count, is_solved, created_at) VALUES
(7, 'What is a deadlock? How can it be prevented?',
'I understand that deadlock occurs when processes are waiting for each other resources, but I am confused about the four necessary conditions (mutual exclusion, hold and wait, no preemption, circular wait). How does the Banker algorithm prevent deadlocks? Is deadlock prevention same as deadlock avoidance?',
13, 2, 103, 1, DATE_SUB(NOW(), INTERVAL 6 DAY)),

(1, 'Difference between process and thread — when to use which?',
'I know both are units of execution, but what exactly is the difference between a process and a thread? Why are threads called lightweight processes? When should you use multithreading vs multiprocessing? What about the GIL in Python — does it defeat the purpose of threads?',
10, 2, 88, 1, DATE_SUB(NOW(), INTERVAL 8 DAY)),

(9, 'Explain virtual memory and page replacement algorithms',
'How does virtual memory work? I understand the concept of paging, but I am confused about when page faults occur and how the OS handles them. Can someone explain LRU, FIFO, and Optimal page replacement algorithms with examples? What is Belady anomaly and which algorithms are affected by it?',
6, 2, 76, 0, DATE_SUB(NOW(), INTERVAL 3 DAY));

-- ──── CN (Computer Networks) Questions ────
INSERT INTO questions (user_id, title, body, vote_score, answer_count, view_count, is_solved, created_at) VALUES
(8, 'What is the difference between TCP and UDP?',
'I know TCP is connection-oriented and UDP is connectionless, but what does that actually mean in practice? Why is UDP used for video streaming and gaming while TCP is used for web browsing and file transfer? How does TCP guarantee reliable delivery? What is the three-way handshake?',
14, 2, 145, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),

(2, 'Explain the OSI model layers with real examples',
'Can someone explain all 7 layers of the OSI model with examples of protocols at each layer? I always get confused between the Transport layer and the Network layer. Also, how does the TCP/IP model differ from the OSI model? Which one is used in practice?',
9, 2, 118, 1, DATE_SUB(NOW(), INTERVAL 10 DAY)),

(10, 'How does DNS resolution work step by step?',
'When I type www.google.com in a browser, what exactly happens at the DNS level? I have heard about recursive and iterative queries, root servers, TLD servers, and authoritative servers. Can someone walk through the entire DNS resolution process? Also, what is DNS caching and how does TTL work?',
7, 2, 92, 0, DATE_SUB(NOW(), INTERVAL 5 DAY));

-- ──── OOP Questions ────
INSERT INTO questions (user_id, title, body, vote_score, answer_count, view_count, is_solved, created_at) VALUES
(3, 'What is polymorphism? Runtime vs Compile-time polymorphism',
'Can someone explain the difference between compile-time (method overloading) and runtime (method overriding) polymorphism with Java/C++ examples? Why is runtime polymorphism important in design patterns? How does virtual function table (vtable) work internally in C++?',
11, 2, 97, 1, DATE_SUB(NOW(), INTERVAL 4 DAY)),

(6, 'SOLID principles explained with practical examples',
'I have heard about SOLID principles in OOP but they seem too abstract. Can someone explain each principle (Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion) with real code examples? How do you apply them in a real project?',
16, 2, 156, 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),

(5, 'What is the difference between Abstract Class and Interface?',
'In Java, when should I use an abstract class vs an interface? I know Java 8 introduced default methods in interfaces, so now interfaces can have method implementations too. What is the point of abstract classes then? Can someone explain with a design scenario where each is more appropriate?',
8, 2, 85, 0, DATE_SUB(NOW(), INTERVAL 6 DAY));

-- ──── Web Dev Questions ────
INSERT INTO questions (user_id, title, body, vote_score, answer_count, view_count, is_solved, created_at) VALUES
(1, 'How does React virtual DOM work? Why is it faster?',
'I have been using React for a while but I do not fully understand the virtual DOM. How does the diffing algorithm work? What is reconciliation? Why is manipulating the virtual DOM faster than directly manipulating the real DOM? Also, what changed with React 18 concurrent features?',
13, 2, 128, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),

(4, 'REST API vs GraphQL — which should I use for my project?',
'I am building a full-stack app and trying to decide between REST API and GraphQL. What are the pros and cons of each? I have heard about over-fetching and under-fetching problems with REST. When is GraphQL overkill? Can someone who has used both share their experience?',
10, 2, 109, 0, DATE_SUB(NOW(), INTERVAL 7 DAY)),

(7, 'What is the difference between SSR, CSR, SSG, and ISR in Next.js?',
'Next.js offers multiple rendering strategies — Server-Side Rendering (SSR), Client-Side Rendering (CSR), Static Site Generation (SSG), and Incremental Static Regeneration (ISR). When should I use which? What are the performance implications of each? Can I mix them in the same app?',
9, 2, 94, 1, DATE_SUB(NOW(), INTERVAL 5 DAY));

-- ──── AI/ML Questions ────
INSERT INTO questions (user_id, title, body, vote_score, answer_count, view_count, is_solved, created_at) VALUES
(10, 'What is the difference between supervised and unsupervised learning?',
'I am starting to learn ML and I am confused about the basic categories. Can someone explain supervised vs unsupervised learning with examples? What is semi-supervised and self-supervised learning? When do you use classification vs regression? What are some popular algorithms for each?',
8, 2, 86, 1, DATE_SUB(NOW(), INTERVAL 4 DAY)),

(2, 'How does backpropagation work in neural networks?',
'I understand forward propagation — input goes through layers to produce output. But how does backpropagation actually work? What is the chain rule in this context? How are weights updated? Can someone explain with a simple 2-layer network example? What is the vanishing gradient problem?',
12, 2, 107, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),

(5, 'Explain gradient descent variants — SGD, Mini-batch, Adam',
'I know gradient descent is used to optimize the loss function, but there are so many variants. What is the difference between batch gradient descent, stochastic gradient descent (SGD), and mini-batch GD? When should I use Adam vs SGD? What are learning rate schedules and why are they important?',
6, 2, 73, 0, DATE_SUB(NOW(), INTERVAL 8 DAY));

-- ──── Mathematics Questions ────
INSERT INTO questions (user_id, title, body, vote_score, answer_count, view_count, is_solved, created_at) VALUES
(9, 'How to find eigenvalues and eigenvectors of a matrix?',
'I am studying linear algebra and I understand the definition (Av = lambda v), but I struggle with the actual computation. Can someone walk through finding eigenvalues and eigenvectors of a 3x3 matrix step by step? Also, what is the geometric interpretation of eigenvalues and why are they important in ML (like PCA)?',
7, 2, 82, 1, DATE_SUB(NOW(), INTERVAL 6 DAY)),

(3, 'What is the difference between permutation and combination?',
'I always get confused between permutation (nPr) and combination (nCr). The formulas look similar but when do I use which? Can someone give examples of problems where order matters vs does not matter? How do you handle problems with repetition allowed?',
5, 2, 64, 1, DATE_SUB(NOW(), INTERVAL 9 DAY)),

(8, 'Explain probability distributions — Normal, Poisson, Binomial',
'I am studying probability for my stats course and I am confused about when to use which distribution. Can someone explain the Normal, Poisson, and Binomial distributions with real-world examples? What are the parameters of each? When does the Binomial distribution approximate the Normal distribution?',
9, 2, 91, 0, DATE_SUB(NOW(), INTERVAL 3 DAY));

-- ──── Physics Questions ────
INSERT INTO questions (user_id, title, body, vote_score, answer_count, view_count, is_solved, created_at) VALUES
(6, 'How does a semiconductor PN junction work?',
'I am studying electronics and I understand that P-type has holes and N-type has electrons, but I am confused about what happens at the junction. What is the depletion region? How does forward and reverse biasing work? Can someone explain how a diode allows current in only one direction?',
8, 2, 79, 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),

(1, 'Explain Kirchhoff laws with circuit examples',
'I know KCL says current entering equals current leaving a node, and KVL says voltage around a loop sums to zero. But I struggle to apply them to complex circuits. Can someone walk through solving a circuit with multiple loops using KVL and KCL? What about circuits with dependent sources?',
6, 2, 68, 0, DATE_SUB(NOW(), INTERVAL 7 DAY)),

(4, 'What is electromagnetic induction and Faraday law?',
'Can someone explain Faraday law of electromagnetic induction in simple terms? How does changing magnetic flux produce EMF? What is Lenz law and how does it relate to Faraday law? Give practical applications like generators and transformers. How is this related to Maxwell equations?',
10, 2, 95, 1, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- ──── General Questions ────
INSERT INTO questions (user_id, title, body, vote_score, answer_count, view_count, is_solved, created_at) VALUES
(7, 'Tips for preparing for technical interviews at FAANG companies?',
'I am in my final year and starting to prepare for technical interviews. What topics should I focus on? How many LeetCode problems should I solve? What is the best strategy — should I do topic-wise or random problems? How important are system design questions for SDE-1 roles? Any recommended resources?',
18, 2, 198, 0, DATE_SUB(NOW(), INTERVAL 2 DAY)),

(9, 'How to manage time between college studies and competitive programming?',
'I want to get better at competitive programming but college assignments and exams take up most of my time. How do you balance both? What is a realistic daily schedule? Should I focus on CP during vacations only or try to do a little every day? What platforms are best for beginners?',
11, 2, 142, 1, DATE_SUB(NOW(), INTERVAL 4 DAY)),

(10, 'What are the best open-source projects for beginners to contribute to?',
'I want to start contributing to open-source but most projects seem too complex. How do I find beginner-friendly issues? What does good first issue mean? Can someone recommend specific projects (preferably in JavaScript/Python) that are welcoming to new contributors? How do I submit my first PR?',
14, 2, 167, 1, DATE_SUB(NOW(), INTERVAL 6 DAY));


-- ═════════════════════════════════════════════
-- 3. QUESTION-TAG MAPPINGS
-- ═════════════════════════════════════════════
-- Tag IDs: 1=DSA, 2=DBMS, 3=OS, 4=CN, 5=OOP, 6=Web Dev, 7=AI/ML, 8=Mathematics, 9=Physics, 10=General

-- DSA questions (IDs 1-3)
INSERT INTO question_tags (question_id, tag_id) VALUES
(1, 1), (2, 1), (3, 1);

-- DBMS questions (IDs 4-6)
INSERT INTO question_tags (question_id, tag_id) VALUES
(4, 2), (5, 2), (6, 2);

-- OS questions (IDs 7-9)
INSERT INTO question_tags (question_id, tag_id) VALUES
(7, 3), (8, 3), (9, 3);

-- CN questions (IDs 10-12)
INSERT INTO question_tags (question_id, tag_id) VALUES
(10, 4), (11, 4), (12, 4);

-- OOP questions (IDs 13-15)
INSERT INTO question_tags (question_id, tag_id) VALUES
(13, 5), (14, 5), (15, 5);

-- Web Dev questions (IDs 16-18)
INSERT INTO question_tags (question_id, tag_id) VALUES
(16, 6), (17, 6), (18, 6);

-- AI/ML questions (IDs 19-21)
INSERT INTO question_tags (question_id, tag_id) VALUES
(19, 7), (20, 7), (21, 7);

-- Mathematics questions (IDs 22-24)
INSERT INTO question_tags (question_id, tag_id) VALUES
(22, 8), (23, 8), (24, 8);

-- Physics questions (IDs 25-27)
INSERT INTO question_tags (question_id, tag_id) VALUES
(25, 9), (26, 9), (27, 9);

-- General questions (IDs 28-30)
INSERT INTO question_tags (question_id, tag_id) VALUES
(28, 10), (29, 10), (30, 10);

-- Update tag usage counts
UPDATE tags SET usage_count = 3 WHERE id BETWEEN 1 AND 10;


-- ═════════════════════════════════════════════
-- 4. ANSWERS (2 per question = 60 total)
-- ═════════════════════════════════════════════

-- ──── DSA Answers ────
-- Q1: Cycle detection
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(1, 3, 'Floyd Cycle Detection (Tortoise and Hare) uses two pointers. Slow pointer moves 1 step at a time, Fast pointer moves 2 steps. If there is a cycle, they will eventually meet inside the cycle. Here is the key code:\n\nListNode slow = head, fast = head;\nwhile (fast != null && fast.next != null) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow == fast) break;\n}\n\nTime complexity: O(n), Space complexity: O(1)\n\nTo find the cycle start, reset one pointer to head, then move both one step at a time. Where they meet is the cycle start. This works due to the mathematical relationship between distances.', 8, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),

(1, 5, 'Adding to the above answer, here is the mathematical proof for finding the cycle start. Let the distance from head to cycle start = a, cycle length = c, and the meeting point is k steps into the cycle.\n\nSlow traveled: a + k\nFast traveled: a + k + nc (n complete loops)\n\nSince fast moves 2x: 2(a + k) = a + k + nc, which gives us a + k = nc, therefore a = nc - k\n\nThis means if you start one pointer at head and another at meeting point, both moving 1 step, they will meet at the cycle start after a steps. Brilliant algorithm!', 5, 0, DATE_SUB(NOW(), INTERVAL 2 DAY));

-- Q2: BFS vs DFS
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(2, 10, 'BFS (Breadth-First Search) uses a queue (FIFO), explores level by level, guarantees shortest path in unweighted graphs, uses higher memory (stores entire level). Best for: shortest path, level-order traversal, finding nearest nodes.\n\nDFS (Depth-First Search) uses a stack (LIFO) or recursion, explores as deep as possible first, does NOT guarantee shortest path, uses lower memory (only stores current path). Best for: cycle detection, topological sort, maze solving, connected components.\n\nRule of thumb: If you need shortest path use BFS. If you need to explore all possibilities use DFS.', 6, 0, DATE_SUB(NOW(), INTERVAL 4 DAY)),

(2, 2, 'Real-world examples:\n\nBFS use cases:\n1. Social network friend suggestions (find people within 2 connections)\n2. GPS navigation shortest route\n3. Web crawler (crawl all pages at same depth first)\n4. Finding nearest hospital or ATM\n\nDFS use cases:\n1. Solving Sudoku or puzzles (try one path, backtrack if wrong)\n2. File system directory traversal\n3. Detecting cycles in dependency graphs\n4. Generating mazes\n\nMemory-wise, for a tree with branching factor b and depth d, BFS uses O(b^d) space and DFS uses O(d) space. So for very wide structures DFS wins on memory, for narrow deep structures BFS is more predictable.', 4, 0, DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Q3: Heap building complexity
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(3, 7, 'Great question! The O(n) complexity comes from the bottom-up heapify approach.\n\nKey insight: When you heapify, the work done is proportional to the height of the node, not the total tree height.\n\nNodes at height 0 (leaves, about n/2 nodes): 0 work each\nNodes at height 1 (about n/4 nodes): 1 swap each\nNodes at height 2 (about n/8 nodes): 2 swaps each\nRoot (height log n): log n swaps\n\nTotal work = Sum of (n / 2^(h+1)) x h for h = 0 to log n\n\nThis sum converges to O(n) by the geometric series formula. The key is that most nodes are near the bottom and do very little work!\n\nThis is why heapq.heapify(arr) in Python is O(n) while inserting one by one would be O(n log n).', 10, 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),

(3, 4, 'Think of it visually:\n\nLevel 0 (root):    1 node   x log(n) work\nLevel 1:           2 nodes  x (log(n)-1) work\nLevel 2:           4 nodes  x (log(n)-2) work\nLevel log(n)-1:    n/2 nodes x 1 work\nLevel log(n):      n/2 nodes x 0 work\n\nMost of your nodes (half!) are at the bottom and do ZERO work. Only ONE node (root) does maximum work. This is why the sum ends up being O(n) instead of O(n log n).\n\nA helpful analogy: Imagine organizing a tournament bracket. Setting up the final match is hard (lots of comparisons), but most first-round matches are trivial. The total setup is proportional to the number of participants, not participants multiplied by rounds.', 7, 0, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- ──── DBMS Answers ────
-- Q4: HAVING vs WHERE
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(4, 5, 'WHERE filters individual rows BEFORE grouping. HAVING filters groups AFTER grouping.\n\nExample:\nSELECT department, COUNT(*) as emp_count\nFROM employees\nWHERE salary > 50000\nGROUP BY department\nHAVING COUNT(*) > 5;\n\nExecution order: FROM, then WHERE, then GROUP BY, then HAVING, then SELECT, then ORDER BY.\n\nYou cannot use aggregate functions (COUNT, SUM, AVG) in WHERE because aggregation has not happened yet at that stage. That is exactly why HAVING exists!', 7, 1, DATE_SUB(NOW(), INTERVAL 6 DAY)),

(4, 8, 'Simple way to remember the difference:\n\nWHERE filters individual rows, can be used in any query, aggregates are NOT allowed, and it is faster because it filters early.\n\nHAVING filters groups, is used with GROUP BY, aggregates ARE allowed, and it is slower because it filters after grouping.\n\nPro tip: Always prefer WHERE over HAVING when possible, because WHERE reduces the data before grouping starts, making the query more efficient.\n\nBad (slow): SELECT dept, AVG(salary) FROM emp GROUP BY dept HAVING dept = IT\nGood (fast): SELECT dept, AVG(salary) FROM emp WHERE dept = IT GROUP BY dept', 5, 0, DATE_SUB(NOW(), INTERVAL 5 DAY));

-- Q5: ACID properties
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(5, 1, 'Let me explain ACID using a bank transfer example (Rs 1000 from Account A to Account B):\n\nAtomicity: All or Nothing. Both debit from A AND credit to B must happen. If the system crashes after debiting A but before crediting B, the entire transaction rolls back. You will not lose money.\n\nConsistency: Valid State to Valid State. Total money in the bank remains the same. A(-1000) + B(+1000) = 0 net change. Database constraints like balance >= 0 are always maintained.\n\nIsolation: Transactions Do Not Interfere. If two people transfer money simultaneously, each transaction sees a consistent snapshot. One will not see the other half-done work.\n\nDurability: Committed means Permanent. Once the bank confirms your transfer, it is saved even if the server crashes. Data is written to disk, not just memory.', 9, 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),

(5, 10, 'What happens if ACID is violated?\n\nWithout Atomicity: Money disappears! Debited from your account but never credited to the recipient.\n\nWithout Consistency: Negative balances, duplicate records, foreign key violations — data becomes garbage.\n\nWithout Isolation: Dirty reads (you see another transaction uncommitted changes), Lost updates (two transactions overwrite each other), Phantom reads (rows appear or disappear during your transaction).\n\nWithout Durability: Your payment was successful but after a restart, the money is gone.\n\nDatabases use Write-Ahead Logging (WAL) for durability, locks and MVCC for isolation, and undo/redo logs for atomicity. Each property has a performance cost, which is why some NoSQL databases sacrifice ACID for speed.', 6, 0, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Q6: Normalization
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(6, 3, 'Here is normalization explained simply:\n\n1NF (First Normal Form): Each column has atomic (single) values, no repeating groups. Example: Name with value Math, Physics should be split into separate rows.\n\n2NF (Second Normal Form): Must be in 1NF. No partial dependencies (non-key columns depend on the ENTIRE primary key). Relevant when you have composite primary keys.\n\n3NF (Third Normal Form): Must be in 2NF. No transitive dependencies (non-key depending on non-key). Example: StudentID depends on Department which depends on HOD. Remove HOD to a separate table.\n\nBCNF (Boyce-Codd): Must be in 3NF. Every determinant must be a candidate key. Stricter than 3NF and handles some edge cases.\n\nRemember: The key, the whole key, and nothing but the key!', 5, 0, DATE_SUB(NOW(), INTERVAL 3 DAY)),

(6, 7, 'Let me give a concrete example:\n\nUnnormalized table: StudentID, Name, Courses (Math, Physics), Professor (Prof.A, Prof.B)\n\n1NF: Split multi-valued columns into separate rows.\nStudentID=1, Name=Aarav, Course=Math, Professor=Prof.A\nStudentID=1, Name=Aarav, Course=Physics, Professor=Prof.B\n\n2NF: Remove partial dependencies. Name depends only on StudentID not Course.\nStudents(StudentID, Name)\nEnrollments(StudentID, Course, Professor)\n\n3NF: Remove transitive dependencies. Professor depends on Course not StudentID.\nStudents(StudentID, Name)\nEnrollments(StudentID, CourseID)\nCourses(CourseID, CourseName, Professor)\n\nEach step reduces redundancy and update anomalies!', 4, 0, DATE_SUB(NOW(), INTERVAL 2 DAY));

-- Q7: Deadlock
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(7, 5, 'A deadlock is when two or more processes are stuck forever, each waiting for a resource the other holds.\n\nFour necessary conditions (ALL must hold):\n1. Mutual Exclusion: Resource cannot be shared\n2. Hold and Wait: Process holds one resource while waiting for another\n3. No Preemption: Resources cannot be forcibly taken\n4. Circular Wait: P1 waits for P2, P2 waits for P1\n\nPrevention (break one condition):\n- Break Hold and Wait: Request all resources at once\n- Break Circular Wait: Number resources, request in order\n- Break No Preemption: Allow OS to take resources\n\nAvoidance (Banker Algorithm): Before granting a resource, check if it leads to a safe state. If not, make the process wait.\n\nDetection vs Prevention: Prevention stops deadlocks from occurring. Detection allows them but detects and recovers by killing a process or rolling back.', 9, 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),

(7, 2, 'Here is a simple real-life example of deadlock:\n\nImagine two people at a narrow bridge from opposite sides. Person A is on the bridge going right, Person B going left. Neither can pass, neither wants to back up. That is deadlock!\n\nBanker Algorithm simplified: Think of a bank with limited cash. Before giving a loan, the bank checks if after giving this loan it can still satisfy all other customers in some order. If yes it is safe and the loan is granted. If no it is unsafe and the loan is denied.\n\nThe algorithm maintains:\n- Available: Resources currently free\n- Max: Maximum each process could need\n- Allocation: Currently allocated to each process\n- Need: Max minus Allocation\n\nIt finds a safe sequence — an order to satisfy all processes. If no safe sequence exists, the request is denied.\n\nDeadlock prevention is simpler but more restrictive. Avoidance is smarter but requires knowing maximum needs in advance.', 6, 0, DATE_SUB(NOW(), INTERVAL 4 DAY));

-- Q8: Process vs Thread
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(8, 4, 'Process: Independent execution unit with its own memory space, heavier to create and switch between, communication via IPC (pipes, sockets, shared memory), one process crashing does not affect others.\n\nThread: Lightweight execution unit within a process, shares memory space with other threads in same process, faster to create and context-switch, one thread crashing can bring down all threads.\n\nWhen to use which:\n- Multiprocessing: CPU-intensive tasks, need isolation, true parallelism on multi-core\n- Multithreading: I/O-bound tasks, shared data, responsive UIs\n\nPython GIL: The Global Interpreter Lock means only one Python thread executes at a time. For CPU-bound work, use multiprocessing. For I/O-bound tasks like network calls and file reads, threads still help because the GIL is released during I/O.', 7, 1, DATE_SUB(NOW(), INTERVAL 7 DAY)),

(8, 6, 'A great analogy:\n\nProcess = A separate restaurant. Has its own kitchen, staff, and supplies. Very independent but expensive to set up.\n\nThread = Chefs in the SAME restaurant. They share the kitchen and ingredients. Fast to add another chef, but if one chef sets the kitchen on fire, everyone is affected.\n\nComparison:\n- Memory: Process has separate memory, Thread has shared memory\n- Creation cost: Process is high, Thread is low\n- Communication: Process uses IPC (pipes etc.), Thread uses direct shared memory\n- Isolation: Process is high (one crash does not affect others), Thread is low\n- Context switch: Process is slow (~1-10ms), Thread is fast (~1-100 microseconds)\n\nModern applications often use a hybrid approach: multiple processes, each with multiple threads. Chrome uses this — each tab is a separate process for isolation, but within each tab, multiple threads handle rendering, JavaScript, and networking.', 8, 0, DATE_SUB(NOW(), INTERVAL 6 DAY));

-- Q9: Virtual Memory
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(9, 10, 'Virtual memory gives each process the illusion of having a large, contiguous memory space, even if physical RAM is limited.\n\nHow it works:\n1. Memory is divided into fixed-size pages (virtual) and frames (physical)\n2. A page table maps virtual pages to physical frames\n3. When a program accesses a page not in RAM, a page fault occurs\n4. OS loads the needed page from disk (swap space) into a free frame\n5. If no free frames, use a page replacement algorithm to evict one\n\nPage Replacement Algorithms:\n- FIFO: Replace the oldest page. Simple but suffers from Belady anomaly\n- LRU: Replace the least recently used page. Good performance but expensive to track\n- Optimal: Replace the page that will not be used for the longest time. Theoretical best but impossible to implement as it needs future knowledge\n\nBelady Anomaly: With FIFO, more frames can actually cause MORE page faults! LRU and Optimal are immune to this.', 5, 0, DATE_SUB(NOW(), INTERVAL 2 DAY)),

(9, 3, 'Let me walk through a page replacement example:\n\nReference string: 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5\nFrames available: 3\n\nFIFO:\n1 -> [1, -, -] fault\n2 -> [1, 2, -] fault\n3 -> [1, 2, 3] fault\n4 -> [4, 2, 3] fault (replace oldest: 1)\n1 -> [4, 1, 3] fault (replace oldest: 2)\nTotal faults: 9\n\nLRU:\n1 -> [1, -, -] fault\n2 -> [1, 2, -] fault\n3 -> [1, 2, 3] fault\n4 -> [4, 2, 3] fault (1 was least recent)\n1 -> [4, 1, 3] fault (2 was least recent)\nTotal faults: 10\n\nIn practice, LRU is approximated using reference bits (clock algorithm) since true LRU tracking is expensive. Most modern OSes use a variant of LRU.', 3, 0, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Q10: TCP vs UDP
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(10, 1, 'TCP (Transmission Control Protocol): Connection-oriented (3-way handshake: SYN, SYN-ACK, ACK), reliable delivery with acknowledgments and retransmissions, ordered packets using sequence numbers, flow control and congestion control, higher overhead, slower. Use case: HTTP, FTP, email, file transfer.\n\nUDP (User Datagram Protocol): Connectionless (just send, no handshake), no guarantee of delivery, packets may arrive out of order, no flow or congestion control, lower overhead, faster. Use case: Video streaming, gaming, DNS, VoIP.\n\nWhy UDP for streaming? If a video frame is lost, retransmitting it is useless — the moment has passed. Better to skip it and show the next frame. A 50ms delay from TCP retransmission creates noticeable lag in games.\n\nThree-way handshake: Client sends SYN, Server responds SYN-ACK, Client sends ACK. Connection established!', 10, 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),

(10, 5, 'Here is a fun analogy:\n\nTCP is like a phone call: You dial (SYN), other person picks up (SYN-ACK), you say hello (ACK). You confirm each message was heard. Messages arrive in order. If connection drops, you know immediately.\n\nUDP is like sending postcards: Just write and drop in mailbox. No confirmation of delivery. Postcards might arrive out of order. Some might get lost forever. But it is much cheaper and faster!\n\nComparison:\n- Connection: TCP required, UDP not required\n- Reliability: TCP guaranteed, UDP best effort\n- Speed: TCP slower, UDP faster\n- Header size: TCP 20-60 bytes, UDP 8 bytes\n- Ordering: TCP yes, UDP no\n\nFun fact: HTTP/3 uses QUIC, which runs on UDP but adds reliability features. Best of both worlds!', 8, 0, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Q11: OSI Model
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(11, 7, 'The 7 OSI Layers from bottom to top:\n\n1. Physical: Bits on the wire (Ethernet cables, fiber optics, WiFi signals)\n2. Data Link: Frames between adjacent nodes (MAC addresses, switches, ARP)\n3. Network: Routing packets across networks (IP, routers, ICMP)\n4. Transport: End-to-end delivery (TCP, UDP, port numbers)\n5. Session: Manage sessions (authentication, reconnection)\n6. Presentation: Data formatting (encryption/SSL, compression, encoding)\n7. Application: User-facing protocols (HTTP, FTP, SMTP, DNS)\n\nMemory trick: Please Do Not Throw Sausage Pizza Away\n\nOSI vs TCP/IP: TCP/IP model has 4 layers: Network Access (layers 1+2), Internet (layer 3), Transport (layer 4), Application (layers 5+6+7). TCP/IP is what is actually used on the internet. OSI is a theoretical reference model.\n\nThe Transport layer handles port-to-port communication, while Network layer handles host-to-host routing.', 7, 1, DATE_SUB(NOW(), INTERVAL 9 DAY)),

(11, 4, 'Here is how data flows when you visit a website:\n\nSending (top to bottom, encapsulation):\n1. Application: Browser creates HTTP GET request\n2. Presentation: SSL encrypts the data\n3. Session: Establishes or reuses session\n4. Transport: TCP adds source and dest port, breaks into segments\n5. Network: IP adds source and dest IP address, creates packets\n6. Data Link: Adds MAC address, creates frames\n7. Physical: Converts to electrical or optical signals\n\nReceiving (bottom to top, decapsulation): Reverse process — each layer strips its header and passes data up.\n\nThink of it like mailing a letter: You write the letter (Application), put it in an envelope with address (Network), post office routes it (Data Link and Physical), recipient opens envelope and reads (decapsulation).\n\nEach layer only communicates with its peer layer on the other end, unaware of the layers above or below.', 5, 0, DATE_SUB(NOW(), INTERVAL 8 DAY));

-- Q12: DNS Resolution
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(12, 3, 'When you type www.google.com, here is what happens:\n\n1. Browser cache: Checks if it recently resolved this domain\n2. OS cache: Checks the operating system DNS cache\n3. Router cache: Your home router might have it cached\n4. ISP Recursive Resolver: If not cached, your ISP DNS server starts the lookup:\n   a. Asks a Root Server (13 worldwide): Where are .com servers?\n   b. Asks TLD Server (.com): Where is google.com?\n   c. Asks Authoritative Server (Google DNS): What is the IP for www.google.com?\n   d. Returns IP: 142.250.190.68\n5. Browser connects to that IP via TCP\n\nTTL (Time To Live): Each DNS record has a TTL (e.g., 300 seconds). After TTL expires, the cached entry is discarded and re-resolved. Lower TTL means faster propagation of changes but more DNS queries.', 5, 0, DATE_SUB(NOW(), INTERVAL 4 DAY)),

(12, 9, 'Recursive vs Iterative queries:\n- Recursive: You find the answer for me. Client asks resolver, resolver does all the work.\n- Iterative: Here is the next server to ask. Each server points to the next one.\n\nYour browser makes a recursive query to your ISP. Your ISP makes iterative queries to root, TLD, and authoritative servers.\n\nDNS Record Types:\n- A: Domain to IPv4 address\n- AAAA: Domain to IPv6 address\n- CNAME: Domain to another domain (alias)\n- MX: Domain to mail server\n- NS: Domain to authoritative nameserver\n\nWhy DNS caching matters: Without caching, every web request would need 4+ DNS lookups, adding 100-200ms of latency. That is why your first visit is slower than subsequent visits.\n\nYou can see your DNS cache with ipconfig /displaydns on Windows.', 4, 0, DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Q13: Polymorphism
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(13, 1, 'Compile-time Polymorphism (Method Overloading): Same method name, different parameters. Resolved at compile time.\n\nExample in Java:\nclass Calculator {\n    int add(int a, int b) { return a + b; }\n    double add(double a, double b) { return a + b; }\n    int add(int a, int b, int c) { return a + b + c; }\n}\n\nRuntime Polymorphism (Method Overriding): Subclass provides specific implementation of parent method. Resolved at runtime via vtable.\n\nExample:\nclass Animal { void speak() { ... } }\nclass Dog extends Animal { void speak() { print Woof; } }\nAnimal a = new Dog();\na.speak(); // prints Woof, decided at runtime!\n\nvtable (Virtual Table): In C++, each class with virtual functions has a vtable — an array of function pointers. When you call a virtual function, the program looks up the vtable to find the correct implementation. This is how runtime dispatch works.', 8, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),

(13, 8, 'Runtime polymorphism is crucial for design patterns! Here is an example using the Strategy Pattern:\n\ninterface SortStrategy { void sort(int[] arr); }\nclass QuickSort implements SortStrategy { void sort(int[] arr) { /* quicksort logic */ } }\nclass MergeSort implements SortStrategy { void sort(int[] arr) { /* mergesort logic */ } }\n\nclass Sorter {\n    SortStrategy strategy;\n    void doSort(int[] arr) { strategy.sort(arr); } // Polymorphic call!\n}\n\nYou can swap sorting algorithms at runtime without changing the Sorter class. This is the Open-Closed Principle in action — open for extension, closed for modification.\n\nOther patterns using polymorphism: Factory, Observer, Decorator, Command.', 6, 0, DATE_SUB(NOW(), INTERVAL 2 DAY));

-- Q14: SOLID Principles
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(14, 10, 'Here are SOLID principles with practical examples:\n\nS — Single Responsibility: A class should have only ONE reason to change. Bad example: UserService that handles auth, email, AND database. Good example: AuthService, EmailService, UserRepository — each does one thing.\n\nO — Open/Closed: Open for extension, closed for modification. Bad: Adding new payment type requires modifying PaymentProcessor. Good: PaymentProcessor uses PaymentStrategy interface; add new strategies without touching existing code.\n\nL — Liskov Substitution: Subclasses should be substitutable for their parent class. Bad: Square extends Rectangle but breaks when you set width independently. Good: Both implement Shape interface with area() method.\n\nI — Interface Segregation: Do not force classes to implement methods they do not use. Bad: One massive IWorker interface with code(), test(), manage(). Good: ICoder, ITester, IManager — implement only what is relevant.\n\nD — Dependency Inversion: Depend on abstractions, not concretions. Bad: NotificationService creates new EmailSender() internally. Good: NotificationService receives IMessageSender via constructor injection.', 12, 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),

(14, 4, 'Memory trick for SOLID:\n\nSingle Responsibility: A class should do one thing and do it well (Unix philosophy)\nOpen/Closed: Think of plugin architecture like browser extensions\nLiskov Substitution: If it looks like a duck but needs batteries, wrong abstraction\nInterface Segregation: Many small interfaces is better than one fat interface\nDependency Inversion: Program to interfaces, not implementations\n\nReal-world benefit of following SOLID:\n1. Testable: Easy to mock dependencies\n2. Maintainable: Changes are localized\n3. Extensible: Add features without breaking existing code\n4. Readable: Each class has a clear purpose\n\nDo not over-engineer though! Apply SOLID when complexity demands it. A simple script does not need 5 layers of abstraction. Use your judgment.', 8, 0, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Q15: Abstract Class vs Interface
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(15, 9, 'Abstract Class: Can have constructors, instance variables, and concrete methods. Single inheritance only (extends one class). Represents an IS-A relationship with shared implementation. Use when classes share common code.\n\nInterface: Only method signatures plus default methods since Java 8. Multiple implementation (implements many interfaces). Defines CAN-DO capability. Use when unrelated classes share a behavior.\n\nWhen to use Abstract Class: Animal as parent of Dog and Cat (share common eat() and sleep() implementation).\n\nWhen to use Interface: Flyable implemented by Bird, Airplane, Drone (unrelated classes that can fly). Serializable implemented by any class that can be serialized.\n\nPost Java 8: Interfaces can have default methods, but still cannot have constructors, instance fields (only static final), or protected methods (Java 9 added private methods).\n\nIf you need shared state use Abstract Class. If you need multiple inheritance of type use Interface.', 6, 0, DATE_SUB(NOW(), INTERVAL 5 DAY)),

(15, 2, 'Here is a practical design scenario for a notification system:\n\nInterface defines capability:\ninterface Notifiable { void sendNotification(String message); }\n\nAbstract class provides shared implementation:\nabstract class NotificationService {\n    protected String sender;\n    NotificationService(String sender) { this.sender = sender; }\n    abstract void send(String to, String msg);\n    String formatMessage(String msg) { return sender + ": " + msg; }\n}\n\nConcrete implementations use both:\nclass EmailService extends NotificationService implements Notifiable { ... }\nclass SMSService extends NotificationService implements Notifiable { ... }\n\nNotice how we use BOTH: Abstract class for shared code (formatMessage, constructor) and Interface for the contract (Notifiable). This is the recommended pattern in modern Java.', 5, 0, DATE_SUB(NOW(), INTERVAL 4 DAY));

-- Q16: React Virtual DOM
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(16, 3, 'The Virtual DOM is a lightweight JavaScript object representation of the real DOM.\n\nHow it works:\n1. When state changes, React creates a NEW virtual DOM tree\n2. Diffing: Compares new tree with previous tree using a heuristic O(n) algorithm\n3. Reconciliation: Calculates minimum DOM operations needed\n4. Batch update: Applies all changes to real DOM at once\n\nWhy is it faster? Direct DOM manipulation is expensive because each change triggers layout recalculation, repainting is costly, and multiple small changes cause multiple reflows. Virtual DOM batches all changes and applies them in ONE go, minimizing reflows.\n\nReact 18 Concurrent Features:\n- Automatic batching: Groups multiple state updates into one render\n- Transitions: Mark non-urgent updates so UI stays responsive\n- Suspense: Better loading states\n- useTransition and useDeferredValue: Prioritize urgent updates\n\nReact 18 can now interrupt rendering to handle more important updates first!', 9, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),

(16, 7, 'React diff algorithm has two key assumptions:\n1. Different element types produce different trees (just replace entirely)\n2. Keys help identify which children changed\n\nWithout keys: React re-renders ALL items when list changes.\nWith keys: React knows exactly which items changed and only updates those.\n\nCommon mistakes:\n- Using array index as key (breaks reordering)\n- Putting key on wrong element\n- Not providing keys at all\n\nPerformance tip: Use React.memo() to skip re-rendering when props have not changed:\n\nconst ExpensiveComponent = React.memo(({ data }) => {\n    // Only re-renders when data changes\n    return <div>...</div>;\n});\n\nAlso check out React DevTools Profiler to identify unnecessary re-renders!', 7, 0, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Q17: REST vs GraphQL
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(17, 10, 'REST API: Multiple endpoints (/users, /posts, /comments). Server decides what data to return. Over-fetching: GET /user returns ALL fields even if you need just the name. Under-fetching: Need user + posts = 2 separate requests. Caching is straightforward using HTTP caching. Well-established and most APIs use it.\n\nGraphQL: Single endpoint (/graphql). Client specifies exactly what data it needs. No over or under-fetching. Nested queries in one request. More complex caching. Steeper learning curve.\n\nWhen GraphQL is overkill: Simple CRUD apps, public APIs with simple data needs, small team not familiar with GraphQL.\n\nWhen GraphQL shines: Complex data with many relationships, mobile apps (bandwidth optimization), multiple client types (web, mobile, IoT).\n\nRecommendation: Start with REST. Switch to GraphQL when you feel the pain of over-fetching and multiple roundtrips.', 7, 0, DATE_SUB(NOW(), INTERVAL 6 DAY)),

(17, 6, 'I have used both in production. Here is my experience:\n\nREST worked great when building a simple blog API with CRUD operations, creating a public API with clear resource boundaries, and when the team was mostly backend developers.\n\nSwitched to GraphQL when our mobile app needed different data than the web app, when dashboard pages required data from 5+ endpoints, and when the frontend team wanted control over data shape.\n\nPractical comparison:\nREST needs 3 requests to build a user profile page:\nGET /users/1\nGET /users/1/posts\nGET /users/1/followers\n\nGraphQL needs 1 request:\nquery { user(id: 1) { name posts { title } followers { name } } }\n\nHybrid approach: Many companies use REST for simple endpoints and GraphQL for complex data fetching. You do not have to choose just one!\n\nTools: REST with Express or Fastify plus Swagger. GraphQL with Apollo Server and Apollo Client.', 8, 0, DATE_SUB(NOW(), INTERVAL 5 DAY));

-- Q18: SSR/CSR/SSG/ISR in Next.js
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(18, 2, 'Here is each rendering strategy explained:\n\nCSR (Client-Side Rendering): Browser downloads JS and renders page on client. Slow initial load, fast subsequent navigation. Bad for SEO. Use for: dashboards, admin panels, authenticated pages.\n\nSSR (Server-Side Rendering): Server renders HTML on every request. Good SEO, always fresh data. Higher server load. Use for: dynamic content that changes frequently like social feeds and e-commerce.\n\nSSG (Static Site Generation): HTML generated at build time. Fastest option, served from CDN. Data is stale until next build. Use for: blogs, docs, marketing pages.\n\nISR (Incremental Static Regeneration): Best of SSG and SSR. Statically generated but re-validated in background after X seconds. Use for: product pages, news sites.\n\nNext.js ISR example:\nexport async function getStaticProps() {\n  return { props: {...}, revalidate: 60 };\n}\n\nYes, you can mix them in the same app!', 7, 1, DATE_SUB(NOW(), INTERVAL 4 DAY)),

(18, 8, 'Decision guide:\n\nDoes the page need user-specific data?\n- Yes and needs SEO: Use SSR (getServerSideProps)\n- Yes and no SEO needed: Use CSR (useEffect + useState)\n- No and data changes frequently: Use ISR (getStaticProps + revalidate)\n- No and data is stable: Use SSG (getStaticProps)\n\nPerformance: SSG is fastest for initial load, then ISR, then SSR, then CSR.\nData freshness: CSR is freshest, then SSR, then ISR, then SSG.\n\nNext.js 13+ App Router changes:\n- Server Components render on server by default\n- Client Components use the use client directive\n- Streaming SSR with Suspense\n- No more getStaticProps or getServerSideProps — use fetch with cache options\n\nNext.js 13+ equivalent of ISR:\nasync function Page() {\n  const data = await fetch(url, { next: { revalidate: 60 } });\n  return <div>{data}</div>;\n}', 5, 0, DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Q19: Supervised vs Unsupervised
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(19, 1, 'Supervised Learning: Models learn from labeled data (input to output pairs).\n\nClassification: Predict categories. Email to Spam or Not Spam, Image to Cat or Dog. Algorithms: Random Forest, SVM, Neural Networks.\n\nRegression: Predict continuous values. Features to House Price, History to Stock Price. Algorithms: Linear Regression, Decision Trees, XGBoost.\n\nUnsupervised Learning: Models find patterns in unlabeled data (no correct answers).\n\nClustering: Group similar data. Customers to Segments (K-Means, DBSCAN), Documents to Topics.\n\nDimensionality Reduction: Reduce features. 1000 features to 50 features (PCA, t-SNE).\n\nSemi-supervised: Some labeled plus lots of unlabeled data. GPT is trained this way.\n\nSelf-supervised: Model creates its own labels from data. Example: Masking words in text and predicting them (BERT).', 6, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),

(19, 7, 'A simple analogy:\n\nSupervised = Learning with a teacher. Teacher shows you problems WITH answers. You learn the pattern and try on new problems.\n\nUnsupervised = Exploring on your own. You are given a pile of objects and asked to find something interesting. No right answers — you discover groups, patterns, anomalies.\n\nHow to choose:\n- Have labeled data: Use Supervised\n- Need to predict specific outcomes: Use Supervised\n- Want to discover hidden patterns: Use Unsupervised\n- Have very limited labels: Use Semi-supervised\n\nPopular algorithms:\n- Classification: Random Forest, XGBoost, Neural Nets\n- Regression: Linear Regression, SVR, Gradient Boosting\n- Clustering: K-Means, DBSCAN, Hierarchical\n- Dimensionality Reduction: PCA, t-SNE, UMAP\n- Anomaly Detection: Isolation Forest, Autoencoder\n\nStart with simpler models like logistic regression or random forest before jumping to deep learning!', 4, 0, DATE_SUB(NOW(), INTERVAL 2 DAY));

-- Q20: Backpropagation
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(20, 5, 'Backpropagation = computing gradients using the chain rule to update weights.\n\nSimple 2-layer network:\nInput (x) goes through W1 to Hidden (h), then through W2 to Output (y_pred), then Loss = (y_pred - y_true) squared.\n\nForward pass:\nh = sigmoid(W1 * x)\ny_pred = sigmoid(W2 * h)\nLoss = (y_pred - y_true) squared\n\nBackward pass using chain rule:\ndLoss/dW2 = dLoss/dy_pred * dy_pred/dW2\ndLoss/dW1 = dLoss/dy_pred * dy_pred/dh * dh/dW1\n\nWeight update:\nW2 = W2 - learning_rate * dLoss/dW2\nW1 = W1 - learning_rate * dLoss/dW1\n\nVanishing Gradient Problem: In deep networks, gradients get multiplied many times. If each gradient is less than 1, the product becomes tiny near input layers and early layers learn very slowly. Solutions: ReLU activation, batch normalization, residual connections (skip connections).', 9, 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),

(20, 3, 'Think of backpropagation like a blame chain:\n\n1. Final output is wrong by some amount (the loss)\n2. How much is the last layer responsible? Calculate gradient.\n3. How much is the second-to-last layer responsible? Chain rule propagates blame backward.\n4. Each layer adjusts its weights proportional to its blame.\n\nWhy chain rule? Loss depends on output, which depends on hidden, which depends on input. To know how input weights affect the loss, you chain these dependencies:\n\ndLoss/dW1 = (dLoss/dOutput) * (dOutput/dHidden) * (dHidden/dW1)\n\nEach piece is easy to compute individually!\n\nKey implementation detail: Modern frameworks like PyTorch and TensorFlow use automatic differentiation. They build a computation graph during forward pass and traverse it backward automatically. You never compute gradients by hand:\n\nloss.backward()   # PyTorch computes ALL gradients\noptimizer.step()  # Updates ALL weights', 7, 0, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Q21: Gradient Descent
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(21, 8, 'Batch Gradient Descent: Uses ALL training data per update. Smooth convergence but very slow for large datasets. Memory intensive as it loads the entire dataset.\n\nStochastic GD (SGD): Uses ONE random sample per update. Noisy but fast updates. Can escape local minima due to noise. Very fast per iteration.\n\nMini-batch GD: Uses a small batch (32-256 samples) per update. Best of both worlds. Can leverage GPU parallelism. Most commonly used in practice.\n\nAdam optimizer: Adaptive learning rate per parameter. Combines momentum (past gradients) and RMSprop (gradient magnitude). Usually works well without much tuning. Default choice for most problems.\n\nSGD vs Adam: Adam converges faster but may not generalize as well. SGD with momentum often finds better solutions with proper tuning. Research shows SGD generalizes better for computer vision. Adam is preferred for NLP and when you want something that just works.', 4, 0, DATE_SUB(NOW(), INTERVAL 7 DAY)),

(21, 1, 'Learning rate schedules are important because:\n\nToo high LR: Model overshoots the minimum, loss oscillates or diverges.\nToo low LR: Training is very slow and may get stuck in local minima.\nSolution: Start high, decrease over time!\n\nPopular schedules:\n\n1. Step decay: Reduce LR by factor every N epochs\nscheduler = StepLR(optimizer, step_size=30, gamma=0.1)\n\n2. Cosine annealing: Smoothly decrease following cosine curve\nscheduler = CosineAnnealingLR(optimizer, T_max=100)\n\n3. Warmup then decay: Start small, increase, then decrease. Used in transformer training for BERT and GPT. Prevents early instability.\n\n4. ReduceLROnPlateau: Reduce LR when metric stops improving\nscheduler = ReduceLROnPlateau(optimizer, patience=5)\n\nRecommendation: Start with Adam (lr=0.0003) and add cosine annealing. This works well for 90% of problems.', 5, 0, DATE_SUB(NOW(), INTERVAL 6 DAY));

-- Q22: Eigenvalues
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(22, 5, 'Finding eigenvalues step by step:\n\nGiven matrix A, find eigenvalues by solving: det(A - lambda*I) = 0 (characteristic equation)\n\nExample with 2x2 matrix:\nA = [[4, 2], [1, 3]]\n\nA - lambda*I = [[4-lambda, 2], [1, 3-lambda]]\n\ndet = (4-lambda)(3-lambda) - (2)(1) = 0\n    = lambda^2 - 7*lambda + 10 = 0\n    = (lambda-5)(lambda-2) = 0\n\nEigenvalues: lambda1 = 5, lambda2 = 2\n\nFinding eigenvectors: For lambda1 = 5, solve (A - 5I)v = 0\n[[-1, 2], [1, -2]] * [x, y] = [0, 0]\nThis gives x = 2y, so v1 = [2, 1]\n\nGeometric interpretation: An eigenvector is a direction that does not change under the transformation — it only scales by lambda. In PCA, the eigenvector with the largest eigenvalue represents the direction of maximum variance in the data.', 5, 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),

(22, 7, 'Why eigenvalues matter in CS and ML:\n\n1. PCA (Principal Component Analysis): Compute covariance matrix of data, find its eigenvalues and eigenvectors, top eigenvectors are principal components (most important directions), reduce dimensions while preserving maximum variance.\n\n2. Google PageRank: The web is represented as a matrix. PageRank is the dominant eigenvector of the link matrix. This is literally how Google started!\n\n3. Stability analysis: Eigenvalues of a system matrix determine stability. If all eigenvalues have negative real parts, the system is stable.\n\n4. Graph theory: Eigenvalues of adjacency matrix reveal graph properties. Spectral clustering uses eigenvectors to partition graphs.\n\nQuick computation tip: For any matrix, the sum of eigenvalues equals the trace of A, and the product of eigenvalues equals the determinant of A. This can help verify your answers!', 4, 0, DATE_SUB(NOW(), INTERVAL 4 DAY));

-- Q23: Permutation vs Combination
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(23, 6, 'Permutation (nPr): Order MATTERS. Arranging r items from n items. Formula: n! / (n-r)!\n\nCombination (nCr): Order DOES NOT matter. Choosing r items from n items. Formula: n! / (r! * (n-r)!)\n\nExample with letters A, B, C, choosing 2:\n\nPermutation (arrangements): AB, BA, AC, CA, BC, CB = 6 arrangements. 3P2 = 3! / 1! = 6\n\nCombination (selections): AB, AC, BC = 3 selections. 3C2 = 3! / (2! * 1!) = 3\n\nHow to decide:\n- How many passwords? Permutation (AB is different from BA)\n- How many committees? Combination ({A,B} is same as {B,A})\n- How many arrangements? Permutation\n- How many groups or teams? Combination\n\nWith repetition:\n- Permutation with repetition: n^r (e.g., 4-digit PIN = 10^4 = 10000)\n- Combination with repetition: (n+r-1)! / (r! * (n-1)!)', 4, 1, DATE_SUB(NOW(), INTERVAL 8 DAY)),

(23, 10, 'My trick for remembering:\n\nPermutation = Position matters (like a Password)\nCombination = Choosing a group (like a Committee)\n\nPractice problems:\n\n1. Choose 3 students from 10 for a team: Combination. 10C3 = 120\n\n2. Arrange 3 students from 10 in a line: Permutation. 10P3 = 720\n\n3. How many ways to distribute 5 identical candies to 3 kids? Combination with repetition (Stars and Bars): 7C2 = 21\n\nKey insight: Combination is always less than or equal to Permutation because combination ignores order. In fact:\nnCr = nPr / r!\n\nThis makes sense — for every combination, there are r! ways to arrange those items, giving you the permutations.', 3, 0, DATE_SUB(NOW(), INTERVAL 7 DAY));

-- Q24: Probability Distributions
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(24, 4, 'Binomial Distribution: Fixed number of trials (n), each trial is success or failure. Example: Flip a coin 10 times, how many heads? Parameters: n (trials), p (probability of success). Mean = np, Variance = np(1-p).\n\nPoisson Distribution: Events in a fixed time or space with known average rate. Example: How many emails per hour? Parameter: lambda (average rate). Mean = lambda, Variance = lambda. Use when n is large and p is small.\n\nNormal Distribution: Bell curve, symmetric around mean. Example: Heights, exam scores. Parameters: mu (mean), sigma (standard deviation). The 68-95-99.7 rule: 68% within 1 sigma, 95% within 2 sigma, 99.7% within 3 sigma.\n\nBinomial to Normal approximation: When n is large (typically n > 30) and p is not extreme (np > 5 and n(1-p) > 5), Binomial approximates Normal with mu = np and sigma = sqrt(np(1-p)).\n\nThis is the Central Limit Theorem in action!', 7, 0, DATE_SUB(NOW(), INTERVAL 2 DAY)),

(24, 1, 'When to use which — decision guide:\n\nIs the outcome yes/no with fixed trials? Use Binomial. Examples: Pass or fail on 20 exam questions, defective or good in 100 products.\n\nCounting events in continuous time or space? Use Poisson. Examples: Calls to a call center per hour, typos per page, car accidents per month.\n\nIs the variable continuous and symmetric? Use Normal. Examples: Adult heights, measurement errors, exam scores (approximately).\n\nOther useful distributions:\n- Uniform: Equal probability for all outcomes (rolling a dice)\n- Exponential: Time between events (time until next bus)\n- Geometric: Number of trials until first success\n\nPro tip for exams: Always identify:\n1. What is the random variable?\n2. Is it discrete or continuous?\n3. What are the constraints?\n\nThis usually narrows it down to one distribution immediately!', 5, 0, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Q25: PN Junction
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(25, 3, 'When P-type and N-type semiconductors are joined:\n\nWhat happens at the junction:\n1. Electrons from N diffuse to P, holes from P diffuse to N\n2. This creates ions: negative on P-side, positive on N-side\n3. These ions create an electric field, forming the depletion region (no free carriers)\n4. Eventually diffusion equals drift and equilibrium is reached with a built-in potential (~0.7V for Silicon)\n\nForward Bias (+ to P, - to N): External voltage opposes the built-in field. Depletion region shrinks. Carriers can flow and current flows! Diode is ON after ~0.7V threshold.\n\nReverse Bias (+ to N, - to P): External voltage reinforces the built-in field. Depletion region grows wider. No carriers can cross, only tiny leakage current. Diode is OFF.\n\nThis is why a diode acts as a one-way valve for current! It is the foundation for rectifiers, LEDs, solar cells, and transistors.', 6, 1, DATE_SUB(NOW(), INTERVAL 4 DAY)),

(25, 9, 'The I-V characteristic of a diode:\n\nForward region (right of 0.7V knee voltage): Current increases exponentially. Formula: I = Is * (e^(V/Vt) - 1), where Vt is approximately 26mV at room temperature.\n\nReverse region: Very small leakage current (microamps) until breakdown voltage, where current suddenly increases.\n\nApplications of the PN junction:\n- Rectifier: Convert AC to DC\n- LED: Forward biased junction emits photons when electrons recombine with holes\n- Zener diode: Operates in breakdown region for voltage regulation\n- Solar cell: Photons create electron-hole pairs at the junction\n- BJT transistor: Two PN junctions back to back\n\nThe PN junction is literally the building block of all modern electronics!', 4, 0, DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Q26: Kirchhoff Laws
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(26, 7, 'KCL (Current Law): At any node, current in = current out.\nKVL (Voltage Law): Around any closed loop, sum of voltages = 0.\n\nExample circuit: 10V source with R1=2 ohm and R2=3 ohm in series on one branch, and R3=6 ohm in parallel.\n\nUsing KCL at node A: I1 = I2 + I3 (current splits)\n\nUsing KVL for Loop 1 (through R1, R2):\n10 - I1*2 - I2*3 = 0\n\nUsing KVL for Loop 2 (through R1, R3):\n10 - I1*2 - I3*6 = 0\n\nSolve these 3 equations simultaneously for I1, I2, I3.\n\nTips for complex circuits:\n1. Label all currents with assumed direction (assume any direction)\n2. If your answer is negative, current flows opposite to what you assumed\n3. Pick independent loops (mesh analysis)\n4. Use node voltage method for circuits with many nodes', 5, 0, DATE_SUB(NOW(), INTERVAL 6 DAY)),

(26, 10, 'For circuits with dependent sources, the process is similar but you need extra equations.\n\nDependent sources have values that depend on some other voltage or current in the circuit. Example: A voltage-controlled current source with I = 2*Vx (where Vx is voltage across some component).\n\nSteps:\n1. Write KCL or KVL equations as usual\n2. Express the dependent source value using other circuit variables\n3. Substitute and solve\n\nCommon mistake: Treating dependent sources as independent. They are NOT constant — their values change with the circuit!\n\nUseful techniques for complex circuits:\n- Mesh Analysis: Write KVL for each mesh (loop without inner loops)\n- Node Voltage: Write KCL at each non-reference node\n- Superposition: For multiple sources, find contribution of each independently and add\n- Thevenin or Norton: Simplify complex circuits into single source plus resistance\n\nPick the method with fewer equations. Mesh is better for circuits with many loops, Node voltage is better for many nodes.', 3, 0, DATE_SUB(NOW(), INTERVAL 5 DAY));

-- Q27: Electromagnetic Induction
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(27, 5, 'Faraday Law: A changing magnetic flux through a loop induces an EMF (voltage).\n\nEMF = -d(Phi)/dt where Phi = magnetic flux = B * A * cos(theta)\n\nThe negative sign is Lenz Law — the induced current opposes the change that caused it. Nature resists change!\n\n3 ways to change flux:\n1. Change magnetic field strength (B)\n2. Change area of the loop (A)\n3. Change the angle (theta) between field and loop\n\nApplications:\n\nGenerator: Rotate a coil in a magnetic field. Theta changes, flux changes, EMF is induced, current flows. This is how power plants work.\n\nTransformer: AC in primary coil creates changing B which induces EMF in secondary coil.\n- Step up: More turns in secondary = higher voltage\n- Step down: Fewer turns in secondary = lower voltage\n- V1/V2 = N1/N2\n\nConnection to Maxwell Equations: Faraday law is the third Maxwell equation. A changing magnetic field creates an electric field — the basis of electromagnetic waves!', 8, 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),

(27, 9, 'Some practical examples to build intuition:\n\nExperiment 1: Move a magnet through a coil.\n- Push magnet IN: galvanometer deflects right\n- Pull magnet OUT: deflects left\n- Hold still: no deflection\n- Move FASTER: bigger deflection\nThis shows that EMF depends on the RATE of change of flux!\n\nExperiment 2: Lenz Law in action. Drop a magnet through a copper tube. It falls slower than in air because the changing flux induces currents in the tube, these currents create their own magnetic field that opposes the magnet motion. This is magnetic braking!\n\nReal-world applications:\n1. Metal detectors: Inducing currents in metal objects\n2. Induction cooking: Changing field heats the pan directly\n3. Wireless/contactless charging: Phone chargers use induction\n4. Regenerative braking: Electric cars convert kinetic energy back to electricity\n5. MRI machines: Use changing fields to image the body\n\nElectromagnetic induction is one of the most important discoveries in physics — it literally powers modern civilization!', 6, 0, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Q28: Interview Tips
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(28, 3, 'Here is my structured approach (I got offers from 2 FAANG companies):\n\nPhase 1 — Month 1-2: Build Foundation. Complete a DSA course (Striver A2Z sheet is excellent). Learn patterns, not just solutions. Topics: Arrays, Strings, Linked Lists, Trees, Graphs, DP, Backtracking.\n\nPhase 2 — Month 3-4: Grind LeetCode. 150-200 problems is a good target. Do topic-wise first, then random. Focus on Medium difficulty (most interview questions). Always try for 20-30 minutes before seeing the solution.\n\nPhase 3 — Month 5: System Design and Behavioral. For SDE-1: Basic system design is enough (URL shortener, chat app). For SDE-2+: Deep system design knowledge required. Read Designing Data-Intensive Applications.\n\nInterview day tips:\n1. Think out loud — interviewers want to see your thought process\n2. Start with brute force, then optimize\n3. Ask clarifying questions\n4. Test with edge cases\n5. Do mock interviews (Pramp is free)\n\nResources: NeetCode 150, Blind 75, Striver SDE Sheet', 14, 0, DATE_SUB(NOW(), INTERVAL 1 DAY)),

(28, 10, 'Often-overlooked advice:\n\nDo not just solve — understand the pattern. After solving a problem ask: What pattern does this use (sliding window, two pointers, BFS, etc.)? What similar problems use the same pattern? Can I solve it differently?\n\nTime distribution for SDE-1:\n- 60% DSA\n- 20% OS, DBMS, CN fundamentals\n- 10% System Design basics\n- 10% Behavioral and Projects\n\nCommon mistakes:\n1. Solving 500+ problems without understanding patterns (quantity does not equal quality)\n2. Ignoring behavioral rounds (they can reject you!)\n3. Not practicing explaining your code out loud\n4. Memorizing solutions instead of approaches\n5. Neglecting time complexity analysis\n\nResume tips:\n- List 2-3 strong projects with measurable impact\n- Include technologies used\n- Quantify results: Reduced load time by 40%\n\nPlatforms: LeetCode (must), Codeforces (for CP), InterviewBit, GFG\n\nRemember: Consistency beats intensity. 1 hour daily is better than 10 hours on weekends.', 11, 0, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Q29: Time Management
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(29, 1, 'Here is what worked for me:\n\nDaily Schedule (during semester):\n- 6:00-7:00 AM: 1 hour CP (fresh mind = better problem solving)\n- College hours: Focus on classes, take good notes\n- 4:00-5:30 PM: College assignments\n- 7:00-8:30 PM: CP practice or contests\n\nKey principles:\n1. Quality over Quantity: 1 hour of focused practice is better than 3 hours of unfocused grind\n2. Never skip a day: Even 30 minutes counts\n3. Batch college work: Do assignments in one sitting, do not spread across the day\n4. Use travel time: Read editorials or solutions on your phone\n5. Weekend deep dives: 3-4 hours on weekends for contests and learning new topics\n\nDuring exams: Reduce CP to 30 min per day just to maintain streak. Focus entirely on exams 3 days before.\n\nVacation = Golden period: 4-5 hours CP daily, participate in virtually every contest, learn new algorithms and data structures.\n\nPlatforms for beginners: Codeforces (Div 2 A-B), CSES Problem Set, AtCoder Beginner Contests', 8, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),

(29, 5, 'The most important advice: Avoid comparison and burnout.\n\nI made the mistake of trying to do everything and burned out in 2nd year. Here is what I learned:\n\nPrioritize ruthlessly:\n1. College GPA matters for placements — do not let it drop below 8.0\n2. CP is great but not the only path — strong projects work too\n3. Pick ONE competitive platform and stick with it\n\nProductivity hacks:\n- Use the Pomodoro technique (25 min focus + 5 min break)\n- Block distracting websites during study time\n- Keep a solved problems journal — reviewing past solutions is underrated\n- Join a study group — accountability helps\n\nIf you are a beginner in CP:\n1. Start with HackerRank (easiest)\n2. Move to CodeChef Long Challenges\n3. Then Codeforces Div 3 and Div 2\n4. LeetCode for interview prep\n\nDo not forget to:\n- Exercise regularly (even 20 min walk)\n- Sleep 7+ hours (sleep-deprived problem solving is useless)\n- Have fun — this should be enjoyable, not torture\n\nBalance is a skill. You will get better at it over time.', 7, 0, DATE_SUB(NOW(), INTERVAL 2 DAY));

-- Q30: Open Source
INSERT INTO answers (question_id, user_id, body, vote_score, is_accepted, created_at) VALUES
(30, 2, 'Here is how I started contributing to open source:\n\nStep 1: Find beginner-friendly projects. Search GitHub for label:"good first issue" with your preferred language. Check sites like goodfirstissue.dev and up-for-grabs.net. Look for projects you actually USE for motivation!\n\nStep 2: Understand the project. Read the README and CONTRIBUTING.md. Set up the project locally. Read existing code and understand the structure. Join their Discord or Slack community.\n\nStep 3: Start small. Fix typos in documentation, add missing tests, fix small bugs labeled good first issue, improve error messages.\n\nBeginner-friendly JS and Python projects:\n- freeCodeCamp: Always has good first issues\n- EddieHub: Community specifically for beginners\n- First Contributions: Practice repo for learning Git\n- Python projects: Matplotlib, Pandas have good first issues\n- 30-seconds-of-code: Short JS snippets\n\nSubmitting your first PR:\n1. Fork, Clone, create a Branch, Make changes, Push, Open PR\n2. Write a clear description of what you changed and why\n3. Be patient — maintainers are volunteers', 10, 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),

(30, 8, 'Extra tips from my experience:\n\nGood first issue explained: Maintainers tag simple issues as good first issue to invite newcomers. These usually involve documentation improvements, adding unit tests, fixing linting warnings, small feature additions, or translation work.\n\nEtiquette:\n1. Comment on the issue BEFORE starting work saying you would like to work on it\n2. Do not claim issues you will not work on\n3. Ask questions if you are stuck — maintainers expect it from newcomers\n4. Follow the project coding style\n5. Write good commit messages\n\nHidden benefits of open source:\n- Looks great on your resume\n- Learn real-world coding practices (code review, CI/CD, testing)\n- Build your network\n- GSoC (Google Summer of Code) — paid to contribute!\n\nPrograms for students:\n- Hacktoberfest (October): Make 4 PRs, get swag\n- GSoC: 3-month paid program with mentorship\n- GirlScript Summer of Code: Indian students focused\n- MLH Fellowship: Work on open source full-time\n\nStart with 1 contribution. The first one is the hardest!', 9, 0, DATE_SUB(NOW(), INTERVAL 4 DAY));


-- ═════════════════════════════════════════════
-- 5. VOTES
-- ═════════════════════════════════════════════
INSERT INTO votes (user_id, target_type, target_id, vote_type) VALUES
(2, 'question', 1, 'up'), (4, 'question', 1, 'up'), (6, 'question', 1, 'up'),
(1, 'question', 5, 'up'), (3, 'question', 5, 'up'),
(5, 'question', 10, 'up'), (7, 'question', 10, 'up'),
(1, 'question', 14, 'up'), (3, 'question', 14, 'up'), (9, 'question', 14, 'up'),
(2, 'question', 28, 'up'), (4, 'question', 28, 'up'), (6, 'question', 28, 'up'), (8, 'question', 28, 'up'),
(1, 'answer', 1, 'up'), (2, 'answer', 1, 'up'), (4, 'answer', 1, 'up'),
(3, 'answer', 5, 'up'), (5, 'answer', 5, 'up'),
(2, 'answer', 19, 'up'), (4, 'answer', 19, 'up'),
(1, 'answer', 27, 'up'), (6, 'answer', 27, 'up'), (8, 'answer', 27, 'up');


-- ═════════════════════════════════════════════
-- Done! Your database is now populated with
-- 10 users, 30 questions (3 per subject),
-- 60 answers, tags, and votes
-- ═════════════════════════════════════════════