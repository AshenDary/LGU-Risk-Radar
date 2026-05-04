import React from 'react'
import RiskCard from './RiskCard'
import LGUTable from './LGUTable'
import Filters from './Filters'

export default function Dashboard(){
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">LGU Risk Scanner</h1>
      <Filters />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
        <RiskCard title="Overall Risk" value="--" />
        <RiskCard title="Top Concern" value="--" />
        <RiskCard title="Data Quality" value="--" />
      </div>
      <LGUTable />
    </div>
  )
}
