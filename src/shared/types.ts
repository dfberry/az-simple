export type Result = {
  error: Error;
  data: unknown;
  status: 'success' | 'failure';
};
