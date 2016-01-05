const TOGGLE_MUTE = 'subtle-scheme/music/TOGGLE_MUTE'

const initialState = {
  muted: false
}

export default function reducer (state = initialState, action = {}) {
  const {type} = action
  switch(type) {
    case TOGGLE_MUTE:
      return {
        muted: !state.muted
      }
    default:
      return state
  }
}

export const toggleMute = () => {
  return {
    type: TOGGLE_MUTE
  }
}