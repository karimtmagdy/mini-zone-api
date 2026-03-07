export const EMPLOYEE_JOB_TITLES = [
  "Manager",
  "Developer",
  "Designer",
  "Analyst",
  "Specialist",
  "Coordinator",
  "Director",
  "Lead",
  "Associate",
  "Consultant",
] as const;
export const EMPLOYEE_DEPARTMENTS = [
  "HR",
  "Engineering",
  "Sales",
  "Marketing",
  "Finance",
  "Support",
  "Management",
  "Operations",
  "IT",
] as const;

export type EmployeeDepartment = (typeof EMPLOYEE_DEPARTMENTS)[number];
export type EmployeeJobTitle = (typeof EMPLOYEE_JOB_TITLES)[number];
