import { scoreCompanyForStudent, scoreStudentForCompany } from "@/lib/scoring";

describe("scoring", () => {
  it("ranks better overlap higher", () => {
    const student = {
      id: "student1",
      userId: "user1",
      name: "Student",
      location: "Austin",
      followerCount: 12000,
      tags: ["basketball", "fitness"],
      categories: ["sports"],
      niches: ["basketball"]
    };

    const goodCompany = {
      id: "company1",
      userId: "user2",
      companyName: "Good Co",
      location: "Austin",
      minBudget: 1000,
      maxBudget: 4000,
      tagsWanted: ["basketball", "fitness"],
      preferredPlatforms: ["Instagram"],
      dealTypes: ["sports"]
    };

    const weakCompany = {
      ...goodCompany,
      id: "company2",
      tagsWanted: ["fashion"],
      dealTypes: ["fashion"]
    };

    expect(scoreCompanyForStudent(student, goodCompany)).toBeGreaterThan(scoreCompanyForStudent(student, weakCompany));
    expect(scoreStudentForCompany(goodCompany, student)).toBeGreaterThan(scoreStudentForCompany(weakCompany, student));
  });
});
