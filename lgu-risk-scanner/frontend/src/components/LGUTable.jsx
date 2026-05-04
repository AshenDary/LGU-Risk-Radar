import React from 'react'

export default function LGUTable(){
  return (
    <div className="mt-6 bg-white rounded shadow overflow-auto">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Population</th>
            <th className="p-2 text-left">Risk</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2">--</td>
            <td className="p-2">--</td>
            <td className="p-2">--</td>
            <td className="p-2">--</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
