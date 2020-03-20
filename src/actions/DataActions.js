export const addNama = (username, name) => (
    {
      type: 'ADD_NAMA',
      dataUsername: username,
      dataName: name
    }
  );
  
  export const addLocation = (loc) => (
    {
      type: 'ADD_LOCATION',
      dataLoc: loc
    }
  );

  export const addLoading = (loading) => (
    {
      type: 'ADD_LOADING',
      loading: loading
    }
  );

  export const addAnnouncement = (announcement) => (
    {
      type: 'ADD_ANNOUNCEMENT',
      announcement: announcement
    }
  );

  export const addStatusClockin = (clockin, status, idUser, workStatus) => (
    {
      type: 'ADD_CLOCKIN',
      dataClockin: clockin,
      checkIntext: status,
      idUser : idUser,
      workStatus : workStatus
    }
  );  
