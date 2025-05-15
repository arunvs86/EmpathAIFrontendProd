// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const NotificationPopup = ({ message, type, onClose }) => {
//   const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
//   const borderColor = type === "success" ? "border-green-400" : "border-red-400";
//   const textColor = type === "success" ? "text-green-700" : "text-red-700";

//   return (
//     <div
//       className={`${bgColor} ${borderColor} ${textColor} border px-4 py-3 rounded relative mb-4`}
//       role="alert"
//     >
//       <span className="block sm:inline">{message}</span>
//       <span
//         onClick={onClose}
//         className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
//       >
//         <svg
//           className="fill-current h-6 w-6"
//           role="button"
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 20 20"
//         >
//           <title>Close</title>
//           <path d="M14.348 5.652a1 1 0 10-1.414-1.414L10 7.172 7.066 4.238a1 1 0 10-1.414 1.414L8.586 8.586 5.652 11.52a1 1 0 101.414 1.414L10 9.999l2.934 2.935a1 1 0 101.414-1.414L11.414 8.586l2.934-2.934z" />
//         </svg>
//       </span>
//     </div>
//   );
// };

// const Signup = () => {
//   const { type } = useParams();
//   const navigate = useNavigate();

//   const [notification, setNotification] = useState(null);

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     dob: "",
//     gender: "",
//     location: "",
//     bio: "",
//     religious_support: false,
//     // Therapist Fields
//     specialization_tags: "",
//     experience_years: "",
//     license_number: "",
//     languages_spoken: "",
//     session_duration: "",
//     appointment_types: "",
//     availability_preference: "weekly_schedule",
//     // Admin Fields 
//     permissions: {
//       ban_users: true,
//       remove_posts: true,
//       approve_therapists: true,
//     },
//     // Bot Fields 
//     bot_type: "chatbot",
//   });

//   const handleChange = (e) => {
//     const { name, value, type: inputType, checked } = e.target;
//     if (inputType === "checkbox") {
//       if (name in formData.permissions) {
//         setFormData({
//           ...formData,
//           permissions: { ...formData.permissions, [name]: checked },
//         });
//       } else {
//         setFormData({ ...formData, [name]: checked });
//       }
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let payload = {};
//     const userData = {
//       username: formData.username,
//       email: formData.email,
//       password: formData.password,
//       dob: formData.dob,
//       gender: formData.gender,
//       location: formData.location,
//       bio: formData.bio,
//       religious_support: formData.religious_support,
//       role: type,
//     };

//     if (type === "therapist") {
//       const roleData = {
//         specialization_tags: formData.specialization_tags
//           .split(",")
//           .map((s) => s.trim())
//           .filter(Boolean),
//         experience_years: Number(formData.experience_years),
//         license_number: formData.license_number,
//         languages_spoken: formData.languages_spoken
//           .split(",")
//           .map((s) => s.trim())
//           .filter(Boolean),
//         session_duration: Number(formData.session_duration),
//         appointment_types: formData.appointment_types
//           .split(",")
//           .map((s) => s.trim())
//           .filter(Boolean),
//         availability_preference: formData.availability_preference,
//       };
//       payload = { userData, roleData };
//     } else {
//       payload = { userData };
//     }

//     try {
//       const response = await fetch("https://empathaiv2-backend.onrender.com/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Signup failed");
//       }
//       const result = await response.json();
//       setNotification({
//         message: result.message || "Signup successful!",
//         type: "success",
//       });

//       setTimeout(() => {
//         navigate("/login");
//       }, 2000);
//     } catch (error) {
//       setNotification({ message: error.message, type: "error" });
//     }
//   };

//   useEffect(() => {
//     if (notification) {
//       const timer = setTimeout(() => {
//         setNotification(null);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <div className="w-full max-w-2xl bg-white shadow-md rounded-md px-8 py-6">
//         <div className="mb-6 text-center">
//           <h1 className="text-4xl font-bold text-emerald-600">Welcome to EmpathAI</h1>
//           <p className="text-gray-600 mt-2">
//             Connecting hearts with empathy. Join us to share, support, and heal.
//           </p>
//         </div>
//         {notification && (
//           <NotificationPopup
//             message={notification.message}
//             type={notification.type}
//             onClose={() => setNotification(null)}
//           />
//         )}
//         <h2 className="text-3xl font-bold mb-8 text-center capitalize text-emerald-600">
//           Sign Up
//         </h2>
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Username */}
//             <div>
//               <label
//                 htmlFor="username"
//                 className="block text-gray-700 font-semibold mb-2"
//               >
//                 Username
//               </label>
//               <input
//                 type="text"
//                 id="username"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 required
//                 className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
//               />
//             </div>
//             {/* Email */}
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-gray-700 font-semibold mb-2"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
//               />
//             </div>
//             {/* Password */}
//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-gray-700 font-semibold mb-2"
//               >
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
//               />
//             </div>
//             {/* Date of Birth */}
//             <div>
//               <label
//                 htmlFor="dob"
//                 className="block text-gray-700 font-semibold mb-2"
//               >
//                 Date of Birth
//               </label>
//               <input
//                 type="date"
//                 id="dob"
//                 name="dob"
//                 value={formData.dob}
//                 onChange={handleChange}
//                 required
//                 className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
//               />
//             </div>
//             {/* Gender */}
//             <div>
//               <label
//                 htmlFor="gender"
//                 className="block text-gray-700 font-semibold mb-2"
//               >
//                 Gender
//               </label>
//               <select
//                 id="gender"
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
//               >
//                 <option value="">Select Gender</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//                 <option value="non-binary">Non-binary</option>
//                 <option value="prefer not to say">
//                   Prefer not to say
//                 </option>
//               </select>
//             </div>
//             {/* Location */}
//             <div>
//               <label
//                 htmlFor="location"
//                 className="block text-gray-700 font-semibold mb-2"
//               >
//                 Location
//               </label>
//               <input
//                 type="text"
//                 id="location"
//                 name="location"
//                 value={formData.location}
//                 onChange={handleChange}
//                 placeholder="City, Country"
//                 className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
//               />
//             </div>
//             {/* Religious Support */}
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 id="religious_support"
//                 name="religious_support"
//                 checked={formData.religious_support}
//                 onChange={handleChange}
//                 className="mr-2"
//               />
//               <label
//                 htmlFor="religious_support"
//                 className="text-gray-700 font-semibold"
//               >
//                 Require Religious Support
//               </label>
//             </div>
//             {/* Bio */}
//             <div className="md:col-span-2">
//               <label
//                 htmlFor="bio"
//                 className="block text-gray-700 font-semibold mb-2"
//               >
//                 Bio
//               </label>
//               <textarea
//                 id="bio"
//                 name="bio"
//                 value={formData.bio}
//                 onChange={handleChange}
//                 placeholder="Tell us about yourself..."
//                 rows="3"
//                 className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
//               ></textarea>
//             </div>
//           </div>

//           {/* Therapist Details */}
//           {type === "therapist" && (
//             <div className="mt-8">
//               <h2 className="text-2xl font-bold mb-4">Therapist Details</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Specialization Tags */}
//                 <div>
//                   <label
//                     htmlFor="specialization_tags"
//                     className="block text-gray-700 font-semibold mb-2"
//                   >
//                     Specialization Tags{" "}
//                     <span className="text-xs text-gray-500">
//                       (comma separated)
//                     </span>
//                   </label>
//                   <input
//                     type="text"
//                     id="specialization_tags"
//                     name="specialization_tags"
//                     value={formData.specialization_tags}
//                     onChange={handleChange}
//                     required
//                     className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
//                   />
//                 </div>
//                 {/* Experience Years */}
//                 <div>
//                   <label
//                     htmlFor="experience_years"
//                     className="block text-gray-700 font-semibold mb-2"
//                   >
//                     Experience (Years)
//                   </label>
//                   <input
//                     type="number"
//                     id="experience_years"
//                     name="experience_years"
//                     value={formData.experience_years}
//                     onChange={handleChange}
//                     min="0"
//                     required
//                     className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
//                   />
//                 </div>
//                 {/* License Number */}
//                 <div>
//                   <label
//                     htmlFor="license_number"
//                     className="block text-gray-700 font-semibold mb-2"
//                   >
//                     License Number
//                   </label>
//                   <input
//                     type="text"
//                     id="license_number"
//                     name="license_number"
//                     value={formData.license_number}
//                     onChange={handleChange}
//                     required
//                     className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
//                   />
//                 </div>
//                 {/* Languages Spoken */}
//                 <div>
//                   <label
//                     htmlFor="languages_spoken"
//                     className="block text-gray-700 font-semibold mb-2"
//                   >
//                     Languages Spoken{" "}
//                     <span className="text-xs text-gray-500">
//                       (comma separated)
//                     </span>
//                   </label>
//                   <input
//                     type="text"
//                     id="languages_spoken"
//                     name="languages_spoken"
//                     value={formData.languages_spoken}
//                     onChange={handleChange}
//                     required
//                     className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
//                   />
//                 </div>
//                 {/* Session Duration */}
//                 <div>
//                   <label
//                     htmlFor="session_duration"
//                     className="block text-gray-700 font-semibold mb-2"
//                   >
//                     Session Duration (mins)
//                   </label>
//                   <input
//                     type="number"
//                     id="session_duration"
//                     name="session_duration"
//                     value={formData.session_duration}
//                     onChange={handleChange}
//                     min="15"
//                     required
//                     className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
//                   />
//                 </div>
//                 {/* Appointment Types */}
//                 <div>
//                   <label
//                     htmlFor="appointment_types"
//                     className="block text-gray-700 font-semibold mb-2"
//                   >
//                     Appointment Types{" "}
//                     <span className="text-xs text-gray-500">
//                       (comma separated, e.g., text, voice, video)
//                     </span>
//                   </label>
//                   <input
//                     type="text"
//                     id="appointment_types"
//                     name="appointment_types"
//                     value={formData.appointment_types}
//                     onChange={handleChange}
//                     required
//                     className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
//                   />
//                 </div>
//                 {/* Availability Preference */}
//                 <div>
//                   <label
//                     htmlFor="availability_preference"
//                     className="block text-gray-700 font-semibold mb-2"
//                   >
//                     Availability Preference
//                   </label>
//                   <select
//                     id="availability_preference"
//                     name="availability_preference"
//                     value={formData.availability_preference}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
//                   >
//                     <option value="weekly_schedule">Weekly Schedule</option>
//                     <option value="custom_dates">Custom Dates</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="mt-8 flex justify-center">
//             <button
//               type="submit"
//               className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
//             >
//               Sign Up
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Signup;


// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import CreatableSelect from 'react-select/creatable';


// // NotificationPopup component
// const NotificationPopup = ({ message, type, onClose }) => {
//   const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
//   const borderColor = type === "success" ? "border-green-400" : "border-red-400";
//   const textColor = type === "success" ? "text-green-700" : "text-red-700";
//   return (
//     <div
//       className={`${bgColor} ${borderColor} ${textColor} border px-4 py-3 rounded relative mb-4`}
//       role="alert"
//     >
//       <span className="block sm:inline">{message}</span>
//       <span
//         onClick={onClose}
//         className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer text-xl"
//       >
//         &times;
//       </span>
//     </div>
//   );
// };



// const SPECIALIZATIONS = [
//   { value: "Anxiety", label: "Anxiety" },
//   { value: "Depression", label: "Depression" },
//   { value: "Grief", label: "Grief" },
//   { value: "Stress", label: "Stress" },
//   { value: "Trauma", label: "Trauma" },
//   { value: "Relationship", label: "Relationship" },
//   { value: "Addiction", label: "Addiction" },
// ];

// const LANGUAGES = [
//   { value: "English", label: "English" },
//   { value: "Spanish", label: "Spanish" },
//   { value: "French", label: "French" },
//   { value: "German", label: "German" },
//   { value: "Mandarin", label: "Mandarin" },
//   { value: "Hindi", label: "Hindi" },
// ];

// const PERMISSIONS = [
//   "ban_users",
//   "remove_posts",
//   "approve_therapists",
// ];

// const BOT_TYPES = [
//   { value: "chatbot", label: "Chatbot" },
//   { value: "moderation_bot", label: "Moderation Bot" },
//   { value: "recommendation_ai", label: "Recommendation AI" },
// ];

// const feelingsOptions = [
//   "Anxiety",
//   "Depression",
//   "Denial",
//   "Grief",
//   "Stress",
//   "Loneliness",
//   "Anger",
//   "Fear",
// ];

// const Signup = () => {
//   const { type } = useParams();
//   const navigate = useNavigate();

//   const [notification, setNotification] = useState(null);
//   const [countries, setCountries] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [maxDOB, setMaxDOB] = useState('');

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     dob: "",
//     gender: "",
//     country: "",
//     city: "",
//     bio: "",
//     faith_support: false,
//     showFeelings: false,
//     current_feelings: [],
//     specialization_tags: [],
//     experience_years: "",
//     license_number: "",
//     languages_spoken: [],
//     session_duration: "",
//     appointment_types: [],
//     availability_preference: "weekly_schedule",
//     permissions: [],
//     bot_type: "",
//   });

//   useEffect(() => {
//     // compute max DOB for age >=14
//     const today = new Date();
//     const minAgeDate = new Date(
//       today.getFullYear() - 14,
//       today.getMonth(),
//       today.getDate()
//     );
//     setMaxDOB(minAgeDate.toISOString().split('T')[0]);

//     // fetch countries
//     fetch("https://countriesnow.space/api/v0.1/countries/iso")
//       .then(res => res.json())
//       .then(data => {
//         if (data.data) {
//           setCountries(data.data.map(c => c.name).sort());
//         }
//       })
//       .catch(console.error);
//   }, []);

//   useEffect(() => {
//     if (!formData.country) return setCities([]);
//     fetch("https://countriesnow.space/api/v0.1/countries/cities", {
//       method: "POST",
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ country: formData.country }),
//     })
//       .then(res => res.json())
//       .then(data => {
//         if (Array.isArray(data.data)) setCities(data.data.sort());
//       })
//       .catch(console.error);
//   }, [formData.country]);

//   const handleChange = e => {
//     const { name, type: t, checked, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: t === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleCreatable = (name, selected) => {
//     setFormData(prev => ({
//       ...prev,
//       [name]: selected ? selected.map(s => s.value) : [],
//     }));
//   };

//   const toggleList = (field, item) => {
//     setFormData(prev => {
//       const list = prev[field] || [];
//       return {
//         ...prev,
//         [field]: list.includes(item)
//           ? list.filter(i => i !== item)
//           : [...list, item],
//       };
//     });
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     // dob validation
//     if (formData.dob > maxDOB) {
//       setNotification({ message: 'You must be at least 14 years old.', type: 'error' });
//       return;
//     }

//     const userData = {
//       username: formData.username,
//       email: formData.email,
//       password: formData.password,
//       dob: formData.dob,
//       gender: formData.gender,
//       country: formData.country,
//       city: formData.city,
//       bio: formData.bio,
//       religious_support: formData.faith_support,
//       faith_support: formData.faith_support,
//       current_feelings: formData.showFeelings ? formData.current_feelings : [],
//       role: type,
//     };

//     let payload = { userData };
//     if (type === 'therapist') {
//       payload.roleData = {
//         specialization_tags: formData.specialization_tags,
//         experience_years: Number(formData.experience_years),
//         license_number: formData.license_number,
//         languages_spoken: formData.languages_spoken,
//         session_duration: Number(formData.session_duration),
//         appointment_types: formData.appointment_types,
//         availability_preference: formData.availability_preference,
//       };
//     } else if (type === 'admin') {
//       payload.roleData = { permissions: formData.permissions };
//     } else if (type === 'bot') {
//       payload.roleData = { bot_type: formData.bot_type };
//     }

//     try {
//       const res = await fetch('https://empathaiv2-backend.onrender.com/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) throw new Error((await res.json()).message);
//       setNotification({ message: 'Signup successful!', type: 'success' });
//       setTimeout(() => navigate('/login'), 2000);
//     } catch (err) {
//       setNotification({ message: err.message, type: 'error' });
//     }
//   };

//   useEffect(() => {
//     if (!notification) return;
//     const timer = setTimeout(() => setNotification(null), 5000);
//     return () => clearTimeout(timer);
//   }, [notification]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <div className="w-full max-w-2xl bg-white shadow-md rounded-md px-8 py-6">
//         <h1 className="text-4xl font-bold text-emerald-600 text-center mb-4">Sign Up</h1>
//         {notification && (
//           <NotificationPopup
//             message={notification.message}
//             type={notification.type}
//             onClose={() => setNotification(null)}
//           />
//         )}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Username */}
//             <div>
//               <label className="block text-gray-700">Username</label>
//               <input
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 required
//                 className="w-full border rounded px-3 py-2"
//               />
//             </div>
//             {/* Email */}
//             <div>
//               <label className="block text-gray-700">Email</label>
//               <input
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 className="w-full border rounded px-3 py-2"
//               />
//             </div>
//             {/* Password */}
//             <div>
//               <label className="block text-gray-700">Password</label>
//               <input
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className="w-full border rounded px-3 py-2"
//               />
//             </div>
//             {/* DOB */}
//             <div>
//               <label className="block text-gray-700">Date of Birth</label>
//               <input
//                 name="dob"
//                 type="date"
//                 max={maxDOB}
//                 value={formData.dob}
//                 onChange={handleChange}
//                 required
//                 className="w-full border rounded px-3 py-2"
//               />
//             </div>
//             {/* Gender */}
//             <div>
//               <label className="block text-gray-700">Gender</label>
//               <select
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 className="w-full border rounded px-3 py-2"
//               >
//                 <option value="">Select Gender</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//                 <option value="non-binary">Non-binary</option>
//                 <option value="prefer not to say">Prefer not to say</option>
//               </select>
//             </div>
//             {/* Country */}
//             <div>
//               <label className="block text-gray-700">Country</label>
//               <select
//                 name="country"
//                 value={formData.country}
//                 onChange={handleChange}
//                 required
//                 className="w-full border rounded px-3 py-2"
//               >
//                 <option value="">Select Country</option>
//                 {countries.map(c => <option key={c} value={c}>{c}</option>)}
//               </select>
//             </div>
//             {/* City */}
//             <div>
//               <label className="block text-gray-700">City</label>
//               <select
//                 name="city"
//                 value={formData.city}
//                 onChange={handleChange}
//                 required
//                 disabled={!cities.length}
//                 className="w-full border rounded px-3 py-2"
//               >
//                 <option value="">Select City</option>
//                 {cities.map(c => <option key={c} value={c}>{c}</option>)}
//               </select>
//             </div>
//           </div>

//           {/* Bio */}
//           <div>
//             <label className="block text-gray-700">Tell us a bit about yourself so that we can curate better content for you</label>
//             <textarea
//               name="bio"
//               rows={3}
//               value={formData.bio}
//               onChange={handleChange}
//               className="w-full border rounded px-3 py-2"
//             />
//           </div>

//           {/* Faith Support */}
//           <div className="flex items-center">
//             <input
//               name="faith_support"
//               type="checkbox"
//               checked={formData.faith_support}
//               onChange={handleChange}
//               className="mr-2"
//             />
//             <label className="text-gray-700">Would you like to explore faith / spiritual ways to help you better?</label>
//           </div>

//           {/* Feelings */}
//           <div className="flex items-center">
//             <input
//               name="showFeelings"
//               type="checkbox"
//               checked={formData.showFeelings}
//               onChange={handleChange}
//               className="mr-2"
//             />
//             <label className="text-gray-700">Would you like to tell us what you are currently going through?</label>
//           </div>
//           {formData.showFeelings && (
//             <div className="grid grid-cols-2 gap-2 border rounded p-3">
//               {feelingsOptions.map(f => (
//                 <label key={f} className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={formData.current_feelings.includes(f)}
//                     onChange={() => toggleList('current_feelings', f)}
//                     className="mr-2"
//                   />
//                   {f}
//                 </label>
//               ))}
//             </div>
//           )}

//           {/* Therapist */}
//           {type === 'therapist' && (
//             <div className="space-y-4">
//               <h2 className="text-xl font-semibold">Therapist Details</h2>
//               <div>
//                 <label className="block text-gray-700">Specialisation Tags</label>
//                 <CreatableSelect
//                   isMulti
//                   name="specialization_tags"
//                   options={SPECIALIZATIONS}
//                   onChange={selected => handleCreatable('specialization_tags', selected)}
//                   value={SPECIALIZATIONS.filter(o => formData.specialization_tags.includes(o.value))}
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700">Experience (Years)</label>
//                 <input
//                   name="experience_years"
//                   type="number"
//                   min="0"
//                   value={formData.experience_years}
//                   onChange={handleChange}
//                   className="w-full border rounded px-3 py-2"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700">License Number</label>
//                 <input
//                   name="license_number"
//                   value={formData.license_number}
//                   onChange={handleChange}
//                   className="w-full border rounded px-3 py-2"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700">Languages Spoken</label>
//                 <CreatableSelect
//                   isMulti
//                   name="languages_spoken"
//                   options={LANGUAGES}
//                   onChange={selected => handleCreatable('languages_spoken', selected)}
//                   value={LANGUAGES.filter(o => formData.languages_spoken.includes(o.value))}
//                 />
//               </div>
              
//             </div>
//           )}

//           {/* Admin */}
//           {type === 'admin' && (
//             <div>
//               <h2 className="text-xl font-semibold">Admin Permissions</h2>
//               <div className="grid grid-cols-2 gap-2">
//                 {PERMISSIONS.map(p => (
//                   <label key={p} className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={formData.permissions.includes(p)}
//                       onChange={() => toggleList('permissions', p)}
//                       className="mr-2"
//                     />
//                     {p.replace(/_/g,' ')}
//                   </label>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Bot */}
//           {type === 'bot' && (
//             <div>
//               <h2 className="text-xl font-semibold">Bot Settings</h2>
//               <label className="block text-gray-700">Bot Type</label>
//               <select
//                 name="bot_type"
//                 value={formData.bot_type}
//                 onChange={handleChange}
//                 className="w-full border rounded px-3 py-2"
//               >
//                 <option value="">Select Bot Type</option>
//                 {BOT_TYPES.map(b => (
//                   <option key={b.value} value={b.value}>
//                     {b.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           <button
//             type="submit"
//             className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded"
//           >
//             Sign Up
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreatableSelect from 'react-select/creatable';

// NotificationPopup component
const NotificationPopup = ({ message, type, onClose }) => {
  const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
  const borderColor = type === "success" ? "border-green-400" : "border-red-400";
  const textColor = type === "success" ? "text-green-700" : "text-red-700";
  return (
    <div
      className={`${bgColor} ${borderColor} ${textColor} border px-4 py-3 rounded relative mb-4`}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
      <span
        onClick={onClose}
        className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer text-xl"
      >
        &times;
      </span>
    </div>
  );
};

// Dropdown options
const SPECIALIZATIONS = [
  { value: "Anxiety", label: "Anxiety" },
  { value: "Depression", label: "Depression" },
  { value: "Grief", label: "Grief" },
  { value: "Stress", label: "Stress" },
  { value: "Trauma", label: "Trauma" },
  { value: "Relationship", label: "Relationship" },
  { value: "Addiction", label: "Addiction" },
];
const LANGUAGES = [
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Mandarin", label: "Mandarin" },
  { value: "Hindi", label: "Hindi" },
];
const PERMISSIONS = ["ban_users", "remove_posts", "approve_therapists"];
const BOT_TYPES = [
  { value: "chatbot", label: "Chatbot" },
  { value: "moderation_bot", label: "Moderation Bot" },
  { value: "recommendation_ai", label: "Recommendation AI" },
];
const feelingsOptions = [
  "Anxiety", "Depression", "Denial", "Grief",
  "Stress", "Loneliness", "Anger", "Fear"
];

const Signup = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  // DOB pickers
  const [dobYear, setDobYear] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");

  const years = useMemo(() => {
    const curr = new Date().getFullYear() - 14;
    const min = curr - 86; // up to 100yr span
    const arr = [];
    for (let y=curr; y>=min; y--) arr.push(y);
    return arr;
  }, []);
  const months = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];
  const days = useMemo(() => {
    if (!dobYear||!dobMonth) return Array.from({length:31},(_,i)=>i+1);
    return Array.from(
      {length:new Date(dobYear, dobMonth, 0).getDate()},
      (_,i)=>i+1
    );
  }, [dobYear,dobMonth]);

  const [formData, setFormData] = useState({
    username:"", email:"", password:"", dob:"",
    gender:"", country:"", city:"", bio:"",
    faith_support:false, showFeelings:false, current_feelings:[],
    specialization_tags:[], experience_years:"",
    license_number:"", languages_spoken:[],
    session_duration:"", appointment_types:[],
    availability_preference:"weekly_schedule",
    permissions:[], bot_type:""
  });

  // Countries & cities
  useEffect(()=>{
    fetch("https://countriesnow.space/api/v0.1/countries/iso")
      .then(r=>r.json()).then(d=>d.data&&setCountries(d.data.map(c=>c.name).sort()));
  },[]);
  useEffect(()=>{
    if(!formData.country) return setCities([]);
    fetch("https://countriesnow.space/api/v0.1/countries/cities", {
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({country:formData.country})
    })
      .then(r=>r.json()).then(d=>Array.isArray(d.data)&&setCities(d.data.sort()));
  },[formData.country]);

  // Handlers
  const handleChange = e=>{
    const {name,type,checked,value} = e.target;
    setFormData(p=>({...p,[name]:type==="checkbox"?checked:value}));
  };
  const handleCreatable=(name,sel)=>{
    setFormData(p=>({...p,[name]:sel?sel.map(s=>s.value):[]}));
  };
  const toggleList=(field,item)=>{
    setFormData(p=>{
      const list=p[field]||[];
      return {...p,[field]:list.includes(item)?list.filter(i=>i!==item):[...list,item]};
    });
  };
  // Compose DOB
  useEffect(()=>{
    if(dobYear&&dobMonth&&dobDay){
      const mm=String(dobMonth).padStart(2,"0"),
            dd=String(dobDay).padStart(2,"0");
      setFormData(p=>({...p,dob:`${dobYear}-${mm}-${dd}`}));
    }
  },[dobYear,dobMonth,dobDay]);

  // Submit
  const handleSubmit=async e=>{
    e.preventDefault();
    if(!formData.dob){
      setNotification({message:"Please select your DOB",type:"error"});
      return;
    }
    const userData={...formData,role:type};
    let payload={userData};
    if(type==="therapist"){
      payload.roleData={
        specialization_tags:formData.specialization_tags,
        experience_years:Number(formData.experience_years),
        license_number:formData.license_number,
        languages_spoken:formData.languages_spoken,
        session_duration:Number(formData.session_duration),
        appointment_types:formData.appointment_types,
        availability_preference:formData.availability_preference
      };
    }
    else if(type==="admin"){
      payload.roleData={permissions:formData.permissions};
    }
    else if(type==="bot"){
      payload.roleData={bot_type:formData.bot_type};
    }
    try{
      const res=await fetch("https://empathaiv2-backend.onrender.com/auth/register",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
      });
      if(!res.ok){
        const err=await res.json();
        throw new Error(err.message);
      }
      setNotification({message:"Signup successful!",type:"success"});
      setTimeout(()=>navigate("/login"),2000);
    }catch(err){
      setNotification({message:err.message,type:"error"});
    }
  };

  // Auto-dismiss
  useEffect(()=>{
    if(!notification) return;
    const t=setTimeout(()=>setNotification(null),5000);
    return()=>clearTimeout(t);
  },[notification]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-md px-8 py-6">
        <h1 className="text-4xl font-bold text-emerald-600 text-center mb-4">Sign Up</h1>
        {notification && <NotificationPopup {...notification} onClose={()=>setNotification(null)}/>}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Username</label>
              <input
                name="username" value={formData.username}
                onChange={handleChange}
                required className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                name="email" type="email" value={formData.email}
                onChange={handleChange}
                required className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                name="password" type="password" value={formData.password}
                onChange={handleChange}
                required className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Gender</label>
              <select
                name="gender" value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Country</label>
              <select
                name="country" value={formData.country}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Country</option>
                {countries.map(c=> <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-700">City</label>
              <select
                name="city" value={formData.city}
                onChange={handleChange}
                disabled={!cities.length}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select City</option>
                {cities.map(c=> <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* DOB */}
          <div>
            <label className="block text-gray-700">Date of Birth</label>
            <div className="flex space-x-2 mt-1">
              <select
                value={dobYear} onChange={e=>setDobYear(e.target.value)}
                required className="w-1/3 border rounded px-3 py-2"
              >
                <option value="">Year</option>
                {years.map(y=> <option key={y} value={y}>{y}</option>)}
              </select>
              <select
                value={dobMonth} onChange={e=>setDobMonth(e.target.value)}
                required className="w-1/3 border rounded px-3 py-2"
              >
                <option value="">Month</option>
                {months.map((m,i)=> <option key={i} value={i+1}>{m}</option>)}
              </select>
              <select
                value={dobDay} onChange={e=>setDobDay(e.target.value)}
                required className="w-1/3 border rounded px-3 py-2"
              >
                <option value="">Day</option>
                {days.map(d=> <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-gray-700">
              Tell us a bit about yourself so that we can curate better content for you
            </label>
            <textarea
              name="bio" rows={3} value={formData.bio}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Faith & Feelings */}
          <div className="flex items-center">
            <input
              name="faith_support" type="checkbox"
              checked={formData.faith_support}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-700">
              Would you like to explore faith / spiritual ways to help you better?
            </label>
          </div>
          <div className="flex items-center">
            <input
              name="showFeelings" type="checkbox"
              checked={formData.showFeelings}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-700">
              Would you like to tell us what you are currently going through?
            </label>
          </div>
          {formData.showFeelings && (
            <div className="grid grid-cols-2 gap-2 border rounded p-3">
              {feelingsOptions.map(f=> (
                <label key={f} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.current_feelings.includes(f)}
                    onChange={()=>toggleList('current_feelings',f)}
                    className="mr-2"
                  />
                  {f}
                </label>
              ))}
            </div>
          )}

          {/* Role-specific */}
          {type==="therapist" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Therapist Details</h2>
              <div>
                <label className="block text-gray-700">Specialisation Tags</label>
                <CreatableSelect
                  isMulti
                  options={SPECIALIZATIONS}
                  onChange={sel=>handleCreatable('specialization_tags',sel)}
                  value={SPECIALIZATIONS.filter(o=>formData.specialization_tags.includes(o.value))}
                />
              </div>
              <div>
                <label className="block text-gray-700">Experience (Years)</label>
                <input
                  name="experience_years" type="number" min="0"
                  value={formData.experience_years}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700">License Number</label>
                <input
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700">Languages Spoken</label>
                <CreatableSelect
                  isMulti
                  options={LANGUAGES}
                  onChange={sel=>handleCreatable('languages_spoken',sel)}
                  value={LANGUAGES.filter(o=>formData.languages_spoken.includes(o.value))}
                />
              </div>
              <div>
                <label className="block text-gray-700">Session Duration (mins)</label>
                <input
                  name="session_duration" type="number" min="15"
                  value={formData.session_duration}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700">Appointment Types</label>
                <CreatableSelect
                  isMulti
                  options={[{value:'text',label:'text'},{value:'voice',label:'voice'},{value:'video',label:'video'}]}
                  onChange={sel=>handleCreatable('appointment_types',sel)}
                  value={[{value:'text',label:'text'},{value:'voice',label:'voice'},{value:'video',label:'video'}]
                    .filter(o=>formData.appointment_types.includes(o.value))}
                />
              </div>
              <div>
                <label className="block text-gray-700">Availability Preference</label>
                <select
                  name="availability_preference"
                  value={formData.availability_preference}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="weekly_schedule">Weekly Schedule</option>
                  <option value="custom_dates">Custom Dates</option>
                </select>
              </div>
            </div>
          )}

          {type==="admin" && (
            <div>
              <h2 className="text-xl font-semibold">Admin Permissions</h2>
              <div className="grid grid-cols-2 gap-2">
                {PERMISSIONS.map(p=>(
                  <label key={p} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(p)}
                      onChange={()=>toggleList('permissions',p)}
                      className="mr-2"
                    />
                    {p.replace(/_/g,' ')}
                  </label>
                ))}
              </div>
            </div>
          )}

          {type==="bot" && (
            <div>
              <h2 className="text-xl font-semibold">Bot Settings</h2>
              <label className="block text-gray-700">Bot Type</label>
              <select
                name="bot_type"
                value={formData.bot_type}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Bot Type</option>
                {BOT_TYPES.map(b=>(
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
