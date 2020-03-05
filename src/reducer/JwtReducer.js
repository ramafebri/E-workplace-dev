const initialState = {
    jwt: ''
  }
  
  const jwtReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_JWT':
        return {
          ...state,
          jwt : action.data
        };
      case 'DELETE_JWT':
        return {
          ...state,
          jwt : ''
        };
      default:
        return state;
    }
  }
  
  export default jwtReducer;