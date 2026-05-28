// CareerCompass — Matching Algorithm
// Pure module: no DOM, no global state, no random, no date dependencies

(function () {
  /**
   * Mapping of career goals to generalized competency tags.
   * Used for the career goal bonus modifier.
   */
  const CAREER_GOAL_COMPETENCIES = {
    "business":    ["strategic", "quantitative", "creative"],
    "health":      ["caring", "interpersonal", "investigative"],
    "statistics":  ["quantitative", "systematic", "investigative"],
    "tech":        ["technical", "systematic", "strategic"],
    "teaching":    ["interpersonal", "creative", "caring"]
  };

  /**
   * Translation map from generalized user tags to course-level tags.
   * Each generalized tag maps to 1-2 course tags for scoring.
   */
  const TAG_TRANSLATION = {
    "quantitative":  ["analytical", "research"],
    "interpersonal": ["communication", "leadership"],
    "strategic":     ["leadership", "analytical"],
    "investigative": ["research", "writing"],
    "technical":     ["technical", "security"],
    "creative":      ["design", "writing"],
    "caring":        ["communication", "research"],
    "systematic":    ["analytical", "technical"]
  };

  /**
   * Calculates competency score for a program based on user competencies.
   * Translates generalized user tags to course-level tags before matching.
   *
   * @param {string[]} userCompetencies - User's generalized competency tags
   * @param {object} program - Program with requiredCourses array
   * @param {object} coursesMap - Map of courseId → course object
   * @returns {number} Score 0-100
   */
  function competencyScore(userCompetencies, program, coursesMap) {
    const programTags = [];
    for (const courseId of program.requiredCourses) {
      const course = coursesMap[courseId];
      if (course?.competencyTags) {
        programTags.push(...course.competencyTags);
      }
    }

    const totalTags = programTags.length;
    if (totalTags === 0) return 0;

    // Translate generalized user tags to course-level tags
    const translatedUserTags = new Set();
    for (const tag of userCompetencies) {
      const courseTags = TAG_TRANSLATION[tag];
      if (courseTags) {
        for (const ct of courseTags) {
          translatedUserTags.add(ct);
        }
      }
    }

    const matchingTags = programTags.filter(tag =>
      translatedUserTags.has(tag)
    ).length;

    return Math.round((matchingTags / totalTags) * 100);
  }

  /**
   * Returns type bonus: 100 if types match or user chose "both", 0 otherwise.
   */
  function typeBonus(userType, programType) {
    if (userType === "both") return 100;
    return userType === programType ? 100 : 0;
  }

  /**
   * Maps user-facing college values to the local data's college field values.
   */
  const SCHOOL_TO_COLLEGE = {
    "Technology": "College of IT",
    "Business": "College of Business",
    "Health Professions": "College of Health",
    "Education": "College of Education",
    "Liberal Arts": "College of Liberal Arts",
    "College of IT": "College of IT",
    "College of Business": "College of Business",
    "College of Health": "College of Health",
    "College of Education": "College of Education",
    "College of Liberal Arts": "College of Liberal Arts"
  };

  /**
   * Returns college bonus: 100 if match, 50 if "none", 0 otherwise.
   */
  function collegeBonus(userCollege, programCollege) {
    if (userCollege === "none") return 50;
    var mappedCollege = SCHOOL_TO_COLLEGE[userCollege] || userCollege;
    return mappedCollege === programCollege ? 100 : 0;
  }

  /**
   * Calculates difficulty modifier based on ratio of matching courses.
   * Scale: -5 to +10.
   */
  function difficultyModifier(userDifficulty, program, coursesMap) {
    if (userDifficulty === "none") return 0;

    const difficulties = [];
    for (const courseId of program.requiredCourses) {
      const course = coursesMap[courseId];
      if (course) {
        difficulties.push(course.difficulty);
      }
    }

    if (difficulties.length === 0) return 0;

    const matchCount = difficulties.filter(d => d === userDifficulty).length;
    const ratio = matchCount / difficulties.length;

    return Math.round((ratio * 15) - 5);
  }

  /**
   * Calculates career goal bonus.
   * Returns +5 if ≥2 of the career goal's competencies (translated to course tags)
   * overlap with the program's competency profile, 0 otherwise.
   */
  function careerGoalBonus(careerGoal, program, coursesMap) {
    const goalCompetencies = CAREER_GOAL_COMPETENCIES[careerGoal];
    if (!goalCompetencies) return 0;

    // Build set of unique competency tags from program's required courses
    const programTagSet = {};
    for (const courseId of program.requiredCourses) {
      const course = coursesMap[courseId];
      if (course?.competencyTags) {
        for (const tag of course.competencyTags) {
          programTagSet[tag] = true;
        }
      }
    }

    // Translate goal competencies to course-level tags and count overlaps
    let overlap = 0;
    for (const comp of goalCompetencies) {
      const courseTags = TAG_TRANSLATION[comp];
      if (courseTags) {
        for (const ct of courseTags) {
          if (programTagSet[ct]) {
            overlap++;
            break; // Count each goal competency at most once
          }
        }
      }
    }

    return overlap >= 2 ? 5 : 0;
  }

  /**
   * Calculates Match_Scores for all programs based on user profile.
   * Pure function: same inputs → same outputs.
   */
  function calculateScores(profile, programs, courses) {
    if (!profile || !Array.isArray(profile.competencies) || !profile.programType || !profile.college) {
      throw new Error('Invalid profile: missing required fields');
    }
    if (!Array.isArray(programs) || !Array.isArray(courses)) {
      throw new Error('Invalid data: programs and courses must be arrays');
    }

    const coursesMap = {};
    for (const course of courses) {
      coursesMap[course.courseId] = course;
    }

    const results = [];
    for (const program of programs) {
      const compScore = competencyScore(profile.competencies, program, coursesMap);
      const typeBon = typeBonus(profile.programType, program.type);
      const collegeBon = collegeBonus(profile.college, program.college);
      const diffMod = difficultyModifier(profile.difficulty, program, coursesMap);
      const careerMod = careerGoalBonus(profile.careerGoal, program, coursesMap);

      const base = (compScore * 0.60) + (typeBon * 0.20) + (collegeBon * 0.20);
      const finalScore = Math.max(0, Math.min(100, Math.round(base + diffMod + careerMod)));

      results.push({
        programId: program.programId,
        programName: program.name,
        college: program.college,
        type: program.type,
        description: program.description,
        minimumCredits: program.minimumCredits,
        requiredCoursesCount: program.requiredCourses.length,
        matchScore: finalScore,
        competencyScore: compScore,
        typeBonus: typeBon,
        collegeBonus: collegeBon
      });
    }

    results.sort((a, b) => b.matchScore - a.matchScore);
    return results;
  }

  // Expose on global namespace
  window.CareerCompass = window.CareerCompass || {};
  window.CareerCompass.Matching = { calculateScores };
})();
