import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
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

import MainContent from "./components/MainContent";
import CreatePost from "./components/CreatePost";
import CommunityView from "./components/CommunityView";
import CommunityDetail from "./components/CommunityDetail";
import TherapistAppointments from "./pages/TherapistAppointment";
import TherapistAvailabilityForm from "./pages/TherapistAvailabilityForm";
import ResetPassword from "./pages/ResetPassword";
import LetterToLovedOne from "./pages/Letter";
import LetterView from "./components/LetterView";
import LetterComposer from "./components/LetterComposer";
import LettersPage from './pages/LettersPage';
import UserDetail from './pages/UserDetail';
import SentimentLiftDetail from "./pages/SentimentLiftDetail";
import CommunityList from "./components/CommunityList";
import CreateCommunity from "./components/CreateCommunity";
import ProfileHabits from "./pages/ProfileHabits";
import ProfileWeeklyHabits from "./pages/ProfileWeeklyHabits";
import MindfulMeditationPage from "./pages/MindfulMeditation";
import ReligiousPracticesPage from "./pages/ReligiousPracticesPage";
// 
// Dashboard
//

import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardPage from './pages/DashboardPage';

// // Detail pages (we'll build these in the next steps)
 import UserSummaryDetail from './pages/UserSummaryDetail';
 import RetentionDetail from './pages/RetentionDetail';
 import SessionsDetail from './pages/SessionsDetail';
 import ChatOverviewDetail from './pages/ChatOverviewDetail';
 import SentimentShiftDetail from './pages/SentimentShiftDetail';
 import MediaBreakdownDetail from './pages/MediaBreakdownDetail';
 import TherapyFunnelDetail from './pages/TherapyFunnelDetail';
 import LeadTimeDetail from './pages/LeadTimeDetail';
 import TherapistRatingsDetail from './pages/TherapistRatingsDetail';
 import JournalVolumeDetail from './pages/JournalVolumeDetail';
 import JournalSentimentDetail from './pages/JournalSentimentDetail';
 import JournalTagsDetail from './pages/JournalTagsDetail';
 import CommunityPostsDetail from './pages/CommunityPostsDetail';
 import ViolationsDetail from './pages/ViolationsDetail';
 import AdminActionsDetail from './pages/AdminActionsDetail';
import PlantSaplingPage from "./pages/PlantSaplingPage";
import WellnessTipsPage from "./pages/WellnessTipsPage";
import AboutAppPage from "./pages/AboutAppPage";
import UserAppointments from "./pages/UserAppointments";
import TherapistAppointmentsPage from "./pages/TherapistAppointments";
// import MoodTrendsDetail from './pages/MoodTrendsDetail';
// import MoodCorrelationDetail from './pages/MoodCorrelationDetail';
import PrivateRoute from "./components/PrivateRoute"; // Import it at the top

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signup/:type" element={<Signup />} />

        <Route element={<PrivateRoute />}>
        <Route path="/" element={<HomeLayout />}>


        {/* Dashboard parent route */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Overview */}
          <Route index element={<DashboardPage />} />

          <Route path="users/summary"      element={<UserSummaryDetail />} /> 
          <Route path="users/retention"    element={<RetentionDetail />} />
          <Route path="users/sessions"     element={<SessionsDetail />} />
          <Route path="users/detail/:userId" element={<UserDetail />} />

          <Route path="chat/overview"       element={<ChatOverviewDetail />} />
          <Route path="chat/sentiment-shift"element={<SentimentShiftDetail />} />
          <Route path="chat/media-breakdown"element={<MediaBreakdownDetail />} />

          <Route path="therapy/funnel"     element={<TherapyFunnelDetail />} />
          <Route path="therapy/lead-time"  element={<LeadTimeDetail />} />
          <Route path="therapy/ratings"    element={<TherapistRatingsDetail />} />

          <Route path="journal/volume"     element={<JournalVolumeDetail />} />
          <Route path="journal/sentiment"  element={<JournalSentimentDetail />} />
          <Route path="journal/tags"       element={<JournalTagsDetail />} />

          <Route path="community/posts"    element={<CommunityPostsDetail />} />
          <Route path="moderation/violations" element={<ViolationsDetail />} />
          <Route path="moderation/actions" element={<AdminActionsDetail />} />
          <Route path="sentiment/lift" element={<SentimentLiftDetail />} />

          {/*<Route path="mood/trends"        element={<MoodTrendsDetail />} />
          <Route path="mood/correlation"   element={<MoodCorrelationDetail />} />   
           */}
        </Route>

        <Route
            path="faith"
            element={
              // Option A: just reuse MainContent (which auto-filters on /faith)
              <MainContent />
            }
          />
          {/* Nested routes rendered in HomeLayout's <Outlet /> */}
          <Route index element={<MainContent />} />
          <Route path="create" element={<CreatePost />} />
          {/* <Route path="communities" element={<CommunityView />} />
          <Route path="communities/:id" element={<CommunityDetail />} /> */}
          <Route path="communities" element={<CommunityList />} />
          <Route path="communities/create" element={<CreateCommunity />} />
          <Route path="communities/:id" element={<CommunityDetail />} />
          {/* <Route path="messages" element={<Messages />} /> */}
          {/* Add other routes as needed */}
          
          <Route path="/letter" element={<LetterComposer />} />
          <Route path="/letters" element={<LettersPage />} />
          <Route path="/letters/:id" element={<LetterView />} />

          <Route path="/mindful-meditation" element={<MindfulMeditationPage />} />
          <Route path="/plant-sapling" element={<PlantSaplingPage />} />
          <Route path="/wellness-tips" element={<WellnessTipsPage />} />
          <Route path="/spiritual" element={<ReligiousPracticesPage/>} />
          <Route path="/about" element={<AboutAppPage/>} />



        <Route path="/therapists" element={<Therapists />} />
        <Route path="/therapist/appointments" element={<TherapistAppointments />} />
        <Route path="/therapist/availability" element={<TherapistAvailabilityForm />} />
        <Route path="/therapists/:id" element={<TherapistDetail />} />
        <Route path="/appointments" element={<UserAppointments />} />
        <Route path="/therapist/appointments" element={<TherapistAppointments />} />
        <Route path="/chats" element={<ChatList />} />
        <Route path="/chats/:chatId" element={<ChatDetail />} />
        {/* <Route path="/profile/:userId/journals" element={<ProfileJournals />} />
        <Route path="/profile/:userId" element={<MyProfile />} />

        <Route path="/profile/:userId" element={<MyProfile />}>
        <Route index element={<ProfilePosts />} />
        <Route path="posts" element={<ProfilePosts />} />
        <Route path="journals" element={<ProfileJournals />} />
        <Route path="/profile/:userId/habits" element={<ProfileWeeklyHabits />} /> */}

      <Route path="/profile/:userId" element={<MyProfile />}>
        {/* Default to Posts */}
        <Route index element={<ProfilePosts />} />

        {/* Tabs under the same parent */}
        <Route path="posts"       element={<ProfilePosts />} />
        <Route path="journals"    element={<ProfileJournals />} />
        <Route path="communities" element={<CommunityList />} />
        <Route path="habits"      element={<ProfileWeeklyHabits />} />

        {/* Catch‐all redirect back to posts */}
        <Route path="*" element={<Navigate to="posts" replace />} />
      </Route>
        

        {/* <Route path="communities" element={<ProfileCommunities />} />
        <Route path="habits" element={<ProfileHabits />} /> */}
      </Route>
      </Route>

        
      </Routes>
    </Router>
  );
}

export default App;
