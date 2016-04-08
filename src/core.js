import { List, Map } from 'immutable'

/**
 * App initial state
 *
 * @type {Map}
 */
export const INITIAL_STATE = Map()

/**
 * Set the entries to state map
 *
 * @param  {Map}         state   state map
 * @param  {List|Array}  entries iterable entris
 * @return {Map}         new state
 */
export const setEntries = (state, entries) => state.set('entries', List(entries))

/**
 * Get the winners from voting result
 *
 * @param  {Map}   vote voting map
 * @return {Array}      the winner(s)
 */
const _getWinners = (vote) => {
  if (!vote) return []

  const [a, b] = vote.get('pair') // get 'a' and 'b' entries from voting
  const aVotes = vote.getIn(['tally', a], 0) // get vots for 'a' entry in tally, defaulting to 0
  const bVotes = vote.getIn(['tally', b], 0) // get vots for 'b' entry in tally, defaulting to 0

  if (aVotes > bVotes) return [a]
  else if (aVotes < bVotes) return [b]
  else return [a, b]
}

/**
 * Takes the next to entries into voting
 *
 * @param  {Map} state state map
 * @return {Map}       new state
 */
export const next = (state) => {
  // get the entries concatened with the voting result
  const entries = state.get('entries')
    .concat(
      _getWinners(state.get('vote'))
    )

  if (entries.count() === 1) {
    // instead of just returning Map({winner: entries:first()}) explicitly take the old
    // state and remove 'vote' and 'entries' to prevent, in the future, to remove extra
    // information from state
    return state
      .remove('vote')
      .remove('entries')
      .set('winner', entries.first())
  }

  return state.merge({
    vote: Map({pair: entries.take(2)}),
    entries: entries.skip(2)
  })
}

/**
 * Vote for entries
 *
 * @param  {Map} voteState state map
 * @param  {String|Number} entry the entry to be voted
 * @return {Map}        new state
 */
export const vote = (voteState, entry) => voteState.updateIn(
  ['tally', entry], // finds the path vote.tally[entry]
  0, // initialize with value of 0 if not found
  (tally) => tally + 1 // add 1 to the path value
)
