// import React from 'react';
// import Link from 'next/link'; // Use Next.js Link component instead of react-router-dom

// const ErrorPage: React.FC = () => {
//   return (
//     <>
//       <section className="relative z-10 pt-36 pb-16 md:pb-20 lg:pt-[180px] lg:pb-28">
//         <div className="container">
//           <div className="-mx-4 flex flex-wrap">
//             <div className="w-full px-4">
//               <div className="mx-auto max-w-[530px] text-center">
//                 <div className="mx-auto mb-9 text-center">
//                   <svg
//                     className="mx-auto w-full text-center"
//                     height="210"
//                     viewBox="0 0 474 210"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       opacity="0.5"
//                       d="M25 163.051H101.211V191H133.308V163.051H153V136.111H133.308V32H91.2871L25 136.577V163.051ZM101.831 136.111H58.8025V134.869L100.591 68.6445H101.831V136.111Z"
//                       stroke="url(#paint0_linear_116:1137)"
//                       strokeWidth="3"
//                     />
//                     <path
//                       opacity="0.5"
//                       d="M307 133.051H383.211V161H415.308V133.051H435V106.111H415.308V2H373.287L307 106.577V133.051ZM383.831 106.111H340.803V104.869L382.591 38.6445H383.831V106.111Z"
//                       stroke="url(#paint1_linear_116:1137)"
//                       strokeWidth="3"
//                     />
//                     <circle
//                       opacity="0.8"
//                       cx="227.5"
//                       cy="81.5"
//                       r="68.5"
//                       fill="#4A6CF7"
//                     />
//                     <mask
//                       id="mask0_116:1137"
//                       style={{ maskType: "alpha" }}
//                       maskUnits="userSpaceOnUse"
//                       x="159"
//                       y="13"
//                       width="137"
//                       height="137"
//                     >
//                       <circle
//                         opacity="0.8"
//                         cx="227.5"
//                         cy="81.5"
//                         r="68.5"
//                         fill="#4A6CF7"
//                       />
//                     </mask>
//                     <g mask="url(#mask0_116:1137)">
//                       <circle
//                         opacity="0.8"
//                         cx="227.5"
//                         cy="81.5"
//                         r="68.5"
//                         fill="url(#paint2_radial_116:1137)"
//                       />
//                       <g opacity="0.8" filter="url(#filter0_f_116:1137)">
//                         <circle
//                           cx="233.543"
//                           cy="49.2645"
//                           r="28.2059"
//                           fill="white"
//                         />
//                       </g>
//                     </g>
//                     <path
//                       d="M0 182H83.5V209H150.5V178H169.5V148.5C169.5 148.5 194 165 229.5 165C265 165 294 134.5 294 134.5V152H306.5H361V178H435V152H474"
//                       stroke="white"
//                       strokeOpacity="0.08"
//                       strokeWidth="2"
//                     />
//                     <defs>
//                       <filter
//                         id="filter0_f_116:1137"
//                         x="175.337"
//                         y="-8.94141"
//                         width="116.412"
//                         height="116.412"
//                         filterUnits="userSpaceOnUse"
//                         colorInterpolationFilters="sRGB"
//                       >
//                         <feFlood floodOpacity="0" result="BackgroundImageFix" />
//                         <feBlend
//                           mode="normal"
//                           in="SourceGraphic"
//                           in2="BackgroundImageFix"
//                           result="shape"
//                         />
//                         <feGaussianBlur
//                           stdDeviation="15"
//                           result="effect1_foregroundBlur_116:1137"
//                         />
//                       </filter>
//                       <linearGradient
//                         id="paint0_linear_116:1137"
//                         x1="25"
//                         y1="183"
//                         x2="126.155"
//                         y2="27.0837"
//                         gradientUnits="userSpaceOnUse"
//                       >
//                         <stop stopColor="#4A6CF7" stopOpacity="0" />
//                         <stop offset="1" stopColor="#4A6CF7" />
//                       </linearGradient>
//                       <linearGradient
//                         id="paint1_linear_116:1137"
//                         x1="307"
//                         y1="153"
//                         x2="408.155"
//                         y2="-2.91631"
//                         gradientUnits="userSpaceOnUse"
//                       >
//                         <stop stopColor="#4A6CF7" stopOpacity="0" />
//                         <stop offset="1" stopColor="#4A6CF7" />
//                       </linearGradient>
//                       <radialGradient
//                         id="paint2_radial_116:1137"
//                         cx="0"
//                         cy="0"
//                         r="1"
//                         gradientUnits="userSpaceOnUse"
//                         gradientTransform="translate(227.5 81.5) rotate(90) scale(73.5368)"
//                       >
//                         <stop stopOpacity="0.47" />
//                         <stop offset="1" stopOpacity="0" />
//                       </radialGradient>
//                     </defs>
//                   </svg>
//                 </div>
//                 <h3 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl">
//                   Sorry, the page can’t be found
//                 </h3>
//                 <p className="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
//                   The page you were looking for appears to have been moved,
//                   deleted or does not exist.
//                 </p>
//                 <Link
//                   href="/"
//                   className="shadow-signUp rounded-md bg-primary py-3 px-8 text-base font-bold text-white duration-300 hover:bg-white hover:text-primary md:px-9 lg:px-8 xl:px-9"
//                 >
//                   Back to Homepage
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="absolute left-0 bottom-0 z-[-1] hidden sm:block">
//           <svg
//             width="406"
//             height="286"
//             viewBox="0 0 406 286"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <g opacity="0.5">
//               <rect
//                 opacity="0.5"
//                 x="56.25"
//                 y="110.344"
//                 width="116.719"
//                 height="116.438"
//                 stroke="url(#paint0_linear_116:1140)"
//               />
//               <rect
//                 opacity="0.1"
//                 x="56.25"
//                 y="110.344"
//                 width="116.719"
//                 height="116.438"
//                 fill="url(#paint1_linear_116:1140)"
//               />
//               <path
//                 opacity="0.5"
//                 d="M172.688 110.344L229.219 51V167.601L172.688 226.781V110.344Z"
//                 stroke="url(#paint2_linear_116:1140)"
//               />
//               <path
//                 opacity="0.1"
//                 d="M172.688 110.344L229.219 51V167.601L172.688 226.781V110.344Z"
//                 fill="url(#paint3_linear_116:1140)"
//               />
//               <path
//                 opacity="0.5"
//                 d="M0 169.619L56.25 110.344V226.85L0 286.125V169.619Z"
//                 stroke="url(#paint4_linear_116:1140)"
//               />
//               <path
//                 opacity="0.1"
//                 d="M0 169.619L56.25 110.344V226.85L0 286.125V169.619Z"
//                 fill="url(#paint5_linear_116:1140)"
//               />
//               <rect
//                 opacity="0.5"
//                 x="228.938"
//                 y="51.2812"
//                 width="119.25"
//                 height="116.438"
//                 stroke="url(#paint6_linear_116:1140)"
//               />
//               <rect
//                 opacity="0.1"
//                 x="228.938"
//                 y="51.2812"
//                 width="119.25"
//                 height="116.438"
//                 fill="url(#paint7_linear_116:1140)"
//               />
//               <path
//                 opacity="0.5"
//                 d="M347.906 51.2812L405 2V110.113L347.906 167.719V51.2812Z"
//                 stroke="url(#paint8_linear_116:1140)"
//               />
//               <path
//                 opacity="0.1"
//                 d="M347.906 51.2812L405 2V110.113L347.906 167.719V51.2812Z"
//                 fill="url(#paint9_linear_116:1140)"
//               />
//               <path
//                 opacity="0.5"
//                 d="M117.188 225.156L173.719 165.812V283.146L117.188 342.5V225.156Z"
//                 stroke="url(#paint10_linear_116:1140)"
//               />
//               <path
//                 opacity="0.1"
//                 d="M117.188 225.156L173.719 165.812V283.146L117.188 342.5V225.156Z"
//                 fill="url(#paint11_linear_116:1140)"
//               />
//               <rect
//                 opacity="0.5"
//                 x="284.75"
//                 y="0.75"
//                 width="119.25"
//                 height="116.438"
//                 stroke="url(#paint12_linear_116:1140)"
//               />
//               <rect
//                 opacity="0.1"
//                 x="284.75"
//                 y="0.75"
//                 width="119.25"
//                 height="116.438"
//                 fill="url(#paint13_linear_116:1140)"
//               />
//             </g>
//             <defs>
//               <linearGradient
//                 id="paint0_linear_116:1140"
//                 x1="44.8125"
//                 y1="80.625"
//                 x2="161.438"
//                 y2="204.062"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="white" stopOpacity="0" />
//                 <stop offset="1" stopColor="white" />
//               </linearGradient>
//               <linearGradient
//                 id="paint1_linear_116:1140"
//                 x1="44.8125"
//                 y1="80.625"
//                 x2="161.438"
//                 y2="204.062"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="#4A6CF7" stopOpacity="0" />
//                 <stop offset="1" stopColor="#4A6CF7" />
//               </linearGradient>
//               <linearGradient
//                 id="paint2_linear_116:1140"
//                 x1="161.719"
//                 y1="21.25"
//                 x2="278.344"
//                 y2="144.688"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="white" stopOpacity="0" />
//                 <stop offset="1" stopColor="white" />
//               </linearGradient>
//               <linearGradient
//                 id="paint3_linear_116:1140"
//                 x1="161.719"
//                 y1="21.25"
//                 x2="278.344"
//                 y2="144.688"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="#4A6CF7" stopOpacity="0" />
//                 <stop offset="1" stopColor="#4A6CF7" />
//               </linearGradient>
//               <linearGradient
//                 id="paint4_linear_116:1140"
//                 x1="0"
//                 y1="286.125"
//                 x2="83.5"
//                 y2="178"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="white" stopOpacity="0" />
//                 <stop offset="1" stopColor="white" />
//               </linearGradient>
//               <linearGradient
//                 id="paint5_linear_116:1140"
//                 x1="0"
//                 y1="286.125"
//                 x2="83.5"
//                 y2="178"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="#4A6CF7" stopOpacity="0" />
//                 <stop offset="1" stopColor="#4A6CF7" />
//               </linearGradient>
//               <linearGradient
//                 id="paint6_linear_116:1140"
//                 x1="217.5"
//                 y1="21.5312"
//                 x2="334.125"
//                 y2="144.969"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="white" stopOpacity="0" />
//                 <stop offset="1" stopColor="white" />
//               </linearGradient>
//               <linearGradient
//                 id="paint7_linear_116:1140"
//                 x1="217.5"
//                 y1="21.5312"
//                 x2="334.125"
//                 y2="144.969"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="#4A6CF7" stopOpacity="0" />
//                 <stop offset="1" stopColor="#4A6CF7" />
//               </linearGradient>
//               <linearGradient
//                 id="paint8_linear_116:1140"
//                 x1="336.469"
//                 y1="-28.4688"
//                 x2="453.094"
//                 y2="94.9687"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="white" stopOpacity="0" />
//                 <stop offset="1" stopColor="white" />
//               </linearGradient>
//               <linearGradient
//                 id="paint9_linear_116:1140"
//                 x1="336.469"
//                 y1="-28.4688"
//                 x2="453.094"
//                 y2="94.9687"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="#4A6CF7" stopOpacity="0" />
//                 <stop offset="1" stopColor="#4A6CF7" />
//               </linearGradient>
//               <linearGradient
//                 id="paint10_linear_116:1140"
//                 x1="105.75"
//                 y1="195.438"
//                 x2="222.375"
//                 y2="318.875"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="white" stopOpacity="0" />
//                 <stop offset="1" stopColor="white" />
//               </linearGradient>
//               <linearGradient
//                 id="paint11_linear_116:1140"
//                 x1="105.75"
//                 y1="195.438"
//                 x2="222.375"
//                 y2="318.875"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="#4A6CF7" stopOpacity="0" />
//                 <stop offset="1" stopColor="#4A6CF7" />
//               </linearGradient>
//               <linearGradient
//                 id="paint12_linear_116:1140"
//                 x1="273.312"
//                 y1="-28.9688"
//                 x2="389.938"
//                 y2="94.4687"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="white" stopOpacity="0" />
//                 <stop offset="1" stopColor="white" />
//               </linearGradient>
//               <linearGradient
//                 id="paint13_linear_116:1140"
//                 x1="273.312"
//                 y1="-28.9688"
//                 x2="389.938"
//                 y2="94.4687"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="#4A6CF7" stopOpacity="0" />
//                 <stop offset="1" stopColor="#4A6CF7" />
//               </linearGradient>
//             </defs>
//           </svg>
//         </div>
//       </section>
//     </>
//   );
// };

// export default ErrorPage;
