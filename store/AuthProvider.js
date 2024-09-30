import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import {BASE_URL} from '@env';
export const AuthContext = React.createContext();

export const verifyToken = serviceToken => {
  if (!serviceToken) {
    return false;
  }
  const decoded = jwtDecode(serviceToken);
  /**
   * Property 'exp' does not exist on type '<T = unknown>(token, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};
const AuthContextProvider = ({children}) => {
  const [authToken, setAuthToken] = React.useState(null);
  const [userdata, setUserData] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  function authenticate(token) {
    setAuthToken(token);
    AsyncStorage.setItem('authToken', token);
  }
  function fetchUserData(data) {
    AsyncStorage.setItem('userData', JSON.stringify(data));
    setUserData(data);
  }
  function logout() {
    setAuthToken(null);
    setIsLoading(true);
    AsyncStorage.removeItem('authToken');
    AsyncStorage.removeItem('socketId');
    AsyncStorage.removeItem('userData');
    setIsLoading(false);
  }

  async function isLoggedIn() {
    try {
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem('authToken');
      if (userToken && verifyToken(userToken)) {
        setAuthToken(userToken);
        const apiUrl = `${BASE_URL}/account/me`;
        try {
          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`,
            },
          });

          const json = await response.json();
          setIsLoading(false);
          if (json.success) {
            setIsLoading(false);
            setUserData(json.data.user);
          } else {
            return logout();
          }
        } catch (error) {
          console.log('Error 1', error.response.data);
        }
      } else {
        return logout();
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Get User Token Error', error);
    }
  }
  React.useEffect(() => {
    isLoggedIn();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        authToken,
        userdata,
        authenticate,
        fetchUserData,
        logout,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
