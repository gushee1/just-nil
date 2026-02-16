export type DiscoveryStudent = {
  id: string;
  userId: string;
  name: string;
  location?: string | null;
  followerCount: number;
  tags: string[];
  categories: string[];
  niches: string[];
};

export type DiscoveryCompany = {
  id: string;
  userId: string;
  companyName: string;
  location?: string | null;
  minBudget?: number | null;
  maxBudget?: number | null;
  tagsWanted: string[];
  preferredPlatforms: string[];
  dealTypes: string[];
};

export function overlapScore(a: string[], b: string[]) {
  const left = new Set(a.map((value) => value.toLowerCase()));
  let score = 0;
  for (const value of b) {
    if (left.has(value.toLowerCase())) {
      score += 1;
    }
  }
  return score;
}

export function scoreCompanyForStudent(student: DiscoveryStudent, company: DiscoveryCompany) {
  let score = 0;

  score += overlapScore(student.tags, company.tagsWanted) * 5;
  score += overlapScore(student.niches, company.tagsWanted) * 3;
  score += overlapScore(student.categories, company.dealTypes) * 2;

  if (student.location && company.location && student.location.toLowerCase() === company.location.toLowerCase()) {
    score += 4;
  }

  if (company.maxBudget && company.maxBudget >= 1000) {
    score += 2;
  }

  return score;
}

export function scoreStudentForCompany(company: DiscoveryCompany, student: DiscoveryStudent) {
  let score = scoreCompanyForStudent(student, company);

  if (student.followerCount >= 10000) {
    score += 4;
  } else if (student.followerCount >= 3000) {
    score += 2;
  }

  return score;
}
