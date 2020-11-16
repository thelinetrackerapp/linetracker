import React, { useState, useEffect, useContext } from 'react';
import CookieManager from '@react-native-community/cookies';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import createQueue from '../../functions/task-queue';

const BASE_URL = 'https://store.line.me';

export function useUser() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [friends, setFriends] = useState([]);
  const [blockedFriends, setBlockedFriends] = useState([]);
  const [progress, setProgress] = useState(new Set());

  useEffect(() => {
    AsyncStorage.getItem('friends').then((str) => {
      const data = str ? JSON.parse(str) : [];
      setFriends(data);
    });
    AsyncStorage.getItem('blockedFriends').then((str) => {
      const data = str ? JSON.parse(str) : [];
      setBlockedFriends(data);
    });
    AsyncStorage.getItem('progress').then((str) => {
      const data = str ? JSON.parse(str) : [];
      setProgress(new Set(data));
    });
  }, []);

  useEffect(() => {
    (async () => {
      await AsyncStorage.setItem('friends', JSON.stringify(friends));
    })();
  }, [friends]);

  useEffect(() => {
    (async () => {
      await AsyncStorage.setItem('blockedFriends', JSON.stringify(blockedFriends));
    })();
  }, [blockedFriends]);

  useEffect(() => {
    (async () => {
      await AsyncStorage.setItem('progress', JSON.stringify([...progress]));
    })();
  }, [progress]);

  async function checkAuthentication() {
    const cookies = await CookieManager.get(BASE_URL, true);
    const hasAuthenticatedKey = 'ss' in cookies;
    if (hasAuthenticatedKey) {
      setIsAuthenticated(true);
      await fetchProfileInfo();
    }
  }

  async function fetchProfileInfo() {
    const cookie = await getAuthCookiesStr();
    const url = BASE_URL + '/mypage/PAYMENT/en';
    return axios
      .get(url, {
        headers: {
          cookie,
        },
      })
      .then((res) => res.data)
      .then((html) => {
        const i = html.indexOf('https://profile.line-scdn.net');
        const j = html.indexOf('/large"', i);
        const profilePic = html.substring(i, j);
        const nameTag = '<h2 class="myCMN18Id">';
        const p = html.indexOf(nameTag);
        const q = html.indexOf('</h2>', p);
        const name = html.substring(p + nameTag.length, q);
        return {
          name,
          profilePic,
        };
      })
      .then((data) => {
        if (data.name && data.profilePic) {
          setUser(data);
        }
        return data;
      });
  }

  async function logout() {
    const cookie = await getAuthCookiesStr();
    const url = BASE_URL + '/logout/en';
    await axios.get(url, {
      headers: {
        cookie,
      },
    });
    await CookieManager.clearAll(true);
    await AsyncStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
    setFriends([]);
    setBlockedFriends([]);
    setProgress(new Set());
  }

  async function getAuthCookiesStr() {
    const cookies = {
      ...(await CookieManager.get(BASE_URL, true)),
      store_lang: {
        name: 'store_lang',
        value: 'en-us',
      },
    };
    const cookieStr = Object.values(cookies)
      .map(({ name, value }) => `${name}=${value};`)
      .join(' ');
    return cookieStr;
  }

  async function fetchFriends() {
    const cookie = await getAuthCookiesStr();
    const url = BASE_URL + '/api/present/friends/en';
    return axios
      .get(url, {
        headers: {
          cookie,
          'x-requested-with': 'XMLHttpRequest',
        },
      })
      .then((res) => res.data)
      .then((data) => {
        setFriends(data);
        return data;
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
  }

  async function fetchBlockedFriends(theFriends) {
    const cookie = await getAuthCookiesStr();
    const concurrency = 10;
    const queue = createQueue(({ friend }) => {
      const url = `https://store.line.me/emojishop/payment?id=5f420887835232327f59fc4d&confirmedPrice=NT%2430&presentTemplateId=0&toUserMid=${friend.midCrypted}`;
      return axios
        .get(url, {
          headers: {
            'accept-language': 'en-us',
            cookie,
          },
        })
        .then((res) => res.data)
        .then((html) => {
          const blockingSign = 'already has this item';
          if (html.indexOf(blockingSign) >= 0) {
            setBlockedFriends((data) => [...data, friend]);
          }
        })
        .catch(console.log)
        .finally(() => {
          setProgress((data) => new Set([...data, friend.midCrypted]));
        });
    }, concurrency);
    setProgress(new Set());
    setBlockedFriends([]);
    const args = theFriends.map((friend) => ({ friend }));
    return queue.push(...args);
  }

  return {
    user,
    isAuthenticated,
    progress,
    friends,
    blockedFriends,
    checkAuthentication,
    logout,
    fetchProfileInfo,
    fetchFriends,
    fetchBlockedFriends,
  };
}

export const UserContext = React.createContext();

export function UserContextProvider({ children }) {
  const contextValue = useUser();
  // prettier-ignore
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
