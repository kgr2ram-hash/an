import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import Navbar from './components/Navbar.jsx'
import NotificationBanner from './components/NotificationBanner.jsx'
import Footer from './components/Footer.jsx'
import MobileBottomNav from './components/MobileBottomNav.jsx'

// Core pages (loaded immediately)
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import Login from './admin/Login.jsx'

// Lazy-loaded pages (loaded on demand)
const Officials = lazy(() => import('./pages/Officials.jsx'))
const Jobs = lazy(() => import('./pages/Jobs.jsx'))
const Learn = lazy(() => import('./pages/Learn.jsx'))
const HealthCare = lazy(() => import('./pages/HealthCare.jsx'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail.jsx'))
const ServiceSubmit = lazy(() => import('./pages/ServiceSubmit.jsx'))
const BusSchedules = lazy(() => import('./pages/BusSchedules.jsx'))
const Events = lazy(() => import('./pages/Events.jsx'))
const Complaints = lazy(() => import('./pages/Complaints.jsx'))
const ContactDirectory = lazy(() => import('./pages/ContactDirectory.jsx'))
const Gallery = lazy(() => import('./pages/Gallery.jsx'))
const NewsFeed = lazy(() => import('./pages/NewsFeed.jsx'))
const ElectricityCalc = lazy(() => import('./pages/ElectricityCalc.jsx'))
const BloodDonors = lazy(() => import('./pages/BloodDonors.jsx'))
const FestivalCalendar = lazy(() => import('./pages/FestivalCalendar.jsx'))
const Tools = lazy(() => import('./pages/Tools.jsx'))
const BusTracking = lazy(() => import('./pages/BusTracking.jsx'))
const WaterTaxCalc = lazy(() => import('./pages/WaterTaxCalc.jsx'))
const GoldSilverPrice = lazy(() => import('./pages/GoldSilverPrice.jsx'))
const UserAuth = lazy(() => import('./pages/UserAuth.jsx'))
const UserProfile = lazy(() => import('./pages/UserProfile.jsx'))
const PropertyTaxCalc = lazy(() => import('./pages/PropertyTaxCalc.jsx'))
const EMICalculator = lazy(() => import('./pages/EMICalculator.jsx'))
const FDRDCalculator = lazy(() => import('./pages/FDRDCalculator.jsx'))
const IncomeTaxCalc = lazy(() => import('./pages/IncomeTaxCalc.jsx'))
const BMICalculator = lazy(() => import('./pages/BMICalculator.jsx'))
const Sports = lazy(() => import('./pages/Sports.jsx'))

// Lazy admin pages
const Dashboard = lazy(() => import('./admin/Dashboard.jsx'))
const ManageBusSchedules = lazy(() => import('./admin/ManageBusSchedules.jsx'))
const ManageServices = lazy(() => import('./admin/ManageServices.jsx'))
const ManageJobs = lazy(() => import('./admin/ManageJobs.jsx'))
const ManageHealthCare = lazy(() => import('./admin/ManageHealthCare.jsx'))
const ManageArticles = lazy(() => import('./admin/ManageArticles.jsx'))
const ManageOfficials = lazy(() => import('./admin/ManageOfficials.jsx'))
const ManageEmergencyNumbers = lazy(() => import('./admin/ManageEmergencyNumbers.jsx'))
const ManageHealthcareFacilities = lazy(() => import('./admin/ManageHealthcareFacilities.jsx'))
const ManageServiceSubmissions = lazy(() => import('./admin/ManageServiceSubmissions.jsx'))
const ManageCategories = lazy(() => import('./admin/ManageCategories.jsx'))
const SiteSettings = lazy(() => import('./admin/SiteSettings.jsx'))
const ManageEvents = lazy(() => import('./admin/ManageEvents.jsx'))
const ManageComplaints = lazy(() => import('./admin/ManageComplaints.jsx'))
const ManageContacts = lazy(() => import('./admin/ManageContacts.jsx'))
const ManageGallery = lazy(() => import('./admin/ManageGallery.jsx'))
const Analytics = lazy(() => import('./admin/Analytics.jsx'))
const BulkImportExport = lazy(() => import('./admin/BulkImportExport.jsx'))
const ManageUsers = lazy(() => import('./admin/ManageUsers.jsx'))
const ManageBloodDonors = lazy(() => import('./admin/ManageBloodDonors.jsx'))
const ManageReviews = lazy(() => import('./admin/ManageReviews.jsx'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-[#0C4A3E] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold mt-3" style={{ color: 'var(--c-text-muted)' }}>Loading...</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 antialiased">
      <Navbar />
      <NotificationBanner />
      <main className="flex-1 pb-[72px] md:pb-0">
        <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/officials" element={<Officials />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/healthcare" element={<HealthCare />} />
          <Route path="/services/submit" element={<ServiceSubmit />} />
          <Route path="/services/:category" element={<ServiceDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/bus-schedules" element={<BusSchedules />} />
          <Route path="/events" element={<Events />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/contacts" element={<ContactDirectory />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/news-feed" element={<NewsFeed />} />
          <Route path="/electricity-calculator" element={<ElectricityCalc />} />
          <Route path="/blood-donors" element={<BloodDonors />} />
          <Route path="/festival-calendar" element={<FestivalCalendar />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/login" element={<UserAuth />} />
          <Route path="/register" element={<UserAuth />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/bus-tracking" element={<BusTracking />} />
          <Route path="/water-tax-calculator" element={<WaterTaxCalc />} />
          <Route path="/gold-silver-price" element={<GoldSilverPrice />} />
          <Route path="/property-tax-calculator" element={<PropertyTaxCalc />} />
          <Route path="/emi-calculator" element={<EMICalculator />} />
          <Route path="/fd-rd-calculator" element={<FDRDCalculator />} />
          <Route path="/income-tax-calculator" element={<IncomeTaxCalc />} />
          <Route path="/bmi-calculator" element={<BMICalculator />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="import-export" element={<BulkImportExport />} />
            <Route path="bus-schedules" element={<ManageBusSchedules />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="services" element={<ManageServices />} />
            <Route path="jobs" element={<ManageJobs />} />
            <Route path="healthcare" element={<ManageHealthCare />} />
            <Route path="articles" element={<ManageArticles />} />
            <Route path="officials" element={<ManageOfficials />} />
            <Route path="emergency-numbers" element={<ManageEmergencyNumbers />} />
            <Route path="healthcare-facilities" element={<ManageHealthcareFacilities />} />
            <Route path="service-submissions" element={<ManageServiceSubmissions />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="complaints" element={<ManageComplaints />} />
            <Route path="contacts" element={<ManageContacts />} />
            <Route path="gallery" element={<ManageGallery />} />
            <Route path="blood-donors" element={<ManageBloodDonors />} />
            <Route path="reviews" element={<ManageReviews />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="settings" element={<SiteSettings />} />
          </Route>
        </Routes>
        </Suspense>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
    </ErrorBoundary>
  )
}

export default App
