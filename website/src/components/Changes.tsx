import React from 'react';
import changelogs from '../../changelog.json';

const filteredChangelogs = changelogs.filter(
  (changelog) => changelog.commits.length || changelog.merges.length,
);

export function Changes() {
  return (
    <section className="py-12 px-6">
      <h2 className="text-gray-300 text-2xl text-center mb-5">
        Versions and changes
      </h2>
      <div className="border border-gray-800 rounded-md w-full max-w-[800px] p-4 mx-auto">
        <div className="py-4 text-gray-300 flex items-start sm:items-center justify-between border-b border-b-gray-800 flex-col sm:flex-row">
          <p className="font-bold uppercase mb-4 sm:mb-0">Versions</p>
          <p className="font-bold w-1/2 uppercase text-sm">Changes</p>
        </div>
        {filteredChangelogs.map((changelog, index) => (
          <div
            key={changelog.version}
            className={`py-4 text-gray-300 flex items-start sm:items-center justify-between ${
              index !== filteredChangelogs.length - 1 ? 'border-b' : ''
            } border-b-gray-800 flex-col sm:flex-row`}
          >
            <p className="mb-4 sm:mb-0">
              <span className="font-bold ">
                v{changelog.version.replace('v', '')}
              </span>{' '}
              - {changelog.date}
            </p>
            <ul className="list-inside list-disc w-full sm:w-1/2 text-gray-400 text-sm">
              {changelog.merges.map((merge) => (
                <li key={merge.id}>{merge.message}</li>
              ))}
              {changelog.commits.map((commit) => (
                <li key={commit.hash}>{commit.message}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
