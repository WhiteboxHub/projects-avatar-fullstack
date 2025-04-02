
// import React, { useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import logo from '../../public/images/ip_logo1.jpg';
// import { HiChevronDown, HiChevronRight } from 'react-icons/hi';
// import { useAuth } from '../../components/AuthContext';

// interface MenuItem {
//   name: string;
//   href: string;
//   subMenu?: MenuItem[];
// }

// const menuItems: MenuItem[] = [
//   {
//     name: 'Recruiting',
//     href: '',
//     subMenu: [
//       { name: 'Leads', href: '/leads' },
//       { name: 'Access', href: '/access' }
//     ]
//   },
//   {
//     name: 'Training',
//     href: '',
//     subMenu: [
//       { name: 'Batch', href: '/batch' },
//       { name: 'Candidates', href: '/candidate' },
//     ],
//   },
//   {
//     name: 'Marketing',
//     href: '',
//     subMenu: [  
//       { name: 'Employees', href: '/employee' },
//       { name: 'Candidates Status', href: '/candidate status ' },
//       { name: 'Search', href: '/search' },
//     ]
//   },
//   {
//     name: 'HR',
//     href: '',
//     subMenu: [
//       {
//         name: 'Time',
//         href: '/hr/time',
//         subMenu: [
//           { name: 'PO', href: '/hr/time/po' },
//           { name: 'MM PO', href: '/hr/time/mm-po' }
//         ]
//       },
//       {
//         name: 'Invoice',
//         href: '/hr/invoice',
//         subMenu: [
//           { name: 'Overdue', href: '/hr/invoice/overdue' },
//           { name: 'By PO', href: '/hr/invoice/by-po' },
//           { name: 'By Month', href: '/hr/invoice/by-month' }
//         ]
//       },
//       { name: 'Client', href: '/hr/client' },
//       { name: 'Vendor', href: '/hr/vendor' },
//       { name: 'Placement', href: '/hr/placement' }
//     ]
//   },
// ];

// // const DropdownMenu: React.FC<{ item: MenuItem; level: number; isMobile?: boolean }> = ({
// //   item,
// //   level,
// //   isMobile = false,
// // }) => {
// //   const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

// //   return (
// //     <li className={`relative ${isMobile ? '' : 'group'} list-none p-0 m-0`}>
// //       <div
// //         className={`flex items-center justify-between px-4 py-2 text-white cursor-pointer ${
// //           isMobile ? 'w-full' : 'hover:bg-indigo-800 transition-colors duration-300'
// //         }`}
// //         onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
// //       >
// //         <Link href={item.href || '#'} className="flex items-center w-full">
// //           {item.name}
// //           {item.subMenu && (
// //             <HiChevronDown className={`ml-1 w-4 h-4 ${isMobile ? '' : 'group-hover:rotate-180'} transition-transform`} />
// //           )}
// //         </Link>
// //       </div>
// //       {item.subMenu && (
// //         <ul
// //           className={`${
// //             isMobile
// //               ? `flex flex-col pl-6 ${isSubMenuOpen ? 'max-h-screen' : 'max-h-0'} overflow-hidden`
// //               : `absolute bg-indigo-700 rounded-md shadow-lg w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out`
// //           }`}
// //         >
// //           {item.subMenu.map((subItem) => (
// //             <DropdownMenu key={subItem.name} item={subItem} level={level + 1} isMobile={isMobile} />
// //           ))}
// //         </ul>
// //       )}
// //     </li>
// //   );
// // };



// const DropdownMenu: React.FC<{ item: MenuItem; level: number; isMobile?: boolean }> = ({
//   item,
//   level,
//   isMobile = false,
// }) => {
//   const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

//   return (
//     <li className={`relative ${isMobile ? '' : 'group'} list-none p-0 m-0`}>
//       <div
//         className={`flex items-center justify-between px-4 py-2 text-white cursor-pointer ${
//           isMobile ? 'w-full' : 'hover:bg-indigo-800 transition-colors duration-300'
//         }`}
//         onClick={() => isMobile && setIsSubMenuOpen(!isSubMenuOpen)}
//       >
//         <Link href={item.href || '#'} className="flex items-center w-full">
//           {item.name}
//           {item.subMenu && (
//             <HiChevronDown
//               className={`ml-1 w-4 h-4 ${isMobile ? '' : 'group-hover:rotate-180'} transition-transform`}
//             />
//           )}
//         </Link>
//       </div>
//       {item.subMenu && (
//         <ul
//           className={`${
//             isMobile
//               ? `flex flex-col pl-6 ${isSubMenuOpen ? 'max-h-screen' : 'max-h-0'} overflow-hidden`
//               : `absolute bg-indigo-700 rounded-md shadow-lg w-48 transition-all duration-300 ease-in-out ${
//                   level === 1 ? 'left-full top-0 ml-2' : 'top-full left-0'
//                 } opacity-0 invisible group-hover:opacity-100 group-hover:visible`
//           }`}
//         >
//           {item.subMenu.map((subItem) => (
//             <DropdownMenu key={subItem.name} item={subItem} level={level + 1} isMobile={isMobile} />
//           ))}
//         </ul>
//       )}
//     </li>
//   );
// };

// const Header: React.FC = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const { logout } = useAuth();

//   return (
//     <header className="bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 text-white py-4 shadow-lg fixed top-0 left-0 right-0 z-50">
//       <nav className="container mx-auto px-4">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center">
//             <div className="bg-white p-1 rounded-full shadow-md">
//               <Image src={logo} alt="Logo" width={150} height={150} className="rounded-full" />
//             </div>
//           </div>
//           <div className="hidden lg:flex items-center space-x-6">
//             {menuItems.map((item) => (
//               <DropdownMenu key={item.name} item={item} level={0} />
//             ))}
//           </div>
//           <div className="hidden lg:block">
//             <Link href="/login" className="text-lg font-semibold hover:text-red-300 transition duration-300" onClick={logout}>
//               Logout
//             </Link>
//           </div>
//           <button
//             className="lg:hidden text-white focus:outline-none"
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             aria-label="Toggle menu"
//           >
//             <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
//               {isMobileMenuOpen ? (
//                 <path
//                   fillRule="evenodd"
//                   d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
//                 />
//               ) : (
//                 <path
//                   fillRule="evenodd"
//                   d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2z"
//                 />
//               )}
//             </svg>
//           </button>
//         </div>
//         <div
//           className={`lg:hidden mt-4 ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'} overflow-hidden transition-all duration-300 ease-in-out`}
//         >
//           <ul className="flex flex-col space-y-2 list-none">
//             {menuItems.map((item) => (
//               <DropdownMenu key={item.name} item={item} level={0} isMobile />
//             ))}
//             <li>
//               <Link href="/login" className="block py-2 text-lg font-semibold hover:text-red-300 transition duration-300" onClick={logout}>
//                 Logout
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;
// **********---------------**************



// import React, { useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import logo from '../../public/images/ip_logo1.jpg';
// import { HiChevronDown } from 'react-icons/hi';
// import { useAuth } from '../../components/AuthContext';

// interface MenuItem {
//   name: string;
//   href: string;
//   subMenu?: MenuItem[];
// }

// const menuItems: MenuItem[] = [
//     {
//       name: 'Recruiting',
//       href: '',
//       subMenu: [
//         { name: 'Leads', href: '/leads' },
//         { name: 'Access', href: '/access' }
//       ]
//     },
//     {
//       name: 'Training',
//       href: '',
//       subMenu: [
//         { name: 'Batch', href: '/batch' },
//         { name: 'Candidates', href: '/candidate' },
//       ],
//     },
//     {
//       name: 'Marketing',
//       href: '',
//       subMenu: [  
//         { name: 'Employees', href: '/employee' },
       
//         { name: 'Candidates Status', href: '/candidateStatus' ,
//           subMenu:[
//             { name: 'List', href: '/candidateMarketing'},
//             { name: 'All ', href: '/marketingCandidates'},
//           ]
//         },
//         { name: 'Placement', href: '/placement' },
//         { name: 'Search', href: '/candidateSearch' },
//       ]
//     },
//     {
//       name: 'HR',
//       href: '',
//       subMenu: [
//         {
//            name: 'Po', href: '/Po' 
//         },
//         {
//           name: 'Invoice',
//           href: '',
//           subMenu: [
//             { name: 'Overdue', href: '/overdue' },
//             { name: 'By PO', href: '/by-po' },
//             { name: 'By Month', href: '/by-month' }
//           ]
//         },
//         { name: 'Client', href: '' ,
//           subMenu: [
//             { name: 'List', href: '/client' },
//             { name: 'Search', href: '/client_search' },
//             { name: 'Recruiters', href: '',
//               subMenu: [
//                 { name: 'By Client', href: '/byclient' },
//                 { name: 'By palcement', href: '/byplacement' },
//                 { name: 'All list', href: '/all_list_client' },
//                 { name: 'Detailed', href: '/detailedclient' }
//               ]
//              }
//           ]
//         },
//         { name: 'Vendor', href: '',
//           subMenu: [
//             { name: 'List', href: '/vendor' },
//             { name: 'Search', href: '/vendor_search' },
//             { name: 'URLs', href: '/urls' },
//             { name: 'Recruiters', href: '',
//               subMenu: [
//                 { name: 'By Vendor', href: '/byvendor' },
//                 { name: 'By palcement', href: '/byplacementv' },
//                 { name: 'All list', href: '/all_list_vendor' },
//                 { name: 'Detailed', href: '/detailedvendor' }
//               ]
//              }
//           ]
//          },
      
//       ]
//     },
//   ];





// // ... existing code ...

// const DropdownMenu: React.FC<{ item: MenuItem; level: number; isMobile?: boolean }> = ({
//   item,
//   level,
//   isMobile = false,
// }) => {
//   const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

//   return (
//     <li 
//       className={`relative ${isMobile ? '' : 'group'} list-none p-0 m-0`}
//       onMouseEnter={() => !isMobile && setIsSubMenuOpen(true)} // Keep submenu open on mouse enter
//       onMouseLeave={() => !isMobile && setIsSubMenuOpen(false)} // Close submenu on mouse leave
//     >
//       <div
//         className={`flex items-center justify-between px-4 py-2 text-white cursor-pointer ${
//           isMobile ? 'w-full' : 'hover:bg-indigo-800 transition-colors duration-300'
//         }`}
//         onClick={() => isMobile && setIsSubMenuOpen(!isSubMenuOpen)}
//       >
//         <Link href={item.href || '#'} className="flex items-center w-full">
//           {item.name}
//           {item.subMenu && (
//             <HiChevronDown
//               className={`ml-1 w-4 h-4 ${
//                 // isMobile ? '' : 'group-hover:rotate-180'} 
//                 isMobile ? '' : level > 0 ? 'rotate-27' :  'group-hover:rotate-180'}
//                 transition-transform`}
//             />
//           )}
//         </Link>
//       </div>
//       {item.subMenu && isSubMenuOpen && (
//         <ul
//           className={`${
//             isMobile
//               ? `flex flex-col pl-6 ${isSubMenuOpen ? 'max-h-screen' : 'max-h-0'} overflow-hidden`
//               : `absolute bg-indigo-700 rounded-md shadow-lg w-48 transition-all duration-300 ease-in-out ${
//                   level === 1 ? 'left-full top-0 ml-0' : 'top-full left-0'
//                 }`
//           }`}
//         >
//           {item.subMenu.map((subItem) => (
//             <DropdownMenu key={subItem.name} item={subItem} level={level + 1} isMobile={isMobile} />
//           ))}
//         </ul>
//       )}
//     </li>
//   );
// };

// // ... existing code ...

// const Header: React.FC = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const { logout } = useAuth();

//   return (
//     <header className="bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 text-white py-4 shadow-lg fixed top-0 left-0 right-0 z-50">
//       <nav className="container mx-auto px-4">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center">
//             <div className="bg-white p-1 rounded-full shadow-md">
//               <Image src={logo} alt="Logo" width={150} height={150} className="rounded-full" />
//             </div>
//           </div>
//           <div className="hidden lg:flex items-center space-x-6">
//             {menuItems.map((item) => (
//               <DropdownMenu key={item.name} item={item} level={0} />
//             ))}
//           </div>
//           <div className="hidden lg:block">
//             <Link href="/login" className="text-lg font-semibold hover:text-red-300 transition duration-300" onClick={logout}>
//               Logout
//             </Link>
//           </div>
//           <button
//             className="lg:hidden text-white focus:outline-none"
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             aria-label="Toggle menu"
//           >
//             <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
//               {isMobileMenuOpen ? (
//                 <path
//                   fillRule="evenodd"
//                   d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
//                 />
//               ) : (
//                 <path
//                   fillRule="evenodd"
//                   d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2z"
//                 />
//               )}
//             </svg>
//           </button>
//         </div>
//         <div
//           className={`lg:hidden mt-4 ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'} overflow-hidden transition-all duration-300 ease-in-out`}
//         >
//           <ul className="flex flex-col space-y-2 list-none">
//             {menuItems.map((item) => (
//               <DropdownMenu key={item.name} item={item} level={0} isMobile />
//             ))}
//             <li>
//               <Link href="/login" className="block py-2 text-lg font-semibold hover:text-red-300 transition duration-300" onClick={logout}>
//                 Logout
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;




import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../public/images/ip_logo1.jpg';
import { HiChevronDown } from 'react-icons/hi';
import { useAuth } from '../AuthContext';

interface MenuItem {
  name: string;
  href: string;
  subMenu?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    name: 'Recruiting',
    href: '',
    subMenu: [
      { name: 'Leads', href: '/leads' },
      { name: 'Access', href: '/access' }
    ]
  },
  {
    name: 'Training',
    href: '',
    subMenu: [
      { name: 'Batch', href: '/batch' },
      { name: 'Candidates', href: '/candidate' },
    ],
  },
  {
    name: 'Marketing',
    href: '',
    subMenu: [  
   
      { name: 'Candidates Status', href: '/candidateStatus' ,
        subMenu:[
          { name: 'List', href: '/candidateMarketing'},
          { name: 'All ', href: '/marketingCandidates'},
        ]
      },
      { name: 'Placement', href: '/placement' },
      { name: 'Search', href: '/candidateSearch' },
    ]
  },
  {
    name: 'HR',
    href: '',
    subMenu: [
      { name: 'Po', href: '/Po' },
      { name: 'Employees', href: '/employee' },
      { name: 'Invoice',
        href: '',
        subMenu: [
          { name: 'Overdue', href: '/overdue' },
          { name: 'By PO', href: '/by-po' },
          { name: 'By Month', href: '/by-month' }
        ]
      },
      { name: 'Client', href: '' ,
        subMenu: [
          { name: 'List', href: '/client' },
          { name: 'Search', href: '/client_search' },
          { name: 'Recruiters', href: '',
            subMenu: [
              { name: 'By Client', href: '/byclient' },
              { name: 'By palcement', href: '/byplacement' },
              { name: 'All list', href: '/all_list_client' },
              { name: 'Detailed', href: '/detailedclient' }
            ]
          }
        ]
      },
      { name: 'Vendor', href: '',
        subMenu: [
          { name: 'List', href: '/vendor' },
          { name: 'Search', href: '/vendor_search' },
          { name: 'URLs', href: '/urls' },
          { name: 'Recruiters', href: '',
            subMenu: [
              { name: 'By Vendor', href: '/byvendor' },
              { name: 'By palcement', href: '/byplacementv' },
              { name: 'All list', href: '/all_list_vendor' },
              { name: 'Detailed', href: '/detailedvendor' }
            ]
          }
        ]
      },
    ]
  },
];

// DropdownMenu component
const DropdownMenu: React.FC<{ item: MenuItem; level: number; isMobile?: boolean }> = ({
  item,
  level,
  isMobile = false,
}) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  return (
    <li 
      className={`relative ${isMobile ? '' : 'group'} list-none p-0 m-0`}
      onMouseEnter={() => !isMobile && setIsSubMenuOpen(true)} 
      onMouseLeave={() => !isMobile && setIsSubMenuOpen(false)}
    >
      <div
        className={`flex items-center justify-between px-4 py-2 text-white cursor-pointer ${
          isMobile ? 'w-full' : 'hover:bg-indigo-800 transition-colors duration-300'
        }`}
        onClick={() => isMobile && setIsSubMenuOpen(!isSubMenuOpen)}
      >
        <Link href={item.href || '#'} className="flex items-center w-full">
          {item.name}
          {item.subMenu && (
            <HiChevronDown
              className={`ml-1 w-4 h-4 ${
                isMobile 
          ? '' 
          : item.name === "Recruiters" 
            ? 'rotate-270'// Arrow pointing down for "Recruiters"
              : ["Candidates Status", "Vendor", "Invoice", "Client"].includes(item.name)
                  ? '-rotate-90'  // Arrow pointing right for "Candidates Status"
                  : level > 0 
                  ? 'rotate-180' 
                  : 'group-hover:rotate-180'
              } transition-transform`}
            />
          )}
        </Link>
      </div>
      {item.subMenu && isSubMenuOpen && (
        <ul
          className={`${
            isMobile
              ? `flex flex-col pl-6 ${isSubMenuOpen ? 'max-h-screen' : 'max-h-0'} overflow-hidden`
              : `absolute bg-indigo-700 rounded-md shadow-lg w-48 transition-all duration-300 ease-in-out ${
                  level === 1 ? 'left-full top-0 ml-0' : 'top-full left-0'
                } z-10 overflow-visible`
          }`}
        >
          {item.subMenu.map((subItem) => (
            <DropdownMenu key={subItem.name} item={subItem} level={level + 1} isMobile={isMobile} />
          ))}
        </ul>
      )}
    </li>
  );
};

// Header component
const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();

  return (
    // <header className="bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 text-white py-4 shadow-lg fixed top-0 left-0 right-0 z-50">
    <header className={`bg-gradient-to-r from-blue-700 via-indigo-800 to-blue-900 text-white py-4 shadow-lg transition-all duration-300 ${isMobileMenuOpen ? 'h-auto' : 'min-h-24 h-24'}`}>
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white p-1 rounded-full shadow-md">
              <Image src={logo} alt="Logo" width={150} height={150} className="rounded-full" />
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-6">
            {menuItems.map((item) => (
              <DropdownMenu key={item.name} item={item} level={0} />
            ))}
          </div>
          <div className="hidden lg:block">
            <Link href="/login" className="text-lg font-semibold hover:text-red-300 transition duration-300" onClick={logout}>
              Logout
            </Link>
          </div>
          <button
            className="lg:hidden text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path
                  fillRule="evenodd"
                  d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2z"
                />
              )}
            </svg>
          </button>
        </div>
        <div
          className={`lg:hidden mt-4 ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'} overflow-hidden transition-all duration-300 ease-in-out`}
        >
          <ul className="flex flex-col space-y-2 list-none">
            {menuItems.map((item) => (
              <DropdownMenu key={item.name} item={item} level={0} isMobile />
            ))}
            <li>
              <Link href="/login" className="block py-2 text-lg font-semibold hover:text-red-300 transition duration-300" onClick={logout}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
