import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PageType = 
  | 'startup'
  | 'homepage' 
  | 'auth-landing'
  | 'dealer-login'
  | 'mentor-login'
  | 'signup'
  | 'forgot-password'
  | 'client-profile'
  | 'mentor-selection'
  | 'mentor-detail'
  | 'client-profile-with-mentor';

export type UserType = 'client' | 'dealer' | 'mentor' | null;

interface NavigationContextType {
  currentPage: PageType;
  userType: UserType;
  isAuthenticated: boolean;
  selectedMentor: any;
  navigateTo: (page: PageType) => void;
  setUserType: (type: UserType) => void;
  setAuthenticated: (auth: boolean) => void;
  setSelectedMentor: (mentor: any) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('startup');
  const [userType, setUserType] = useState<UserType>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
  };

  const setAuthenticated = (auth: boolean) => {
    setIsAuthenticated(auth);
  };

  return (
    <NavigationContext.Provider value={{
      currentPage,
      userType,
      isAuthenticated,
      selectedMentor,
      navigateTo,
      setUserType,
      setAuthenticated,
      setSelectedMentor
    }}>
      {children}
    </NavigationContext.Provider>
  );
};
