const ProgressBar = ({ currentStep, steps }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <>
            <div key={index} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep >= index + 1
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-48 h-1 mx-2 ${
                  currentStep > index + 1 ? "bg-purple-600" : "bg-gray-200"
                }`}
              />
            )}
          </>
        ))}
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        {steps.map((step, index) => (
          <span key={index}>{step}</span>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
