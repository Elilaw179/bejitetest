// import React from "react";
// import NewsFeedHeader from "../../components/NewsFeedHeader";
// import { FaArrowLeft, FaHome } from "react-icons/fa";

// const Recruitment = () => {
//   return (
//     <div >
//       <NewsFeedHeader />
//       <div className=" bg-[#F5F5F5] p-5 border-b-2 border-[#16730F] grid grid-cols-[1fr_3fr_1fr] mt-2 w-[90%] m-auto">
       
//         <div className="bg-[#16730F] rounded-2xl">
//           <div className=" p-7 space-y-2">
//             <FaArrowLeft className="text-[#1A3E32]"/>
//             <h1 className=" text-[20px] text-[#1A3E32]">Dashboard</h1>
//           </div>
          
//           <div className="max-w-48 m-auto  space-y-4  cursor-pointer ">
//             <div className="flex space-x-3 items-center ">
//               <FaHome className="text-[#F5F5F5]"/>
//               <p className="text-[#F5F5F5]">News Feed</p>
//             </div>
//             <div className="flex space-x-3 items-center ">
//               <img src="/assets/images/repeate-one.svg" alt="" />
//               <p className="text-[#F5F5F5]" >Connections</p>
//             </div>
//             <div className="flex space-x-3 items-center ">
//               <img src="/assets/images/messages-2.svg" alt="" />
//               <p className="text-[#F5F5F5]">Chats</p>
//             </div>
//             <div className="flex space-x-3 items-center ">
//               <img src="/assets/images/user-search.svg" alt="" />
//               <p className="text-[#F5F5F5]">Recruitment</p>
//             </div>
//             <div className="flex space-x-3 items-center ">
//             <img src="/assets/images/notification.svg" alt="" />
//               <p className="text-[#F5F5F5]">Recruitment</p>
//             </div>
//           </div>

//           <div className="bg-[#1A3E32] h-[370px] mt-50 rounded-b-2xl ]">
//            <div className= "mt-20 p-10 space-y-5  ">
//              <h1 className="text-[#FFFFFF] text-center">ADD PRO</h1>
//             <div className="w-[200px] h-[200px]  m-auto bg-[#FFFFFF]">
//            </div>

//             </div>
//           </div>
//         </div>
        
//         <div className="bg-[#F5F5F5]">  
//         <div className="w-full px-4 py-6" >
//         <div className="max-w-3xl  mx-auto rounded-2xl p-6">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
//             <img
//               src="assets/images/eli.jpg"
//               alt="profile"
//               className="rounded-full w-[60px] h-[60px]"
//             />

//             <div className="relative flex-1 w-full">

//               <textarea name="" id=""  placeholder="Share something" className="w-full p-3 pl-4 pr-20  text-sm border-2 border-[#16730F] focus:outline-none">
//               </textarea>
//               <div className="absolute top-3 right-4 flex items-center space-x-1">
//                 <img src="assets/images/box-2.svg" alt="icon" className="w-3 h-3" />
//                 <p className="text-[10px]">Drafts</p>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row justify-between items-center mt-5 gap-4 px-2">
//             <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
//               <div className="flex items-center gap-1">
//                 <img src="assets/images/gallery.svg" alt="Image" />
//                 <p className="text-[#1A3E32] text-sm">Image</p>
//               </div>
//               <div className="flex items-center gap-1">
//                 <img src="assets/images/video-square.png" alt="Video" />
//                 <p className="text-[#1A3E32] text-sm">Video</p>
//               </div>
//               <div className="flex items-center gap-1">
//                 <img src="/assets/images/Amount_Icon_UIA.svg" alt="Poll" />
//                 <p className="text-[#1A3E32] text-sm">Poll</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <img src="/assets/images/public-icon.svg" alt="Public" />
//               <select className="text-sm rounded-md border border-gray-300 px-2 py-1 text-[#1A3E32]">
//                 <option value="public">Public</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         <div className="max-w-3xl mx-auto my-8 border-t-2 border-[#16730F]" />

//         <div className="bg-white p-6 max-w-3xl mx-auto rounded-2xl space-y-6">
//           <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
//             <div className="flex items-center gap-4">
//               <img
//                 src="assets/images/eli.jpg"
//                 alt="profile"
//                 className="rounded-full w-[60px] h-[60px]"
//               />
//               <div>
//                 <p className="font-semibold text-lg text-[#16730F]">Osakwe Prisca</p>
//                 <p className="text-[#1A3E32] text-sm">Posted 12 minutes ago</p>
//               </div>
//             </div>
//             <img src="assets/images/more.svg" alt="more" className="w-4 h-4 self-end sm:self-auto" />
//           </div>
//           <div>
//             <p className="text-black">
//               🚀 HIRING JUST GOT SMARTER | WELCOME TO BEJITE.COM....
//             </p>
//             <p className="text-[#16730F80] text-sm mt-1 cursor-pointer">See more</p>
//           </div>

//           <div>
//             <img
//               src="assets/images/bejiteAdvert.png"
//               alt="Advert"
//               className="w-full rounded-xl"
//             />
//           </div>

//           <div className="flex flex-wrap justify-between items-center gap-4">
//             <div className="flex gap-6">
//               <div className="flex flex-col items-center">
//                 <img src="assets/images/gallery.svg" alt="Like" />
//                 <p className="text-[#1A3E32] text-sm">Like</p>
//               </div>
//               <div className="flex flex-col items-center">
//                 <img src="assets/images/video-square.png" alt="Comment" />
//                 <p className="text-[#1A3E32] text-sm">Comment</p>
//               </div>
//               <div className="flex flex-col items-center">
//                 <img src="/assets/images/Amount_Icon_UIA.svg" alt="Saved" />
//                 <p className="text-[#1A3E32] text-sm">Saved</p>
//               </div>
//             </div>

//             <div className="flex flex-col items-center">
//               <img src="/assets/images/public-icon.svg" alt="Share" />
//               <p className="text-sm">Share</p>
//             </div>
//           </div>
//         </div>
//       </div>

//         </div>


//      <div className="bg-blue-500">
          

//      <div className="bg-[#16730F] rounded-2xl ">
//           <div className=" p-5 space-y-2">
//             <FaArrowLeft className="text-[#1A3E32]"/>
//           </div>
//           <div className="flex flex-col items-center bg-amber-400  space-y-0">
//             <img className="w-[90%]" src="/assets/images/post-ads.png" alt="" />
//            <div className="border-[#16730F] border-5 rounded-full relative bottom-10">
//              <img className="w-16 h-16 rounded-full " src="assets/images/prisca.jpg" alt="" />
//            </div>
//              <div className="text-[#FFFFFF] text-center">
//             <p className="text-[20px]">Osakwe Prisca</p>
//             <p className=" text-[11px]">@nd_creations</p>
//            </div>
//           </div>
//            <div className="text-[#ffffff] mt-5">
//            <div className="flex justify-around bg-blue-500  m-auto">
//              <p>100</p>
//             <p>200</p>
//            </div>
//            <div className="flex justify-around">
//              <p>Post</p>
//             <p>Cononections</p>
//            </div>
//            </div>

//            <div className=" w-[150px] m-auto mt-4">
//             <button className="bg-[#6B8E23] p-3  text-[#FFFFFF] w-[150px]  rounded-3xl">View Profile</button>
//            </div>
//         </div>


//        <div className="bg-[#1A3E32] h-[500px] mt-3">


//           <div className=" max-w-60 m-auto space-y-5  p-8 bg-red-600 cursor-pointer ">
//             <div className="flex space-x-3 items-center ">
//               <img src="assets/images/setting.png" alt="df" />
//               <p className="text-[#F5F5F5]">Saved Posts</p>
//             </div>   
//             <div className="flex space-x-3 items-center ">
//               <img src="/assets/images/task-square.svg" alt="" />
//               <p className="text-[#F5F5F5]" >Activity Log</p>
//             </div>
//             <div className="flex space-x-3 items-center ">
//               <img src="/assets/images/award.svg" alt="" />
//               <p className="text-[#F5F5F5]">Badge Status</p>
//             </div>
            
//             <div className="flex space-x-3 items-center ">
//             <img src="/assets/images/setting-2.svg" alt="" />
//               <p className="text-[#F5F5F5]">Account Settings</p>
//             </div>
//           </div>


//           <div className="bg-purple-900  w-32 ml-10 mt-20 space-y-">
//             <div className="flex space-x-2">
//               <p>Help</p>
//               <img src="/assets/images/questiontag.svg" alt="" />
              
//             </div>
//             <p className="text-[#6B8E23] text-[16px] font-medium">Logout</p>
//           </div>
//        </div>
  

//         </div> 
//       </div>
//     </div>
//   );
// };

// export default Recruitment;
















import React from "react";
import NewsFeedHeader from "../../components/NewsFeedHeader";
import { FaArrowLeft, FaHome } from "react-icons/fa";

const Recruitment = () => {
  return (
    <div>
      <NewsFeedHeader />
      <div className="bg-[#F5F5F5] p-4 border-b-2 border-[#16730F] grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] gap-4 mt-2 w-full max-w-screen-xl mx-auto">
        
        {/* Left Sidebar */}
        <div className="hidden md:block bg-[#16730F] rounded-2xl">
          <div className="p-7 space-y-2">
            <FaArrowLeft className="text-[#1A3E32]" />
            <h1 className="text-[20px] text-[#1A3E32]">Dashboard</h1>
          </div>

          <div className="max-w-48 m-auto space-y-4 cursor-pointer">
            <div className="flex space-x-3 items-center">
              <FaHome className="text-[#F5F5F5]" />
              <p className="text-[#F5F5F5]">News Feed</p>
            </div>
            <div className="flex space-x-3 items-center">
              <img src="/assets/images/repeate-one.svg" alt="" />
              <p className="text-[#F5F5F5]">Connections</p>
            </div>
            <div className="flex space-x-3 items-center">
              <img src="/assets/images/messages-2.svg" alt="" />
              <p className="text-[#F5F5F5]">Chats</p>
            </div>
            <div className="flex space-x-3 items-center">
              <img src="/assets/images/user-search.svg" alt="" />
              <p className="text-[#F5F5F5]">Recruitment</p>
            </div>
            <div className="flex space-x-3 items-center">
              <img src="/assets/images/notification.svg" alt="" />
              <p className="text-[#F5F5F5]">Recruitment</p>
            </div>
          </div>

          <div className="bg-[#1A3E32] h-[560px] rounded-b-2xl mt-10">
            <div className="mt-10 p-10 space-y-5">
              <h1 className="text-[#FFFFFF] text-center">ADD PRO</h1>
              <div className="w-[200px] h-[200px] m-auto bg-[#FFFFFF]"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <div className="w-full px-4 py-6">
            <div className="max-w-3xl mx-auto rounded-2xl p-6 bg-[#FFFFFF]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <img
                  src="assets/images/eli.jpg"
                  alt="profile"
                  className="rounded-full w-[60px] h-[60px]"
                />
                <div className="relative flex-1 w-full">
                  <textarea
                    placeholder="Share something"
                    className="w-full p-3 pl-4 pr-20 text-sm border-2 border-[#16730F] focus:outline-none"
                  ></textarea>
                  <div className="absolute top-3 right-4 flex items-center space-x-1">
                    <img src="assets/images/box-2.svg" alt="icon" className="w-3 h-3" />
                    <p className="text-[10px]">Drafts</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center mt-5 gap-4 px-2">
                <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
                  <div className="flex items-center gap-1">
                    <img src="assets/images/gallery.svg" alt="Image" />
                    <p className="text-[#1A3E32] text-sm">Image</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <img src="assets/images/video-square.png" alt="Video" />
                    <p className="text-[#1A3E32] text-sm">Video</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <img src="/assets/images/Amount_Icon_UIA.svg" alt="Poll" />
                    <p className="text-[#1A3E32] text-sm">Poll</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <img src="/assets/images/public-icon.svg" alt="Public" />
                  <select className="text-sm rounded-md border border-gray-300 px-2 py-1 text-[#1A3E32]">
                    <option value="public">Public</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="max-w-3xl mx-auto my-8 border-t-2 border-[#16730F]" />

            <div className="bg-white p-6 max-w-3xl mx-auto rounded-2xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
                <div className="flex items-center gap-4">
                  <img
                    src="assets/images/eli.jpg"
                    alt="profile"
                    className="rounded-full w-[60px] h-[60px]"
                  />
                  <div>
                    <p className="font-semibold text-lg text-[#16730F]">Osakwe Prisca</p>
                    <p className="text-[#1A3E32] text-sm">Posted 12 minutes ago</p>
                  </div>
                </div>
                <img src="assets/images/more.svg" alt="more" className="w-4 h-4 self-end sm:self-auto" />
              </div>

              <div>
                <p className="text-black">🚀 HIRING JUST GOT SMARTER | WELCOME TO BEJITE.COM....</p>
                <p className="text-[#16730F80] text-sm mt-1 cursor-pointer">See more</p>
              </div>

              <div>
                <img
                  src="assets/images/bejiteAdvert.png"
                  alt="Advert"
                  className="w-full rounded-xl"
                />
              </div>

              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <img src="assets/images/gallery.svg" alt="Like" />
                    <p className="text-[#1A3E32] text-sm">Like</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <img src="assets/images/video-square.png" alt="Comment" />
                    <p className="text-[#1A3E32] text-sm">Comment</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <img src="/assets/images/Amount_Icon_UIA.svg" alt="Saved" />
                    <p className="text-[#1A3E32] text-sm">Saved</p>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <img src="/assets/images/public-icon.svg" alt="Share" />
                  <p className="text-sm">Share</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden md:block bg-[#1A3E32]">
          <div className="bg-[#16730F] rounded-2xl ">
            <div className="p-5 space-y-2">
              <FaArrowLeft className="text-[#1A3E32]" />
            </div>
            <div className="flex flex-col items-center  space-y-0">
              <img className="w-[90%]" src="/assets/images/post-ads.png" alt="" />
              <div className="border-[#16730F] border-5 rounded-full relative bottom-10">
                <img className="w-16 h-16 rounded-full" src="assets/images/prisca.jpg" alt="" />
              </div>
              <div className="text-[#FFFFFF] text-center">
                <p className="text-[20px]">Osakwe Prisca</p>
                <p className="text-[11px]">@nd_creations</p>
              </div>
            </div>
            <div className="text-[#ffffff] mt-5">
              <div className="flex justify-around  m-auto">
                <p>100</p>
                <p>200</p>
              </div>
              <div className="flex justify-around">
                <p>Post</p>
                <p>Connections</p>
              </div>
            </div>

            <div className="w-[150px] m-auto mt-4">
              <button className="bg-[#6B8E23] p-3 text-[#FFFFFF] w-full rounded-3xl">View Profile</button>
            </div>
          </div>

          <div className="bg-[#1A3E32] h-[500px] mt-3">
            <div className="max-w-60 m-auto space-y-5 p-8  cursor-pointer">
              <div className="flex space-x-3 items-center">
                <img src="assets/images/setting.png" alt="df" />
                <p className="text-[#F5F5F5]">Saved Posts</p>
              </div>
              <div className="flex space-x-3 items-center">
                <img src="/assets/images/task-square.svg" alt="" />
                <p className="text-[#F5F5F5]">Activity Log</p>
              </div>
              <div className="flex space-x-3 items-center">
                <img src="/assets/images/award.svg" alt="" />
                <p className="text-[#F5F5F5]">Badge Status</p>
              </div>
              <div className="flex space-x-3 items-center">
                <img src="/assets/images/setting-2.svg" alt="" />
                <p className="text-[#F5F5F5]">Account Settings</p>
              </div>
            </div>

            <div className=" w-32 ml-10 mt-20">
              <div className="flex space-x-2">
                <p>Help</p>
                <img src="/assets/images/questiontag.svg" alt="" />
              </div>
              <p className="text-[#6B8E23] text-[16px] font-medium">Logout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recruitment;
