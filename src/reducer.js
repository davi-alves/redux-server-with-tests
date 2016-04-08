import { setEntries, next, vote, INITIAL_STATE } from './core'

export default (state = INITIAL_STATE, action) => {
  console.log('action received: ', action)
  switch (action.type) {
    case 'SET_ENTRIES':
      return setEntries(state, action.entries)
    case 'NEXT':
      return next(state)
    case 'VOTE':
      // returns the vote entry as the voting only cares about it
      return state.update('vote', (voteState) => vote(voteState, action.entry))
  }

  return state
}
