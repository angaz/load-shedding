import React, { useState, useEffect } from 'react';
import Groups from './Groups';

import './SelectGroup.css';


const TableRows = ({ filterGroups, setGroup }) => {
  console.log(filterGroups);

  const searchStr = new RegExp(filterGroups.replace(' ', '.*?'), 'i');

  return Groups
    .filter(({ suburb, group }) => filterGroups ? suburb.search(searchStr) !== -1 : true)
    .map(({ suburb, group }) => (
      <tr key={`${suburb}:${group}`} onClick={() => setGroup(group)}>
        <td className="Suburb">{suburb}</td>
        <td className="Group">{group}</td>
      </tr>
    ));
}


export default ({ setGroup }) => {
  const [ filterGroups, setFilterGroups ] = useState('');

  useEffect(() => {
    return setFilterGroups('');
  }, []);

  return (
    <div className="SelectGroup">
      <h1>Please select a Group:</h1>
      <input type="text" placeholder="Filter Groups" onChange={e => setFilterGroups(e.target.value)} value={filterGroups} />

      <table>
        <thead>
          <tr>
            <th>Suburb and Extensions</th>
            <th>Group</th>
          </tr>
        </thead>
        <tbody>
          <TableRows filterGroups={filterGroups} setGroup={setGroup} />
        </tbody>
      </table>
    </div>
  );
};
