import { Alert } from '@/components/ui';

const ErrorMessage = () => (
  <div className="w-full h-screen flex items-center justify-center bg-white dark:bg-gray-900">
    <div className="flex flex-col items-center gap-4 max-w-md p-6 text-center">
      <Alert 
        variant="error" 
        title="Error"
      >
        Oops! Something went wrong. Please try again later or contact support if the issue persists.
      </Alert>
    </div>
  </div>
);

export default ErrorMessage;