
export interface Task {
  id: string;
  title: string;
  description: string;
  date: string; // 'YYYY-MM-DD'
  color: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'indigo' | 'pink';
}
