const TOGGLE_MUTE = 'subtle-scheme/music/TOGGLE_MUTE'
const LOWER_VOLUME = 'subtle-scheme/music/LOWER_VOLUME'
const RAISE_VOLUME = 'subtle-scheme/music/RAISE_VOLUME'

const initialState = {
  muted: false,
  changeVolume: false
}

export default function reducer (state = initialState, action = {}) {
  const {type} = action
  switch(type) {
    case TOGGLE_MUTE:
      return {
        ...state,
        muted: !state.muted
      }
    case LOWER_VOLUME:
      return {
        ...state,
        changeVolume: true
      }
    case RAISE_VOLUME:
      return {
        ...state,
        changeVolume: false
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

export const lowerVolume = () => {
  return {
    type: LOWER_VOLUME
  }
}

export const raiseVolume = () => {
  return {
    type: RAISE_VOLUME
  }
}