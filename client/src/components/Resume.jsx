import React, { useRef } from 'react';
import ErrorPage from './ErrorPage';
import { useReactToPrint } from 'react-to-print';

const Resume = ({ result }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${result.name} Resume`,
    onAfterPrint: () => alert('Print Successful'),
  });

  if (JSON.stringify(result) === '{}') {
    return <ErrorPage />;
  }

  const replaceWithBr = (string) => {
    if (!string) return;
    return string.replace(/\n/g, '<br />');
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <button
        onClick={handlePrint}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Print Page
      </button>
      <main
        ref={componentRef}
        className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8"
      >
        <header className="flex justify-between items-center border-b-2 pb-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{result.name}</h1>
            <p className="text-gray-700">{result.phone}</p>
            <p className="text-gray-700">{result.email}</p>
            <p className="text-gray-700">{result.address}</p>
          </div>
          <div className="w-32 h-32">
            <img
              src={result.image}
              alt={result.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </header>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Profile Summary
          </h2>
          <p
            className="text-gray-700"
            dangerouslySetInnerHTML={{
              __html: replaceWithBr(result.objective),
            }}
          />
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Experience
          </h2>
          {result.experience.map((experience) => (
            <p
              key={experience.name}
              className="text-gray-700 mb-2"
            >
              <span className="font-bold">{experience.name}</span> -{' '}
              {experience.position}
            </p>
          ))}
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Job profile
          </h2>
          <p
            className="text-gray-700"
            dangerouslySetInnerHTML={{
              __html: replaceWithBr(result.jobResponsibilities),
            }}
          />
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Skills</h2>
          <p
            className="text-gray-700"
            dangerouslySetInnerHTML={{
              __html: replaceWithBr(result.skills),
            }}
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Education
          </h2>
          <p
            className="text-gray-700"
            dangerouslySetInnerHTML={{
              __html: replaceWithBr(result.education),
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default Resume;
