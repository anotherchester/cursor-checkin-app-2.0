import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import {
  checklistByTeam,
  locations,
  teamLabels,
  type Location,
  type TeamKey,
} from './data/locations'

type FilterKey = 'all' | TeamKey

interface LocationSnapshot {
  checked: string[]
  notes: string
}

function assessStatus(location: Location, snapshot?: LocationSnapshot) {
  if (!snapshot || snapshot.checked.length === 0) {
    return 'none'
  }

  const totalRequired = checklistByTeam[location.team].length

  if (snapshot.checked.length >= totalRequired) {
    return 'complete'
  }

  return 'partial'
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterKey, setFilterKey] = useState<FilterKey>('all')
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)
  const [quickSelectId, setQuickSelectId] = useState('')
  const [snapshots, setSnapshots] = useState<Record<string, LocationSnapshot>>({})
  const filterOptions: Array<'all' | TeamKey> = ['all', 'drivers', 'collections', 'standard']

  const filteredLocations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return locations.filter((location) => {
      const matchesFilter = filterKey === 'all' || location.team === filterKey
      const matchesSearch =
        normalizedSearch.length === 0 ||
        location.name.toLowerCase().includes(normalizedSearch) ||
        location.code.toLowerCase().includes(normalizedSearch)

      return matchesFilter && matchesSearch
    })
  }, [filterKey, searchTerm])

  const selectedLocation = useMemo(
    () => locations.find((location) => location.id === selectedLocationId) ?? null,
    [selectedLocationId]
  )

  const handleLocationClick = (locationId: string) => {
    setSelectedLocationId(locationId)
    setQuickSelectId(locationId)
  }

  const handleQuickSelectSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!quickSelectId) return

    const chosen = locations.find((location) => location.id === quickSelectId)
    if (chosen && filterKey !== 'all' && chosen.team !== filterKey) {
      setFilterKey('all')
    }
    setSelectedLocationId(quickSelectId)
  }

  const handleDetailSubmit = (locationId: string, checked: string[], notes: string) => {
    setSnapshots((current) => ({
      ...current,
      [locationId]: {
        checked,
        notes: notes.trim(),
      },
    }))
  }

  const handleDetailClear = (locationId: string) => {
    setSnapshots((current) => {
      const { [locationId]: _removed, ...rest } = current
      return rest
    })
  }

  return (
    <div className="app-shell">
      <header className="header">
        <h1>Location Readiness Tracker</h1>
        <p className="subtitle">
          Manage team-specific checklists for 85 King County ballot drop box locations.
        </p>
      </header>

      <section className="toolbar">
        <div className="search-group">
          <label htmlFor="search" className="sr-only">
            Search locations
          </label>
          <input
            id="search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by location name or code"
          />
        </div>

        <fieldset className="filter-group">
          <legend>Filter by team</legend>
          {filterOptions.map((key) => (
            <label key={key} className="filter-option">
              <input
                type="radio"
                name="team-filter"
                value={key}
                checked={filterKey === key}
                onChange={() => setFilterKey(key)}
              />
              <span>{teamLabels[key]}</span>
            </label>
          ))}
        </fieldset>

        <form className="quick-select" onSubmit={handleQuickSelectSubmit}>
          <label htmlFor="quick-select" className="quick-select-label">
            Quick Select
          </label>
          <select
            id="quick-select"
            value={quickSelectId}
            onChange={(event) => setQuickSelectId(event.target.value)}
          >
            <option value="">Choose a location...</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name} ({location.code})
              </option>
            ))}
          </select>
          <button type="submit">Go</button>
        </form>
      </section>

      <section className="content">
        <div className="list-pane">
          <div className="list-header">
            <h2>Locations</h2>
            <span className="results-count">{filteredLocations.length} of {locations.length}</span>
          </div>
          <div className="legend">
            <span className="legend-item legend-complete">All items checked</span>
            <span className="legend-item legend-partial">Some items checked</span>
            <span className="legend-item legend-none">No items checked</span>
          </div>
          <div className="location-list" role="list">
            {filteredLocations.length === 0 ? (
              <p className="empty-state">No locations match the current filters.</p>
            ) : (
              filteredLocations.map((location) => {
                const snapshot = snapshots[location.id]
                const status = assessStatus(location, snapshot)
                const isSelected = selectedLocationId === location.id

                return (
                  <button
                    key={location.id}
                    type="button"
                    className={`location-item status-${status}${isSelected ? ' is-selected' : ''}`}
                    onClick={() => handleLocationClick(location.id)}
                  >
                    <div className="location-primary">
                      <span className="location-name">{location.name}</span>
                      <span className="location-code">{location.code}</span>
                    </div>
                    <div className="location-meta">
                      <span className="location-team">{teamLabels[location.team]}</span>
                      <span className="location-progress">
                        {snapshots[location.id]?.checked.length ?? 0}/
                        {checklistByTeam[location.team].length}
                      </span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        <div className="detail-pane">
          {selectedLocation ? (
            <LocationDetail
              key={selectedLocation.id}
              location={selectedLocation}
              snapshot={snapshots[selectedLocation.id]}
              onSubmit={handleDetailSubmit}
              onClear={handleDetailClear}
              onBack={() => setSelectedLocationId(null)}
            />
          ) : (
            <div className="detail-placeholder">
              <h2>Select a location</h2>
              <p>Choose a location from the list or use Quick Select to manage its checklist and notes.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

interface LocationDetailProps {
  location: Location
  snapshot?: LocationSnapshot
  onSubmit: (locationId: string, checked: string[], notes: string) => void
  onClear: (locationId: string) => void
  onBack: () => void
}

function LocationDetail({ location, snapshot, onSubmit, onClear, onBack }: LocationDetailProps) {
  const checklist = checklistByTeam[location.team]
  const [checkedItems, setCheckedItems] = useState<Set<string>>(
    () => new Set(snapshot?.checked ?? [])
  )
  const [notes, setNotes] = useState(snapshot?.notes ?? '')

  useEffect(() => {
    setCheckedItems(new Set(snapshot?.checked ?? []))
    setNotes(snapshot?.notes ?? '')
  }, [location.id, snapshot])

  const toggleItem = (item: string) => {
    setCheckedItems((current) => {
      const next = new Set(current)
      if (next.has(item)) {
        next.delete(item)
      } else {
        next.add(item)
      }
      return next
    })
  }

  const handleSubmit = () => {
    onSubmit(location.id, Array.from(checkedItems), notes)
  }

  const handleClear = () => {
    setCheckedItems(new Set())
    setNotes('')
    onClear(location.id)
  }

  return (
    <div className="detail-card">
      <div className="detail-header">
        <div>
          <h2>{location.name}</h2>
          <p className="detail-meta">
            <span>Code {location.code}</span>
            <span aria-hidden>|</span>
            <span>{teamLabels[location.team]}</span>
          </p>
        </div>
        <button type="button" className="secondary" onClick={onBack}>
          Back to list
        </button>
      </div>

      <section className="checklist-section">
        <h3>Checklist</h3>
        <ul className="checklist" role="group" aria-label="Location readiness items">
          {checklist.map((item) => (
            <li key={item}>
              <label className="checklist-item">
                <input
                  type="checkbox"
                  checked={checkedItems.has(item)}
                  onChange={() => toggleItem(item)}
                />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="notes-section">
        <label htmlFor="notes" className="notes-label">
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Add any special instructions or follow-up details."
          rows={4}
        />
      </section>

      <div className="detail-actions">
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
        <button type="button" className="secondary" onClick={handleClear}>
          Clear saved
        </button>
      </div>
    </div>
  )
}

export default App
