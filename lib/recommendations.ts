import { CompanyProfile, StudentProfile } from "@prisma/client";

function splitTags(tags: string) {
  return tags
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
}

function overlap(a: string[], b: string[]) {
  const set = new Set(a);
  return b.reduce((score, tag) => score + (set.has(tag) ? 1 : 0), 0);
}

export function rankCompaniesForStudent<T extends CompanyProfile>(student: StudentProfile, companies: T[]) {
  const studentTags = splitTags(student.tags);

  return companies
    .map((company) => {
      const score = overlap(studentTags, splitTags(company.targetTags));
      return { company, score };
    })
    .sort((a, b) => b.score - a.score);
}

export function rankStudentsForCompany<T extends StudentProfile>(company: CompanyProfile, students: T[]) {
  const targetTags = splitTags(company.targetTags);

  return students
    .map((student) => {
      const score = overlap(targetTags, splitTags(student.tags));
      return { student, score };
    })
    .sort((a, b) => b.score - a.score);
}
