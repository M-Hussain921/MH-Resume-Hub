const ACTION_VERBS = [
  'developed', 'built', 'created', 'designed', 'implemented',
  'managed', 'led', 'improved', 'increased', 'reduced',
  'achieved', 'delivered', 'optimized', 'automated', 'launched',
  'deployed', 'integrated', 'architected', 'scaled', 'mentored',
];

export const calculateATSScore = (data) => {
  const personal   = data?.personal   || {};
  const skills     = data?.skills     || [];
  const experience = data?.experience || [];
  const education  = data?.education  || [];
  const projects   = data?.projects   || [];

  const rawScores = {
    contactInfo: scoreContactInfo(personal),
    summary:     scoreSummary(personal.summary),
    skills:      scoreSkills(skills),
    experience:  scoreExperience(experience),
    education:   scoreEducation(education),
    projects:    scoreProjects(projects),
  };

  const weights = {
    contactInfo: 15,
    summary:     10,
    skills:      20,
    experience:  25,
    education:   15,
    projects:    15,
  };

  let totalScore = 0;
  const breakdown = {};

  for (const [key, rawPct] of Object.entries(rawScores)) {
    const weighted = Math.round((rawPct / 100) * weights[key]);

    breakdown[key] = {
      score:      weighted,          
      maxScore:   weights[key],     
      percentage: rawPct,            
      feedback:   getFeedback(key, rawPct),
      tips:       getTips(key, rawPct, { skills, experience, projects }),
    };

    totalScore += weighted;
  }

  return {
    totalScore,                         
    breakdown,                            
    label:   getOverallLabel(totalScore), 
    color:   getScoreColor(totalScore),   
  };
};

const scoreContactInfo = (personal) => {
  const required = ['fullName', 'email', 'phone'];
  const optional = ['location', 'linkedin', 'github'];

  const reqFilled = required.filter(f => personal[f]?.trim()).length;
  const optFilled = optional.filter(f => personal[f]?.trim()).length;

  const reqScore = (reqFilled / required.length) * 70;
  const optScore = (optFilled / optional.length) * 30;

  return Math.round(reqScore + optScore);
};

const scoreSummary = (summary = '') => {
  if (!summary?.trim()) return 0;

  const words = summary.trim().split(/\s+/).length;
  if (words < 20)  return 25;
  if (words < 40)  return 50;
  if (words < 60)  return 75;
  return 100;
};

const scoreSkills = (skills = []) => {
  const count = skills.length;
  if (count === 0)  return 0;
  if (count < 3)    return 25;
  if (count < 6)    return 50;
  if (count < 10)   return 75;
  return 100;
};

const scoreExperience = (experience = []) => {
  if (experience.length === 0) return 0;

  let score = 30; 

  experience.forEach(exp => {
    const desc = exp.description || '';

    if (desc.trim()) score += 15;

    const hasVerbs = ACTION_VERBS.some(v =>
      desc.toLowerCase().includes(v)
    );
    if (hasVerbs) score += 30;

    const hasMetrics = /\d+\s*(%|users|customers|projects|team|members|hrs|hours|days|x\b)/.test(desc);
    if (hasMetrics) score += 25;
  });

  return Math.min(100, score);
};

const scoreEducation = (education = []) => {
  if (education.length === 0) return 0;

  const complete = education.filter(e => e.degree?.trim() && e.institution?.trim());
  if (complete.length === 0) return 30; 
  return 100;
};

const scoreProjects = (projects = []) => {
  if (projects.length === 0) return 0;

  let score = 30; 

  const withDesc  = projects.filter(p => p.description?.trim()).length;
  const withLink  = projects.filter(p => p.link?.trim()).length;
  const withTech  = projects.filter(p => p.technologies?.trim()).length;

  if (withDesc > 0)  score += 30;
  if (withLink > 0)  score += 20;
  if (withTech > 0)  score += 20;

  return Math.min(100, score);
};

export const getScoreColor = (score) => {
  if (score >= 75) return '#10b981'; 
  if (score >= 50) return '#f59e0b'; 
  return '#ef4444';                  
};

const getOverallLabel = (score) => {
  if (score >= 80) return 'ATS Ready ✓';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Average';
  return 'Needs Work';
};

const getFeedback = (key, pct) => {
  const map = {
    contactInfo: [
      'Add Name, email and phone',
      'Also Add LinkedIn profile',
      'Contact info complete  ✓',
    ],
    summary: [
      'Professional summary missing ',
      'Summary make detailed max 60+ words',
      'Summary is strong ✓',
    ],
    skills: [
      'Add minimun 5-8 skills',
      'Add Job description keywords',
      'Skills section strong ✓',
    ],
    experience: [
      'Add Work experience',
      'Use action verbs in Descriptions',
      'Experience section strong ✓',
    ],
    education: [
      'Add Education details',
      'Fill Degree aur institution',
      'Education completed✓',
    ],
    projects: [
      'Add Projects for show practical skills',
      'Add Project descriptions and GitHub links',
      'Projects section solid ✓',
    ],
  };

  const [low, mid, high] = map[key];
  if (pct < 40) return low;
  if (pct < 75) return mid;
  return high;
};

const getTips = (key, pct, { skills, experience, projects }) => {
  if (pct >= 75) return null; 

  const tips = {
    skills: `Try adding: ${
      ['React', 'Node.js', 'Python', 'SQL', 'Git', 'Docker']
        .filter(s => !skills.includes(s))
        .slice(0, 3)
        .join(', ')
    }`,
    experience: 'Example: "Developed REST API that reduced load time by 40%"',
    projects: 'Adding a GitHub link allows the recruiter to view the code directly',
    summary: 'Format: [Role] with [X years] experience in [key skills], passionate about [domain]',
  };

  return tips[key] || null;
};