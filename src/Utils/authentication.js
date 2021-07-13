
// return the user data from the session storage
export const getUser = () => {
  const userStr = sessionStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  else return null;
}

// return the token from the session storage
export const getToken = () => {
  return sessionStorage.getItem('token') || null;
}

// remove the token and user from the session storage
export const removeUserSession = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('userInfo');
}

// set the token and user from the session storage
export const setUserSession = (token, user) => {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('user', JSON.stringify(user));
}


export const setUserInfo = (userInfo) => {
  sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
}

export const getUserInfo = () => {
  let userInfo = sessionStorage.getItem('userInfo');
  if (userInfo) return JSON.parse(userInfo);
  else return null;
}

export const removeUserInfo = (userInfo) => {
  sessionStorage.removeItem('userInfo');
}

export const getUserRole = () => {
  let userInfo = sessionStorage.getItem('userInfo');
  if (userInfo) return JSON.parse(userInfo).role;
  else return null;
}

export const isAdminUser = () => {
  const role = getUserRole();
  if (role) {
    if (role === 'admin')
      return true;
    else
      return null;
  } else {
    return null;
  }
}