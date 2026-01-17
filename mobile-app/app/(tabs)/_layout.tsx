import { Tabs } from 'expo-router';
import { Home as HomeIcon, PlusCircle, User } from 'lucide-react-native';
import { Text, View } from 'react-native';

function Icon({ name, focused }: { name: string; focused: boolean }) {
  if (name === 'home') return <HomeIcon size={24} color={focused ? '#10b981' : '#999'} />;
  if (name === 'create') return <PlusCircle size={24} color={focused ? '#10b981' : '#999'} />;
  return <User size={24} color={focused ? '#10b981' : '#999'} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 8 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <Icon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ focused }) => <Icon name="create" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <Icon name="profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}