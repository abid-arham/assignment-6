import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { GRADE_POINTS } from "../src/modules/grades/gradePoints.js";

const prisma = new PrismaClient();

// Idempotent: everything is an upsert keyed on a natural unique column, and existing rows are
// left as they are (only empty course descriptions and placeholder student names are filled in).

const DEPARTMENTS = [
  { code: "CSE", name: "Computer Science & Engineering" },
  { code: "EEE", name: "Electrical & Electronic Engineering" },
  { code: "MAT", name: "Mathematics" },
  { code: "BBA", name: "Business Administration" },
];

const INSTRUCTORS = [
  { email: "instructor1@ums.demo", name: "Dr. Rahman", dept: "CSE" },
  { email: "instructor2@ums.demo", name: "Dr. Khan", dept: "EEE" },
  { email: "instructor3@ums.demo", name: "Dr. Nusrat Jahan", dept: "MAT" },
  { email: "instructor4@ums.demo", name: "Prof. Tanvir Ahmed", dept: "BBA" },
];

const STUDENTS = [
  { n: 1, name: "Ayesha Siddiqua", dept: "CSE" },
  { n: 2, name: "Rafiul Islam", dept: "CSE" },
  { n: 3, name: "Nabila Chowdhury", dept: "CSE" },
  { n: 4, name: "Tahmid Hasan", dept: "CSE" },
  { n: 5, name: "Farhan Kabir", dept: "CSE" },
  { n: 6, name: "Sadia Afrin", dept: "EEE" },
  { n: 7, name: "Imran Hossain", dept: "BBA" },
  { n: 8, name: "Maliha Rahman", dept: "MAT" },
  { n: 9, name: "Zarif Ahmed", dept: "CSE" },
  { n: 10, name: "Lamia Akter", dept: "BBA" },
];

const COURSES: { code: string; title: string; credits: number; dept: string; description: string; prereqs?: string[] }[] = [
  { code: "CSE101", title: "Introduction to Programming", credits: 3, dept: "CSE", description: "Problem solving with Python: variables, control flow, functions, lists and dictionaries, file I/O and debugging habits. Weekly programming assignments build toward a small final project." },
  { code: "CSE110L", title: "Programming Lab", credits: 1, dept: "CSE", description: "Hands-on companion lab for CSE101. Students work with version control, the command line and a code editor while completing guided exercises under supervision." },
  { code: "CSE201", title: "Data Structures", credits: 3, dept: "CSE", description: "Arrays, linked lists, stacks, queues, hash tables, trees and heaps, with complexity analysis of their operations. Implementation projects emphasise choosing the right structure for a problem.", prereqs: ["CSE101"] },
  { code: "CSE220", title: "Database Systems", credits: 3, dept: "CSE", description: "Relational modelling, SQL, normalisation, indexing and transactions. Students design and query a PostgreSQL schema for a realistic application.", prereqs: ["CSE201"] },
  { code: "CSE301", title: "Algorithms", credits: 3, dept: "CSE", description: "Divide and conquer, greedy methods, dynamic programming and graph algorithms, with proofs of correctness and running-time analysis.", prereqs: ["CSE201"] },
  { code: "CSE310", title: "Operating Systems", credits: 3, dept: "CSE", description: "Processes and threads, scheduling, synchronisation, memory management, file systems and virtualisation, explored through C programming labs.", prereqs: ["CSE201"] },
  { code: "EEE101", title: "Circuit Theory", credits: 3, dept: "EEE", description: "Ohm's and Kirchhoff's laws, network theorems, transient and steady-state AC analysis, and power in single-phase circuits." },
  { code: "EEE201", title: "Electronics I", credits: 3, dept: "EEE", description: "Semiconductor physics, diodes, BJTs and MOSFETs, small-signal models and single-stage amplifier design with lab measurements.", prereqs: ["EEE101"] },
  { code: "EEE210", title: "Signals and Systems", credits: 3, dept: "EEE", description: "Continuous and discrete signals, LTI systems, convolution, Fourier series and transforms, and an introduction to the Laplace and Z transforms.", prereqs: ["EEE101", "MAT201"] },
  { code: "MAT101", title: "Calculus I", credits: 3, dept: "MAT", description: "Limits, derivatives and their applications, integrals and the fundamental theorem of calculus, with modelling problems from science and engineering." },
  { code: "MAT201", title: "Linear Algebra", credits: 3, dept: "MAT", description: "Systems of linear equations, matrices, vector spaces, linear transformations, eigenvalues and orthogonality, with computational exercises.", prereqs: ["MAT101"] },
  { code: "MAT210", title: "Probability and Statistics", credits: 3, dept: "MAT", description: "Probability models, random variables, common distributions, sampling, estimation and hypothesis testing applied to real data sets.", prereqs: ["MAT101"] },
  { code: "BBA101", title: "Principles of Management", credits: 3, dept: "BBA", description: "Planning, organising, leading and controlling in modern organisations, studied through case discussions of local and global firms." },
  { code: "BBA201", title: "Financial Accounting", credits: 3, dept: "BBA", description: "The accounting cycle, preparing and reading financial statements, and the measurement of assets, liabilities and equity.", prereqs: ["BBA101"] },
  { code: "BBA210", title: "Business Communication", credits: 2, dept: "BBA", description: "Professional writing, presentations and meeting skills, including reports, proposals and persuasive messages for business audiences." },
];

const SEMESTERS = [
  { name: "Spring 2026", start: "2026-01-10", end: "2026-05-20", open: false, tuition: 45 },
  { name: "Fall 2026", start: "2026-09-01", end: "2026-12-20", open: true, tuition: 50 },
  { name: "Spring 2027", start: "2027-01-10", end: "2027-05-20", open: false, tuition: 55 },
];

// [semester, course, section, instructor email, capacity]
const SECTIONS: [string, string, string, string, number][] = [
  ["Spring 2026", "CSE101", "A", "instructor1@ums.demo", 40],
  ["Spring 2026", "CSE110L", "A", "instructor1@ums.demo", 30],
  ["Spring 2026", "MAT101", "A", "instructor3@ums.demo", 40],
  ["Spring 2026", "EEE101", "A", "instructor2@ums.demo", 40],
  ["Spring 2026", "BBA101", "A", "instructor4@ums.demo", 40],

  ["Fall 2026", "CSE101", "A", "instructor1@ums.demo", 3], // small on purpose — demos the "section full" 409
  ["Fall 2026", "CSE101", "B", "instructor1@ums.demo", 40],
  ["Fall 2026", "CSE110L", "B", "instructor1@ums.demo", 25],
  ["Fall 2026", "CSE201", "A", "instructor1@ums.demo", 30],
  ["Fall 2026", "CSE220", "A", "instructor1@ums.demo", 35],
  ["Fall 2026", "CSE301", "A", "instructor1@ums.demo", 30],
  ["Fall 2026", "EEE101", "A", "instructor2@ums.demo", 30],
  ["Fall 2026", "EEE201", "A", "instructor2@ums.demo", 30],
  ["Fall 2026", "MAT101", "A", "instructor3@ums.demo", 40],
  ["Fall 2026", "MAT201", "A", "instructor3@ums.demo", 40],
  ["Fall 2026", "MAT210", "A", "instructor3@ums.demo", 40],
  ["Fall 2026", "BBA101", "A", "instructor4@ums.demo", 45],
  ["Fall 2026", "BBA201", "A", "instructor4@ums.demo", 45],
  ["Fall 2026", "BBA210", "A", "instructor4@ums.demo", 45],

  ["Spring 2027", "CSE301", "A", "instructor1@ums.demo", 30],
  ["Spring 2027", "CSE310", "A", "instructor1@ums.demo", 30],
  ["Spring 2027", "EEE210", "A", "instructor2@ums.demo", 30],
  ["Spring 2027", "MAT201", "B", "instructor3@ums.demo", 40],
];

// Spring 2026 is finished: graded (COMPLETED) attempts. Student 5 fails CSE101 and retakes it in Fall.
const PAST_GRADES: Record<number, [string, string][]> = {
  1: [["CSE101", "A"], ["MAT101", "A-"], ["CSE110L", "A+"], ["BBA101", "B+"]],
  2: [["CSE101", "B+"], ["MAT101", "B"], ["CSE110L", "A"]],
  3: [["CSE101", "A-"], ["MAT101", "B+"], ["EEE101", "B"]],
  4: [["CSE101", "C+"], ["MAT101", "C"], ["CSE110L", "B-"]],
  5: [["CSE101", "F"], ["MAT101", "D"], ["CSE110L", "C"]],
  6: [["EEE101", "A"], ["MAT101", "B+"]],
  7: [["BBA101", "A-"], ["MAT101", "B-"]],
  8: [["MAT101", "A+"], ["CSE101", "B"]],
};

// Fall 2026 is in progress: active (ENROLLED) registrations, all with prerequisites met.
const CURRENT: Record<number, string[]> = {
  1: ["CSE201-A"],
  2: ["CSE201-A", "MAT201-A", "MAT210-A"],
  3: ["CSE201-A", "EEE201-A", "MAT210-A"],
  4: ["CSE201-A", "MAT201-A"],
  5: ["CSE101-B", "BBA210-A"],
  6: ["EEE201-A", "MAT201-A"],
  7: ["BBA201-A", "BBA210-A"],
  8: ["CSE201-A", "MAT201-A"],
  9: ["CSE101-B", "MAT101-A"],
  10: ["BBA101-A", "MAT101-A"],
};

async function main() {
  const passwordHash = await bcrypt.hash("Passw0rd!", 10);

  const dept: Record<string, string> = {};
  for (const d of DEPARTMENTS) {
    dept[d.code] = (await prisma.department.upsert({ where: { code: d.code }, update: {}, create: d })).id;
  }

  await prisma.user.upsert({
    where: { email: "admin@ums.demo" },
    update: {},
    create: { name: "Demo Admin", email: "admin@ums.demo", passwordHash, role: "ADMIN" },
  });

  const user: Record<string, string> = {};
  for (const i of INSTRUCTORS) {
    user[i.email] = (
      await prisma.user.upsert({
        where: { email: i.email },
        update: {},
        create: { name: i.name, email: i.email, passwordHash, role: "INSTRUCTOR", departmentId: dept[i.dept] },
      })
    ).id;
  }

  for (const s of STUDENTS) {
    const email = `student${s.n}@ums.demo`;
    const existing = await prisma.user.findUnique({ where: { email } });
    const student = await prisma.user.upsert({
      where: { email },
      // The original seed named them "Student N"; give those real names, keep anything a user changed.
      update: existing && /^Student \d+$/.test(existing.name) ? { name: s.name } : {},
      create: {
        name: s.name,
        email,
        passwordHash,
        role: "STUDENT",
        studentCode: `2026-${s.dept}-${String(s.n).padStart(3, "0")}`,
        departmentId: dept[s.dept],
      },
    });
    user[`student${s.n}`] = student.id;
  }

  const course: Record<string, string> = {};
  for (const c of COURSES) {
    const existing = await prisma.course.findUnique({ where: { code: c.code } });
    course[c.code] = (
      await prisma.course.upsert({
        where: { code: c.code },
        update: existing && !existing.description ? { description: c.description } : {},
        create: { code: c.code, title: c.title, credits: c.credits, description: c.description, departmentId: dept[c.dept]! },
      })
    ).id;
  }
  for (const c of COURSES) {
    for (const p of c.prereqs ?? []) {
      const key = { courseId: course[c.code]!, prerequisiteId: course[p]! };
      await prisma.coursePrerequisite.upsert({ where: { courseId_prerequisiteId: key }, update: {}, create: key });
    }
  }

  const semester: Record<string, string> = {};
  for (const s of SEMESTERS) {
    semester[s.name] = (
      await prisma.semester.upsert({
        where: { name: s.name },
        update: {},
        create: {
          name: s.name,
          startDate: new Date(s.start),
          endDate: new Date(s.end),
          enrollmentOpen: s.open,
          tuitionPerCredit: s.tuition,
        },
      })
    ).id;
  }

  const section: Record<string, string> = {}; // "Fall 2026|CSE201-A" -> id
  for (const [sem, code, sectionCode, instructor, capacity] of SECTIONS) {
    const key = { courseId: course[code]!, semesterId: semester[sem]!, sectionCode };
    section[`${sem}|${code}-${sectionCode}`] = (
      await prisma.section.upsert({
        where: { courseId_semesterId_sectionCode: key },
        update: {},
        create: { ...key, instructorId: user[instructor]!, capacity },
      })
    ).id;
  }

  const enroll = (n: number, sectionKey: string, data: { status: "ENROLLED" | "COMPLETED"; grade?: string; enrolledAt: Date }) => {
    const studentId = user[`student${n}`]!;
    const sectionId = section[sectionKey]!;
    return prisma.enrollment.upsert({
      where: { studentId_sectionId: { studentId, sectionId } },
      update: {},
      create: {
        studentId,
        sectionId,
        status: data.status,
        grade: data.grade ?? null,
        gradePoint: data.grade ? GRADE_POINTS[data.grade]! : null,
        enrolledAt: data.enrolledAt,
      },
    });
  };

  for (const [n, grades] of Object.entries(PAST_GRADES)) {
    for (const [code, grade] of grades) {
      await enroll(Number(n), `Spring 2026|${code}-A`, { status: "COMPLETED", grade, enrolledAt: new Date("2026-01-12") });
    }
  }
  for (const [n, sections] of Object.entries(CURRENT)) {
    for (const s of sections) {
      await enroll(Number(n), `Fall 2026|${s}`, { status: "ENROLLED", enrolledAt: new Date("2026-08-25") });
    }
  }

  // enrolledCount must equal the seats actually taken (enrolment increments it, grading doesn't release it).
  await prisma.$executeRaw`
    UPDATE "Section" s SET "enrolledCount" = (
      SELECT COUNT(*) FROM "Enrollment" e
      WHERE e."sectionId" = s.id AND e.status IN ('ENROLLED', 'COMPLETED')
    )`;

  console.log("Seed complete:", {
    departments: DEPARTMENTS.length,
    instructors: INSTRUCTORS.length,
    students: STUDENTS.length,
    courses: COURSES.length,
    semesters: SEMESTERS.map((s) => s.name),
    sections: SECTIONS.length,
  });
  console.log("Demo accounts: admin@ums.demo, instructor1@ums.demo, student1@ums.demo — password Passw0rd!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
