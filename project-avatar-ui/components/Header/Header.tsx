import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import logo from "../../public/images/ip_logo1.jpg";
import { useRouter } from "next/navigation";
import { HiChevronDown } from "react-icons/hi";
import { useAuth } from "../AuthContext";

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
   
      { name: 'Candidates Status', href: '' ,
        subMenu:[
          { name: 'List', href: '/candidateMarketing'},
          { name: 'All', href: '/marketingCandidates'},
        ]
      },
      { name: 'Placement', href: '/placement' },
      { name: 'Mkt-Placement', href: '/mkt-placement' },
      { name: 'Search', href: '/candidateSearch' },
    ]
  },
  {
    name: 'HR',
    href: '',
    subMenu: [
      { name: 'PO', href: '/Po' },
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
              { name: 'By placement', href: '/byplacement' },
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
              { name: 'By Vendor', href: '/vendorbyvendor' },
              { name: 'By placement', href: '/vendorbyplacement' },
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
  const menuRef = useRef<HTMLLIElement>(null);
  const hasSubMenu = item.subMenu && item.subMenu.length > 0;
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsSubMenuOpen(false);
      }
    };

    if (isSubMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSubMenuOpen]);

  const handleClick = (e: React.MouseEvent) => {
    if (hasSubMenu) {
      e.preventDefault();
      setIsSubMenuOpen(!isSubMenuOpen);
    } else if (item.href) {
      e.preventDefault();
      router.push(item.href);
    }
  };

  // Determine the position of the submenu
  const getSubmenuPosition = () => {
    if (isMobile) return '';
    
    if (level === 0) {
      return 'top-full left-0';
    } else {
      // Check if this is a deep submenu that might go off-screen to the right
      return 'left-full top-0';
    }
  };

  return (
    <li 
      ref={menuRef}
      className={`relative ${isMobile ? '' : 'group'} list-none p-0 m-0`}
      onMouseEnter={() => !isMobile && hasSubMenu && setIsSubMenuOpen(true)} 
      onMouseLeave={() => !isMobile && setIsSubMenuOpen(false)}
    >
      <div
        className={`flex items-center justify-between px-4 py-2 text-white cursor-pointer rounded-md ${
          isMobile ? 'w-full' : 'hover:bg-indigo-800 transition-colors duration-300'
        } ${isSubMenuOpen ? 'bg-indigo-800' : ''}`}
        onClick={handleClick}
      >
        {hasSubMenu ? (
          <span className="flex items-center w-full">
            {item.name}
            <HiChevronDown
              className={`ml-1 w-4 h-4 transition-transform duration-300 ${
                isSubMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </span>
        ) : (
          <span className="flex items-center w-full">
            {item.name}
          </span>
        )}
      </div>
      
      {hasSubMenu && item.subMenu && (
        <ul
          className={`${
            isMobile
              ? `flex flex-col pl-6 transition-all duration-300 ease-in-out ${
                  isSubMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`
              : `absolute bg-indigo-700 rounded-md shadow-lg w-48 transition-all duration-300 ease-in-out ${
                  getSubmenuPosition()
                } z-50 ${
                  isSubMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`
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
  const [scrolled, setScrolled] = useState(false);
  const { logout } = useAuth();
  const headerRef = useRef<HTMLElement>(null);
  const router = useRouter();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    router.push('/login');
  };

  return (
    <header 
      ref={headerRef}
      className={`bg-gradient-to-r from-blue-700 via-indigo-800 to-blue-900 text-white py-4 shadow-lg transition-all duration-300 sticky top-0 z-50 ${
        scrolled ? 'py-2' : 'py-4'
      } ${isMobileMenuOpen ? 'h-auto' : ''}`}
    >
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white p-1 rounded-full shadow-md">
              <Image src={logo} alt="Logo" width={80} height={80} className="rounded-full" />
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            {menuItems.map((item) => (
              <DropdownMenu key={item.name} item={item} level={0} />
            ))}
          </div>
          <div className="hidden lg:block">
            <button className="text-lg font-semibold hover:text-red-300 transition duration-300" onClick={handleLogout}>
              Logout
            </button>
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
          className={`lg:hidden mt-4 transition-all duration-500 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <ul className="flex flex-col space-y-2 list-none max-h-[70vh] overflow-y-auto">
            {menuItems.map((item) => (
              <DropdownMenu key={item.name} item={item} level={0} isMobile />
            ))}
            <li>
              <button className="block px-4 py-2 text-lg font-semibold hover:text-red-300 transition duration-300 w-full text-left" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
