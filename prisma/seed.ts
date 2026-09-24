import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Passw0rd!", 10);

  // ── Departments ──────────────────────────────────────────────
  const cse = await prisma.department.upsert({
    where: { code: "CSE" },
    update: {},
    create: { name: "Computer Science & Engineering", code: "CSE" },
  });

  const eee = await prisma.department.upsert({
    where: { code: "EEE" },
    update: {},
    create: { name: "Electrical & Electronic Engineering", code: "EEE" },
  });

  // ── Admin ────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@ums.demo" },
    update: {},
    create: {
      name: "Demo Admin",
      email: "admin@ums.demo",
      passwordHash,
      role: "ADMIN",
    },
  });

  // ── Instructors ──────────────────────────────────────────────
  const instructor1 = await prisma.user.upsert({
    where: { email: "instructor1@ums.demo" },
    update: {},
    create: {
      name: "Dr. Rahman",
      email: "instructor1@ums.demo",
      passwordHash,
      role: "INSTRUCTOR",
      departmentId: cse.id,
    },
  });

  const instructor2 = await prisma.user.upsert({
    where: { email: "instructor2@ums.demo" },
    update: {},
    create: {
      name: "Dr. Khan",
      email: "instructor2@ums.demo",
      passwordHash,
      role: "INSTRUCTOR",
      departmentId: eee.id,
    },
  });

  // ── Students ─────────────────────────────────────────────────
  const students = [];
  for (let i = 1; i <= 5; i++) {
    const student = await prisma.user.upsert({
      where: { email: `student${i}@ums.demo` },
      update: {},
      create: {
        name: `Student ${i}`,
        email: `student${i}@ums.demo`,
        passwordHash,
        role: "STUDENT",
        studentCode: `2026-CSE-${String(i).padStart(3, "0")}`,
        departmentId: cse.id,
      },
    });
    students.push(student);
  }

  // ── Courses ──────────────────────────────────────────────────
  const cs101 = await prisma.course.upsert({
    where: { code: "CSE101" },
    update: {},
    create: {
      code: "CSE101",
      title: "Introduction to Programming",
      credits: 3,
      departmentId: cse.id,
    },
  });

  const cs201 = await prisma.course.upsert({
    where: { code: "CSE201" },
    update: {},
    create: {
      code: "CSE201",
      title: "Data Structures",
      credits: 3,
      departmentId: cse.id,
    },
  });

  const cs301 = await prisma.course.upsert({
    where: { code: "CSE301" },
    update: {},
    create: {
      code: "CSE301",
      title: "Algorithms",
      credits: 3,
      departmentId: cse.id,
    },
  });

  const eee101 = await prisma.course.upsert({
    where: { code: "EEE101" },
    update: {},
    create: {
      code: "EEE101",
      title: "Circuit Theory",
      credits: 3,
      departmentId: eee.id,
    },
  });

  // CSE201 requires CSE101; CSE301 requires CSE201
  await prisma.coursePrerequisite.upsert({
    where: { courseId_prerequisiteId: { courseId: cs201.id, prerequisiteId: cs101.id } },
    update: {},
    create: { courseId: cs201.id, prerequisiteId: cs101.id },
  });

  await prisma.coursePrerequisite.upsert({
    where: { courseId_prerequisiteId: { courseId: cs301.id, prerequisiteId: cs201.id } },
    update: {},
    create: { courseId: cs301.id, prerequisiteId: cs201.id },
  });

  // ── Semester ─────────────────────────────────────────────────
  const semester = await prisma.semester.upsert({
    where: { name: "Fall 2026" },
    update: {},
    create: {
      name: "Fall 2026",
      startDate: new Date("2026-09-01"),
      endDate: new Date("2026-12-20"),
      enrollmentOpen: true,
      tuitionPerCredit: 50.0,
    },
  });

  // ── Sections ─────────────────────────────────────────────────
  const section101A = await prisma.section.upsert({
    where: {
      courseId_semesterId_sectionCode: {
        courseId: cs101.id,
        semesterId: semester.id,
        sectionCode: "A",
      },
    },
    update: {},
    create: {
      courseId: cs101.id,
      semesterId: semester.id,
      instructorId: instructor1.id,
      sectionCode: "A",
      capacity: 3, // small on purpose — lets you demo the "section full" 409 quickly
    },
  });

  const section201A = await prisma.section.upsert({
    where: {
      courseId_semesterId_sectionCode: {
        courseId: cs201.id,
        semesterId: semester.id,
        sectionCode: "A",
      },
    },
    update: {},
    create: {
      courseId: cs201.id,
      semesterId: semester.id,
      instructorId: instructor1.id,
      sectionCode: "A",
      capacity: 30,
    },
  });

  const sectionEEE101A = await prisma.section.upsert({
    where: {
      courseId_semesterId_sectionCode: {
        courseId: eee101.id,
        semesterId: semester.id,
        sectionCode: "A",
      },
    },
    update: {},
    create: {
      courseId: eee101.id,
      semesterId: semester.id,
      instructorId: instructor2.id,
      sectionCode: "A",
      capacity: 30,
    },
  });

  console.log("Seed complete:");
  console.log({
    admin: admin.email,
    instructors: [instructor1.email, instructor2.email],
    students: students.map((s) => s.email),
    departments: [cse.code, eee.code],
    courses: [cs101.code, cs201.code, cs301.code, eee101.code],
    semester: semester.name,
    sections: [section101A.sectionCode, section201A.sectionCode, sectionEEE101A.sectionCode],
  });
  console.log("All demo accounts use password: Passw0rd!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });