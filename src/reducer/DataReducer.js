const initialState = {
    id : '',
    username: '',
    fullname:'',
    locations:'',
    clockIn: true,
    statusCheckIn: ' ',
    workStatus: 'Work at Office',
    loading : false,
    announcement:'',
  }
  
  const dataReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_NAMA':
        return {
          ...state,
          username : action.dataUsername,
          fullname : action.dataName
        };
      case 'ADD_LOCATION':
        return {
          ...state,
          locations : action.dataLoc
        };
      case 'ADD_ANNOUNCEMENT':
        return {
          ...state,
          announcement : action.announcement
        };  
      case 'ADD_LOADING':
        return {
          ...state,
          loading : action.loading
        };  
      case 'ADD_CLOCKIN':
        return {
          ...state,
          clockIn : action.dataClockin,
          statusCheckIn :  action.checkIntext,
          id : action.idUser,
          workStatus : action.workStatus
        };  
      default:
        return state;
    }
  }
  
  export default dataReducer;