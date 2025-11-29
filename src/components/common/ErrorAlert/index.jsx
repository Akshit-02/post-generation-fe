const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
      <div>
        <p className="text-red-800 font-medium">Error</p>
        <p className="text-red-600 text-sm">{message}</p>
      </div>
    </div>
  );
};

export default ErrorAlert;
