export enum IssueStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  ESCALATED = 'escalated',
}

export enum IssueUrgency {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  EMERGENCY = 'emergency',
}

export enum IssueCategory {
  ELECTRICAL = 'electrical',
  PLUMBING = 'plumbing',
  INTERNET = 'internet',
  CARPENTRY = 'carpentry',
  OTHER = 'other',
}
