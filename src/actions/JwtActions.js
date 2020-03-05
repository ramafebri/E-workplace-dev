export const addJWT = (jwt) => (
  {
    type: 'ADD_JWT',
    data: jwt
  }
);

export const deleteToken = () => (
  {
    type: 'DELETE_JWT',
  }
);