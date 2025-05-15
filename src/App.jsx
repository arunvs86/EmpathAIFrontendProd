import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomeLayout from "./layout/HomeLayout";
import Therapists from "./pages/Therapists";          
import TherapistDetail from "./pages/TherapistDetail"; 
import ChatDetail from "./pages/ChatDetail";
import ChatList from "./pages/ChatList";
import ProfileJournals from "./components/ProfileJournal";
import MyProfile from "./pages/MyProfile";
import ProfilePosts from "./pages/ProfilePosts";
// (you’ll create the other 3 soon)
// import ProfileCommunities from "./pages/ProfileCommunities";
// import ProfileHabits from "./pages/ProfileHabits";
// Child pages for inside HomeLayout
import MainContent from "./components/MainContent";
import CreatePost from "./components/CreatePost";
import CommunityView from "./components/CommunityView";
import CommunityDetail from "./components/CommunityDetail";
import TherapistAppointments from "./pages/TherapistAppointment";
import TherapistAvailabilityForm from "./pages/TherapistAvailabilityForm";
import ResetPassword from "./pages/ResetPassword";
import LetterToLovedOne from "./pages/Letter";
import LetterView from "./components/LetterView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signup/:type" element={<Signup />} />
        <Route path="/" element={<HomeLayout />}>
          {/* Nested routes rendered in HomeLayout's <Outlet /> */}
          <Route index element={<MainContent />} />
          <Route path="create" element={<CreatePost />} />
          <Route path="communities" element={<CommunityView />} />
          <Route path="communities/:id" element={<CommunityDetail />} />
          {/* <Route path="messages" element={<Messages />} /> */}
          {/* Add other routes as needed */}
          
          <Route path="/letter" element={<LetterToLovedOne />} />
          <Route path="/letterView" element={<LetterView />} />


        <Route path="/therapists" element={<Therapists />} />
        <Route path="/therapist/appointments" element={<TherapistAppointments />} />
        <Route path="/therapist/availability" element={<TherapistAvailabilityForm />} />
        <Route path="/therapists/:id" element={<TherapistDetail />} />
        <Route path="/chats" element={<ChatList />} />
        <Route path="/chats/:chatId" element={<ChatDetail />} />
        <Route path="/profile/:userId/journals" element={<ProfileJournals />} />
        <Route path="/profile/:userId" element={<MyProfile />} />

        <Route path="/profile/:userId" element={<MyProfile />}>
        <Route index element={<ProfilePosts />} />
        <Route path="posts" element={<ProfilePosts />} />
        <Route path="journals" element={<ProfileJournals />} />
        {/* <Route path="communities" element={<ProfileCommunities />} />
        <Route path="habits" element={<ProfileHabits />} /> */}
      </Route>
      
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;
