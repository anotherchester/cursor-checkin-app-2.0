export type TeamKey = 'drivers' | 'collections' | 'standard'

export interface Location {
  id: string
  name: string
  code: string
  team: TeamKey
}

const rawLocations: Array<Pick<Location, 'name' | 'code'>> = [
  { name: 'Auburn Library', code: '020' },
  { name: 'Auburn Park & Ride', code: '025' },
  { name: 'Muckleshoot Community Center', code: '330' },
  { name: 'Bellevue Library', code: '050' },
  { name: 'Crossroads Shopping Center', code: '120' },
  { name: 'Newport Way Library', code: '353' },
  { name: 'North Bellevue Community Center', code: '356' },
  { name: 'Black Diamond Library', code: '055' },
  { name: 'Bothell Library', code: '060' },
  { name: 'University of Washington Bothell Campus', code: '495' },
  { name: 'Boulevard Park Library', code: '070' },
  { name: 'Burien Town Square Park', code: '090' },
  { name: 'Carnation Library', code: '095' },
  { name: 'Covington Library', code: '110' },
  { name: 'Highline College', code: '200' },
  { name: 'Duvall Police Department Depot Park', code: '125' },
  { name: 'Enumclaw Library', code: '130' },
  { name: 'Fall City Library', code: '150' },
  { name: 'Federal Way 320th Library', code: '155' },
  { name: 'Federal Way City Hall', code: '160' },
  { name: 'Safeway Star Lake', code: '414' },
  { name: 'Issaquah City Hall', code: '220' },
  { name: 'Kenmore City Hall', code: '230' },
  { name: 'Kent Panther Lake Library', code: '233' },
  { name: 'Kent YMCA', code: '235' },
  { name: 'Regional Justice Center', code: '400' },
  { name: 'Kingsgate Library', code: '270' },
  { name: 'Kirkland City Hall', code: '280' },
  { name: 'Lake Forest Park City Hall', code: '300' },
  { name: 'Hobart Food Market', code: '210' },
  { name: 'Tahoma School District Building', code: '480' },
  { name: 'Mercer Island Community & Event Center', code: '320' },
  { name: 'Newcastle City Hall', code: '340' },
  { name: 'Normandy Park Towne Center', code: '355' },
  { name: 'North Bend Library', code: '357' },
  { name: 'Algona Pacific Library', code: '010' },
  { name: 'Redmond City Hall', code: '390' },
  { name: 'Redmond Community Center at Marymoor Village', code: '395' },
  { name: 'Redmond Ridge Park & Ride', code: '397' },
  { name: 'Fairwood Library', code: '140' },
  { name: 'King County Elections', code: '260' },
  { name: 'Powell Avenue', code: '265' },
  { name: 'Renton Public Health Center', code: '410' },
  { name: 'Sammamish City Hall', code: '420' },
  { name: 'South Sammamish Park & Ride', code: '472' },
  { name: 'Angle Lake Transit Station', code: '015' },
  { name: 'Valley View Library', code: '510' },
  { name: '12th & Cherry', code: '002' },
  { name: 'Alaska Junction', code: '005' },
  { name: 'Ballard Branch Library A', code: '030' },
  { name: 'Beacon Hill Library', code: '040' },
  { name: 'Broadview Library', code: '080' },
  { name: 'Garfield Community Center', code: '170' },
  { name: 'Green Lake Community Center', code: '180' },
  { name: 'High Point Library', code: '190' },
  { name: 'King Street Box', code: '263' },
  { name: 'Lake City Library', code: '290' },
  { name: 'Magnolia Park', code: '310' },
  { name: 'Magnuson Park Building 406', code: '305' },
  { name: 'Metropolitan Market Queen Anne', code: '325' },
  { name: 'Morgan Junction Park', code: '327' },
  { name: 'NewHolly Neighborhood Campus', code: '350' },
  { name: 'North Seattle College', code: '360' },
  { name: 'Rainier Beach Community Center', code: '370' },
  { name: 'Rainier Community Center', code: '380' },
  { name: 'Safeway Crown Hill', code: '412' },
  { name: 'Seattle Central College', code: '430' },
  { name: 'Seattle Pacific University Bookstore', code: '435' },
  { name: 'Skyway Library', code: '450' },
  { name: 'South Lake Union', code: '465' },
  { name: 'South Park Library', code: '470' },
  { name: 'South Seattle College', code: '475' },
  { name: 'University of Washington Campus Schmitz Hall', code: '500' },
  { name: 'Uwajimaya', code: '100' },
  { name: 'Waterway 19 Park', code: '527' },
  { name: 'White Center Library', code: '530' },
  { name: 'Shoreline Library', code: '440' },
  { name: 'Shoreline Park & Ride', code: '445' },
  { name: 'Snoqualmie Library', code: '460' },
  { name: 'Tukwila Community Center', code: '490' },
  { name: 'Tukwila Justice Center', code: '492' },
  { name: 'Vashon Library', code: '520' },
  { name: 'Woodinville City Hall', code: '535' },
  { name: 'Woodinville Library', code: '540' },
  { name: 'Ballard Branch Library B', code: '030' },
]

const teamCycle: TeamKey[] = ['drivers', 'collections', 'standard']

export const locations: Location[] = rawLocations.map((location, index) => ({
  ...location,
  id: `${location.code}-${index}`,
  team: teamCycle[index % teamCycle.length],
}))

export const checklistByTeam: Record<TeamKey, string[]> = {
  drivers: ['Blue bag', 'Red bag', 'Red key', 'Blue key', "Driver's Phone"],
  collections: ['Blue bag', 'Red bag', 'Red key', 'Blue key', 'Phone'],
  standard: ['Blue bag', 'Red bag', 'Keys', 'Phone'],
}

export const teamLabels: Record<'all' | TeamKey, string> = {
  all: 'All',
  drivers: 'Drivers Team',
  collections: 'Collections Team',
  standard: 'Standard',
}

