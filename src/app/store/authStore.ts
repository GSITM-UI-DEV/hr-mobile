import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
// auth status로 protected route에서 리디렉션 처리할것

/* 인증 상태 */
// type TwoFactorAuth = {
//   username: string;
//   coCode: string;
//   sndConfirmKey: string;
// }

// type Jwt = {
//   jwt: string;
// }



/* 인증 정보 */
type Auth = {
  coCode: string;
  username: string;
  resultCode: string;
  sndConfirmKey: string;
}

type Auth2FA = {
  sndRsltCode?: string;
  // "X-AUTH-TOKEN"?: string;
}


interface AuthState {
  // coCode: string | null;
  // username: string | null;
  // resultCode: string | null;
  auth: Auth | null;
  auth2FA: Auth2FA | null;
  savedUser: string | null;
  setAuth: (auth: Auth) => void;
  setAuth2FA: (auth2FA: Auth2FA) => void;
  saveUsername: (username: string) => void;
  clearUsername: () => void;
	// setToken: (jwt: Jwt) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      // coCode: null,
      // username: null,
      // resultCode: null,
      auth: null,
      auth2FA: null,
      savedUser: null,
      // jwt: null,
      setAuth: (auth) => set({ auth }),
      setAuth2FA: (auth2FA) => set({ auth2FA }),
      // setToken: (jwt) => set({ jwt }),
      saveUsername: (username) => set({ savedUser: username }),
      clearUsername: () => set({ savedUser: null }),
      logout: () => set({ auth: null, auth2FA: null, savedUser: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  )
)












/* 유저 상태 */
// type User = {
//   id: number;
//   name: string;
//   username: string;
// }

// interface userState {
//   user: User | null;
//   setUser: (user: User) => void;
//   saveUser: (user: User) => void;
// }

// export const useUserStore = create<userState>((set) => ({
//   user: null,
//   setUser: (user) => set({ user }),
//   saveUser: (user) => localStorage.setItem('user', user.username ),
// }));



/* 메뉴 상태 */
interface NavigationState {
  isNavOpen: boolean;
  toggleNav: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  isNavOpen: false,
  toggleNav: () => set((state) => ({ isNavOpen: !state.isNavOpen })),
}));


/* 현재 날짜 세팅 */
interface DateStore {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

export const useDateStore = create<DateStore>((set) => ({
  currentDate: new Date(),
  setCurrentDate: (date) => set({ currentDate: date }),
}))