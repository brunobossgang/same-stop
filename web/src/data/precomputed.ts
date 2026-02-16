const data = {
  "summary": {
    "total_stops": 72110871,
    "num_states": 4,
    "states": ["California", "Florida", "Illinois", "North Carolina"]
  },
  "search_rates": {
    "white": [
      { "state": "California", "rate": 2.54 },
      { "state": "Florida", "rate": 0.45 },
      { "state": "Illinois", "rate": 3.6 },
      { "state": "North Carolina", "rate": 2.2 }
    ],
    "black": [
      { "state": "California", "rate": 4.37 },
      { "state": "Florida", "rate": 0.92 },
      { "state": "Illinois", "rate": 6.88 },
      { "state": "North Carolina", "rate": 4.46 }
    ],
    "hispanic": [
      { "state": "California", "rate": 4.93 },
      { "state": "Florida", "rate": 0.57 },
      { "state": "Illinois", "rate": 6.33 },
      { "state": "North Carolina", "rate": 4.52 }
    ]
  },
  "arrest_rates": {},
  "hit_rates": {
    "white": [
      { "state": "California", "rate": 73.3 },
      { "state": "Illinois", "rate": 21.0 },
      { "state": "North Carolina", "rate": 28.1 }
    ],
    "black": [
      { "state": "California", "rate": 55.2 },
      { "state": "Illinois", "rate": 22.2 },
      { "state": "North Carolina", "rate": 26.4 }
    ],
    "hispanic": [
      { "state": "California", "rate": 52.4 },
      { "state": "Illinois", "rate": 15.7 },
      { "state": "North Carolina", "rate": 16.8 }
    ]
  },
  "race_distribution": {},
  "by_state": {
    "California": {
      "total_stops": 31778515,
      "sample_size": 504420,
      "date_min": "2009-07-01",
      "date_max": "2016-06-30",
      "race_distribution": { "white": 44.3, "hispanic": 33.1, "black": 8.2, "other": 7.5, "asian/pacific islander": 6.9 },
      "search_rates": { "asian/pacific islander": 2.06, "black": 4.37, "hispanic": 4.93, "white": 2.54 },
      "arrest_rates": { "asian/pacific islander": 2.72, "black": 4.43, "hispanic": 4.81, "white": 3.15 },
      "hit_rates": { "asian/pacific islander": 78.9, "black": 55.2, "hispanic": 52.4, "white": 73.3 },
      "yearly_trends": [
        { "year": 2009, "white": 2.55, "black": 4.77, "hispanic": 5.41 },
        { "year": 2010, "white": 2.46, "black": 4.75, "hispanic": 5.38 },
        { "year": 2011, "white": 2.45, "black": 4.23, "hispanic": 5.26 },
        { "year": 2012, "white": 2.54, "black": 4.8, "hispanic": 5.09 },
        { "year": 2013, "white": 2.54, "black": 4.21, "hispanic": 5.11 },
        { "year": 2014, "white": 2.69, "black": 3.76, "hispanic": 4.31 },
        { "year": 2015, "white": 2.64, "black": 4.12, "hispanic": 4.41 },
        { "year": 2016, "white": 2.42, "black": 4.37, "hispanic": 4.13 }
      ],
      "outcome_by_race": {
        "white": { "arrest": 3.2, "citation": 3.3, "summons": 66.6, "warning": 26.9 },
        "black": { "arrest": 4.4, "citation": 2.3, "summons": 66.8, "warning": 26.5 },
        "hispanic": { "arrest": 4.8, "citation": 4.1, "summons": 69.8, "warning": 21.3 }
      }
    },
    "Florida": {
      "total_stops": 7297538,
      "sample_size": 521252,
      "date_min": "2010-01-17",
      "date_max": "2018-12-31",
      "race_distribution": { "white": 56.1, "hispanic": 20.5, "black": 19.3, "other": 2.8, "asian/pacific islander": 1.3, "unknown": 0.0 },
      "search_rates": { "asian/pacific islander": 0.39, "black": 0.92, "hispanic": 0.57, "white": 0.45 },
      "arrest_rates": { "asian/pacific islander": 0.0, "black": 0.13, "hispanic": 0.06, "white": 0.06 },
      "yearly_trends": [
        { "year": 2010, "white": 0.48, "black": 0.87, "hispanic": 0.65 },
        { "year": 2011, "white": 0.57, "black": 1.11, "hispanic": 0.63 },
        { "year": 2012, "white": 0.5, "black": 0.84, "hispanic": 0.59 },
        { "year": 2013, "white": 0.42, "black": 0.91, "hispanic": 0.52 },
        { "year": 2014, "white": 0.39, "black": 0.83, "hispanic": 0.5 },
        { "year": 2015, "white": 0.35, "black": 0.84, "hispanic": 0.59 },
        { "year": 2016, "white": 0.48, "black": 1.08, "hispanic": 0.51 }
      ],
      "outcome_by_race": {
        "white": { "arrest": 0.1, "citation": 63.0, "warning": 36.9 },
        "black": { "arrest": 0.2, "citation": 67.7, "warning": 32.1 },
        "hispanic": { "arrest": 0.1, "citation": 74.2, "warning": 25.7 }
      }
    },
    "Illinois": {
      "total_stops": 12748173,
      "sample_size": 509926,
      "date_min": "2012-01-01",
      "date_max": "2017-12-31",
      "race_distribution": { "white": 63.1, "black": 20.1, "hispanic": 13.2, "asian/pacific islander": 3.3, "other": 0.3 },
      "search_rates": { "asian/pacific islander": 1.4, "black": 6.88, "hispanic": 6.33, "white": 3.6 },
      "hit_rates": { "asian/pacific islander": 13.2, "black": 22.2, "hispanic": 15.7, "white": 21.0 },
      "yearly_trends": [
        { "year": 2012, "white": 3.32, "black": 7.5, "hispanic": 8.25 },
        { "year": 2013, "white": 3.5, "black": 7.44, "hispanic": 7.42 },
        { "year": 2014, "white": 3.68, "black": 7.67, "hispanic": 6.85 },
        { "year": 2015, "white": 3.7, "black": 7.26, "hispanic": 6.02 },
        { "year": 2016, "white": 3.84, "black": 6.4, "hispanic": 5.19 },
        { "year": 2017, "white": 3.6, "black": 5.65, "hispanic": 4.95 }
      ],
      "outcome_by_race": {
        "white": { "citation": 45.2, "warning": 54.8 },
        "black": { "citation": 47.9, "warning": 52.1 },
        "hispanic": { "citation": 53.5, "warning": 46.5 }
      }
    },
    "North Carolina": {
      "total_stops": 20286645,
      "sample_size": 507166,
      "date_min": "2000-01-01",
      "date_max": "2015-12-31",
      "race_distribution": { "white": 58.7, "black": 30.5, "hispanic": 7.7, "unknown": 1.2, "asian/pacific islander": 1.1, "other": 0.8 },
      "search_rates": { "asian/pacific islander": 1.47, "black": 4.46, "hispanic": 4.52, "white": 2.2 },
      "arrest_rates": { "asian/pacific islander": 1.45, "black": 2.55, "hispanic": 3.77, "white": 1.63 },
      "hit_rates": { "asian/pacific islander": 23.5, "black": 26.4, "hispanic": 16.8, "white": 28.1 },
      "yearly_trends": [
        { "year": 2000, "white": 1.04, "black": 1.29, "hispanic": 3.64 },
        { "year": 2001, "white": 1.13, "black": 2.04, "hispanic": 3.94 },
        { "year": 2002, "white": 3.51, "black": 6.71, "hispanic": 8.41 },
        { "year": 2003, "white": 3.41, "black": 6.04, "hispanic": 7.06 },
        { "year": 2004, "white": 3.26, "black": 5.76, "hispanic": 7.4 },
        { "year": 2005, "white": 3.12, "black": 6.33, "hispanic": 8.33 },
        { "year": 2006, "white": 2.98, "black": 7.0, "hispanic": 7.07 },
        { "year": 2007, "white": 2.22, "black": 4.85, "hispanic": 4.78 },
        { "year": 2008, "white": 2.28, "black": 4.5, "hispanic": 4.62 },
        { "year": 2009, "white": 1.93, "black": 4.08, "hispanic": 3.91 },
        { "year": 2010, "white": 1.89, "black": 3.79, "hispanic": 3.24 },
        { "year": 2011, "white": 1.74, "black": 3.97, "hispanic": 3.29 },
        { "year": 2012, "white": 1.77, "black": 3.57, "hispanic": 3.03 },
        { "year": 2013, "white": 1.84, "black": 3.79, "hispanic": 2.62 },
        { "year": 2014, "white": 1.59, "black": 3.72, "hispanic": 2.13 },
        { "year": 2015, "white": 1.58, "black": 3.58, "hispanic": 1.69 }
      ],
      "outcome_by_race": {
        "white": { "arrest": 1.7, "citation": 68.8, "warning": 29.5 },
        "black": { "arrest": 2.6, "citation": 65.0, "warning": 32.4 },
        "hispanic": { "arrest": 3.9, "citation": 74.0, "warning": 22.1 }
      }
    }
  },
  "yearly_trends": {}
} as const;

export default data;
