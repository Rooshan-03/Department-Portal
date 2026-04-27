import React from 'react';

const Loader = () => {
  const rows = [1, 2, 3, 4, 5];
  const cards = [1, 2, 3];

  return (
    <div className="p-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((i) => (
          <div key={i} className="skeleton skeleton-card bg-white p-4 shadow-sm rounded-lg" />
        ))}
      </div>

      <div className="skeleton h-10 w-full md:w-1/3 mb-6 rounded-md" />

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex pb-4 mb-4">
          <div className="skeleton h-4 w-1/4 mr-4" />
          <div className="skeleton h-4 w-1/4 mr-4" />
          <div className="skeleton h-4 w-1/4 mr-4" />
          <div className="skeleton h-4 w-1/4" />
        </div>

        {rows.map((row) => (
          <div key={row} className="flex items-center py-4">
            <div className="skeleton skeleton-avatar mr-4 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton skeleton-text w-3/4" />
              <div className="skeleton skeleton-text w-1/2" />
            </div>
            <div className="skeleton h-4 w-1/4 mx-4" />
            <div className="skeleton h-4 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loader;