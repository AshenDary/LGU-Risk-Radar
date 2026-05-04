import React from 'react'

export default function Filters(){
  return (
    <div className="flex gap-2">
      <input className="p-2 border rounded" placeholder="Search LGUs..." />
      <select className="p-2 border rounded">
        <option>All</option>
      </select>
    </div>
  )
}
